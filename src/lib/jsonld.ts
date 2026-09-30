import type { Studio, Area, Professionista } from "./types";
import { SITE_URL } from "./site";

/**
 * Dati strutturati Schema.org (https://schema.org).
 * Generati dai contenuti dello studio per favorire rich result,
 * local pack e AI Overview.
 */

function indirizzoPostale(citta: string, indirizzo: string) {
  return {
    "@type": "PostalAddress",
    streetAddress: indirizzo,
    addressLocality: citta,
    addressCountry: "IT",
  };
}

/** Dentist: profilo dello studio con tutte le sedi. */
export function dentistJsonLd(studio: Studio, aree: Area[]) {
  const principale =
    studio.sedi.find((s) => s.principale) ?? studio.sedi[0];

  return {
    "@context": "https://schema.org",
    "@type": "Dentist",
    "@id": `${SITE_URL}/#studio`,
    name: studio.nome,
    url: SITE_URL,
    description: studio.metaDescription,
    telephone: studio.contatti.telefono,
    email: studio.contatti.emailGenerale,
    foundingDate: String(studio.annoFondazione),
    areaServed: "IT",
    knowsAbout: aree.map((a) => a.titolo),
    address: principale
      ? indirizzoPostale(principale.citta, principale.indirizzo)
      : undefined,
    location: studio.sedi.map((s) => ({
      "@type": "Place",
      name: `${studio.nome} — ${s.citta}`,
      address: indirizzoPostale(s.citta, s.indirizzo),
    })),
  };
}

/** Person: scheda del singolo professionista. */
export function personaJsonLd(p: Professionista, studio: Studio) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${SITE_URL}/professionisti/${p.slug}#persona`,
    name: p.nome,
    jobTitle: p.ruolo,
    url: `${SITE_URL}/professionisti/${p.slug}`,
    email: p.email,
    telephone: p.telefono || undefined,
    image: p.foto ? `${SITE_URL}${p.foto}` : undefined,
    knowsAbout: p.aree,
    alumniOf: p.formazione.length > 0 ? p.formazione : undefined,
    worksFor: {
      "@type": "Dentist",
      "@id": `${SITE_URL}/#studio`,
      name: studio.nome,
      url: SITE_URL,
    },
  };
}
