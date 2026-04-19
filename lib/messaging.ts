'use client';

import {
  addDoc,
  collection,
  doc,
  FieldValue,
  getDoc,
  increment,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  writeBatch,
} from 'firebase/firestore';
import { db } from './firebase/client';
import type { Conversation, Message } from './types';
import { toDateOrNull } from './types';

function conversationIdFor(uid1: string, uid2: string, listingId: string) {
  const sorted = [uid1, uid2].sort();
  return `${sorted[0]}_${sorted[1]}_${listingId}`;
}

function parseConversation(snap: {
  id: string;
  data(): Record<string, unknown> | undefined;
}): Conversation {
  const d = snap.data() ?? {};
  const last = d.lastMessage as
    | { text?: string; senderId?: string; sentAt?: { toDate(): Date } }
    | null
    | undefined;
  return {
    id: snap.id,
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
    createdAt:
      (d.createdAt as { toDate(): Date } | undefined)?.toDate() ?? new Date(),
    updatedAt:
      (d.updatedAt as { toDate(): Date } | undefined)?.toDate() ?? new Date(),
  };
}

export function watchConversations(
  userId: string,
  callback: (list: Conversation[]) => void,
): () => void {
  const q = query(
    collection(db, 'conversations'),
    where('participantIds', 'array-contains', userId),
    orderBy('updatedAt', 'desc'),
  );
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map(parseConversation));
  });
}

export function watchMessages(
  conversationId: string,
  callback: (messages: Message[]) => void,
): () => void {
  const q = query(
    collection(db, 'conversations', conversationId, 'messages'),
    orderBy('sentAt', 'asc'),
  );
  return onSnapshot(q, (snap) => {
    callback(
      snap.docs.map((m) => {
        const d = m.data();
        return {
          id: m.id,
          senderId: (d.senderId as string) ?? '',
          text: (d.text as string) ?? '',
          sentAt: (d.sentAt as { toDate(): Date } | undefined)?.toDate() ?? new Date(),
          readAt: toDateOrNull(d.readAt as never),
        };
      }),
    );
  });
}

export function watchTotalUnreadCount(
  userId: string,
  callback: (total: number) => void,
): () => void {
  const q = query(
    collection(db, 'conversations'),
    where('participantIds', 'array-contains', userId),
  );
  return onSnapshot(q, (snap) => {
    let total = 0;
    snap.forEach((c) => {
      const unread = (c.data().unreadCount as Record<string, number>) ?? {};
      total += unread[userId] ?? 0;
    });
    callback(total);
  });
}

export async function getOrCreateConversation(params: {
  currentUserId: string;
  currentUserName: string;
  currentUserPhoto: string | null;
  otherUserId: string;
  otherUserName: string;
  otherUserPhoto: string | null;
  listingId: string;
  listingTitle: string;
  listingThumbnail: string | null;
}): Promise<string> {
  const id = conversationIdFor(
    params.currentUserId,
    params.otherUserId,
    params.listingId,
  );
  const ref = doc(db, 'conversations', id);
  const snap = await getDoc(ref);
  if (snap.exists()) return id;

  await setDoc(ref, {
    participantIds: [params.currentUserId, params.otherUserId].sort(),
    participantNames: {
      [params.currentUserId]: params.currentUserName,
      [params.otherUserId]: params.otherUserName,
    },
    participantPhotos: {
      [params.currentUserId]: params.currentUserPhoto,
      [params.otherUserId]: params.otherUserPhoto,
    },
    listingId: params.listingId,
    listingTitle: params.listingTitle,
    listingThumbnail: params.listingThumbnail,
    unreadCount: {
      [params.currentUserId]: 0,
      [params.otherUserId]: 0,
    },
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return id;
}

export async function sendMessage(params: {
  conversationId: string;
  senderId: string;
  receiverId: string;
  text: string;
}): Promise<void> {
  const batch = writeBatch(db);
  const msgRef = doc(
    collection(db, 'conversations', params.conversationId, 'messages'),
  );
  batch.set(msgRef, {
    senderId: params.senderId,
    text: params.text,
    sentAt: serverTimestamp(),
    readAt: null,
  });
  batch.update(doc(db, 'conversations', params.conversationId), {
    lastMessage: {
      text: params.text,
      senderId: params.senderId,
      sentAt: serverTimestamp(),
    },
    updatedAt: serverTimestamp(),
    [`unreadCount.${params.receiverId}`]: increment(1),
  } as Record<string, FieldValue | unknown>);
  await batch.commit();
}

export async function markConversationAsRead(
  conversationId: string,
  userId: string,
): Promise<void> {
  await updateDoc(doc(db, 'conversations', conversationId), {
    [`unreadCount.${userId}`]: 0,
  });
}

// One-off helper: add a dummy document so a blank conversation doesn't 404
// (not used — retained for future additions)
export async function createEmptyMessage(
  conversationId: string,
  payload: Record<string, unknown>,
) {
  await addDoc(
    collection(db, 'conversations', conversationId, 'messages'),
    payload,
  );
}
