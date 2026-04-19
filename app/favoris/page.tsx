'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import { useAuth } from '@/lib/auth-context';
import { watchFavoriteIds } from '@/lib/favorites';
import { ListingCard } from '@/components/listing-card';
import type { Listing } from '@/lib/types';

async function fetchListingsByIds(ids: string[]): Promise<Listing[]> {
  const results = await Promise.all(
    ids.map(async (id) => {
      const snap = await getDoc(doc(db, 'listings', id));
      if (!snap.exists()) return null;
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
        images: d.images ?? [],
        thumbnailUrl: d.thumbnailUrl ?? null,
        location: d.location ?? '',
        latitude: d.latitude ?? null,
        longitude: d.longitude ?? null,
        condition: d.condition ?? 'good',
        status: d.status ?? 'active',
        favoritesCount: d.favoritesCount ?? 0,
        viewsCount: d.viewsCount ?? 0,
        createdAt: d.createdAt?.toDate() ?? new Date(),
        updatedAt: d.updatedAt?.toDate() ?? new Date(),
        featuredUntil: d.featuredUntil?.toDate() ?? null,
        searchKeywords: d.searchKeywords ?? [],
        categoryFields: d.categoryFields ?? {},
      } as Listing;
    }),
  );
  return results.filter((l): l is Listing => l !== null);
}

export default function FavoritesPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.replace('/login');
      return;
    }
    return watchFavoriteIds(user.uid, async (set) => {
      setLoading(true);
      const arr = await fetchListingsByIds(Array.from(set));
      setListings(arr);
      setLoading(false);
    });
  }, [user, authLoading, router]);

  if (!user) return null;

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-bold">Mes favoris</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        {listings.length} annonce{listings.length > 1 ? 's' : ''} enregistrée{listings.length > 1 ? 's' : ''}
      </p>

      <div className="mt-6">
        {loading ? (
          <p className="py-12 text-center text-muted-foreground">Chargement...</p>
        ) : listings.length === 0 ? (
          <p className="py-12 text-center text-muted-foreground">
            Vous n&apos;avez pas encore d&apos;annonces en favoris.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-5 xl:grid-cols-6">
            {listings.map((l) => (
              <ListingCard key={l.id} listing={l} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
