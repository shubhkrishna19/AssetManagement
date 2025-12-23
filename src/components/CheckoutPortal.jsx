import React, { useState } from 'react';
import { mockAssets } from '../mockData';

const CheckoutPortal = ({ assets = [], updateAsset }) => {
    const [form, setForm] = useState({ assetId: '', user: '', action: 'Check-Out', notes: '', dueDate: '' });
    const [recentTransactions, setRecentTransactions] = useState([
        { id: 'TX-101', asset: 'BW-IT-001', user: 'Aditi Tyagi', action: 'Check-Out', time: '10:00 AM', status: 'Active' },
        { id: 'TX-102', asset: 'BW-IT-004', user: 'Vikas Raghav', action: 'Check-In', time: '09:30 AM', status: 'Completed' },
    ]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const asset = assets.find(a => a.Asset_ID === form.assetId);

        if (asset) {
            const isCheckingOut = form.action === 'Check-Out';
            updateAsset(asset.Asset_ID, {
                Status: isCheckingOut ? 'In Use' : 'Available',
                Assigned_User: isCheckingOut ? { display_value: form.user } : null,
                Due_Date: isCheckingOut ? form.dueDate : null
            });
        }

        const newTx = {
            id: `TX-${Math.floor(Math.random() * 900) + 100}`,
            asset: form.assetId,
            user: form.user,
            action: form.action,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            status: form.action === 'Check-Out' ? 'Active' : 'Completed'
        };

        setRecentTransactions([newTx, ...recentTransactions]);
        setForm({ assetId: '', user: '', action: 'Check-Out', notes: '', dueDate: '' });

        // Alert logic placeholder
        console.log(`📡 Transaction Logged: ${form.action} for ${form.assetId}`);
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>🔄 Transaction Center</h2>
            <p style={styles.subtitle}>Manage asset ownership transitions and track custodial responsibility.</p>

            <div style={styles.content}>
                {/* ACTION FORM */}
                <div style={styles.formCard}>
                    <div style={styles.tabHeader}>
                        <div
                            onClick={() => setForm({ ...form, action: 'Check-Out' })}
                            style={{ ...styles.tab, borderBottomColor: form.action === 'Check-Out' ? 'var(--accent)' : 'transparent', color: form.action === 'Check-Out' ? 'var(--accent)' : 'var(--textSecondary)' }}
                        >
                            📤 Check-Out
                        </div>
                        <div
                            onClick={() => setForm({ ...form, action: 'Check-In' })}
                            style={{ ...styles.tab, borderBottomColor: form.action === 'Check-In' ? 'var(--accent)' : 'transparent', color: form.action === 'Check-In' ? 'var(--accent)' : 'var(--textSecondary)' }}
                        >
                            📥 Check-In
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} style={styles.form}>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Asset ID / Tag</label>
                            <input
                                style={styles.input}
                                list="asset-list"
                                placeholder="Scan or type ID..."
                                value={form.assetId}
                                onChange={(e) => setForm({ ...form, assetId: e.target.value })}
                                required
                            />
                            <datalist id="asset-list">
                                {assets.map(a => <option key={a.Asset_ID} value={a.Asset_ID}>{a.Item_Name}</option>)}
                            </datalist>
                        </div>

                        <div style={styles.inputGroup}>
                            <label style={styles.label}>{form.action === 'Check-Out' ? 'Assign To' : 'Returned By'}</label>
                            <input
                                style={styles.input}
                                placeholder="Employee name or department"
                                value={form.user}
                                onChange={(e) => setForm({ ...form, user: e.target.value })}
                                required
                            />
                        </div>

                        {form.action === 'Check-Out' && (
                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Expected Return Date</label>
                                <input
                                    type="date"
                                    style={styles.input}
                                    value={form.dueDate}
                                    onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                                />
                            </div>
                        )}

                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Condition Notes</label>
                            <textarea
                                style={{ ...styles.input, height: '80px', resize: 'none' }}
                                placeholder="e.g., Screen scratch, Battery health 85%..."
                                value={form.notes}
                                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                            />
                        </div>

                        <button type="submit" style={{ ...styles.submitBtn, background: form.action === 'Check-Out' ? 'var(--accent)' : '#00b894' }}>
                            Complete {form.action}
                        </button>
                    </form>
                </div>

                {/* RECENT FEED */}
                <div style={styles.feedCard}>
                    <h3 style={styles.feedTitle}>Session Activity</h3>
                    <div style={styles.feedList}>
                        {recentTransactions.map(tx => (
                            <div key={tx.id} style={styles.txItem}>
                                <div style={styles.txIcon}>{tx.action === 'Check-Out' ? '📤' : '📥'}</div>
                                <div style={styles.txDetails}>
                                    <div style={styles.txTop}>
                                        <span style={styles.txAsset}>{tx.asset}</span>
                                        <span style={styles.txTime}>{tx.time}</span>
                                    </div>
                                    <div style={styles.txUser}>{tx.user}</div>
                                    <div style={styles.txMeta}>
                                        <span style={styles.txId}>{tx.id}</span>
                                        <span style={{ ...styles.txStatus, color: tx.status === 'Active' ? 'var(--accent)' : '#10b981' }}>
                                            ● {tx.status}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: { padding: '24px', maxWidth: '1400px', margin: '0 auto' },
    title: { fontSize: '28px', fontWeight: '800', marginBottom: '8px', color: 'var(--text)' },
    subtitle: { fontSize: '14px', color: 'var(--textSecondary)', marginBottom: '32px' },
    content: { display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '32px', alignItems: 'start' },

    formCard: { background: 'var(--surface)', borderRadius: '24px', border: '1px solid var(--border)', boxShadow: 'var(--shadow)', overflow: 'hidden' },
    tabHeader: { display: 'flex', borderBottom: '1px solid var(--border)', background: 'var(--background)' },
    tab: { flex: 1, padding: '16px', textAlign: 'center', cursor: 'pointer', fontWeight: '700', fontSize: '14px', borderBottom: '2px solid transparent', transition: '0.2s' },

    form: { padding: '32px', display: 'flex', flexDirection: 'column', gap: '20px' },
    inputGroup: { display: 'flex', flexDirection: 'column', gap: '8px' },
    label: { fontSize: '13px', fontWeight: '600', color: 'var(--textSecondary)' },
    input: { padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--background)', color: 'var(--text)', outline: 'none', fontSize: '14px' },
    submitBtn: { padding: '16px', borderRadius: '12px', border: 'none', color: 'white', fontWeight: '700', cursor: 'pointer', marginTop: '10px' },

    feedCard: { background: 'var(--surface)', padding: '32px', borderRadius: '24px', border: '1px solid var(--border)', boxShadow: 'var(--shadow)' },
    feedTitle: { fontSize: '18px', fontWeight: '700', color: 'var(--text)', marginBottom: '24px' },
    feedList: { display: 'flex', flexDirection: 'column', gap: '16px' },
    txItem: { display: 'flex', gap: '16px', padding: '16px', borderRadius: '16px', border: '1px solid var(--border)', background: 'var(--background)' },
    txIcon: { fontSize: '24px', background: 'var(--surface)', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    txDetails: { flex: 1 },
    txTop: { display: 'flex', justifyContent: 'space-between', marginBottom: '4px' },
    txAsset: { fontSize: '14px', fontWeight: '800', color: 'var(--text)' },
    txTime: { fontSize: '11px', color: 'var(--textSecondary)' },
    txUser: { fontSize: '13px', color: 'var(--textSecondary)', marginBottom: '8px' },
    txMeta: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    txId: { fontSize: '10px', color: 'var(--textSecondary)', fontWeight: '700' },
    txStatus: { fontSize: '10px', fontWeight: '900', textTransform: 'uppercase' },
};

export default CheckoutPortal;
