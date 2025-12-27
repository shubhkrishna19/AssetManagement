import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '../context/UserContext';
import { useAudit } from '../context/AuditContext';

const MasterEditor = ({ assets = [], updateAsset, onClose }) => {
    const { hasPermission, currentUser } = useUser();
    const { logAction } = useAudit();
    const [selectedIds, setSelectedIds] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('All');
    const [filterStatus, setFilterStatus] = useState('All');
    const [bulkEditField, setBulkEditField] = useState('');
    const [bulkEditValue, setBulkEditValue] = useState('');
    const [editingAsset, setEditingAsset] = useState(null);
    const [editForm, setEditForm] = useState({});

    const isAdmin = hasPermission('bulk_action');

    // Get unique categories and statuses
    const categories = useMemo(() => {
        const cats = [...new Set(assets.map(a => a.Category).filter(c => c && !c.match(/^[0-9.]+$/)))];
        return ['All', ...cats];
    }, [assets]);

    const statuses = ['All', 'Available', 'Assigned', 'Under Maintenance', 'In Use', 'Disposed'];

    // Filter assets
    const filteredAssets = useMemo(() => {
        return assets.filter(a => {
            const matchSearch = searchTerm === '' ||
                a.Item_Name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                a.Asset_ID?.toLowerCase().includes(searchTerm.toLowerCase());
            const matchCategory = filterCategory === 'All' || a.Category === filterCategory;
            const matchStatus = filterStatus === 'All' || a.Status === filterStatus;
            return matchSearch && matchCategory && matchStatus;
        });
    }, [assets, searchTerm, filterCategory, filterStatus]);

    // Selection handlers
    const toggleSelect = (id) => {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    };

    const selectAll = () => {
        if (selectedIds.length === filteredAssets.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(filteredAssets.map(a => a.Asset_ID));
        }
    };

    const selectByFilter = (type) => {
        if (type === 'available') {
            setSelectedIds(filteredAssets.filter(a => a.Status === 'Available').map(a => a.Asset_ID));
        } else if (type === 'maintenance') {
            setSelectedIds(filteredAssets.filter(a => a.Status === 'Under Maintenance').map(a => a.Asset_ID));
        } else if (type === 'lowHealth') {
            setSelectedIds(filteredAssets.filter(a => (a.Health_Score || 100) < 60).map(a => a.Asset_ID));
        }
    };

    // Bulk update
    const handleBulkUpdate = () => {
        if (!bulkEditField || !bulkEditValue || selectedIds.length === 0) return;

        selectedIds.forEach(id => {
            const asset = assets.find(a => a.Asset_ID === id);
            if (asset) {
                updateAsset({ ...asset, [bulkEditField]: bulkEditValue });
            }
        });

        logAction('BULK_UPDATE', `Updated ${selectedIds.length} assets: ${bulkEditField} = ${bulkEditValue}`, currentUser.name, 'warning');
        setBulkEditField('');
        setBulkEditValue('');
        setSelectedIds([]);
        alert(`Successfully updated ${selectedIds.length} assets!`);
    };

    // Individual edit
    const startEdit = (asset) => {
        setEditingAsset(asset.Asset_ID);
        setEditForm({
            Status: asset.Status || 'Available',
            Category: asset.Category || '',
            Location: asset.Location || '',
            Cost: asset.Cost || 0,
            Health_Score: asset.Health_Score || 100
        });
    };

    const saveEdit = () => {
        const asset = assets.find(a => a.Asset_ID === editingAsset);
        if (asset) {
            updateAsset({ ...asset, ...editForm });
            logAction('ASSET_UPDATE', `Updated asset ${editingAsset}`, currentUser.name, 'info');
        }
        setEditingAsset(null);
    };

    const formatCurrency = (val) => new Intl.NumberFormat('en-IN', {
        style: 'currency', currency: 'INR', maximumFractionDigits: 0
    }).format(val || 0);

    if (!isAdmin) {
        return (
            <div style={styles.accessDenied}>
                <span>🔒</span>
                <h3>Access Restricted</h3>
                <p>Only administrators can access the Master Editor.</p>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <div>
                    <h2 style={styles.title}>📝 Master Asset Editor</h2>
                    <p style={styles.subtitle}>Edit individual assets or make bulk changes</p>
                </div>
                <div style={styles.headerStats}>
                    <span style={styles.statBadge}>{filteredAssets.length} assets</span>
                    <span style={{ ...styles.statBadge, background: 'var(--accent)' }}>{selectedIds.length} selected</span>
                </div>
            </div>

            {/* Filters Row */}
            <div style={styles.filtersRow}>
                <div style={styles.searchBox}>
                    <span>🔍</span>
                    <input
                        type="text"
                        placeholder="Search assets..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={styles.searchInput}
                    />
                </div>
                <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    style={styles.filterSelect}
                >
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    style={styles.filterSelect}
                >
                    {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
            </div>

            {/* Selection Actions */}
            <div style={styles.selectionBar}>
                <div style={styles.selectActions}>
                    <button onClick={selectAll} style={styles.selectBtn}>
                        {selectedIds.length === filteredAssets.length ? '☐ Deselect All' : '☑ Select All'}
                    </button>
                    <button onClick={() => selectByFilter('available')} style={styles.selectBtn}>
                        🟢 Select Available
                    </button>
                    <button onClick={() => selectByFilter('maintenance')} style={styles.selectBtn}>
                        🔧 Select Maintenance
                    </button>
                    <button onClick={() => selectByFilter('lowHealth')} style={styles.selectBtn}>
                        ⚠️ Select Low Health
                    </button>
                </div>
            </div>

            {/* Bulk Edit Panel */}
            <AnimatePresence>
                {selectedIds.length > 0 && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        style={styles.bulkPanel}
                    >
                        <div style={styles.bulkHeader}>
                            <span>⚡ Bulk Edit ({selectedIds.length} selected)</span>
                        </div>
                        <div style={styles.bulkControls}>
                            <select
                                value={bulkEditField}
                                onChange={(e) => setBulkEditField(e.target.value)}
                                style={styles.bulkSelect}
                            >
                                <option value="">Select field...</option>
                                <option value="Status">Status</option>
                                <option value="Category">Category</option>
                                <option value="Location">Location</option>
                            </select>
                            {bulkEditField === 'Status' ? (
                                <select
                                    value={bulkEditValue}
                                    onChange={(e) => setBulkEditValue(e.target.value)}
                                    style={styles.bulkSelect}
                                >
                                    <option value="">Select status...</option>
                                    <option value="Available">Available</option>
                                    <option value="Assigned">Assigned</option>
                                    <option value="Under Maintenance">Under Maintenance</option>
                                    <option value="Disposed">Disposed</option>
                                </select>
                            ) : bulkEditField === 'Location' ? (
                                <select
                                    value={bulkEditValue}
                                    onChange={(e) => setBulkEditValue(e.target.value)}
                                    style={styles.bulkSelect}
                                >
                                    <option value="">Select location...</option>
                                    <option value="A-108">A-108</option>
                                    <option value="J-18">J-18</option>
                                    <option value="Off-Site">Off-Site</option>
                                </select>
                            ) : (
                                <input
                                    type="text"
                                    placeholder="Enter new value..."
                                    value={bulkEditValue}
                                    onChange={(e) => setBulkEditValue(e.target.value)}
                                    style={styles.bulkInput}
                                />
                            )}
                            <button
                                onClick={handleBulkUpdate}
                                disabled={!bulkEditField || !bulkEditValue}
                                style={{ ...styles.applyBtn, opacity: (!bulkEditField || !bulkEditValue) ? 0.5 : 1 }}
                            >
                                ✅ Apply to {selectedIds.length} Assets
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Asset Table */}
            <div style={styles.tableWrapper}>
                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th style={styles.th}>
                                <input
                                    type="checkbox"
                                    checked={selectedIds.length === filteredAssets.length && filteredAssets.length > 0}
                                    onChange={selectAll}
                                />
                            </th>
                            <th style={styles.th}>Asset ID</th>
                            <th style={styles.th}>Name</th>
                            <th style={styles.th}>Category</th>
                            <th style={styles.th}>Status</th>
                            <th style={styles.th}>Location</th>
                            <th style={styles.th}>Value</th>
                            <th style={styles.th}>Health</th>
                            <th style={styles.th}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredAssets.map(asset => (
                            <tr
                                key={asset.Asset_ID}
                                style={{
                                    ...styles.tr,
                                    background: selectedIds.includes(asset.Asset_ID) ? 'var(--accentLight)' : 'transparent'
                                }}
                            >
                                <td style={styles.td}>
                                    <input
                                        type="checkbox"
                                        checked={selectedIds.includes(asset.Asset_ID)}
                                        onChange={() => toggleSelect(asset.Asset_ID)}
                                    />
                                </td>
                                <td style={{ ...styles.td, fontWeight: '700', color: 'var(--accent)' }}>{asset.Asset_ID}</td>
                                <td style={styles.td}>{asset.Item_Name}</td>
                                <td style={styles.td}>
                                    {editingAsset === asset.Asset_ID ? (
                                        <input
                                            type="text"
                                            value={editForm.Category}
                                            onChange={(e) => setEditForm({ ...editForm, Category: e.target.value })}
                                            style={styles.editInput}
                                        />
                                    ) : asset.Category}
                                </td>
                                <td style={styles.td}>
                                    {editingAsset === asset.Asset_ID ? (
                                        <select
                                            value={editForm.Status}
                                            onChange={(e) => setEditForm({ ...editForm, Status: e.target.value })}
                                            style={styles.editSelect}
                                        >
                                            <option value="Available">Available</option>
                                            <option value="Assigned">Assigned</option>
                                            <option value="Under Maintenance">Under Maintenance</option>
                                        </select>
                                    ) : (
                                        <span style={{
                                            ...styles.statusBadge,
                                            background: asset.Status === 'Available' ? '#00b894' :
                                                asset.Status === 'Assigned' ? '#0984e3' :
                                                    asset.Status === 'Under Maintenance' ? '#fdcb6e' : '#95a5a6'
                                        }}>
                                            {asset.Status}
                                        </span>
                                    )}
                                </td>
                                <td style={styles.td}>
                                    {editingAsset === asset.Asset_ID ? (
                                        <select
                                            value={editForm.Location}
                                            onChange={(e) => setEditForm({ ...editForm, Location: e.target.value })}
                                            style={styles.editSelect}
                                        >
                                            <option value="A-108">A-108</option>
                                            <option value="J-18">J-18</option>
                                            <option value="Off-Site">Off-Site</option>
                                        </select>
                                    ) : asset.Location}
                                </td>
                                <td style={styles.td}>{formatCurrency(asset.Cost)}</td>
                                <td style={styles.td}>
                                    <div style={styles.healthBar}>
                                        <div style={{
                                            ...styles.healthFill,
                                            width: `${asset.Health_Score || 100}%`,
                                            background: (asset.Health_Score || 100) >= 70 ? '#00b894' :
                                                (asset.Health_Score || 100) >= 40 ? '#fdcb6e' : '#e74c3c'
                                        }} />
                                    </div>
                                </td>
                                <td style={styles.td}>
                                    {editingAsset === asset.Asset_ID ? (
                                        <div style={{ display: 'flex', gap: '4px' }}>
                                            <button onClick={saveEdit} style={styles.saveBtn}>✓</button>
                                            <button onClick={() => setEditingAsset(null)} style={styles.cancelBtn}>✕</button>
                                        </div>
                                    ) : (
                                        <button onClick={() => startEdit(asset)} style={styles.editBtn}>✏️</button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {filteredAssets.length === 0 && (
                <div style={styles.emptyState}>
                    <span>📭</span>
                    <p>No assets match your filters</p>
                </div>
            )}
        </div>
    );
};

const styles = {
    container: { padding: '24px', maxWidth: '1400px', margin: '0 auto' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' },
    title: { fontSize: '28px', fontWeight: '800', marginBottom: '4px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
    subtitle: { fontSize: '13px', color: 'var(--textSecondary)' },
    headerStats: { display: 'flex', gap: '8px' },
    statBadge: { padding: '8px 16px', borderRadius: '20px', background: 'var(--background)', fontSize: '12px', fontWeight: '700' },

    filtersRow: { display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' },
    searchBox: { display: 'flex', alignItems: 'center', gap: '8px', padding: '0 16px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', flex: 1, minWidth: '200px' },
    searchInput: { border: 'none', background: 'transparent', padding: '12px 0', outline: 'none', fontSize: '14px', color: 'var(--text)', width: '100%' },
    filterSelect: { padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text)', fontSize: '13px', fontWeight: '600' },

    selectionBar: { marginBottom: '16px' },
    selectActions: { display: 'flex', gap: '8px', flexWrap: 'wrap' },
    selectBtn: { padding: '8px 14px', borderRadius: '10px', border: '1px solid var(--border)', background: 'var(--background)', color: 'var(--text)', fontSize: '12px', fontWeight: '600', cursor: 'pointer' },

    bulkPanel: { background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)', borderRadius: '16px', padding: '20px', marginBottom: '20px', overflow: 'hidden' },
    bulkHeader: { fontSize: '14px', fontWeight: '800', marginBottom: '16px' },
    bulkControls: { display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' },
    bulkSelect: { padding: '10px 16px', borderRadius: '10px', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text)', fontSize: '13px', minWidth: '150px' },
    bulkInput: { padding: '10px 16px', borderRadius: '10px', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text)', fontSize: '13px', flex: 1, minWidth: '150px' },
    applyBtn: { padding: '10px 20px', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg, #00b894 0%, #00cec9 100%)', color: 'white', fontSize: '13px', fontWeight: '700', cursor: 'pointer' },

    tableWrapper: { background: 'var(--surface)', borderRadius: '16px', border: '1px solid var(--border)', overflow: 'hidden' },
    table: { width: '100%', borderCollapse: 'collapse' },
    th: { padding: '14px 16px', textAlign: 'left', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', color: 'var(--textSecondary)', borderBottom: '1px solid var(--border)', background: 'var(--background)' },
    tr: { borderBottom: '1px solid var(--border)', transition: '0.2s' },
    td: { padding: '12px 16px', fontSize: '13px' },

    statusBadge: { padding: '4px 10px', borderRadius: '6px', color: 'white', fontSize: '11px', fontWeight: '700' },
    healthBar: { width: '60px', height: '6px', background: 'var(--border)', borderRadius: '3px', overflow: 'hidden' },
    healthFill: { height: '100%', borderRadius: '3px', transition: '0.3s' },

    editBtn: { padding: '6px 10px', borderRadius: '8px', border: 'none', background: 'var(--background)', cursor: 'pointer', fontSize: '12px' },
    saveBtn: { padding: '6px 10px', borderRadius: '8px', border: 'none', background: '#00b894', color: 'white', cursor: 'pointer', fontWeight: '700' },
    cancelBtn: { padding: '6px 10px', borderRadius: '8px', border: 'none', background: '#e74c3c', color: 'white', cursor: 'pointer', fontWeight: '700' },
    editInput: { padding: '6px 10px', borderRadius: '6px', border: '1px solid var(--border)', fontSize: '12px', width: '100px' },
    editSelect: { padding: '6px 8px', borderRadius: '6px', border: '1px solid var(--border)', fontSize: '11px' },

    emptyState: { textAlign: 'center', padding: '60px', color: 'var(--textSecondary)' },
    accessDenied: { textAlign: 'center', padding: '100px 40px', color: 'var(--textSecondary)' }
};

export default MasterEditor;
