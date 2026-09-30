import { SignJWT, jwtVerify } from "jose";

export const SESSION_COOKIE = "ds_session";

function getSecret(): Uint8Array {
  const secret = process.env.SESSION_SECRET || "dev-secret-change-me";
  return new TextEncoder().encode(secret);
}

/** Crea un token di sessione firmato, valido 7 giorni. */
export async function createSession(username: string): Promise<string> {
  return new SignJWT({ u: username })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecret());
}

/** Verifica un token di sessione. Restituisce lo username oppure null. */
export async function verifySession(
  token: string | undefined
): Promise<string | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return typeof payload.u === "string" ? payload.u : null;
  } catch {
    return null;
  }
}

/** Verifica le credenziali rispetto alle variabili d'ambiente. */
export function checkCredentials(username: string, password: string): boolean {
  const u = process.env.ADMIN_USERNAME;
  const p = process.env.ADMIN_PASSWORD;
  if (!u || !p) return false;
  return username === u && password === p;
}
