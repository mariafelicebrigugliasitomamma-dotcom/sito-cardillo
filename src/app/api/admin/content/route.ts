import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { SESSION_COOKIE, verifySession } from "@/lib/auth";
import {
  PersistenceConfigError,
  saveContent,
  StaleRevisionError,
} from "@/lib/content";
import { GitHubStoreConflictError } from "@/lib/githubContentStore";
import type { SaveContentPayload, SiteContent } from "@/lib/types";

export const runtime = "nodejs";

async function currentUser(): Promise<string | null> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  return await verifySession(token);
}

export async function POST(req: Request) {
  const user = await currentUser();
  if (!user) {
    return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
  }

  let payload: SaveContentPayload | SiteContent;
  try {
    payload = (await req.json()) as SaveContentPayload | SiteContent;
  } catch {
    return NextResponse.json({ error: "Dati non validi" }, { status: 400 });
  }

  const normalized: SaveContentPayload =
    "content" in payload
      ? payload
      : {
          locale: "it",
          content: payload,
          idempotencyKey: randomUUID(),
        };

  const data = normalized.content;
  if (!data?.studio || !Array.isArray(data.aree) || !Array.isArray(data.team)) {
    return NextResponse.json(
      { error: "Struttura dei contenuti non valida" },
      { status: 400 }
    );
  }

  let result:
    | {
        bundle: Awaited<ReturnType<typeof saveContent>>["bundle"];
        snapshotPath: string;
        commitSha?: string;
      }
    | undefined;

  try {
    result = await saveContent({
      ...normalized,
      updatedBy: user,
    });
  } catch (err) {
    console.error("Salvataggio contenuti fallito:", err);

    if (err instanceof StaleRevisionError || err instanceof GitHubStoreConflictError) {
      return NextResponse.json({ error: err.message }, { status: 409 });
    }

    if (err instanceof PersistenceConfigError) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }

    const details = err instanceof Error ? err.message : undefined;

    return NextResponse.json(
      {
        error:
          "Impossibile salvare i contenuti. Verifica la configurazione GitHub del CMS.",
        ...(details ? { details } : {}),
      },
      { status: 500 }
    );
  }

  // Rigenera tutte le pagine pubbliche con i nuovi contenuti
  revalidatePath("/", "layout");

  return NextResponse.json({
    ok: true,
    revision: result?.bundle.meta.revision,
    commitSha: result?.commitSha,
    snapshotPath: result?.snapshotPath,
  });
}
