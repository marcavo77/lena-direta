# AGENTS.md — Directives & Standards d'Ingénierie pour LenaDireta

> **Projet** : Plateforme e-commerce haut de gamme de vente en ligne de bois de chauffage, pellets et biocombustibles.
> **Architecture** : Next.js (App Router) • Supabase (PostgreSQL, Auth, RLS, Storage) • Vercel (Edge/Serverless Platform) • Tailwind CSS • shadcn/ui • Stripe.
> **Cible GitHub** : `marcavo77/lenadireta` (ou configuration choisie).

---

## 1. Vision Métier & Spécificités du Secteur

La vente de bois de chauffage et combustibles présente des contraintes logistiques et de conversion uniques :
- **Unités & Cubage** : Prise en charge des stères, m³, palettes, sacs et filets avec conversion automatique claire (1 stère en 33 cm ≠ 1 stère en 50 cm).
- **Calculateur de besoins** : Outil interactif permettant au client d'estimer sa consommation selon sa surface, son isolation et son type d'appareil (poêle à bois, insert, chaudière à granulés).
- **Logistique & Éligibilité de Livraison** :
  - Filtrage par code postal / rayon de livraison dès l'entrée sur le site.
  - Gestion des contraintes d'accès (camion 19T, camionnette avec hayon, transpalette tout-terrain sur gravier/pelouse).
  - Prise de rendez-vous avec créneau de livraison.
- **Transparence Qualité** : Taux d'humidité garanti (< 20% H1/prêt à l'emploi), essences de bois dur (chêne, charme, hêtre, frêne), certifications (PEFC, Din Plus, FSC).

---

## 2. Règle d'Or : Design Mobile-First & Ergonomie Tactile

Le trafic e-commerce sur ce secteur s'effectue à plus de 70% sur smartphone. Toute interface doit être pensée pour le pouce et les petits écrans.

### Principes Directeurs Mobile-First
1. **Conception ascendante** : Écrire d'abord le CSS pour les mobiles (`base`), puis surcharger avec les breakpoints (`sm:`, `md:`, `lg:`, `xl:`). Jamais l'inverse.
2. **Zones tactiles (Touch Targets)** :
   - Minimum strict de `44x44px` pour tous les éléments cliquables/tactiles.
   - Espacement suffisant entre les boutons pour éviter les "fat-finger errors".
3. **Composants d'Interaction Mobile** :
   - Utiliser des **Drawers / Bottom Sheets** (via Vaul ou Radix) plutôt que des modales centrées sur mobile.
   - Barre d'action collante en bas d'écran (**Sticky Bottom Bar**) sur la fiche produit (`[Prix total] + [Ajouter au panier]`) et dans le tunnel de commande (`[Étape suivante]`).
   - Gestes fluides : swipe pour fermer les filtres ou galeries photos.
4. **Optimisation des Formulaires** :
   - Définir systématiquement les bons attributs HTML : `inputmode="numeric"`, `type="tel"`, `autocomplete="shipping postal-code"`.
   - Autocomplétion d'adresse rapide (Google Places ou API Adresse data.gouv.fr pour la France).
5. **Performance & Core Web Vitals** :
   - Images servies en WebP/AVIF via `next/image` avec `sizes` explicites et placeholders blur.
   - Zéro Cumulative Layout Shift (CLS < 0.1).
   - Fast Interaction to Next Paint (INP < 200ms).

---

## 3. Sécurité Maximale ("Zero Trust" & Defense in Depth)

La sécurité financière, la protection des données personnelles (RGPD) et l'intégrité de la base de données sont prioritaires.

### A. Base de données & Supabase
- **Row Level Security (RLS)** : Activée OBLIGATOIREMENT sur **100% des tables**.
  - Aucune table ne doit être créée sans politique RLS explicite.
  - Les utilisateurs ne peuvent lire et modifier que leurs propres paniers, commandes, adresses et profils.
  - Les tables de référence (produits, catégories, tarifs de livraison) sont en lecture publique (`auth.role() = 'anon' OR auth.role() = 'authenticated'`) et modification réservée aux administrateurs.
- **Clés API & Variables d'Environnement** :
  - `SUPABASE_SERVICE_ROLE_KEY` : STRICTEMENT réservée aux scripts serveur d'administration et aux webhooks Stripe. **JAMAIS** exposée au client (`NEXT_PUBLIC_`).
  - Utilisation de `createClient()` de `@supabase/ssr` avec gestion sécurisée des cookies de session HTTP-Only.
- **Database Types** : Génération automatique des types TypeScript depuis le schéma Supabase (`supabase gen types typescript`).

