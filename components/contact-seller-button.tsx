'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { toast } from 'sonner';
import { db } from '@/lib/firebase/client';
import { useAuth } from '@/lib/auth-context';
import { getOrCreateConversation, sendMessage } from '@/lib/messaging';
import { Button } from '@/components/ui/button';

const INITIAL_MESSAGE =
  'Bonjour, est-ce que ce produit est toujours disponible ?';

interface Props {
  listingId: string;
  listingTitle: string;
  listingThumbnail: string | null;
  sellerId: string;
  sellerName: string;
  sellerPhotoUrl: string | null;
}

export function ContactSellerButton(props: Props) {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  if (user?.uid === props.sellerId) return null;

  async function onClick() {
    if (!user) {
      router.push('/login');
      return;
    }
    setLoading(true);
    try {
      const snap = await getDoc(doc(db, 'users', user.uid));
      const profile = snap.data();
      const conversationId = await getOrCreateConversation({
        currentUserId: user.uid,
        currentUserName: profile?.displayName ?? user.displayName ?? 'Utilisateur',
        currentUserPhoto: profile?.photoUrl ?? null,
        otherUserId: props.sellerId,
        otherUserName: props.sellerName,
        otherUserPhoto: props.sellerPhotoUrl,
        listingId: props.listingId,
        listingTitle: props.listingTitle,
        listingThumbnail: props.listingThumbnail,
      });
      // Send pre-filled message if the conversation is brand new.
      // We can't easily tell "is new" without another read — so we always
      // send it if no messages exist. Simplest: just route and let the user
      // type. If you prefer auto-send, uncomment below:
      await sendMessage({
        conversationId,
        senderId: user.uid,
        receiverId: props.sellerId,
        text: INITIAL_MESSAGE,
      }).catch(() => {});
      router.push(`/messages/${conversationId}`);
    } catch (err) {
      console.error(err);
      toast.error('Erreur');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button onClick={onClick} disabled={loading} className="w-full">
      {loading ? 'Ouverture...' : 'Contacter le vendeur'}
    </Button>
  );
}
