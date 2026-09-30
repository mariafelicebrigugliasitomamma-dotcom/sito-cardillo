import type { Area } from "@/lib/types";
import Icon from "@/components/Icon";

type AreaCardProps = {
  area: Area;
  detailed?: boolean;
};

export default function AreaCard({ area, detailed = false }: AreaCardProps) {
  return (
    <div className="group relative flex h-full flex-col rounded-xl border border-gold/15 bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:border-gold/40 hover:shadow-xl hover:shadow-navy/5">
      <span className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 rounded-t-xl bg-gold transition-transform duration-300 group-hover:scale-x-100" />
      <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-navy text-gold transition-colors duration-300 group-hover:bg-gold group-hover:text-navy">
        <Icon name={area.icona} size={24} strokeWidth={1.6} />
      </div>
      <h3 className="text-xl font-semibold text-navy">{area.titolo}</h3>
      <p className="mt-3 text-sm leading-relaxed text-muted">
        {detailed ? area.descrizione : area.sintesi}
      </p>
      {detailed && area.prestazioni.length > 0 && (
        <ul className="mt-5 space-y-2 border-t border-gold/15 pt-5">
          {area.prestazioni.map((p) => (
            <li key={p} className="flex items-start gap-2 text-sm text-ink">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
              {p}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
