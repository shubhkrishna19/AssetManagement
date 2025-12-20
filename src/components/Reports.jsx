import React, { useState, useMemo } from 'react';
import { mockAssets } from '../mockData';

const Reports = () => {
    const [activeReport, setActiveReport] = useState('inventory');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: 'Asset_ID', direction: 'asc' });

    // Sorting logic
    const requestSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const filteredAndSortedAssets = useMemo(() => {
        let result = [...mockAssets];

        // Search
        if (searchTerm) {
            result = result.filter(asset =>
                asset.Item_Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                asset.Asset_ID.toLowerCase().includes(searchTerm.toLowerCase()) ||
                asset.Category.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Sort
        result.sort((a, b) => {
            if (a[sortConfig.key] < b[sortConfig.key]) {
                return sortConfig.direction === 'asc' ? -1 : 1;
            }
            if (a[sortConfig.key] > b[sortConfig.key]) {
                return sortConfig.direction === 'asc' ? 1 : -1;
            }
            return 0;
        });

        return result;
    }, [searchTerm, sortConfig]);

    const exportToCSV = () => {
        const headers = ['Asset ID', 'Item Name', 'Category', 'Status', 'Cost', 'Location', 'Purchase Date'];
        const csvContent = [
            headers.join(','),
            ...filteredAndSortedAssets.map(a => [
                a.Asset_ID,
                `"${a.Item_Name}"`,
                a.Category,
                a.Status,
                a.Cost,
                a.Location,
                a.Purchase_Date
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.setAttribute('download', 'Asset_Report.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const formatCurrency = (val) => new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    }).format(val);

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>📋 Reports Center</h2>
            <p style={styles.subtitle}>Full lifecycle transparency for all enterprise assets</p>

            {/* TOOLBAR */}
            <div style={styles.toolbar}>
                <div style={styles.searchWrapper}>
                    <span style={styles.searchIcon}>🔍</span>
                    <input
                        type="text"
                        placeholder="Search by ID, name or category..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={styles.searchInput}
                    />
                </div>
                <button onClick={exportToCSV} style={styles.exportBtn}>
                    📥 Export CSV
                </button>
            </div>

            {/* TABLE AREA */}
            <div style={styles.tableCard}>
                <div style={styles.tableWrapper}>
                    <table style={styles.table}>
                        <thead>
                            <tr>
                                <SortHeader label="Asset ID" field="Asset_ID" currentSort={sortConfig} onSort={requestSort} />
                                <SortHeader label="Name" field="Item_Name" currentSort={sortConfig} onSort={requestSort} />
                                <SortHeader label="Category" field="Category" currentSort={sortConfig} onSort={requestSort} />
                                <SortHeader label="Status" field="Status" currentSort={sortConfig} onSort={requestSort} />
                                <SortHeader label="Value" field="Cost" currentSort={sortConfig} onSort={requestSort} />
                                <SortHeader label="Location" field="Location" currentSort={sortConfig} onSort={requestSort} />
                            </tr>
                        </thead>
                        <tbody>
                            {filteredAndSortedAssets.map((asset, index) => (
                                <tr key={asset.ID} style={{ ...styles.tr, background: index % 2 === 0 ? 'white' : '#F8FAFC' }}>
                                    <td style={{ ...styles.td, fontWeight: '700' }}>{asset.Asset_ID}</td>
                                    <td style={styles.td}>{asset.Item_Name}</td>
                                    <td style={styles.td}>
                                        <span style={styles.categoryBadge}>{asset.Category}</span>
                                    </td>
                                    <td style={styles.td}>
                                        <StatusBadge status={asset.Status} />
                                    </td>
                                    <td style={{ ...styles.td, fontWeight: '700' }}>{formatCurrency(asset.Cost)}</td>
                                    <td style={styles.td}>{asset.Location}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div style={styles.footer}>
                    <span>Showing {filteredAndSortedAssets.length} of {mockAssets.length} assets</span>
                </div>
            </div>
        </div>
    );
};

const SortHeader = ({ label, field, currentSort, onSort }) => (
    <th style={styles.th} onClick={() => onSort(field)}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {label}
            <span style={{ fontSize: '10px', color: currentSort.key === field ? '#0984e3' : '#cbd5e1' }}>
                {currentSort.key === field ? (currentSort.direction === 'asc' ? '▲' : '▼') : '⇅'}
            </span>
        </div>
    </th>
);

const StatusBadge = ({ status }) => {
    const getColors = () => {
        switch (status) {
            case 'Assigned': return { bg: '#e0f2fe', text: '#0369a1' };
            case 'Available': return { bg: '#dcfce7', text: '#15803d' };
            case 'Under Maintenance': return { bg: '#fee2e2', text: '#b91c1c' };
            default: return { bg: '#f1f5f9', text: '#475569' };
        }
    };
    const colors = getColors();
    return (
        <span style={{
            ...styles.badge,
            background: colors.bg,
            color: colors.text
        }}>
            {status}
        </span>
    );
};

const styles = {
    container: { padding: '24px', maxWidth: '1400px', margin: '0 auto' },
    title: { fontSize: '28px', fontWeight: '800', marginBottom: '8px', color: '#0f172a' },
    subtitle: { fontSize: '14px', color: '#64748b', marginBottom: '32px' },
    toolbar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', gap: '16px' },
    searchWrapper: { position: 'relative', flex: 1, maxWidth: '500px' },
    searchIcon: { position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' },
    searchInput: { width: '100%', padding: '12px 12px 12px 48px', borderRadius: '16px', border: '1px solid #e2e8f0', fontSize: '14px', outline: 'none', background: 'white' },
    exportBtn: { padding: '12px 24px', borderRadius: '16px', border: 'none', background: '#0984e3', color: 'white', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 6px -1px rgb(9 132 227 / 0.2)' },
    tableCard: { background: 'white', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', border: '1px solid #f1f5f9' },
    tableWrapper: { overflowX: 'auto' },
    table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left' },
    th: { padding: '16px 24px', background: '#f8fafc', fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #e2e8f0', cursor: 'pointer' },
    tr: { transition: 'background 0.2s' },
    td: { padding: '16px 24px', fontSize: '14px', color: '#1e293b', borderBottom: '1px solid #f1f5f9' },
    categoryBadge: { fontSize: '12px', color: '#64748b', background: '#f1f5f9', padding: '4px 10px', borderRadius: '8px', fontWeight: '500' },
    badge: { padding: '6px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: '700' },
    footer: { padding: '16px 24px', fontSize: '13px', color: '#64748b', background: '#f8fafc', borderTop: '1px solid #e2e8f0' }
};

export default Reports;
