# Development Environment Setup Guide

> **Asset Ledger Pro** - Cross-platform development setup for Windows/Mac

## Prerequisites

- **Node.js** v18+ ([Download](https://nodejs.org/))
- **Git** ([Download](https://git-scm.com/))
- **Zoho Catalyst CLI** (`npm install -g zcatalyst-cli`)
- **VS Code** or any code editor

---

## 🚀 Quick Start (5 minutes)

### Step 1: Clone Repository
```bash
git clone https://github.com/shubhkrishna19/AssetManagement.git
cd AssetManagement
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Run Local Development
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## 📦 Deployment Setup

### Zoho Catalyst Setup (One-time)

1. **Login to Catalyst CLI**:
   ```bash
   catalyst login
   ```
   Follow the browser prompt to authenticate with your Zoho account.

2. **Initialize Project** (if not already):
   ```bash
   catalyst init
   ```
   - Select your project: `WebsiteWireframeProject`
   - Environment: `Development`

3. **Deploy to Catalyst**:
   ```bash
   npm run build
   copy client-package.json dist/   # Windows
   cp client-package.json dist/     # Mac/Linux
   catalyst deploy
   ```

### GitHub Setup (One-time)

1. **Configure Git** (if new machine):
   ```bash
   git config --global user.name "Your Name"
   git config --global user.email "your.email@example.com"
   ```

2. **Authenticate with GitHub**:
   ```bash
   gh auth login   # GitHub CLI (recommended)
   # OR use SSH keys / Personal Access Token
   ```

3. **Push Changes**:
   ```bash
   git add -A
   git commit -m "Your commit message"
   git push origin main
   ```

---

## 🔄 Daily Development Workflow

```bash
# 1. Pull latest changes
git pull origin main

# 2. Start development server
npm run dev

# 3. Make changes, then build
npm run build

# 4. Deploy to Catalyst
catalyst deploy

# 5. Push to GitHub
git add -A
git commit -m "Description of changes"
git push origin main
```

---

## 📁 Project Structure

```
AssetManagement/
├── src/                    # React source code
│   ├── components/         # UI Components (30 files)
│   ├── context/            # React Contexts
│   ├── App.jsx             # Main application
│   └── mockData.js         # Demo data
├── functions/              # Catalyst serverless functions
│   └── bridgex/            # API bridge function
├── dist/                   # Build output (auto-generated)
├── public/                 # Static assets
├── catalyst.json           # Catalyst config
├── package.json            # NPM dependencies
└── vite.config.js          # Vite bundler config
```

---

## 🔑 Important Files

| File | Purpose |
|------|---------|
| `COMMAND_CENTER.md` | Development task tracker |
| `FEATURES_ROADMAP.md` | Future features planned |
| `SETUP_GUIDE.md` | This file |
| `create_tables.sql` | Database schema reference |

---

## 🛠️ Troubleshooting

### Build Fails
```bash
rm -rf node_modules package-lock.json   # Mac/Linux
Remove-Item node_modules,package-lock.json -Recurse -Force  # Windows
npm install
npm run build
```

### Catalyst Deploy Fails
```bash
catalyst logout
catalyst login
catalyst deploy
```

### CORS Issues (Local Dev)
The `vite.config.js` has a proxy configured. Restart dev server after changes.

---

## 🌐 URLs

- **Catalyst Dev**: https://websitewireframeproject-895469053.development.catalystserverless.com/app/index.html
- **GitHub Repo**: https://github.com/shubhkrishna19/AssetManagement

---

*Last updated: December 30, 2024*
