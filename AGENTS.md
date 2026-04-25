# LuDo-Chi Café — Agent Guide

## Project Overview

LuDo-Chi is a **mobile-first café web application** built with MedusaJS v2. The experience is designed to feel like a native app (inspired by Fore Coffee, Tomoro Coffee, and Gojek) with an elegant warm Japanese aesthetic targeting adult customers.

### Stack
- **Backend**: Medusa v2.7.0 (Node.js, TypeScript, PostgreSQL)
- **Storefront**: React Router 7 (Remix-based) + Tailwind CSS
- **Payment**: Midtrans (Indonesian payment gateway) — Snap integration
- **Workspace**: Yarn workspaces + Turbo

### Mobile-First Philosophy
- The UI is optimized for mobile viewport first; desktop is secondary.
- Bottom navigation bar (`BottomNav.tsx`) mimics native app tab bars.
- Touch-friendly buttons, horizontal scroll carousels, card-based layouts.
- PWA-ready with `manifest.json` and mobile-web-app meta tags.

### Warm Japanese Theme
- **Colors**: `#3D2B1F` (dark brown), `#6B3A1F` (chocolate), `#FFFAF4` (cream background), `#C47C3A` (caramel accent), `#E8D5B0` (light cream), `#9C8070` (muted).
- **Typography**: `Shippori Mincho` (serif display), `Noto Sans JP` (body/label).
- **Visual language**: Rounded cards, subtle gradients, minimal ornamentation, clean hierarchy.

## Directory Structure

```
apps/
  medusa/           — Medusa backend
    src/modules/midtrans/     — Custom Midtrans payment provider
    src/scripts/seed.ts       — Seed data (products, categories, reviews)
    medusa-config.ts          — Medusa configuration
  storefront/       — React Router 7 storefront
    app/components/           — UI components
    app/components/layout/    — Page layout (Header, BottomNav, Footer)
    app/hooks/                — Custom hooks (cart, region, customer, etc.)
    app/routes/               — Route files
    app/styles/global.css     — Global styles + CSS custom properties
    public/manifest.json      — PWA manifest
packages/           — Shared packages (if any)
```

## Critical Conventions

### Medusa Backend
- **ALWAYS** use Medusa workflows for mutations (Module → Workflow → API Route).
- **NEVER** call module services directly from API routes.
- Use only `GET`, `POST`, `DELETE` — no `PUT`/`PATCH`.
- Module names must be `camelCase` (no dashes).
- For detailed backend patterns, load `building-with-medusa` skill.

### Storefront
- **ALWAYS** use `sdk.client.fetch()` for custom API routes.
- **NEVER** use `JSON.stringify()` on request body — pass plain objects.
- Use React Query (`useQuery`, `useMutation`) for data fetching.
- For detailed storefront patterns, load `building-storefronts` skill.

## Environment Setup

1. **Copy env files**:
   ```bash
   yarn generate-env
   ```

2. **Install dependencies**:
   ```bash
   yarn install
   ```

3. **Init Medusa DB & seed**:
   ```bash
   yarn medusa:init
   ```

4. **Run dev**:
   ```bash
   yarn dev
   ```
   - Medusa admin: http://localhost:9000/app
   - Storefront: http://localhost:3000 (or port defined in .env)

## Key Features

- **Midtrans Payment**: Full Snap integration for Indonesian payments (QRIS, VA, e-wallet).
- **Order Types**: Take Away & Dine In selector on the Order page.
- **Product Categories**: Donut, Mochi, Drinks, Bundle.
- **Cart Drawer**: Slide-out cart with quantity management.
- **Order History**: Customer can view past orders with status badges.
- **PWA**: Installable on mobile home screen.

## Payment Flow

1. Customer adds items → Cart
2. Goes to `/order` → Select Take Away / Dine In
3. Clicks "Pesan Sekarang" → `/checkout`
4. Checkout collects address & uses Midtrans payment
5. Midtrans Snap popup/redirect handles payment
6. Webhook updates order status

## Deployment Notes

- Ensure `MIDTRANS_SERVER_KEY` and `MIDTRANS_CLIENT_KEY` are set in production `.env`.
- For production, set `isProduction: true` in Midtrans module options.
- The storefront is built with `react-router build` and served with `react-router-serve`.

## Troubleshooting

- **Build errors**: Run `yarn typecheck` in both `apps/medusa` and `apps/storefront`.
- **Database issues**: Run `yarn medusa:init` to reset DB (warning: destroys data).
- **Link sync errors**: Run `yarn sync` in `apps/medusa`.

## Skills Required

Always load these skills when working on this project:
- `building-with-medusa` — backend modules, workflows, API routes
- `building-storefronts` — SDK integration, React Query patterns
- `building-admin-dashboard-customizations` — if modifying admin UI
