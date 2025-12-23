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

        // COMPLETED (Asset Tiger Parity Sprint)
        { id: 13, title: 'Contracts & Warranties', status: 'Completed', category: 'Finance', description: 'Track expiration dates with email alerts.' },
        { id: 14, title: 'E-Signatures', status: 'Completed', category: 'Compliance', description: 'Digital signatures for asset checkout/checkin.' },
        { id: 15, title: 'Asset Reservations', status: 'Completed', category: 'Ops', description: 'Calendar-based booking system for shared assets.' },
        { id: 16, title: 'Consumables Tracking', status: 'Completed', category: 'Inventory', description: 'Quantity tracking for ink, paper, parts.' },
        { id: 17, title: 'Vendor Portal', status: 'Completed', category: 'Ext', description: 'Allow vendors to upload invoices directly.' },
        { id: 19, title: 'Barcode Generation', status: 'Completed', category: 'Ops', description: 'Generate and print QR/Barcodes for assets.' },

        // IN PROGRESS (Integrations)
        { id: 18, title: 'Zoho CRM Integration', status: 'In Progress', category: 'Integrations', description: 'Sync assets with CRM Accounts/Deals.' },
        { id: 20, title: 'PWA Mobile App', status: 'In Progress', category: 'Platform', description: 'Installable App functionality.' },
    ];

    const columns = [
        { id: 'Completed', label: '✅ Completed', color: 'var(--success)' },
        { id: 'In Progress', label: '🚧 In Progress', color: 'var(--accent)' },
        { id: 'Planned', label: '📋 Planned', color: 'var(--textSecondary)' },
    ];

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h2 style={styles.title}>🚀 Project Roadmap</h2>
                <p style={styles.subtitle}>Real-time tracking of Application Development Status</p>
            </div>

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
    container: { padding: '40px', maxWidth: '1600px', margin: '0 auto', minHeight: '100%' },
    header: { marginBottom: '40px', textAlign: 'center' },
    title: { fontSize: '32px', fontWeight: '800', marginBottom: '12px', color: 'var(--text)' },
    subtitle: { fontSize: '16px', color: 'var(--textSecondary)' },
    board: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px', alignItems: 'start' },
    column: { background: 'var(--surface)', borderRadius: '24px', padding: '24px', border: '1px solid var(--border)', boxShadow: 'var(--shadow)' },
    columnHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '20px', marginBottom: '20px' },
    columnTitle: { fontSize: '18px', fontWeight: '800', color: 'var(--text)' },
    countBadge: { background: 'var(--background)', color: 'var(--text)', padding: '6px 12px', borderRadius: '12px', fontSize: '13px', fontWeight: '700' },
    cardList: { display: 'flex', flexDirection: 'column', gap: '20px' },
    card: { padding: '20px', borderRadius: '20px', border: '1px solid var(--border)', background: 'var(--background)' },
    cardHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: '10px' },
    category: { fontSize: '11px', textTransform: 'uppercase', fontWeight: '700', color: 'var(--textSecondary)', letterSpacing: '0.05em' },
    cardTitle: { fontSize: '16px', fontWeight: '700', marginBottom: '8px', color: 'var(--text)' },
    cardDesc: { fontSize: '13px', color: 'var(--textSecondary)', lineHeight: '1.6' },
    pulse: { color: 'var(--accent)', animation: 'pulse 1.5s infinite' },
};

export default Roadmap;
