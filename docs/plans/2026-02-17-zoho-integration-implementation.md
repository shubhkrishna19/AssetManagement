# React App Zoho Creator Integration Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Deploy React Asset Management app to Zoho Catalyst with Creator embedding and data viewer.

**Architecture:** React app on Catalyst Slate (static hosting), embedded in Creator via iframe, data in Catalyst Datastore, Creator provides auth + data viewer admin panel.

**Tech Stack:** Zoho Catalyst (Slate + Datastore), Zoho Creator, React + Vite, Express (Catalyst functions)

---

## Implementation Tasks

### Task 1: Verify Catalyst API Endpoints

**Files:**
- Modify: `functions/bridgex/index.js`
- Test: Use Postman or curl to test endpoints

**Step 1: Review existing API endpoints**

Read `functions/bridgex/index.js` and identify existing endpoints:
- GET endpoint for fetching records
- POST endpoint for creating records
- PUT endpoint for updating records
- DELETE endpoint for deleting records

**Step 2: Add CORS headers for Creator domain**

In `functions/bridgex/index.js`, add Creator domain to CORS:
```javascript
// Around line 10-12, modify:
res.set('Access-Control-Allow-Origin', '*');
// Change to:
const creatorDomains = ['https://yourapp.creator.zoho.com', 'https://creator.zoho.com'];
res.set('Access-Control-Allow-Origin', creatorDomains.includes(req.headers.origin) ? req.headers.origin : '*');
```

**Step 3: Add auth verification endpoint**

Add new endpoint after existing routes:
```javascript
// Add around line 200 (before final res)
if (action === 'verify_user') {
    const { user_id } = data;
    const zcql = catalystApp.zcql();
    const users = await zcql.executeZCQLQuery(`SELECT * FROM Users WHERE User_ID = '${user_id}'`);
    res.status(200).json({
        status: "success",
        user: users[0] || null
    });
    return;
}
```

**Step 4: Test all endpoints**

```bash
# Test GET (fetch assets)
curl -X POST https://yourprojectname.catalystfunctions.com/bridgex/ \
  -H "Content-Type: application/json" \
  -d '{"action": "fetch_all", "table_name": "Assets"}'

# Test auth verify
curl -X POST https://yourprojectname.catalystfunctions.com/bridgex/ \
  -H "Content-Type: application/json" \
  -d '{"action": "verify_user", "data": {"user_id": "123"}}'
```

Expected: JSON responses with status and data

**Step 5: Commit**

```bash
git add functions/bridgex/index.js
git commit -m "feat: add CORS for Creator and verify_user endpoint"
```

---

### Task 2: Update React App Configuration

**Files:**
- Modify: `src/config.js`
- Modify: `src/context/UserContext.jsx`
- Test: Run dev server, check console for errors

**Step 1: Update config.js for Creator embedding**

Modify `src/config.js`:
```javascript
const CONFIG = {
    IS_DEMO_MODE: false,
    BRAND_NAME: 'Bluewud Asset Ledger Pro',
    VERSION: '5.5.0',
    LAUNCH_DATE: '2025-12-21',

    // API ENDPOINTS
    API: {
        // Check for Creator URL params first, fallback to Catalyst
        BASE_URL: window.location.href.includes('creator.zoho.com')
            ? '/your-creator-app/api'  // Creator API path
            : '/server/bridgex',        // Catalyst API Gateway route
        RETRY_ATTEMPTS: 3,
        TIMEOUT: 5000,
    },

    // FEATURE FLAGS (keep existing)
    FEATURES: {
        MAINTENANCE: true,
        AUDIT_MODE: true,
        ACTIVITY_LOG: true,
        CHECK_IN_OUT: true,
        ANALYTICS: true,
    }
};
```

**Step 2: Update UserContext to handle Creator auth**

Read `src/context/UserContext.jsx` first, then modify to parse URL params:

```javascript
// Add in useEffect or initialization
useEffect(() => {
    // Check for Creator URL params
    const params = new URLSearchParams(window.location.search);
    const creatorUserId = params.get('zuid');
    const creatorRole = params.get('role');

    if (creatorUserId) {
        // Set user from Creator
        setUser({
            id: creatorUserId,
            role: creatorRole || 'employee',
            isCreatorSession: true
        });
    }
}, []);
```

**Step 3: Test local development**

```bash
npm run dev
```

Expected: App loads without errors. Check browser console.

**Step 4: Commit**

```bash
git add src/config.js src/context/UserContext.jsx
git commit -m "feat: add Creator embedding support to config"
```

---

### Task 3: Set Up Zoho Creator App

**Files:**
- Create: Zoho Creator app (via Creator dashboard)
- No local files needed

**Step 1: Create Creator app**

1. Go to https://creator.zoho.com
2. Click "Create App" → "Blank App"
3. Name: "Asset Management Portal"
4. Save

**Step 2: Configure Zoho SSO**

