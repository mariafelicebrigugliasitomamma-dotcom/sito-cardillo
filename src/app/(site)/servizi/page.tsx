import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import AreaCard from "@/components/AreaCard";
import CTASection from "@/components/CTASection";
import { getContent } from "@/lib/content";

export async function generateMetadata(): Promise<Metadata> {
  const { ui } = await getContent();
  return {
    title: ui.seo.practiceAreasTitle,
    description: ui.seo.practiceAreasDescription,
    alternates: { canonical: "/servizi" },
  };
}

export default async function AreePage() {
  const { aree, ui } = await getContent();
  return (
    <>
      <PageHero
        eyebrow={ui.practiceAreasPage.heroEyebrow}
        title={ui.practiceAreasPage.heroTitle}
        description={ui.practiceAreasPage.heroDescription}
      />

      <section className="bg-white py-24">
        <div className="mx-auto max-w-6xl px-5">
          <div className="grid gap-6 md:grid-cols-2">
            {aree.map((area, i) => (
              <Reveal key={area.slug} delay={(i % 2) * 0.1}>
                <AreaCard area={area} detailed />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CTASection
        title={ui.practiceAreasPage.ctaTitle}
        text={ui.practiceAreasPage.ctaText}
        buttonLabel={ui.cta.buttonLabel}
      />
    </>
  );
}
