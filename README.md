# Pinnacle Finance — Financial Dashboard

A feature-rich financial workspace built with **Next.js 14 (App Router)**, extending the [Vercel Next.js Learn “Dashboard App” course](https://nextjs.org/learn/dashboard-app) into a full product-style experience with analytics, exports, theming, and a dual-mode data layer (live Postgres or offline demo data).

---

## Features

### Core dashboard

- **Overview**: KPI cards (collected revenue, pending AR, invoice count, customer count), interactive **Recharts** (revenue area, expense donut, cash in/out bars), classic **CSS bar chart** for monthly revenue, latest invoices list, top customers by volume, and a recent activity feed with status badges.
- **Invoices**: Search with **debounced URL sync**, pagination with ellipsis logic, responsive table (mobile + desktop), create/edit flows, delete with server actions, and avatar-based customer display (no static image assets required).
- **Customers**: Searchable directory with per-customer invoice counts and paid vs pending totals.

### Additional modules (not in the course)

- **Analytics**: Dedicated page with area, composed (bar + line), pie, and bar charts for revenue, estimated margin proxy, expenses, and cash movement.
- **Budgets**: Quarterly budget cards with progress bars and spend vs cap (illustrative data).
- **Reports**: Full invoice register preview plus **CSV export** (quoted fields, UTF-8).
- **Settings**: Appearance (theme) and documentation for connecting Postgres and running the seed.

### Authentication & shell

- **Sign-in** with server actions and **`useFormState`** for loading and error feedback.
- **Route protection** via **middleware** (session cookie required for `/dashboard`).
- **Sign-out** from the sidebar (server action).
- **Landing page** with product positioning and demo credential hints.

### Experience

- **Dark mode** (`class` strategy): `localStorage` + `prefers-color-scheme` bootstrap script, toggle in header/settings.
- **Branding**: “Pinnacle” identity (replaces the course “Acme” placeholder).
- **Responsive layout**: Collapsible-friendly sidebar, max-width content region, mobile table patterns preserved from the course components.

---

## Technical achievements

| Area | Implementation |
|------|------------------|
| **Data layer** | `@vercel/postgres` for production paths; **demo fallback** from `placeholder-data.js` via `demo-queries.ts` so every route works **without** `POSTGRES_URL`. |
| **Validation & mutations** | **Zod** + server actions for `createInvoice`, `updateInvoice`, `deleteInvoice`; redirects with query errors on validation/DB failure. |
| **Session model** | HttpOnly **cookie** storing user id; **Edge-safe** middleware (no JWT library on Edge). |
| **Charts** | **Recharts** (`AreaChart`, `PieChart`, `BarChart`, `ComposedChart`) with typed tooltips and responsive containers. |
| **UI system** | **Tailwind** + `@tailwindcss/forms`, **clsx**, **Heroicons**, **next/font** (Inter + Lusitana). |
| **DX** | `npm run seed` script for `scripts/seed.js`; TypeScript throughout app code. |

---

## How this goes beyond the original course

The [Next.js Learn Dashboard course](https://nextjs.org/learn/dashboard-app) teaches App Router fundamentals: layouts, data fetching, search params, pagination skeletons, partial UI, and Postgres + seed. This project **keeps that spine** (invoices, customers, cards, charts, forms) and **extends** it in several directions:

1. **No-database mode** — The course assumes a connected database. Here, **read paths** fall back to deterministic demo data so the UI is fully explorable before Postgres is configured.

2. **Auth & middleware** — The starter does not ship complete **login**, **protected routes**, or **sign-out**. This repo adds cookie-based sessions, middleware guards, and a finished login UX with pending state.

3. **Product breadth** — The course stops at dashboard home, invoices, and customers. This repo adds **Analytics**, **Budgets**, **Reports (CSV)**, **Settings**, and a **marketing landing** page.

4. **Visualization** — The course uses a simple representational bar chart. This project adds **Recharts** for multiple coordinated chart types and a dedicated analytics surface.

5. **Theming & polish** — **Dark/light mode**, rebranded shell, **initials avatars** (replacing reliance on `/public` customer PNGs from the seed), and expanded navigation.

6. **Write path clarity** — Invoice mutations require Postgres (as in production); the UI surfaces a **demo read-only** message when writes are attempted without a database, instead of failing silently.

---

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000), sign in via **Log in** (demo: `user@nextmail.com` / `123456` when not using Postgres).

---

## GitHub Pages (static hosting)

This app is **normally deployed on Node** (e.g. Vercel) so Server Actions, middleware, and Postgres work. For **static hosting** on GitHub Pages, the repo includes:

- **`next.config.js`** — when `STATIC_EXPORT=true`, sets `output: 'export'`, `trailingSlash: true`, optional `BASE_PATH` / `assetPrefix` for project sites (`https://user.github.io/repo-name/`).
- **`npm run build:static`** — runs `scripts/build-static.mjs`, which temporarily swaps in client-only auth/invoice stubs (no Server Actions), removes `middleware.ts` for the build, runs `next build`, then restores your files. Output is **`out/`**.
- **`.github/workflows/deploy-github-pages.yml`** — on push to `main`/`master`, builds with `BASE_PATH=/Repository-Name` and deploys `out/` via **GitHub Actions → Pages**.

### One-time GitHub setup

1. Repo **Settings → Pages → Build and deployment → Source: GitHub Actions**.
2. Push to `main` (or run the workflow manually). The site will be at  
   `https://<user>.github.io/<repo>/`  
   matching the workflow’s default `BASE_PATH`.

### Custom base path

The workflow defaults to **`/<repository-name>`** (project pages). For a **user site** at the domain root (`https://username.github.io/` with no subpath), edit the workflow step env to set `BASE_PATH` and `NEXT_PUBLIC_BASE_PATH` to empty strings, or run locally:

```bash
BASE_PATH= NEXT_PUBLIC_BASE_PATH= npm run build:static
```

### Static vs full deployment

| | GitHub Pages (static) | Vercel / Node |
|--|------------------------|---------------|
| Browse dashboard, charts, CSV export | Yes | Yes |
| Sign-in | Demo only (`localStorage` + client redirect) | Cookie + bcrypt / Postgres |
| Create/edit/delete invoices | Redirects with `?error=demo` | Full Server Actions + DB |

For production features, deploy the default **`npm run build`** to a Node host, not static export.

### Optional: Postgres + seed

1. Copy `.env.example` to `.env.local` and set `POSTGRES_URL` (and related vars if needed).
2. Run:

```bash
npm run seed
```

Then use the same demo user after seeding, or create users per your schema.

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run start` | Run production server |
| `npm run seed` | Seed database (`dotenv` loads `.env.local`) |

---

## License

[MIT](LICENSE). The starter code comes from the [Next.js Learn dashboard course](https://github.com/vercel/next-learn) by Vercel, also under the MIT License.
