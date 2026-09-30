import "server-only";
import { randomUUID } from "crypto";
import { promises as fs } from "fs";
import path from "path";
import { cookies } from "next/headers";
import { defaultContent } from "./defaultContent";
import {
  commitFilesAtomically,
  GitHubStoreConflictError,
  GitHubStoreConfigError,
  isGithubStoreConfigured,
  readTextFileFromGitHub,
} from "./githubContentStore";
import { DEFAULT_LOCALE, LOCALE_COOKIE_NAME, normalizeLocale } from "./locale";
import type { Locale, SaveContentPayload, SiteBundle, SiteContent, SitePalette } from "./types";

const CONTENT_BUNDLE_FILE = "content/site.bundle.json";
const SNAPSHOT_DIR = "content/backups";
const LOCAL_BUNDLE_FILE = path.join(process.cwd(), CONTENT_BUNDLE_FILE);
const LOCAL_SNAPSHOT_DIR = path.join(process.cwd(), SNAPSHOT_DIR);
const IS_VERCEL = Boolean(process.env.VERCEL);

export class PersistenceConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PersistenceConfigError";
  }
}

export class StaleRevisionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "StaleRevisionError";
  }
}

function deepClone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function mergeContent(parsed: Partial<SiteContent> | undefined): SiteContent {
  return {
    studio: { ...defaultContent.studio, ...(parsed?.studio || {}) },
    privacy: { ...defaultContent.privacy, ...(parsed?.privacy || {}) },
    aree: Array.isArray(parsed?.aree) ? parsed.aree : defaultContent.aree,
    team: Array.isArray(parsed?.team) ? parsed.team : defaultContent.team,
    ui: {
      header: { ...defaultContent.ui.header, ...(parsed?.ui?.header || {}) },
      footer: { ...defaultContent.ui.footer, ...(parsed?.ui?.footer || {}) },
      hero: { ...defaultContent.ui.hero, ...(parsed?.ui?.hero || {}) },
      home: { ...defaultContent.ui.home, ...(parsed?.ui?.home || {}) },
      seo: { ...defaultContent.ui.seo, ...(parsed?.ui?.seo || {}) },
      studioPage: {
        ...defaultContent.ui.studioPage,
        ...(parsed?.ui?.studioPage || {}),
      },
      teamPage: {
        ...defaultContent.ui.teamPage,
        ...(parsed?.ui?.teamPage || {}),
      },
      privacyPage: {
        ...defaultContent.ui.privacyPage,
        ...(parsed?.ui?.privacyPage || {}),
      },
      contactPage: {
        ...defaultContent.ui.contactPage,
        ...(parsed?.ui?.contactPage || {}),
      },
      practiceAreasPage: {
        ...defaultContent.ui.practiceAreasPage,
        ...(parsed?.ui?.practiceAreasPage || {}),
      },
      cta: { ...defaultContent.ui.cta, ...(parsed?.ui?.cta || {}) },
    },
  };
}

function makeDefaultBundle(): SiteBundle {
  const now = new Date().toISOString();
  return {
    meta: {
      revision: "bootstrap",
      updatedAt: now,
      updatedBy: "system",
      idempotencyKey: "bootstrap",
    },
    content: {
      it: deepClone(defaultContent),
      en: deepClone(defaultContent),
    },
    media: {
      images: [],
    },
  };
}

function normalizeBundle(parsed: unknown): SiteBundle {
  const fallback = makeDefaultBundle();
  if (!parsed || typeof parsed !== "object") return fallback;

  const raw = parsed as Partial<SiteBundle>;
  const rawContent = (raw.content || {}) as Partial<Record<Locale, SiteContent>>;

  return {
    meta: {
      revision: raw.meta?.revision || fallback.meta.revision,
      updatedAt: raw.meta?.updatedAt || fallback.meta.updatedAt,
      updatedBy: raw.meta?.updatedBy || fallback.meta.updatedBy,
      idempotencyKey: raw.meta?.idempotencyKey || fallback.meta.idempotencyKey,
      commitSha: raw.meta?.commitSha,
    },
    content: {
      it: mergeContent(rawContent.it),
      en: mergeContent(rawContent.en),
    },
    media: {
      images: Array.isArray(raw.media?.images) ? raw.media.images.slice(0, 3) : [],
    },
    palette: raw.palette ?? undefined,
  };
}

