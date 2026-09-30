import { NextResponse } from "next/server";
import { SESSION_COOKIE, checkCredentials, createSession } from "@/lib/auth";

export async function POST(req: Request) {
  let body: { username?: string; password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Richiesta non valida" }, { status: 400 });
  }

  const username = String(body.username ?? "");
  const password = String(body.password ?? "");

  if (!checkCredentials(username, password)) {
    return NextResponse.json(
      { error: "Credenziali non valide" },
      { status: 401 }
    );
  }

  const token = await createSession(username);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}
