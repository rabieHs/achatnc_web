'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { toast } from 'sonner';
import { auth } from '@/lib/firebase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      router.push('/');
    } catch (err) {
      console.error(err);
      toast.error('Identifiants invalides');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-md px-4 py-10">
      <h1 className="text-2xl font-bold">Se connecter</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Bon retour sur achats.nc
      </p>
      <form onSubmit={onSubmit} className="mt-6 space-y-4">
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Connexion...' : 'Se connecter'}
        </Button>
      </form>
      <p className="mt-4 text-center text-sm text-muted-foreground">
        Pas encore de compte ?{' '}
        <Link href="/register" className="font-medium text-primary hover:underline">
          Créer un compte
        </Link>
      </p>
    </div>
  );
}
