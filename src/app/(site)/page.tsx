import Link from "next/link";
import { ArrowRight, Quote } from "lucide-react";
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
  return (
    <>
      <Hero
        nome={studio.nome}
        annoFondazione={studio.annoFondazione}
        claim={studio.claim}
        sottoClaim={studio.sottoClaim}
        immagine={studio.heroImmagine}
        primaryCtaLabel={ui.hero.primaryCtaLabel}
        secondaryCtaLabel={ui.hero.secondaryCtaLabel}
      />

      {/* Presentazione */}
      <section className="bg-white py-24">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <p className="eyebrow text-gold">{ui.home.introEyebrow}</p>
            <h2 className="mt-3 text-3xl font-semibold text-navy sm:text-4xl">
              {ui.home.introTitle}
            </h2>
            <div className="rule-gold mt-5" />
            <p className="mt-6 text-base leading-relaxed text-muted">
              {studio.presentazione}
            </p>
            <Link
              href="/studio"
              className="group mt-8 inline-flex items-center gap-2 text-sm font-semibold text-navy transition-colors hover:text-gold"
            >
              {ui.home.introCtaLabel}
              <ArrowRight
                size={18}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
          </Reveal>

          <Reveal delay={0.15}>
            <figure className="relative rounded-2xl bg-navy p-9 sm:p-11">
              <Quote size={40} className="text-gold/40" />
              <blockquote className="mt-4 font-serif text-2xl leading-snug text-white">
                {studio.citazione.testo}
              </blockquote>
              <figcaption className="mt-6 text-sm font-medium text-gold">
                — {studio.citazione.autore}
              </figcaption>
            </figure>
          </Reveal>
        </div>
      </section>

      {/* Numeri */}
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

      {/* Aree di attività */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-6xl px-5">
          <SectionHeading
            eyebrow={ui.home.areasEyebrow}
            title={ui.home.areasTitle}
            description={ui.home.areasDescription}
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {aree.slice(0, 6).map((area, i) => (
              <Reveal key={area.slug} delay={(i % 3) * 0.1}>
                <AreaCard area={area} />
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-10 text-center">
            <Link
              href="/servizi"
              className="group inline-flex items-center gap-2 rounded-full border border-navy/20 px-7 py-3.5 text-sm font-semibold text-navy transition-colors hover:border-gold hover:text-gold"
            >
              {ui.home.areasCtaLabel}
              <ArrowRight
                size={18}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* Valori */}
      <section className="bg-navy py-24">
        <div className="mx-auto max-w-6xl px-5">
          <SectionHeading
            eyebrow={ui.home.valuesEyebrow}
            title={ui.home.valuesTitle}
            description={ui.home.valuesDescription}
            light
          />
          <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
            {studio.valori.map((v, i) => (
              <Reveal
                key={v.titolo}
                delay={i * 0.08}
                className="bg-navy p-8 transition-colors hover:bg-navy-800"
              >
                <span className="font-serif text-3xl font-semibold text-gold">
                  0{i + 1}
                </span>
                <h3 className="mt-4 text-lg font-semibold text-white">
                  {v.titolo}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-white/65">
                  {v.testo}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-6xl px-5">
          <SectionHeading
            eyebrow={ui.home.teamEyebrow}
            title={ui.home.teamTitle}
            description={ui.home.teamDescription}
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {team.slice(0, 3).map((p, i) => (
              <Reveal key={p.slug} delay={i * 0.1}>
                <TeamCard p={p} ctaLabel={ui.teamPage.cardCtaLabel} />
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-10 text-center">
            <Link
              href="/professionisti"
              className="group inline-flex items-center gap-2 rounded-full border border-navy/20 px-7 py-3.5 text-sm font-semibold text-navy transition-colors hover:border-gold hover:text-gold"
            >
              {ui.home.teamCtaLabel}
              <ArrowRight
                size={18}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
          </Reveal>
        </div>
      </section>

      <CTASection
        title={ui.cta.defaultTitle}
        text={ui.cta.defaultText}
        buttonLabel={ui.cta.buttonLabel}
      />
    </>
  );
}
