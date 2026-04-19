import Image from 'next/image';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { User, MapPin } from 'lucide-react';
import { adminDb } from '@/lib/firebase/admin';
import { fetchListingsBySellerServer } from '@/lib/listings.server';
import { ListingCard } from '@/components/listing-card';
import type { AppUser } from '@/lib/types';

export const revalidate = 60;

interface Props {
  params: Promise<{ uid: string }>;
}

async function fetchSeller(uid: string): Promise<AppUser | null> {
  const snap = await adminDb.collection('users').doc(uid).get();
  if (!snap.exists) return null;
  const d = snap.data() ?? {};
  return {
    uid: snap.id,
    email: (d.email as string) ?? '',
    displayName: (d.displayName as string) ?? '',
    photoUrl: (d.photoUrl as string | null) ?? null,
    phone: (d.phone as string | null) ?? null,
    bio: (d.bio as string | null) ?? null,
    location: (d.location as string | null) ?? null,
    isVerified: (d.isVerified as boolean) ?? false,
    listingsCount: (d.listingsCount as number) ?? 0,
    createdAt: (d.createdAt as { toDate(): Date } | undefined)?.toDate() ?? new Date(),
    updatedAt: (d.updatedAt as { toDate(): Date } | undefined)?.toDate() ?? new Date(),
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { uid } = await params;
  const seller = await fetchSeller(uid);
  return {
    title: seller ? `${seller.displayName} — Vendeur` : 'Vendeur',
  };
}

export default async function SellerPage({ params }: Props) {
  const { uid } = await params;
  const [seller, listings] = await Promise.all([
    fetchSeller(uid),
    fetchListingsBySellerServer(uid),
  ]);
  if (!seller) notFound();

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6">
      <div className="flex flex-col items-center gap-4 rounded-2xl border bg-card p-8 text-center md:flex-row md:text-left">
        <div className="h-20 w-20 overflow-hidden rounded-full bg-muted">
          {seller.photoUrl ? (
            <Image src={seller.photoUrl} alt={seller.displayName} width={80} height={80} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-muted-foreground">
              <User className="h-8 w-8" />
            </div>
          )}
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{seller.displayName}</h1>
          {seller.location && (
            <p className="mt-1 flex items-center justify-center gap-1 text-sm text-muted-foreground md:justify-start">
              <MapPin className="h-3.5 w-3.5" />
              {seller.location}
            </p>
          )}
          {seller.bio && (
            <p className="mt-3 text-sm text-muted-foreground">{seller.bio}</p>
          )}
          <p className="mt-2 text-sm text-muted-foreground">
            {listings.length} annonce{listings.length > 1 ? 's' : ''} en ligne
          </p>
        </div>
      </div>

      <h2 className="mt-10 text-lg font-bold">Annonces du vendeur</h2>
      {listings.length === 0 ? (
        <p className="py-12 text-center text-muted-foreground">
          Aucune annonce active.
        </p>
      ) : (
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-5 xl:grid-cols-6">
          {listings.map((l) => (
            <ListingCard key={l.id} listing={l} />
          ))}
        </div>
      )}
    </div>
  );
}
