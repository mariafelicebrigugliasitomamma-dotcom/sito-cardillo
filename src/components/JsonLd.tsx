/**
 * Inietta un blocco di dati strutturati JSON-LD nel documento.
 * Server component: l'oggetto viene serializzato a build/render time.
 */
export default function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
