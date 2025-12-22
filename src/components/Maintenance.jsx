import React, { useState } from 'react';

const Maintenance = () => {
    const [requests, setRequests] = useState([
        { id: 'MR-001', asset: 'Dell Latitude 5520', issue: 'Battery draining fast', priority: 'High', status: 'In Progress', date: '2025-12-18', cost: 3500 },
        { id: 'MR-002', asset: 'HP LaserJet Pro', issue: 'Paper jam in tray 2', priority: 'Medium', status: 'Completed', date: '2025-12-15', cost: 1200 },
    ]);

    const [formData, setFormData] = useState({ asset: '', issue: '', priority: 'Medium', cost: '' });

    const handleSubmit = (e) => {
        e.preventDefault();
        const newRequest = {
            id: `MR-00${requests.length + 1}`,
            asset: formData.asset,
            issue: formData.issue,
            priority: formData.priority,
            status: 'Pending',
            date: new Date().toISOString().split('T')[0],
            cost: Number(formData.cost) || 0
        };
        setRequests([newRequest, ...requests]);
        setFormData({ asset: '', issue: '', priority: 'Medium', cost: '' });
    };

    const totalCost = requests.reduce((sum, req) => sum + (req.cost || 0), 0);
    const pendingCount = requests.filter(r => r.status !== 'Completed' && r.status !== 'Scrapped').length;

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>🔧 Maintenance Portal</h2>
            <p style={styles.subtitle}>Report issues and track asset health</p>

            {/* DASHBOARD SUMMARY */}
            <div style={styles.summaryRow}>
                <div style={styles.summaryCard}>
                    <div style={styles.summaryLabel}>Total Maintenance Cost</div>
                    <div style={styles.summaryValue}>₹{totalCost.toLocaleString()}</div>
                </div>
                <div style={styles.summaryCard}>
                    <div style={styles.summaryLabel}>Active Requests</div>
                    <div style={styles.summaryValue}>{pendingCount}</div>
                </div>
                <div style={styles.summaryCard}>
                    <div style={styles.summaryLabel}>AVG Turnaround</div>
                    <div style={styles.summaryValue}>2.4 Days</div>
                </div>
            </div>

            <div style={styles.content}>
                {/* Form Section */}
                <div style={styles.formCard}>
                    <h3 style={styles.sectionTitle}>Report New Issue</h3>
                    <form onSubmit={handleSubmit} style={styles.form}>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Select Asset</label>
                            <input
                                style={styles.input}
                                value={formData.asset}
                                onChange={(e) => setFormData({ ...formData, asset: e.target.value })}
                                placeholder="e.g., BW-IT-001 or Dell Latitude"
                                required
                            />
                        </div>
                        <div style={styles.row}>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Priority</label>
                                <select
                                    style={styles.input}
                                    value={formData.priority}
                                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                                >
                                    <option value="Low">Low</option>
                                    <option value="Medium">Medium</option>
                                    <option value="High">High</option>
                                    <option value="Critical">Critical</option>
                                </select>
                            </div>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Est. Cost (₹)</label>
                                <input
                                    type="number"
                                    style={styles.input}
                                    value={formData.cost}
                                    onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                                    placeholder="0"
                                />
                            </div>
                        </div>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Issue Description</label>
                            <textarea
                                style={{ ...styles.input, height: '100px', resize: 'none' }}
                                value={formData.issue}
                                onChange={(e) => setFormData({ ...formData, issue: e.target.value })}
                                placeholder="Describe the problem in detail..."
                                required
                            />
                        </div>

                        {/* PHOTO UPLOAD PLACEHOLDER */}
                        <div style={styles.uploadBox}>
                            <span style={{ fontSize: '24px' }}>📷</span>
                            <span style={{ fontSize: '12px', color: 'var(--textSecondary)', fontWeight: '600' }}>Attach Photo (Optional)</span>
                        </div>

                        <button type="submit" style={styles.submitBtn}>Submit Request</button>
                    </form>
                </div>

                {/* List Section */}
                <div style={styles.listCard}>
                    <h3 style={styles.sectionTitle}>Maintenance History</h3>
                    <div style={styles.historyList}>
                        {requests.map(req => (
                            <div key={req.id} style={styles.historyItem}>
                                <div style={styles.itemHeader}>
                                    <span style={styles.itemId}>{req.id}</span>
                                    <StatusBadge status={req.status} />
                                </div>
                                <div style={styles.itemBody}>
                                    <div style={styles.itemAsset}>{req.asset}</div>
                                    <div style={styles.itemIssue}>{req.issue}</div>
                                </div>
                                <div style={styles.itemFooter}>
                                    <span style={styles.itemPriority}>Priority: {req.priority}</span>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontWeight: '700', color: 'var(--text)' }}>₹{req.cost ? req.cost.toLocaleString() : '0'}</div>
                                        <div style={styles.itemDate}>{req.date}</div>
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

const StatusBadge = ({ status }) => {
    const colors = {
        'In Progress': { bg: '#e0f2fe', text: '#0369a1' },
        'Completed': { bg: '#dcfce7', text: '#15803d' },
        'Pending': { bg: '#fef3c7', text: '#92400e' },
        'Scrapped': { bg: '#fee2e2', text: '#b91c1c' }
    }[status] || { bg: '#f1f5f9', text: '#475569' };

    return (
        <span style={{
            padding: '4px 10px',
            borderRadius: '12px',
            fontSize: '11px',
            fontWeight: '700',
            background: colors.bg,
            color: colors.text
        }}>
            {status}
        </span>
    );
};

const styles = {
    container: { padding: '24px', maxWidth: '1400px', margin: '0 auto' },
    title: { fontSize: '28px', fontWeight: '800', marginBottom: '8px', color: 'var(--text)' },
    subtitle: { fontSize: '14px', color: 'var(--textSecondary)', marginBottom: '32px' },

    summaryRow: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '32px' },
    summaryCard: { background: 'var(--surface)', padding: '20px', borderRadius: '20px', border: '1px solid var(--border)', boxShadow: 'var(--shadow)' },
    summaryLabel: { fontSize: '12px', fontWeight: '700', color: 'var(--textSecondary)', textTransform: 'uppercase', marginBottom: '8px' },
    summaryValue: { fontSize: '24px', fontWeight: '900', color: 'var(--accent)' },

    content: { display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '24px', alignItems: 'start' },
    formCard: { background: 'var(--surface)', padding: '24px', borderRadius: '24px', border: '1px solid var(--border)', boxShadow: 'var(--shadow)' },
    listCard: { background: 'var(--surface)', padding: '24px', borderRadius: '24px', border: '1px solid var(--border)', boxShadow: 'var(--shadow)' },
    sectionTitle: { fontSize: '18px', fontWeight: '700', color: 'var(--text)', marginBottom: '20px' },
    form: { display: 'flex', flexDirection: 'column', gap: '16px' },
    row: { display: 'flex', gap: '16px' },
    formGroup: { display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 },
    label: { fontSize: '13px', fontWeight: '600', color: 'var(--textSecondary)' },
    input: { padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--background)', color: 'var(--text)', outline: 'none' },

    uploadBox: { border: '2px dashed var(--border)', borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', gap: '8px', transition: '0.2s', background: 'var(--background)' },

    submitBtn: { padding: '14px', borderRadius: '12px', border: 'none', background: 'var(--accent)', color: 'white', fontWeight: '700', cursor: 'pointer', marginTop: '10px' },
    historyList: { display: 'flex', flexDirection: 'column', gap: '12px' },
    historyItem: { padding: '16px', borderRadius: '16px', border: '1px solid var(--border)', background: 'var(--background)' },
    itemHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: '8px' },
    itemId: { fontSize: '12px', fontWeight: '800', color: 'var(--textSecondary)' },
    itemBody: { marginBottom: '12px' },
    itemAsset: { fontSize: '15px', fontWeight: '700', color: 'var(--text)', marginBottom: '4px' },
    itemIssue: { fontSize: '13px', color: 'var(--textSecondary)' },
    itemFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', fontSize: '12px', color: 'var(--textSecondary)', fontWeight: '500' },
};

export default Maintenance;
