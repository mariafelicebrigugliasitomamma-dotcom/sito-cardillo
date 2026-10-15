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
  const nav = [
    { href: "/studio", label: ui.navStudio },
    { href: "/professionisti", label: ui.navTeam },
    { href: "/contatti", label: ui.navContatti },
  ].filter((item) => item.label.trim());
  const servizi = aree.filter((a) => a.titolo.trim()).slice(0, 5);
  const { telefono, emailGenerale } = studio.contatti;
  const indirizzo = studio.sedi[0]?.indirizzo?.trim();
  const hasHq = Boolean(indirizzo || telefono.trim() || emailGenerale.trim());
  const pIva = studio.legale.pIva.trim();
  const ordine = studio.legale.ordine.trim();
  return (
    <footer className="bg-navy text-white/90">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 md:grid-cols-4">
        <div className="md:col-span-1">
          <div className="font-serif text-2xl font-semibold leading-tight text-white">
            {brandPrefix.trim() && <span className="block">{brandPrefix}</span>}
            <span className="block text-gold-light">{studio.nomeBreve}</span>
          </div>
          {studio.sottoClaim.trim() && (
            <p className="mt-4 text-base leading-relaxed">
              {studio.sottoClaim}
            </p>
          )}
        </div>

        {servizi.length > 0 && (
          <div>
            <FooterHeading>{ui.areeHeading}</FooterHeading>
            <ul className="space-y-3 text-base">
              {servizi.map((a) => (
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
        )}

        {nav.length > 0 && (
          <div>
            <FooterHeading>{ui.navigationHeading}</FooterHeading>
            <ul className="space-y-3 text-base">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="transition-colors hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {hasHq && (
          <div>
            <FooterHeading>{ui.hqHeading}</FooterHeading>
            <ul className="space-y-4 text-base">
              {indirizzo && (
                <li className="flex gap-2.5">
                  <MapPin
                    size={18}
                    className="mt-0.5 shrink-0 text-gold-light"
                  />
                  <span>{indirizzo}</span>
                </li>
              )}
              {telefono.trim() && (
                <li className="flex gap-2.5">
                  <Phone size={18} className="shrink-0 text-gold-light" />
                  <a
                    href={`tel:${studio.contatti.telefono.replace(/\s/g, "")}`}
                    className="transition-colors hover:text-white"
                  >
                    {studio.contatti.telefono}
                  </a>
                </li>
              )}
              {emailGenerale.trim() && (
                <li className="flex gap-2.5">
                  <Mail size={18} className="shrink-0 text-gold-light" />
                  <a
                    href={`mailto:${studio.contatti.emailGenerale}`}
                    className="transition-colors hover:text-white"
                  >
                    {studio.contatti.emailGenerale}
                  </a>
                </li>
              )}
            </ul>
          </div>
        )}
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-5 py-6 text-sm text-white/80 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()}{" "}
            {[studio.nome.trim(), ui.rightsReservedLabel.trim()]
              .filter(Boolean)
              .join(". ")}
            {pIva && (
              <> — {[ui.vatLabel.trim(), pIva].filter(Boolean).join(" ")}</>
            )}
          </p>
          {(ordine || ui.privacyLabel.trim()) && (
            <p>
              {ordine}
              {ordine && ui.privacyLabel.trim() && " · "}
              {ui.privacyLabel.trim() && (
                <Link href="/informativa-privacy" className="hover:text-white">
                  {ui.privacyLabel}
                </Link>
              )}
            </p>
          )}
        </div>
      </div>
    </footer>
  );
}

/** Titolo di colonna del footer, omesso se vuoto. */
function FooterHeading({ children }: { children: string }) {
  if (!children.trim()) return null;
  return (
    <h3 className="mb-4 font-sans text-sm font-bold uppercase tracking-[0.16em] text-gold-light">
      {children}
    </h3>
  );
}
