import type { Metadata } from "next";
import { Cormorant_Garamond, Source_Sans_3 } from "next/font/google";
import "./globals.css";
import { getBundle, getContent, getPreferredLocale } from "@/lib/content";
import { SITE_URL } from "@/lib/site";

const sourceSans = Source_Sans_3({
  variable: "--font-source-sans",
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getPreferredLocale();
  const { studio, ui } = await getContent(locale);
  const ogImageUrl = new URL("/opengraph-image", SITE_URL).toString();
  const twitterImageUrl = new URL("/twitter-image", SITE_URL).toString();

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: `${studio.nome} — ${ui.seo.homeTitleSuffix}`,
      template: `%s — ${studio.nome}`,
    },
    description: studio.metaDescription,
    openGraph: {
      title: studio.nome,
      description: studio.metaDescription,
      url: SITE_URL,
      siteName: studio.nome,
      locale: locale === "en" ? "en_US" : "it_IT",
      type: "website",
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: studio.nome,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: studio.nome,
      description: studio.metaDescription,
      images: [twitterImageUrl],
    },
    icons: {
      icon: "/icon.svg",
      shortcut: "/icon.svg",
      apple: "/icon.svg",
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [locale, bundle] = await Promise.all([getPreferredLocale(), getBundle()]);
  const p = bundle.palette;
  const paletteStyle = p
    ? `:root{--color-navy:${p.bgHex};--color-navy-800:${p.bgV800};--color-navy-700:${p.bgV700};--color-gold:${p.ctaHex};--color-gold-light:${p.ctaLight}}`
    : "";

  return (
    <html
      lang={locale}
      className={`${sourceSans.variable} ${cormorant.variable} h-full antialiased`}
    >
      {paletteStyle && <style dangerouslySetInnerHTML={{ __html: paletteStyle }} />}
      <body className="min-h-full bg-white text-ink">
        {children}
      </body>
    </html>
  );
}
