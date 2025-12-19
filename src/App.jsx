import React, { useState, useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

// ASSET LEDGER PRO - v4.0 (LIVE SYNC EDITION)
// Feature: Real-time Data Streaming from Zoho Creator v2.1

const App = () => {
  const [activeTab, setActiveTab] = useState('Inventory');
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- 🛰 THE UNIVERSAL SYNC ENGINE (v4.8 - CORS KILLER) ---
  console.log("🚀 CORE v4.8 BOOTED: Starting Multi-Path Probe...");
  useEffect(() => {
    const fetchLiveData = async () => {
      const endpoints = [
        // 1. Absolute Development (The most likely live path right now)
        'https://websitewireframeproject-895469053.development.catalystserverless.com/server/Zoho_bridge/execute',
        // 2. Relative (Native Production)
        '/server/Zoho_bridge/execute',
        // 3. Absolute Production
        'https://websitewireframeproject-895469053.catalystserverless.com/server/Zoho_bridge/execute'
      ];

      for (const url of endpoints) {
        try {
          console.log(`🛰 PROBING: ${url}`);
          const res = await fetch(url, {
            method: 'GET',
            mode: 'cors'
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
            console.log("🛰 SYNC ESTABLISHED via:", url);
            return;
          }
        } catch (e) {
          console.warn(`🛰 ROUTE BLOCKED: ${url}`, e.message);
        }
      }

      setError("CORS Mismatch: App in Production, Brain in Development. Follow the 'God Mode' Bridge guide below.");
      setLoading(false);
    };

    fetchLiveData();
  }, [activeTab]);

  return (
    <div style={styles.appContainer}>
      <nav style={styles.sidebar}>
        <div style={styles.sidebarHeader}>
          <div style={styles.logoCircle}>LP</div>
          <span style={styles.logoText}>AssetPro v4.5</span>
        </div>
        <div style={styles.navGroup}>
          <NavItem id="Inventory" icon="📦" label="Inventory" active={activeTab === 'Inventory'} onClick={() => setActiveTab('Inventory')} />
          <NavItem id="Scan" icon="📷" label="Quick Scan" active={activeTab === 'Scan'} onClick={() => setActiveTab('Scan')} />
          <NavItem id="Reports" icon="📊" label="Reports" active={activeTab === 'Reports'} onClick={() => setActiveTab('Reports')} />
        </div>
        <div style={styles.sidebarFooter}>
          <div style={styles.connectionStatus}>
            <div style={{ ...styles.pulseDot, background: error ? '#ff7675' : '#00b894', boxShadow: error ? '0 0 8px #ff7675' : '0 0 8px #00b894' }} />
            <span>{error ? "RECONNECTING..." : "LIVE SYNC: ACTIVE"}</span>
          </div>
        </div>
      </nav>

      <main style={styles.mainArea}>
        <header style={styles.contentHeader}>
          <h2 style={styles.tabTitle}>{activeTab}</h2>
          <div style={styles.headerActions}>
            <div style={styles.syncPulse}>{loading ? "Syncing..." : "Last update: Just now"}</div>
            <div style={styles.avatar}>SK</div>
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
          ) : (
            <AssetGrid assets={assets} />
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
  <div onClick={onClick} style={{ ...styles.navItem, backgroundColor: active ? 'rgba(9, 132, 227, 0.1)' : 'transparent', color: active ? '#0984e3' : '#636e72' }}>
    <span style={styles.navIcon}>{icon}</span>
    <span style={styles.navLabel}>{label}</span>
  </div>
);

// --- STYLING ---

const styles = {
  appContainer: { display: 'flex', height: '100vh', width: '100vw', background: '#F8FAFC', fontFamily: 'Inter, sans-serif' },
  sidebar: { width: '260px', background: 'white', borderRight: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column' },
  sidebarHeader: { padding: '40px 25px', display: 'flex', alignItems: 'center' },
  logoCircle: { width: '40px', height: '40px', background: '#0984e3', borderRadius: '12px', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900' },
  logoText: { marginLeft: '12px', fontSize: '20px', fontWeight: '900', color: '#1E293B' },
  navGroup: { flex: 1 },
  navItem: { display: 'flex', alignItems: 'center', padding: '16px 25px', cursor: 'pointer', transition: '0.2s' },
  navIcon: { marginRight: '15px' },
  navLabel: { fontWeight: '600', fontSize: '15px' },
  sidebarFooter: { padding: '25px', borderTop: '1px solid #F1F5F9' },
  connectionStatus: { display: 'flex', alignItems: 'center', fontSize: '10px', fontWeight: '800', color: '#94A3B8' },
  pulseDot: { width: '8px', height: '8px', borderRadius: '50%', marginRight: '10px' },
  mainArea: { flex: 1, overflowY: 'auto' },
  contentHeader: { height: '80px', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 40px', borderBottom: '1px solid #F1F5F9' },
  tabTitle: { fontSize: '24px', fontWeight: '900' },
  headerActions: { display: 'flex', alignItems: 'center', gap: '20px' },
  syncPulse: { fontSize: '12px', color: '#94A3B8', fontWeight: '600' },
  avatar: { width: '36px', height: '36px', background: '#1E293B', borderRadius: '50%', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' },
  pageContent: { padding: '40px' },
  assetGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' },
  assetCard: { background: 'white', padding: '24px', borderRadius: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', border: '1px solid #F1F5F9' },
  cardTop: { display: 'flex', justifyContent: 'space-between' },
  assetId: { fontSize: '10px', fontWeight: '800', color: '#94A3B8' },
  statusBadge: { fontSize: '9px', fontWeight: '900', color: '#0984E3', background: 'rgba(9, 132, 227, 0.1)', padding: '2px 8px', borderRadius: '10px' },
  assetName: { fontSize: '18px', fontWeight: '800', margin: '12px 0 4px 0' },
  assetCategory: { fontSize: '13px', color: '#64748B', marginBottom: '20px' },
  cardFooter: { borderTop: '1px solid #F1F5F9', paddingTop: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  assignedUser: { fontSize: '12px', fontWeight: '700', color: '#1E293B' },
  healthDot: { width: '10px', height: '10px', background: '#00B894', borderRadius: '50%' },
  skeletonGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' },
  loaderCard: { height: '200px', background: '#E2E8F0', borderRadius: '20px', opacity: '0.6' },
  errorState: { textAlign: 'center', padding: '100px', color: '#E74C3C', fontWeight: 'bold' },
  scannerWrapper: { background: 'white', padding: '40px', borderRadius: '30px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', textAlign: 'center', maxWidth: '600px', margin: '0 auto' },
  scannerHeader: { marginBottom: '30px' },
  scannerBody: { width: '100%', borderRadius: '20px', overflow: 'hidden', border: 'none' }
};

export default App;
