import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Reveal from "./Reveal";

type CTASectionProps = {
  title?: string;
  text?: string;
  buttonLabel?: string;
};

export default function CTASection({
  title = "È il momento di prenderti cura del tuo sorriso",
  text = "Prenota una prima visita: valuteremo insieme la tua salute orale e ti proporremo un piano di cura chiaro.",
  buttonLabel = "Prenota una visita",
}: CTASectionProps) {
  return (
    <section className="relative overflow-hidden bg-navy">
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />
      <Reveal className="relative mx-auto flex max-w-4xl flex-col items-center px-5 py-20 text-center">
        <div className="rule-gold mx-auto" />
        <h2 className="mt-6 text-3xl font-semibold text-white sm:text-4xl">
          {title}
        </h2>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/80">
          {text}
        </p>
        <Link
          href="/contatti"
          className="group mt-9 inline-flex items-center gap-2 rounded-full bg-gold-btn px-8 py-4 text-base font-semibold text-navy transition-all hover:bg-gold-btn-hover hover:shadow-lg hover:shadow-gold/20"
        >
          {buttonLabel}
          <ArrowRight
            size={18}
            className="transition-transform group-hover:translate-x-1"
          />
        </Link>
      </Reveal>
    </section>
  );
}
