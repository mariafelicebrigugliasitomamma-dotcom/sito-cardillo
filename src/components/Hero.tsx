"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";

type HeroProps = {
  nome: string;
  annoFondazione: number;
  claim: string;
  sottoClaim: string;
  immagine?: string;
  primaryCtaLabel: string;
  secondaryCtaLabel: string;
};

export default function Hero({
  nome,
  annoFondazione,
  claim,
  sottoClaim,
  immagine,
  primaryCtaLabel,
  secondaryCtaLabel,
}: HeroProps) {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 600], [0, 140]);
  const scale = useTransform(scrollY, [0, 600], [1, 1.12]);
  const overlayOpacity = useTransform(scrollY, [0, 400], [1, 0.6]);

  return (
    <section
      className={`relative flex overflow-hidden bg-navy sm:min-h-[100svh] sm:items-center ${
        immagine ? "items-start" : "min-h-[100svh] items-center"
      }`}
    >
      {/* Sfondo a gradiente con parallax */}
      <motion.div
        style={{ y, scale }}
        className="absolute inset-0 will-change-transform"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,var(--color-navy-700)_0%,var(--color-navy)_55%,var(--color-navy)_100%)]" />
        {immagine && (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={immagine}
              alt=""
              fetchPriority="high"
              className="absolute inset-x-0 top-0 h-[52svh] w-full object-cover object-[62%_center] sm:inset-0 sm:h-full sm:object-[65%_center] lg:object-[30%_center]"
            />
            {/* Velatura da sinistra: tiene leggibile il testo e lascia visibile la foto a destra */}
            <div className="absolute inset-0 hidden bg-gradient-to-r from-navy/95 via-navy/80 to-navy/40 sm:block lg:via-navy/60 lg:to-transparent" />
            {/* Mobile: la fascia fotografica sfuma nel navy sotto il testo */}
            <div className="absolute inset-x-0 top-0 h-[52svh] bg-gradient-to-b from-navy/80 via-navy/10 via-40% to-navy sm:hidden" />
          </>
        )}
        {/* Trama sottile */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
      </motion.div>

      <motion.div
        style={{ opacity: overlayOpacity }}
        className={`absolute inset-0 bg-gradient-to-t ${
          immagine ? "from-navy/80 via-transparent" : "from-navy via-navy/40"
        } to-transparent`}
      />

      {/* Filo oro decorativo laterale */}
      <div className="absolute left-0 top-1/2 hidden h-48 w-px -translate-y-1/2 bg-gradient-to-b from-transparent via-gold to-transparent lg:block" />

      <div
        className={`relative mx-auto w-full max-w-6xl px-5 sm:pb-0 sm:pt-28 ${
          immagine ? "pb-20 pt-[40svh]" : "pt-28"
        }`}
      >
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="eyebrow text-gold"
        >
          {nome} · dal {annoFondazione}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 max-w-3xl text-balance font-serif text-4xl font-semibold leading-[1.08] text-white sm:text-5xl lg:text-6xl"
        >
          {claim}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.24, ease: [0.22, 1, 0.36, 1] }}
          className="mt-7 max-w-xl text-lg leading-relaxed text-white/75"
        >
          {sottoClaim}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.36, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10 flex flex-wrap items-center gap-4"
        >
          <Link
            href="/contatti"
            className="group inline-flex items-center gap-2 rounded-full bg-gold px-7 py-3.5 text-sm font-semibold text-navy transition-all hover:bg-gold-light hover:shadow-lg hover:shadow-gold/20"
          >
            {primaryCtaLabel}
            <ArrowRight
              size={18}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
          <Link
            href="/servizi"
            className="inline-flex items-center gap-2 rounded-full border border-white/25 px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:border-gold hover:text-gold"
          >
            {secondaryCtaLabel}
          </Link>
        </motion.div>
      </div>

      {/* Indicatore di scroll */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="flex h-10 w-6 items-start justify-center rounded-full border border-white/30 p-1.5"
        >
          <span className="h-1.5 w-1 rounded-full bg-gold" />
        </motion.div>
      </motion.div>
    </section>
  );
}
