# AGENTS.md — Asset Management Zoho
# Universal AI context file. Read this first, regardless of which AI tool you are.
# Works with: Claude Code, MiniMax, Antigravity, OpenClaw, Codex, Cursor, Copilot

---

## Project Identity

- **Name:** Asset Management Zoho
- **Owner:** Shubh (Bluewud)
- **Platform:** Zoho Catalyst (React 18 frontend + Catalyst backend functions)
- **Status:** Live / Internal Tool
- **Purpose:** Internal asset tracking system. Employees check out/check in physical assets (laptops, equipment) through a Catalyst-hosted React app, with data stored in Zoho Catalyst Datastore.

---

## Tech Stack

| Layer       | Tech                                           |
|-------------|------------------------------------------------|
| Frontend    | React 18 + Vite (hosted on Catalyst client)   |
| Backend     | Zoho Catalyst Advanced I/O functions (Node.js)|
| Database    | Zoho Catalyst Datastore (tables via ZCQL)     |
| Auth        | Zoho OAuth2 (shared client_id with Dimentions Audit) |
| Deployment  | `catalyst deploy` (full stack)                |

---

## CRITICAL — Shared Zoho Credentials

> **`ZOHO_CLIENT_ID` and `ZOHO_CLIENT_SECRET` are the SAME credentials used by Dimentions Audit Authenticator.**
> If you rotate these, you must update BOTH projects. Coordinate with Shubh before any rotation.

---

## Critical Rules — Any AI Must Follow

1. **Never hardcode Zoho tokens** — use `os.environ` (Python) or `process.env` (Node.js).
2. **`token_exchange.cjs`** — runs locally to set up auth. All secrets must come from env vars.
3. **`tobeuploaded/`** — scripts that get uploaded to Catalyst manually by Shubh. Do not auto-deploy.
4. **`create_catalyst_config.py`** — reads from `os.environ`. Do not revert to hardcoded values.
5. **Catalyst Datastore ZCQL syntax** — not SQL. `SELECT * FROM Assets WHERE ...` but use ZCQL operators.
6. **Do not change table schema** in Catalyst Datastore without Shubh's approval — it affects live data.
7. **Never call `catalyst deploy`** — Shubh deploys.

---

## File Structure (important files)

```
src/                      ← React 18 frontend (Vite)
functions/                ← Catalyst backend functions (Node.js)
tobeuploaded/             ← Scripts uploaded manually to Catalyst
  inject_token.js         ← Sets OAuth token in Catalyst env (run once)
  auth_exchange.py        ← Python token exchange utility
create_catalyst_config.py ← Generates Catalyst config from env vars (run once)
token_exchange.cjs        ← Local token setup script
catalyst.json             ← Catalyst project config (do not change function names)
.env.example              ← Required env var names
PROJECT_IDENTITY.md       ← Locked identity
```

---

## Catalyst Datastore Notes

- Tables: `Assets`, `AssetCheckouts`, `Employees` (verify in Catalyst console)
- Use `ZCQL` for queries inside functions: `ZCatalyst.getInstance().datastore()...`
- Datastore is NOT a traditional SQL DB — read Catalyst docs before schema changes

---

## Auth Setup Flow (one-time, for context)

```
1. Run create_catalyst_config.py (generates .catalystrc)
2. Run token_exchange.cjs to get OAuth tokens
3. Run tobeuploaded/inject_token.js to push token to Catalyst env
4. Deploy with: catalyst deploy
```

---

## When Working on This Project

- UI changes: modify `src/` React components, test with `npm run dev`
- Backend changes: modify `functions/` Node.js files, test locally before deploy
- Data changes: use Catalyst console for manual Datastore updates
- Asset table schema is in `create_tables.sql` (reference only)

---

## Handoff Protocol

When done: summarize changes, list modified files, flag TODOs. Do not deploy.


## Session Start Checklist

Every session, before writing any code:
1. Read this AGENTS.md fully
2. Read TASKS.md — check what's IN PROGRESS (don't duplicate work)
3. Claim your task in TASKS.md before starting
4. Work on a branch: feat/[agent-tag]-T[id]-[slug]
5. Full protocol: BluewudOrchestrator/COORDINATION.md
