import { getPublicSupabase } from "@/lib/supabase/public"
import type { Product } from "@/lib/supabase/database.types"

/**
 * Catalogue de référence local complet.
 * Contient les produits initiaux de la scierie ainsi que la gamme de Charbon de Bois
 * compressé hexagonal (qualité restaurant avec trou central) et charbon artisanal français.
 */
export const LOCAL_PRODUCTS: Product[] = [
  // ===================== CHARBON DE BOIS & BRIQUETTES HEXAGONALES =====================
  {
    id: "e1a2b3c4-1001-4000-8000-000000000001",
    slug: "charbon-de-bois-hexagonal-extrude-sac-10kg",
    name: "Charbon de Bois Hexagonal Extrudé Pro - Carton / Sac 10 kg",
    short_description: "Briquettes hexagonales extrudées avec trou central • 5h+ de braises • Zéro fumée",
    description:
      "Briquettes de charbon de bois pur extrudé sous haute pression avec trou central (effet cheminée). Conçu pour les professionnels de la restauration (Yakitori, Kamado, grills fermés) et les passionnés de barbecue exigeants. Taux de carbone fixe exceptionnel (> 85%), zéro étincelle, allumage homogène et combustion longue durée de 5h sans fumée. Résidu de cendre inférieur à 4%.",
    category: "charbon_bois",
    species: ["Chêne", "Feuillus durs", "Sciures densifiées"],
    humidity_rate: 4.0,
    wood_length_cm: 15,
    packaging: "sac",
    volume_stere: null,
    weight_kg: 10.0,
    unit_price_cents: 2490,
    stock_quantity: 120,
    image_url: "/images/products/charbon-hexagonal-extrude.png",
    badge: "Qualité Resto 5h+",
    is_active: true,
    created_at: "2026-11-10T10:00:00.000Z",
  },
  {
    id: "e1a2b3c4-1002-4000-8000-000000000002",
    slug: "pack-duo-20kg-charbon-hexagonal-haute-performance",
    name: "Pack Duo 20 kg - Charbon Hexagonal Haute Performance (2 x 10 kg)",
    short_description: "Pack de 2 sacs de 10 kg (20 kg) • Économie de 5€ • Zéro projection",
    description:
      "Pack avantageux de 2 sacs de 10 kg (20 kg au total) de charbon de bois compressé hexagonal de qualité restaurant. Idéal pour toute la saison de grillades ou pour équiper votre barbecue céramique (Big Green Egg, Kamado Joe) et four à braise. Température de cuisson stable (> 350°C) et braises vives constantes pendant 5 à 6 heures.",
    category: "charbon_bois",
    species: ["Chêne", "Feuillus durs"],
    humidity_rate: 4.0,
    wood_length_cm: 15,
    packaging: "sac",
    volume_stere: null,
    weight_kg: 20.0,
    unit_price_cents: 4490,
    stock_quantity: 85,
    image_url: "/images/products/charbon-hexagonal-extrude.png",
    badge: "Pack Duo Éco",
    is_active: true,
    created_at: "2026-11-10T10:00:00.000Z",
  },
  {
    id: "e1a2b3c4-1003-4000-8000-000000000003",
    slug: "demi-palette-charbon-hexagonal-restauration-500kg",
    name: "Demi-Palette Charbon Hexagonal Restauration - 500 kg (50 Sacs)",
    short_description: "Demi-palette de 50 sacs de 10 kg • Idéal brasseries, rôtisseries & traiteurs",
    description:
      "Demi-palette de 50 sacs de 10 kg (500 kg net) de charbon de bois compressé hexagonal professionnel. Conçu pour un usage intensif en cuisine professionnelle : rôtisseries, churrascarias, grillades au feu de bois. Livré sur palette protégée avec déchargement au transpalette tout-terrain devant votre établissement.",
    category: "charbon_bois",
    species: ["Chêne", "Feuillus durs"],
    humidity_rate: 4.0,
    wood_length_cm: 15,
    packaging: "palette",
    volume_stere: null,
    weight_kg: 500.0,
    unit_price_cents: 84900,
    stock_quantity: 20,
    image_url: "/images/products/charbon-hexagonal-extrude.png",
    badge: "Tarif Pro Dégressif",
    is_active: true,
    created_at: "2026-11-10T10:00:00.000Z",
  },
  {
    id: "e1a2b3c4-1004-4000-8000-000000000004",
    slug: "palette-pro-charbon-hexagonal-extrude-1000kg",
    name: "Palette Pro Charbon Hexagonal Extrudé - 1 000 kg (100 Sacs de 10 kg)",
    short_description: "Palette complète 1 Tonne (100 sacs de 10 kg) • Tarif grossiste direct scierie",
    description:
      "Palette complète de 100 sacs de 10 kg (1 Tonne nette) de charbon de bois hexagonal haute densité qualité restauration. Offre un rendement calorifique exceptionnel permettant de réduire la consommation de charbon de près de 40% par rapport au charbon ordinaire. Dépose au chariot embarqué directement dans votre remise ou garage.",
    category: "charbon_bois",
    species: ["Chêne", "Feuillus durs"],
    humidity_rate: 4.0,
    wood_length_cm: 15,
    packaging: "palette",
    volume_stere: null,
    weight_kg: 1000.0,
    unit_price_cents: 149000,
    stock_quantity: 15,
    image_url: "/images/products/charbon-hexagonal-extrude.png",
    badge: "Spécial Restaurateurs",
    is_active: true,
    created_at: "2026-11-10T10:00:00.000Z",
  },
  {
    id: "e1a2b3c4-1005-4000-8000-000000000005",
    slug: "charbon-de-bois-artisanal-chene-charme-sac-50l",
    name: "Charbon de Bois Artisanal de Chêne & Charme - Sac 50 Litres (10 kg)",
    short_description: "Sac kraft 50L • Gros morceaux calibrés 40-120mm • Zéro poussière",
    description:
      "Charbon de bois de tradition française issu de nos forêts gérées durablement. Gros morceaux purs et triés de chêne et charme massifs, carbonisés à l'ancienne en meule fermée. Allumage ultra-rapide sans produit chimique, braises ardentes parfumées pour 3 à 4 heures de grillades savoureuses.",
    category: "charbon_bois",
    species: ["Chêne", "Charme", "Hêtre"],
    humidity_rate: 5.0,
    wood_length_cm: 10,
    packaging: "sac",
    volume_stere: null,
    weight_kg: 10.0,
    unit_price_cents: 2190,
    stock_quantity: 90,
    image_url: "/images/products/charbon-bois-artisanal.jpg",
    badge: "Artisanal Français",
    is_active: true,
    created_at: "2026-11-10T10:00:00.000Z",
  },

  // ===================== BOIS DE CHAUFFAGE EN BÛCHES =====================
  {
    id: "3b727f40-a1d0-4b46-8101-0c673f9e4805",
    slug: "chene-charme-33cm-palette-3-steres",
    name: "Chêne & Charme Sec - 33 cm (3 Stères)",
    short_description: "Palette ballot 3 stères coupée en 33 cm, séché naturellement sous abri.",
    description:
      "Mélange de bois dur premium (Chêne, Charme, Hêtre). Idéal pour poêles et inserts modernes. Taux d'humidité certifié inférieur à 20% pour un pouvoir calorifique maximal et un encrassement minimal.",
    category: "bois_buches",
    species: ["Chêne", "Charme", "Hêtre"],
    humidity_rate: 18.0,
    wood_length_cm: 33,
    packaging: "palette",
    volume_stere: 3.0,
    weight_kg: 1350.0,
    unit_price_cents: 38900,
    stock_quantity: 45,
    image_url: "/images/products/chene-charme-33cm.jpg",
    badge: "Prêt à brûler",
    is_active: true,
    created_at: "2026-10-30T13:39:42.510266+00:00",
  },
  {
    id: "720997eb-acb5-4706-b623-2b352ba3d937",
    slug: "chene-hetre-50cm-palette-4-steres",
    name: "Feuillus Durs - 50 cm (4 Stères)",
    short_description: "Palette de 4 stères coupée en 50 cm pour grandes cheminées et foyers ouverts.",
    description:
      "Essences de bois dur sélectionnées (Chêne, Hêtre, Frêne). Séchage supérieur garantissant une flambée vive et une très longue tenue de braise.",
    category: "bois_buches",
    species: ["Chêne", "Hêtre", "Frêne"],
    humidity_rate: 17.5,
    wood_length_cm: 50,
    packaging: "palette",
    volume_stere: 4.0,
    weight_kg: 1800.0,
    unit_price_cents: 46900,
    stock_quantity: 30,
    image_url: "/images/products/chene-hetre-50cm.jpg",
    badge: "Meilleure autonomie",
    is_active: true,
    created_at: "2026-10-30T13:39:42.510266+00:00",
  },
  {
    id: "b06d7cc9-e5c5-4fb3-bbe9-99f6d149623a",
    slug: "bois-de-chauffage-25cm-palette-2-steres",
    name: "Chêne & Charme Extra Sec - 25 cm (Palette 2 Stères rangés)",
    short_description: "Palette 2 stères rangés en 25 cm - Prêt à l'emploi pour petits poêles",
    description:
      "Palette de 2 stères de bois dur de scierie (chêne, charme, hêtre) coupés en 25 cm, idéal pour poêles étroits et petits inserts. Fendu fin, séché sous abri avec taux d'humidité garanti inférieur à 18%.",
    category: "bois_buches",
    species: ["Chêne", "Charme", "Hêtre"],
    humidity_rate: 17.0,
    wood_length_cm: 25,
    packaging: "palette",
    volume_stere: 2.0,
    weight_kg: 900.0,
    unit_price_cents: 31900,
    stock_quantity: 50,
    image_url: "/images/products/chene-charme-33cm.jpg",
    badge: "Spécial Poêles 25cm",
    is_active: true,
    created_at: "2026-11-03T09:00:32.858311+00:00",
  },

  // ===================== BÛCHES COMPRESSÉES =====================
  {
    id: "d9cb071a-ffac-457e-9524-40f490b9f12b",
    slug: "buches-compressees-nuit-pack-96-packs",
    name: "Bûches Compressées Haute Densité (Pack Nuit Longue Durée)",
    short_description: "Palette de 96 packs de bûches densifiées d'écorce pure pour braise continue jusqu'à 8h.",
    description:
      "Parfait pour maintenir la chaleur de votre foyer durant la nuit ou lors de vos absences. 100% naturel sans colle ni additif.",
    category: "buches_compressees",
    species: ["Chêne", "Hêtre"],
    humidity_rate: 9.0,
    wood_length_cm: 28,
    packaging: "palette",
    volume_stere: null,
    weight_kg: 960.0,
    unit_price_cents: 39900,
    stock_quantity: 25,
    image_url: "/images/products/buches-compressees.jpg",
    badge: "Chaleur continue 8h",
    is_active: true,
    created_at: "2026-10-30T13:39:42.510266+00:00",
  },
  {
    id: "8e5c63b4-d6e4-437f-82aa-9164ceec280a",
    slug: "buches-compressees-jour-palette-96-packs",
    name: "Bûches Compressées Cylindriques de Jour (Palette 96 packs)",
    short_description: "Palette 96 packs (960 kg) - Chaleur vive immédiate 100% feuillus durs",
    description:
      "Palette de 96 packs de 6 bûches densifiées cylindriques de jour (960 kg). Composées à 100% de sciures de chêne et hêtre compressées sans colle ni liant. Chaleur vive et montée en température rapide.",
    category: "buches_compressees",
    species: ["Chêne", "Hêtre"],
    humidity_rate: 8.5,
    wood_length_cm: 30,
    packaging: "palette",
    volume_stere: 3.5,
    weight_kg: 960.0,
    unit_price_cents: 38900,
    stock_quantity: 50,
    image_url: "/images/products/buches-compressees.jpg",
    badge: "Chaleur Vive",
    is_active: true,
    created_at: "2026-11-03T09:00:32.858311+00:00",
  },
  {
    id: "f906cf06-e13a-4485-a976-9a44c2b78afc",
    slug: "paves-bois-compresse-100-chene-palette",
    name: "Pavés de Bois Compressé 100% Chêne Pur (Palette 96 packs)",
    short_description: "Palette 96 packs (960 kg) - 100% chêne pur haute densité",
    description:
      "Palette de 96 packs de pavés densifiés rectangulaires 100% chêne massif (960 kg). Forme cubique très stable ne roulant pas dans le foyer. Haute inertie thermique et combustion longue durée.",
    category: "buches_compressees",
    species: ["Chêne"],
    humidity_rate: 8.0,
    wood_length_cm: 25,
    packaging: "palette",
    volume_stere: 3.8,
    weight_kg: 960.0,
    unit_price_cents: 40900,
    stock_quantity: 50,
    image_url: "/images/products/buches-compressees.jpg",
    badge: "100% Chêne Pur",
    is_active: true,
    created_at: "2026-11-03T09:00:32.858311+00:00",
  },

  // ===================== GRANULÉS DE BOIS =====================
  {
    id: "a3d92967-853f-4b32-afc9-a1e13bac0b3f",
    slug: "pellets-granules-din-plus-palette-66-sacs",
    name: "Granulés de Bois Din+ / EnPlus A1 (Palette 66 sacs)",
    short_description: "Palette de 66 sacs de 15 kg (990 kg) 100% résineux, haute performance énergétique.",
    description:
      "Pellets de bois ultra haute densité, sans additif chimique ni liant. Faible taux de cendres (< 0.5%) pour préserver votre poêle et prolonger les intervalles de nettoyage.",
    category: "granules_pellets",
    species: ["Résineux"],
    humidity_rate: 8.0,
    wood_length_cm: null,
    packaging: "sac",
    volume_stere: null,
    weight_kg: 990.0,
    unit_price_cents: 42900,
    stock_quantity: 60,
    image_url: "/images/products/pellets-din-plus.jpg",
    badge: "Din+ Certifié",
    is_active: true,
    created_at: "2026-10-30T13:39:42.510266+00:00",
  },
  {
    id: "460206c1-6c6a-4a81-b6df-d78ec062ba28",
    slug: "granules-vrac-camion-souffleur-tonne",
    name: "Granulés de Bois Premium en Vrac (Camion Souffleur à la tonne)",
    short_description: "À la tonne (min. 2 tonnes) - Livraison directe en silo par camion souffleur",
    description:
      "Livraison de granulés de bois de qualité supérieure Din+ en vrac par camion souffleur équipé d'une pesée embarquée et d'un dépoussiéreur haute pression. Idéal pour silos de chaudière automatique.",
    category: "granules_pellets",
    species: ["Résineux"],
    humidity_rate: 7.5,
    wood_length_cm: null,
    packaging: "vrac",
    volume_stere: null,
    weight_kg: 1000.0,
    unit_price_cents: 37900,
    stock_quantity: 50,
    image_url: "/images/products/pellets-din-plus.jpg",
    badge: "Livraison Silo",
    is_active: true,
    created_at: "2026-11-03T09:00:32.858311+00:00",
  },

  // ===================== ALLUMAGE & PETIT BOIS =====================
  {
    id: "c95e7ad3-0f06-4cef-8907-ec700a3592aa",
    slug: "filets-buchettes-allumage-ecologique-10-filets",
    name: "Filets de Bois d'Allumage Sec (Lot de 10 Filets de 40L)",
    short_description: "Petit bois fendu ultra sec pour un démarrage instantané et sans fumée.",
    description:
      "Bois tendre séché en étuve (< 12% humidité). Indispensable pour réussir son feu en méthode Top-Down économique et écologique.",
    category: "allumage",
    species: ["Feuillus tendres", "Résineux"],
    humidity_rate: 11.0,
    wood_length_cm: 20,
    packaging: "filet",
    volume_stere: null,
    weight_kg: 60.0,
    unit_price_cents: 4900,
    stock_quantity: 80,
    image_url: "/images/products/bois-allumage.jpg",
    badge: "Allumage Express",
    is_active: true,
    created_at: "2026-10-30T13:39:42.510266+00:00",
  },
  {
    id: "6d548195-d537-45df-add6-a3f565a2536e",
    slug: "allume-feu-naturel-laine-bois-carton-300",
    name: "Allume-Feux Écologiques en Laine de Bois (Carton 300 pièces)",
    short_description: "Carton de 300 allume-feux - 100% naturel sans odeur",
    description:
      "Carton de 300 rouleaux d'allume-feux naturels en laine de bois tressée et cire végétale pure. Allumage instantané sans odeur chimique ni fumée noire, indispensable pour la méthode d'allumage inversé Top-Down.",
    category: "allumage",
    species: ["Résineux", "Cire végétale"],
    humidity_rate: null,
    wood_length_cm: null,
    packaging: "sac",
    volume_stere: null,
    weight_kg: 6.0,
    unit_price_cents: 2900,
    stock_quantity: 50,
    image_url: "/images/products/bois-allumage.jpg",
    badge: "100% Naturel",
    is_active: true,
    created_at: "2026-11-03T09:00:32.858311+00:00",
  },
]

