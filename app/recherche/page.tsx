'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { searchListings } from '@/lib/listings';
import type { Listing } from '@/lib/types';
import { ListingRow } from '@/components/listing-row';
import { NC_CITIES_MAJOR } from '@/lib/cities';

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6">
          <div className="mx-auto h-14 w-full max-w-2xl animate-pulse rounded-full bg-muted" />
        </div>
      }
    >
      <SearchPageInner />
    </Suspense>
  );
}

function SearchPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const q = searchParams.get('q') ?? '';
  const city = searchParams.get('city');

  const [results, setResults] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!q) return;

    let cancelled = false;
    setLoading(true);

    searchListings(q, { city })
      .then((r) => {
        if (!cancelled) setResults(r);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [q, city]);

  function selectCity(next: string | null) {
    const params = new URLSearchParams();

    if (q) params.set('q', q);
    if (next) params.set('city', next);

    const queryString = params.toString();
    router.push(queryString ? `/recherche?${queryString}` : '/recherche');
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6">
      <form
        action="/recherche"
        method="get"
        className="mx-auto flex w-full max-w-2xl items-center gap-2 overflow-hidden rounded-full border border-border bg-card p-1.5 shadow-sm focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20"
      >
        <input
          type="text"
          name="q"
          defaultValue={q}
          autoFocus
          enterKeyHint="search"
          placeholder="Rechercher de nouveau..."
          className="h-11 min-w-0 flex-1 bg-transparent px-4 text-sm outline-none sm:text-base"
        />

        {city ? <input type="hidden" name="city" value={city} /> : null}

        <button
          type="submit"
          className="h-11 shrink-0 rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 sm:px-6"
        >
          Rechercher
        </button>
      </form>

      <div className="mt-4 -mx-4 flex gap-2 overflow-x-auto px-4 sm:-mx-6 sm:px-6">
        <button
          type="button"
          onClick={() => selectCity(null)}
          className={`whitespace-nowrap rounded-full border px-3 py-1.5 text-sm transition-colors ${
            !city
              ? 'border-primary bg-primary/10 text-primary'
              : 'border-border text-muted-foreground hover:bg-muted'
          }`}
        >
          Toutes les villes
        </button>

        {NC_CITIES_MAJOR.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => selectCity(c)}
            className={`whitespace-nowrap rounded-full border px-3 py-1.5 text-sm transition-colors ${
              city === c
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-border text-muted-foreground hover:bg-muted'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {!q ? (
          <div className="py-16 text-center text-muted-foreground">
            <p className="text-sm">
              Tapez un mot-clé pour trouver ce que vous cherchez
            </p>
          </div>
        ) : loading ? (
          <p className="py-12 text-center text-muted-foreground">Recherche...</p>
        ) : results.length === 0 ? (
          <p className="py-12 text-center text-muted-foreground">
            Aucun résultat pour « {q} »
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            <p className="text-sm text-muted-foreground">
              {results.length} résultat{results.length > 1 ? 's' : ''} pour «&nbsp;{q}&nbsp;»
            </p>

            {results.map((l) => (
              <ListingRow key={l.id} listing={l} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
