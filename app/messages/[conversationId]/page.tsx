'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useRef, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { Send, ArrowLeft, Check, CheckCheck } from 'lucide-react';
import { db } from '@/lib/firebase/client';
import { useAuth } from '@/lib/auth-context';
import {
  markConversationAsRead,
  sendMessage,
  watchMessages,
} from '@/lib/messaging';
import type { Conversation, Message } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { messageTime } from '@/lib/format';

function parseConversation(id: string, d: Record<string, unknown>): Conversation {
  const last = d.lastMessage as
    | { text?: string; senderId?: string; sentAt?: { toDate(): Date } }
    | null
    | undefined;
  return {
    id,
    participantIds: (d.participantIds as string[]) ?? [],
    participantNames: (d.participantNames as Record<string, string>) ?? {},
    participantPhotos:
      (d.participantPhotos as Record<string, string | null>) ?? {},
    listingId: (d.listingId as string) ?? '',
    listingTitle: (d.listingTitle as string) ?? '',
    listingThumbnail: (d.listingThumbnail as string | null) ?? null,
    lastMessage: last
      ? {
          text: last.text ?? '',
          senderId: last.senderId ?? '',
          sentAt: last.sentAt?.toDate() ?? new Date(),
        }
      : null,
    unreadCount: (d.unreadCount as Record<string, number>) ?? {},
    createdAt: (d.createdAt as { toDate(): Date } | undefined)?.toDate() ?? new Date(),
    updatedAt: (d.updatedAt as { toDate(): Date } | undefined)?.toDate() ?? new Date(),
  };
}

export default function ChatPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">Chargement...</div>}>
      <ChatPageInner />
    </Suspense>
  );
}

function ChatPageInner() {
  const { conversationId } = useParams<{ conversationId: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const prefill = searchParams.get('prefill');
  const { user, loading: authLoading } = useAuth();
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState(prefill ?? '');
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.replace('/login');
      return;
    }
    // Mark as read on open
    markConversationAsRead(conversationId, user.uid).catch(() => {});

    const unsubConv = onSnapshot(
      doc(db, 'conversations', conversationId),
      (snap) => {
        if (!snap.exists()) {
          router.replace('/messages');
          return;
        }
        setConversation(parseConversation(snap.id, snap.data() ?? {}));
      },
    );
    const unsubMsgs = watchMessages(conversationId, (m) => {
      setMessages(m);
    });
    return () => {
      unsubConv();
      unsubMsgs();
    };
  }, [conversationId, user, authLoading, router]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  async function onSend(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !conversation) return;
    const trimmed = text.trim();
    if (!trimmed) return;
    const receiverId = conversation.participantIds.find((id) => id !== user.uid);
    if (!receiverId) return;
    setSending(true);
    try {
      await sendMessage({
        conversationId,
        senderId: user.uid,
        receiverId,
        text: trimmed,
      });
      setText('');
    } finally {
      setSending(false);
    }
  }

  if (!user || !conversation) {
    return <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">Chargement...</div>;
  }

  const otherId = conversation.participantIds.find((id) => id !== user.uid) ?? '';
  const otherName = conversation.participantNames[otherId] ?? 'Utilisateur';
  const otherPhoto = conversation.participantPhotos[otherId];

  return (
    <div className="mx-auto flex h-[calc(100dvh-4rem)] w-full max-w-3xl flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 border-b bg-card px-4 py-3">
        <Button variant="ghost" size="icon" onClick={() => router.push('/messages')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="h-9 w-9 overflow-hidden rounded-full bg-muted">
          {otherPhoto && (
            <Image src={otherPhoto} alt={otherName} width={36} height={36} className="h-full w-full object-cover" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="truncate text-sm font-semibold">{otherName}</p>
          <p className="truncate text-xs text-muted-foreground">
            {conversation.listingTitle}
          </p>
        </div>
      </div>

      {/* Listing banner */}
      <Link
        href={`/annonce/${conversation.listingId}`}
        className="flex items-center gap-3 border-b bg-muted/40 px-4 py-2.5 text-sm hover:bg-muted"
      >
        {conversation.listingThumbnail && (
          <Image
            src={conversation.listingThumbnail}
            alt=""
            width={32}
            height={32}
            className="h-8 w-8 rounded-md object-cover"
          />
        )}
        <span className="flex-1 truncate text-xs font-medium">
          {conversation.listingTitle}
        </span>
        <span className="text-xs text-muted-foreground">Voir l&apos;annonce</span>
      </Link>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {messages.length === 0 ? (
          <p className="py-12 text-center text-sm text-muted-foreground">
            Envoyez votre premier message
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {messages.map((m) => {
              const mine = m.senderId === user.uid;
              return (
                <div
                  key={m.id}
                  className={`flex flex-col ${mine ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm ${
                      mine
                        ? 'rounded-br-md bg-primary text-primary-foreground'
                        : 'rounded-bl-md bg-muted'
                    }`}
                  >
                    {m.text}
                  </div>
                  <div className="mt-1 flex items-center gap-1 px-1 text-[10px] text-muted-foreground">
                    {messageTime(m.sentAt)}
                    {mine && (m.readAt
                      ? <CheckCheck className="h-3 w-3 text-primary" />
                      : <Check className="h-3 w-3" />)}
                  </div>
                </div>
              );
            })}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <form onSubmit={onSend} className="flex items-center gap-2 border-t bg-card p-3">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Écrire un message..."
          className="h-11 flex-1 rounded-full border-0 bg-muted px-4 text-sm outline-none"
        />
        <Button type="submit" size="icon" disabled={sending || !text.trim()} className="h-11 w-11 rounded-full">
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}
