"use client";

import { motion } from "framer-motion";

type PageHeroProps = {
  eyebrow?: string;
  title?: string;
  description?: string;
};

export default function PageHero({
  eyebrow,
  title,
  description,
}: PageHeroProps) {
  return (
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
        {eyebrow?.trim() && (
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-4 eyebrow text-gold-light"
          >
            {eyebrow}
          </motion.p>
        )}
        {title?.trim() && (
          <motion.h1
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="max-w-3xl text-4xl font-semibold text-white sm:text-5xl"
          >
            {title}
          </motion.h1>
        )}
        {(eyebrow?.trim() || title?.trim()) && <div className="rule-gold mt-6" />}
        {description?.trim() && (
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-6 max-w-2xl text-lg leading-relaxed text-white/80"
          >
            {description}
          </motion.p>
        )}
      </div>
    </section>
  );
}
