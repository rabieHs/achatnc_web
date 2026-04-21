import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit as qLimit,
  onSnapshot,
  orderBy,
  query,
  Timestamp,
  where,
  type DocumentData,
  type QueryDocumentSnapshot,
} from 'firebase/firestore';
import { db } from './firebase/client';
import { normalizeForSearch } from './search';
import type { Listing } from './types';
import { toDate, toDateOrNull } from './types';

const LISTINGS = 'listings';

function parseListing(snap: QueryDocumentSnapshot<DocumentData>): Listing {
  const d = snap.data();
  return {
    id: snap.id,
    sellerId: d.sellerId ?? '',
    sellerName: d.sellerName ?? '',
    sellerPhotoUrl: d.sellerPhotoUrl ?? null,
    title: d.title ?? '',
    description: d.description ?? '',
    price: d.price ?? 0,
    currency: d.currency ?? 'XPF',
    categoryId: d.categoryId ?? '',
    categoryName: d.categoryName ?? '',
    subcategoryId: d.subcategoryId ?? null,
    subcategoryName: d.subcategoryName ?? null,
    images: Array.isArray(d.images) ? d.images : [],
    thumbnailUrl: d.thumbnailUrl ?? null,
    location: d.location ?? '',
    latitude: typeof d.latitude === 'number' ? d.latitude : null,
    longitude: typeof d.longitude === 'number' ? d.longitude : null,
    condition: d.condition ?? 'good',
    status: d.status ?? 'active',
    favoritesCount: d.favoritesCount ?? 0,
    viewsCount: d.viewsCount ?? 0,
    createdAt: toDate(d.createdAt),
    updatedAt: toDate(d.updatedAt),
    featuredUntil: toDateOrNull(d.featuredUntil),
    searchKeywords: Array.isArray(d.searchKeywords) ? d.searchKeywords : [],
    categoryFields:
      d.categoryFields && typeof d.categoryFields === 'object'
        ? d.categoryFields
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

export async function fetchRecentListings(max = 20): Promise<Listing[]> {
  const q = query(
    collection(db, LISTINGS),
    where('status', '==', 'active'),
    orderBy('createdAt', 'desc'),
    qLimit(max),
  );
  const snap = await getDocs(q);
  return sortFeaturedFirst(snap.docs.map(parseListing));
}

export async function fetchFeaturedListings(max = 10): Promise<Listing[]> {
  const q = query(
    collection(db, LISTINGS),
    where('status', '==', 'active'),
    where('featuredUntil', '>', Timestamp.now()),
    orderBy('featuredUntil', 'desc'),
    qLimit(max),
  );
  const snap = await getDocs(q);
  return snap.docs.map(parseListing);
}

export async function fetchListingsByCategory(
  categoryId: string,
  max = 40,
): Promise<Listing[]> {
  const q = query(
    collection(db, LISTINGS),
    where('categoryId', '==', categoryId),
    where('status', '==', 'active'),
    orderBy('createdAt', 'desc'),
    qLimit(max),
  );
  const snap = await getDocs(q);
  return sortFeaturedFirst(snap.docs.map(parseListing));
}

export async function fetchListing(id: string): Promise<Listing | null> {
  const ref = doc(db, LISTINGS, id);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return parseListing(snap as QueryDocumentSnapshot<DocumentData>);
}

export async function searchListings(
  keyword: string,
  opts: { city?: string | null; max?: number } = {},
): Promise<Listing[]> {
  if (!keyword.trim()) return [];
  const { city, max = 60 } = opts;
  let q = query(
    collection(db, LISTINGS),
    where('status', '==', 'active'),
    where('searchKeywords', 'array-contains', normalizeForSearch(keyword)),
  );
  if (city) q = query(q, where('location', '==', city));
  q = query(q, qLimit(max));
  const snap = await getDocs(q);
  return sortFeaturedFirst(snap.docs.map(parseListing));
}

export function watchListing(
  id: string,
  callback: (listing: Listing | null) => void,
): () => void {
  return onSnapshot(doc(db, LISTINGS, id), (snap) => {
    if (!snap.exists()) {
      callback(null);
      return;
    }
    callback(parseListing(snap as QueryDocumentSnapshot<DocumentData>));
  });
}

export function watchRecentListings(
  callback: (listings: Listing[]) => void,
  max = 20,
): () => void {
  const q = query(
    collection(db, LISTINGS),
    where('status', '==', 'active'),
    orderBy('createdAt', 'desc'),
    qLimit(max),
  );
  return onSnapshot(q, (snap) => {
    callback(sortFeaturedFirst(snap.docs.map(parseListing)));
  });
}

// Server-side variants (use firebase-admin) — for SSR / API routes.
// We avoid importing firebase-admin into client bundles.
