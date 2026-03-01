# CLAUDE.md — Asset Management Zoho (Claude Code Extension)
# This file extends AGENTS.md with Claude Code-specific context.
# READ AGENTS.md FIRST — all architecture, rules, and project identity live there.

---

## Claude Code Notes

- **Catalyst full-stack**: client (`src/`) + functions (`functions/`) both deploy via `catalyst deploy`
- **ZCQL, not SQL**: Catalyst Datastore uses ZCQL syntax. `SELECT rowid, AssetName FROM Assets WHERE Status = 'Available'`
- **`tobeuploaded/`**: manually uploaded to Catalyst — do not attempt to auto-deploy these scripts
- **`create_catalyst_config.py`**: run once on a fresh clone to generate `.catalystrc` from env vars
- **React 18 + Vite**: frontend lives in `src/`, builds to `dist/` via `npm run build` (or `catalyst deploy` does it automatically)

## Useful Claude Code Commands for This Project

```bash
# Frontend dev
npm run dev

# Deploy everything
catalyst deploy

# Check Catalyst config
cat catalyst.json
cat .catalystrc

# View Datastore tables (needs Catalyst CLI logged in)
catalyst datastore:list
```

## What to Read Before Touching Code

1. `AGENTS.md` — CRITICAL shared credential warning + architecture overview
2. `PROJECT_IDENTITY.md` — locked identity
3. `catalyst.json` — function names (do not change)
4. `create_tables.sql` — Datastore schema reference
5. `functions/` — Catalyst backend functions
