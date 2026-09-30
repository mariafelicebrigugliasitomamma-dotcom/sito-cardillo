import Header from "@/components/Header";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
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
    <div className="flex min-h-full flex-col">
      <JsonLd data={dentistJsonLd(studio, aree)} />
      <Header nomeBreve={studio.nomeBreve} ui={ui.header} />
      <main className="flex-1">{children}</main>
      <Footer
        studio={studio}
        aree={aree}
        ui={ui.footer}
        brandPrefix={ui.header.brandPrefix}
      />
    </div>
  );
}
