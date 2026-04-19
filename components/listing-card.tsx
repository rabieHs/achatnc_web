import Link from 'next/link';
import Image from 'next/image';
import { MapPin, TrendingUp } from 'lucide-react';
import type { Listing } from '@/lib/types';
import { formatPrice } from '@/lib/format';
import { FavoriteButton } from './favorite-button';

interface Props {
  listing: Listing;
  compact?: boolean;
}

export function ListingCard({ listing, compact = false }: Props) {
  const isFeatured =
    !!listing.featuredUntil && listing.featuredUntil > new Date();

  return (
    <Link
      href={`/annonce/${listing.id}`}
      className="group block overflow-hidden rounded-2xl bg-card shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
        {listing.thumbnailUrl ? (
          <Image
            src={listing.thumbnailUrl}
            alt={listing.title}
            fill
            sizes={compact ? '160px' : '(max-width: 640px) 50vw, 25vw'}
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground">
            <span className="text-xs">Pas d&apos;image</span>
          </div>
        )}
        {isFeatured && (
          <div className="absolute left-2 top-2 flex items-center gap-1 rounded-md bg-primary px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary-foreground">
            <TrendingUp className="h-3 w-3" />
            Sponsorisé
          </div>
        )}
        <FavoriteButton listingId={listing.id} />
      </div>
      <div className="flex flex-col gap-1 p-3">
        <h3 className="line-clamp-2 text-sm font-medium leading-tight">
          {listing.title}
        </h3>
        <p className="text-base font-bold text-primary">
          {formatPrice(listing.price)}
        </p>
        <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
          <MapPin className="h-3 w-3" />
          <span className="truncate">{listing.location}</span>
        </div>
      </div>
    </Link>
  );
}
