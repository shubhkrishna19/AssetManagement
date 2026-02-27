# 🧠 Catalyst Deployment - Knowledge Transfer

**Project**: `bluewudcoredev` (Zoho Catalyst)
**Function Type**: Serverless (Node.js/Java/Python - check `catalyst.json` for specifics)

## � URGENT: Authentication (Immediate Token Exchange)
The user will provide a **Grant Token** (starts with `1000.`). This token is valid for **only a few minutes**.
**Step 1**: Use the command below IMMEDIATELY to exchange it for a Refresh Token.

### Token Exchange Command (CURL)
Run this command in your terminal **IMMEDIATELY** (this token expires in minutes!):

```bash
curl -X POST "https://accounts.zoho.com/oauth/v2/token" \
  -d "code=1000.e1fb6ccece8055611974804508b4c774.d9c5a71ab1982a5cf29560c4c4b521d9" \
  -d "client_id=1000.CGGK0M58LOXYJG9IR23UZ5G7XAZZBA" \
  -d "client_secret=f60455449d30984ca1c026a872a2395cb5100dba36" \
  -d "grant_type=authorization_code"
```

**Step 2**: Take the `refresh_token` from the JSON response and use it to configure the Catalyst CLI or your deployment script.

---

## 🔑 Permanent Credentials
- **Client ID**: `1000.CGGK0M58LOXYJG9IR23UZ5G7XAZZBA`
- **Client Secret**: `f60455449d30984ca1c026a872a2395cb5100dba36`
- **Scopes**:
  - `ZohoCatalyst.files.READ`
  - `ZohoCatalyst.files.CREATE`
  - `ZohoCatalyst.functions.READ`
  - `ZohoCatalyst.functions.CREATE`
  - `ZohoCatalyst.projects.READ`
  - `ZohoCatalyst.projects.CREATE`

---

## 1. Deployment Target
We are deploying specific functions to the `bluewudcoredev` project. Do NOT overwrite the entire project configuration.

### Deployment Command
Use the `--only` flag to target **functions** specifically. This prevents accidental overwrites of the hosting (frontend) or database schema.

```bash
# 1. Ensure you are in the project root (where catalyst.json is located)
# 2. Select the project context
catalyst project:use bluewudcoredev

# 3. Deploy the SPECIFIC function (e.g., 'bridgex' or your new function name)
catalyst deploy --project bluewudcoredev --only functions:YOUR_FUNCTION_NAME
```

---

## 2. Handling "Live Data on Localhost"
If you are testing this function from a local frontend (`localhost:5173`) via the Vite proxy:

1. **CORS Headers**: The function **MUST** return `Access-Control-Allow-Origin: *` (or the specific localhost origin) in its response headers. Without this, the browser will block the response.
2. **Options Method**: Ensure the function handles the `OPTIONS` HTTP method (preflight request).
   - If `req.method === 'OPTIONS'`, return functionality immediately with status 200 and the CORS headers.

**Example CORS Setup (Node.js):**
```javascript
module.exports = (req, res) => {
    // 1. Set CORS Headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // 2. Handle Preflight
    if (req.method === 'OPTIONS') {
        res.status(200).send();
        return;
    }

    // ... Your logic here ...
};
```

---

## 3. Common Troubleshooting
- **Target Mismatch**: If you see "Active project... does not match...", use `--project bluewudcoredev` explicitly in every command.
- **Token Expiry**: Use the Client ID/Secret above to refresh the token via the Zoho OAuth endpoint.
