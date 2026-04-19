'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense, useEffect, useState, useTransition } from 'react';
import { Search as SearchIcon } from 'lucide-react';
import { searchListings } from '@/lib/listings';
import type { Listing } from '@/lib/types';
import { ListingRow } from '@/components/listing-row';
import { Input } from '@/components/ui/input';
import { NC_CITIES_MAJOR } from '@/lib/cities';

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6">
        <div className="h-11 w-full animate-pulse rounded-full bg-muted" />
      </div>
    }>
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
  const [query, setQuery] = useState(q);
  const [, startTransition] = useTransition();

  useEffect(() => setQuery(q), [q]);

  useEffect(() => {
    if (!q) {
      setResults([]);
      return;
    }
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

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    const trimmed = query.trim();
    if (trimmed) params.set('q', trimmed);
    if (city) params.set('city', city);
    startTransition(() => router.push(`/recherche?${params.toString()}`));
  }

  function selectCity(next: string | null) {
    const params = new URLSearchParams();
    if (q) params.set('q', q);
    if (next) params.set('city', next);
    router.push(`/recherche?${params.toString()}`);
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6">
      <form onSubmit={onSubmit} className="relative">
        <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher..."
          className="h-11 rounded-full border-0 bg-muted pl-9"
        />
      </form>

      {/* City filter */}
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

      {/* Results */}
      <div className="mt-6">
        {!q ? (
          <div className="py-16 text-center text-muted-foreground">
            <SearchIcon className="mx-auto h-10 w-10 opacity-50" />
            <p className="mt-3 text-sm">
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
