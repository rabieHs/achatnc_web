// Mirrors /Users/anim/marketplace/lib/features/categories/domain/category.dart
// and subcategories_config.dart. Keep in sync when the mobile config changes.

import {
  Briefcase,
  Car,
  Home,
  Umbrella,
  Smartphone,
  Sofa,
  Users,
  Shirt,
  Volleyball,
  PawPrint,
  Wrench,
  Handshake,
  Gift,
  MoreHorizontal,
  type LucideIcon,
} from 'lucide-react';

export interface Category {
  id: string;
  name: string;
  order: number;
  icon: LucideIcon;
}

export interface Subcategory {
  id: string;
  name: string;
}

export const CATEGORIES: Category[] = [
  { id: 'vehicules', name: 'Véhicules', order: 0, icon: Car },
  { id: 'vacances', name: 'Locations de vacances', order: 1, icon: Umbrella },
  { id: 'emploi', name: 'Emploi', order: 2, icon: Briefcase },
  { id: 'immobilier', name: 'Immobilier', order: 3, icon: Home },
  { id: 'electronique', name: 'Électronique', order: 4, icon: Smartphone },
  { id: 'maison_jardin', name: 'Maison & jardin', order: 5, icon: Sofa },
  { id: 'famille', name: 'Famille', order: 6, icon: Users },
  { id: 'mode', name: 'Mode', order: 7, icon: Shirt },
  { id: 'loisirs', name: 'Loisirs', order: 8, icon: Volleyball },
  { id: 'animaux', name: 'Animaux', order: 9, icon: PawPrint },
  { id: 'materiel_pro', name: 'Matériel professionnel', order: 10, icon: Wrench },
  { id: 'services', name: 'Services', order: 11, icon: Handshake },
  { id: 'dons', name: 'Dons', order: 12, icon: Gift },
  { id: 'divers', name: 'Divers', order: 13, icon: MoreHorizontal },
];

export const FEATURED_CATEGORIES = CATEGORIES.filter((c) => c.order <= 4);

export function getCategoryById(id: string): Category | undefined {
  return CATEGORIES.find((c) => c.id === id);
}

const SUBCATEGORIES: Record<string, Subcategory[]> = {
  emploi: [
    { id: 'offres_emploi', name: "Offres d'emploi" },
    { id: 'demandes_emploi', name: "Demandes d'emploi" },
    { id: 'stages', name: 'Stages' },
    { id: 'formations', name: 'Formations' },
  ],
  vehicules: [
    { id: 'voitures', name: 'Voitures' },
    { id: 'motos', name: 'Motos' },
    { id: 'utilitaires', name: 'Utilitaires' },
    { id: 'bateaux', name: 'Bateaux' },
    { id: 'pieces_auto', name: 'Pièces auto' },
    { id: 'autres_vehicules', name: 'Autres' },
  ],
  immobilier: [
    { id: 'ventes_immo', name: 'Ventes' },
    { id: 'locations', name: 'Locations' },
    { id: 'colocations', name: 'Colocations' },
    { id: 'bureaux_commerces', name: 'Bureaux & Commerces' },
    { id: 'terrains', name: 'Terrains' },
  ],
  vacances: [
    { id: 'locations_vacances', name: 'Locations de vacances' },
    { id: 'chambres_hotes', name: "Chambres d'hôtes" },
    { id: 'campings', name: 'Campings' },
  ],
  electronique: [
    { id: 'telephones', name: 'Téléphones' },
    { id: 'ordinateurs', name: 'Ordinateurs' },
    { id: 'tv_audio', name: 'TV & Audio' },
    { id: 'jeux_video', name: 'Jeux vidéo' },
    { id: 'photo_video', name: 'Photo & Vidéo' },
    { id: 'accessoires_tech', name: 'Accessoires' },
  ],
  maison_jardin: [
    { id: 'meubles', name: 'Meubles' },
    { id: 'electromenager', name: 'Électroménager' },
    { id: 'decoration', name: 'Décoration' },
    { id: 'jardin', name: 'Jardin' },
    { id: 'bricolage', name: 'Bricolage' },
  ],
  famille: [
    { id: 'vetements_enfants', name: 'Vêtements enfants' },
    { id: 'jouets', name: 'Jouets' },
    { id: 'puericulture', name: 'Puériculture' },
    { id: 'fournitures_scolaires', name: 'Fournitures scolaires' },
  ],
  mode: [
    { id: 'vetements_femme', name: 'Vêtements femme' },
    { id: 'vetements_homme', name: 'Vêtements homme' },
    { id: 'chaussures', name: 'Chaussures' },
    { id: 'accessoires_mode', name: 'Accessoires' },
    { id: 'montres_bijoux', name: 'Montres & Bijoux' },
  ],
  loisirs: [
    { id: 'sport', name: 'Sport' },
    { id: 'instruments_musique', name: 'Instruments de musique' },
    { id: 'livres', name: 'Livres' },
    { id: 'velos', name: 'Vélos' },
    { id: 'camping_plein_air', name: 'Camping & Plein air' },
  ],
  animaux: [
    { id: 'chiens', name: 'Chiens' },
    { id: 'chats', name: 'Chats' },
    { id: 'oiseaux', name: 'Oiseaux' },
    { id: 'poissons', name: 'Poissons' },
    { id: 'accessoires_animaux', name: 'Accessoires' },
    { id: 'autres_animaux', name: 'Autres' },
  ],
  materiel_pro: [
    { id: 'outillage', name: 'Outillage' },
    { id: 'materiel_agricole', name: 'Matériel agricole' },
    { id: 'materiel_btp', name: 'Matériel BTP' },
    { id: 'equipement_resto', name: 'Équipement restauration' },
    { id: 'fournitures_bureau', name: 'Fournitures de bureau' },
  ],
  services: [
    { id: 'demenagement', name: 'Déménagement' },
    { id: 'reparation', name: 'Réparation' },
    { id: 'menage', name: 'Ménage' },
    { id: 'cours', name: 'Cours particuliers' },
    { id: 'evenementiel', name: 'Événementiel' },
    { id: 'autres_services', name: 'Autres services' },
  ],
  dons: [
    { id: 'dons_meubles', name: 'Meubles' },
    { id: 'dons_vetements', name: 'Vêtements' },
    { id: 'dons_electronique', name: 'Électronique' },
    { id: 'dons_divers', name: 'Divers' },
  ],
  divers: [
    { id: 'collection', name: 'Collection' },
    { id: 'billetterie', name: 'Billetterie' },
    { id: 'autres_divers', name: 'Autres' },
  ],
};

export function getSubcategories(categoryId: string): Subcategory[] {
  return SUBCATEGORIES[categoryId] ?? [];
}

export function hasSubcategories(categoryId: string): boolean {
  return (SUBCATEGORIES[categoryId] ?? []).length > 0;
}
