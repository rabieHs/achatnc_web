'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';

export default function DataDeletionPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [requested, setRequested] = useState(false);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.replace('/login');
    }
  }, [user, authLoading, router]);

  async function requestDeletion() {
    if (!user) return;

    const confirmed = window.confirm(
      'Confirmer la demande de suppression de votre compte et de vos données ? Les données seront conservées pendant 30 jours avant suppression définitive.',
    );

    if (!confirmed) return;

    setSubmitting(true);

    try {
      const token = await user.getIdToken();

      const res = await fetch('/api/account/request-deletion', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error('Request failed');
      }

      setRequested(true);
      toast.success('Demande de suppression enregistrée');
    } catch (err) {
      console.error(err);
      toast.error('Erreur lors de la demande de suppression');
    } finally {
      setSubmitting(false);
    }
  }

  if (authLoading || !user) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center px-4 py-10">
        <p className="text-sm text-muted-foreground">Chargement...</p>
      </main>
    );
  }

  return (
    <main className="flex min-h-[60vh] justify-center px-4 py-10 sm:px-6">
      <div className="w-full max-w-2xl">
        <div className="rounded-2xl border bg-background p-5 shadow-sm sm:p-8">
          <h1 className="text-center text-2xl font-bold tracking-tight sm:text-left">
            Suppression des données
          </h1>

          <div className="mt-6 space-y-4 text-sm leading-6 text-muted-foreground">
            <p>
              Vous pouvez demander la suppression de votre compte achats.nc et des données
              associées.
            </p>

            <p>
              Après votre demande, les données sont conservées pendant 30 jours pour des
              raisons légales, de sécurité, de prévention de fraude ou de résolution de
              litige. Après ce délai, la suppression définitive est lancée automatiquement.
            </p>

            <p>
              Cette demande concerne notamment votre compte, votre profil, vos favoris, vos
              annonces et les images associées lorsque leur suppression est techniquement
              possible.
            </p>

            <p>
              Si vous souhaitez annuler cette demande pendant le délai de 30 jours, contactez-nous à{' '}
              <a href="mailto:contact@achats.nc" className="underline hover:text-foreground">
                contact@achats.nc
              </a>
              .
            </p>
          </div>

          <div className="mt-8 rounded-xl border bg-muted/30 p-4">
            {requested ? (
              <p className="text-center text-sm font-medium">
                Votre demande de suppression a été enregistrée.
              </p>
            ) : (
              <div className="flex w-full justify-center">
                <Button
                  type="button"
                  variant="destructive"
                  disabled={submitting}
                  onClick={requestDeletion}
                  className="h-auto min-h-10 w-full max-w-md whitespace-normal px-4 py-3 text-center leading-snug"
                >
                  {submitting
                    ? 'Demande en cours...'
                    : 'Demander la suppression de mon compte et de mes données'}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
