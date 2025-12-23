import React, { useState } from 'react';
import { useAudit } from '../context/AuditContext';

const CRMIntegration = () => {
    const [isConnected, setIsConnected] = useState(false);
    const [syncStatus, setSyncStatus] = useState('Idle');
    const [lastSync, setLastSync] = useState(null);
    const { logAction } = useAudit();

    const mockDeals = [
        { id: 'ZC-DL-1001', name: 'Tech Upgrade - Acme Corp', amount: '₹12,50,000', stage: 'Closed Won', linkedAssets: 5 },
        { id: 'ZC-DL-1004', name: 'New Branch Setup - Pune', amount: '₹45,00,000', stage: 'Negotiation', linkedAssets: 12 },
        { id: 'ZC-DL-1009', name: 'Q4 Hardware Refresh', amount: '₹8,00,000', stage: 'Qualification', linkedAssets: 0 },
    ];

    const handleConnect = () => {
        setSyncStatus('Connecting...');
        setTimeout(() => {
            setIsConnected(true);
            setSyncStatus('Connected');
            logAction('CRM_CONNECT', 'Linked account to Zoho CRM', 'Admin', 'success');
        }, 1500);
    };

    const handleSync = () => {
        setSyncStatus('Syncing Assets...');
        setTimeout(() => {
            setSyncStatus('Connected');
            setLastSync(new Date().toLocaleString());
            logAction('CRM_SYNC', 'Synchronized 17 assets with CRM Deals', 'Admin', 'success');
            alert("✅ Sync Complete! Assets updated from Zoho CRM.");
        }, 2000);
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <div>
                    <h2 style={styles.title}>Zoho CRM Integration</h2>
                    <p style={styles.subtitle}>Connect asset inventory with Sales Deals and Accounts.</p>
                </div>
                {!isConnected ? (
                    <button style={styles.connectBtn} onClick={handleConnect}>Connect Zoho CRM</button>
                ) : (
                    <button style={styles.syncBtn} onClick={handleSync}>🔄 Sync Now</button>
                )}
            </div>

            {!isConnected ? (
                <div style={styles.connectState}>
                    <img src="https://upload.wikimedia.org/wikipedia/commons/2/23/Zoho_CRM_Logo.png" alt="Zoho CRM" style={{ height: '80px', marginBottom: '20px' }} />
                    <h3>Connect to your Sales Pipeline</h3>
                    <p style={{ color: 'var(--textSecondary)', maxWidth: '400px' }}>
                        Automatically map assets to Deal requirements and track ROI per client account.
                        Requires Admin API OAuth token.
                    </p>
                </div>
            ) : (
                <div style={styles.dashboard}>
                    <div style={styles.statusCard}>
                        <div style={styles.statRow}>
                            <span>Status:</span>
                            <span style={{ color: '#00b894', fontWeight: 'bold' }}>● Connected</span>
                        </div>
                        <div style={styles.statRow}>
                            <span>Account:</span>
                            <span style={{ fontWeight: 'bold' }}>Bluewud Org (zohocrm.com)</span>
                        </div>
                        <div style={styles.statRow}>
                            <span>Last Sync:</span>
                            <span>{lastSync || 'Never'}</span>
                        </div>
                    </div>

                    <h3 style={{ marginTop: '40px', marginBottom: '20px' }}>Active Deals (Asset Linked)</h3>
                    <div style={styles.dealsGrid}>
                        {mockDeals.map(deal => (
                            <div key={deal.id} style={styles.dealCard} className="glass-card">
                                <div style={styles.dealHeader}>
                                    <span style={styles.dealId}>{deal.id}</span>
                                    <span style={{
                                        ...styles.badge,
                                        background: deal.stage === 'Closed Won' ? 'var(--success)' : 'var(--accent)'
                                    }}>{deal.stage}</span>
                                </div>
                                <h4 style={styles.dealName}>{deal.name}</h4>
                                <div style={styles.dealFooter}>
                                    <span>💰 {deal.amount}</span>
                                    <span>📦 {deal.linkedAssets} Assets</span>
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

    connectBtn: { padding: '12px 24px', background: '#ec4844', color: 'white', border: 'none', borderRadius: '12px', fontWeight: '700', cursor: 'pointer' },
    syncBtn: { padding: '12px 24px', background: 'var(--accent)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: '700', cursor: 'pointer' },

    connectState: { textAlign: 'center', padding: '60px', background: 'var(--surface)', borderRadius: '24px', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', alignItems: 'center' },

    statusCard: { padding: '24px', background: 'var(--surface)', borderRadius: '16px', border: '1px solid var(--border)', maxWidth: '400px' },
    statRow: { display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '14px' },

    dealsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' },
    dealCard: { padding: '24px', borderRadius: '16px', background: 'var(--background)', border: '1px solid var(--border)' },
    dealHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: '16px' },
    dealId: { fontSize: '12px', fontWeight: 'bold', color: 'var(--textSecondary)' },
    badge: { fontSize: '10px', padding: '4px 8px', borderRadius: '8px', color: 'white', fontWeight: 'bold' },
    dealName: { fontSize: '18px', fontWeight: '800', marginBottom: '20px' },
    dealFooter: { display: 'flex', justifyContent: 'space-between', fontSize: '14px', fontWeight: '600', color: 'var(--textSecondary)' }
};

export default CRMIntegration;
