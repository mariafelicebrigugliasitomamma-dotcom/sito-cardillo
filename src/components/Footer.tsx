import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";
import type { Studio, Area, FooterUiContent } from "@/lib/types";

export default function Footer({
  studio,
  aree,
  ui,
  brandPrefix,
}: {
  studio: Studio;
  aree: Area[];
  ui: FooterUiContent;
  brandPrefix: string;
}) {
  return (
    <footer className="bg-navy text-white/90">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 md:grid-cols-4">
        <div className="md:col-span-1">
          <div className="font-serif text-2xl font-semibold leading-tight text-white">
            {brandPrefix}
            <span className="block text-gold-light">{studio.nomeBreve}</span>
          </div>
          <p className="mt-4 text-base leading-relaxed">{studio.sottoClaim}</p>
        </div>

        <div>
          <h3 className="mb-4 font-sans text-sm font-bold uppercase tracking-[0.16em] text-gold-light">
            {ui.areeHeading}
          </h3>
          <ul className="space-y-3 text-base">
            {aree.slice(0, 5).map((a) => (
              <li key={a.slug}>
                <Link
                  href="/servizi"
                  className="transition-colors hover:text-white"
                >
                  {a.titolo}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 font-sans text-sm font-bold uppercase tracking-[0.16em] text-gold-light">
            {ui.navigationHeading}
          </h3>
          <ul className="space-y-3 text-base">
            <li>
              <Link href="/studio" className="transition-colors hover:text-white">
                {ui.navStudio}
              </Link>
            </li>
            <li>
              <Link href="/professionisti" className="transition-colors hover:text-white">
                {ui.navTeam}
              </Link>
            </li>
            <li>
              <Link
                href="/contatti"
                className="transition-colors hover:text-white"
              >
                {ui.navContatti}
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 font-sans text-sm font-bold uppercase tracking-[0.16em] text-gold-light">
            {ui.hqHeading}
          </h3>
          <ul className="space-y-4 text-base">
            <li className="flex gap-2.5">
              <MapPin size={18} className="mt-0.5 shrink-0 text-gold-light" />
              <span>{studio.sedi[0]?.indirizzo}</span>
            </li>
            <li className="flex gap-2.5">
              <Phone size={18} className="shrink-0 text-gold-light" />
              <a
                href={`tel:${studio.contatti.telefono.replace(/\s/g, "")}`}
                className="transition-colors hover:text-white"
              >
                {studio.contatti.telefono}
              </a>
            </li>
            <li className="flex gap-2.5">
              <Mail size={18} className="shrink-0 text-gold-light" />
              <a
                href={`mailto:${studio.contatti.emailGenerale}`}
                className="transition-colors hover:text-white"
              >
                {studio.contatti.emailGenerale}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-5 py-6 text-xs text-white/70 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {studio.nome}. {ui.rightsReservedLabel} — {ui.vatLabel} {studio.legale.pIva}
          </p>
          <p>
            {studio.legale.ordine} ·{" "}
            <Link href="/informativa-privacy" className="hover:text-white">
              {ui.privacyLabel}
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
