import type { MetadataRoute } from "next";
import { getContent } from "@/lib/content";
import { SITE_URL } from "@/lib/site";

function withAlternates(url: string): MetadataRoute.Sitemap[number] {
  return {
    url,
    lastModified: new Date(),
    alternates: {
      languages: {
        it: url,
        en: `${url}?lang=en`,
      },
    },
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { team } = await getContent();
  const now = new Date();

  const statiche: MetadataRoute.Sitemap = [
    { ...withAlternates(SITE_URL), lastModified: now, changeFrequency: "monthly", priority: 1 },
    {
      ...withAlternates(`${SITE_URL}/studio`),
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.8,
    },
    {
      ...withAlternates(`${SITE_URL}/servizi`),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      ...withAlternates(`${SITE_URL}/professionisti`),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      ...withAlternates(`${SITE_URL}/contatti`),
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.7,
    },
    {
      ...withAlternates(`${SITE_URL}/informativa-privacy`),
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.4,
    },
  ];

  const profili: MetadataRoute.Sitemap = team.map((p) => ({
    ...withAlternates(`${SITE_URL}/professionisti/${p.slug}`),
    lastModified: now,
    changeFrequency: "yearly",
    priority: 0.6,
  }));

  return [...statiche, ...profili];
}
