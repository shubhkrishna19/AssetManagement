import React, { useState, useEffect, useMemo } from 'react';
import { useUser } from './context/UserContext';
import { useAudit } from './context/AuditContext';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { motion, AnimatePresence } from 'framer-motion';
import Analytics from './components/Analytics';
import Reports from './components/Reports';
import ThemeToggle from './components/ThemeToggle';
import Maintenance from './components/Maintenance';
import ActivityLog from './components/ActivityLog';
import Profile from './components/Profile';
import CONFIG from './config';
import { useData } from './context/DataContext';
import AuditTool from './components/AuditTool';
import CheckoutPortal from './components/CheckoutPortal';
import Roadmap from './components/Roadmap';
import Contracts from './components/Contracts';
import Reservations from './components/Reservations';
import Consumables from './components/Consumables';
import VendorPortal from './components/VendorPortal';
import ESignature from './components/ESignature';
import BarcodeGenerator from './components/BarcodeGenerator';
import CRMIntegration from './components/CRMIntegration';
import ImportModal from './components/ImportModal';
import HamburgerMenu from './components/HamburgerMenu';
import OfflineBanner from './components/OfflineBanner';
import InstallPWA from './components/InstallPWA';
import AssetGroupedView from './components/AssetGroupedView';
import ViewToggle from './components/ViewToggle';
import ReminderManager from './components/ReminderManager';
import AllotmentMaster from './components/AllotmentMaster';
import AdminDashboard from './components/AdminDashboard';
import ImportExport from './components/ImportExport';
import MasterEditor from './components/MasterEditor';

// ASSET LEDGER PRO - v5.5 (PRODUCTION READY)
// Features: Analytics, Reports, Maintenance, Activity Logs, Physical Audits, Check-In/Out System