### B. Validation & Server Actions
- **Validation Zod Intégrale** : Tout payload entrant dans une Server Action ou API Route doit être validé via un schéma Zod strict (`schema.parse` ou `safeParse`).
- **Authentification & Rôles** : Chaque mutation sensible (création de commande, modification d'adresse, accès facture) doit vérifier l'identité de la session Supabase avant toute opération.
- **Sanitisation** : Protection native contre les injections SQL (requêtes paramétrées PostgREST/Supabase) et XSS (échappement React).

### C. Paiements & Webhooks Stripe
- **Idempotence** : Enregistrement de l'ID d'événement Stripe (`event.id`) pour éviter le double traitement d'une commande.
- **Vérification de Signature** : Toujours vérifier la signature `stripe-signature` avec `stripe.webhooks.constructEvent` et le secret de webhook dédié.
- **Source de Vérité des Prix** : Les prix et montants facturés sont TOUJOURS calculés côté serveur d'après la base de données, jamais d'après les données envoyées par le client.

### D. En-têtes HTTP & Middlewares
- Configuration de `Content-Security-Policy` (CSP), `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, et `Permissions-Policy`.
- Rate-limiting sur les routes de login, création de compte et requêtes de code postal.

---

## 4. Stack Technique & Décisions d'Architecture

```
Next.js (App Router)
├── app/
│   ├── (shop)/               # Routes vitrine & catalogue (SSR / ISR)
│   │   ├── page.tsx          # Homepage conversion-driven
│   │   ├── catalogue/        # Filtres facettés (bois, pellets, conditionnement)
│   │   ├── produit/[slug]/   # Fiche produit détaillée avec calculateur
│   │   ├── simulateur/       # Calculateur de volume & devis livraison
│   │   └── panier/           # Panier & calcul des frais de port
│   ├── (checkout)/           # Tunnel de commande isolé, sans distraction
│   │   ├── tunnel/
│   │   └── confirmation/
│   ├── (account)/            # Espace client authentifié
│   │   ├── commandes/
│   │   └── adresses/
│   ├── (admin)/              # Dashboard gestionnaire (accès restreint RLS)
│   │   ├── stocks/
│   │   ├── livraisons/
│   │   └── commandes/
│   └── api/
│       └── webhooks/         # Webhook Stripe, notifications
├── components/
│   ├── ui/                   # Primitives shadcn/ui
│   ├── mobile/               # Composants spécifiques smartphone (StickyBar, BottomSheets)
│   ├── shop/                 # Cartes produits, sélecteur stères, badges humidité
│   └── forms/                # Formulaires avec react-hook-form + zod
├── lib/
│   ├── supabase/             # Clients client, server, admin (@supabase/ssr)
│   ├── stripe/               # SDK Stripe & helpers
│   └── utils/                # Formatage devises, calcul stères -> m³
```

### Technologies Clés
1. **Framework** : Next.js 15+ (App Router, React Server Components, Server Actions).
2. **Design & UI** : Tailwind CSS v4, Lucide React, Radix UI / shadcn/ui, `class-variance-authority` (cva).
3. **Typographie & Charte Graphique** :
   - Couleurs : Palette chaleureuse et professionnelle (Chêne naturel, Ambre braise, Forêt profond, Ardoise sombre).
   - Typographie : Sans-serif moderne, haute lisibilité sur écran tactile (Geist / Inter).
4. **Base de Données & Auth** : Supabase PostgreSQL avec extensions `pgcrypto`, `uuid-ossp`. Authentification par Magic Link et Email/Mot de passe.
5. **Gestion d'État** : Server State par défaut, Zustand pour le panier local/session invité si nécessaire.
6. **Emails Transactionnels** : Resend avec des templates React Email (emails responsive pour confirmation de commande, expédition et facturation).

---

## 5. Directives pour l'Agent IA (Code & Décisions)

À chaque écriture ou modification de code dans ce dépôt, respecte rigoureusement les principes suivants :

1. **Simplicité & Robustesse (KISS & DRY)** :
   - Évite les sur-abstractions. Préfère du code clair, modulaire et directement lisible.
   - Pas de bibliothèques tierces superflues si les capacités natives de React/Next.js suffisent.
2. **Accessibilité (A11y)** :
   - Rôles ARIA adéquats sur les accordéons, tiroirs de filtres et calculateurs.
   - Contraste des textes conforme WCAG AA (au moins 4.5:1 sur les boutons et textes informatifs).
3. **SEO Local & E-commerce** :
   - Métadonnées dynamiques (`generateMetadata`) sur chaque fiche produit et catégorie.
   - Données structurées JSON-LD : `Product`, `AggregateRating`, `Offer`, `LocalBusiness`, `FAQPage`.
4. **Robustesse Mobile** :
   - Tester mentalement chaque écran à une largeur de `375px` (iPhone SE / standard).
   - Toujours vérifier qu'aucun tableau ou conteneur ne déborde horizontalement (`overflow-x-hidden` maîtrisé, défilement horizontal explicitement stylisé avec scrollbars masquées si carrousel).