/**
 * Récupère tous les produits actifs, en combinant les données Supabase (si connectées)
 * et le catalogue local exhaustif afin de garantir que les nouveaux produits
 * sont immédiatement accessibles sans dépendance fragile.
 */
export async function getAllProducts(): Promise<Product[]> {
  try {
    const supabase = getPublicSupabase()
    const { data: dbProducts } = await supabase
      .from("products")
      .select("*")
      .eq("is_active", true)

    if (dbProducts && dbProducts.length > 0) {
      // Fusionner pour s'assurer que les produits locaux non présents dans Supabase (ex: charbon) sont inclus
      const merged = [...dbProducts]
      for (const localProd of LOCAL_PRODUCTS) {
        if (!merged.some((p) => p.slug === localProd.slug || p.id === localProd.id)) {
          merged.push(localProd)
        }
      }
      return merged.sort((a, b) => b.unit_price_cents - a.unit_price_cents)
    }
  } catch (error) {
    console.warn("Could not fetch products from Supabase, using local catalog fallback:", error)
  }

  return [...LOCAL_PRODUCTS].sort((a, b) => b.unit_price_cents - a.unit_price_cents)
}

/**
 * Récupère un produit par son slug
 */
export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const supabase = getPublicSupabase()
    const { data: dbProduct } = await supabase
      .from("products")
      .select("*")
      .eq("slug", slug)
      .single()

    if (dbProduct) {
      return dbProduct
    }
  } catch (error) {
    console.warn(`Product slug ${slug} not in Supabase, checking local catalog:`, error)
  }

  return LOCAL_PRODUCTS.find((p) => p.slug === slug) || null
}

