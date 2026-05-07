import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mentions légales | achats.nc',
  description:
    'Conditions générales et mentions légales de achats.nc, plateforme de vente entre particuliers en Nouvelle-Calédonie, fondée par Bogdan Puel.',
  alternates: {
    canonical: 'https://www.achats.nc/mentions-legales',
  },
};

export default function MentionsLegalesPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-10 text-sm leading-relaxed sm:px-6">
      <H1>CGV ET MENTIONS LÉGALES</H1>
      <p className="mt-1 text-muted-foreground">achats.nc</p>

      <H2>PARTIE 1 — CONDITIONS GÉNÉRALES</H2>

      <H3>Article 1 — Objet</H3>
      <P>Les présentes conditions générales ont pour objet d&rsquo;encadrer&nbsp;:</P>
      <Ul>
        <li>l&rsquo;accès et l&rsquo;utilisation de la plateforme achats.nc&nbsp;;</li>
        <li>la publication, la consultation et la mise en relation autour d&rsquo;annonces entre utilisateurs&nbsp;;</li>
        <li>les services payants proposés par la plateforme, limités à ce jour à des prestations de mise en avant d&rsquo;annonces.</li>
      </Ul>
      <P>La plateforme a pour seule fonction de mettre en relation des utilisateurs en vue d&rsquo;éventuelles transactions réalisées hors ligne, directement entre eux.</P>

      <H3>Article 2 — Nature du service</H3>
      <P>La plateforme n&rsquo;est ni vendeur, ni revendeur, ni mandataire de vente, ni dépositaire, ni transporteur, ni séquestre, ni intermédiaire de paiement pour les ventes entre utilisateurs.</P>
      <P>La plateforme ne prend jamais possession des biens proposés à la vente, n&rsquo;en devient jamais propriétaire, ne contrôle pas matériellement leur conformité et ne garantit ni leur existence, ni leur origine, ni leur qualité, ni leur licéité, ni l&rsquo;exécution effective d&rsquo;une transaction.</P>
      <P>Les contrats relatifs aux biens proposés sur la plateforme sont conclus exclusivement entre le vendeur et l&rsquo;acheteur, sous leur seule responsabilité.</P>

      <H3>Article 3 — Acceptation</H3>
      <P>Toute utilisation du site emporte acceptation pleine et entière des présentes conditions générales.</P>
      <P>L&rsquo;utilisateur reconnaît avoir pris connaissance des présentes avant toute création de compte, dépôt d&rsquo;annonce, achat d&rsquo;option payante ou usage de la plateforme.</P>

      <H3>Article 4 — Accès et compte utilisateur</H3>
      <P>L&rsquo;utilisation active de la plateforme est réservée aux personnes majeures et juridiquement capables.</P>
      <P>L&rsquo;utilisateur s&rsquo;engage à fournir des informations exactes, à jour et sincères, à ne pas usurper l&rsquo;identité d&rsquo;un tiers, à ne pas créer plusieurs comptes pour contourner une restriction et à conserver ses identifiants de manière confidentielle.</P>
      <P>La plateforme peut demander à tout moment tout justificatif utile d&rsquo;identité, de domicile, de propriété, d&rsquo;origine du bien, de majorité, ou de régularité de l&rsquo;activité.</P>

      <H3>Article 5 — Statut des utilisateurs</H3>
      <P>Les utilisateurs peuvent agir comme particuliers.</P>
      <P>Toute personne agissant en réalité dans un cadre professionnel, habituel, organisé ou lucratif s&rsquo;interdit de se présenter comme simple particulier.</P>
      <P>La plateforme se réserve le droit de requalifier un compte, de refuser une annonce ou de suspendre un utilisateur en cas de doute sérieux sur son statut réel.</P>

      <H3>Article 6 — Dépôt et contenu des annonces</H3>
      <P>Toute annonce doit être loyale, précise, intelligible et conforme à la réalité.</P>
      <P>Le vendeur garantit notamment que&nbsp;:</P>
      <Ul>
        <li>il dispose du droit de proposer le bien&nbsp;;</li>
        <li>le bien existe réellement et est disponible&nbsp;;</li>
        <li>les photographies, descriptions, prix, caractéristiques, défauts et limitations sont exacts&nbsp;;</li>
        <li>l&rsquo;annonce ne porte atteinte à aucun droit de tiers&nbsp;;</li>
        <li>le bien n&rsquo;est ni volé, ni contrefait, ni illicite, ni dangereux au regard des lois applicables.</li>
      </Ul>
      <P>Sont notamment interdits les prix fictifs, les descriptions trompeuses, les mots-clés abusifs, les doublons massifs d&rsquo;annonces et tout contenu destiné à manipuler la visibilité ou à détourner les utilisateurs.</P>

      <H3>Article 7 — Biens, services et contenus interdits</H3>
      <P>Il est strictement interdit de publier, proposer, rechercher, promouvoir, échanger ou organiser via la plateforme tout bien, service ou contenu illicite, dangereux, frauduleux ou réglementé sans autorisation.</P>
      <P>Sont notamment interdits, sans que cette liste soit limitative&nbsp;:</P>
      <Ul>
        <li>armes, munitions, éléments d&rsquo;armes, accessoires essentiels, explosifs, artifices, produits de défense et objets assimilés&nbsp;;</li>
        <li>stupéfiants, substances dopantes, produits psychotropes, précurseurs chimiques et substances dangereuses&nbsp;;</li>
        <li>médicaments, dispositifs médicaux sensibles, ordonnances, produits pharmaceutiques, tests médicaux, produits sanguins&nbsp;;</li>
        <li>organes, tissus, cellules, échantillons biologiques, fluides corporels, matériel biologique, déchets médicaux ou hospitaliers&nbsp;;</li>
        <li>services sexuels, prostitution, escorting, mise en relation à finalité sexuelle tarifée ou exploitation de personnes&nbsp;;</li>
        <li>biens volés, recelés, contrefaits, piratés, falsifiés ou obtenus frauduleusement&nbsp;;</li>
        <li>données personnelles, comptes numériques, accès non cessibles, identifiants, abonnements détournés ou documents administratifs&nbsp;;</li>
        <li>contenus diffamatoires, haineux, menaçants, obscènes, violents ou portant atteinte à la dignité humaine&nbsp;;</li>
        <li>animaux, espèces protégées, produits interdits par la réglementation environnementale ou sanitaire&nbsp;;</li>
        <li>toute offre contraire à l&rsquo;ordre public, aux bonnes mœurs, à la sécurité ou à la réglementation applicable.</li>
      </Ul>
      <P>La plateforme se réserve le droit d&rsquo;étendre à tout moment la liste des catégories interdites ou restreintes.</P>

      <H3>Article 8 — Classement des annonces</H3>
      <P>Le classement des annonces peut notamment dépendre de plusieurs paramètres, parmi lesquels&nbsp;:</P>
      <Ul>
        <li>la pertinence par rapport à la recherche de l&rsquo;utilisateur&nbsp;;</li>
        <li>la catégorie&nbsp;;</li>
        <li>la localisation&nbsp;;</li>
        <li>la date de publication ou de mise à jour&nbsp;;</li>
        <li>la qualité et la complétude de l&rsquo;annonce&nbsp;;</li>
        <li>la qualité des visuels&nbsp;;</li>
        <li>le respect des règles de la plateforme&nbsp;;</li>
        <li>le cas échéant, la souscription à une option payante de mise en avant.</li>
      </Ul>
      <P>Lorsqu&rsquo;une annonce bénéficie d&rsquo;une mise en avant payante, son caractère sponsorisé ou promu doit être identifié de manière claire.</P>

      <H3>Article 9 — Service payant de mise en avant</H3>
      <P>La plateforme peut proposer, à titre payant, un service de mise en avant d&rsquo;annonce.</P>
      <P>Ce service a pour seul objet d&rsquo;augmenter temporairement la visibilité d&rsquo;une annonce sur la plateforme. Il ne garantit ni la vente du bien, ni le nombre de vues, ni le nombre de contacts, ni la rapidité de transaction, ni un quelconque résultat économique.</P>
      <P>Les caractéristiques essentielles du service, son prix, sa durée, ses conditions d&rsquo;activation et, le cas échéant, ses restrictions, sont indiqués avant validation de la commande.</P>
      <P>Le paiement de la mise en avant vaut commande ferme.</P>
      <P>Sauf faute de la plateforme ou obligation légale impérative contraire, toute mise en avant effectivement activée est due et non remboursable.</P>

      <H3>Article 10 — Paiement</H3>
      <P>Les seuls paiements encaissés par la plateforme concernent les prestations de mise en avant ou, le cas échéant, d&rsquo;autres services internes expressément proposés par la plateforme.</P>
      <P>Le paiement du bien vendu entre utilisateurs ne transite jamais par la plateforme. Il est convenu et réalisé directement entre les parties, en dehors du site et sous leur seule responsabilité.</P>
      <P>La plateforme n&rsquo;assure aucune fonction de séquestre, de réserve, de consignation, d&rsquo;avance, de transmission ou de garantie du prix des biens vendus entre utilisateurs.</P>

      <H3>Article 11 — Rencontre, vérification et remise du bien</H3>
      <P>Les utilisateurs organisent eux-mêmes leur prise de contact, leur rencontre, la vérification du bien et, le cas échéant, le paiement du prix.</P>
      <P>L&rsquo;acheteur est seul responsable de vérifier l&rsquo;identité du vendeur, la réalité du bien, son état, son fonctionnement, sa conformité apparente, sa provenance déclarée et son adéquation à ses besoins avant de conclure.</P>
      <P>Le vendeur est seul responsable de la réalité du bien, de son droit de le céder et de la sincérité des informations communiquées.</P>

      <H3>Article 12 — Absence de garantie de la plateforme</H3>
      <P>La plateforme n&rsquo;offre aucune garantie commerciale sur les biens proposés par les utilisateurs.</P>
      <P>Elle ne garantit pas&nbsp;:</P>
      <Ul>
        <li>la conclusion de la vente&nbsp;;</li>
        <li>la solvabilité d&rsquo;un acheteur&nbsp;;</li>
        <li>l&rsquo;honnêteté d&rsquo;un vendeur&nbsp;;</li>
        <li>l&rsquo;authenticité, la conformité, la sécurité ou la valeur d&rsquo;un bien&nbsp;;</li>
        <li>l&rsquo;absence de vice, de fraude, de litige, d&rsquo;erreur ou d&rsquo;arnaque.</li>
      </Ul>
      <P>Tout système de badge, vérification, signalement, notation ou modération a une valeur purement indicative et ne constitue ni certification, ni assurance, ni garantie.</P>

      <H3>Article 13 — Obligations de l&rsquo;utilisateur</H3>
      <P>L&rsquo;utilisateur s&rsquo;interdit notamment&nbsp;:</P>
      <Ul>
        <li>de publier des contenus faux, trompeurs ou illicites&nbsp;;</li>
        <li>de contourner les règles de modération&nbsp;;</li>
        <li>d&rsquo;insulter, menacer, harceler ou escroquer un autre utilisateur&nbsp;;</li>
        <li>d&rsquo;utiliser des robots, scripts, collecteurs automatiques ou moyens de scraping non autorisés&nbsp;;</li>
        <li>de porter atteinte au fonctionnement, à la sécurité ou à l&rsquo;intégrité de la plateforme&nbsp;;</li>
        <li>d&rsquo;utiliser la plateforme pour blanchir, dissimuler ou recycler des biens ou fonds d&rsquo;origine illicite.</li>
      </Ul>

      <H3>Article 14 — Modération, retrait, suspension</H3>
      <P>La plateforme peut, à tout moment, sans préavis et sans indemnité&nbsp;:</P>
      <Ul>
        <li>refuser ou supprimer une annonce&nbsp;;</li>
        <li>limiter sa visibilité&nbsp;;</li>
        <li>demander un justificatif&nbsp;;</li>
        <li>suspendre ou supprimer un compte&nbsp;;</li>
        <li>bloquer l&rsquo;accès à un service payant&nbsp;;</li>
        <li>conserver les éléments utiles à la preuve, à la sécurité ou au respect des obligations légales&nbsp;;</li>
        <li>transmettre toute information utile aux autorités compétentes ou à tout tiers légitimement habilité.</li>
      </Ul>
      <P>Toute somme versée pour une mise en avant peut rester acquise à la plateforme si l&rsquo;annonce ou le compte a été retiré ou suspendu en raison d&rsquo;une faute de l&rsquo;utilisateur.</P>

      <H3>Article 15 — Signalement</H3>
      <P>Toute personne peut signaler un contenu, une annonce ou un comportement qu&rsquo;elle estime frauduleux, dangereux ou illicite à l&rsquo;adresse suivante&nbsp;: <a className="text-primary hover:underline" href="mailto:contact@achats.nc">contact@achats.nc</a>.</P>
      <P>L&rsquo;utilisateur s&rsquo;engage à coopérer avec la plateforme en cas de demande d&rsquo;explication ou de justificatif.</P>

      <H3>Article 16 — Propriété intellectuelle</H3>
      <P>La structure du site, son nom, son habillage, ses textes, ses éléments graphiques, son code, ses bases de données et tout contenu appartenant à la plateforme sont protégés.</P>
      <P>Toute reproduction, extraction, réutilisation, copie ou exploitation non autorisée est interdite.</P>
      <P>L&rsquo;utilisateur accorde à la plateforme, pour les besoins du service, une licence non exclusive d&rsquo;hébergement, reproduction, représentation, adaptation technique et diffusion de ses contenus publiés.</P>

      <H3>Article 17 — Responsabilité</H3>
      <P>La plateforme n&rsquo;est tenue que d&rsquo;une obligation de moyens.</P>
      <P>Dans les limites permises par la loi, sa responsabilité ne pourra être engagée au titre&nbsp;:</P>
      <Ul>
        <li>des relations entre utilisateurs&nbsp;;</li>
        <li>d&rsquo;une vente non conclue ou mal conclue&nbsp;;</li>
        <li>d&rsquo;un vice, défaut, non-conformité, vol, escroquerie ou dommage lié à un bien&nbsp;;</li>
        <li>d&rsquo;un paiement réalisé hors plateforme&nbsp;;</li>
        <li>d&rsquo;un rendez-vous entre utilisateurs&nbsp;;</li>
        <li>d&rsquo;un contenu publié par un utilisateur&nbsp;;</li>
        <li>d&rsquo;une indisponibilité temporaire du site&nbsp;;</li>
        <li>d&rsquo;une intrusion, d&rsquo;un piratage, d&rsquo;un virus ou d&rsquo;un incident technique échappant à son contrôle raisonnable&nbsp;;</li>
        <li>d&rsquo;un dommage indirect, perte de chance, perte de profit, perte d&rsquo;image ou manque à gagner.</li>
      </Ul>
      <P>En tout état de cause, sauf faute lourde ou dolosive, la responsabilité totale de la plateforme, toutes causes confondues, est limitée au montant effectivement payé par l&rsquo;utilisateur à la plateforme au cours des douze derniers mois.</P>

      <H3>Article 18 — Données personnelles</H3>
      <P>La plateforme peut collecter et traiter des données nécessaires au fonctionnement du service, à la sécurité, à la modération, à la prévention de la fraude, à la gestion des comptes et au traitement des signalements.</P>
      <P>Ces traitements sont détaillés dans la politique de confidentialité du site.</P>

      <H3>Article 19 — Modification</H3>
      <P>La plateforme peut modifier les présentes à tout moment.</P>
      <P>La version applicable est celle en vigueur à la date d&rsquo;utilisation de la plateforme ou de commande du service payant concerné.</P>

      <H3>Article 20 — Droit applicable et juridiction</H3>
      <P>Les présentes conditions sont soumises au droit applicable au lieu d&rsquo;établissement de l&rsquo;éditeur.</P>
      <P>Tout litige relatif à leur validité, interprétation ou exécution relèvera des juridictions territorialement compétentes du ressort de l&rsquo;éditeur, sous réserve des règles impératives contraires.</P>

      <H2>PARTIE 2 — MENTIONS LÉGALES</H2>
      <H3>Éditeur et fondateur</H3>
      <P>Le site internet achats.nc est édité sous la responsabilité de M. Bogdan Puel, fondateur de la plateforme achats.nc.</P>
      <P>achats.nc est une plateforme de mise en relation entre particuliers en Nouvelle-Calédonie.</P>

      <H3>Contact</H3>
      <P><a className="text-primary hover:underline" href="mailto:contact@achats.nc">contact@achats.nc</a></P>

      <H3>Hébergement</H3>
      <P>
        OVH SAS<br />
        2 rue Kellermann<br />
        59100 Roubaix<br />
        France
      </P>

      <H3>Stockage des données</H3>
      <P>Firebase / Google</P>
    </article>
  );
}

function H1({ children }: { children: React.ReactNode }) {
  return <h1 className="text-2xl font-bold tracking-tight">{children}</h1>;
}

function H2({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mt-10 text-xl font-bold tracking-tight">
      {children}
    </h2>
  );
}

function H3({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mt-6 mb-2 text-base font-semibold">{children}</h3>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return <p className="mt-2 text-muted-foreground">{children}</p>;
}

function Ul({ children }: { children: React.ReactNode }) {
  return (
    <ul className="mt-2 list-disc space-y-1 pl-6 text-muted-foreground">
      {children}
    </ul>
  );
}