export async function savePalette(input: {
  palette: SitePalette;
  idempotencyKey: string;
  updatedBy: string;
}): Promise<{ bundle: SiteBundle; snapshotPath: string; commitSha?: string }> {
  const { palette, idempotencyKey, updatedBy } = input;

  if (!idempotencyKey || idempotencyKey.length < 8) {
    throw new Error("idempotencyKey mancante o non valido.");
  }

  const currentBundle = await getBundle();

  if (currentBundle.meta.idempotencyKey === idempotencyKey) {
    return { bundle: currentBundle, snapshotPath: "", commitSha: currentBundle.meta.commitSha };
  }

  const revision = randomUUID();
  const updatedAt = new Date().toISOString();
  const snapshotPath = buildSnapshotPath(revision);

  const nextBundle: SiteBundle = {
    ...currentBundle,
    meta: { revision, updatedAt, updatedBy, idempotencyKey },
    palette,
  };

  const bundleJson = `${JSON.stringify(nextBundle, null, 2)}\n`;

  if (isGithubStoreConfigured()) {
    try {
      const commit = await commitFilesAtomically({
        files: [
          { path: CONTENT_BUNDLE_FILE, content: bundleJson },
          { path: snapshotPath, content: bundleJson },
        ],
        message: `cms: save palette rev ${revision} [idempotency:${idempotencyKey}]`,
      });
      return {
        bundle: { ...nextBundle, meta: { ...nextBundle.meta, commitSha: commit.commitSha } },
        snapshotPath,
        commitSha: commit.commitSha,
      };
    } catch (error) {
      if (error instanceof GitHubStoreConfigError || error instanceof GitHubStoreConflictError) {
        throw error;
      }
      throw new Error(
        error instanceof Error ? `Salvataggio GitHub fallito: ${error.message}` : "Salvataggio GitHub fallito"
      );
    }
  }

  if (IS_VERCEL) {
    throw new PersistenceConfigError(
      "Configurazione GitHub mancante su Vercel. Imposta GITHUB_TOKEN e GITHUB_REPO."
    );
  }

  await fs.mkdir(path.dirname(LOCAL_BUNDLE_FILE), { recursive: true });
  await fs.mkdir(LOCAL_SNAPSHOT_DIR, { recursive: true });
  await fs.writeFile(LOCAL_BUNDLE_FILE, bundleJson, "utf8");
  await fs.writeFile(path.join(process.cwd(), snapshotPath), bundleJson, "utf8");

  return { bundle: nextBundle, snapshotPath };
}

async function readBundleFromFile(): Promise<SiteBundle | null> {
  try {
    const raw = await fs.readFile(LOCAL_BUNDLE_FILE, "utf8");
    return normalizeBundle(JSON.parse(raw));
  } catch {
    return null;
  }
}

async function readBundleFromGitHubStore(): Promise<SiteBundle | null> {
  const raw = await readTextFileFromGitHub(CONTENT_BUNDLE_FILE);
  if (!raw) return null;
  return normalizeBundle(JSON.parse(raw));
}

export async function getBundle(): Promise<SiteBundle> {
  try {
    const bundle = isGithubStoreConfigured()
      ? await readBundleFromGitHubStore()
      : await readBundleFromFile();

    return bundle ?? makeDefaultBundle();
  } catch (error) {
    console.error("Errore lettura bundle contenuti:", error);
    return makeDefaultBundle();
  }
}

