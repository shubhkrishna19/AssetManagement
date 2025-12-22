import React from 'react';

const Roadmap = () => {
    const features = [
        // COMPLETED (Presentation Sprint)
        { id: 1, title: 'Bulk Operations Engine', status: 'Completed', category: 'Core', description: 'Multi-select, bulk status update, bulk delete.' },
        { id: 2, title: 'Depreciation Estimator', status: 'Completed', category: 'Finance', description: 'Real-time book value calculation & display.' },
        { id: 3, title: 'Analytics Dashboard', status: 'Completed', category: 'Analytics', description: 'Charts for Portfolio, Health, Trends.' },
        { id: 4, title: 'Reports Center', status: 'Completed', category: 'Reporting', description: 'Inventory, Depreciation, Maintenance reports with CSV export.' },
        { id: 5, title: 'Maintenance Portal', status: 'Completed', category: 'Ops', description: 'Issue tracking, cost dashboard, history log.' },
        { id: 6, title: 'Dark/Light Mode', status: 'Completed', category: 'UI/UX', description: 'System-wide glassmorphism theme support.' },
        { id: 7, title: 'Universal Sync Engine', status: 'Completed', category: 'Backend', description: 'Hybrid connection (Local/Live) to Zoho Creator.' },
        { id: 8, title: 'Data Importer', status: 'Completed', category: 'Data', description: 'Bulk CSV/Excel upload with field mapping.' },
        { id: 9, title: 'SEO & Metadata', status: 'Completed', category: 'Config', description: 'Meta tags, title optimization for search engines.' },

        // IN PROGRESS (Security Sprint)
        { id: 10, title: 'User Role Management', status: 'In Progress', category: 'Security', description: 'Admin vs Viewer roles and permissions.' },

        // PLANNED
        { id: 12, title: 'Audit Trail Logs', status: 'Planned', category: 'Compliance', description: 'Immutable history of all asset changes.' },
        { id: 11, title: 'Mobile App (PWA)', status: 'Planned', category: 'Platform', description: 'Installable PWA for field audits.' },
        { id: 13, title: 'Barcode Generation', status: 'Planned', category: 'Ops', description: 'Generate and print QR/Barcodes for assets.' },
        { id: 14, title: 'Zoho CRM Integration', status: 'Planned', category: 'Integrations', description: 'Sync assets with CRM Accounts/Deals.' },
        { id: 15, title: 'Email Notifications', status: 'Planned', category: 'Ops', description: 'Alerts for maintenance due or low stock.' },
        { id: 16, title: 'Vendor Portal', status: 'Planned', category: 'Ext', description: 'Allow vendors to upload invoices directly.' },
    ];

    const columns = [
        { id: 'Completed', label: '✅ Completed', color: 'var(--success)' },
        { id: 'In Progress', label: '🚧 In Progress', color: 'var(--accent)' },
        { id: 'Planned', label: '📋 Planned', color: 'var(--textSecondary)' },
    ];

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>🚀 Project Roadmap</h2>
            <p style={styles.subtitle}>Real-time tracking of Application Development Status</p>

            <div style={styles.board}>
                {columns.map(col => (
                    <div key={col.id} style={styles.column}>
                        <div style={{ ...styles.columnHeader, borderBottom: `3px solid ${col.color}` }}>
                            <span style={styles.columnTitle}>{col.label}</span>
                            <span style={styles.countBadge}>
                                {features.filter(f => f.status === col.id).length}
                            </span>
                        </div>
                        <div style={styles.cardList}>
                            {features.filter(f => f.status === col.id).map(feature => (
                                <div key={feature.id} style={styles.card} className="glass-card">
                                    <div style={styles.cardHeader}>
                                        <span style={styles.category}>{feature.category}</span>
                                        {feature.status === 'In Progress' && <span style={styles.pulse}>●</span>}
                                    </div>
                                    <h4 style={styles.cardTitle}>{feature.title}</h4>
                                    <p style={styles.cardDesc}>{feature.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const styles = {
    container: { padding: '24px', maxWidth: '1600px', margin: '0 auto', height: 'calc(100vh - 100px)', display: 'flex', flexDirection: 'column' },
    title: { fontSize: '28px', fontWeight: '800', marginBottom: '8px', color: 'var(--text)' },
    subtitle: { fontSize: '14px', color: 'var(--textSecondary)', marginBottom: '32px' },
    board: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', flex: 1, overflow: 'hidden' },
    column: { background: 'var(--surface)', borderRadius: '24px', padding: '20px', display: 'flex', flexDirection: 'column', border: '1px solid var(--border)', boxShadow: 'var(--shadow)' },
    columnHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '16px', marginBottom: '16px' },
    columnTitle: { fontSize: '16px', fontWeight: '800', color: 'var(--text)' },
    countBadge: { background: 'var(--background)', color: 'var(--text)', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: '700' },
    cardList: { overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px', paddingRight: '4px' },
    card: { padding: '16px', borderRadius: '16px', border: '1px solid var(--border)', background: 'var(--background)' },
    cardHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: '8px' },
    category: { fontSize: '10px', textTransform: 'uppercase', fontWeight: '700', color: 'var(--textSecondary)', letterSpacing: '0.05em' },
    cardTitle: { fontSize: '15px', fontWeight: '700', marginBottom: '6px', color: 'var(--text)' },
    cardDesc: { fontSize: '12px', color: 'var(--textSecondary)', lineHeight: '1.5' },
    pulse: { color: 'var(--accent)', animation: 'pulse 1.5s infinite' },
};

export default Roadmap;
