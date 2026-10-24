# AKSHAR (অক্ষর) — Typography Foundry & Bengali Font Marketplace

> A high-performance, curated typography platform and digital foundry for Bengali typefaces, powered by **React 19**, **Vite**, and **Cloudflare's serverless infrastructure (Workers, D1, R2, Pages)**.

---

## 🌟 Highlights & Features

- 🔤 **Comprehensive Font Archive**: Over 719 Bengali typefaces spanning Unicode and Bijoy ANSI encodings.
- 🎨 **Type Specimen Waterfall & Glyph Matrix**: Interactive typography inspection across custom point sizes, weights, and glyph ranges.
- 📖 **Live Real-World Mockups**: Instant preview on realistic Book Covers, Newspaper layouts, and Typographic Posters.
- ⚡ **Cloudflare Serverless Architecture**:
  - **Cloudflare Pages**: High-speed global edge hosting for the React 19 SPA.
  - **Cloudflare Workers (Hono)**: Ultra-fast TypeScript API routes for font metadata, streaming previews, and downloads.
  - **Cloudflare D1**: Edge SQLite relational database storing font taxonomy, weights, licenses, and metrics.
  - **Cloudflare R2**: Zero-egress binary storage for all 723 font files (~118 MB).
  - **1-Year Immutable Edge Caching**: Drastically reduces egress and compute costs while ensuring instantaneous font loading.
- 🛡️ **Offline & Dev Fallback**: Automatic failover to local font catalog and static fonts if the API is offline.

---

## 🏗️ Architecture

```
Fontt-market/
├── public/                 # Static web assets & client fonts
│   ├── _headers            # Cloudflare Pages security & caching headers
│   └── _redirects          # SPA client-side routing & API proxy rules
├── src/                    # Frontend React 19 Application
│   ├── api/client.js       # Cloudflare Worker API client
│   ├── components/         # Specimen, Waterfall, Mockup & Studio views
│   ├── data/fontsData.js   # Featured typography catalog & font-face loader
│   └── utils/              # Unicode ↔ Bijoy ANSI conversion engine
├── worker/                 # Cloudflare Workers Backend (Hono + TypeScript)
│   ├── src/
│   │   ├── index.ts        # Hono router entrypoint
│   │   ├── routes/         # /api/fonts, /api/fonts/:id/preview, /api/download
│   │   ├── db/schema.sql   # D1 database schema
│   │   └── db/seed.sql     # Seed data for 719 fonts
│   └── scripts/            # D1 generator & R2 batch upload CLI scripts
└── wrangler.jsonc          # Cloudflare infrastructure configuration
```

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
cd worker && npm install && cd ..
```

### 2. Local Development

Run the frontend:
```bash
npm run dev
```

Run the Cloudflare Worker API locally (optional):
```bash
npm run dev:worker
```
The frontend automatically proxies `/api/*` to the Worker on `http://localhost:8787`.

### 3. Production Build
```bash
npm run build
```

---

## ☁️ Cloudflare Deployment

See [CLOUDFLARE_DEPLOYMENT.md](CLOUDFLARE_DEPLOYMENT.md) for full step-by-step instructions on provisioning D1, uploading font binaries to R2, and deploying the Worker and Pages apps within Cloudflare's free tier.

```bash
# 1. Apply D1 schema and seed
npm run db:migrate
npm run db:seed

# 2. Upload fonts to R2
npm run r2:upload

# 3. Deploy Worker API
npm run deploy:worker

# 4. Deploy Frontend to Cloudflare Pages
npm run deploy:pages
```

---

## 📄 License

Open-source and curated fonts are licensed under the **SIL Open Font License (OFL)** or their respective creator licenses.
