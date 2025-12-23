import React, { useState } from 'react';
import { useAudit } from '../context/AuditContext';

const CRMIntegration = () => {
    const [isConnected, setIsConnected] = useState(false);
    const [syncStatus, setSyncStatus] = useState('Idle');
    const [lastSync, setLastSync] = useState(null);
    const { logAction } = useAudit();

    const mockDepartments = [
        { id: 'DEPT-IT', name: 'IT Department', budget: '₹45,00,000', status: 'Active', linkedAssets: 32 },
        { id: 'DEPT-HR', name: 'Human Resources', budget: '₹12,50,000', status: 'Active', linkedAssets: 8 },
        { id: 'DEPT-OPS', name: 'Operations & Logistics', budget: '₹68,00,000', status: 'Active', linkedAssets: 45 },
        { id: 'DEPT-MFG', name: 'Manufacturing Unit', budget: '₹1,25,00,000', status: 'Active', linkedAssets: 78 },
    ];

    const handleConnect = () => {
        setSyncStatus('Connecting...');
        setTimeout(() => {
            setIsConnected(true);
            setSyncStatus('Connected');
            logAction('ZOHO_CONNECT', 'Linked account to Zoho Ecosystem', 'Admin', 'success');
        }, 1500);
    };

    const handleSync = () => {
        setSyncStatus('Syncing Assets...');
        setTimeout(() => {
            setSyncStatus('Connected');
            setLastSync(new Date().toLocaleString());
            logAction('ZOHO_SYNC', 'Synchronized 163 assets with Zoho DataStore', 'Admin', 'success');
            alert("✅ Sync Complete! Assets synchronized with Zoho Cloud.");
        }, 2000);
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <div>
                    <h2 style={styles.title}>Zoho Integration</h2>
                    <p style={styles.subtitle}>Connect and sync company assets with Zoho Cloud ecosystem.</p>
                </div>
                {!isConnected ? (
                    <button style={styles.connectBtn} onClick={handleConnect}>Connect Zoho</button>
                ) : (
                    <button style={styles.syncBtn} onClick={handleSync}>🔄 Sync Now</button>
                )}
            </div>

            {!isConnected ? (
                <div style={styles.connectState}>
                    <div style={styles.zohoLogo}>
                        <span style={{ fontSize: '48px' }}>🔗</span>
                    </div>
                    <h3 style={{ marginBottom: '12px' }}>Connect to Zoho Cloud</h3>
                    <p style={{ color: 'var(--textSecondary)', maxWidth: '450px', lineHeight: '1.6' }}>
                        Integrate your company asset inventory with Zoho's powerful cloud platform.
                        Sync assets across departments, track allocation by cost centers, and generate
                        comprehensive reports for management.
                    </p>
                    <div style={styles.features}>
                        <div style={styles.feature}>📊 Real-time Dashboard Sync</div>
                        <div style={styles.feature}>🏢 Department-wise Allocation</div>
                        <div style={styles.feature}>📈 Automated Reporting</div>
                        <div style={styles.feature}>🔒 Enterprise Security</div>
                    </div>
                </div>
            ) : (
                <div style={styles.dashboard}>
                    <div style={styles.statusCard}>
                        <div style={styles.statRow}>
                            <span>Status:</span>
                            <span style={{ color: '#00b894', fontWeight: 'bold' }}>● Connected</span>
                        </div>
                        <div style={styles.statRow}>
                            <span>Organization:</span>
                            <span style={{ fontWeight: 'bold' }}>Bluewud Industries Pvt Ltd</span>
                        </div>
                        <div style={styles.statRow}>
                            <span>Zoho Portal:</span>
                            <span>catalyst.zoho.com</span>
                        </div>
                        <div style={styles.statRow}>
                            <span>Last Sync:</span>
                            <span>{lastSync || 'Never'}</span>
                        </div>
                    </div>

                    <h3 style={{ marginTop: '40px', marginBottom: '20px' }}>Department Asset Allocation</h3>
                    <div style={styles.dealsGrid}>
                        {mockDepartments.map(dept => (
                            <div key={dept.id} style={styles.dealCard} className="glass-card">
                                <div style={styles.dealHeader}>
                                    <span style={styles.dealId}>{dept.id}</span>
                                    <span style={{
                                        ...styles.badge,
                                        background: 'var(--success)'
                                    }}>{dept.status}</span>
                                </div>
                                <h4 style={styles.dealName}>{dept.name}</h4>
                                <div style={styles.dealFooter}>
                                    <span>💰 Budget: {dept.budget}</span>
                                    <span>📦 {dept.linkedAssets} Assets</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

const styles = {
    container: { padding: '30px', maxWidth: '1200px', margin: '0 auto' },
    header: { marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    title: { fontSize: '28px', fontWeight: '800', marginBottom: '8px' },
    subtitle: { color: 'var(--textSecondary)', fontSize: '14px' },

    connectBtn: { padding: '12px 24px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: '700', cursor: 'pointer' },
    syncBtn: { padding: '12px 24px', background: 'var(--accent)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: '700', cursor: 'pointer' },

    connectState: { textAlign: 'center', padding: '60px', background: 'var(--surface)', borderRadius: '24px', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', alignItems: 'center' },

    zohoLogo: { width: '100px', height: '100px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' },

    features: { display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '30px', justifyContent: 'center' },
    feature: { padding: '10px 16px', background: 'var(--background)', borderRadius: '10px', fontSize: '13px', fontWeight: '600', border: '1px solid var(--border)' },

    statusCard: { padding: '24px', background: 'var(--surface)', borderRadius: '16px', border: '1px solid var(--border)', maxWidth: '400px' },
    statRow: { display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '14px' },

    dealsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' },
    dealCard: { padding: '24px', borderRadius: '16px', background: 'var(--background)', border: '1px solid var(--border)' },
    dealHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: '16px' },
    dealId: { fontSize: '12px', fontWeight: 'bold', color: 'var(--textSecondary)' },
    badge: { fontSize: '10px', padding: '4px 8px', borderRadius: '8px', color: 'white', fontWeight: 'bold' },
    dealName: { fontSize: '18px', fontWeight: '800', marginBottom: '20px' },
    dealFooter: { display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: '600', color: 'var(--textSecondary)' }
};

export default CRMIntegration;
