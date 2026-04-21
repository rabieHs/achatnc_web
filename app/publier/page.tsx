'use client';

import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { toast } from 'sonner';
import { X, Upload } from 'lucide-react';
import { db } from '@/lib/firebase/client';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CATEGORIES, getSubcategories } from '@/lib/categories';
import { NC_CITIES } from '@/lib/cities';
import { createListing } from '@/lib/listings.write';

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

const CATEGORIES_WITH_CONDITION = new Set([
  'electronique', 'maison_jardin', 'famille', 'mode',
  'loisirs', 'materiel_pro', 'divers',
]);

const MAX_IMAGES = 5;

export default function PublishPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState<{ displayName: string; photoUrl: string | null } | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [subcategoryId, setSubcategoryId] = useState('');
  const [location, setLocation] = useState('');
  const [latLng, setLatLng] = useState<{ lat: number; lng: number } | null>(null);
  const [condition, setCondition] = useState('good');
  const [files, setFiles] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.replace('/login');
      return;
    }
    getDoc(doc(db, 'users', user.uid)).then((snap) => {
      const d = snap.data();
      setProfile({
        displayName: d?.displayName ?? user.displayName ?? '',
        photoUrl: d?.photoUrl ?? null,
      });
    });
  }, [user, authLoading, router]);

  const subcategories = useMemo(
    () => (categoryId ? getSubcategories(categoryId) : []),
    [categoryId],
  );
  const showCondition = CATEGORIES_WITH_CONDITION.has(categoryId);

  const previews = useMemo(
    () => files.map((f) => URL.createObjectURL(f)),
    [files],
  );
  useEffect(() => {
    return () => previews.forEach((u) => URL.revokeObjectURL(u));
  }, [previews]);

  function addFiles(list: FileList | null) {
    if (!list) return;
    const incoming = Array.from(list).filter((f) => f.type.startsWith('image/'));
    const merged = [...files, ...incoming].slice(0, MAX_IMAGES);
    setFiles(merged);
  }

  function removeFile(idx: number) {
    setFiles(files.filter((_, i) => i !== idx));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !profile) return;

    if (files.length === 0) {
      toast.error('Ajoutez au moins une photo');
      return;
    }
    const priceCents = Math.round(parseFloat(price.replace(',', '.')) * 100);
    if (!priceCents || priceCents <= 0) {
      toast.error('Prix invalide');
      return;
    }
    const cat = CATEGORIES.find((c) => c.id === categoryId);
    if (!cat) {
      toast.error('Choisissez une catégorie');
      return;
    }
    if (subcategories.length > 0 && !subcategoryId) {
      toast.error('Choisissez une sous-catégorie');
      return;
    }
    if (!location.trim()) {
      toast.error('Choisissez une ville');
      return;
    }

    setSubmitting(true);
    try {
      const subName = subcategories.find((s) => s.id === subcategoryId)?.name ?? null;
      const id = await createListing({
        sellerId: user.uid,
        sellerName: profile.displayName,
        sellerPhotoUrl: profile.photoUrl,
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
        categoryFields: {},
        files,
      });
      toast.success('Annonce publiée');
      router.push(`/annonce/${id}`);
    } catch (err) {
      console.error(err);
      toast.error('Erreur à la publication');
    } finally {
      setSubmitting(false);
    }
  }

  if (authLoading || !user || !profile) {
    return <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">Chargement...</div>;
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-bold">Déposer une annonce</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Remplissez le formulaire ci-dessous. Soyez précis pour augmenter vos chances de vente.
      </p>

      <form onSubmit={onSubmit} className="mt-8 space-y-8">
        {/* Photos */}
        <section className="space-y-3">
          <Label>Photos · {files.length}/{MAX_IMAGES}</Label>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
            {previews.map((src, i) => (
              <div key={i} className="relative aspect-square overflow-hidden rounded-lg border">
                <Image src={src} alt="" fill className="object-cover" unoptimized />
                <button
                  type="button"
                  onClick={() => removeFile(i)}
                  className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80"
                  aria-label="Supprimer"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
            {files.length < MAX_IMAGES && (
              <label className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-border text-muted-foreground transition-colors hover:border-primary hover:bg-primary/5 hover:text-primary">
                <Upload className="h-5 w-5" />
                <span className="text-xs">Ajouter</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => addFiles(e.target.files)}
                />
              </label>
            )}
          </div>
        </section>

        {/* Title & description */}
        <section className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="title">Titre</Label>
            <Input
              id="title"
              required
              maxLength={100}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: iPhone 14 Pro 256 Go"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Décrivez votre article : état, utilisation, raison de la vente..."
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="price">Prix (XPF)</Label>
            <Input
              id="price"
              required
              type="number"
              min={1}
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="100000"
            />
          </div>
        </section>

        {/* Category */}
        <section className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="category">Catégorie</Label>
            <select
              id="category"
              required
              value={categoryId}
              onChange={(e) => {
                setCategoryId(e.target.value);
                setSubcategoryId('');
              }}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
            >
              <option value="">Choisir une catégorie</option>
              {CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          {subcategories.length > 0 && (
            <div className="space-y-1.5">
              <Label htmlFor="subcategory">Sous-catégorie</Label>
              <select
                id="subcategory"
                required
                value={subcategoryId}
                onChange={(e) => setSubcategoryId(e.target.value)}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
              >
                <option value="">Choisir</option>
                {subcategories.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
          )}
          {showCondition && (
            <div className="space-y-1.5">
              <Label htmlFor="condition">État</Label>
              <select
                id="condition"
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
              >
                {CONDITIONS.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>
          )}
        </section>

        {/* Location */}
        <section className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="location">Ville</Label>
            <Input
              id="location"
              required
              list="nc-cities"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Choisir ou taper une ville"
            />
            <datalist id="nc-cities">
              {NC_CITIES.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
          </div>
          <div className="space-y-1.5">
            <Label>Position sur la carte (optionnel)</Label>
            <p className="text-xs text-muted-foreground">
              Cliquez sur la carte pour indiquer la position exacte. Un cercle d&apos;environ 2 km sera affiché aux acheteurs.
            </p>
            <LocationMapPicker
              value={latLng}
              onChange={async (v) => {
                setLatLng(v);
                try {
                  const res = await fetch(
                    `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${v.lat}&lon=${v.lng}&accept-language=fr`,
                    { headers: { 'Accept-Language': 'fr' } },
                  );
                  if (!res.ok) return;
                  const data = (await res.json()) as {
                    address?: Record<string, string>;
                  };
                  const addr = data.address ?? {};
                  const city =
                    addr.city ||
                    addr.town ||
                    addr.village ||
                    addr.municipality ||
                    addr.county ||
                    '';
                  if (city) setLocation(city);
                } catch (err) {
                  console.warn('reverse geocode failed', err);
                }
              }}
            />
          </div>
        </section>

        {/* Submit */}
        <div className="flex justify-end gap-3">
          <Button type="button" variant="ghost" onClick={() => router.back()}>
            Annuler
          </Button>
          <Button type="submit" disabled={submitting}>
            {submitting ? 'Publication...' : "Publier l'annonce"}
          </Button>
        </div>
      </form>
    </div>
  );
}
