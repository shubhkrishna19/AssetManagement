import React, { useState, useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { mockAssets } from '../mockData';

const AuditTool = () => {
    const [lastScanned, setLastScanned] = useState(null);
    const [auditStats, setAuditStats] = useState({ verified: 0, total: mockAssets.length });
    const [isScanning, setIsScanning] = useState(false);
    const [verifiedList, setVerifiedList] = useState([]);

    useEffect(() => {
        if (isScanning) {
            const scanner = new Html5QrcodeScanner("audit-reader", {
                fps: 10,
                qrbox: { width: 250, height: 250 },
                aspectRatio: 1.0
            });

            scanner.render((result) => {
                handleScan(result);
                // We don't stop the scanner in audit mode to allow bulk verification
            }, (error) => { });

            return () => scanner.clear();
        }
    }, [isScanning]);

    const handleScan = (assetId) => {
        const asset = mockAssets.find(a => a.Asset_ID === assetId || a.Item_Name === assetId);

        if (asset) {
            if (!verifiedList.includes(asset.Asset_ID)) {
                setVerifiedList(prev => [asset.Asset_ID, ...prev]);
                setAuditStats(prev => ({ ...prev, verified: prev.verified + 1 }));
                setLastScanned({ ...asset, status: 'Verified' });

                // Play success sound logic placeholder
                console.log(`✅ Audit Verified: ${asset.Item_Name}`);
            }
        } else {
            setLastScanned({ id: assetId, status: 'Unknown Asset', error: true });
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <div>
                    <h2 style={styles.title}>🛡️ Physical Audit Mode</h2>
                    <p style={styles.subtitle}>Scan asset tags to verify physical presence and reconcile inventory.</p>
                </div>
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
            </div>

            <div style={styles.auditLayout}>
                {/* SCANNER SECTION */}
                <div style={styles.scannerCol}>
                    {!isScanning ? (
                        <div style={styles.startHero} onClick={() => setIsScanning(true)}>
                            <span style={styles.heroIcon}>📷</span>
                            <h3>Start Physical Audit</h3>
                            <p>Activate camera to begin batch verification</p>
                            <button style={styles.startBtn}>Enable Scanner</button>
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
                                    {lastScanned.error ? 'Tag not found in database' : `Verified at ${new Date().toLocaleTimeString()}`}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* FEED SECTION */}
                <div style={styles.feedCol}>
                    <h3 style={styles.feedTitle}>Session Verification Log</h3>
                    <div style={styles.feedList}>
                        {verifiedList.length === 0 ? (
                            <div style={styles.emptyFeed}>No scans yet this session...</div>
                        ) : (
                            verifiedList.map(id => {
                                const asset = mockAssets.find(a => a.Asset_ID === id);
                                return (
                                    <div key={id} style={styles.feedItem}>
                                        <div style={styles.feedItemTop}>
                                            <span style={styles.feedItemName}>{asset?.Item_Name}</span>
                                            <span style={styles.feedItemId}>{id}</span>
                                        </div>
                                        <div style={styles.feedItemMeta}>
                                            <span>📍 {asset?.Location}</span>
                                            <span style={styles.verifiedTag}>PHYSICALLY SEEN</span>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: { padding: '24px', maxWidth: '1400px', margin: '0 auto' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px', gap: '24px' },
    title: { fontSize: '28px', fontWeight: '800', marginBottom: '8px', color: 'var(--text)' },
    subtitle: { fontSize: '14px', color: 'var(--textSecondary)', maxWidth: '500px' },
    statsCard: { background: 'var(--surface)', padding: '20px', borderRadius: '20px', border: '1px solid var(--border)', minWidth: '280px', boxShadow: 'var(--shadow)' },
    statLine: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' },
    statLabel: { fontSize: '12px', fontWeight: '700', color: 'var(--textSecondary)', textTransform: 'uppercase' },
    statValue: { fontSize: '24px', fontWeight: '900', color: 'var(--accent)' },
    progressBar: { height: '8px', background: 'var(--background)', borderRadius: '4px', overflow: 'hidden', marginBottom: '8px' },
    progressFill: { height: '100%', background: 'var(--accent)', transition: 'width 0.5s ease' },
    statSub: { fontSize: '11px', color: 'var(--textSecondary)', fontWeight: '600' },

    auditLayout: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' },

    scannerCol: { display: 'flex', flexDirection: 'column', gap: '24px' },
    startHero: { background: 'var(--surface)', border: '2px dashed var(--border)', borderRadius: '32px', padding: '60px 40px', textAlign: 'center', cursor: 'pointer', transition: '0.2s' },
    heroIcon: { fontSize: '48px', display: 'block', marginBottom: '20px' },
    startBtn: { marginTop: '20px', padding: '12px 32px', borderRadius: '12px', border: 'none', background: 'var(--accent)', color: 'white', fontWeight: '700', cursor: 'pointer' },

    activeScannerCard: { background: 'var(--surface)', borderRadius: '32px', overflow: 'hidden', border: '1px solid var(--border)', boxShadow: 'var(--shadow)' },
    reader: { width: '100%', border: 'none' },
    stopBtn: { width: '100%', padding: '16px', border: 'none', background: 'var(--danger)', color: 'white', fontWeight: '700', cursor: 'pointer' },

    scanResult: { display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 24px', borderRadius: '20px', border: '1px solid', animation: 'slideIn 0.3s ease' },
    resultIcon: { fontSize: '24px' },
    resultTitle: { fontSize: '16px', fontWeight: '800', color: 'var(--text)' },
    resultSub: { fontSize: '12px', color: 'var(--textSecondary)' },

    feedCol: { background: 'var(--surface)', borderRadius: '32px', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: 'var(--shadow)' },
    feedTitle: { padding: '24px', borderBottom: '1px solid var(--border)', fontSize: '16px', fontWeight: '800', color: 'var(--text)' },
    feedList: { flex: 1, padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '600px' },
    emptyFeed: { textAlign: 'center', color: 'var(--textSecondary)', padding: '40px', fontSize: '14px' },
    feedItem: { padding: '16px', borderRadius: '16px', background: 'var(--background)', border: '1px solid var(--border)' },
    feedItemTop: { display: 'flex', justifyContent: 'space-between', marginBottom: '4px' },
    feedItemName: { fontSize: '14px', fontWeight: '700', color: 'var(--text)' },
    feedItemId: { fontSize: '10px', fontWeight: '800', color: 'var(--textSecondary)' },
    feedItemMeta: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    verifiedTag: { fontSize: '9px', fontWeight: '900', color: '#10b981', background: '#dcfce7', padding: '2px 8px', borderRadius: '6px' },
};

export default AuditTool;
