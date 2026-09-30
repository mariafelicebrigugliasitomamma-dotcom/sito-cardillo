import type { Locale } from "./types";

export const LOCALE_COOKIE_NAME = "site_locale";
export const DEFAULT_LOCALE: Locale = "it";

export function isLocale(value: string | null | undefined): value is Locale {
  return value === "it" || value === "en";
}

export function normalizeLocale(value: string | null | undefined): Locale {
  return isLocale(value) ? value : DEFAULT_LOCALE;
}
