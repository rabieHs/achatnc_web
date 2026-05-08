import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MapPin, Eye, Heart } from 'lucide-react';
import { fetchListingServer } from '@/lib/listings.server';
import { formatPrice, priceInEur, relativeTime } from '@/lib/format';
import { getCategoryById } from '@/lib/categories';
import { Badge } from '@/components/ui/badge';
import { ContactSellerButton } from '@/components/contact-seller-button';
import { FavoriteButton } from '@/components/favorite-button';
import { OwnerActions } from '@/components/owner-actions';

export const revalidate = 60;

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const listing = await fetchListingServer(id);
  if (!listing) return { title: 'Annonce introuvable' };

  const title = `${listing.title} · ${formatPrice(listing.price)}`;
  const description = listing.description.slice(0, 160);
  const image = listing.thumbnailUrl ?? undefined;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      images: image ? [image] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: image ? [image] : [],
    },
  };
}

const CONDITION_LABEL: Record<string, string> = {
  new: 'Neuf',
  like_new: 'Comme neuf',
  good: 'Bon état',
  fair: 'État correct',
  poor: 'À réparer',
};

export default async function ListingDetailPage({ params }: Props) {
  const { id } = await params;
  const listing = await fetchListingServer(id);
  if (!listing) notFound();

  const category = getCategoryById(listing.categoryId);
  const conditionLabel = CONDITION_LABEL[listing.condition] ?? '';
  const images = listing.images.length > 0 ? listing.images : null;

  return (
    <article className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6">
      {/* Gallery */}
      {images && images.length > 1 ? (
        <>
          {/* Mobile gallery */}
          <div className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-3 md:hidden">
            {images.map((img, i) => (
              <div
                key={img.path ?? i}
                className="relative aspect-[4/3] w-[85vw] flex-none snap-center overflow-hidden rounded-2xl bg-muted"
              >
                <Image
                  src={img.url}
                  alt={i === 0 ? listing.title : `${listing.title} - photo ${i + 1}`}
                  fill
                  className="object-cover"
                  priority={i === 0}
                  sizes="85vw"
                />
                <div className="absolute bottom-2 right-2 rounded-full bg-black/60 px-2 py-1 text-xs font-medium text-white">
                  {i + 1}/{images.length}
                </div>
              </div>
            ))}
          </div>

          {/* Desktop gallery */}
          <div className="hidden h-[480px] grid-cols-4 grid-rows-2 gap-2 overflow-hidden rounded-2xl md:grid">
            <div className="relative col-span-2 row-span-2 overflow-hidden rounded-l-2xl bg-muted">
              <Image
                src={images[0].url}
                alt={listing.title}
                fill
                className="object-cover"
                priority
                sizes="50vw"
              />
            </div>
            {images.slice(1, 5).map((img, i) => (
              <div
                key={img.path ?? i}
                className="relative overflow-hidden bg-muted"
              >
                <Image
                  src={img.url}
                  alt={`${listing.title} - photo ${i + 2}`}
                  fill
                  className="object-cover"
                  sizes="25vw"
                />
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="relative mx-auto aspect-[4/3] w-full max-w-3xl overflow-hidden rounded-2xl bg-muted">
          {images?.[0] ? (
            <Image
              src={images[0].url}
              alt={listing.title}
              fill
              className="object-contain"
              priority
              sizes="(max-width: 768px) 100vw, 768px"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-muted-foreground">
              Pas d&apos;image
            </div>
          )}
        </div>
      )}

      <div className="mt-6 grid gap-8 md:grid-cols-[1fr_320px]">
        {/* Main column */}
        <div>
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            {category && (
              <Link
                href={`/categorie/${category.id}`}
                className="hover:text-foreground"
              >
                {category.name}
              </Link>
            )}
            {listing.subcategoryName && (
              <>
                <span>›</span>
                <span>{listing.subcategoryName}</span>
              </>
            )}
          </div>

          <h1 className="mt-2 text-2xl font-bold leading-tight md:text-3xl">
            {listing.title}
          </h1>

          <div className="mt-3 flex flex-wrap items-baseline gap-2">
            <span className="text-3xl font-bold text-primary">
              {formatPrice(listing.price)}
            </span>
            <span className="text-sm text-muted-foreground">
              ≈ {priceInEur(listing.price)}
            </span>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {conditionLabel && <Badge variant="secondary">{conditionLabel}</Badge>}
            <Badge variant="outline" className="gap-1">
              <MapPin className="h-3 w-3" />
              {listing.location}
            </Badge>
            <Badge variant="outline" className="gap-1">
              <Eye className="h-3 w-3" />
              {listing.viewsCount}
            </Badge>
            <Badge variant="outline" className="gap-1">
              <Heart className="h-3 w-3" />
              {listing.favoritesCount}
            </Badge>
          </div>

          <div className="mt-6 border-t pt-6">
            <h2 className="text-lg font-semibold">Description</h2>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
              {listing.description || 'Aucune description.'}
            </p>
          </div>

          {Object.keys(listing.categoryFields).length > 0 && (
            <div className="mt-6 border-t pt-6">
              <h2 className="text-lg font-semibold">Détails</h2>
              <dl className="mt-2 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                {Object.entries(listing.categoryFields).map(([k, v]) => (
                  <div key={k}>
                    <dt className="text-xs uppercase tracking-wide text-muted-foreground">
                      {k}
                    </dt>
                    <dd className="font-medium">{String(v)}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          <p className="mt-6 text-xs text-muted-foreground">
            Publiée {relativeTime(listing.createdAt)}
          </p>
        </div>

        {/* Side: seller + contact */}
        <aside className="md:sticky md:top-24 md:self-start">
          <div className="rounded-2xl border bg-card p-4">
            <Link
              href={`/vendeur/${listing.sellerId}`}
              className="flex items-center gap-3"
            >
              <div className="h-10 w-10 overflow-hidden rounded-full bg-muted">
                {listing.sellerPhotoUrl && (
                  <Image
                    src={listing.sellerPhotoUrl}
                    alt={listing.sellerName}
                    width={40}
                    height={40}
                    className="h-full w-full object-cover"
                  />
                )}
              </div>
              <div>
                <p className="text-sm font-medium">{listing.sellerName}</p>
                <p className="text-xs text-muted-foreground">Voir le profil</p>
              </div>
            </Link>
            <div className="mt-4 flex flex-col gap-2">
              <ContactSellerButton
                listingId={listing.id}
                listingTitle={listing.title}
                listingThumbnail={listing.thumbnailUrl}
                sellerId={listing.sellerId}
                sellerName={listing.sellerName}
                sellerPhotoUrl={listing.sellerPhotoUrl}
              />
              <OwnerActions
                listingId={listing.id}
                sellerId={listing.sellerId}
                featuredUntil={listing.featuredUntil}
                images={listing.images}
              />
              <FavoriteButton listingId={listing.id} variant="detail" />
            </div>
          </div>
        </aside>
      </div>

      {/* JSON-LD structured data for Google */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: listing.title,
            description: listing.description,
            image: listing.images.map((i) => i.url),
            offers: {
              '@type': 'Offer',
              price: listing.price / 100,
              priceCurrency: 'XPF',
              availability:
                listing.status === 'active'
                  ? 'https://schema.org/InStock'
                  : 'https://schema.org/OutOfStock',
            },
          }),
        }}
      />
    </article>
  );
}
