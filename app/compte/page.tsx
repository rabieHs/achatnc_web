'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import {
  ChevronRight, Edit3, Package, LogOut, Heart, FileText, Mail, User,
} from 'lucide-react';
import { db } from '@/lib/firebase/client';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import type { AppUser } from '@/lib/types';

export default function AccountPage() {
  const router = useRouter();
  const { user, loading: authLoading, signOut } = useAuth();
  const [profile, setProfile] = useState<AppUser | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.replace('/login');
      return;
    }
    return onSnapshot(doc(db, 'users', user.uid), (snap) => {
      if (!snap.exists()) return;
      const d = snap.data();
      setProfile({
        uid: snap.id,
        email: d.email ?? '',
        displayName: d.displayName ?? '',
        photoUrl: d.photoUrl ?? null,
        phone: d.phone ?? null,
        bio: d.bio ?? null,
        location: d.location ?? null,
        isVerified: d.isVerified ?? false,
        listingsCount: d.listingsCount ?? 0,
        createdAt: d.createdAt?.toDate() ?? new Date(),
        updatedAt: d.updatedAt?.toDate() ?? new Date(),
      });
    });
  }, [user, authLoading, router]);

  if (!profile) return <div className="mx-auto max-w-3xl px-4 py-10">Chargement...</div>;

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6">
      <h1 className="sr-only">Mon compte</h1>

      {/* Profile card */}
      <div className="flex items-center gap-4 rounded-2xl border bg-card p-6">
        <div className="h-16 w-16 overflow-hidden rounded-full bg-muted">
          {profile.photoUrl ? (
            <Image src={profile.photoUrl} alt={profile.displayName} width={64} height={64} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-muted-foreground">
              <User className="h-7 w-7" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-lg font-semibold truncate">{profile.displayName}</p>
          <p className="text-sm text-muted-foreground truncate">{profile.email}</p>
          {profile.location && (
            <p className="text-xs text-muted-foreground">{profile.location}</p>
          )}
        </div>
        <Button asChild variant="outline" size="sm">
          <Link href="/compte/modifier">
            <Edit3 className="mr-2 h-4 w-4" />
            Modifier
          </Link>
        </Button>
      </div>

      {/* Menu */}
      <div className="mt-6 overflow-hidden rounded-2xl border bg-card">
        <MenuItem href="/compte/mes-annonces" icon={Package} label="Mes annonces" trailing={String(profile.listingsCount)} />
        <Divider />
        <MenuItem href="/favoris" icon={Heart} label="Mes favoris" />
        <Divider />
        <MenuItem href="/messages" icon={Mail} label="Mes messages" />
        <Divider />
        <MenuItem href="/compte/mentions-legales" icon={FileText} label="Mentions légales" />
        <Divider />
        <MenuItem
          href="mailto:contact@achats.nc"
          icon={Mail}
          label="Nous contacter"
        />
      </div>

      {/* Sign out */}
      <div className="mt-8 flex flex-col items-center gap-2">
        <Button variant="ghost" onClick={async () => { await signOut(); router.push('/'); }} className="text-destructive hover:text-destructive">
          <LogOut className="mr-2 h-4 w-4" />
          Se déconnecter
        </Button>
        <span className="text-xs text-muted-foreground">Version 1.0.0</span>
      </div>
    </div>
  );
}

function MenuItem({
  href, icon: Icon, label, trailing,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  trailing?: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-4 px-4 py-3.5 transition-colors hover:bg-accent"
    >
      <Icon className="h-5 w-5 text-muted-foreground" />
      <span className="flex-1 text-sm font-medium">{label}</span>
      {trailing && (
        <span className="text-sm text-muted-foreground">{trailing}</span>
      )}
      <ChevronRight className="h-4 w-4 text-muted-foreground" />
    </Link>
  );
}

function Divider() {
  return <div className="ml-14 h-px bg-border" />;
}
