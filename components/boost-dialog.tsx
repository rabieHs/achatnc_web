'use client';

import { useState } from 'react';
import { TrendingUp } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/lib/auth-context';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface Props {
  listingId: string;
  featuredUntil: Date | null;
}

const TIERS = [
  { id: 'boost_1w', label: '1 semaine', price: '1 000 F', recommended: false },
  { id: 'boost_2w', label: '2 semaines', price: '1 800 F', recommended: true },
  { id: 'boost_4w', label: '1 mois', price: '3 500 F', recommended: false },
];

export function BoostDialog({ listingId, featuredUntil }: Props) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);

  const isFeatured = featuredUntil && featuredUntil > new Date();
  const label = isFeatured ? 'Prolonger la mise en avant' : 'Mettre en avant';

  async function buy(productId: string) {
    if (!user) return;
    setLoading(productId);
    try {
      const idToken = await user.getIdToken();
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken, listingId, productId }),
      });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !data.url) {
        toast.error('Erreur au lancement du paiement');
        setLoading(null);
        return;
      }
      window.location.href = data.url;
    } catch (err) {
      console.error(err);
      toast.error('Erreur');
      setLoading(null);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full gap-2" variant={isFeatured ? 'outline' : 'default'}>
          <TrendingUp className="h-4 w-4" />
          {label}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isFeatured ? 'Prolonger la mise en avant' : 'Mettre en avant votre annonce'}
          </DialogTitle>
          <DialogDescription>
            {isFeatured
              ? 'Ajoutez du temps à votre boost actuel.'
              : 'Votre annonce apparaîtra en haut des résultats et dans le carrousel sponsorisé.'}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          {TIERS.map((t) => (
            <button
              key={t.id}
              type="button"
              disabled={loading !== null}
              onClick={() => buy(t.id)}
              className={`flex w-full items-center justify-between rounded-xl border p-4 text-left transition-colors hover:border-primary ${
                t.recommended ? 'border-primary/40 bg-primary/5' : 'border-border'
              } ${loading === t.id ? 'opacity-60' : ''}`}
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{t.label}</span>
                  {t.recommended && (
                    <span className="rounded-md bg-primary px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary-foreground">
                      Recommandé
                    </span>
                  )}
                </div>
              </div>
              <span className="text-base font-bold text-primary">{t.price}</span>
            </button>
          ))}
        </div>
        <p className="text-center text-xs text-muted-foreground">
          Paiement sécurisé via Stripe (carte, Apple Pay, Google Pay).
        </p>
      </DialogContent>
    </Dialog>
  );
}
