import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Professionista } from "@/lib/types";

export default function TeamCard({
  p,
  ctaLabel,
}: {
  p: Professionista;
  ctaLabel: string;
}) {
  return (
    <Link
      href={`/professionisti/${p.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-xl border border-gold/15 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-navy/5"
    >
      {/* Foto oppure avatar con iniziali */}
      <div className="relative flex h-56 items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_30%_25%,var(--color-navy-700),var(--color-navy))]">
        {p.foto ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={p.foto}
            alt={p.nome}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <span className="font-serif text-5xl font-semibold text-gold/90">
            {p.iniziali}
          </span>
        )}
        <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-gold to-transparent opacity-60" />
      </div>

      <div className="flex flex-1 flex-col p-6">
        <p className="eyebrow text-gold">{p.ruolo}</p>
        <h3 className="mt-2 text-xl font-semibold text-navy">{p.nome}</h3>
        <p className="mt-1 text-sm text-muted">{p.abilitazione}</p>
        <p className="mt-4 flex-1 text-sm leading-relaxed text-ink/80">
          {p.bio}
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          {p.aree.map((a) => (
            <span
              key={a}
              className="rounded-full bg-cream px-3 py-1 text-xs font-medium text-navy"
            >
              {a}
            </span>
          ))}
        </div>

        <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-navy transition-colors group-hover:text-gold">
          {ctaLabel}
          <ArrowRight
            size={16}
            className="transition-transform group-hover:translate-x-1"
          />
        </span>
      </div>
    </Link>
  );
}
