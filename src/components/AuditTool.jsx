import React, { useState, useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { mockAssets } from '../mockData';

const AuditTool = ({ assets = [], updateAsset, onNewAsset }) => {
    const [lastScanned, setLastScanned] = useState(null);
    const [auditStats, setAuditStats] = useState({ verified: 0, total: assets.length });
    const [isScanning, setIsScanning] = useState(false);
    const [verifiedList, setVerifiedList] = useState([]);
    const [mode, setMode] = useState('verify'); // 'verify' or 'register'
    const [newAssetData, setNewAssetData] = useState({
        Asset_ID: '',
        Item_Name: '',
        Category: 'IT Equipment',
        Location: '',
        Health_Score: 100,
        photos: { object: null, bill: null }
    });
    const [step, setStep] = useState(1);

    useEffect(() => {
        setAuditStats(prev => ({ ...prev, total: assets.length }));
    }, [assets]);

    useEffect(() => {
        if (isScanning) {
            const scanner = new Html5QrcodeScanner("audit-reader", {
                fps: 10,
                qrbox: { width: 250, height: 250 },
                aspectRatio: 1.0
            });

            scanner.render((result) => {
                if (mode === 'verify') {
                    handleScan(result);
                } else if (mode === 'register' && step === 1) {
                    setNewAssetData(prev => ({ ...prev, Asset_ID: result }));
                    setStep(2);
                    console.log(`📡 Registered ID via Scan: ${result}`);
                }
            }, (error) => { });

            return () => scanner.clear();
        }
    }, [isScanning, mode, step]);

    const handleScan = (assetId) => {
        const asset = assets.find(a => a.Asset_ID === assetId || a.Item_Name === assetId);

        if (asset) {
            if (!verifiedList.includes(asset.Asset_ID)) {
                setVerifiedList(prev => [asset.Asset_ID, ...prev]);
                setAuditStats(prev => ({ ...prev, verified: prev.verified + 1 }));
                setLastScanned({ ...asset, status: 'Verified' });

                updateAsset(asset.Asset_ID, {
                    Last_Audit_Date: new Date().toISOString().split('T')[0],
                    Audit_Status: 'Verified'
                });
            }
        } else {
            setLastScanned({ id: assetId, status: 'Unknown Asset', error: true });
        }
    };

    const handleFileChange = (type, file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            setNewAssetData(prev => ({
                ...prev,
                photos: { ...prev.photos, [type]: reader.result }
            }));
        };
        if (file) reader.readAsDataURL(file);
    };

    const submitNewAsset = () => {
        if (!newAssetData.Asset_ID || !newAssetData.Item_Name) {
            alert("Please complete the basic identity fields.");
            return;
        }

        const fullAsset = {
            ...newAssetData,
            ID: Math.random().toString(36).substr(2, 9),
            Status: 'Available',
            Purchase_Date: new Date().toISOString().split('T')[0],
            Lifecycle_History: [{ date: new Date().toISOString().split('T')[0], action: 'Physical Entry', user: 'Technician' }]
        };

        if (onNewAsset) {
            onNewAsset(fullAsset);
            setVerifiedList(prev => [fullAsset.Asset_ID, ...prev]);
            setAuditStats(prev => ({ ...prev, verified: prev.verified + 1, total: prev.total + 1 }));
            alert(`✅ Asset ${fullAsset.Asset_ID} added to ledger.`);
            resetRegistration();
        }
    };

    const resetRegistration = () => {
        setNewAssetData({
            Asset_ID: '',
            Item_Name: '',
            Category: 'IT Equipment',
            Location: '',
            Health_Score: 100,
            photos: { object: null, bill: null }
        });
        setStep(1);
        setMode('verify');
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <div>
                    <h2 style={styles.title}>🛡️ Physical Audit & Registration</h2>
                    <p style={styles.subtitle}>Verify existing assets or register new equipment discovered during floor audit.</p>
                </div>
                <div style={styles.tabToggle}>
                    <button
                        style={{ ...styles.toggleBtn, ...(mode === 'verify' ? styles.toggleActive : {}) }}
                        onClick={() => { setMode('verify'); setIsScanning(false); }}
                    >
                        Verify Assets
                    </button>
                    <button
                        style={{ ...styles.toggleBtn, ...(mode === 'register' ? styles.toggleActive : {}) }}
                        onClick={() => { setMode('register'); setIsScanning(false); setStep(1); }}
                    >
                        Register New
                    </button>
                </div>
            </div>

            {mode === 'verify' ? (
                <div style={styles.auditLayout}>
                    <div style={styles.scannerCol}>
                        <div style={styles.statsCard}>
                            <div style={styles.statLine}>
                                <span style={styles.statLabel}>Compliance Rate</span>
                                <span style={styles.statValue}>{Math.round((auditStats.verified / auditStats.total) * 100)}%</span>
                            </div>
                            <div style={styles.progressBar}>
                                <div style={{ ...styles.progressFill, width: `${(auditStats.verified / auditStats.total) * 100}%` }} />
                            </div>
                            <div style={styles.statSub}>{auditStats.verified} of {auditStats.total} assets verified</div>
                        </div>

                        {!isScanning ? (
                            <div style={styles.startHero} onClick={() => setIsScanning(true)}>
                                <span style={styles.heroIcon}>📷</span>
                                <h3>Activate Scanner</h3>
                                <p>Begin batch verification</p>
                            </div>
                        ) : (
                            <div style={styles.activeScannerCard}>
                                <div id="audit-reader" style={styles.reader} />
                                <button style={styles.stopBtn} onClick={() => setIsScanning(false)}>Pause Audit</button>
                            </div>
                        )}

                        {lastScanned && (
                            <div style={{
                                ...styles.scanResult,
                                borderColor: lastScanned.error ? '#ef4444' : '#10b981',
                                background: lastScanned.error ? '#fef2f2' : '#f0fdf4'
                            }}>
                                <div style={styles.resultIcon}>{lastScanned.error ? '⚠️' : '✅'}</div>
                                <div>
                                    <div style={styles.resultTitle}>{lastScanned.Item_Name || lastScanned.id}</div>
                                    <div style={styles.resultSub}>
                                        {lastScanned.error ? 'Asset ID not in system' : `Verified at ${new Date().toLocaleTimeString()}`}
                                    </div>
                                    {lastScanned.error && (
                                        <button
                                            style={styles.inlineRegisterBtn}
                                            onClick={() => { setMode('register'); setNewAssetData(d => ({ ...d, Asset_ID: lastScanned.id })); setStep(1); }}
                                        >
                                            Register as New
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    <div style={styles.feedCol}>
                        <h3 style={styles.feedTitle}>Session Verification Log</h3>
                        <div style={styles.feedList}>
                            {verifiedList.length === 0 ? (
                                <div style={styles.emptyFeed}>No scans yet this session...</div>
                            ) : (
                                verifiedList.map(id => {
                                    const asset = assets.find(a => a.Asset_ID === id);
                                    return (
                                        <div key={id} style={styles.feedItem}>
                                            <div style={styles.feedItemTop}>
                                                <span style={styles.feedItemName}>{asset?.Item_Name || 'New Registration'}</span>
                                                <span style={styles.feedItemId}>{id}</span>
                                            </div>
                                            <div style={styles.feedItemMeta}>
                                                <span>📍 {asset?.Location || 'Awaiting Final Assign'}</span>
                                                <span style={styles.verifiedTag}>PHYSICALLY SEEN</span>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                <div style={styles.registrationForm}>
                    <div style={styles.formStepsIndicator}>
                        {[1, 2, 3].map(s => (
                            <div key={s} style={{ ...styles.stepDot, ...(s <= step ? styles.stepActive : {}) }}>
                                {s < step ? '✓' : s}
                                <span style={styles.stepLabel}>{s === 1 ? 'Identity' : s === 2 ? 'Visuals' : 'Details'}</span>
                            </div>
                        ))}
                    </div>

                    <div style={styles.formCard} className="glass-card">
                        {step === 1 && (
                            <div style={styles.formStep}>
                                <h3>Step 1: Identity & Scan</h3>
                                <p style={styles.fieldHint}>Scan a new tag or enter the ID manually.</p>

                                <div style={styles.idInputGroup}>
                                    <input
                                        style={styles.input}
                                        placeholder="Asset ID (e.g., BW-IT-105)"
                                        value={newAssetData.Asset_ID}
                                        onChange={e => setNewAssetData({ ...newAssetData, Asset_ID: e.target.value })}
                                    />
                                    <button
                                        style={styles.scanIdBtn}
                                        onClick={() => setIsScanning(!isScanning)}
                                    >
                                        {isScanning ? "🛑 Stop Scan" : "📷 Scan Tag"}
                                    </button>
                                </div>
                                {isScanning && <div id="audit-reader" style={styles.registrationReader} />}

                                <input
                                    style={styles.input}
                                    placeholder="Item Name (e.g., MacBook Pro)"
                                    value={newAssetData.Item_Name}
                                    onChange={e => setNewAssetData({ ...newAssetData, Item_Name: e.target.value })}
                                />
                                <button style={styles.primaryBtn} onClick={() => setStep(2)}>Continue to Visuals</button>
                            </div>
                        )}

                        {step === 2 && (
                            <div style={styles.formStep}>
                                <h3>Step 2: Documentation & Photos</h3>
                                <div style={styles.mediaGrid}>
                                    <div style={styles.mediaSlot}>
                                        <label style={styles.mediaLabel}>Physical Object Photo</label>
                                        <div style={styles.photoContainer}>
                                            {newAssetData.photos.object ? (
                                                <img src={newAssetData.photos.object} style={styles.photoPreview} />
                                            ) : (
                                                <div style={styles.photoPlaceholder}>📷 Object Photo Required</div>
                                            )}
                                            <input
                                                type="file"
                                                accept="image/*"
                                                capture="environment"
                                                style={styles.fileInput}
                                                onChange={e => handleFileChange('object', e.target.files[0])}
                                            />
                                        </div>
                                    </div>
                                    <div style={styles.mediaSlot}>
                                        <label style={styles.mediaLabel}>Invoice / Bill Scan</label>
                                        <div style={styles.photoContainer}>
                                            {newAssetData.photos.bill ? (
                                                <img src={newAssetData.photos.bill} style={styles.photoPreview} />
                                            ) : (
                                                <div style={styles.photoPlaceholder}>📋 Bill Scan Required</div>
                                            )}
                                            <input
                                                type="file"
                                                accept="image/*"
                                                style={styles.fileInput}
                                                onChange={e => handleFileChange('bill', e.target.files[0])}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div style={styles.btnRow}>
                                    <button style={styles.secondaryBtn} onClick={() => setStep(1)}>Back</button>
                                    <button style={styles.primaryBtn} onClick={() => setStep(3)}>Finalize Details</button>
                                </div>
                            </div>
                        )}

                        {step === 3 && (
                            <div style={styles.formStep}>
                                <h3>Step 3: Specification & Placement</h3>
                                <select
                                    style={styles.input}
                                    value={newAssetData.Category}
                                    onChange={e => setNewAssetData({ ...newAssetData, Category: e.target.value })}
                                >
                                    <option>IT Equipment</option>
                                    <option>Furniture</option>
                                    <option>Electronics</option>
                                    <option>Hardware</option>
                                </select>
                                <select
                                    style={styles.input}
                                    value={newAssetData.Location}
                                    onChange={e => setNewAssetData({ ...newAssetData, Location: e.target.value })}
                                >
                                    <option value="">Select Location...</option>
                                    <option>A-108</option>
                                    <option>J-18</option>
                                    <option>Off-Site</option>
                                </select>
                                <div style={styles.btnRow}>
                                    <button style={styles.secondaryBtn} onClick={() => setStep(2)}>Back</button>
                                    <button style={styles.primaryBtn} onClick={submitNewAsset}>Add to Ledger & Complete Audit</button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

const styles = {
    container: { padding: '24px', maxWidth: '1400px', margin: '0 auto' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', gap: '24px' },
    title: { fontSize: '28px', fontWeight: '900', marginBottom: '8px', color: 'var(--text)' },
    subtitle: { fontSize: '14px', color: 'var(--textSecondary)', maxWidth: '500px' },

    tabToggle: { display: 'flex', background: 'var(--surface)', padding: '6px', borderRadius: '16px', border: '1px solid var(--border)' },
    toggleBtn: { padding: '10px 24px', borderRadius: '12px', border: 'none', background: 'transparent', color: 'var(--textSecondary)', fontWeight: '700', cursor: 'pointer', transition: '0.2s' },
    toggleActive: { background: 'var(--accent)', color: 'white' },

    auditLayout: { display: 'grid', gridTemplateColumns: 'minmax(400px, 1fr) 400px', gap: '32px' },
    scannerCol: { display: 'flex', flexDirection: 'column', gap: '24px' },
    statsCard: { background: 'var(--surface)', padding: '24px', borderRadius: '24px', border: '1px solid var(--border)', boxShadow: 'var(--shadow)' },
    statLine: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' },
    statLabel: { fontSize: '11px', fontWeight: '800', color: 'var(--textSecondary)', textTransform: 'uppercase', letterSpacing: '1px' },
    statValue: { fontSize: '28px', fontWeight: '900', color: 'var(--accent)' },
    progressBar: { height: '10px', background: 'var(--background)', borderRadius: '5px', overflow: 'hidden', marginBottom: '8px' },
    progressFill: { height: '100%', background: 'var(--accent)', transition: 'width 0.5s ease' },
    statSub: { fontSize: '12px', color: 'var(--textSecondary)', fontWeight: '600' },

    startHero: { background: 'var(--surface)', border: '2px dashed var(--border)', borderRadius: '32px', padding: '100px 40px', textAlign: 'center', cursor: 'pointer', transition: '0.2s' },
    heroIcon: { fontSize: '56px', display: 'block', marginBottom: '20px' },

    activeScannerCard: { background: 'var(--surface)', borderRadius: '32px', overflow: 'hidden', border: '1px solid var(--border)', boxShadow: 'var(--shadow)' },
    reader: { width: '100%', border: 'none' },
    stopBtn: { width: '100%', padding: '16px', border: 'none', background: '#e74c3c', color: 'white', fontWeight: '800', cursor: 'pointer' },

    scanResult: { display: 'flex', alignItems: 'flex-start', gap: '16px', padding: '20px', borderRadius: '24px', border: '2px solid' },
    resultIcon: { fontSize: '28px' },
    resultTitle: { fontSize: '18px', fontWeight: '900', color: 'var(--text)', marginBottom: '4px' },
    resultSub: { fontSize: '13px', color: 'var(--textSecondary)', marginBottom: '12px' },
    inlineRegisterBtn: { padding: '8px 16px', background: 'var(--accent)', color: 'white', border: 'none', borderRadius: '10px', fontWeight: '700', cursor: 'pointer' },

    feedCol: { background: 'var(--surface)', borderRadius: '32px', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: 'var(--shadow)' },
    feedTitle: { padding: '24px', borderBottom: '1px solid var(--border)', fontSize: '17px', fontWeight: '900', color: 'var(--text)' },
    feedList: { flex: 1, padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '700px' },
    feedItem: { padding: '16px', borderRadius: '16px', background: 'var(--background)', border: '1px solid var(--border)' },
    feedItemTop: { display: 'flex', justifyContent: 'space-between', marginBottom: '6px' },
    feedItemName: { fontSize: '15px', fontWeight: '800', color: 'var(--text)' },
    feedItemId: { fontSize: '10px', fontWeight: '900', opacity: 0.6, letterSpacing: '1px' },
    feedItemMeta: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    verifiedTag: { fontSize: '9px', fontWeight: '900', color: '#10b981', background: '#dcfce7', padding: '3px 10px', borderRadius: '8px' },

    registrationForm: { maxWidth: '800px', margin: '0 auto', width: '100%' },
    formStepsIndicator: { display: 'flex', justifyContent: 'center', gap: '40px', marginBottom: '40px' },
    stepDot: { width: '36px', height: '36px', borderRadius: '50%', background: 'var(--surface)', border: '2px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: '900', color: 'var(--textSecondary)', position: 'relative' },
    stepActive: { background: 'var(--accent)', borderColor: 'var(--accent)', color: 'white' },
    stepLabel: { position: 'absolute', top: '44px', fontSize: '12px', whiteSpace: 'nowrap', fontWeight: '800', color: 'inherit' },

    formCard: { padding: '40px', borderRadius: '32px' },
    formStep: { display: 'flex', flexDirection: 'column', gap: '20px' },
    idInputGroup: { display: 'flex', gap: '12px' },
    input: { padding: '16px 20px', borderRadius: '16px', border: '2px solid var(--border)', background: 'var(--background)', color: 'var(--text)', fontSize: '16px', fontWeight: '600', outline: 'none' },
    scanIdBtn: { padding: '0 20px', borderRadius: '16px', border: 'none', background: 'var(--accent)', color: 'white', fontWeight: '700', cursor: 'pointer' },
    registrationReader: { borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--border)', marginTop: '10px' },

    mediaGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' },
    mediaSlot: { display: 'flex', flexDirection: 'column', gap: '10px' },
    mediaLabel: { fontSize: '13px', fontWeight: '800', color: 'var(--textSecondary)' },
    photoContainer: { position: 'relative', background: 'var(--background)', height: '200px', borderRadius: '20px', border: '2px dashed var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
    photoPreview: { width: '100%', height: '100%', objectFit: 'cover' },
    photoPlaceholder: { fontSize: '14px', color: 'var(--textSecondary)', fontWeight: '600' },
    fileInput: { position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' },

    btnRow: { display: 'flex', gap: '12px', marginTop: '20px' },
    primaryBtn: { flex: 1, padding: '16px', borderRadius: '16px', border: 'none', background: 'var(--accent)', color: 'white', fontWeight: '900', fontSize: '16px', cursor: 'pointer' },
    secondaryBtn: { padding: '16px 32px', borderRadius: '16px', border: '2px solid var(--border)', background: 'transparent', color: 'var(--text)', fontWeight: '800', cursor: 'pointer' }
};

export default AuditTool;
