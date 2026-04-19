import Link from 'next/link';
import type { Metadata } from 'next';
import { CATEGORIES } from '@/lib/categories';

export const metadata: Metadata = {
  title: 'Toutes les catégories',
};

export default function CategoriesPage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6">
      <h1 className="text-2xl font-bold">Toutes les catégories</h1>
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {CATEGORIES.map(({ id, name, icon: Icon }) => (
          <Link
            key={id}
            href={`/categorie/${id}`}
            className="flex items-center gap-3 rounded-xl border bg-card p-4 transition-colors hover:bg-accent"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Icon className="h-5 w-5 text-primary" />
            </div>
            <span className="text-sm font-medium">{name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
