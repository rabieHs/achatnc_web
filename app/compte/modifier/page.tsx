'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { doc, getDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref as storageRef, uploadBytes } from 'firebase/storage';
import { updateProfile } from 'firebase/auth';
import { toast } from 'sonner';
import { Camera, User } from 'lucide-react';
import { auth, db, storage } from '@/lib/firebase/client';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { NC_CITIES } from '@/lib/cities';

export default function EditProfilePage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [displayName, setDisplayName] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [bio, setBio] = useState('');
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.replace('/login');
      return;
    }
    getDoc(doc(db, 'users', user.uid)).then((snap) => {
      const d = snap.data();
      setDisplayName(d?.displayName ?? '');
      setPhone(d?.phone ?? '');
      setLocation(d?.location ?? '');
      setBio(d?.bio ?? '');
      setPhotoUrl(d?.photoUrl ?? null);
    });
  }, [user, authLoading, router]);

  const previewUrl = photoFile ? URL.createObjectURL(photoFile) : photoUrl;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    try {
      let finalPhotoUrl = photoUrl;
      if (photoFile) {
        const ref = storageRef(
          storage,
          `users/${user.uid}/avatar.${photoFile.name.split('.').pop() ?? 'jpg'}`,
        );
        await uploadBytes(ref, photoFile);
        finalPhotoUrl = await getDownloadURL(ref);
      }
      await updateDoc(doc(db, 'users', user.uid), {
        displayName: displayName.trim(),
        phone: phone.trim() || null,
        location: location || null,
        bio: bio.trim() || null,
        photoUrl: finalPhotoUrl,
        updatedAt: serverTimestamp(),
      });
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, {
          displayName: displayName.trim(),
          photoURL: finalPhotoUrl,
        });
      }
      toast.success('Profil mis à jour');
      router.push('/compte');
    } catch (err) {
      console.error(err);
      toast.error('Erreur');
    } finally {
      setSaving(false);
    }
  }

  if (!user) return null;

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-bold">Modifier mon profil</h1>

      <form onSubmit={onSubmit} className="mt-6 space-y-6">
        {/* Avatar */}
        <div className="flex flex-col items-center gap-3">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="relative h-24 w-24 overflow-hidden rounded-full border bg-muted"
          >
            {previewUrl ? (
              <Image src={previewUrl} alt="" fill className="object-cover" unoptimized={!!photoFile} />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                <User className="h-8 w-8" />
              </div>
            )}
            <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors hover:bg-black/30">
              <Camera className="h-6 w-6 text-white opacity-0 transition-opacity hover:opacity-100" />
            </div>
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => setPhotoFile(e.target.files?.[0] ?? null)}
          />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="text-sm font-medium text-primary hover:underline"
          >
            Changer la photo
          </button>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="name">Nom complet</Label>
          <Input id="name" required value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="phone">Téléphone</Label>
          <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+687 12 34 56" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="location">Ville</Label>
          <select
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm outline-none"
          >
            <option value="">Non renseignée</option>
            {NC_CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="bio">Bio</Label>
          <Textarea id="bio" rows={4} value={bio} onChange={(e) => setBio(e.target.value)} />
        </div>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="ghost" onClick={() => router.back()}>Annuler</Button>
          <Button type="submit" disabled={saving}>
            {saving ? 'Enregistrement...' : 'Enregistrer'}
          </Button>
        </div>
      </form>
    </div>
  );
}
