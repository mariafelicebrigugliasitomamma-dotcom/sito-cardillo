import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Mail,
  Phone,
  ArrowLeft,
  GraduationCap,
  Stethoscope,
  ArrowRight,
} from "lucide-react";
import Reveal from "@/components/Reveal";
import CTASection from "@/components/CTASection";
import JsonLd from "@/components/JsonLd";
import { getContent } from "@/lib/content";
import { personaJsonLd } from "@/lib/jsonld";

export async function generateStaticParams() {
  const { team } = await getContent();
  return team.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { team, ui } = await getContent();
  const p = team.find((m) => m.slug === slug);
  if (!p) return { title: ui.teamPage.notFoundTitle };
  return {
    title: p.nome,
    description: p.bio,
    alternates: { canonical: `/professionisti/${p.slug}` },
  };
}

export default async function ProfiloPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { studio, team, ui } = await getContent();
  const p = team.find((m) => m.slug === slug);
  if (!p) notFound();

  const altri = team.filter((m) => m.slug !== slug);

  return (
    <>
      <JsonLd data={personaJsonLd(p, studio)} />
      {/* Intestazione profilo */}
      <section className="relative overflow-hidden bg-navy pb-16 pt-36">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_0%,var(--color-navy-700)_0%,var(--color-navy)_60%)]" />
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        <div className="relative mx-auto max-w-6xl px-5">
          <Link
            href="/professionisti"
            className="inline-flex items-center gap-2 text-sm font-medium text-white/70 transition-colors hover:text-gold"
          >
            <ArrowLeft size={16} />
            {ui.teamPage.backLabel}
          </Link>

          <div className="mt-8 flex flex-col gap-8 sm:flex-row sm:items-end">
            <div className="relative h-40 w-40 shrink-0 overflow-hidden rounded-2xl border border-gold/30 bg-[radial-gradient(circle_at_30%_25%,var(--color-navy-700),var(--color-navy))]">
              {p.foto ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={p.foto}
                  alt={p.nome}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="flex h-full w-full items-center justify-center font-serif text-5xl font-semibold text-gold/90">
                  {p.iniziali}
                </span>
              )}
            </div>
            <div>
              <p className="eyebrow text-gold">{p.ruolo}</p>
              <h1 className="mt-3 text-4xl font-semibold text-white sm:text-5xl">
                {p.nome}
              </h1>
              <p className="mt-2 text-white/70">{p.abilitazione}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Corpo */}
      <section className="bg-white py-20">
        <div className="mx-auto grid max-w-6xl gap-12 px-5 lg:grid-cols-[1.6fr_1fr] lg:gap-16">
          {/* Biografia */}
          <Reveal>
            <p className="eyebrow text-gold">{ui.teamPage.profileEyebrow}</p>
            <h2 className="mt-3 text-3xl font-semibold text-navy">
              {ui.teamPage.biographyTitle}
            </h2>
            <div className="rule-gold mt-5" />
            <div className="mt-6 space-y-4 text-base leading-relaxed text-muted">
              {(p.bioEstesa.length > 0 ? p.bioEstesa : [p.bio]).map(
                (par, i) => (
                  <p key={i}>{par}</p>
                )
              )}
            </div>

            {p.formazione.length > 0 && (
              <div className="mt-10">
                <h3 className="flex items-center gap-2 text-xl font-semibold text-navy">
                  <GraduationCap size={22} className="text-gold" />
                  {ui.teamPage.educationTitle}
                </h3>
                <ul className="mt-4 space-y-3 border-l border-gold/30 pl-5">
                  {p.formazione.map((f) => (
                    <li
                      key={f}
                      className="relative text-sm leading-relaxed text-ink/80"
                    >
                      <span className="absolute -left-[1.45rem] top-1.5 h-2 w-2 rounded-full bg-gold" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </Reveal>

          {/* Sidebar */}
          <Reveal delay={0.12}>
            <div className="rounded-2xl border border-gold/20 bg-cream/50 p-7">
              <h3 className="flex items-center gap-2 text-lg font-semibold text-navy">
                <Stethoscope size={20} className="text-gold" />
                {ui.teamPage.expertiseTitle}
              </h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {p.aree.map((a) => (
                  <span
                    key={a}
                    className="rounded-full bg-white px-3 py-1.5 text-xs font-medium text-navy ring-1 ring-gold/20"
                  >
                    {a}
                  </span>
                ))}
              </div>

              <h3 className="mt-8 text-lg font-semibold text-navy">
                {ui.teamPage.contactsTitle}
              </h3>
              <ul className="mt-4 space-y-3 text-sm">
                <li>
                  <a
                    href={`mailto:${p.email}`}
                    className="flex items-center gap-2.5 text-navy transition-colors hover:text-gold"
                  >
                    <Mail size={18} className="text-gold" />
                    {p.email}
                  </a>
                </li>
                {p.telefono && (
                  <li>
                    <a
                      href={`tel:${p.telefono.replace(/\s/g, "")}`}
                      className="flex items-center gap-2.5 text-navy transition-colors hover:text-gold"
                    >
                      <Phone size={18} className="text-gold" />
                      {p.telefono}
                    </a>
                  </li>
                )}
              </ul>
            </div>
          </Reveal>
        </div>

        {/* Altri professionisti */}
        {altri.length > 0 && (
          <div className="mx-auto mt-20 max-w-6xl px-5">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-navy">
                {ui.teamPage.otherProfessionalsTitle}
              </h2>
              <Link
                href="/professionisti"
                className="group inline-flex items-center gap-2 text-sm font-semibold text-navy transition-colors hover:text-gold"
              >
                {ui.teamPage.viewAllLabel}
                <ArrowRight
                  size={16}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>
            </div>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {altri.map((m) => (
                <Link
                  key={m.slug}
                  href={`/professionisti/${m.slug}`}
                  className="group flex items-center gap-4 rounded-xl border border-gold/15 bg-white p-5 transition-all hover:-translate-y-0.5 hover:border-gold/40 hover:shadow-lg hover:shadow-navy/5"
                >
                  <span className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[radial-gradient(circle_at_30%_25%,var(--color-navy-700),var(--color-navy))] font-serif text-lg font-semibold text-gold">
                    {m.foto ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={m.foto}
                        alt={m.nome}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      m.iniziali
                    )}
                  </span>
                  <span>
                    <span className="block font-semibold text-navy transition-colors group-hover:text-gold">
                      {m.nome}
                    </span>
                    <span className="block text-sm text-muted">{m.ruolo}</span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>

      <CTASection
        title={ui.cta.defaultTitle}
        text={ui.cta.defaultText}
        buttonLabel={ui.cta.buttonLabel}
      />
    </>
  );
}
