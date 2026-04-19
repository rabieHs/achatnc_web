import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { fetchListingsByCategoryServer } from '@/lib/listings.server';
import { ListingCard } from '@/components/listing-card';
import { getCategoryById, getSubcategories } from '@/lib/categories';

export const revalidate = 60;

interface Props {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ sub?: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const category = getCategoryById(id);
  if (!category) return { title: 'Catégorie' };
  return {
    title: `${category.name} — Annonces`,
    description: `Toutes les annonces dans la catégorie ${category.name} sur achats.nc`,
  };
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { id } = await params;
  const { sub } = await searchParams;
  const category = getCategoryById(id);
  if (!category) notFound();

  const subcategories = getSubcategories(id);
  const listings = await fetchListingsByCategoryServer(id, 60);

  // Legacy listings without a subcategoryId remain visible when any
  // subcategory is selected — mirrors mobile behaviour.
  const filtered = sub
    ? listings.filter(
        (l) =>
          l.subcategoryId === sub ||
          !l.subcategoryId ||
          l.subcategoryId.length === 0,
      )
    : listings;

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6">
      <h1 className="text-2xl font-bold">{category.name}</h1>

      {subcategories.length > 0 && (
        <div className="mt-4 -mx-4 flex gap-2 overflow-x-auto px-4 sm:-mx-6 sm:px-6">
          <Link
            href={`/categorie/${id}`}
            className={`whitespace-nowrap rounded-full border px-3 py-1.5 text-sm transition-colors ${
              !sub
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-border text-muted-foreground hover:bg-muted'
            }`}
          >
            Tout
          </Link>
          {subcategories.map((s) => (
            <Link
              key={s.id}
              href={`/categorie/${id}?sub=${s.id}`}
              className={`whitespace-nowrap rounded-full border px-3 py-1.5 text-sm transition-colors ${
                sub === s.id
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border text-muted-foreground hover:bg-muted'
              }`}
            >
              {s.name}
            </Link>
          ))}
        </div>
      )}

      <div className="mt-6">
        {filtered.length === 0 ? (
          <p className="py-12 text-center text-muted-foreground">
            Aucune annonce dans cette catégorie.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-5 xl:grid-cols-6">
            {filtered.map((l) => (
              <ListingCard key={l.id} listing={l} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