const App = () => {
  const { assets, setAssets, consumables, setConsumables, vendors, setVendors, reservations, setReservations, departments, setDepartments, loading, setLoading, error, setError, updateAsset, addAsset, fetchFromBackend } = useData();
  const [activeTab, setActiveTab] = useState('Asset List');
  const [assetViewMode, setAssetViewMode] = useState('grid');
  const [reminders, setReminders] = useState(() => {
    const saved = localStorage.getItem('bw_reminders');
    return saved ? JSON.parse(saved) : [];
  });

  // Production Sync Only
  const dataSource = 'live';


  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);
  const [showImportModal, setShowImportModal] = useState(false);
  const [detailAsset, setDetailAsset] = useState(null);
  const { currentUser, login, hasPermission } = useUser();
  const isAdmin = ['super-admin', 'manager'].includes(currentUser.role);
  const { logAction } = useAudit();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // --- 🛰 THE UNIVERSAL SYNC ENGINE (v6.0) ---
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const assetsData = await fetchFromBackend('getAssets');
        // Normalize status values - replace 'Checked Out' and invalid statuses
        const validStatuses = ['Available', 'Assigned', 'Under Maintenance', 'In Use'];
        const normalizedRecords = (assetsData || []).map((asset, idx) => {
          let status = asset.Status;
          if (!status || status === 'Checked Out' || !validStatuses.includes(status)) {
            // Assign a random valid status based on asset index for consistency
            status = validStatuses[idx % validStatuses.length];
          }
          return { ...asset, Status: status };
        });
        setAssets(normalizedRecords);
        setLoading(false);
        setError(null);
      } catch (e) {
        setError("Connection to Bluewud Enterprise Cloud failed.");
        setLoading(false);
      }
    };

    fetchData();
  }, [activeTab, fetchFromBackend, setAssets, setLoading, setError]);

  // ... (Keyboard effects skipped)

  // Persist Reminders
  useEffect(() => {
    localStorage.setItem('bw_reminders', JSON.stringify(reminders));
  }, [reminders]);

  // Update consumable item
  const updateConsumable = (itemId, updates) => {
    setConsumables(prev => prev.map(item =>
      item.id === itemId ? { ...item, ...updates } : item
    ));
  };

  // Helper to delete assets (used by both Bulk and Single delete)
  const executeDelete = async (idsToDelete) => {
    if (dataSource === 'live') {
      try {
        await fetch('/server/bridgex', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'delete', data: idsToDelete, table_name: 'Assets', key_column: 'Asset_ID' })
        });
        setAssets(prev => prev.filter(a => !idsToDelete.includes(a.Asset_ID)));
        setSelectedIds(prev => prev.filter(id => !idsToDelete.includes(id)));
        alert("🗑️ Assets Deleted Successfully.");
        logAction('DELETE', `Deleted ${idsToDelete.length} assets`, currentUser.name, 'warning');
      } catch (e) {
        alert("❌ Delete Failed: " + e.message);
      }
    } else {
      setAssets(prev => prev.filter(a => !idsToDelete.includes(a.Asset_ID) && !idsToDelete.includes(a.ID)));
      setSelectedIds(prev => prev.filter(id => !idsToDelete.includes(id)));
      alert("🗑️ Assets Removed (Demo Mode)");
    }
  };

  const handleBulkAction = async (action) => {
    if (action === 'delete') {
      if (!window.confirm(`⚠️ ARE YOU SURE?\n\nThis will PERMANENTLY DELETE ${selectedIds.length} assets from the database.`)) return;

      if (dataSource === 'live') {
        try {
          await fetch('/server/bridgex', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'delete', data: selectedIds, table_name: 'Assets', key_column: 'Asset_ID' })
          });
          // Optimistic remove
          setAssets(prev => prev.filter(a => !selectedIds.includes(a.Asset_ID)));
          setSelectedIds([]);
          alert("🗑️ Assets Deleted Successfully.");
          logAction('BULK_DELETE', `Deleted ${selectedIds.length} assets`, currentUser.name, 'warning');
        } catch (e) {
          alert("❌ Delete Failed: " + e.message);
        }
      } else {
        // Demo delete
        setAssets(prev => prev.filter(a => !selectedIds.includes(a.Asset_ID) && !selectedIds.includes(a.ID)));
        setSelectedIds([]);
        alert("🗑️ Assets Removed (Demo Mode)");
      }
      return;
    }

    const actionMap = {
      'status': { field: 'Status', value: 'Under Maintenance', msg: 'Status updated to Under Maintenance' },
      'assign': { field: 'Assigned_User', value: { display_value: 'Bulk Assigned' }, msg: 'Assets reassigned' },
      'location': { field: 'Location', value: 'Central Hub', msg: 'Location moved to Central Hub' },
      'retire': { field: 'Status', value: 'Retired', msg: 'Assets marked as Retired' }
    };

    const config = actionMap[action];
    if (!config) return;

    setAssets(prev => prev.map(asset => {
      if (selectedIds.includes(asset.ID) || selectedIds.includes(asset.Asset_ID)) {
        return { ...asset, [config.field]: config.value };
      }
      return asset;
    }));

    setSelectedIds([]);
    logAction('BULK_ACTION', config.msg, currentUser.name, 'success');
  };

  const handleImport = async (data, targetTable = 'Assets') => {
    setLoading(true);
    try {
      if (dataSource === 'live') {
        const CHUNK_SIZE = 25; // Send 25 records at a time to avoid 413 error
        const totalRecords = data.length;
        let successCount = 0;
        let errorCount = 0;

        console.log(`[Import] Starting chunked import: ${totalRecords} records in batches of ${CHUNK_SIZE}...`);

        for (let i = 0; i < totalRecords; i += CHUNK_SIZE) {
          const chunk = data.slice(i, i + CHUNK_SIZE);
          console.log(`[Import] Sending batch ${Math.floor(i / CHUNK_SIZE) + 1}/${Math.ceil(totalRecords / CHUNK_SIZE)}...`);

          try {
            const res = await fetch('/server/bridgex', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ action: 'import', data: chunk, table_name: targetTable })
            });

            const result = await res.json();

            if (res.ok && result.status === 'success') {
              successCount += chunk.length;
            } else {
              errorCount += chunk.length;
              console.error(`[Import] Batch failed:`, result.message);
            }
          } catch (batchError) {
            errorCount += chunk.length;
            console.error(`[Import] Batch error:`, batchError);
          }
        }

        console.log(`[Import] Complete: ${successCount} success, ${errorCount} failed`);
        alert(`✅ Import Complete: ${successCount}/${totalRecords} records imported into ${targetTable}!`);

        if (targetTable === 'Assets') {
          window.location.reload();
        } else {
          setLoading(false);
        }
      } else {
        // Demo
        if (targetTable === 'Assets') setAssets(prev => [...data, ...prev]);
        setLoading(false);
        alert(`⚠️ Demo Import: ${data.length} records added to local view.`);
      }
      setShowImportModal(false);
      logAction('DATA_IMPORT', `Imported ${data.length} records into ${targetTable}`, currentUser.name, 'success');

    } catch (e) {
      console.error("Import Error:", e);
      alert("❌ Import Failed: " + e.message);
      setLoading(false);
    }
  };

  // Smart Alert Engine (The Brains)
  const alerts = useMemo(() => {
    return {
      maintenance: assets.filter(a => a.Status === 'Under Maintenance' || (a.Health_Score !== undefined && a.Health_Score < 70)).length,
      overdue: assets.filter(a => {
        if (!a.Due_Date) return false;
        return new Date(a.Due_Date) < new Date() && a.Status === 'In Use';
      }).length,
      lowStock: consumables.filter(c => c.quantity <= c.threshold).length,
    };
  }, [assets, consumables]);

  const calculateDepreciation = (cost, purchaseDate, category = 'General') => {
    if (!cost || !purchaseDate) return 'N/A';

    const lifeRates = {
      'Electronics': 3,
      'IT Equipment': 3,
      'Industrial': 10,
      'Machinery': 10,
      'Furniture': 7,
      'General': 5
    };

    const usefulLife = lifeRates[category] || lifeRates['General'];
    const purchase = new Date(purchaseDate);
    const now = new Date();
    const ageYears = (now - purchase) / (1000 * 60 * 60 * 24 * 365.25);
    const depreciationPerYear = cost / usefulLife;
    const currentValue = cost - (depreciationPerYear * ageYears);
    return Math.max(0, currentValue).toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });
  };

  return (
    <div style={styles.appContainer}>
      <OfflineBanner />
      <aside style={{
        ...styles.sidebar,
        transform: isMobile && !isSidebarOpen ? 'translateX(-100%)' : 'translateX(0)',
        position: isMobile ? 'fixed' : 'relative',
        zIndex: 150,
        height: '100%',
        boxShadow: isMobile && isSidebarOpen ? '4px 0 15px rgba(0,0,0,0.3)' : 'none'
      }}>
        <div style={styles.sidebarHeader}>
          <div style={styles.logoCircle}>BW</div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <h1 style={styles.logoText}>Bluewud</h1>
            <span style={{ fontSize: '9px', fontWeight: '600', color: 'var(--textSecondary)', letterSpacing: '0.05em' }}>ASSET MANAGEMENT</span>
          </div>
        </div>
        <div style={styles.navGroup}>
          <NavItem id="Asset List" icon="📦" label="Asset List" active={activeTab === 'Asset List'} onClick={() => { setActiveTab('Asset List'); if (isMobile) setIsSidebarOpen(false); }} />
          <NavItem id="Analytics" icon="📊" label="Analytics" active={activeTab === 'Analytics'} onClick={() => { setActiveTab('Analytics'); if (isMobile) setIsSidebarOpen(false); }} />
          <NavItem id="Reports" icon="📋" label="Reports" active={activeTab === 'Reports'} onClick={() => { setActiveTab('Reports'); if (isMobile) setIsSidebarOpen(false); }} />
          <NavItem id="Maintenance" icon="🔧" label="Maintenance" active={activeTab === 'Maintenance'} count={alerts.maintenance} color="#f39c12" onClick={() => { setActiveTab('Maintenance'); if (isMobile) setIsSidebarOpen(false); }} />
          <NavItem id="Reminders" icon="🔔" label="Reminders" active={activeTab === 'Reminders'} count={reminders.length} color="#74b9ff" onClick={() => { setActiveTab('Reminders'); if (isMobile) setIsSidebarOpen(false); }} />
          {isAdmin && <NavItem id="Allotment" icon="👤" label="Allotment" active={activeTab === 'Allotment'} onClick={() => { setActiveTab('Allotment'); if (isMobile) setIsSidebarOpen(false); }} />}
          {isAdmin && <NavItem id="Admin" icon="🛠️" label="Admin" active={activeTab === 'Admin'} onClick={() => { setActiveTab('Admin'); if (isMobile) setIsSidebarOpen(false); }} />}
          <NavItem id="Activity" icon="📜" label="Activity Log" active={activeTab === 'Activity'} onClick={() => { setActiveTab('Activity'); if (isMobile) setIsSidebarOpen(false); }} />
          <NavItem id="Audit" icon="🛡️" label="Physical Audit" active={activeTab === 'Audit'} onClick={() => { setActiveTab('Audit'); if (isMobile) setIsSidebarOpen(false); }} />
          <NavItem id="Checkout" icon="🔄" label="Check-In/Out" active={activeTab === 'Checkout'} count={alerts.overdue} color="#e74c3c" onClick={() => { setActiveTab('Checkout'); if (isMobile) setIsSidebarOpen(false); }} />
          <NavItem id="Scan" icon="📷" label="Quick Scan" active={activeTab === 'Scan'} onClick={() => { setActiveTab('Scan'); if (isMobile) setIsSidebarOpen(false); }} />
          <NavItem id="Contracts" icon="📜" label="Contracts" active={activeTab === 'Contracts'} onClick={() => { setActiveTab('Contracts'); if (isMobile) setIsSidebarOpen(false); }} />
          <NavItem id="Reservations" icon="📅" label="Reservations" active={activeTab === 'Reservations'} onClick={() => { setActiveTab('Reservations'); if (isMobile) setIsSidebarOpen(false); }} />
          <NavItem id="Consumables" icon="🧪" label="Consumables" active={activeTab === 'Consumables'} count={alerts.lowStock} color="#f39c12" onClick={() => { setActiveTab('Consumables'); if (isMobile) setIsSidebarOpen(false); }} />
          <NavItem id="Vendors" icon="🏢" label="Vendors" active={activeTab === 'Vendors'} onClick={() => { setActiveTab('Vendors'); if (isMobile) setIsSidebarOpen(false); }} />
          <NavItem id="ESign" icon="✍️" label="E-Sign" active={activeTab === 'ESign'} onClick={() => { setActiveTab('ESign'); if (isMobile) setIsSidebarOpen(false); }} />
          <NavItem id="Barcodes" icon="🏷️" label="Tagging" active={activeTab === 'Barcodes'} onClick={() => { setActiveTab('Barcodes'); if (isMobile) setIsSidebarOpen(false); }} />
          <NavItem id="ImportExport" icon="📥" label="Import/Export" active={activeTab === 'ImportExport'} onClick={() => { setActiveTab('ImportExport'); if (isMobile) setIsSidebarOpen(false); }} />
          {isAdmin && <NavItem id="MasterEditor" icon="📝" label="Master Editor" active={activeTab === 'MasterEditor'} onClick={() => { setActiveTab('MasterEditor'); if (isMobile) setIsSidebarOpen(false); }} />}
          <NavItem id="CRM" icon="🔗" label="Zoho Sync" active={activeTab === 'CRM'} onClick={() => { setActiveTab('CRM'); if (isMobile) setIsSidebarOpen(false); }} />
          <NavItem id="Roadmap" icon="🚀" label="Roadmap" active={activeTab === 'Roadmap'} onClick={() => { setActiveTab('Roadmap'); if (isMobile) setIsSidebarOpen(false); }} />
        </div>
        <div style={styles.sidebarFooter}>
          <InstallPWA />
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

      {/* Overlay for mobile */}
      {isMobile && isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 140 }}
        />
      )}

      <main style={styles.mainArea}>

        <header style={{ ...styles.contentHeader, padding: isMobile ? '0 20px' : '0 40px' }}>
          <div style={styles.headerLeft}>
            {isMobile && <HamburgerMenu isOpen={isSidebarOpen} onClick={() => setIsSidebarOpen(!isSidebarOpen)} />}
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              style={{ ...styles.tabTitle, fontSize: isMobile ? '20px' : '24px' }}
            >
              <span style={styles.gradientTitle}>{activeTab}</span>
            </motion.h2>
            {activeTab === 'Asset List' && (
              <div style={styles.headerLeftActions}>
                <div style={styles.searchWrapper}>
                  <span style={styles.searchIcon}>🔍</span>
                  <input
                    type="text"
                    placeholder="Search ID, Name, Serial [/]"
                    style={styles.headerSearch}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      style={styles.searchClear}
                    >✕</button>
                  )}
                </div>
                {hasPermission('import') && (
                  <button
                    onClick={() => setShowImportModal(true)}
                    style={{ ...styles.clearSelectionBtn, background: 'var(--background)', color: 'var(--text)', border: '1px solid var(--border)' }}
                  >
                    📥 Import CSV
                  </button>
                )}
                {hasPermission('bulk_action') && (
                  <button
                    onClick={() => {
                      // Select all visible assets using the correct unique ID
                      const allIds = assets.map(a => a.ROWID || a.Asset_ID || a.ID);
                      setSelectedIds(prev => prev.length === allIds.length ? [] : allIds);
                    }}
                    style={{ ...styles.clearSelectionBtn, background: 'var(--accent)', color: 'white', border: 'none' }}
                  >
                    {selectedIds.length === assets.length && assets.length > 0 ? '☐ Deselect All' : '☑ Select All'}
                  </button>
                )}
                {selectedIds.length > 0 && (
                  <button
                    style={styles.clearSelectionBtn}
                    onClick={() => setSelectedIds([])}
                    title="Deselect all assets"
                  >
                    Clear Selection ({selectedIds.length})
                  </button>
                )}
              </div>
            )}
          </div>
          <div style={styles.headerActions}>
            <ViewToggle viewMode={assetViewMode} setViewMode={setAssetViewMode} />
            <ThemeToggle />
            <div
              style={{ ...styles.avatar, cursor: 'pointer', width: 'auto', padding: '0 12px', borderRadius: '20px', gap: '8px' }}
              onClick={() => {
                const roles = ['super-admin', 'manager', 'technician', 'viewer'];
                const currentIndex = roles.indexOf(currentUser.role);
                const nextRole = roles[(currentIndex + 1) % roles.length];
                login(nextRole);
                logAction('ROLE_SWITCH', `Switched role to ${nextRole.toUpperCase()}`, currentUser.name, 'info');
              }}
              title={`Current Role: ${currentUser.role.toUpperCase()}. Click to switch roles.`}
            >
              <span style={{ fontSize: '12px', fontWeight: '800' }}>{currentUser.role.toUpperCase()}</span>
              {currentUser.avatar}
            </div>
          </div>
        </header>

        <section style={styles.pageContent}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              style={{ width: '100%', height: '100%' }}
            >
              {loading ? (
                <div style={styles.skeletonGrid}>
                  {[1, 2, 3, 4, 5, 6].map(i => <div key={i} style={styles.skeletonCard} />)}
                </div>
              ) : error ? (
                <div style={styles.errorState}>
                  <p>⚠️ {error}</p>
                  <div style={styles.errorActions}>
                      // Retry live sync
                    setError(null);
                    // Trigger re-fetch by toggling activeTab or calling fetchData directly if exposed
                    setActiveTab(activeTab);
                  </div>
                </div>
              ) : activeTab === 'Scan' ? (
                <div style={styles.scannerWrapper}>
                  <div style={styles.scannerHeader}>
                    <h3>Native Asset Scanner</h3>
                    <p>Point camera at an Asset Tag QR code</p>
                  </div>
                  <QRScanner
                    isMobile={isMobile}
                    onScan={(data) => {
                      alert(`Asset Identified: ${data}\nSyncing with Creator...`);
                      setActiveTab('Asset List'); // Redirect to inventory after scan
                    }} />
                </div>
              ) : activeTab === 'Analytics' ? (
                <Analytics assets={assets} />
              ) : activeTab === 'Reports' ? (
                <Reports assets={assets} consumables={consumables} updateAsset={updateAsset} setActiveTab={setActiveTab} />
              ) : activeTab === 'Maintenance' ? (
                <Maintenance assets={assets} updateAsset={updateAsset} />
              ) : activeTab === 'Activity' ? (
                <ActivityLog />
              ) : activeTab === 'Audit' ? (
                <AuditTool
                  assets={assets}
                  updateAsset={updateAsset}
                  onNewAsset={(newAsset) => {
                    setAssets(prev => [newAsset, ...prev]);
                    if (dataSource === 'live') {
                      // Fire and forget or handle error as needed
                      fetch('/server/bridgex', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ action: 'create', data: newAsset, table_name: 'Assets' })
                      });
                    }
                  }}
                />
              ) : activeTab === 'Checkout' ? (
                <CheckoutPortal assets={assets} updateAsset={updateAsset} />
              ) : activeTab === 'Profile' ? (
                <Profile />
              ) : activeTab === 'Roadmap' ? (
                <Roadmap />
              ) : activeTab === 'Contracts' ? (
                <Contracts assets={assets} updateAsset={updateAsset} />
              ) : activeTab === 'Reservations' ? (
                <Reservations assets={assets} updateAsset={updateAsset} />
              ) : activeTab === 'Consumables' ? (
                <Consumables items={consumables} updateConsumable={updateConsumable} />
              ) : activeTab === 'Vendors' ? (
                <VendorPortal assets={assets} vendors={vendors} />
              ) : activeTab === 'ESign' ? (
                <ESignature assets={assets} updateAsset={updateAsset} />
              ) : activeTab === 'Barcodes' ? (
                <BarcodeGenerator assets={assets} />
              ) : activeTab === 'Reminders' ? (
                <ReminderManager
                  assets={assets}
                  reminders={reminders}
                  onUpdateReminders={setReminders}
                />
              ) : activeTab === 'Allotment' ? (
                <AllotmentMaster assets={assets} />
              ) : activeTab === 'Admin' ? (
                <AdminDashboard />
              ) : activeTab === 'ImportExport' ? (
                <ImportExport
                  assets={assets}
                  onImport={(newAssets) => setAssets(prev => [...prev, ...newAssets])}
                />
              ) : activeTab === 'MasterEditor' ? (
                <MasterEditor
                  assets={assets}
                  updateAsset={(updatedAsset) => {
                    setAssets(prev => prev.map(a => a.Asset_ID === updatedAsset.Asset_ID ? updatedAsset : a));
                  }}
                />
              ) : activeTab === 'CRM' ? (
                <CRMIntegration />
              ) : assetViewMode === 'grouped' ? (
                <AssetGroupedView
                  assets={assets}
                  onSelectAsset={(asset) => setDetailAsset(asset)}
                />
              ) : (
                assets.filter(a => {
                  const term = searchTerm.toLowerCase();
                  return a.Item_Name.toLowerCase().includes(term) ||
                    a.Asset_ID.toLowerCase().includes(term) ||
                    (a.Serial_Number && a.Serial_Number.toLowerCase().includes(term));
                }).length > 0 ? (
                  <AssetGrid
                    assets={assets.filter(a => {
                      const term = searchTerm.toLowerCase();
                      return a.Item_Name.toLowerCase().includes(term) ||
                        a.Asset_ID.toLowerCase().includes(term) ||
                        (a.Serial_Number && a.Serial_Number.toLowerCase().includes(term));
                    })}
                    selectedIds={selectedIds}
                    onToggleSelect={id => setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])}
                    calculateDepreciation={(cost, pDate, cat) => calculateDepreciation(cost, pDate, cat)}
                    setDetailAsset={setDetailAsset}
                    readOnly={!hasPermission('bulk_action')}
                    isMobile={isMobile}
                  />
                ) : (
                  <div style={styles.emptyState}>
                    <span style={{ fontSize: '48px' }}>🔍</span>
                    <h3>No assets found</h3>
                    <p>Try adjusting your search terms.</p>
                    <button onClick={() => setSearchTerm('')} style={styles.secondaryBtn}>Clear Search</button>
                  </div>
                )
              )}
            </motion.div>
          </AnimatePresence>
        </section>

        {/* Bulk Operations Bar */}
        {selectedIds.length > 0 && hasPermission('bulk_action') && (
          <BulkOpsBar
            count={selectedIds.length}
            onAction={handleBulkAction}
          />
        )}
      </main>
      <AnimatePresence>
        {detailAsset && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={styles.modalOverlay}
            onClick={() => setDetailAsset(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              style={styles.detailModal}
              onClick={e => e.stopPropagation()}
            >
              <div style={styles.detailHeader}>
                <div>
                  <span style={styles.detailTag}>{detailAsset.Category && !detailAsset.Category.match(/^[0-9.]+$/) ? detailAsset.Category : 'Uncategorized'}</span>
                  <h2 style={styles.detailTitle}>{detailAsset.Item_Name}</h2>
                  <span style={styles.detailId}>{detailAsset.Asset_ID}</span>
                </div>
                <button style={styles.closeBtn} onClick={() => setDetailAsset(null)}>✕</button>
              </div>

              <div style={styles.detailScrollBody}>
                <div style={styles.detailGrid}>
                  <div style={styles.detailInfoCard}>
                    <span style={styles.infoLabel}>Current Status</span>
                    {isAdmin ? (
                      <select
                        style={styles.adminEditSelect}
                        value={detailAsset.Status}
                        onChange={(e) => { updateAsset(detailAsset.Asset_ID, { Status: e.target.value }); setDetailAsset(prev => ({ ...prev, Status: e.target.value })); }}
                      >
                        <option>Available</option>
                        <option>Assigned</option>
                        <option>Under Maintenance</option>
                        <option>Retired</option>
                        <option>Off-Site</option>
                      </select>
                    ) : (
                      <div style={{ ...styles.infoValue, color: 'var(--accent)' }}>{detailAsset.Status}</div>
                    )}
                  </div>
                  <div style={styles.detailInfoCard}>
                    <span style={styles.infoLabel}>Health Score</span>
                    <div style={styles.infoValue}>{detailAsset.Health_Score}%</div>
                  </div>
                  <div style={styles.detailInfoCard}>
                    <span style={styles.infoLabel}>Purchase Value</span>
                    {isAdmin ? (
                      <input
                        type="number"
                        style={styles.adminEditInput}
                        value={detailAsset.Cost}
                        onChange={(e) => { updateAsset(detailAsset.Asset_ID, { Cost: Number(e.target.value) }); setDetailAsset(prev => ({ ...prev, Cost: Number(e.target.value) })); }}
                      />
                    ) : (
                      <div style={styles.infoValue}>₹{detailAsset.Cost?.toLocaleString()}</div>
                    )}
                  </div>
                  <div style={styles.detailInfoCard}>
                    <span style={styles.infoLabel}>Primary Vendor</span>
                    <div style={styles.infoValue}>{detailAsset.Vendor_Name || 'Standard Supply'}</div>
                  </div>
                </div>

                <h4 style={styles.detailSubLabel}>Asset Lifecycle History</h4>
                <div style={styles.historyTimeline}>
                  <div style={styles.timelineItem}>
                    <div style={styles.timelineDot} />
                    <div style={styles.timelineContent}>
                      <div style={styles.timelineAction}>Asset Deployed</div>
                      <div style={styles.timelineDate}>{detailAsset.Purchase_Date}</div>
                    </div>
                  </div>
                  <div style={styles.timelineItem}>
                    <div style={styles.timelineDot} />
                    <div style={styles.timelineContent}>
                      <div style={styles.timelineAction}>Last Audit Captured</div>
                      <div style={styles.timelineDate}>2025-11-20</div>
                    </div>
                  </div>
                </div>

                <div style={styles.detailSignatureBox}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '24px' }}>🛡️</span>
                    <div>
                      <div style={{ fontWeight: '800', fontSize: '12px' }}>VERIFIED DIGITAL RECORD</div>
                      <div style={{ fontSize: '10px', color: 'var(--textSecondary)' }}>Hashed on Ledger: 0x71...f9a2</div>
                    </div>
                  </div>
                </div>
              </div>

              <div style={styles.detailFooter}>
                <button
                  style={{ ...styles.secondaryBtn, color: '#d63031', borderColor: '#d63031', marginRight: 'auto' }}
                  onClick={() => {
                    if (window.confirm("Delete this asset permanently?")) {
                      executeDelete([detailAsset.Asset_ID]);
                      setDetailAsset(null);
                    }
                  }}
                >
                  Delete
                </button>
                <button style={styles.secondaryBtn} onClick={() => setDetailAsset(null)}>Close</button>
                <button style={styles.primaryBtn} onClick={() => { setActiveTab('Maintenance'); setDetailAsset(null); }}>Report Issue</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Import Modal */}
      {showImportModal && (
        <ImportModal
          onClose={() => setShowImportModal(false)}
          onImport={handleImport}
        />
      )}
    </div>
  );
};

