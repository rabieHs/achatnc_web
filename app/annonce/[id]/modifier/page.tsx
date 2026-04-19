'use client';

import dynamic from 'next/dynamic';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { fetchListing } from '@/lib/listings';
import { updateListing } from '@/lib/listings.write';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CATEGORIES, getSubcategories } from '@/lib/categories';
import { NC_CITIES } from '@/lib/cities';
import type { Listing } from '@/lib/types';

const LocationMapPicker = dynamic(
  () => import('@/components/location-map-picker').then((m) => m.LocationMapPicker),
  { ssr: false, loading: () => <div className="h-[320px] rounded-xl border bg-muted" /> },
);

const CONDITIONS = [
  { value: 'new', label: 'Neuf' },
  { value: 'like_new', label: 'Comme neuf' },
  { value: 'good', label: 'Bon état' },
  { value: 'fair', label: 'État correct' },
  { value: 'poor', label: 'À réparer' },
];

export default function EditListingPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [listing, setListing] = useState<Listing | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [subcategoryId, setSubcategoryId] = useState('');
  const [location, setLocation] = useState('');
  const [latLng, setLatLng] = useState<{ lat: number; lng: number } | null>(null);
  const [condition, setCondition] = useState('good');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.replace('/login');
      return;
    }
    fetchListing(id).then((l) => {
      if (!l) {
        toast.error('Annonce introuvable');
        router.replace('/');
        return;
      }
      if (l.sellerId !== user.uid) {
        toast.error('Accès refusé');
        router.replace(`/annonce/${id}`);
        return;
      }
      setListing(l);
      setTitle(l.title);
      setDescription(l.description);
      setPrice(String(l.price / 100));
      setCategoryId(l.categoryId);
      setSubcategoryId(l.subcategoryId ?? '');
      setLocation(l.location);
      setLatLng(l.latitude && l.longitude ? { lat: l.latitude, lng: l.longitude } : null);
      setCondition(l.condition);
    });
  }, [id, user, authLoading, router]);

  const subcategories = useMemo(
    () => (categoryId ? getSubcategories(categoryId) : []),
    [categoryId],
  );

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!listing) return;
    const priceCents = Math.round(parseFloat(price.replace(',', '.')) * 100);
    if (!priceCents || priceCents <= 0) {
      toast.error('Prix invalide');
      return;
    }
    const cat = CATEGORIES.find((c) => c.id === categoryId);
    if (!cat) return;
    setSubmitting(true);
    try {
      const subName = subcategories.find((s) => s.id === subcategoryId)?.name ?? null;
      await updateListing(listing.id, {
        title: title.trim(),
        description: description.trim(),
        price: priceCents,
        categoryId: cat.id,
        categoryName: cat.name,
        subcategoryId: subcategoryId || null,
        subcategoryName: subName,
        location: location.trim(),
        latitude: latLng?.lat ?? null,
        longitude: latLng?.lng ?? null,
        condition,
      });
      toast.success('Annonce mise à jour');
      router.push(`/annonce/${listing.id}`);
    } catch (err) {
      console.error(err);
      toast.error('Erreur');
    } finally {
      setSubmitting(false);
    }
  }

  if (!listing) {
    return <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">Chargement...</div>;
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-bold">Modifier l&apos;annonce</h1>

      <form onSubmit={onSubmit} className="mt-6 space-y-6">
        <div className="space-y-1.5">
          <Label htmlFor="title">Titre</Label>
          <Input id="title" required maxLength={100} value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" rows={5} value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="price">Prix (XPF)</Label>
          <Input id="price" required type="number" min={1} value={price} onChange={(e) => setPrice(e.target.value)} />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Catégorie</Label>
            <select
              value={categoryId}
              onChange={(e) => { setCategoryId(e.target.value); setSubcategoryId(''); }}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm outline-none focus-visible:border-ring"
            >
              {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          {subcategories.length > 0 && (
            <div className="space-y-1.5">
              <Label>Sous-catégorie</Label>
              <select
                value={subcategoryId}
                onChange={(e) => setSubcategoryId(e.target.value)}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm outline-none focus-visible:border-ring"
              >
                <option value="">Choisir</option>
                {subcategories.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
          )}
          <div className="space-y-1.5">
            <Label>État</Label>
            <select
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm outline-none focus-visible:border-ring"
            >
              {CONDITIONS.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>
          <div className="space-y-1.5">
            <Label>Ville</Label>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm outline-none focus-visible:border-ring"
            >
              {NC_CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <div className="space-y-1.5">
          <Label>Position sur la carte</Label>
          <LocationMapPicker value={latLng} onChange={setLatLng} />
        </div>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="ghost" onClick={() => router.back()}>Annuler</Button>
          <Button type="submit" disabled={submitting}>
            {submitting ? 'Mise à jour...' : 'Enregistrer'}
          </Button>
        </div>
      </form>
    </div>
  );
}