/**
 * Récupère un produit par son ID
 */
export async function getProductById(id: string): Promise<Product | null> {
  try {
    const supabase = getPublicSupabase()
    const { data: dbProduct } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single()

    if (dbProduct) {
      return dbProduct
    }
  } catch (error) {
    console.warn(`Product ID ${id} not in Supabase, checking local catalog:`, error)
  }

  return LOCAL_PRODUCTS.find((p) => p.id === id) || null
}

/**
 * Récupère les slugs de tous les produits pour generateStaticParams
 */
export async function getAllProductSlugs(): Promise<{ slug: string }[]> {
  const products = await getAllProducts()
  return products.map((p) => ({ slug: p.slug }))
}

/**
 * Récupère les produits similaires / complémentaires
 */
export async function getRelatedProducts(slug: string, limit = 3): Promise<Product[]> {
  const all = await getAllProducts()
  const current = all.find((p) => p.slug === slug)
  
  if (!current) {
    return all.slice(0, limit)
  }

  // Priorité aux produits de la même catégorie
  const sameCategory = all.filter((p) => p.slug !== slug && p.category === current.category)
  if (sameCategory.length >= limit) {
    return sameCategory.slice(0, limit)
  }

  // Compléter avec d'autres produits
  const others = all.filter((p) => p.slug !== slug && p.category !== current.category)
  return [...sameCategory, ...others].slice(0, limit)
}