export async function getPreferredLocale(): Promise<Locale> {
  try {
    const store = await cookies();
    return normalizeLocale(store.get(LOCALE_COOKIE_NAME)?.value);
  } catch {
    return DEFAULT_LOCALE;
  }
}

export async function getContent(locale?: Locale): Promise<SiteContent> {
  const bundle = await getBundle();
  const effectiveLocale = locale ? normalizeLocale(locale) : await getPreferredLocale();
  return bundle.content[effectiveLocale];
}

function buildSnapshotPath(revision: string): string {
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  return `${SNAPSHOT_DIR}/${stamp}-${revision}.json`;
}

export async function saveContent(input: SaveContentPayload & { updatedBy: string }): Promise<{
  bundle: SiteBundle;
  snapshotPath: string;
  commitSha?: string;
}> {
  const { locale, content, expectedRevision, idempotencyKey, updatedBy } = input;

  if (!idempotencyKey || idempotencyKey.length < 8) {
    throw new Error("idempotencyKey mancante o non valido.");
  }

  const currentBundle = await getBundle();

  if (isGithubStoreConfigured()) {
    const latestBundle = await readBundleFromGitHubStore();
    if (latestBundle && latestBundle.meta.revision !== currentBundle.meta.revision) {
      throw new StaleRevisionError(
        "I contenuti sono stati aggiornati da un'altra sessione. Ricarica il pannello e riprova."
      );
    }
  }

  if (currentBundle.meta.idempotencyKey === idempotencyKey) {
    return {
      bundle: currentBundle,
      snapshotPath: "",
      commitSha: currentBundle.meta.commitSha,
    };
  }

  if (expectedRevision && currentBundle.meta.revision !== expectedRevision) {
    throw new StaleRevisionError(
      "I contenuti sono stati aggiornati da un'altra sessione. Ricarica il pannello e riprova."
    );
  }

  const revision = randomUUID();
  const updatedAt = new Date().toISOString();
  const snapshotPath = buildSnapshotPath(revision);

  const nextBundle: SiteBundle = {
    ...currentBundle,
    meta: {
      revision,
      updatedAt,
      updatedBy,
      idempotencyKey,
    },
    content: {
      ...currentBundle.content,
      [locale]: mergeContent(content),
    },
  };

  const bundleJson = `${JSON.stringify(nextBundle, null, 2)}\n`;
  const snapshotJson = bundleJson;

  if (isGithubStoreConfigured()) {
    try {
      const commit = await commitFilesAtomically({
        files: [
          { path: CONTENT_BUNDLE_FILE, content: bundleJson },
          { path: snapshotPath, content: snapshotJson },
        ],
        message: `cms: save ${locale} rev ${revision} [idempotency:${idempotencyKey}]`,
      });

      return {
        bundle: {
          ...nextBundle,
          meta: { ...nextBundle.meta, commitSha: commit.commitSha },
        },
        snapshotPath,
        commitSha: commit.commitSha,
      };
    } catch (error) {
      if (
        error instanceof GitHubStoreConfigError ||
        error instanceof GitHubStoreConflictError
      ) {
        throw error;
      }
      throw new Error(
        error instanceof Error
          ? `Salvataggio GitHub fallito: ${error.message}`
          : "Salvataggio GitHub fallito"
      );
    }
  }

  if (IS_VERCEL) {
    throw new PersistenceConfigError(
      "Configurazione GitHub mancante su Vercel. Imposta GITHUB_TOKEN e GITHUB_REPO."
    );
  }

  await fs.mkdir(path.dirname(LOCAL_BUNDLE_FILE), { recursive: true });
  await fs.mkdir(LOCAL_SNAPSHOT_DIR, { recursive: true });
  await fs.writeFile(LOCAL_BUNDLE_FILE, bundleJson, "utf8");
  await fs.writeFile(path.join(process.cwd(), snapshotPath), snapshotJson, "utf8");

  return { bundle: nextBundle, snapshotPath };
}
