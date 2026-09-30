#!/usr/bin/env node

import { readFile, writeFile } from "fs/promises";
import path from "path";

function parseArgs(argv) {
  const args = {
    source: "content/site.bundle.json",
    locale: "it",
    output: "src/lib/defaultContent.ts",
    backup: true,
    help: false,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (token === "--help" || token === "-h") {
      args.help = true;
      continue;
    }

    if (token === "--no-backup") {
      args.backup = false;
      continue;
    }

    if (token === "--source") {
      args.source = argv[i + 1] ?? args.source;
      i += 1;
      continue;
    }

    if (token === "--locale") {
      args.locale = argv[i + 1] ?? args.locale;
      i += 1;
      continue;
    }

    if (token === "--output") {
      args.output = argv[i + 1] ?? args.output;
      i += 1;
      continue;
    }
  }

  return args;
}

function printHelp() {
  console.log(`
Exporta i contenuti cliente nel file defaultContent.ts

Uso:
  node scripts/export-default-content.mjs [opzioni]

Opzioni:
  --source <path>     File sorgente JSON (default: content/site.bundle.json)
  --locale <it|en>    Locale da esportare quando la sorgente e' un bundle (default: it)
  --output <path>     File TypeScript di destinazione (default: src/lib/defaultContent.ts)
  --no-backup         Non crea backup del file di output
  --help, -h          Mostra questo aiuto

Esempi:
  npm run export:default-content
  npm run export:default-content -- --locale en
  npm run export:default-content -- --source ./site-bundle-from-email.json
`);
}

function getSiteContent(parsed, locale) {
  if (parsed && typeof parsed === "object" && parsed.content) {
    const maybeBundle = parsed;
    const localized = maybeBundle.content?.[locale];
    if (!localized) {
      throw new Error(
        `Locale "${locale}" non trovata nel bundle. Disponibili: ${Object.keys(
          maybeBundle.content || {}
        ).join(", ")}`
      );
    }
    return localized;
  }

  return parsed;
}

function validateSiteContent(content) {
  const ok =
    content &&
    typeof content === "object" &&
    content.studio &&
    content.privacy &&
    Array.isArray(content.aree) &&
    Array.isArray(content.team);

  if (!ok) {
    throw new Error(
      "Il file sorgente non contiene uno SiteContent valido (studio/privacy/aree/team)."
    );
  }
}

function buildDefaultContentFile(content) {
  const serialized = JSON.stringify(content, null, 2);

  return `import type { SiteContent } from "./types";
import { SITE_URL } from "./site";

const customerContent = ${serialized} as SiteContent;

export const defaultContent: SiteContent = {
  ...customerContent,
  privacy: {
    ...customerContent.privacy,
    siteUrl: customerContent.privacy?.siteUrl || SITE_URL.replace("https://", ""),
  },
};
`;
}

async function run() {
  const args = parseArgs(process.argv.slice(2));

  if (args.help) {
    printHelp();
    return;
  }

  if (args.locale !== "it" && args.locale !== "en") {
    throw new Error(`Locale non supportata: ${args.locale}. Usa "it" oppure "en".`);
  }

  const cwd = process.cwd();
  const sourcePath = path.resolve(cwd, args.source);
  const outputPath = path.resolve(cwd, args.output);

  const raw = await readFile(sourcePath, "utf8");
  const parsed = JSON.parse(raw);
  const siteContent = getSiteContent(parsed, args.locale);
  validateSiteContent(siteContent);

  if (args.backup) {
    try {
      const existing = await readFile(outputPath, "utf8");
      const stamp = new Date().toISOString().replace(/[:.]/g, "-");
      const backupPath = `${outputPath}.${stamp}.bak`;
      await writeFile(backupPath, existing, "utf8");
      console.log(`Backup creato: ${path.relative(cwd, backupPath)}`);
    } catch {
      // Nessun file precedente da salvare.
    }
  }

  const tsFile = buildDefaultContentFile(siteContent);
  await writeFile(outputPath, tsFile, "utf8");

  console.log(`defaultContent aggiornato da ${path.relative(cwd, sourcePath)}`);
  console.log(`Output: ${path.relative(cwd, outputPath)}`);
}

run().catch((error) => {
  const message = error instanceof Error ? error.message : "Errore sconosciuto";
  console.error(`Errore export-default-content: ${message}`);
  process.exitCode = 1;
});
