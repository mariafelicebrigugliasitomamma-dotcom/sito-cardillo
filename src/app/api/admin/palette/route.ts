import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { SESSION_COOKIE, verifySession } from "@/lib/auth";
import {
  PersistenceConfigError,
  savePalette,
  StaleRevisionError,
} from "@/lib/content";
import { GitHubStoreConflictError } from "@/lib/githubContentStore";
import type { SitePalette } from "@/lib/types";

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

  let body: { palette: SitePalette; idempotencyKey?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Dati non validi" }, { status: 400 });
  }

  if (!body.palette?.bgHex || !body.palette?.ctaHex) {
    return NextResponse.json({ error: "Palette non valida" }, { status: 400 });
  }

  try {
    const result = await savePalette({
      palette: body.palette,
      idempotencyKey: body.idempotencyKey ?? randomUUID(),
      updatedBy: user,
    });

    revalidatePath("/", "layout");

    return NextResponse.json({
      ok: true,
      revision: result.bundle.meta.revision,
      commitSha: result.commitSha,
    });
  } catch (err) {
    console.error("Salvataggio palette fallito:", err);

    if (err instanceof StaleRevisionError || err instanceof GitHubStoreConflictError) {
      return NextResponse.json({ error: (err as Error).message }, { status: 409 });
    }
    if (err instanceof PersistenceConfigError) {
      return NextResponse.json({ error: (err as Error).message }, { status: 500 });
    }

    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Errore salvataggio palette" },
      { status: 500 }
    );
  }
}
