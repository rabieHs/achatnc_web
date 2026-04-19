import type { MetadataRoute } from 'next';

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://achats.nc';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/compte/', '/messages/', '/publier', '/favoris'],
      },
    ],
    sitemap: `${BASE}/sitemap.xml`,
  };
}
