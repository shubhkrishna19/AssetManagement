# Zoho Catalyst CLI Function Deployment Guide

A complete guide for deploying serverless functions to Zoho Catalyst.

---

## 1. Project Structure

Every Catalyst function project must have this structure:

```
project-root/
├── catalyst.json              # REQUIRED - Project configuration
├── functions/
│   └── function-name/         # Your function folder
│       ├── catalyst-function.json   # REQUIRED - Function configuration
│       ├── main.py            # REQUIRED - Handler function
│       ├── requirements.txt   # Python dependencies (if needed)
│       ├── rate_calculator.py # Your code
│       └── pincodes.csv       # Any data files
```

---

## 2. catalyst.json (Project Config)

**REQUIRED FILE** - Must be in project root:

```json
{
  "project": {
    "name": "CoreDev",
    "id": "43182000000012177"
  },
  "functions": {
    "function-name": "functions/function-name"
  }
}
```

- `name`: Your project name (e.g., CoreDev)
- `id`: Found in Catalyst console URL or project settings
- `functions`: Maps function folder names to their paths

---

## 3. catalyst-function.json (Function Config)

**REQUIRED FILE** - Must be inside each function folder:

```json
{
  "name": "function-name",
  "runtime": "python310",
  "handler": "main.handler",
  "timeout": 30,
  "memory": 1024,
  "description": "What this function does",
  "enable_mock": false,
  "environment_variables": {
    "PYTHONUNBUFFERED": "1"
  }
}
```

### Key Fields:
| Field | Required | Description |
|-------|----------|-------------|
| `runtime` | Yes | Use `python310` or `nodejs18` |
| `handler` | Yes | `filename.function_name` - must match your code |
| `timeout` | No | Max 300 seconds |
| `memory` | No | In MB, max 4096 |

---

## 4. main.py (Handler Function)

**REQUIRED** - Must have a `handler` function that Catalyst can call:

```python
def handler(request):
    """
    Catalyst serverless function handler.
    Called when the function is invoked.
    """
    # Get request data
    method = request.method.upper() if hasattr(request, 'method') else 'GET'

    # Parse body for POST
    body = {}
    if method == 'POST':
        if hasattr(request, 'body'):
            body = request.body if isinstance(request.body, dict) else {}

    # Extract parameters
    weight = body.get('weight')
    pincode = body.get('pincode')

    # Your logic here
    result = calculate_something(weight, pincode)

    # Return response in Catalyst format
    return {
        "status": 200,
        "body": result
    }
```

### Important:
- Function MUST be named `handler`
- Return format must be `{"status": 200, "body": {...}}`
- Import your other files normally

---

## 5. requirements.txt (Dependencies)

Only needed for Python functions with external packages:

```
fastapi>=0.100.0
uvicorn>=0.23.0
pandas>=2.0.0
```

---

## 6. Deployment Commands

### Login (if not logged in):
```bash
catalyst login
```

### Deploy:
```bash
catalyst deploy
```

### Check status:
```bash
catalyst serve
```

---

## 7. Testing Your Function

### Local test:
```bash
cd your-function-folder
catalyst serve
```

### Test with curl:
```bash
curl -X POST http://localhost:3000/function-name \
  -H "Content-Type: application/json" \
  -d '{"weight": 5, "pincode": 500001}'
```

---

## 8. Common Mistakes & Fixes

### ❌ Missing catalyst.json
```
Error: No catalyst.json found
```
**Fix:** Create `catalyst.json` in project root with project config

### ❌ Wrong handler name
```
Error: Handler function not found
```
**Fix:** Ensure `catalyst-function.json` has correct handler:
```json
"handler": "main.handler"
```
And your main.py has `def handler(request):`

### ❌ Missing function folder in catalyst.json
```
Error: Function not found
```
**Fix:** Add to catalyst.json:
```json
"functions": {
  "my-function": "functions/my-function"
}
```

### ❌ Wrong runtime
```
Error: Runtime not supported
```
**Fix:** Use valid runtime - `python310` or `nodejs18`

### ❌ Forgot to include data files
```
Error: File pincodes.csv not found
```
**Fix:** Make sure CSV/data files are in the function folder

### ❌ Token refresh error
```
Error: unable to refresh access token
```
**Fix:** Run `catalyst logout` then `catalyst login`

---

## 9. Checklist Before Deploying

- [ ] `catalyst.json` exists in project root
- [ ] `catalyst-function.json` exists in function folder
- [ ] `main.py` has a `handler` function
- [ ] Handler name matches in catalyst-function.json
- [ ] Runtime is correct (python310 or nodejs18)
- [ ] Function path is correct in catalyst.json
- [ ] Logged into correct organization

---

## 10. Get Your Project ID

1. Go to https://catalyst.zoho.com
2. Select your organization
3. Open your project
4. Look at the URL: `https://catalyst.zoho.com/.../project_id=43182000000012177`
5. Or go to Project Settings → General

---

## Quick Reference

| What | Where | Example |
|------|-------|---------|
| Project config | Root | `catalyst.json` |
| Function config | Inside function folder | `functions/calc/catalyst-function.json` |
| Handler code | Inside function folder | `functions/calc/main.py` |
| Dependencies | Inside function folder | `functions/calc/requirements.txt` |

---

## Example: Shipping Rate Calculator

```
shipping-rate-calculator/
├── catalyst.json
└── functions/
    └── shipping-rate-calculator/
        ├── catalyst-function.json
        ├── main.py
        ├── rate_calculator.py
        ├── pincodes.csv
        └── requirements.txt
```

**catalyst.json:**
```json
{
  "project": { "name": "CoreDev", "id": "43182000000012177" },
  "functions": { "shipping-rate-calculator": "functions/shipping-rate-calculator" }
}
```

**catalyst-function.json:**
```json
{
  "name": "shipping-rate-calculator",
  "runtime": "python310",
  "handler": "main.handler"
}
```

---

## 11. Slate UI Frontend Deployment (React + Vite)

When deploying the client-side (`dist/` folder) of a Catalyst project using the Slate Auto-Deployer via GitHub, you must bypass Linux CI environment caching and permission locks. 

### Required Slate Settings
1. **Framework:** `React + Vite`
2. **Node Runtime:** `Node 20`
3. **Build Path:** `dist`

### Critical Execution Commands
To ensure Vite compiles correctly inside Slate's strict container without throwing `sh: 1: vite: Permission denied` or `ERR_MODULE_NOT_FOUND`:

- **Install Command:** `npm ci`
  *Do not use `npm install`. The `npm ci` command forces the server to wipe any corrupt module caches and install deterministically from `package-lock.json`, restoring execute permissions.*
- **Build Command:** `npm run build`
  *(Your `package.json` must have `"build": "vite build"`)*
