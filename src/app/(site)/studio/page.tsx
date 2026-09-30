import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import CTASection from "@/components/CTASection";
import { getContent } from "@/lib/content";

export async function generateMetadata(): Promise<Metadata> {
  const { ui } = await getContent();
  return {
    title: ui.seo.studioTitle,
    description: ui.seo.studioDescription,
    alternates: { canonical: "/studio" },
  };
}

export default async function StudioPage() {
  const { studio, ui } = await getContent();
  return (
    <>
      <PageHero
        eyebrow={ui.studioPage.heroEyebrow}
        title={ui.studioPage.heroTitle}
        description={ui.studioPage.heroDescription}
      />

      {/* Presentazione + missione */}
      <section className="bg-white py-24">
        <div className="mx-auto grid max-w-6xl gap-12 px-5 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <p className="eyebrow text-gold">{ui.studioPage.aboutEyebrow}</p>
            <h2 className="mt-3 text-3xl font-semibold text-navy">
              {ui.studioPage.aboutTitle}
            </h2>
            <div className="rule-gold mt-5" />
            <p className="mt-6 text-base leading-relaxed text-muted">
              {studio.presentazione}
            </p>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="eyebrow text-gold">{ui.studioPage.missionEyebrow}</p>
            <h2 className="mt-3 text-3xl font-semibold text-navy">
              {ui.studioPage.missionTitle}
            </h2>
            <div className="rule-gold mt-5" />
            <p className="mt-6 text-base leading-relaxed text-muted">
              {studio.missione}
            </p>
          </Reveal>
        </div>
      </section>

      {/* Storia / timeline */}
      <section className="bg-cream py-24">
        <div className="mx-auto max-w-6xl px-5">
          <SectionHeading
            eyebrow={ui.studioPage.historyEyebrow}
            title={ui.studioPage.historyTitle}
            align="center"
          />
          <div className="mx-auto mt-14 max-w-3xl">
            <div className="relative border-l border-gold/30 pl-8">
              {studio.storia.map((tappa, i) => (
                <Reveal
                  key={tappa.anno}
                  delay={i * 0.08}
                  className="relative pb-12 last:pb-0"
                >
                  <span className="absolute -left-[2.35rem] top-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-gold bg-cream">
                    <span className="h-2 w-2 rounded-full bg-gold" />
                  </span>
                  <span className="font-serif text-2xl font-semibold text-gold">
                    {tappa.anno}
                  </span>
                  <h3 className="mt-1 text-xl font-semibold text-navy">
                    {tappa.titolo}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {tappa.testo}
                  </p>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Valori */}
      <section className="bg-navy py-24">
        <div className="mx-auto max-w-6xl px-5">
          <SectionHeading
            eyebrow={ui.studioPage.valuesEyebrow}
            title={ui.studioPage.valuesTitle}
            light
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {studio.valori.map((v, i) => (
              <Reveal
                key={v.titolo}
                delay={i * 0.08}
                className="rounded-xl border border-white/10 bg-navy-800 p-7 transition-colors hover:border-gold/40"
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

      <CTASection
        title={ui.cta.defaultTitle}
        text={ui.cta.defaultText}
        buttonLabel={ui.cta.buttonLabel}
      />
    </>
  );
}
