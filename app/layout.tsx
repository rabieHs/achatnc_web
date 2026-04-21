import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/lib/auth-context';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { Toaster } from '@/components/ui/sonner';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://achats.nc';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'achats.nc — Annonces en Nouvelle-Calédonie',
    template: '%s · achats.nc',
  },
  description:
    "Vente entre particuliers en Nouvelle-Calédonie. Véhicules, immobilier, électronique et bien plus.",
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    siteName: 'achats.nc',
    url: siteUrl,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className={`${inter.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <AuthProvider>
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
