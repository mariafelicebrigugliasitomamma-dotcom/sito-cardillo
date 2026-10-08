import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifySession } from "@/lib/auth";
import { UNDER_CONSTRUCTION_PATH, isUnderConstruction } from "@/lib/maintenance";

const PREVIEW_COOKIE = "site_preview";

function isAdminPath(pathname: string) {
  return pathname === "/admin" || pathname.startsWith("/admin/");
}

export default async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (!isAdminPath(pathname)) {
    // Pagine pubbliche: con SITE_UNDER_CONSTRUCTION attivo mostra la pagina di cortesia.
    // Chi ha una sessione admin valida può comunque navigare il sito per controllarlo.
    if (!isUnderConstruction() || pathname === UNDER_CONSTRUCTION_PATH) {
      return NextResponse.next();
    }
    // Anteprima per il cliente: ?test=1 imposta un cookie di sessione che sblocca il sito,
    // ?test=0 lo rimuove.
    const test = req.nextUrl.searchParams.get("test");
    if (test === "1") {
      const res = NextResponse.next();
      res.cookies.set(PREVIEW_COOKIE, "1", { path: "/", httpOnly: true, sameSite: "lax" });
      return res;
    }
    if (test === "0") {
      const url = req.nextUrl.clone();
      url.searchParams.delete("test");
      const res = NextResponse.redirect(url);
      res.cookies.delete(PREVIEW_COOKIE);
      return res;
    }
    if (req.cookies.get(PREVIEW_COOKIE)?.value === "1") {
      return NextResponse.next();
    }
    // Chi ha una sessione admin valida può comunque navigare il sito per controllarlo.
    if (await verifySession(req.cookies.get(SESSION_COOKIE)?.value)) {
      return NextResponse.next();
    }
    const url = req.nextUrl.clone();
    url.pathname = UNDER_CONSTRUCTION_PATH;
    url.search = "";
    const res = NextResponse.rewrite(url, { status: 503 });
    res.headers.set("Retry-After", "3600");
    res.headers.set("X-Robots-Tag", "noindex, nofollow");
    return res;
  }

  // La pagina di login è sempre accessibile
  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  const token = req.cookies.get(SESSION_COOKIE)?.value;
  const session = await verifySession(token);

  if (!session) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  // Tutto tranne API, asset di Next e file statici (con estensione).
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