1. In Creator app, go to Settings → Authentication
2. Enable "Zoho SSO"
3. Configure allowed domains (your company domain)

**Step 3: Add users with roles**

1. Go to Users section in Creator
2. Add employees with roles:
   - Admin (full access)
   - Employee (limited access)
3. Set up departments if needed

**Step 4: Note app URL**

Save the Creator app URL for next step:
- Format: `https://creator.zoho.com/your-org/asset-management-portal`

---

### Task 4: Embed React App in Creator

**Files:**
- Modify: Creator app (via Creator dashboard)
- No local files

**Step 1: Create embed page in Creator**

1. In Creator app, create new page: "Asset App"
2. Add "Embed" component
3. Configure iframe:

```
URL: https://yourapp.onslate.com
Width: 100%
Height: 600px (or adjust)
```

**Step 2: Pass user info via URL**

When configuring the embed, add URL parameters:
```
https://yourapp.onslate.com?zuid={{user.id}}&role={{user.role}}
```

This passes Creator user ID and role to React app.

**Step 3: Test embedding**

1. Open Creator app as employee
2. Navigate to Asset App page
3. Verify React app loads in iframe

---

### Task 5: Create Data Viewer in Creator

**Files:**
- Modify: Creator app (via Creator dashboard)
- No local files

**Step 1: Create Data Viewer page**

1. In Creator app, create new page: "Database Viewer"
2. Add "Table" component

**Step 2: Connect to Catalyst API**

Use Creator's "Function" to fetch data from Catalyst:

```deluge
// Create a Deluge function in Creator
fetch_assets = function() {
    response = invokeurl [
        url: "https://yourproject.catalystfunctions.com/bridgex/"
        type: POST
        parameters: {
            "action": "fetch_all",
            "table_name": "Assets"
        }
    ];
    return response;
}
```

**Step 3: Display data in table**

1. Bind the function to Table component
2. Configure columns to display
3. Enable sorting and filtering

**Step 4: Add edit capability**

1. Add "Edit" button to each row
2. On click, show form with fields
3. On save, call update API:

```deluge
update_asset = function(asset_id, updates) {
    response = invokeurl [
        url: "https://yourproject.catalystfunctions.com/bridgex/"
        type: POST
        parameters: {
            "action": "update",
            "asset_id": asset_id,
            "updates": updates
        }
    ];
    return response;
}
```

**Step 5: Test data viewer**

1. View assets in table
2. Try searching/filtering
3. Try editing a record
4. Verify changes appear in React app

---

### Task 6: Configure Access Control

**Files:**
- Modify: Creator app settings
- Test: Login as different users

**Step 1: Set page permissions**

In Creator:
1. Go to Settings → Roles & Permissions
2. Configure who can access each page:
   - Database Viewer → Admin only
   - Asset App → All users

**Step 2: Enable login tracking**

Creator automatically logs:
- Login time
- IP address
- Pages accessed

View logs in: Settings → Audit Logs

**Step 3: Test with different users**

1. Login as Admin
2. Verify all features work
3. Login as Employee
4. Verify limited access

---

### Task 7: Final Testing & Deployment

**Files:**
- Test all integration points
- No code changes

**Step 1: Test complete flow**

1. Employee logs in via Creator
2. Opens Asset App page
3. React app loads with user info
4. Can view/create/edit assets
5. Changes reflect in Database Viewer

**Step 2: Test data viewer**

1. Admin opens Database Viewer
2. Views all assets
3. Edits a field
4. Verifies change in React app

**Step 3: Deploy to production**

1. Ensure Catalyst app is in production mode
2. Ensure Creator app is published
3. Share Creator URL with employees

**Step 4: Commit final changes**

```bash
git add -A
git commit -m "feat: complete Zoho Creator integration"
git push origin main
```

---

## Summary

| Task | Description | Files Modified | Status |
|------|-------------|----------------|--------|
| 1 | Verify Catalyst API + CORS + Auth | functions/bridgex/index.js | ✅ DONE |
| 2 | Update React config for Creator | src/config.js, src/context/UserContext.jsx | ✅ DONE |
| 3 | Set up Creator app | None (dashboard) | PENDING |
| 4 | Embed React in Creator | None (dashboard) | PENDING |
| 5 | Create Data Viewer in CRM | Custom modules | PENDING |
| 6 | Configure access control | None (dashboard) | PENDING |
| 7 | Final testing | None | PENDING |

---

## Verification Commands

```bash
# Test Catalyst API
curl -X POST https://yourproject.catalystfunctions.com/bridgex/ \
  -H "Content-Type: application/json" \
  -d '{"action": "fetch_all", "table_name": "Assets"}'

# Build React app
npm run build

# Check for errors
npm run lint
```

---

**Plan Version:** 1.0
**Created:** 2026-02-17
**Estimated Time:** 2-4 hours (depending on Creator dashboard familiarity)
