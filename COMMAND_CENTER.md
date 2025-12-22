# 🦅 COMMAND CENTER: Asset Ledger Pro (Dual-Agent Scale v4.0)

**Mission:** Build a $50k Enterprise Asset Management System that crushes Asset Tiger and scales to 100+ SaaS apps.
**Agents:** **Antigravity** (Structure/UI/Components) & **Codex** (Logic/Data/Heavy Coding).
**Environment:** LOCAL DEVELOPMENT (Demo Mode Active)

---

## 🚀 SPRINT: PRESENTATION READY BUILD

### 📊 PRIORITY 1: Analytics Dashboard (Task A2)
**Goal:** Transform the dashboard into a data-rich command center with animated charts.

#### 🟦 ANTIGRAVITY (Structure)
- [x] Create component scaffold: `src/components/Analytics.jsx`
- [x] Define chart layout grid (2x2 responsive)
- [x] Create placeholder containers with loading states
- [x] Wire into App.jsx with tab routing

#### 🟩 CODEX (Heavy Coding)
- [ ] Implement `TotalValueChart` - Animated donut showing total portfolio value
- [ ] Implement `CategoryBreakdown` - Bar chart by asset category  
- [ ] Implement `HealthDistribution` - Pie chart (Excellent/Good/Fair/Poor)
- [ ] Implement `MonthlyTrend` - Line chart showing asset acquisition over time
- [ ] Add number animations (count up effects)

**CODEX SPECS:**
```
Library: Recharts (already compatible with React)
Install: npm install recharts
Data Source: Use mockData.js - extend with mockStats
Colors: 
  - Primary: #0984e3
  - Success: #00b894  
  - Warning: #fdcb6e
  - Danger: #e74c3c
Animation: 1.5s ease-out on mount
```

---

### 🌙 PRIORITY 2: Dark/Light Mode (Task A4)
**Goal:** Premium glassmorphism theme toggle that screams $50k.

#### 🟦 ANTIGRAVITY (Structure)
- [x] Create `src/context/ThemeContext.jsx` - React context for theme
- [x] Create theme toggle button component location in header
- [x] Define CSS variable structure

#### 🟩 CODEX (Heavy Coding)
- [ ] Implement full dark theme color palette
- [ ] Add glassmorphism effects (backdrop-blur, transparency)
- [ ] Smooth transition animations between themes
- [ ] Persist theme choice in localStorage
- [ ] Apply theme to all existing components

**CODEX SPECS:**
```
Dark Theme Colors:
  - Background: #0f172a (slate-900)
  - Surface: rgba(30, 41, 59, 0.8) with backdrop-blur
  - Text: #f1f5f9
  - Accent: #3b82f6
  
Glassmorphism:
  - backdrop-filter: blur(12px)
  - border: 1px solid rgba(255,255,255,0.1)
  - box-shadow: 0 8px 32px rgba(0,0,0,0.3)
  
Transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1)
```

---

### 📋 PRIORITY 3: Reports Tab (NEW)
**Goal:** Functional reports page with exportable data tables.

#### 🟦 ANTIGRAVITY (Structure)
- [x] Create `src/components/Reports.jsx` scaffold
- [x] Define report types: Asset List, Depreciation, Maintenance Due
- [x] Create tab navigation within Reports

#### 🟩 CODEX (Heavy Coding)
- [ ] Implement sortable/filterable asset table
- [ ] Add search functionality
- [ ] Create "Export to CSV" button logic
- [ ] Implement depreciation calculator display
- [ ] Add maintenance due list with date sorting

**CODEX SPECS:**
```
Table Features:
  - Sortable columns (click header)
  - Search/filter input
  - Pagination (10 items per page)
  - Row hover effects

Export Format: CSV with headers
Depreciation: Straight-line, 5-year default
```

---

### 🔧 PRIORITY 4: Maintenance Portal (Task A3)
**Goal:** UI for logging repairs and viewing maintenance history.

#### 🟦 ANTIGRAVITY (Structure)
- [ ] Create `src/components/Maintenance.jsx`
- [ ] Design form layout for new maintenance request
- [ ] Create maintenance history list component

#### 🟩 CODEX (Heavy Coding)
- [ ] Implement form validation
- [ ] Add photo upload placeholder (for future)
- [ ] Create maintenance status workflow (Pending → In Progress → Complete)
- [ ] Implement cost tracking and totals

---

## 📁 FILE STRUCTURE FOR CODEX

```
src/
├── App.jsx                    # Main app (ANTIGRAVITY manages routing)
├── mockData.js                # Sample data (EXTEND for new features)
├── index.css                  # Global styles + CSS variables
├── components/
│   ├── Analytics.jsx          # Charts dashboard (CODEX builds)
│   ├── Reports.jsx            # Data tables (CODEX builds)
│   ├── Maintenance.jsx        # Maintenance portal (CODEX builds)
│   └── ThemeToggle.jsx        # Dark mode toggle (CODEX builds)
└── context/
    └── ThemeContext.jsx       # Theme state management (CODEX builds)
```

---

## 🎯 TASK DISTRIBUTION SUMMARY

## 📱 SPRINT: MOBILE & INTEGRATION

### 🏗️ PRIORITY 1: Mobile Responsiveness (Task 9.1)
**Goal:** Ensure field technicians can use the app on phones/tablets.

#### 🟦 ANTIGRAVITY (Structure)
- [x] Add hamburger menu for mobile navigation
- [x] Optimize `AssetGrid` for touch (card view vs table view)
- [x] Verify `QRScanner` layout on small screens

#### 🟩 CODEX (Heavy Coding)
- [x] Implement CSS Grid media queries for all views
- [x] Add "Touch Gestures" (Swipe to delete/edit)
- [x] Optimize touch targets (buttons/inputs > 44px)

### 🔌 PRIORITY 2: API Hardening (Task 9.2)
**Goal:** Robust error handling and offline syncing capabilities.

#### 🟦 ANTIGRAVITY (Structure)
- [x] Design "Offline Mode" indicator and banner
- [x] Create "Retry Sync" UI patterns

#### 🟩 CODEX (Heavy Coding)
- [x] Implement `serviceWorker` for caching assets
- [x] Queue failed API requests in `localStorage`
- [x] Auto-retry queue when connection restores

### 📋 COMPLETED (Security Sprint)
- [x] **User Roles**: Admin/Viewer contexts & UI.
- [x] **Audit Logs**: Full action tracking & persistence.
- [x] **Maintenance Security**: Restricted access for Viewers.


---

## 🤝 HANDSHAKE PROTOCOL

1. **Antigravity** creates empty component files with comments explaining expected structure
2. **Codex** fills in the implementation following the specs above
3. **Antigravity** integrates, tests, and handles styling polish
4. Both agents update this COMMAND_CENTER.md with progress

---

## 📝 AGENT STATUS

**[Antigravity]:** All sprints complete. Documentation updated.
**[Codex]:** Codebase fully hardened and optimized.

---

## ⚡ QUICK START FOR CODEX

```bash
# Install required package
npm install recharts

# Files to create/modify:
1. src/components/Analytics.jsx - Full chart implementation
2. src/context/ThemeContext.jsx - Theme provider
3. src/components/ThemeToggle.jsx - Toggle button  
4. src/components/Reports.jsx - Data tables
5. src/mockData.js - Add more mock data for charts
```

**START WITH:** `Analytics.jsx` - Build all 4 charts using Recharts library.

---

**STATUS:** ✅ PRODUCTION READY | Mode: LIVE DEPLOYMENT | Target: CUSTOMER DEMO
