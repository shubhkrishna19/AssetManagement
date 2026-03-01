# PROJECT IDENTITY — Asset Management Zoho (Bluewud Asset Ledger Pro)

> **🔒 Locked. Do not modify without Shubh's approval.**
> Owner: Shubh Krishna / Bluewud Industries | Version 5.6.0

---

## What This Project Is

**Bluewud Asset Ledger Pro** — an internal React + Zoho Catalyst web app for tracking, auditing, and managing physical assets across Bluewud's operations.

- Tracks: IT equipment, furniture, machinery, vehicles, consumables
- Features: QR code scanning, check-in/out, warranty tracking, analytics dashboard, vendor management
- Audience: Internal Bluewud team (warehouse, admin, management)
- Embedded in Zoho Creator as an iframe

---

## Deployment Target

| Layer | Technology | Details |
|---|---|---|
| Frontend | React 18 + Vite → static build | `dist/` deployed to Catalyst client |
| Backend | Zoho Catalyst Advanced I/O | `functions/bridgex/index.js` |
| Database | Zoho Catalyst Datastore (ZCQL) | Tables: Assets, Consumables, Vendors, etc. |
| Hosting | Catalyst cloud | `coredev-913495338.development.catalystserverless.com` |
| Live URLs | `assetmanagement.onslate.com` / `assetmanagementdev.onslate.com` | |

**Deploy:** `catalyst deploy` from project root

---

## Approved Tech Stack

| Layer | Approved |
|---|---|
| Frontend | React 18, Vite, Recharts, html5-qrcode, xlsx |
| Backend | Node.js + Express + zcatalyst-sdk-node |
| Database | Catalyst ZCQL (no external DB) |
| Zoho | Creator embed, CRM integration |

---

## Folder Structure

```
src/              — React 18 frontend (components, services, context, config)
  config.js       — API URL auto-detection, feature flags
  mockData.js     — Demo data (30 assets, consumables, vendors)
functions/
  bridgex/        — Catalyst Advanced I/O function (Express API)
    index.js      — CRUD endpoints (getAssets, create, update, delete, etc.)
dist/             — Vite build output (deployed to Catalyst client)
ZohoIntegration/  — Zoho CRM sync module
tobeuploaded/     — Staging folder (local scripts, not deployed)
.env.example      — Documents required environment variables
```

---

## Environment Variables

| Variable | Purpose | Where |
|---|---|---|
| `ZOHO_CLIENT_ID` | OAuth app ID | Catalyst console |
| `ZOHO_CLIENT_SECRET` | OAuth app secret | Catalyst console (never in code) |
| `ZOHO_REFRESH_TOKEN` | Long-lived token | Catalyst console |

---

## Untouchable Without Shubh's Approval

- `catalyst.json` — project structure config
- `functions/bridgex/` — deployed backend
- CORS `allowedOrigins` list in `functions/bridgex/index.js`
- Database table schemas (SQL in `create_tables.sql`)
- This file (`PROJECT_IDENTITY.md`)

---

## ⚠️ Security Status

The following were previously hardcoded and have been removed from source. Rotate all of these:
- Zoho Client ID / Secret (used across multiple projects) → regenerate in Zoho API Console
- All refresh tokens in `create_catalyst_config.py`, `token_exchange.cjs`, `inject_token.js` → revoked
- `token_response.json` → deleted from repo
