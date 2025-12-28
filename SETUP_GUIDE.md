# Setup & Integration Guide for Bluewud Asset Management System

## 1. Overview
This guide documents all backend CRUD functions added, required Zoho Catalyst integration steps, environment configuration, and remaining tasks to get the application fully operational.

---

## 2. Backend CRUD Endpoints (`functions/bridgex/index.js`)
| Entity | Action | HTTP Payload (POST) | Description |
|--------|--------|----------------------|-------------|
| **Assets** | `getAssets` | `{ "action": "getAssets" }` | Fetch all assets (paginated). |
| | `createAsset` | `{ "action": "create", "table_name": "Assets", "data": { … } }` | Insert a new asset. |
| | `updateAsset` | `{ "action": "update", "asset_id": "<ID>", "updates": { … } }` | Update fields of an asset. |
| | `deleteAsset` | `{ "action": "delete", "data": ["<ID1>", "<ID2>"] }` | Delete one or more assets. |
| **Consumables** | `getConsumables` | `{ "action": "getConsumables" }` | Retrieve all consumables. |
| | `createConsumable` | `{ "action": "create", "table_name": "Consumables", "data": { … } }` |
| | `updateConsumable` | `{ "action": "update", "asset_id": "<ID>", "updates": { … } }` |
| | `deleteConsumable` | `{ "action": "delete", "data": ["<ID>"] }` |
| **Vendors** | `getVendors` | `{ "action": "getVendors" }` |
| | `createVendor` | `{ "action": "create", "table_name": "Vendors", "data": { … } }` |
| | `updateVendor` | `{ "action": "update", "asset_id": "<ID>", "updates": { … } }` |
| | `deleteVendor` | `{ "action": "delete", "data": ["<ID>"] }` |
| **Reservations** | `getReservations` | `{ "action": "getReservations" }` |
| | `createReservation` | `{ "action": "create", "table_name": "Reservations", "data": { … } }` |
| | `updateReservation` | `{ "action": "update", "asset_id": "<ID>", "updates": { … } }` |
| | `deleteReservation` | `{ "action": "delete", "data": ["<ID>"] }` |
| **Departments** | `getDepartments` | `{ "action": "getDepartments" }` |
| | `createDepartment` | `{ "action": "create", "table_name": "Departments", "data": { … } }` |
| | `updateDepartment` | `{ "action": "update", "asset_id": "<ID>", "updates": { … } }` |
| | `deleteDepartment` | `{ "action": "delete", "data": ["<ID>"] }` |

All actions return a JSON response with `{ "status": "success" }` or an error object.

---

## 3. Data Context (`src/context/DataContext.jsx`)
The context now exposes:
- State arrays: `assets`, `consumables`, `vendors`, `reservations`, `departments`
- CRUD helpers: `addAsset`, `updateAsset`, `addConsumable`, `updateConsumable`, `deleteConsumable`, `addVendor`, `updateVendor`, `deleteVendor`, `addReservation`, `updateReservation`, `deleteReservation`, `addDepartment`, `updateDepartment`, `deleteDepartment`
- `fetchFromBackend` utility used by the helpers.

Components should import `useData` and call the appropriate helper instead of passing props.

---

## 4. Vendor Portal Refactor (`src/components/VendorPortal.jsx`)
- Now uses `useData()` to obtain `vendors` and `assets`.
- Retains the invoice‑upload stub with audit logging via `useAudit`.
- Search functionality and asset‑link count are unchanged.

Make sure any component that previously passed `vendors` or `assets` as props is updated to rely on the context.

---

## 5. Zoho Catalyst Integration
### 5.1 Required Credentials
1. **Catalyst App ID** – Find in Zoho Catalyst console under *App Settings → General*.
2. **Client ID & Client Secret** – Generated in *OAuth Clients*.
3. **API Key** – Optional for server‑to‑server calls (found under *API Keys*).
4. **Redirect URI** – Must match the one configured for your OAuth client (e.g., `http://localhost:5173/auth/callback`).

### 5.2 Environment Variables
Create a `.env` file at the project root (or add to your CI environment) with:
```
ZOHO_CATALYST_APP_ID=your_app_id
ZOHO_CATALYST_CLIENT_ID=your_client_id
ZOHO_CATALYST_CLIENT_SECRET=your_client_secret
ZOHO_CATALYST_API_KEY=your_api_key   # if used
ZOHO_CATALYST_URL=https://<your-app>.zoho.com   # base URL for API calls
```
The `DataContext` fetch helper uses `fetch('/server/bridgex', …)` which is automatically proxied by Catalyst when deployed.

### 5.3 Deploying to Catalyst
```bash
# Install Catalyst CLI (if not already)
npm i -g @zoho/zcatalyst-cli
# Login to your Zoho account
zcatalyst login
# Deploy the app (choose the workspace you created)
zcatalyst deploy
```
After deployment, verify the endpoints via the Catalyst console *Functions* tab or by hitting the live URL:
```
https://<your-app>.zoho.com/server/bridgex
```

---

## 6. Remaining Work & Roadmap
| Area | Status | Next Steps |
|------|--------|------------|
| **NotificationCenter** | Created but not integrated | Add `<NotificationCenter />` to `App.jsx` header, wire up real‑time alerts via `useData`.
| **DashboardWidgets** | Created but not displayed | Insert widgets into the dashboard view, connect each widget to its data source (e.g., asset counts, upcoming reservations).
| **QRGenerator** | Component exists | Embed QR code button in `AssetDetail` modal, pass asset ID to generate QR.
| **Authentication / Authorization** | Basic user context in place | Implement Zoho OAuth flow, protect routes based on roles (admin, user).
| **Performance & Scaling** | Basic polling (30 s) | Consider WebSocket or Server‑Sent Events for real‑time sync; add lazy loading for large tables.
| **Testing** | Manual testing done | Write automated tests for CRUD helpers (Jest + React Testing Library) and endpoint contracts.
| **CI/CD** | Not set up | Configure GitHub Actions to run lint, tests, and trigger `zcatalyst deploy` on merge to `main`.
| **Styling & Theming** | Dark mode and glass‑morphism applied | Verify accessibility contrast, add theme toggle persistence.
| **Documentation** | This guide created | Add inline JSDoc comments to all helper functions, generate API docs with `typedoc`.

---

## 7. Suggested Folder Structure for Future Growth
```
src/
├─ components/          # UI components
│   ├─ DashboardWidgets/
│   ├─ NotificationCenter/
│   └─ …
├─ context/            # React contexts (Data, User, Audit, Theme)
├─ services/           # Thin wrappers around fetchFromBackend for each entity
│   ├─ assetService.js
│   ├─ consumableService.js
│   └─ …
├─ pages/              # Route‑level pages (if using a router later)
├─ utils/              # Helper utilities (date, formatting, validation)
└─ hooks/              # Custom React hooks
```
Keeping business logic in `services/` isolates it from UI and makes unit testing easier.

---

## 8. Quick Validation Checklist
1. **Environment** – `.env` file populated with Catalyst credentials.
2. **Local Run** – `npm run dev` starts the Vite dev server without errors.
3. **CRUD Test** – Use `curl` (or Postman) to hit each endpoint (`create`, `get`, `update`, `delete`). Verify data appears in the UI.
4. **Deploy** – Run `zcatalyst deploy` and test the live URL.
5. **Audit Logs** – Confirm actions are logged via `useAudit`.
6. **Role Checks** – Verify admin‑only UI elements are hidden for regular users.

---

*End of Guide*
