'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { MessageCircle } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { watchConversations } from '@/lib/messaging';
import type { Conversation } from '@/lib/types';
import { messageTime } from '@/lib/format';

export default function ConversationsListPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.replace('/login');
      return;
    }
    return watchConversations(user.uid, (c) => {
      setConversations(c);
      setLoading(false);
    });
  }, [user, authLoading, router]);

  if (!user) return null;

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-bold">Messages</h1>

      {loading ? (
        <p className="py-12 text-center text-muted-foreground">Chargement...</p>
      ) : conversations.length === 0 ? (
        <div className="py-16 text-center">
          <MessageCircle className="mx-auto h-10 w-10 text-muted-foreground opacity-50" />
          <p className="mt-3 text-sm text-muted-foreground">
            Aucune conversation pour le moment.
          </p>
        </div>
      ) : (
        <div className="mt-4 divide-y overflow-hidden rounded-2xl border bg-card">
          {conversations.map((conv) => {
            const otherId = conv.participantIds.find((id) => id !== user.uid) ?? '';
            const otherName = conv.participantNames[otherId] ?? 'Utilisateur';
            const otherPhoto = conv.participantPhotos[otherId];
            const unread = conv.unreadCount[user.uid] ?? 0;
            const last = conv.lastMessage;
            return (
              <Link
                key={conv.id}
                href={`/messages/${conv.id}`}
                className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-accent"
              >
                <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-full bg-muted">
                  {otherPhoto ? (
                    <Image src={otherPhoto} alt={otherName} width={48} height={48} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-muted-foreground">
                      {otherName[0]?.toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className={`truncate ${unread > 0 ? 'font-semibold' : 'font-medium'}`}>
                      {otherName}
                    </p>
                    {last && (
                      <span className="text-xs text-muted-foreground">
                        {messageTime(last.sentAt)}
                      </span>
                    )}
                  </div>
                  <p className="truncate text-xs text-muted-foreground">{conv.listingTitle}</p>
                  {last && (
                    <p className={`truncate text-sm ${unread > 0 ? 'font-medium' : 'text-muted-foreground'}`}>
                      {last.senderId === user.uid ? 'Vous : ' : ''}{last.text}
                    </p>
                  )}
                </div>
                {unread > 0 && (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-bold text-primary-foreground">
                    {unread}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
