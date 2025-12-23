import React, { useState } from 'react';
import { useAudit } from '../context/AuditContext';

const VendorPortal = ({ assets = [], vendors = [] }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const { logAction } = useAudit();

    // File Upload Stub
    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            alert(`📄 Invoice "${file.name}" uploaded successfully! Sent to Finance for processing.`);
            logAction('INVOICE_UPLOAD', `Uploaded invoice: ${file.name}`, 'Admin', 'success');
        }
    };

    const getVendorAssetCount = (vendorName) => {
        return assets.filter(a => a.Vendor_Name === vendorName).length;
    };

    const filteredVendors = vendors.filter(v =>
        v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.type.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <div>
                    <h2 style={styles.title}>Vendor Portal</h2>
                    <p style={styles.subtitle}>Manage external partners and invoices.</p>
                </div>
                <div style={styles.uploadWrapper}>
                    <label htmlFor="invoice-upload" style={styles.uploadBtn}>
                        📤 Upload Invoice
                    </label>
                    <input
                        id="invoice-upload"
                        type="file"
                        style={{ display: 'none' }}
                        onChange={handleFileUpload}
                    />
                </div>
            </div>

            <div style={styles.searchBar}>
                <span style={{ fontSize: '18px' }}>🔍</span>
                <input
                    type="text"
                    placeholder="Search vendors by name or service..."
                    style={styles.searchInput}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div style={styles.grid}>
                {filteredVendors.map(vendor => (
                    <div key={vendor.id} style={styles.card} className="glass-card">
                        <div style={styles.cardHeader}>
                            <span style={styles.typeBadge}>{vendor.type}</span>
                            <div style={styles.rating}>
                                {'⭐'.repeat(Math.floor(vendor.rating))}
                                <span style={{ fontSize: '12px', color: 'var(--textSecondary)', marginLeft: '4px' }}>
                                    ({vendor.rating})
                                </span>
                            </div>
                        </div>
                        <h3 style={styles.vendorName}>{vendor.name}</h3>
                        <div style={styles.contactInfo}>
                            <p>👤 {vendor.contact}</p>
                            <p>📧 <a href={`mailto:${vendor.email}`} style={{ color: 'var(--accent)' }}>{vendor.email}</a></p>
                            <p>📞 {vendor.phone}</p>
                        </div>

                        <div style={styles.divider} />

                        <div style={styles.cardFooter}>
                            <div style={styles.stat}>
                                <span style={styles.statLabel}>Linked Assets</span>
                                <span style={styles.statValue}>{getVendorAssetCount(vendor.name)}</span>
                            </div>
                            <span style={{
                                ...styles.status,
                                color: vendor.status === 'Preferred' ? 'var(--success)' : vendor.status === 'Active' ? 'var(--accent)' : 'var(--warning)'
                            }}>
                                ● {vendor.status}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const styles = {
    container: { padding: '24px', maxWidth: '1400px', margin: '0 auto' },
    header: { marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    title: { fontSize: '28px', fontWeight: '800', marginBottom: '8px' },
    subtitle: { color: 'var(--textSecondary)', fontSize: '14px' },
    uploadBtn: {
        padding: '12px 24px', background: 'var(--accent)', color: 'white',
        border: 'none', borderRadius: '12px', fontWeight: '700', cursor: 'pointer',
        display: 'inline-block'
    },

    searchBar: {
        display: 'flex', alignItems: 'center', gap: '15px', padding: '15px 25px',
        background: 'var(--surface)', borderRadius: '16px', border: '1px solid var(--border)',
        marginBottom: '40px', maxWidth: '600px'
    },
    searchInput: { border: 'none', background: 'transparent', width: '100%', fontSize: '16px', color: 'var(--text)', outline: 'none' },

    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' },
    card: { padding: '24px', borderRadius: '20px', background: 'var(--surface)', border: '1px solid var(--border)' },
    cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' },
    typeBadge: { fontSize: '11px', fontWeight: 'bold', background: 'var(--background)', padding: '4px 10px', borderRadius: '8px', color: 'var(--textSecondary)', textTransform: 'uppercase' },
    rating: { display: 'flex', alignItems: 'center' },
    vendorName: { fontSize: '20px', fontWeight: '800', marginBottom: '16px' },
    contactInfo: { display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px', color: 'var(--textSecondary)' },

    divider: { height: '1px', background: 'var(--border)', margin: '20px 0' },

    cardFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    stat: { display: 'flex', flexDirection: 'column' },
    statLabel: { fontSize: '10px', textTransform: 'uppercase', color: 'var(--textSecondary)', fontWeight: 'bold' },
    statValue: { fontSize: '18px', fontWeight: '900', color: 'var(--text)' },
    status: { fontSize: '12px', fontWeight: '700' }
};

export default VendorPortal;
