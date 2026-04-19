import type { MetadataRoute } from 'next';
import { fetchAllActiveListingIds } from '@/lib/listings.server';
import { CATEGORIES } from '@/lib/categories';

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://achats.nc';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${BASE}/`, changeFrequency: 'hourly', priority: 1 },
    { url: `${BASE}/categories`, changeFrequency: 'weekly', priority: 0.6 },
    { url: `${BASE}/recherche`, changeFrequency: 'weekly', priority: 0.5 },
    { url: `${BASE}/compte/mentions-legales`, changeFrequency: 'yearly', priority: 0.2 },
  ];

  const categoryRoutes: MetadataRoute.Sitemap = CATEGORIES.map((c) => ({
    url: `${BASE}/categorie/${c.id}`,
    changeFrequency: 'daily',
    priority: 0.7,
  }));

  let listingRoutes: MetadataRoute.Sitemap = [];
  try {
    const ids = await fetchAllActiveListingIds();
    listingRoutes = ids.map((id) => ({
      url: `${BASE}/annonce/${id}`,
      changeFrequency: 'weekly',
      priority: 0.6,
    }));
  } catch (err) {
    console.warn('sitemap: skipping listings', err);
  }

  return [...staticRoutes, ...categoryRoutes, ...listingRoutes];
}
