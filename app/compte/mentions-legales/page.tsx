import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mentions légales',
};

export default function MentionsLegalesPage() {
  return (
    <article className="prose prose-slate mx-auto max-w-3xl px-4 py-10 text-sm leading-relaxed sm:px-6">
      <h1>CGV ET MENTIONS LÉGALES</h1>
      <p className="text-muted-foreground">achats.nc</p>

      <h2>PARTIE 1 — CONDITIONS GÉNÉRALES</h2>

      <h3>Article 1 — Objet</h3>
      <p>
        Les présentes conditions générales ont pour objet d&apos;encadrer
        l&apos;accès et l&apos;utilisation de la plateforme achats.nc, la
        publication, la consultation et la mise en relation autour d&apos;annonces
        entre utilisateurs, ainsi que les services payants proposés par la
        plateforme, limités à ce jour à des prestations de mise en avant
        d&apos;annonces.
      </p>

      <h3>Article 2 — Nature du service</h3>
      <p>
        La plateforme n&apos;est ni vendeur, ni revendeur, ni mandataire de
        vente, ni dépositaire, ni transporteur, ni séquestre, ni intermédiaire
        de paiement pour les ventes entre utilisateurs.
      </p>

      <p className="text-muted-foreground">
        (Contenu complet à reprendre depuis l&apos;application mobile — voir
        <code> lib/features/profile/presentation/legal_notices_screen.dart </code>
        pour les 20 articles.)
      </p>

      <h2>PARTIE 2 — MENTIONS LÉGALES</h2>

      <h3>Contact</h3>
      <p>
        <a href="mailto:contact@achats.nc">contact@achats.nc</a>
      </p>

      <h3>Hébergement</h3>
      <p>
        OVH SAS
        <br />
        2 rue Kellermann
        <br />
        59100 Roubaix, France
      </p>

      <h3>Stockage des données</h3>
      <p>Firebase / Google</p>
    </article>
  );
}
