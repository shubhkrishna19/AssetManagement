import React, { useState, useMemo } from 'react';
import { useUser } from '../context/UserContext';

const Contracts = ({ assets = [] }) => {
    const [filter, setFilter] = useState('all'); // 'all', 'active', 'expiring', 'expired'
    const { hasPermission } = useUser();

    const getStatus = (dateString) => {
        if (!dateString) return 'none';
        const today = new Date();
        const expiry = new Date(dateString);
        const diffDays = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));

        if (diffDays < 0) return 'expired';
        if (diffDays <= 30) return 'expiring';
        return 'active';
    };

    const processedAssets = useMemo(() => {
        return assets.filter(a => a.Contract_End_Date || a.Warranty_Expiry).map(asset => {
            const contractStatus = getStatus(asset.Contract_End_Date);
            const warrantyStatus = getStatus(asset.Warranty_Expiry);

            // Determine overall worst status for filtering
            let overallStatus = 'active';
            if (contractStatus === 'expired' || warrantyStatus === 'expired') overallStatus = 'expired';
            else if (contractStatus === 'expiring' || warrantyStatus === 'expiring') overallStatus = 'expiring';

            return { ...asset, contractStatus, warrantyStatus, overallStatus };
        });
    }, [assets]);

    const filteredAssets = processedAssets.filter(a => {
        if (filter === 'all') return true;
        return a.overallStatus === filter;
    });

    const stats = {
        all: processedAssets.length,
        active: processedAssets.filter(a => a.overallStatus === 'active').length,
        expiring: processedAssets.filter(a => a.overallStatus === 'expiring').length,
        expired: processedAssets.filter(a => a.overallStatus === 'expired').length,
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <div>
                    <h2 style={styles.title}>Contracts & Warranties</h2>
                    <p style={styles.subtitle}>Track asset lifecycles, vendor contracts, and warranty expirations.</p>
                </div>
                <div style={styles.statsRow}>
                    <StatBadge label="Total Tracked" count={stats.all} onClick={() => setFilter('all')} active={filter === 'all'} />
                    <StatBadge label="Active" count={stats.active} color="var(--success)" onClick={() => setFilter('active')} active={filter === 'active'} />
                    <StatBadge label="Expiring Soon" count={stats.expiring} color="var(--warning)" onClick={() => setFilter('expiring')} active={filter === 'expiring'} />
                    <StatBadge label="Expired" count={stats.expired} color="var(--danger)" onClick={() => setFilter('expired')} active={filter === 'expired'} />
                </div>
            </div>

            <div style={styles.grid}>
                {filteredAssets.length > 0 ? (
                    filteredAssets.map(asset => (
                        <div key={asset.ID} style={styles.card} className="glass-card">
                            <div style={styles.cardHeader}>
                                <span style={styles.assetId}>{asset.Asset_ID}</span>
                                <span style={styles.category}>{asset.Category}</span>
                            </div>
                            <h3 style={styles.assetName}>{asset.Item_Name}</h3>
                            <div style={styles.vendorInfo}>
                                <span style={{ fontSize: '12px' }}>🏢 {asset.Vendor_Name || 'Unknown Vendor'}</span>
                                {asset.Support_Phone && <span style={{ fontSize: '12px' }}>📞 {asset.Support_Phone}</span>}
                            </div>

                            <div style={styles.divider} />

                            <div style={styles.datesGrid}>
                                <DateBox label="Warranty" date={asset.Warranty_Expiry} status={asset.warrantyStatus} />
                                <DateBox label="Contract" date={asset.Contract_End_Date} status={asset.contractStatus} />
                            </div>

                            {hasPermission('edit') && (
                                <button style={styles.renewBtn}>Renew Contract</button>
                            )}
                        </div>
                    ))
                ) : (
                    <div style={styles.empty}>
                        <span>📜</span>
                        <p>No contracts found for this filter.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

const StatBadge = ({ label, count, color = 'var(--textSecondary)', onClick, active }) => (
    <div
        onClick={onClick}
        style={{
            ...styles.statBadge,
            borderColor: active ? color : 'transparent',
            background: active ? `${color}20` : 'var(--background)',
            color: active ? color : 'var(--textSecondary)'
        }}
    >
        <span style={{ fontWeight: '900', fontSize: '18px', color: active ? color : 'var(--text)' }}>{count}</span>
        <span style={{ fontSize: '11px', fontWeight: '600' }}>{label}</span>
    </div>
);

const DateBox = ({ label, date, status }) => {
    const colorMap = {
        active: 'var(--success)',
        expiring: 'var(--warning)',
        expired: 'var(--danger)',
        none: 'var(--textSecondary)'
    };
    const color = colorMap[status];

    return (
        <div style={styles.dateBox}>
            <span style={{ fontSize: '10px', color: 'var(--textSecondary)', textTransform: 'uppercase' }}>{label}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: color }} />
                <span style={{ fontWeight: '700', fontSize: '13px', color: 'var(--text)' }}>
                    {date ? new Date(date).toLocaleDateString() : 'N/A'}
                </span>
            </div>
        </div>
    );
};

const styles = {
    container: { padding: '24px', maxWidth: '1400px', margin: '0 auto' },
    header: { marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '20px' },
    title: { fontSize: '28px', fontWeight: '800', marginBottom: '8px' },
    subtitle: { color: 'var(--textSecondary)', fontSize: '14px' },
    statsRow: { display: 'flex', gap: '12px' },
    statBadge: {
        display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '10px 20px',
        borderRadius: '16px', border: '2px solid transparent', cursor: 'pointer', transition: '0.2s',
        minWidth: '100px'
    },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' },
    card: { padding: '24px', borderRadius: '20px', background: 'var(--surface)', border: '1px solid var(--border)' },
    cardHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: '12px' },
    assetId: { fontSize: '11px', fontWeight: '800', color: 'var(--textSecondary)' },
    category: { fontSize: '10px', background: 'var(--background)', padding: '2px 8px', borderRadius: '8px' },
    assetName: { fontSize: '16px', fontWeight: '700', marginBottom: '8px' },
    vendorInfo: { display: 'flex', gap: '15px', color: 'var(--textSecondary)', marginBottom: '16px' },
    divider: { height: '1px', background: 'var(--border)', margin: '16px 0' },
    datesGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' },
    dateBox: { background: 'var(--background)', padding: '10px', borderRadius: '12px' },
    renewBtn: {
        width: '100%', padding: '10px', background: 'var(--accent)', color: 'white',
        border: 'none', borderRadius: '12px', fontWeight: '700', cursor: 'pointer'
    },
    empty: {
        gridColumn: '1 / -1', textAlign: 'center', padding: '60px',
        color: 'var(--textSecondary)', background: 'var(--surface)', borderRadius: '24px'
    }
};

export default Contracts;
