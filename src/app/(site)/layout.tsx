import Header from "@/components/Header";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import MotionProvider from "@/components/MotionProvider";
import { getContent, getPreferredLocale } from "@/lib/content";
import { dentistJsonLd } from "@/lib/jsonld";

export default async function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getPreferredLocale();
  const { studio, aree, ui } = await getContent(locale);

  return (
    <MotionProvider>
      <div className="flex min-h-full flex-col">
        <JsonLd data={dentistJsonLd(studio, aree)} />
        <a
          href="#contenuto"
          className="sr-only rounded-md bg-white px-4 py-2 font-semibold text-navy focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60]"
        >
          {ui.header.skipToContentLabel}
        </a>
        <Header nomeBreve={studio.nomeBreve} ui={ui.header} />
        <main id="contenuto" tabIndex={-1} className="flex-1 focus:outline-none">
          {children}
        </main>
        <Footer
          studio={studio}
          aree={aree}
          ui={ui.footer}
          brandPrefix={ui.header.brandPrefix}
        />
      </div>
    </MotionProvider>
  );
}
