# Zoho Integration - Catalyst + Creator Deployment

> **For Claude:** This design document covers deploying the Asset Management app via Zoho Catalyst with Creator for employee access and data viewing.

**Goal:** Deploy React Asset Management app to Zoho Catalyst (existing) + embed in Creator for employee portal + add data viewer for seeing/editing stored data.

**Architecture:** React app stays on Catalyst Slate (static hosting), embedded in Creator via iframe, data stored in Catalyst Datastore, Creator provides auth + data viewer admin panel.

**Tech Stack:** Zoho Catalyst (Slate + Datastore), Zoho Creator, React + Vite, Express (Catalyst functions)

---

## Current State

- React app deployed on Catalyst Slate: `https://yourapp.onslate.com`
- Backend API via Catalyst function: `/functions/bridgex/`
- Data stored in Catalyst Datastore tables (Assets, etc.)
- Existing ZohoIntegration folder with CRM integration docs

---

## Target State

### Deployment Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     ZOHO ECOSYSTEM                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────────┐      ┌─────────────────────────────┐ │
│  │   CATALYST          │      │    ZOHO CREATOR             │ │
│  │                     │      │                              │ │
│  │  ┌───────────────┐  │      │  ┌─────────────────────┐   │ │
│  │  │ React App     │  │      │  │ Employee Portal     │   │ │
│  │  │ (Slate)       │  │      │  │ - Login via Zoho   │   │ │
│  │  │ yourapp.      │  │      │  │ - Access to iframe │   │ │
│  │  │ onslate.com   │  │      │  └─────────────────────┘   │ │
│  │  └───────────────┘  │      │              │            │ │
│  │         │           │      │  ┌─────────────┴────────┐  │ │
│  │  ┌───────────────┐  │      │  │ Data Viewer Form    │  │ │
│  │  │ Catalyst      │◄─┼──────┼──│ - View all records │  │ │
│  │  │ Datastore     │  │ API  │  │ - Quick edit      │  │ │
│  │  │ (Your Data)   │  │      │  │ - Search/Filter    │  │ │
│  │  └───────────────┘  │      │  └─────────────────────┘   │ │
│  │                     │      │                              │ │
│  │  ┌───────────────┐  │      │                              │ │
│  │  │ Catalyst     │  │      │                              │ │
│  │  │ Functions    │  │      │                              │ │
│  │  │ (bridgex)   │  │      │                              │ │
│  │  └───────────────┘  │      │                              │ │
│  └─────────────────────┘      └─────────────────────────────┘ │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Two Access Points

1. **Direct URL** (Existing): `https://yourapp.onslate.com`
   - For admins/developers
   - Full functionality

2. **Creator Portal** (New): Creator app URL
   - For employees
   - Embedded React app via iframe
   - Login via Zoho SSO

### Creator Data Viewer

A simple admin panel in Creator to see and edit Catalyst Datastore data:

- View all tables (Assets, Users, etc.)
- Search and filter records
- Edit fields inline
- Add new records manually
- Export to CSV

---

## Components

### 1. Catalyst Backend (Existing)

**Files:**
- `functions/bridgex/index.js` - Express API for CRUD operations

**Endpoints to verify/add:**
- `GET /` - Fetch all records from table
- `POST /` - Create new record
- `PUT /` - Update record
- `DELETE /` - Delete record

### 2. React Frontend (Existing)

**Files:**
- `src/App.jsx` - Main app
- `src/config.js` - API configuration

**Changes needed:**
- Update API endpoint to point to Creator-connected endpoint
- Add auth token handling for Creator iframe

### 3. Creator App (New)

**Components:**
- **Login/Auth** - Zoho SSO integration
- **User Management** - Control access to app
- **React Embed** - iframe widget loading React app
- **Data Viewer** - Form to view/edit Catalyst data

---

## Data Flow

### Employee Login Flow

```
1. Employee opens Creator app URL
2. Zoho SSO login page appears
3. Employee enters Zoho credentials
4. Login success → Creator dashboard loads
5. Employee clicks "Open Asset App"
6. iframe loads React app from Catalyst Slate
7. User info passed via URL parameters
8. React app operates normally
```

### Data Viewer Flow

```
1. Admin opens Creator app
2. Goes to "Database Viewer" section
3. Selects table (e.g., Assets)
4. Records load from Catalyst Datastore
5. Admin can:
   - Search/filter records
   - Click row to edit
   - Add new record
   - Delete record
6. Changes saved to Catalyst Datastore via API
```

---

## Implementation Overview

### Phase 1: Prepare Catalyst Backend
- Verify existing API endpoints
- Add CORS for Creator domain
- Add authentication endpoint

### Phase 2: Prepare React App
- Update config to use proper API URL
- Handle Creator URL parameters for auth

### Phase 3: Set Up Creator App
- Create Creator app
- Configure Zoho SSO
- Add user roles

### Phase 4: Embed React in Creator
- Add iframe widget
- Configure to load Catalyst app
- Pass user info via URL

### Phase 5: Create Data Viewer
- Create form with data connection to Catalyst
- Configure table view
- Add edit capabilities

### Phase 6: Testing & Deployment
- Test login flow
- Test data viewer
- Deploy to production

---

## Files Reference

### Catalyst Functions
- `functions/bridgex/index.js` - Main API handler

### React App
- `src/config.js` - API configuration
- `src/context/UserContext.jsx` - User state

### ZohoIntegration (existing docs)
- `ZohoIntegration/knowledge_base/` - CRM/Catalyst docs
- `ZohoIntegration/services/ZohoAPI.js` - Existing service patterns

---

## External Resources

- Zoho Catalyst Docs: https://www.zoho.com/catalyst/docs/
- Zoho Creator Docs: https://www.zoho.com/creator/help/
- Catalyst Datastore: https://www.zoho.com/catalyst/docs/datastore/
- Creator Forms: https://www.zoho.com/creator/help/forms/

---

**Design Version:** 1.0
**Created:** 2026-02-17
**Status:** Ready for Implementation
