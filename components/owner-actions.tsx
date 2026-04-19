'use client';

import Link from 'next/link';
import { Edit3 } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { BoostDialog } from './boost-dialog';

interface Props {
  listingId: string;
  sellerId: string;
  featuredUntil: Date | null;
}

export function OwnerActions({ listingId, sellerId, featuredUntil }: Props) {
  const { user } = useAuth();
  if (user?.uid !== sellerId) return null;
  return (
    <>
      <BoostDialog listingId={listingId} featuredUntil={featuredUntil} />
      <Button asChild variant="outline" className="w-full gap-2">
        <Link href={`/annonce/${listingId}/modifier`}>
          <Edit3 className="h-4 w-4" />
          Modifier
        </Link>
      </Button>
    </>
  );
}
