'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { sendEmailVerification, reload } from 'firebase/auth';
import { toast } from 'sonner';
import { Mail } from 'lucide-react';
import { auth } from '@/lib/firebase/client';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';

export default function VerifyEmailPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [checking, setChecking] = useState(false);
  const [resending, setResending] = useState(false);

  useEffect(() => {
    if (!user) return;
    if (user.emailVerified) router.replace('/');
  }, [user, router]);

  async function onCheck() {
    if (!auth.currentUser) return;
    setChecking(true);
    try {
      await reload(auth.currentUser);
      if (auth.currentUser.emailVerified) {
        router.replace('/');
      } else {
        toast.error('Email pas encore vérifié');
      }
    } finally {
      setChecking(false);
    }
  }

  async function onResend() {
    if (!auth.currentUser) return;
    setResending(true);
    try {
      await sendEmailVerification(auth.currentUser);
      toast.success("Email de vérification renvoyé");
    } catch {
      toast.error("Erreur lors de l'envoi");
    } finally {
      setResending(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-md px-4 py-16 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
        <Mail className="h-7 w-7 text-primary" />
      </div>
      <h1 className="mt-6 text-2xl font-bold">Vérifiez votre email</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Un email de vérification a été envoyé à votre adresse. Cliquez sur le
        lien pour activer votre compte, puis revenez ici.
      </p>
      <p className="mt-1 text-xs text-muted-foreground">
        Pensez à vérifier vos spams.
      </p>
      <div className="mt-6 flex flex-col gap-2">
        <Button onClick={onCheck} disabled={checking}>
          {checking ? 'Vérification...' : "J'ai vérifié mon email"}
        </Button>
        <Button variant="ghost" onClick={onResend} disabled={resending}>
          {resending ? 'Envoi...' : "Renvoyer l'email"}
        </Button>
      </div>
    </div>
  );
}
