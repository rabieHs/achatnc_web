import Link from 'next/link';
import Image from 'next/image';
import { MapPin, TrendingUp, Clock } from 'lucide-react';
import type { Listing } from '@/lib/types';
import { formatPrice, relativeTime } from '@/lib/format';

interface Props {
  listing: Listing;
}

export function ListingRow({ listing }: Props) {
  const isFeatured =
    !!listing.featuredUntil && listing.featuredUntil > new Date();

  return (
    <Link
      href={`/annonce/${listing.id}`}
      className="group flex gap-4 overflow-hidden rounded-xl border bg-card p-3 transition-colors hover:bg-accent"
    >
      <div className="relative h-28 w-36 flex-shrink-0 overflow-hidden rounded-lg bg-muted sm:h-32 sm:w-44">
        {listing.thumbnailUrl ? (
          <Image
            src={listing.thumbnailUrl}
            alt={listing.title}
            fill
            sizes="180px"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
            Pas d&apos;image
          </div>
        )}
        {isFeatured && (
          <div className="absolute left-1.5 top-1.5 flex items-center gap-1 rounded-md bg-primary px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-primary-foreground">
            <TrendingUp className="h-2.5 w-2.5" />
            Sponsorisé
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col py-1 min-w-0">
        <h3 className="line-clamp-2 text-base font-semibold leading-tight">
          {listing.title}
        </h3>
        <p className="mt-1 text-xl font-bold text-primary">
          {formatPrice(listing.price)}
        </p>
        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
          {listing.description || '—'}
        </p>
        <div className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-1 pt-2 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {listing.location}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {relativeTime(listing.createdAt)}
          </span>
          {listing.subcategoryName && (
            <span className="rounded-md bg-muted px-1.5 py-0.5 text-[10px] uppercase tracking-wide">
              {listing.subcategoryName}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
