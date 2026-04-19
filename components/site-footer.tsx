import Link from 'next/link';

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t bg-muted/30">
      <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-3">
        <div>
          <h3 className="text-base font-bold">achats.nc</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            La place de marché de Nouvelle-Calédonie.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold">Liens</h4>
          <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
            <li>
              <Link href="/publier" className="hover:text-foreground">
                Déposer une annonce
              </Link>
            </li>
            <li>
              <Link href="/recherche" className="hover:text-foreground">
                Rechercher
              </Link>
            </li>
            <li>
              <Link href="/compte/mentions-legales" className="hover:text-foreground">
                Mentions légales
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold">Contact</h4>
          <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
            <li>
              <a href="mailto:contact@achats.nc" className="hover:text-foreground">
                contact@achats.nc
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 text-xs text-muted-foreground sm:px-6">
          <span>© {new Date().getFullYear()} achats.nc</span>
          <span>Version 1.0.0</span>
        </div>
      </div>
    </footer>
  );
}
