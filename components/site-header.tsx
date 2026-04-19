'use client';

import Link from 'next/link';
import { Search, MessageCircle, User, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth-context';
import { watchTotalUnreadCount } from '@/lib/messaging';
import { useEffect, useState } from 'react';

export function SiteHeader() {
  const { user } = useAuth();
  const [scrollY, setScrollY] = useState(0);
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!user) {
      setUnread(0);
      return;
    }
    return watchTotalUnreadCount(user.uid, setUnread);
  }, [user]);

  return (
    <header
      className={`sticky top-0 z-40 border-b bg-background/95 backdrop-blur transition-shadow ${
        scrollY > 8 ? 'shadow-sm' : ''
      }`}
    >
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center gap-4 px-4 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-bold tracking-tight"
        >
          achats.nc
        </Link>

        <div className="ml-auto flex items-center gap-1 md:gap-2">
          <Link href="/recherche">
            <Button variant="ghost" size="icon" aria-label="Rechercher">
              <Search className="h-5 w-5" />
            </Button>
          </Link>
          <Link href="/publier">
            <Button className="hidden gap-2 rounded-full px-4 md:inline-flex">
              <PlusCircle className="h-4 w-4" />
              Déposer une annonce
            </Button>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Déposer une annonce"
              className="md:hidden"
            >
              <PlusCircle className="h-5 w-5" />
            </Button>
          </Link>
          <Link href={user ? '/messages' : '/login'} className="relative">
            <Button variant="ghost" size="icon" aria-label="Messages">
              <MessageCircle className="h-5 w-5" />
            </Button>
            {unread > 0 && (
              <span className="absolute right-0 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[9px] font-bold text-destructive-foreground">
                {unread > 9 ? '9+' : unread}
              </span>
            )}
          </Link>
          <Link href={user ? '/compte' : '/login'}>
            <Button variant="ghost" size="icon" aria-label="Compte">
              <User className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
