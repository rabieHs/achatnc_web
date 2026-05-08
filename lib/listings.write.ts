'use client';

import {
  addDoc,
  collection,
  doc,
  increment,
  serverTimestamp,
  updateDoc,
  writeBatch,
} from 'firebase/firestore';
import {
  deleteObject,
  getDownloadURL,
  ref as storageRef,
  uploadBytes,
} from 'firebase/storage';
import { db, storage } from './firebase/client';
import type { ListingImage } from './types';

const LISTINGS = 'listings';

export interface CreateListingInput {
  sellerId: string;
  sellerName: string;
  sellerPhotoUrl: string | null;
  title: string;
  description: string;
  price: number; // in cents
  categoryId: string;
  categoryName: string;
  subcategoryId: string | null;
  subcategoryName: string | null;
  location: string;
  latitude: number | null;
  longitude: number | null;
  condition: string;
  categoryFields: Record<string, unknown>;
  files: File[];
}

export { generateSearchKeywords } from './search';
import { generateSearchKeywords as _genKw } from './search';

export async function createListing(
  input: CreateListingInput,
): Promise<string> {
  const { files, ...rest } = input;
  const now = serverTimestamp();

  // Create document first to get an ID
  const docRef = await addDoc(collection(db, LISTINGS), {
    ...rest,
    currency: 'XPF',
    status: 'active',
    favoritesCount: 0,
    viewsCount: 0,
    images: [],
    thumbnailUrl: null,
    createdAt: now,
    updatedAt: now,
    searchKeywords: _genKw(rest.title),
  });

  // Upload images in parallel
  const uploaded: ListingImage[] = await Promise.all(
    files.map(async (file, idx) => {
      const path = `listings/${docRef.id}/${idx}.${file.name.split('.').pop() ?? 'jpg'}`;
      const ref = storageRef(storage, path);
      await uploadBytes(ref, file);
      const url = await getDownloadURL(ref);
      return { url, path, order: idx };
    }),
  );

  if (uploaded.length > 0) {
    await updateDoc(docRef, {
      images: uploaded,
      thumbnailUrl: uploaded[0].url,
    });
  }

  // Bump user's listingsCount
  await updateDoc(doc(db, 'users', rest.sellerId), {
    listingsCount: increment(1),
    updatedAt: now,
  });

  return docRef.id;
}

export async function updateListing(
  listingId: string,
  patch: Partial<{
    title: string;
    description: string;
    price: number;
    categoryId: string;
    categoryName: string;
    subcategoryId: string | null;
    subcategoryName: string | null;
    location: string;
    latitude: number | null;
    longitude: number | null;
    condition: string;
    categoryFields: Record<string, unknown>;
  }>,
): Promise<void> {
  const payload: Record<string, unknown> = { ...patch, updatedAt: serverTimestamp() };
  if (patch.title) payload.searchKeywords = _genKw(patch.title);
  await updateDoc(doc(db, LISTINGS, listingId), payload);
}

export async function deleteListing(
  listingId: string,
  sellerId: string,
  images: ListingImage[],
): Promise<void> {
  // Delete images from Storage (best-effort)
  await Promise.allSettled(
    images.map((img) => {
      if (!img.path) return Promise.resolve();
      return deleteObject(storageRef(storage, img.path));
    }),
  );

  const batch = writeBatch(db);
  batch.delete(doc(db, LISTINGS, listingId));
  batch.update(doc(db, 'users', sellerId), {
    listingsCount: increment(-1),
    updatedAt: serverTimestamp(),
  });
  await batch.commit();
}
