import type { SitePalette } from "./types";

// Palette predefinita (Blu notte + Oro), usata quando il bundle non ne ha una.
export const DEFAULT_PALETTE: SitePalette = {
  bgHex: "#0f1b2d",
  bgV800: "#16263d",
  bgV700: "#1e3450",
  ctaHex: "#b8924f",
  ctaLight: "#d4b577",
};

const WHITE = "#ffffff";
const CREAM = "#f7f5f0";

// Soglia WCAG 2.2 AA per il testo di dimensione normale.
const AA = 4.5;

function rgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)) as [number, number, number];
}

function toHex([r, g, b]: number[]): string {
  return "#" + [r, g, b].map((c) => Math.round(c).toString(16).padStart(2, "0")).join("");
}

function luminance(hex: string): number {
  const [r, g, b] = rgb(hex).map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrastRatio(a: string, b: string): number {
  const la = luminance(a);
  const lb = luminance(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

function mix(hex: string, target: string, amount: number): string {
  const a = rgb(hex);
  const t = rgb(target);
  return toHex(a.map((c, i) => c + (t[i] - c) * amount));
}

/**
 * Scurisce (verso il nero) o schiarisce (verso il bianco) il colore il minimo
 * indispensabile perché raggiunga `ratio` contro tutti gli sfondi indicati.
 */
function ensureContrast(
  hex: string,
  backgrounds: string[],
  direction: "darken" | "lighten",
  ratio = AA
): string {
  const target = direction === "darken" ? "#000000" : WHITE;
  for (let step = 0; step <= 100; step++) {
    const candidate = mix(hex, target, step / 100);
    if (backgrounds.every((bg) => contrastRatio(candidate, bg) >= ratio)) {
      return candidate;
    }
  }
  return target;
}

/**
 * Variabili CSS del tema ricavate dalla palette scelta nel CMS.
 * - `gold`: colore d'accento originale, solo per elementi decorativi (filetti, bordi, puntini).
 * - `gold-ink`: accento per testo e icone su sfondi chiari (bianco/crema).
 * - `gold-light`: accento per testo e icone su sfondi scuri (navy).
 * - `gold-btn`: sfondo dei bottoni pieni, su cui il testo navy resta leggibile.
 */
export function paletteCssVars(p: SitePalette = DEFAULT_PALETTE): Record<string, string> {
  const darkBgs = [p.bgHex, p.bgV800, p.bgV700];
  const goldBtn = ensureContrast(p.ctaHex, [p.bgHex], "lighten");
  return {
    "--color-navy": p.bgHex,
    "--color-navy-800": p.bgV800,
    "--color-navy-700": p.bgV700,
    "--color-gold": p.ctaHex,
    "--color-gold-light": ensureContrast(p.ctaLight, darkBgs, "lighten"),
    "--color-gold-ink": ensureContrast(p.ctaHex, [WHITE, CREAM], "darken"),
    "--color-gold-btn": goldBtn,
    "--color-gold-btn-hover": mix(goldBtn, WHITE, 0.2),
  };
}

export function paletteCss(p?: SitePalette): string {
  const vars = paletteCssVars(p);
  return `:root{${Object.entries(vars)
    .map(([k, v]) => `${k}:${v}`)
    .join(";")}}`;
}
