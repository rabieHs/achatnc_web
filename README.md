# achats.nc — Web (Next.js)

Companion web app for the Achats.nc Flutter marketplace. Reuses the same Firebase project, same data, same users.

## Stack

- **Next.js 15** (App Router, Turbopack)
- **TypeScript**, **Tailwind CSS**, **shadcn/ui**
- **Firebase JS SDK** (Auth, Firestore, Storage) — client
- **firebase-admin** — server-side (SSR, webhooks)
- **Stripe** — for web payments (boosts) — Phase 4
- **Lucide** icons

## Project status

| Phase | Scope | Status |
|---|---|---|
| 1 | Scaffold, design tokens, header/footer, home, category, listing detail (SSR + OG), search, auth pages | Done |
| 2 | Create / edit / delete listing, favorites, profile edit, media upload | Pending |
| 3 | Real-time messaging (Firestore listeners) | Pending |
| 4 | Stripe Checkout + webhook for boosts | Pending |
| 5 | sitemap.xml, JSON-LD, SEO polish | Partial (JSON-LD on listing detail, OG tags, metadata done) |

---

## Setup

### 1 — Install

```bash
cd /Users/anim/achatnc_web
npm install
```

### 2 — Create a Web app in Firebase

The mobile app uses Android and iOS Firebase apps. You need a third Web app inside the same project.

1. Go to [Firebase Console](https://console.firebase.google.com/) → `marketpl-baa4f` → Project Settings → Your apps → Add app → Web (`</>`).
2. Register the app as "Achats.nc Web". Don't enable Firebase Hosting — we'll deploy to Vercel.
3. Copy the config values shown.

### 3 — Environment variables

```bash
cp .env.local.example .env.local
```

Fill in the values from the Firebase Web app config, plus:

- `FIREBASE_ADMIN_CREDENTIALS` — Firebase Console → Project Settings → Service Accounts → Generate new private key → paste the full JSON (single-lined).
- `STRIPE_*` — see Phase 4 below (leave empty for Phase 1).
- `NEXT_PUBLIC_SITE_URL` — `http://localhost:3000` locally, `https://achats.nc` in production.

### 4 — Firestore authorized domain

In Firebase Console → Authentication → Settings → Authorized domains, add:
- `localhost` (usually already there)
- `achats.nc` (for production)
- `*.vercel.app` (for preview deploys)

### 5 — Run

```bash
npm run dev
```

Open http://localhost:3000.

---

## Data contract with mobile

The web app reads and writes the same Firestore collections as mobile:

| Collection | Owner of writes |
|---|---|
| `listings/{id}` | Seller (except `featuredUntil` which is server-only) |
| `users/{uid}` | The user themselves |
| `users/{uid}/favorites/{listingId}` | The user themselves |
| `conversations/{id}` / `messages` | Conversation participants |
| `config/exchange_rate` | Cloud Function cache |
| `boostPurchases/{id}` | Webhook (Stripe & RevenueCat) |

The Firestore security rules are shared and live in `../marketplace/firebase/firestore.rules`.

## Architecture notes

- **SSR for SEO**: home, category, and listing detail pages are server-rendered via `firebase-admin`. This lets Google index every ad with full HTML.
- **ISR**: pages use `export const revalidate = 60` to re-generate every minute.
- **Client interactivity**: search, auth, messaging, create listing are Client Components using the Firebase JS SDK.
- **Image optimization**: `next/image` with Firebase Storage as an allowed remote host. See `next.config.ts`.

### next.config.ts — allow Firebase Storage images

Before deploying, update `next.config.ts`:

```ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
      },
    ],
  },
};

export default nextConfig;
```

---

## Routes

| Path | Purpose | Auth required |
|---|---|---|
| `/` | Home (SSR — featured + recent + categories) | No |
| `/categories` | All categories grid | No |
| `/categorie/[id]?sub=...` | Category + subcategory listings | No |
| `/recherche?q=&city=` | Search results | No |
| `/annonce/[id]` | Listing detail (SSR + OG + JSON-LD) | No |
| `/login` | Login | No |
| `/register` | Register + sends verification email | No |
| `/verify-email` | Verification checker | Yes (unverified) |
| `/publier` | Create listing | Yes (TODO) |
| `/compte` | Account home | Yes (TODO) |
| `/compte/modifier` | Edit profile | Yes (TODO) |
| `/compte/mes-annonces` | My listings | Yes (TODO) |
| `/compte/mentions-legales` | Legal notices | No |
| `/messages` | Conversations list | Yes (TODO) |
| `/messages/[id]` | Chat screen | Yes (TODO) |
| `/vendeur/[uid]` | Seller profile | No (TODO) |

---

## Deploy to Vercel + achats.nc

1. `git init && git add . && git commit -m "initial web app"`, push to GitHub.
2. Go to [vercel.com](https://vercel.com) → Import Project → pick the repo.
3. Add all env vars from `.env.local` to Vercel Project Settings → Environment Variables.
4. Deploy. Vercel gives you a `*.vercel.app` URL.
5. Domain: Vercel → Project → Settings → Domains → Add `achats.nc`. Follow Vercel's DNS instructions (A record to `76.76.21.21`, or CNAME for www).
6. In Firebase Console → Authentication → Authorized Domains: add `achats.nc`.

---

## Phase 4 — Stripe boosts (to come)

Design, ready to implement:

1. **Products** in Stripe Dashboard → Products:
   - Boost 1 semaine — 1 000 XPF (~8.38 €)
   - Boost 2 semaines — 1 800 XPF
   - Boost 1 mois — 3 500 XPF

   Grab each **Price ID** and paste into `.env.local`.

2. **API routes**:
   - `POST /api/stripe/checkout` → creates a Checkout Session with `metadata: { listingId, userId, boostTier }`, returns the URL.
   - `POST /api/stripe/webhook` → listens for `checkout.session.completed`. Validates Stripe signature, writes `featuredUntil` to the listing and a row to `boostPurchases`. Same logic as the RevenueCat webhook.

3. **UI**: reuse the bottom-sheet pattern from mobile as a shadcn Dialog. "Mettre en avant" button on `/annonce/[id]` visible only to the owner.

4. **Stripe webhook endpoint** in Stripe Dashboard → Developers → Webhooks → add `https://achats.nc/api/stripe/webhook` with event `checkout.session.completed`. Copy the signing secret into `STRIPE_WEBHOOK_SECRET`.

---

## Troubleshooting

- **JSON parse error on admin SDK init**: `FIREBASE_ADMIN_CREDENTIALS` must be valid JSON. If the key contains newlines, preserve them as `\n` or base64-encode and decode in `lib/firebase/admin.ts`.
- **Images don't load**: check `next.config.ts` has Firebase Storage in `remotePatterns`.
- **"Module not found: @/lib/..."**: TypeScript path mapping is configured in `tsconfig.json` with `"@/*"`.
- **Auth succeeds but redirect fails**: Firebase Auth Authorized Domains must include the current hostname.

---

## Keeping in sync with mobile

Several files are mirrors of the Flutter codebase. When you change them in mobile, update here too:

| Web file | Mobile source |
|---|---|
| `lib/categories.ts` | `lib/features/categories/domain/category.dart`, `subcategories_config.dart` |
| `lib/cities.ts` | `lib/core/constants/nc_cities.dart` |
| `lib/format.ts` (XPF→EUR constant) | `lib/core/utils/formatters.dart` |
| `lib/types.ts` | `lib/features/listings/domain/listing.dart`, etc. |
| `app/compte/mentions-legales/page.tsx` | `lib/features/profile/presentation/legal_notices_screen.dart` |
