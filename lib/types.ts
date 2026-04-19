import type { Timestamp } from 'firebase/firestore';

export type ListingCondition = 'new' | 'like_new' | 'good' | 'fair' | 'poor';

export type ListingStatus = 'active' | 'sold' | 'reserved' | 'deleted';

export interface ListingImage {
  url: string;
  path: string;
  order: number;
}

export interface Listing {
  id: string;
  sellerId: string;
  sellerName: string;
  sellerPhotoUrl: string | null;
  title: string;
  description: string;
  price: number;
  currency: string;
  categoryId: string;
  categoryName: string;
  subcategoryId: string | null;
  subcategoryName: string | null;
  images: ListingImage[];
  thumbnailUrl: string | null;
  location: string;
  latitude: number | null;
  longitude: number | null;
  condition: ListingCondition;
  status: ListingStatus;
  favoritesCount: number;
  viewsCount: number;
  createdAt: Date;
  updatedAt: Date;
  featuredUntil: Date | null;
  searchKeywords: string[];
  categoryFields: Record<string, unknown>;
}

export interface AppUser {
  uid: string;
  email: string;
  displayName: string;
  photoUrl: string | null;
  phone: string | null;
  bio: string | null;
  location: string | null;
  isVerified: boolean;
  listingsCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Conversation {
  id: string;
  participantIds: string[];
  participantNames: Record<string, string>;
  participantPhotos: Record<string, string | null>;
  listingId: string;
  listingTitle: string;
  listingThumbnail: string | null;
  lastMessage: {
    text: string;
    senderId: string;
    sentAt: Date;
  } | null;
  unreadCount: Record<string, number>;
  createdAt: Date;
  updatedAt: Date;
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  sentAt: Date;
  readAt: Date | null;
}

// Firestore timestamp helper
export function toDate(ts: Timestamp | Date | null | undefined): Date {
  if (!ts) return new Date(0);
  if (ts instanceof Date) return ts;
  return ts.toDate();
}

export function toDateOrNull(
  ts: Timestamp | Date | null | undefined,
): Date | null {
  if (!ts) return null;
  if (ts instanceof Date) return ts;
  return ts.toDate();
}
