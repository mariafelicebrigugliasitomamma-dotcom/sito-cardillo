import "server-only";

type GitHubConfig = {
  owner: string;
  repo: string;
  branch: string;
  token: string;
};

type CommitFileInput = {
  path: string;
  content: string;
  encoding?: "utf-8" | "base64";
};

type GitHubRefResponse = {
  object?: {
    sha?: string;
  };
};

type GitHubCommitResponse = {
  sha?: string;
  tree?: {
    sha?: string;
  };
};

type GitHubBlobResponse = {
  sha?: string;
};

type GitHubTreeResponse = {
  sha?: string;
};

type GitHubContentsResponse = {
  type?: string;
  content?: string;
  encoding?: string;
};

const API_BASE = "https://api.github.com";

export class GitHubStoreConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "GitHubStoreConfigError";
  }
}

export class GitHubStoreConflictError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "GitHubStoreConflictError";
  }
}

function parseRepoName(value: string): { owner: string; repo: string } {
  const [owner, repo] = value.split("/");
  if (!owner || !repo) {
    throw new GitHubStoreConfigError(
      "GITHUB_REPO deve essere nel formato owner/repo."
    );
  }
  return { owner, repo };
}

function getConfig(): GitHubConfig {
  const token = process.env.GITHUB_TOKEN;
  const repoName = process.env.GITHUB_REPO;
  const branch = process.env.GITHUB_BRANCH || "main";

  if (!token || !repoName) {
    throw new GitHubStoreConfigError(
      "Configurazione GitHub mancante. Imposta GITHUB_TOKEN e GITHUB_REPO."
    );
  }

  const { owner, repo } = parseRepoName(repoName);
  return { owner, repo, branch, token };
}

export function isGithubStoreConfigured(): boolean {
  return Boolean(process.env.GITHUB_TOKEN && process.env.GITHUB_REPO);
}

