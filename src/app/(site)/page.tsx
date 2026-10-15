import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Hero from "@/components/Hero";
import Reveal from "@/components/Reveal";
import Counter from "@/components/Counter";
import SectionHeading from "@/components/SectionHeading";
import AreaCard from "@/components/AreaCard";
import TeamCard from "@/components/TeamCard";
import CTASection from "@/components/CTASection";
import type { Metadata } from "next";
import { getContent } from "@/lib/content";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default async function HomePage() {
  const { studio, aree, team, ui } = await getContent();
  const hasIntro = [
    ui.home.introEyebrow,
    ui.home.introTitle,
    studio.presentazione,
    ui.home.introCtaLabel,
  ].some((t) => t.trim());
  return (
    <>
      <Hero
        nome={studio.nome}
        annoFondazione={studio.annoFondazione}
        claim={studio.claim}
        sottoClaim={studio.sottoClaim}
        immagine={studio.heroImmagine}
        sinceLabel={ui.hero.sinceLabel}
        primaryCtaLabel={ui.hero.primaryCtaLabel}
        secondaryCtaLabel={ui.hero.secondaryCtaLabel}
      />

      {/* Presentazione */}
      {hasIntro && (
        <section className="bg-white py-24">
          <div className="mx-auto max-w-3xl px-5">
            <SectionHeading
              eyebrow={ui.home.introEyebrow}
              title={ui.home.introTitle}
              className="mb-6"
            />
            <Reveal>
              {studio.presentazione.trim() && (
                <p className="text-lg leading-relaxed text-muted">
                  {studio.presentazione}
                </p>
              )}
              {ui.home.introCtaLabel.trim() && (
                <Link
                  href="/studio"
                  className="group mt-8 inline-flex items-center gap-2 text-base font-semibold text-navy transition-colors hover:text-gold-ink"
                >
                  {ui.home.introCtaLabel}
                  <ArrowRight
                    size={18}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </Link>
              )}
            </Reveal>
          </div>
        </section>
      )}

      {/* Numeri */}
      {studio.numeri.length > 0 && (
        <section className="border-y border-gold/15 bg-cream py-16">
          <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-5 lg:grid-cols-4">
            {studio.numeri.map((n, i) => (
              <Reveal key={n.etichetta} delay={i * 0.1} className="text-center">
                <div className="font-serif text-4xl font-semibold text-navy sm:text-5xl">
                  <Counter value={n.valore} suffix={n.suffisso} />
                </div>
                <p className="mt-2 text-sm font-medium uppercase tracking-wide text-muted">
                  {n.etichetta}
                </p>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* Aree di attività */}
      {aree.length > 0 && (
        <section className="bg-white py-24">
          <div className="mx-auto max-w-6xl px-5">
            <SectionHeading
              eyebrow={ui.home.areasEyebrow}
              title={ui.home.areasTitle}
              description={ui.home.areasDescription}
              className="mb-12"
            />
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {aree.slice(0, 6).map((area, i) => (
                <Reveal key={area.slug} delay={(i % 3) * 0.1}>
                  <AreaCard area={area} />
                </Reveal>
              ))}
            </div>
            {ui.home.areasCtaLabel.trim() && (
              <Reveal className="mt-10 text-center">
                <Link
                  href="/servizi"
                  className="group inline-flex items-center gap-2 rounded-full border border-navy/30 px-7 py-3.5 text-base font-semibold text-navy transition-colors hover:border-gold-ink hover:text-gold-ink"
                >
                  {ui.home.areasCtaLabel}
                  <ArrowRight
                    size={18}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </Link>
              </Reveal>
            )}
          </div>
        </section>
      )}

      {/* Valori */}
      {studio.valori.length > 0 && (
        <section className="bg-navy py-24">
          <div className="mx-auto max-w-6xl px-5">
            <SectionHeading
              eyebrow={ui.home.valuesEyebrow}
              title={ui.home.valuesTitle}
              description={ui.home.valuesDescription}
              light
              className="mb-12"
            />
            <div className="grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
              {studio.valori.map((v, i) => (
                <Reveal
                  key={v.titolo}
                  delay={i * 0.08}
                  className="bg-navy p-8 transition-colors hover:bg-navy-800"
                >
                  <span className="font-serif text-3xl font-semibold text-gold-light">
                    0{i + 1}
                  </span>
                  <h3 className="mt-4 text-lg font-semibold text-white">
                    {v.titolo}
                  </h3>
                  <p className="mt-3 text-base leading-relaxed text-white/80">
                    {v.testo}
                  </p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Team */}
      {team.length > 0 && (
        <section className="bg-white py-24">
          <div className="mx-auto max-w-6xl px-5">
            <SectionHeading
              eyebrow={ui.home.teamEyebrow}
              title={ui.home.teamTitle}
              description={ui.home.teamDescription}
              className="mb-12"
            />
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {team.slice(0, 3).map((p, i) => (
                <Reveal key={p.slug} delay={i * 0.1}>
                  <TeamCard p={p} ctaLabel={ui.teamPage.cardCtaLabel} />
                </Reveal>
              ))}
            </div>
            {ui.home.teamCtaLabel.trim() && (
              <Reveal className="mt-10 text-center">
                <Link
                  href="/professionisti"
                  className="group inline-flex items-center gap-2 rounded-full border border-navy/30 px-7 py-3.5 text-base font-semibold text-navy transition-colors hover:border-gold-ink hover:text-gold-ink"
                >
                  {ui.home.teamCtaLabel}
                  <ArrowRight
                    size={18}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </Link>
              </Reveal>
            )}
          </div>
        </section>
      )}

      <CTASection
        title={ui.cta.defaultTitle}
        text={ui.cta.defaultText}
        buttonLabel={ui.cta.buttonLabel}
      />
    </>
  );
}
