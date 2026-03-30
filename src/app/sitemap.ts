import type { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://safeebot.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const locales = ["az", "en", "ru"];

  const publicRoutes = [
    "",
    "/privacy",
    "/terms",
    "/consent",
  ];

  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const route of publicRoutes) {
      entries.push({
        url: `${BASE_URL}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: route === "" ? "weekly" : "monthly",
        priority: route === "" ? 1.0 : 0.5,
      });
    }
  }

  // Non-localized JSA page
  entries.push({
    url: `${BASE_URL}/jsa`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  });

  return entries;
}
