'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  collection, onSnapshot, orderBy, query, where,
} from 'firebase/firestore';
import { toast } from 'sonner';
import { Edit3, Trash2 } from 'lucide-react';
import { db } from '@/lib/firebase/client';
import { useAuth } from '@/lib/auth-context';
import type { Listing } from '@/lib/types';
import { ListingCard } from '@/components/listing-card';
import { Button } from '@/components/ui/button';
import { deleteListing } from '@/lib/listings.write';

export default function MyListingsPage() {
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
    const q = query(
      collection(db, 'listings'),
      where('sellerId', '==', user.uid),
      orderBy('createdAt', 'desc'),
    );
    return onSnapshot(q, (snap) => {
      setListings(
        snap.docs.map((doc) => {
          const d = doc.data();
          return {
            id: doc.id,
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
      setLoading(false);
    });
  }, [user, authLoading, router]);

  async function onDelete(l: Listing) {
    if (!user) return;
    if (!window.confirm(`Supprimer "${l.title}" ? Cette action est irréversible.`)) return;
    try {
      await deleteListing(l.id, user.uid, l.images);
      toast.success('Annonce supprimée');
    } catch (err) {
      console.error(err);
      toast.error('Erreur à la suppression');
    }
  }

  if (!user) return null;

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Mes annonces</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {listings.length} annonce{listings.length > 1 ? 's' : ''}
          </p>
        </div>
        <Button asChild>
          <Link href="/publier">Nouvelle annonce</Link>
        </Button>
      </div>

      {loading ? (
        <p className="py-12 text-center text-muted-foreground">Chargement...</p>
      ) : listings.length === 0 ? (
        <p className="py-12 text-center text-muted-foreground">
          Vous n&apos;avez pas encore publié d&apos;annonce.
        </p>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-4 xl:grid-cols-5">
          {listings.map((l) => (
            <div key={l.id} className="space-y-2">
              <ListingCard listing={l} />
              <div className="flex gap-2">
                <Button asChild size="sm" variant="outline" className="flex-1">
                  <Link href={`/annonce/${l.id}/modifier`}>
                    <Edit3 className="mr-1 h-3.5 w-3.5" />
                    Modifier
                  </Link>
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-destructive hover:text-destructive"
                  onClick={() => onDelete(l)}
                  aria-label="Supprimer"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
