# AKSHAR (অক্ষর) — Cloudflare Free-Tier Deployment & Operations Guide

This guide provides step-by-step instructions to deploy AKSHAR's frontend, backend API, database, and font storage entirely on **Cloudflare's generous Free Tier**.

---

## 🏗️ Architecture Overview

| Component | Cloudflare Service | Free Tier Allowance | AKSHAR Usage |
|---|---|---|---|
| **Frontend** | Cloudflare Pages | 500 builds / month | React 19 + Vite SPA |
| **Backend API** | Cloudflare Workers (Hono) | 100,000 requests / day | REST API (`/api/*`) |
| **Database** | Cloudflare D1 (SQLite) | 5M reads/day, 100K writes/day | 719 font records + metadata |
| **Font Storage** | Cloudflare R2 | 10 GB storage, 10M reads/month | ~118 MB (723 TTF/OTF files) |
| **Edge Cache** | Cloudflare Global CDN | Unlimited bandwidth | Immutable caching (1 year) |

---

## 📋 Prerequisites

1. Install **Node.js** (v18+) and **npm**.
2. Install **Wrangler** (Cloudflare CLI):
   ```bash
   npm install -g wrangler
   ```
3. Authenticate with your Cloudflare account:
   ```bash
   wrangler login
   ```

---

## 🚀 Step 1: Create & Seed the D1 Database

### 1.1 Create the D1 Database
Run in your terminal:
```bash
wrangler d1 create akshar-fonts-db
```
Wrangler will output the database details, including a `database_id`:
```
✅ Successfully created DB 'akshar-fonts-db'!
database_id: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

### 1.2 Update `wrangler.jsonc`
Open [wrangler.jsonc](file:///d:/Me/Fontt-market/wrangler.jsonc) and replace `"YOUR_D1_DATABASE_ID"` with the `database_id` from the output above:
```jsonc
"d1_databases": [
  {
    "binding": "DB",
    "database_name": "akshar-fonts-db",
    "database_id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
  }
]
```

### 1.3 Apply Schema & Seed Database (Remote Production)
```bash
# Apply schema
npm run db:migrate

# Seed all 719 fonts with metadata and styles
npm run db:seed
```

*(For local testing with Wrangler simulator: run `npm run db:migrate:local` and `npm run db:seed:local`)*

---

## 📦 Step 2: Create R2 Bucket & Upload Font Files

### 2.1 Create the R2 Bucket
```bash
wrangler r2 bucket create akshar-fonts
```

### 2.2 Upload Font Files
Upload all 723 font binaries from `public/fonts/` to R2:
```bash
npm run r2:upload
```
The script runs in batches with automatic retry and uploads each font preserving directory structure (e.g. `fonts/Akshar.ttf`, `fonts/abirvab/Abirvab Bold.ttf`).

---

## ⚡ Step 3: Deploy the Hono Worker API

Deploy the API to Cloudflare Workers:
```bash
npm run deploy:worker
```
Once deployed, Wrangler provides your worker URL, e.g.:
`https://akshar-api.<your-subdomain>.workers.dev`

You can verify health by visiting:
`https://akshar-api.<your-subdomain>.workers.dev/api/health`
or
`https://akshar-api.<your-subdomain>.workers.dev/api/fonts?pageSize=10`

---

## 🌐 Step 4: Deploy Frontend to Cloudflare Pages

### Option A: Via Git / Cloudflare Dashboard (Recommended)
1. Push your repository to GitHub / GitLab.
2. In the [Cloudflare Dashboard](https://dash.cloudflare.com):
   - Go to **Workers & Pages** → **Create** → **Pages** → **Connect to Git**.
   - Select your `Fontt-market` repository.
   - Set Build settings:
     - **Framework preset:** `Vite`
     - **Build command:** `npm run build`
     - **Build output directory:** `dist`
   - Save and Deploy.

### Option B: Deploy from CLI
```bash
npm run deploy:pages
```

---

## 💻 Local Development Workflow

Run frontend and worker backend concurrently:

1. **Terminal 1 — Worker API (runs at http://localhost:8787):**
   ```bash
   npm run dev:worker
   ```

2. **Terminal 2 — React Vite Frontend (runs at http://localhost:5173):**
   ```bash
   npm run dev
   ```

The Vite dev server is configured with a proxy in [vite.config.js](file:///d:/Me/Fontt-market/vite.config.js) that routes `/api/*` requests directly to `http://localhost:8787`. If the Worker is not running, the frontend gracefully falls back to local static font definitions.

---

## 🛡️ Free Tier Optimization Checklist

- [x] **Immutable Font Caching**: Font binaries streamed from R2 are delivered with `Cache-Control: public, max-age=31536000, immutable`, ensuring requests are served by Cloudflare's Edge CDN rather than consuming R2 read operations.
- [x] **Client-side Fallback**: The frontend attempts to query `/api/fonts`, and automatically falls back to bundled static data if the API is offline or during offline work.
- [x] **CORS & FontFace Support**: Worker endpoints send standard `Access-Control-Allow-Origin: *` headers, ensuring browser `FontFace` API can load fonts without security blocks.
- [x] **Edge Database Reads**: D1 queries are indexed by `category`, `encoding`, and `is_free` for sub-5ms query times.
