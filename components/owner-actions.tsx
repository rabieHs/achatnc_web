'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Edit3, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { deleteListing } from '@/lib/listings.write';
import type { ListingImage } from '@/lib/types';
import { BoostDialog } from './boost-dialog';

interface Props {
  listingId: string;
  sellerId: string;
  featuredUntil: Date | null;
  images: ListingImage[];
}

export function OwnerActions({
  listingId,
  sellerId,
  featuredUntil,
  images,
}: Props) {
  const router = useRouter();
  const { user } = useAuth();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  if (user?.uid !== sellerId) return null;

  async function onDelete() {
    if (!user) return;
    setDeleting(true);
    try {
      await deleteListing(listingId, user.uid, images);
      toast.success('Annonce supprimée');
      router.push('/compte/mes-annonces');
    } catch (err) {
      console.error(err);
      toast.error('Erreur à la suppression');
      setDeleting(false);
    }
  }

  return (
    <>
      <BoostDialog listingId={listingId} featuredUntil={featuredUntil} />
      <div className="flex gap-2">
        <Button asChild variant="outline" className="flex-1 gap-2">
          <Link href={`/annonce/${listingId}/modifier`}>
            <Edit3 className="h-4 w-4" />
            Modifier
          </Link>
        </Button>
        <Button
          variant="outline"
          className="text-destructive hover:bg-destructive/10 hover:text-destructive"
          aria-label="Supprimer l'annonce"
          onClick={() => setConfirmOpen(true)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Supprimer cette annonce ?</DialogTitle>
            <DialogDescription>
              Cette action est irréversible. L&apos;annonce et ses photos
              seront définitivement supprimées.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-2">
            <Button
              variant="ghost"
              onClick={() => setConfirmOpen(false)}
              disabled={deleting}
            >
              Annuler
            </Button>
            <Button
              variant="destructive"
              onClick={onDelete}
              disabled={deleting}
            >
              {deleting ? 'Suppression...' : 'Supprimer'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