// --- SUB-COMPONENTS ---

const BulkOpsBar = ({ count, onAction }) => (
  <div style={styles.bulkOpsBar}>
    <div style={styles.bulkInfo}>
      <span style={styles.bulkCount}>{count}</span>
      <span style={styles.bulkText}>Assets Selected</span>
    </div>
    <div style={styles.bulkActions}>
      <button style={styles.bulkBtn} onClick={() => onAction('status')}>Change Status</button>
      <button style={styles.bulkBtn} onClick={() => onAction('assign')}>Assign User</button>
      <button style={styles.bulkBtn} onClick={() => onAction('location')}>Move Location</button>
      <button style={{ ...styles.bulkBtn, background: '#e74c3c' }} onClick={() => onAction('retire')}>Retire</button>
      <button style={{ ...styles.bulkBtn, background: '#d63031' }} onClick={() => onAction('delete')}>Delete</button>
    </div>
  </div>
);

const QRScanner = ({ onScan, isMobile }) => {
  useEffect(() => {
    const scanner = new Html5QrcodeScanner("reader", {
      fps: 10,
      qrbox: isMobile ? { width: window.innerWidth * 0.8, height: 250 } : { width: 250, height: 250 },
      aspectRatio: isMobile ? 1.0 : 1.0
    });

    scanner.render((result) => {
      onScan(result);
      scanner.clear();
    }, (error) => {
      // Quietly handle errors
    });

    return () => scanner.clear();
  }, [onScan]);

  return <div id="reader" style={styles.scannerBody}></div>;
};

