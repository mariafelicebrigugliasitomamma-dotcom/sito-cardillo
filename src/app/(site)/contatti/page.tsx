import type { Metadata } from "next";
import { MapPin, Phone, Mail, Clock, Building2 } from "lucide-react";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import { getContent } from "@/lib/content";

export async function generateMetadata(): Promise<Metadata> {
  const { ui } = await getContent();
  return {
    title: ui.seo.contactTitle,
    description: ui.seo.contactDescription,
    alternates: { canonical: "/contatti" },
  };
}

export default async function ContattiPage() {
  const { studio, ui } = await getContent();
  return (
    <>
      <PageHero
        eyebrow={ui.contactPage.heroEyebrow}
        title={ui.contactPage.heroTitle}
        description={ui.contactPage.heroDescription}
      />

      <section className="bg-white py-24">
        <div className="mx-auto grid max-w-6xl gap-12 px-5 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
          {/* Recapiti */}
          <Reveal>
            <p className="eyebrow text-gold">{ui.contactPage.detailsEyebrow}</p>
            <h2 className="mt-3 text-3xl font-semibold text-navy">
              {ui.contactPage.detailsTitle}
            </h2>
            <div className="rule-gold mt-5" />

            <ul className="mt-8 space-y-5">
              <li className="flex gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-cream text-gold">
                  <Phone size={20} />
                </span>
                <div>
                  <p className="text-sm font-medium text-muted">{ui.contactPage.phoneLabel}</p>
                  <a
                    href={`tel:${studio.contatti.telefono.replace(/\s/g, "")}`}
                    className="text-base font-semibold text-navy transition-colors hover:text-gold"
                  >
                    {studio.contatti.telefono}
                  </a>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-cream text-gold">
                  <Mail size={20} />
                </span>
                <div>
                  <p className="text-sm font-medium text-muted">{ui.contactPage.emailLabel}</p>
                  <a
                    href={`mailto:${studio.contatti.emailGenerale}`}
                    className="text-base font-semibold text-navy transition-colors hover:text-gold"
                  >
                    {studio.contatti.emailGenerale}
                  </a>
                  <p className="mt-1 text-sm text-muted">
                    {ui.contactPage.pecLabel}: {studio.contatti.pec}
                  </p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-cream text-gold">
                  <Clock size={20} />
                </span>
                <div>
                  <p className="text-sm font-medium text-muted">{ui.contactPage.hoursLabel}</p>
                  <p className="text-base font-semibold text-navy">
                    {studio.contatti.orari}
                  </p>
                </div>
              </li>
            </ul>

            {/* Sedi */}
            <div className="mt-10">
              <p className="eyebrow text-gold">{ui.contactPage.officesEyebrow}</p>
              <div className="mt-5 space-y-4">
                {studio.sedi.map((sede) => (
                  <div
                    key={sede.citta}
                    className="rounded-xl border border-gold/15 bg-cream/60 p-5"
                  >
                    <div className="flex items-center gap-2">
                      <Building2 size={18} className="text-gold" />
                      <h3 className="font-semibold text-navy">
                        {sede.citta}
                        {sede.principale && (
                          <span className="ml-2 rounded-full bg-gold/15 px-2 py-0.5 text-xs font-medium text-gold">
                            {ui.contactPage.mainOfficeBadge}
                          </span>
                        )}
                      </h3>
                    </div>
                    <p className="mt-2 flex items-start gap-2 text-sm text-muted">
                      <MapPin size={16} className="mt-0.5 shrink-0 text-gold" />
                      {sede.indirizzo}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Mappa Google */}
          <Reveal
            delay={0.12}
            className="overflow-hidden rounded-2xl border border-gold/15 shadow-lg shadow-navy/5 lg:h-full lg:min-h-[28rem]"
          >
            <iframe
              title={`${ui.contactPage.mapTitlePrefix} - ${studio.sedi[0].indirizzo}`}
              src={`https://www.google.com/maps?q=${encodeURIComponent(
                studio.sedi[0].indirizzo
              )}&output=embed`}
              className="h-80 w-full border-0 lg:h-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </Reveal>
        </div>
      </section>
    </>
  );
}
