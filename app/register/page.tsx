'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
} from 'firebase/auth';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { toast } from 'sonner';
import { auth, db } from '@/lib/firebase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 8) {
      toast.error('Le mot de passe doit contenir au moins 8 caractères');
      return;
    }
    setLoading(true);
    try {
      const credential = await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        password,
      );
      await updateProfile(credential.user, { displayName: name.trim() });
      await sendEmailVerification(credential.user);
      await setDoc(doc(db, 'users', credential.user.uid), {
        uid: credential.user.uid,
        email: email.trim(),
        displayName: name.trim(),
        photoUrl: null,
        phone: null,
        bio: null,
        location: null,
        isVerified: false,
        listingsCount: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      router.push('/verify-email');
    } catch (err: unknown) {
      console.error(err);
      const message = (err as { code?: string })?.code;
      if (message === 'auth/email-already-in-use') {
        toast.error('Un compte existe déjà avec cet email');
      } else if (message === 'auth/invalid-email') {
        toast.error('Adresse email invalide');
      } else {
        toast.error('Erreur lors de la création du compte');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-md px-4 py-10">
      <h1 className="text-2xl font-bold">Créer un compte</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Rejoignez la communauté achats.nc
      </p>
      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="name">Nom complet</Label>
          <Input
            id="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="password">Mot de passe</Label>
          <Input
            id="password"
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
          />
          <p className="text-xs text-muted-foreground">Minimum 8 caractères</p>
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Création...' : 'Créer mon compte'}
        </Button>
      </form>
      <p className="mt-4 text-center text-sm text-muted-foreground">
        Déjà inscrit ?{' '}
        <Link href="/login" className="font-medium text-primary hover:underline">
          Se connecter
        </Link>
      </p>
    </div>
  );
}