async function githubRequest<T>(
  config: GitHubConfig,
  pathname: string,
  init?: RequestInit,
  allowNotFound = false
): Promise<T | null> {
  const res = await fetch(`${API_BASE}${pathname}`, {
    ...init,
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${config.token}`,
      "User-Agent": "disalvo-cms-content-store",
      "X-GitHub-Api-Version": "2022-11-28",
      ...(init?.headers || {}),
    },
    cache: "no-store",
  });

  if (allowNotFound && res.status === 404) return null;

  if (!res.ok) {
    const raw = await res.text();
    throw new Error(`GitHub API ${pathname} -> ${res.status}: ${raw}`);
  }

  return (await res.json()) as T;
}

async function getHeadSha(config: GitHubConfig): Promise<string> {
  const ref = await githubRequest<GitHubRefResponse>(
    config,
    `/repos/${config.owner}/${config.repo}/git/ref/heads/${encodeURIComponent(
      config.branch
    )}`
  );

  const sha = ref?.object?.sha;
  if (!sha) {
    throw new Error(`Impossibile leggere la ref heads/${config.branch}.`);
  }
  return sha;
}

async function getCommitTreeSha(
  config: GitHubConfig,
  commitSha: string
): Promise<string> {
  const commit = await githubRequest<GitHubCommitResponse>(
    config,
    `/repos/${config.owner}/${config.repo}/git/commits/${commitSha}`
  );
  const treeSha = commit?.tree?.sha;
  if (!treeSha) {
    throw new Error(`Commit ${commitSha} privo di tree.`);
  }
  return treeSha;
}

async function createBlob(
  config: GitHubConfig,
  file: CommitFileInput
): Promise<string> {
  const payload = {
    content: file.content,
    encoding: file.encoding ?? "utf-8",
  };

  const blob = await githubRequest<GitHubBlobResponse>(
    config,
    `/repos/${config.owner}/${config.repo}/git/blobs`,
    {
      method: "POST",
      body: JSON.stringify(payload),
    }
  );

  const sha = blob?.sha;
  if (!sha) {
    throw new Error(`Blob non creato per ${file.path}.`);
  }

  return sha;
}

export async function readTextFileFromGitHub(
  filePath: string
): Promise<string | null> {
  const config = getConfig();
  const encodedPath = filePath
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");

  const content = await githubRequest<GitHubContentsResponse>(
    config,
    `/repos/${config.owner}/${config.repo}/contents/${encodedPath}?ref=${encodeURIComponent(
      config.branch
    )}`,
    undefined,
    true
  );

  if (!content) return null;
  if (content.type !== "file") {
    throw new Error(`${filePath} non e' un file.`);
  }

  const encoded = content.content;
  if (!encoded) return null;

  if (content.encoding === "base64") {
    return Buffer.from(encoded.replace(/\n/g, ""), "base64").toString("utf8");
  }

  return encoded;
}

export async function listDirectoryFromGitHub(dirPath: string): Promise<string[]> {
  const config = getConfig();
  const encodedPath = dirPath
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");

  const res = await fetch(
    `${API_BASE}/repos/${config.owner}/${config.repo}/contents/${encodedPath}?ref=${encodeURIComponent(
      config.branch
    )}`,
    {
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${config.token}`,
        "User-Agent": "disalvo-cms-content-store",
        "X-GitHub-Api-Version": "2022-11-28",
      },
      cache: "no-store",
    }
  );

  if (res.status === 404) return [];
  if (!res.ok) {
    const raw = await res.text();
    throw new Error(`GitHub API list ${dirPath} -> ${res.status}: ${raw}`);
  }

  const data = (await res.json()) as Array<{ path?: string; type?: string }>;
  return data
    .filter((item) => item.type === "file" && typeof item.path === "string")
    .map((item) => item.path as string);
}

export async function commitFilesAtomically(input: {
  files: CommitFileInput[];
  message: string;
  expectedHeadSha?: string;
}): Promise<{ commitSha: string; headSha: string }> {
  const config = getConfig();
  const headSha = await getHeadSha(config);

  if (input.expectedHeadSha && input.expectedHeadSha !== headSha) {
    throw new GitHubStoreConflictError(
      "Il repository e' cambiato durante il salvataggio. Ricarica e riprova."
    );
  }

  const baseTreeSha = await getCommitTreeSha(config, headSha);

  const treeEntries = await Promise.all(
    input.files.map(async (file) => {
      const blobSha = await createBlob(config, file);
      return {
        path: file.path,
        mode: "100644",
        type: "blob",
        sha: blobSha,
      };
    })
  );

  const tree = await githubRequest<GitHubTreeResponse>(
    config,
    `/repos/${config.owner}/${config.repo}/git/trees`,
    {
      method: "POST",
      body: JSON.stringify({
        base_tree: baseTreeSha,
        tree: treeEntries,
      }),
    }
  );

  const newTreeSha = tree?.sha;
  if (!newTreeSha) {
    throw new Error("Tree GitHub non creato.");
  }

  const commit = await githubRequest<GitHubCommitResponse>(
    config,
    `/repos/${config.owner}/${config.repo}/git/commits`,
    {
      method: "POST",
      body: JSON.stringify({
        message: input.message,
        tree: newTreeSha,
        parents: [headSha],
      }),
    }
  );

  const commitSha = commit?.sha;
  if (!commitSha) {
    throw new Error("Commit GitHub non creato.");
  }

  const updateRefRes = await fetch(
    `${API_BASE}/repos/${config.owner}/${config.repo}/git/refs/heads/${encodeURIComponent(
      config.branch
    )}`,
    {
      method: "PATCH",
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${config.token}`,
        "User-Agent": "disalvo-cms-content-store",
        "X-GitHub-Api-Version": "2022-11-28",
      },
      body: JSON.stringify({ sha: commitSha, force: false }),
      cache: "no-store",
    }
  );

  if (updateRefRes.status === 409 || updateRefRes.status === 422) {
    throw new GitHubStoreConflictError(
      "Conflitto di aggiornamento GitHub: il branch e' avanzato."
    );
  }

  if (!updateRefRes.ok) {
    const raw = await updateRefRes.text();
    throw new Error(`Update ref fallito (${updateRefRes.status}): ${raw}`);
  }

  return { commitSha, headSha };
}
