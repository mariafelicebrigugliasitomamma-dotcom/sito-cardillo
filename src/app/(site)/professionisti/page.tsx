import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import TeamCard from "@/components/TeamCard";
import CTASection from "@/components/CTASection";
import { getContent } from "@/lib/content";

export async function generateMetadata(): Promise<Metadata> {
  const { ui } = await getContent();
  return {
    title: ui.seo.teamTitle,
    description: ui.seo.teamDescription,
    alternates: { canonical: "/professionisti" },
  };
}

export default async function TeamPage() {
  const { team, ui } = await getContent();
  return (
    <>
      <PageHero
        eyebrow={ui.teamPage.heroEyebrow}
        title={ui.teamPage.heroTitle}
        description={ui.teamPage.heroDescription}
      />

      <section className="bg-cream py-24">
        <div className="mx-auto max-w-6xl px-5">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {team.map((p, i) => (
              <Reveal key={p.slug} delay={(i % 3) * 0.1}>
                <TeamCard p={p} ctaLabel={ui.teamPage.cardCtaLabel} />
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
