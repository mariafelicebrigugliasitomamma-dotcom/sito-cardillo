import type { Metadata } from "next";
import { MapPin, Phone, Mail, Clock, Building2 } from "lucide-react";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
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
  const { telefono, emailGenerale, pec, orari } = studio.contatti;
  const sedi = studio.sedi.filter((s) => s.citta.trim() || s.indirizzo.trim());
  const indirizzoMappa = sedi.find((s) => s.indirizzo.trim())?.indirizzo;
  const hasDetails = Boolean(
    telefono.trim() || emailGenerale.trim() || pec.trim() || orari.trim()
  );
  return (
    <>
      <PageHero
        eyebrow={ui.contactPage.heroEyebrow}
        title={ui.contactPage.heroTitle}
        description={ui.contactPage.heroDescription}
      />

      <section className="bg-white py-24">
        <div
          className={`mx-auto grid max-w-6xl gap-12 px-5 lg:gap-16 ${
            indirizzoMappa ? "lg:grid-cols-[1fr_1.2fr]" : ""
          }`}
        >
          {/* Recapiti */}
          <div>
            <SectionHeading
              eyebrow={ui.contactPage.detailsEyebrow}
              title={ui.contactPage.detailsTitle}
              className="mb-8"
            />

            {hasDetails && (
              <Reveal>
                <ul className="space-y-5">
                  {telefono.trim() && (
                    <li className="flex gap-4">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-cream text-gold-ink">
                        <Phone size={20} />
                      </span>
                      <div>
                        <p className="text-sm font-medium text-muted">
                          {ui.contactPage.phoneLabel}
                        </p>
                        <a
                          href={`tel:${studio.contatti.telefono.replace(/\s/g, "")}`}
                          className="text-base font-semibold text-navy transition-colors hover:text-gold-ink"
                        >
                          {studio.contatti.telefono}
                        </a>
                      </div>
                    </li>
                  )}
                  {(emailGenerale.trim() || pec.trim()) && (
                    <li className="flex gap-4">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-cream text-gold-ink">
                        <Mail size={20} />
                      </span>
                      <div>
                        {emailGenerale.trim() && (
                          <>
                            <p className="text-sm font-medium text-muted">
                              {ui.contactPage.emailLabel}
                            </p>
                            <a
                              href={`mailto:${emailGenerale}`}
                              className="text-base font-semibold text-navy transition-colors hover:text-gold-ink"
                            >
                              {emailGenerale}
                            </a>
                          </>
                        )}
                        {pec.trim() && (
                          <p
                            className={`text-sm text-muted ${emailGenerale.trim() ? "mt-1" : ""}`}
                          >
                            {[ui.contactPage.pecLabel.trim(), pec]
                              .filter(Boolean)
                              .join(": ")}
                          </p>
                        )}
                      </div>
                    </li>
                  )}
                  {orari.trim() && (
                    <li className="flex gap-4">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-cream text-gold-ink">
                        <Clock size={20} />
                      </span>
                      <div>
                        <p className="text-sm font-medium text-muted">
                          {ui.contactPage.hoursLabel}
                        </p>
                        <p className="text-base font-semibold text-navy">
                          {studio.contatti.orari}
                        </p>
                      </div>
                    </li>
                  )}
                </ul>
              </Reveal>
            )}

            {/* Sedi */}
            {sedi.length > 0 && (
              <Reveal className={hasDetails ? "mt-10" : ""}>
                {ui.contactPage.officesEyebrow.trim() && (
                  <p className="mb-5 eyebrow text-gold-ink">
                    {ui.contactPage.officesEyebrow}
                  </p>
                )}
                <div className="space-y-4">
                  {sedi.map((sede, i) => (
                    <div
                      key={`${sede.citta}-${i}`}
                      className="rounded-xl border border-gold/15 bg-cream/60 p-5"
                    >
                      <div className="flex items-center gap-2">
                        <Building2 size={18} className="text-gold-ink" />
                        <h3 className="font-semibold text-navy">
                          {sede.citta}
                          {sede.principale &&
                            ui.contactPage.mainOfficeBadge.trim() && (
                              <span className="ml-2 rounded-full bg-white px-2.5 py-0.5 text-sm font-medium text-gold-ink ring-1 ring-gold/40">
                                {ui.contactPage.mainOfficeBadge}
                              </span>
                            )}
                        </h3>
                      </div>
                      {sede.indirizzo.trim() && (
                        <p className="mt-2 flex items-start gap-2 text-base text-muted">
                          <MapPin
                            size={18}
                            className="mt-0.5 shrink-0 text-gold-ink"
                          />
                          {sede.indirizzo}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </Reveal>
            )}
          </div>

          {/* Mappa Google */}
          {indirizzoMappa && (
            <Reveal
              delay={0.12}
              className="overflow-hidden rounded-2xl border border-gold/15 shadow-lg shadow-navy/5 lg:h-full lg:min-h-[28rem]"
            >
              <iframe
                title={[ui.contactPage.mapTitlePrefix.trim(), indirizzoMappa]
                  .filter(Boolean)
                  .join(" - ")}
                src={`https://www.google.com/maps?q=${encodeURIComponent(
                  indirizzoMappa
                )}&output=embed`}
                className="h-80 w-full border-0 lg:h-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </Reveal>
          )}
        </div>
      </section>
    </>
  );
}