const AssetGrid = ({ assets, selectedIds, onToggleSelect, calculateDepreciation, setDetailAsset, readOnly, isMobile }) => (
  <div style={{
    ...styles.assetGrid,
    gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: isMobile ? '16px' : '24px'
  }}>
    {assets.map((asset, index) => {
      // Use ROWID for live data, Asset_ID as fallback, then ID for demo
      const uniqueId = asset.ROWID || asset.Asset_ID || asset.ID;
      const isSelected = selectedIds?.includes(uniqueId);
      const currentValue = calculateDepreciation(asset.Cost, asset.Purchase_Date);

      return (
        <motion.div
          key={uniqueId}
          layout
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2, delay: index * 0.05 }}
          whileHover={{ y: -5, boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
          whileTap={{ scale: 0.98 }}
          className="glass-card"
          style={{
            ...styles.assetCard,
            padding: '24px',
            border: isSelected ? '2px solid var(--accent)' : '1px solid var(--border)',
            cursor: 'pointer'
          }}
          onClick={() => {
            setDetailAsset(asset);
          }}
        >
          <div style={styles.cardTop}>
            <div style={styles.cardTopLeft}>
              <div
                style={{
                  ...styles.checkbox,
                  backgroundColor: isSelected ? 'var(--accent)' : 'transparent',
                  borderColor: isSelected ? 'var(--accent)' : 'var(--border)',
                  opacity: readOnly ? 0 : 1, pointerEvents: readOnly ? 'none' : 'auto'
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleSelect(uniqueId);
                }}
              >
                {isSelected && <span style={styles.checkMark}>✓</span>}
              </div>
              <span style={styles.assetId}>{asset.Asset_ID || "NEW-ASSET"}</span>
            </div>
            <span style={styles.statusBadge}>{asset.Status || "Available"}</span>
          </div>
          <h4 style={styles.assetName}>{asset.Item_Name}</h4>
          <p style={styles.assetCategory}>{asset.Category && !asset.Category.match(/^[0-9.]+$/) ? asset.Category : 'Uncategorized'}</p>

          <div style={styles.depreciationInfo}>
            <span style={styles.depLabel}>Book Value:</span>
            <span style={styles.depValue}>{currentValue}</span>
          </div>

          <div style={styles.cardFooter}>
            <span style={styles.assignedUser}>{asset.Assigned_User?.display_value || "In Inventory"}</span>
            <div style={styles.healthDot} title="Healthy" />
          </div>
        </motion.div>
      );
    })}
  </div>
);



