import 'server-only';
import { Timestamp } from 'firebase-admin/firestore';
import { adminDb } from './firebase/admin';
import type { Listing } from './types';
import { toDate, toDateOrNull } from './types';

const LISTINGS = 'listings';

interface AdminSnapshot {
  id: string;
  data(): Record<string, unknown> | undefined;
}

function parseListing(snap: AdminSnapshot): Listing {
  const d = (snap.data() ?? {}) as Record<string, unknown>;
  return {
    id: snap.id,
    sellerId: (d.sellerId as string) ?? '',
    sellerName: (d.sellerName as string) ?? '',
    sellerPhotoUrl: (d.sellerPhotoUrl as string | null) ?? null,
    title: (d.title as string) ?? '',
    description: (d.description as string) ?? '',
    price: (d.price as number) ?? 0,
    currency: (d.currency as string) ?? 'XPF',
    categoryId: (d.categoryId as string) ?? '',
    categoryName: (d.categoryName as string) ?? '',
    subcategoryId: (d.subcategoryId as string | null) ?? null,
    subcategoryName: (d.subcategoryName as string | null) ?? null,
    images: (Array.isArray(d.images) ? d.images : []) as Listing['images'],
    thumbnailUrl: (d.thumbnailUrl as string | null) ?? null,
    location: (d.location as string) ?? '',
    latitude: typeof d.latitude === 'number' ? d.latitude : null,
    longitude: typeof d.longitude === 'number' ? d.longitude : null,
    condition: (d.condition as Listing['condition']) ?? 'good',
    status: (d.status as Listing['status']) ?? 'active',
    favoritesCount: (d.favoritesCount as number) ?? 0,
    viewsCount: (d.viewsCount as number) ?? 0,
    // admin Timestamp has toDate() just like client, compatible signature
    createdAt: toDate(d.createdAt as never),
    updatedAt: toDate(d.updatedAt as never),
    featuredUntil: toDateOrNull(d.featuredUntil as never),
    searchKeywords: (Array.isArray(d.searchKeywords)
      ? d.searchKeywords
      : []) as string[],
    categoryFields:
      d.categoryFields && typeof d.categoryFields === 'object'
        ? (d.categoryFields as Record<string, unknown>)
        : {},
  };
}

function sortFeaturedFirst(listings: Listing[]): Listing[] {
  const now = new Date();
  return [...listings].sort((a, b) => {
    const aFeat = a.featuredUntil && a.featuredUntil > now;
    const bFeat = b.featuredUntil && b.featuredUntil > now;
    if (aFeat && !bFeat) return -1;
    if (!aFeat && bFeat) return 1;
    if (aFeat && bFeat) {
      return b.featuredUntil!.getTime() - a.featuredUntil!.getTime();
    }
    return b.createdAt.getTime() - a.createdAt.getTime();
  });
}

export async function fetchListingServer(id: string): Promise<Listing | null> {
  const snap = await adminDb.collection(LISTINGS).doc(id).get();
  if (!snap.exists) return null;
  return parseListing(snap);
}

export async function fetchRecentListingsServer(
  max = 20,
): Promise<Listing[]> {
  const snap = await adminDb
    .collection(LISTINGS)
    .where('status', '==', 'active')
    .orderBy('createdAt', 'desc')
    .limit(max)
    .get();
  return sortFeaturedFirst(snap.docs.map(parseListing));
}

export async function fetchFeaturedListingsServer(
  max = 10,
): Promise<Listing[]> {
  try {
    const snap = await adminDb
      .collection(LISTINGS)
      .where('status', '==', 'active')
      .where('featuredUntil', '>', Timestamp.now())
      .orderBy('featuredUntil', 'desc')
      .limit(max)
      .get();
    return snap.docs.map(parseListing);
  } catch (err) {
    // Composite index not yet created — render the page without a
    // sponsored carousel instead of 500-ing.
    console.warn('fetchFeaturedListingsServer:', (err as Error).message);
    return [];
  }
}

export async function fetchListingsByCategoryServer(
  categoryId: string,
  max = 40,
): Promise<Listing[]> {
  const snap = await adminDb
    .collection(LISTINGS)
    .where('categoryId', '==', categoryId)
    .where('status', '==', 'active')
    .orderBy('createdAt', 'desc')
    .limit(max)
    .get();
  return sortFeaturedFirst(snap.docs.map(parseListing));
}

export async function fetchListingsBySellerServer(
  sellerId: string,
  max = 60,
): Promise<Listing[]> {
  const snap = await adminDb
    .collection(LISTINGS)
    .where('sellerId', '==', sellerId)
    .where('status', '==', 'active')
    .orderBy('createdAt', 'desc')
    .limit(max)
    .get();
  return sortFeaturedFirst(snap.docs.map(parseListing));
}

export async function fetchAllActiveListingIds(): Promise<string[]> {
  // Document IDs come with the doc snapshot — no need to select fields.
  const snap = await adminDb
    .collection(LISTINGS)
    .where('status', '==', 'active')
    .select() // select nothing, only get doc IDs
    .get();
  return snap.docs.map((d) => d.id);
}
