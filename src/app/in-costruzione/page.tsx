import type { Metadata } from "next";
import { getContent, getPreferredLocale } from "@/lib/content";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Sito in costruzione",
  robots: { index: false, follow: false },
};

// Testi volutamente qui e non nel CMS: la pagina deve funzionare anche se il bundle non è raggiungibile.
const TESTI = {
  it: {
    titolo: "Il nostro sito è in costruzione",
    testo: "Stiamo lavorando per offrirti una nuova esperienza online. Torna a trovarci presto.",
  },
  en: {
    titolo: "Our website is under construction",
    testo: "We are working on a new online experience. Please check back soon.",
  },
} as const;

export default async function InCostruzionePage() {
  const locale = await getPreferredLocale();
  const { studio } = await getContent(locale);
  const t = TESTI[locale];

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-navy px-6 text-center text-white">
      <p className="mb-4 text-sm uppercase tracking-[0.3em] text-gold">{studio.nome}</p>
      <h1 className="mb-6 font-serif text-4xl sm:text-5xl">{t.titolo}</h1>
      <p className="max-w-xl text-lg text-white/80">{t.testo}</p>
    </main>
  );
}
