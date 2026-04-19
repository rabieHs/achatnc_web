'use client';

import { Heart } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { addFavorite, removeFavorite, watchFavoriteIds } from '@/lib/favorites';

interface Props {
  listingId: string;
  variant?: 'card' | 'detail';
}

export function FavoriteButton({ listingId, variant = 'card' }: Props) {
  const router = useRouter();
  const { user } = useAuth();
  const [isFav, setIsFav] = useState(false);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (!user) return;
    return watchFavoriteIds(user.uid, (set) => setIsFav(set.has(listingId)));
  }, [user, listingId]);

  async function toggle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      router.push('/login');
      return;
    }
    setPending(true);
    try {
      if (isFav) await removeFavorite(user.uid, listingId);
      else await addFavorite(user.uid, listingId);
    } catch {
      toast.error('Erreur');
    } finally {
      setPending(false);
    }
  }

  if (variant === 'detail') {
    return (
      <button
        type="button"
        onClick={toggle}
        disabled={pending}
        aria-label={isFav ? 'Retirer des favoris' : 'Ajouter aux favoris'}
        className="flex h-10 items-center gap-2 rounded-full border border-border bg-card px-4 text-sm font-medium transition-colors hover:bg-accent"
      >
        <Heart
          className={`h-4 w-4 ${isFav ? 'fill-red-500 text-red-500' : ''}`}
        />
        {isFav ? 'Retiré' : 'Favori'}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={pending}
      aria-label={isFav ? 'Retirer des favoris' : 'Ajouter aux favoris'}
      className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/30 backdrop-blur transition-colors hover:bg-black/50"
    >
      <Heart
        className={`h-4 w-4 text-white ${isFav ? 'fill-red-500 text-red-500' : ''}`}
      />
    </button>
  );
}
