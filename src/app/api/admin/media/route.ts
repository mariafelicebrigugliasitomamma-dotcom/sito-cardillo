import { createHash } from "crypto";
import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SESSION_COOKIE, verifySession } from "@/lib/auth";
import {
  commitFilesAtomically,
  isGithubStoreConfigured,
  listDirectoryFromGitHub,
} from "@/lib/githubContentStore";

export const runtime = "nodejs";

const MAX_FILES = 3;
const MAX_BYTES = 700 * 1024;
const LOCAL_UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "cms");
const REPO_UPLOAD_DIR = "public/uploads/cms";
const ALLOWED_MIME = new Set(["image/webp", "image/jpeg", "image/png"]);

const EXT_BY_MIME: Record<string, string> = {
  "image/webp": "webp",
  "image/jpeg": "jpg",
  "image/png": "png",
};

async function isAuthed(): Promise<boolean> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  return (await verifySession(token)) !== null;
}

async function countExistingFiles(): Promise<string[]> {
  if (isGithubStoreConfigured()) {
    return listDirectoryFromGitHub(REPO_UPLOAD_DIR);
  }

  try {
    const names = await fs.readdir(LOCAL_UPLOAD_DIR, { withFileTypes: true });
    return names
      .filter((entry) => entry.isFile())
      .map((entry) => `${REPO_UPLOAD_DIR}/${entry.name}`);
  } catch {
    return [];
  }
}

export async function POST(req: Request) {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
  }

  const data = await req.formData();
  const file = data.get("file");
  const includeFallback = data.get("includeFallback") === "true";

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "File mancante" }, { status: 400 });
  }

  if (!ALLOWED_MIME.has(file.type)) {
    return NextResponse.json(
      { error: "Formato non supportato. Usa WEBP, JPG o PNG." },
      { status: 400 }
    );
  }

  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: `File troppo grande (${Math.round(file.size / 1024)} KB). Limite 700 KB.` },
      { status: 400 }
    );
  }

  const arrayBuffer = await file.arrayBuffer();
  const bytes = Buffer.from(arrayBuffer);
  const hash = createHash("sha256").update(bytes).digest("hex").slice(0, 18);
  const ext = EXT_BY_MIME[file.type] || "bin";
  const fileName = `${hash}.${ext}`;
  const repoPath = `${REPO_UPLOAD_DIR}/${fileName}`;

  const existing = await countExistingFiles();
  const existsAlready = existing.includes(repoPath);
  if (!existsAlready && existing.length >= MAX_FILES) {
    return NextResponse.json(
      { error: "Hai raggiunto il limite di 3 immagini CMS. Sostituisci una immagine esistente." },
      { status: 400 }
    );
  }

  if (isGithubStoreConfigured()) {
    await commitFilesAtomically({
      files: [{ path: repoPath, content: bytes.toString("base64"), encoding: "base64" }],
      message: `cms: upload media ${fileName}`,
    });
  } else {
    if (process.env.VERCEL) {
      return NextResponse.json(
        { error: "Upload media non configurato in produzione. Imposta GITHUB_TOKEN/GITHUB_REPO." },
        { status: 500 }
      );
    }

    await fs.mkdir(LOCAL_UPLOAD_DIR, { recursive: true });
    await fs.writeFile(path.join(LOCAL_UPLOAD_DIR, fileName), bytes);
  }

  return NextResponse.json({
    ok: true,
    url: `/uploads/cms/${fileName}`,
    mimeType: file.type,
    bytes: file.size,
    fallbackBase64: includeFallback ? bytes.toString("base64") : undefined,
  });
}
