import { timingSafeEqual } from "crypto";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

type VercelWebhookPayload = {
  id?: string;
  type?: string;
  payload?: {
    id?: string;
    readyState?: string;
    meta?: { githubCommitSha?: string; githubCommitRef?: string };
    url?: string;
    inspectorUrl?: string;
  };
};

function isAuthorized(req: Request): boolean {
  const configured = process.env.VERCEL_WEBHOOK_SECRET;
  if (!configured) return false;

  const isSameSecret = (candidate: string): boolean => {
    const a = Buffer.from(candidate);
    const b = Buffer.from(configured);
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  };

  const bearer = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (bearer) {
    return isSameSecret(bearer);
  }

  const headerSecret = req.headers.get("x-webhook-secret");
  if (headerSecret) {
    return isSameSecret(headerSecret);
  }

  return false;
}

export async function POST(req: Request) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Webhook non autorizzato" }, { status: 401 });
  }

  let body: VercelWebhookPayload;
  try {
    body = (await req.json()) as VercelWebhookPayload;
  } catch {
    return NextResponse.json({ error: "Payload non valido" }, { status: 400 });
  }

  const deploymentId = body.payload?.id || body.id;
  const state = body.payload?.readyState?.toUpperCase();

  return NextResponse.json({ ok: true, deploymentId, state });
}
