export const UNDER_CONSTRUCTION_PATH = "/in-costruzione";

/** Modalità “sito in costruzione”: attiva con SITE_UNDER_CONSTRUCTION=true (o 1). */
export function isUnderConstruction(): boolean {
  const v = process.env.SITE_UNDER_CONSTRUCTION?.trim().toLowerCase();
  return v === "true" || v === "1";
}
