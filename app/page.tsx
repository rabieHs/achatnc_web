import Link from 'next/link';
import { TrendingUp, MapPin, ArrowRight, Search } from 'lucide-react';
import {
  fetchFeaturedListingsServer,
  fetchRecentListingsServer,
} from '@/lib/listings.server';
import { ListingCard } from '@/components/listing-card';
import { CATEGORIES } from '@/lib/categories';
import { NC_CITIES_MAJOR } from '@/lib/cities';

export const revalidate = 60; // ISR: re-render every minute

export default async function HomePage() {
  const [featured, recent] = await Promise.all([
    fetchFeaturedListingsServer(10),
    fetchRecentListingsServer(24),
  ]);

  return (
    <div className="w-full">
      {/* Hero */}
      <section className="relative overflow-hidden border-b bg-gradient-to-b from-primary/10 via-primary/5 to-transparent">
        <div className="mx-auto w-full max-w-4xl px-4 py-14 text-center sm:px-6 md:py-20">
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
            Petites annonces et ventes{' '}
            <span className="text-primary">entre particuliers</span>
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-muted-foreground md:text-lg">
            Achetez et vendez près de chez vous. Véhicules, immobilier,
            électronique et bien plus.
          </p>

          <form
            action="/recherche"
            className="mx-auto mt-8 flex w-full max-w-2xl items-center gap-2 overflow-hidden rounded-full border border-border bg-card p-1.5 shadow-sm focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20"
          >
            <Search className="ml-3 h-5 w-5 flex-shrink-0 text-muted-foreground" />
            <input
              type="text"
              name="q"
              placeholder="Que recherchez-vous ?"
              className="h-11 min-w-0 flex-1 bg-transparent text-sm outline-none"
            />
            <button
              type="submit"
              className="h-11 shrink-0 rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 sm:px-6"
            >
              Rechercher
            </button>
          </form>

          {/* City quick-filters */}
          <div className="mx-auto mt-5 flex max-w-2xl flex-wrap items-center justify-center gap-2">
            <span className="text-xs font-medium text-muted-foreground">
              Villes populaires :
            </span>
            {NC_CITIES_MAJOR.slice(0, 6).map((city) => (
              <Link
                key={city}
                href={`/recherche?city=${encodeURIComponent(city)}`}
                className="inline-flex items-center gap-1 rounded-full border border-border bg-card px-3 py-1 text-xs transition-colors hover:border-primary hover:text-primary"
              >
                <MapPin className="h-3 w-3" />
                {city}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6">
        {/* Categories bar — shows all 14, scrollable on mobile, wraps on desktop */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-bold">Parcourir par catégorie</h2>
            <Link
              href="/categories"
              className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
            >
              Voir tout
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <ul className="flex gap-3 overflow-x-auto pb-2 md:grid md:grid-cols-7 md:gap-3 md:overflow-visible md:pb-0 lg:grid-cols-7">
            {CATEGORIES.slice(0, 14).map(({ id, name, icon: Icon }) => (
              <li key={id}>
                <Link
                  href={`/categorie/${id}`}
                  className="group flex w-24 flex-shrink-0 flex-col items-center gap-2 rounded-xl border border-transparent p-3 text-center transition-all hover:border-border hover:bg-card hover:shadow-sm md:w-auto"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 transition-colors group-hover:bg-primary/20">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <span className="line-clamp-2 text-[11px] font-medium leading-tight">
                    {name}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* Sponsored */}
        {featured.length > 0 && (
          <section className="mt-10">
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10">
                <TrendingUp className="h-4 w-4 text-primary" />
              </div>
              <h2 className="text-base font-bold text-primary">
                Annonces sponsorisées
              </h2>
            </div>
            <div className="-mx-4 overflow-x-auto px-4 sm:-mx-6 sm:px-6">
              <div className="flex gap-3 pb-2 md:gap-4">
                {featured.map((listing) => (
                  <div
                    key={listing.id}
                    className="w-44 flex-shrink-0 sm:w-52"
                  >
                    <ListingCard listing={listing} compact />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Recent */}
        <section className="mt-10">
          <div className="mb-4 flex items-end justify-between">
            <div>
              <h2 className="text-base font-bold">Annonces récentes</h2>
              <p className="text-xs text-muted-foreground">
                Les dernières annonces publiées
              </p>
            </div>
            <Link
              href="/categories"
              className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
            >
              Voir tout
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          {recent.length === 0 ? (
            <p className="py-12 text-center text-muted-foreground">
              Aucune annonce pour le moment.
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-5 xl:grid-cols-6">
              {recent.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          )}
        </section>

        {/* CTA band */}
        <section className="mt-12 overflow-hidden rounded-2xl bg-primary/5 p-6 md:p-10">
          <div className="flex flex-col items-start gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-bold md:text-2xl">
                Vous avez quelque chose à vendre ?
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Déposez votre annonce en quelques minutes et touchez des milliers d&apos;acheteurs en Nouvelle-Calédonie.
              </p>
            </div>
            <Link
              href="/publier"
              className="inline-flex h-11 items-center gap-2 whitespace-nowrap rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
            >
              Déposer une annonce
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
