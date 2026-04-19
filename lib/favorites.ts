'use client';

import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  increment,
  onSnapshot,
  serverTimestamp,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { db } from './firebase/client';

export async function addFavorite(userId: string, listingId: string) {
  await setDoc(doc(db, 'users', userId, 'favorites', listingId), {
    createdAt: serverTimestamp(),
  });
  await updateDoc(doc(db, 'listings', listingId), {
    favoritesCount: increment(1),
  }).catch(() => {});
}

export async function removeFavorite(userId: string, listingId: string) {
  await deleteDoc(doc(db, 'users', userId, 'favorites', listingId));
  await updateDoc(doc(db, 'listings', listingId), {
    favoritesCount: increment(-1),
  }).catch(() => {});
}

export function watchFavoriteIds(
  userId: string,
  callback: (ids: Set<string>) => void,
): () => void {
  return onSnapshot(collection(db, 'users', userId, 'favorites'), (snap) => {
    const set = new Set<string>();
    snap.forEach((doc) => set.add(doc.id));
    callback(set);
  });
}

export async function fetchFavoriteIds(userId: string): Promise<string[]> {
  const snap = await getDocs(collection(db, 'users', userId, 'favorites'));
  return snap.docs.map((d) => d.id);
}
