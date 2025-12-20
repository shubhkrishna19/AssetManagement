import React, { useState, useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { mockAssets } from './mockData';
import Analytics from './components/Analytics';
import Reports from './components/Reports';
import ThemeToggle from './components/ThemeToggle';
import Maintenance from './components/Maintenance';
import ActivityLog from './components/ActivityLog';
import Profile from './components/Profile';
import CONFIG from './config';
import AuditTool from './components/AuditTool';
import CheckoutPortal from './components/CheckoutPortal';

// ASSET LEDGER PRO - v5.5 (PRODUCTION READY)
// Features: Analytics, Reports, Maintenance, Activity Logs, Physical Audits, Check-In/Out System

const App = () => {
  const [activeTab, setActiveTab] = useState('Inventory');
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(!CONFIG.IS_DEMO_MODE);
  const [error, setError] = useState(null);
  const [dataSource, setDataSource] = useState(CONFIG.IS_DEMO_MODE ? 'demo' : 'connecting');
  const [searchTerm, setSearchTerm] = useState('');

  // --- 🛰 THE UNIVERSAL SYNC ENGINE (v5.5 - CONFIG DRIVEN) ---
  useEffect(() => {
    if (CONFIG.IS_DEMO_MODE) {
      console.log("🛠 CONFIG: DEMO MODE ACTIVE. Bypassing bridge.");
      setAssets(mockAssets);
      setLoading(false);
      return;
    }

    const fetchAssets = async () => {
      const endpoints = [
        // 1. Local Vite Proxy (bypasses CORS in development)
        '/api/bridgex',
        // 2. Absolute Development (Custom Route)
        'https://websitewireframeproject-895469053.development.catalystserverless.com/server/bridgex',
        // 3. Relative (Native Production)
        '/server/bridgex',
        // 4. Absolute Production
        'https://websitewireframeproject-895469053.catalystserverless.com/server/bridgex'
      ];

      for (const url of endpoints) {
        try {
          console.log(`🛰 PROBING: ${url}`);
          const res = await fetch(url, {
            method: 'GET',
            mode: 'cors',
            headers: { 'Accept': 'application/json' }
          });

          const text = await res.text();
          let data;
          try {
            data = JSON.parse(text);
          } catch (e) {
            console.warn(`🛰 NON-JSON RESPONSE from ${url}:`, text.substring(0, 50));
            continue;
          }

          if (data.status === "success") {
            setAssets(data.records || []);
            setLoading(false);
            setError(null);
            setDataSource('live');
            console.log("🛰 LIVE SYNC ESTABLISHED via:", url);
            return;
          }
        } catch (e) {
          console.warn(`🛰 ROUTE BLOCKED: ${url}`, e.message);
        }
      }

      // If no live data could be fetched and not in demo mode, set error
      setLoading(false);
      setError("Failed to connect to live data. Please check your network or server configuration.");
      setDataSource('connecting'); // Or 'error'
    };

    fetchAssets();
  }, [activeTab]);

  return (
    <div style={styles.appContainer}>
      <aside style={styles.sidebar}>
        <div style={styles.sidebarHeader}>
          <div style={styles.logoCircle}>BW</div>
          <h1 style={styles.logoText}>Bluewud</h1>
        </div>
        <div style={styles.navGroup}>
          <NavItem id="Inventory" icon="📦" label="Inventory" active={activeTab === 'Inventory'} onClick={() => setActiveTab('Inventory')} />
          <NavItem id="Analytics" icon="📊" label="Analytics" active={activeTab === 'Analytics'} onClick={() => setActiveTab('Analytics')} />
          <NavItem id="Reports" icon="📋" label="Reports" active={activeTab === 'Reports'} onClick={() => setActiveTab('Reports')} />
          <NavItem id="Maintenance" icon="🔧" label="Maintenance" active={activeTab === 'Maintenance'} onClick={() => setActiveTab('Maintenance')} />
          <NavItem id="Activity" icon="📜" label="Activity Log" active={activeTab === 'Activity'} onClick={() => setActiveTab('Activity')} />
          <NavItem id="Audit" icon="🛡️" label="Physical Audit" active={activeTab === 'Audit'} onClick={() => setActiveTab('Audit')} />
          <NavItem id="Checkout" icon="🔄" label="Check-In/Out" active={activeTab === 'Checkout'} onClick={() => setActiveTab('Checkout')} />
          <NavItem id="Scan" icon="📷" label="Quick Scan" active={activeTab === 'Scan'} onClick={() => setActiveTab('Scan')} />
        </div>
        <div style={styles.sidebarFooter}>
          <div style={styles.connectionStatus}>
            <div style={{
              ...styles.pulseDot,
              background: dataSource === 'live' ? '#00b894' : dataSource === 'demo' ? '#fdcb6e' : '#74b9ff',
              boxShadow: dataSource === 'live' ? '0 0 8px #00b894' : dataSource === 'demo' ? '0 0 8px #fdcb6e' : '0 0 8px #74b9ff'
            }} />
            <span>
              {dataSource === 'live' ? "LIVE SYNC: ACTIVE" :
                dataSource === 'demo' ? "🎭 DEMO MODE" :
                  "CONNECTING..."}
            </span>
          </div>
        </div>
      </aside>

      <main style={styles.mainArea}>
        {/* Demo Mode Banner */}
        {dataSource === 'demo' && (
          <div style={styles.demoBanner}>
            🎭 <strong>Demo Mode Active</strong> — Showing sample data. Deploy the Catalyst bridge to enable live sync.
          </div>
        )}

        <header style={styles.contentHeader}>
          <div style={styles.headerLeft}>
            <h2 style={styles.tabTitle}>{activeTab}</h2>
            {activeTab === 'Inventory' && (
              <div style={styles.searchWrapper}>
                <span style={styles.searchIcon}>🔍</span>
                <input
                  type="text"
                  placeholder="Search assets..."
                  style={styles.headerSearch}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            )}
          </div>
          <div style={styles.headerActions}>
            <div style={styles.syncPulse}>
              {loading ? "Syncing..." :
                dataSource === 'live' ? "🟢 Live Data" :
                  "📋 Sample Data"}
            </div>
            <ThemeToggle />
            <div style={styles.avatar} onClick={() => setActiveTab('Profile')}>SK</div>
          </div>
        </header>

        <section style={styles.pageContent}>
          {loading ? (
            <div style={styles.skeletonGrid}>
              {[1, 2, 3, 4, 5, 6].map(i => <div key={i} style={styles.skeletonCard} />)}
            </div>
          ) : error ? (
            <div style={styles.errorState}>
              <p>⚠️ {error}</p>
              <button onClick={() => window.location.reload()} style={styles.retryButton}>Reload Dashboard</button>
            </div>
          ) : activeTab === 'Scan' ? (
            <div style={styles.scannerWrapper}>
              <div style={styles.scannerHeader}>
                <h3>Native Asset Scanner</h3>
                <p>Point camera at an Asset Tag QR code</p>
              </div>
              <QRScanner onScan={(data) => {
                alert(`Asset Identified: ${data}\nSyncing with Creator...`);
                setActiveTab('Inventory'); // Redirect to inventory after scan
              }} />
            </div>
          ) : activeTab === 'Analytics' ? (
            <Analytics />
          ) : activeTab === 'Reports' ? (
            <Reports />
          ) : activeTab === 'Maintenance' ? (
            <Maintenance />
          ) : activeTab === 'Activity' ? (
            <ActivityLog />
          ) : activeTab === 'Audit' ? (
            <AuditTool />
          ) : activeTab === 'Checkout' ? (
            <CheckoutPortal />
          ) : activeTab === 'Profile' ? (
            <Profile />
          ) : (
            <AssetGrid assets={assets.filter(a =>
              a.Item_Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              a.Asset_ID.toLowerCase().includes(searchTerm.toLowerCase())
            )} />
          )}
        </section>
      </main>
    </div>
  );
};

// --- SUB-COMPONENTS ---

const QRScanner = ({ onScan }) => {
  useEffect(() => {
    const scanner = new Html5QrcodeScanner("reader", {
      fps: 10,
      qrbox: { width: 250, height: 250 },
      aspectRatio: 1.0
    });

    scanner.render((result) => {
      onScan(result);
      scanner.clear(); // Stop after success
    }, (error) => {
      // Quietly handle errors
    });

    return () => scanner.clear();
  }, [onScan]);

  return <div id="reader" style={styles.scannerBody}></div>;
};

const AssetGrid = ({ assets }) => (
  <div style={styles.assetGrid}>
    {assets.map(asset => (
      <div key={asset.ID} style={styles.assetCard}>
        <div style={styles.cardTop}>
          <span style={styles.assetId}>{asset.Asset_ID || "NEW-ASSET"}</span>
          <span style={styles.statusBadge}>{asset.Status || "Available"}</span>
        </div>
        <h4 style={styles.assetName}>{asset.Item_Name}</h4>
        <p style={styles.assetCategory}>{asset.Category}</p>
        <div style={styles.cardFooter}>
          <span style={styles.assignedUser}>{asset.Assigned_User?.display_value || "In Inventory"}</span>
          <div style={styles.healthDot} title="Healthy" />
        </div>
      </div>
    ))}
  </div>
);

const NavItem = ({ icon, label, active, onClick }) => (
  <div onClick={onClick} style={{
    ...styles.navItem,
    backgroundColor: active ? 'var(--accentLight)' : 'transparent',
    color: active ? 'var(--accent)' : 'var(--textSecondary)'
  }}>
    <span style={styles.navIcon}>{icon}</span>
    <span style={styles.navLabel}>{label}</span>
  </div>
);

// --- STYLING ---

const styles = {
  appContainer: { display: 'flex', height: '100vh', width: '100vw', background: 'var(--background)', fontFamily: 'Inter, sans-serif' },
  sidebar: { width: '260px', background: 'var(--surface)', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column' },
  sidebarHeader: { padding: '40px 25px', display: 'flex', alignItems: 'center' },
  logoCircle: { width: '40px', height: '40px', background: 'var(--accent)', borderRadius: '12px', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900' },
  logoText: { marginLeft: '12px', fontSize: '20px', fontWeight: '900', color: 'var(--text)' },
  navGroup: { flex: 1 },
  navItem: { display: 'flex', alignItems: 'center', padding: '16px 25px', cursor: 'pointer', transition: '0.2s' },
  navIcon: { marginRight: '15px' },
  navLabel: { fontWeight: '600', fontSize: '15px' },
  sidebarFooter: { padding: '25px', borderTop: '1px solid var(--border)' },
  connectionStatus: { display: 'flex', alignItems: 'center', fontSize: '10px', fontWeight: '800', color: 'var(--textSecondary)' },
  pulseDot: { width: '8px', height: '8px', borderRadius: '50%', marginRight: '10px' },
  mainArea: { flex: 1, overflowY: 'auto' },
  contentHeader: { height: '80px', background: 'var(--surface)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 40px', borderBottom: '1px solid var(--border)' },
  tabTitle: { fontSize: '24px', fontWeight: '900', color: 'var(--text)' },
  headerLeft: { display: 'flex', alignItems: 'center', gap: '30px' },
  searchWrapper: { position: 'relative', display: 'flex', alignItems: 'center' },
  searchIcon: { position: 'absolute', left: '12px', color: 'var(--textSecondary)', fontSize: '14px' },
  headerSearch: {
    padding: '10px 15px 10px 35px',
    borderRadius: '12px',
    border: '1px solid var(--border)',
    background: 'var(--background)',
    color: 'var(--text)',
    width: '300px',
    outline: 'none',
    fontSize: '14px'
  },
  headerActions: { display: 'flex', alignItems: 'center', gap: '20px' },
  syncPulse: { fontSize: '12px', color: 'var(--textSecondary)', fontWeight: '600' },
  avatar: { width: '36px', height: '36px', background: 'var(--text)', borderRadius: '50%', color: 'var(--background)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' },
  pageContent: { padding: '40px' },
  assetGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' },
  assetCard: { background: 'var(--surface)', padding: '24px', borderRadius: '20px', boxShadow: 'var(--shadow)', border: '1px solid var(--border)' },
  cardTop: { display: 'flex', justifyContent: 'space-between' },
  assetId: { fontSize: '10px', fontWeight: '800', color: 'var(--textSecondary)' },
  statusBadge: { fontSize: '9px', fontWeight: '900', color: 'var(--accent)', background: 'var(--accentLight)', padding: '2px 8px', borderRadius: '10px' },
  assetName: { fontSize: '18px', fontWeight: '800', margin: '12px 0 4px 0', color: 'var(--text)' },
  assetCategory: { fontSize: '13px', color: 'var(--textSecondary)', marginBottom: '20px' },
  cardFooter: { borderTop: '1px solid var(--border)', paddingTop: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  assignedUser: { fontSize: '12px', fontWeight: '700', color: 'var(--text)' },
  healthDot: { width: '10px', height: '10px', background: '#00B894', borderRadius: '50%' },
  skeletonGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' },
  loaderCard: { height: '200px', background: 'var(--border)', borderRadius: '20px', opacity: '0.6' },
  errorState: { textAlign: 'center', padding: '100px', color: 'var(--danger)', fontWeight: 'bold' },
  scannerWrapper: { background: 'var(--surface)', padding: '40px', borderRadius: '30px', boxShadow: 'var(--shadow)', textAlign: 'center', maxWidth: '600px', margin: '0 auto', border: '1px solid var(--border)' },
  scannerHeader: { marginBottom: '30px', color: 'var(--text)' },
  scannerBody: { width: '100%', borderRadius: '20px', overflow: 'hidden', border: 'none' },
  demoBanner: { background: 'linear-gradient(135deg, #fdcb6e, #f39c12)', color: '#2d3436', padding: '12px 40px', fontSize: '13px', fontWeight: '600', textAlign: 'center' },
  skeletonCard: { height: '180px', background: 'var(--border)', borderRadius: '20px' }
};

export default App;