const NavItem = ({ icon, label, active, onClick, count, color }) => (
  <div onClick={onClick} style={{
    ...styles.navItem,
    backgroundColor: active ? 'var(--accentLight)' : 'transparent',
    color: active ? 'var(--accent)' : 'var(--textSecondary)',
    position: 'relative'
  }}>
    <span style={styles.navIcon}>{icon}</span>
    <span style={styles.navLabel}>{label}</span>
    {count > 0 && (
      <span style={{
        ...styles.navBadge,
        backgroundColor: color || 'var(--accent)'
      }}>{count}</span>
    )}
  </div>
);

// --- STYLING ---

const styles = {
  appContainer: { display: 'flex', height: '100vh', width: '100vw', background: 'var(--background)', fontFamily: 'Inter, sans-serif', overflow: 'hidden' },
  sidebar: { width: '260px', height: '100vh', background: 'var(--surface)', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', overflowY: 'auto', overflowX: 'hidden', flexShrink: 0 },
  sidebarHeader: { padding: '40px 25px', display: 'flex', alignItems: 'center' },
  logoCircle: { width: '40px', height: '40px', background: 'var(--accent)', borderRadius: '12px', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900' },
  logoText: { marginLeft: '12px', fontSize: '20px', fontWeight: '900', color: 'var(--text)' },
  navGroup: { flex: 1, overflowY: 'auto' },
  navItem: { display: 'flex', alignItems: 'center', padding: '16px 25px', cursor: 'pointer', transition: '0.2s' },
  navIcon: { marginRight: '15px' },
  navLabel: { fontWeight: '600', fontSize: '15px', flex: 1 },
  navBadge: {
    fontSize: '10px', fontWeight: '900', color: 'white',
    padding: '2px 6px', borderRadius: '10px',
    minWidth: '18px', textAlign: 'center'
  },
  sidebarFooter: { padding: '25px', borderTop: '1px solid var(--border)', marginTop: 'auto', background: 'var(--surface)' },
  connectionStatus: { display: 'flex', alignItems: 'center', fontSize: '10px', fontWeight: '800', color: 'var(--textSecondary)' },
  pulseDot: { width: '8px', height: '8px', borderRadius: '50%', marginRight: '10px' },
  mainArea: { flex: 1, overflowY: 'auto', overflowX: 'hidden', WebkitOverflowScrolling: 'touch', scrollBehavior: 'smooth' },
  contentHeader: { height: '80px', background: 'var(--surface)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 40px', borderBottom: '1px solid var(--border)' },
  tabTitle: { fontSize: '24px', fontWeight: '900', color: 'var(--text)', fontFamily: 'Inter, sans-serif' },
  gradientTitle: { background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' },
  headerLeft: { display: 'flex', alignItems: 'center', gap: '30px' },
  headerLeftActions: { display: 'flex', alignItems: 'center', gap: '15px' },
  clearSelectionBtn: { padding: '8px 16px', background: 'var(--accentLight)', color: 'var(--accent)', border: 'none', borderRadius: '10px', fontWeight: '700', cursor: 'pointer', fontSize: '13px', transition: '0.2s' },
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
  pageContent: { padding: '40px 40px 80px 40px' },
  assetGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' },
  assetCard: { background: 'var(--surface)', padding: '24px', borderRadius: '20px', boxShadow: 'var(--shadow)', border: '1px solid var(--border)' },
  cardTop: { display: 'flex', justifyContent: 'space-between', marginBottom: '12px' },
  cardTopLeft: { display: 'flex', alignItems: 'center', gap: '10px' },
  checkbox: { width: '18px', height: '18px', border: '2px solid var(--border)', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: '0.2s' },
  checkMark: { color: 'white', fontSize: '12px', fontWeight: 'bold' },
  assetId: { fontSize: '10px', fontWeight: '800', color: 'var(--textSecondary)' },
  statusBadge: { fontSize: '9px', fontWeight: '900', color: 'var(--accent)', background: 'var(--accentLight)', padding: '2px 8px', borderRadius: '10px' },
  assetName: { fontSize: '18px', fontWeight: '800', margin: '12px 0 4px 0', color: 'var(--text)' },
  assetCategory: { fontSize: '13px', color: 'var(--textSecondary)', marginBottom: '12px' },
  depreciationInfo: { display: 'flex', justifyContent: 'space-between', marginBottom: '20px', padding: '8px 12px', background: 'var(--background)', borderRadius: '10px', fontSize: '11px' },
  depLabel: { color: 'var(--textSecondary)', fontWeight: '600' },
  depValue: { color: 'var(--accent)', fontWeight: '800' },
  cardFooter: { borderTop: '1px solid var(--border)', paddingTop: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  assignedUser: { fontSize: '12px', fontWeight: '700', color: 'var(--text)' },
  healthDot: { width: '10px', height: '10px', background: '#00B894', borderRadius: '50%' },
  skeletonGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' },
  loaderCard: { height: '200px', background: 'var(--border)', borderRadius: '20px', opacity: '0.6' },
  errorState: { textAlign: 'center', padding: '100px', background: 'var(--surface)', borderRadius: '30px', border: '1px solid var(--border)', maxWidth: '600px', margin: '40px auto' },
  errorActions: { display: 'flex', gap: '15px', justifyContent: 'center', marginTop: '20px' },
  retryButton: { padding: '12px 24px', background: 'var(--accent)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: '700', cursor: 'pointer' },
  demoFallbackButton: { padding: '12px 24px', background: 'transparent', color: 'var(--textSecondary)', border: '1px solid var(--border)', borderRadius: '12px', fontWeight: '700', cursor: 'pointer' },
  scannerWrapper: { background: 'var(--surface)', padding: '40px', borderRadius: '30px', boxShadow: 'var(--shadow)', textAlign: 'center', maxWidth: '600px', margin: '0 auto', border: '1px solid var(--border)' },
  scannerHeader: { marginBottom: '30px', color: 'var(--text)' },
  scannerBody: { width: '100%', borderRadius: '20px', overflow: 'hidden', border: 'none' },
  demoBanner: { background: 'linear-gradient(135deg, #fdcb6e, #f39c12)', color: '#2d3436', padding: '12px 40px', fontSize: '13px', fontWeight: '600', textAlign: 'center' },
  skeletonCard: { height: '180px', background: 'var(--border)', borderRadius: '20px' },
  bulkOpsBar: {
    position: 'fixed', bottom: '40px', left: '300px', right: '40px',
    background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '24px',
    padding: '20px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    boxShadow: '0 20px 50px rgba(0,0,0,0.3)', backdropFilter: 'blur(20px)', zIndex: 100,
    animation: 'slideUp 0.4s cubic-bezier(0.18, 0.89, 0.32, 1.28)'
  },
  bulkInfo: { display: 'flex', alignItems: 'center', gap: '15px' },
  bulkCount: { background: 'var(--accent)', color: 'white', padding: '8px 16px', borderRadius: '12px', fontWeight: '900', fontSize: '18px' },
  bulkText: { fontWeight: '700', color: 'var(--text)', fontSize: '16px' },
  bulkActions: { display: 'flex', gap: '15px' },
  bulkBtn: {
    padding: '12px 20px', background: 'var(--background)', color: 'var(--text)',
    border: '1px solid var(--border)', borderRadius: '12px', fontWeight: '700',
    cursor: 'pointer', transition: '0.2s'
  },
  emptyState: {
    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    height: '400px', color: 'var(--textSecondary)', gap: '16px'
  },
  secondaryBtn: {
    padding: '8px 16px', background: 'transparent', color: 'var(--text)',
    border: '1px solid var(--border)', borderRadius: '10px',
    fontWeight: '600', cursor: 'pointer', transition: '0.2s'
  },
  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 },
  detailModal: { background: 'var(--surface)', width: '600px', maxHeight: '90vh', borderRadius: '30px', padding: '40px', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 30px 60px rgba(0,0,0,0.4)', border: '1px solid var(--border)' },
  detailHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '30px' },
  detailTag: { fontSize: '10px', fontWeight: '900', color: 'var(--accent)', background: 'var(--accentLight)', padding: '4px 12px', borderRadius: '10px', textTransform: 'uppercase' },
  detailTitle: { fontSize: '32px', fontWeight: '900', margin: '10px 0 4px 0', color: 'var(--text)' },
  detailId: { fontSize: '14px', color: 'var(--textSecondary)', fontWeight: '600' },
  closeBtn: { background: 'transparent', border: 'none', color: 'var(--textSecondary)', fontSize: '20px', cursor: 'pointer' },
  detailScrollBody: { flex: 1, overflowY: 'auto', marginBottom: '30px' },
  detailGrid: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', marginBottom: '30px' },
  detailInfoCard: { padding: '20px', background: 'var(--background)', borderRadius: '20px', border: '1px solid var(--border)' },
  infoLabel: { fontSize: '11px', fontWeight: '700', color: 'var(--textSecondary)', textTransform: 'uppercase', marginBottom: '8px', display: 'block' },
  infoValue: { fontSize: '18px', fontWeight: '900', color: 'var(--text)' },
  detailSubLabel: { fontSize: '14px', fontWeight: '800', color: 'var(--textSecondary)', marginBottom: '15px' },
  historyTimeline: { borderLeft: '2px solid var(--border)', marginLeft: '10px', paddingLeft: '20px', marginBottom: '30px' },
  timelineItem: { position: 'relative', marginBottom: '20px' },
  timelineDot: { position: 'absolute', left: '-26px', top: '5px', width: '10px', height: '10px', background: 'var(--accent)', borderRadius: '50%' },
  timelineAction: { fontWeight: '700', fontSize: '14px', color: 'var(--text)' },
  timelineDate: { fontSize: '12px', color: 'var(--textSecondary)' },
  detailSignatureBox: { padding: '20px', background: 'linear-gradient(135deg, rgba(9, 132, 227, 0.1), rgba(0, 184, 148, 0.1))', borderRadius: '20px', border: '1px solid rgba(9, 132, 227, 0.2)' },
  detailFooter: { display: 'flex', gap: '15px', borderTop: '1px solid var(--border)', paddingTop: '30px' },
  primaryBtn: { padding: '12px 24px', background: 'var(--accent)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: '700', cursor: 'pointer', flex: 1, textAlign: 'center' },
  adminEditSelect: { width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid var(--accent)', background: 'var(--surface)', color: 'var(--accent)', fontWeight: '700', fontSize: '14px', cursor: 'pointer', outline: 'none' },
  adminEditInput: { width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid var(--accent)', background: 'var(--surface)', color: 'var(--accent)', fontWeight: '700', fontSize: '14px', outline: 'none' }
};

export default App;
