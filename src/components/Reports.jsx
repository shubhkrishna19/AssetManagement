import React, { useState, useMemo } from 'react';
import { mockAssets } from '../mockData';

const Reports = () => {
    const [activeReport, setActiveReport] = useState('inventory');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: 'Asset_ID', direction: 'asc' });

    // Sorting logic (Generic)
    const requestSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    // Calculate Depreciation Logic
    const calculateDepreciation = (asset) => {
        const cost = asset.Cost || 0;
        const purchaseDate = new Date(asset.Purchase_Date);
        const now = new Date();
        const ageYears = Math.max(0, (now - purchaseDate) / (1000 * 60 * 60 * 24 * 365.25));
        const usefulLife = 5; // Default 5 years
        const depreciationPerYear = cost / usefulLife;
        const totalDepreciation = Math.min(cost, depreciationPerYear * ageYears);
        const bookValue = Math.max(0, cost - totalDepreciation);

        return {
            age: ageYears.toFixed(1),
            depreciation: totalDepreciation,
            bookValue: bookValue
        };
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

        // Filter for Maintenance Tab
        if (activeReport === 'maintenance') {
            result = result.filter(asset =>
                asset.Status === 'Under Maintenance' ||
                asset.Health_Score < 70
            );
        }

        // Sort
        result.sort((a, b) => {
            let valA = a[sortConfig.key];
            let valB = b[sortConfig.key];

            // Handle calculated fields for sorting if needed (simplified for now)
            if (activeReport === 'depreciation') {
                if (sortConfig.key === 'BookValue') {
                    valA = calculateDepreciation(a).bookValue;
                    valB = calculateDepreciation(b).bookValue;
                }
            }

            if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
            if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });

        return result;
    }, [searchTerm, sortConfig, activeReport]);

    const formatCurrency = (val) => new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    }).format(val);

    const exportToCSV = () => {
        let headers = [];
        let rowMapper = null;

        if (activeReport === 'depreciation') {
            headers = ['Asset ID', 'Item Name', 'Purchase Date', 'Cost', 'Age (Yrs)', 'Depreciation', 'Book Value'];
            rowMapper = a => {
                const dep = calculateDepreciation(a);
                return [a.Asset_ID, `"${a.Item_Name}"`, a.Purchase_Date, a.Cost, dep.age, dep.depreciation.toFixed(0), dep.bookValue.toFixed(0)];
            };
        } else {
            headers = ['Asset ID', 'Item Name', 'Category', 'Status', 'Cost', 'Location'];
            rowMapper = a => [a.Asset_ID, `"${a.Item_Name}"`, a.Category, a.Status, a.Cost, a.Location];
        }

        const csvContent = [headers.join(','), ...filteredAndSortedAssets.map(a => rowMapper(a).join(','))].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.setAttribute('download', `${activeReport}_report.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>📋 Reports Center</h2>
            <p style={styles.subtitle}>Full lifecycle transparency for all enterprise assets</p>

            {/* TABS */}
            <div style={styles.tabs}>
                <button style={activeReport === 'inventory' ? styles.activeTab : styles.tab} onClick={() => setActiveReport('inventory')}>📦 Inventory List</button>
                <button style={activeReport === 'depreciation' ? styles.activeTab : styles.tab} onClick={() => setActiveReport('depreciation')}>📉 Depreciation</button>
                <button style={activeReport === 'maintenance' ? styles.activeTab : styles.tab} onClick={() => setActiveReport('maintenance')}>🔧 Maintenance Due</button>
            </div>

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
                    📥 Export {activeReport.charAt(0).toUpperCase() + activeReport.slice(1)} CSV
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

                                {activeReport === 'inventory' && (
                                    <>
                                        <SortHeader label="Category" field="Category" currentSort={sortConfig} onSort={requestSort} />
                                        <SortHeader label="Status" field="Status" currentSort={sortConfig} onSort={requestSort} />
                                        <SortHeader label="Value" field="Cost" currentSort={sortConfig} onSort={requestSort} />
                                        <SortHeader label="Location" field="Location" currentSort={sortConfig} onSort={requestSort} />
                                    </>
                                )}

                                {activeReport === 'depreciation' && (
                                    <>
                                        <SortHeader label="Purchase Date" field="Purchase_Date" currentSort={sortConfig} onSort={requestSort} />
                                        <SortHeader label="Orig. Cost" field="Cost" currentSort={sortConfig} onSort={requestSort} />
                                        <th style={styles.th}>Age (Yrs)</th>
                                        <th style={styles.th}>Est. Depreciation</th>
                                        <SortHeader label="Book Value" field="BookValue" currentSort={sortConfig} onSort={requestSort} />
                                    </>
                                )}

                                {activeReport === 'maintenance' && (
                                    <>
                                        <SortHeader label="Status" field="Status" currentSort={sortConfig} onSort={requestSort} />
                                        <SortHeader label="Health" field="Health_Score" currentSort={sortConfig} onSort={requestSort} />
                                        <SortHeader label="Location" field="Location" currentSort={sortConfig} onSort={requestSort} />
                                        <th style={styles.th}>Action Required</th>
                                    </>
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            {filteredAndSortedAssets.length === 0 ? (
                                <tr><td colSpan="7" style={{ ...styles.td, textAlign: 'center', padding: '40px', color: '#94a3b8' }}>No records found matching your criteria.</td></tr>
                            ) : (
                                filteredAndSortedAssets.map((asset, index) => {
                                    return (
                                        <tr key={asset.ID} style={{ ...styles.tr, background: index % 2 === 0 ? 'var(--surface)' : 'var(--background)' }}>
                                            <td style={{ ...styles.td, fontWeight: '700' }}>{asset.Asset_ID}</td>
                                            <td style={styles.td}>{asset.Item_Name}</td>

                                            {activeReport === 'inventory' && (
                                                <>
                                                    <td style={styles.td}><span style={styles.categoryBadge}>{asset.Category}</span></td>
                                                    <td style={styles.td}><StatusBadge status={asset.Status} /></td>
                                                    <td style={{ ...styles.td, fontWeight: '700' }}>{formatCurrency(asset.Cost)}</td>
                                                    <td style={styles.td}>{asset.Location}</td>
                                                </>
                                            )}

                                            {activeReport === 'depreciation' && (
                                                <>
                                                    <td style={styles.td}>{asset.Purchase_Date}</td>
                                                    <td style={styles.td}>{formatCurrency(asset.Cost)}</td>
                                                    <td style={styles.td}>{dep.age}</td>
                                                    <td style={{ ...styles.td, color: '#ef4444' }}>-{formatCurrency(dep.depreciation)}</td>
                                                    <td style={{ ...styles.td, fontWeight: '800', color: '#10b981' }}>{formatCurrency(dep.bookValue)}</td>
                                                </>
                                            )}

                                            {activeReport === 'maintenance' && (
                                                <>
                                                    <td style={styles.td}><StatusBadge status={asset.Status} /></td>
                                                    <td style={styles.td}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                            <div style={{ width: '60px', height: '6px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                                                                <div style={{ width: `${asset.Health_Score}%`, height: '100%', background: asset.Health_Score > 80 ? '#10b981' : asset.Health_Score > 50 ? '#f59e0b' : '#ef4444' }} />
                                                            </div>
                                                            <span style={{ fontWeight: '700', fontSize: '12px' }}>{asset.Health_Score}%</span>
                                                        </div>
                                                    </td>
                                                    <td style={styles.td}>{asset.Location}</td>
                                                    <td style={styles.td}>
                                                        <button style={styles.actionBtn}>Schedule Service</button>
                                                    </td>
                                                </>
                                            )}
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                <div style={styles.footer}>
                    <span>Showing {filteredAndSortedAssets.length} assets</span>
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
    title: { fontSize: '28px', fontWeight: '800', marginBottom: '8px', color: 'var(--text)' },
    subtitle: { fontSize: '14px', color: 'var(--textSecondary)', marginBottom: '32px' },

    tabs: { display: 'flex', gap: '8px', marginBottom: '24px', background: 'var(--border)', padding: '4px', borderRadius: '14px', width: 'fit-content' },
    tab: { padding: '8px 16px', borderRadius: '10px', border: 'none', background: 'transparent', color: 'var(--textSecondary)', fontWeight: '600', cursor: 'pointer', transition: '0.2s' },
    activeTab: { padding: '8px 16px', borderRadius: '10px', border: 'none', background: 'var(--surface)', color: 'var(--accent)', fontWeight: '700', boxShadow: 'var(--shadow)' },

    toolbar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', gap: '16px' },
    searchWrapper: { position: 'relative', flex: 1, maxWidth: '500px' },
    searchIcon: { position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--textSecondary)' },
    searchInput: { width: '100%', padding: '12px 12px 12px 48px', borderRadius: '16px', border: '1px solid var(--border)', fontSize: '14px', outline: 'none', background: 'var(--surface)', color: 'var(--text)' },
    exportBtn: { padding: '12px 24px', borderRadius: '16px', border: 'none', background: 'var(--accent)', color: 'white', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: 'var(--shadow)' },

    tableCard: { background: 'var(--surface)', borderRadius: '24px', overflow: 'hidden', boxShadow: 'var(--shadow)', border: '1px solid var(--border)' },
    tableWrapper: { overflowX: 'auto' },
    table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left' },
    th: { padding: '16px 24px', background: 'var(--background)', fontSize: '12px', fontWeight: '700', color: 'var(--textSecondary)', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid var(--border)', cursor: 'pointer' },
    tr: { transition: 'background 0.2s' },
    td: { padding: '16px 24px', fontSize: '13px', color: 'var(--text)', borderBottom: '1px solid var(--border)' },
    categoryBadge: { fontSize: '11px', color: 'var(--textSecondary)', background: 'var(--background)', padding: '4px 10px', borderRadius: '8px', fontWeight: '600' },
    badge: { padding: '6px 12px', borderRadius: '12px', fontSize: '11px', fontWeight: '700' },
    actionBtn: { padding: '6px 12px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--accent)', fontWeight: '700', cursor: 'pointer', fontSize: '11px' },
    footer: { padding: '16px 24px', fontSize: '13px', color: 'var(--textSecondary)', background: 'var(--background)', borderTop: '1px solid var(--border)' }
};

export default Reports;
