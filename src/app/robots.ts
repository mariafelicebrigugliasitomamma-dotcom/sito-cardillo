import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { isUnderConstruction } from "@/lib/maintenance";

export default function robots(): MetadataRoute.Robots {
  if (isUnderConstruction()) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/api"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
