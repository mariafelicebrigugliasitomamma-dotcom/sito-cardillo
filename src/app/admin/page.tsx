import Link from "next/link";
import { ExternalLink } from "lucide-react";
import AdminEditor from "@/components/admin/AdminEditor";
import LogoutButton from "@/components/admin/LogoutButton";
import { getBundle } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const bundle = await getBundle();

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-4 py-3">
          <div>
            <h1 className="font-serif text-lg font-semibold text-navy">
              Gestione contenuti
            </h1>
            <p className="text-xs text-slate-500">{bundle.content.it.studio.nome}</p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100"
            >
              <ExternalLink size={16} />
              Vedi sito
            </Link>
            <LogoutButton />
          </div>
        </div>
      </header>

      <div className="px-4 pt-4">
        <AdminEditor initialBundle={bundle} />
      </div>
    </>
  );
}
