import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as XLSX from 'xlsx';
import { useUser } from '../context/UserContext';
import { useAudit } from '../context/AuditContext';

const ImportExport = ({ assets = [], onImport, onExport }) => {
    const { hasPermission } = useUser();
    const { logAction } = useAudit();
    const [activeTab, setActiveTab] = useState('import');
    const [dragActive, setDragActive] = useState(false);
    const [importData, setImportData] = useState([]);
    const [importErrors, setImportErrors] = useState([]);
    const [importing, setImporting] = useState(false);
    const [exportFormat, setExportFormat] = useState('csv');
    const fileInputRef = useRef(null);

    const isAdmin = hasPermission('bulk_action');

    // CSV Parser
    const parseCSV = (text) => {
        const lines = text.split('\n').filter(line => line.trim());
        if (lines.length < 2) return { data: [], errors: ['File appears to be empty'] };

        const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
        const requiredFields = ['Item_Name', 'Asset_ID'];
        const missingFields = requiredFields.filter(f => !headers.includes(f));

        if (missingFields.length > 0) {
            return { data: [], errors: [`Missing required columns: ${missingFields.join(', ')}`] };
        }

        const data = [];
        const errors = [];

        for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
            if (values.length !== headers.length) {
                errors.push(`Row ${i + 1}: Column count mismatch`);
                continue;
            }

            const row = {};
            headers.forEach((header, idx) => {
                row[header] = values[idx];
            });

            // Validate required fields
            if (!row.Item_Name || !row.Asset_ID) {
                errors.push(`Row ${i + 1}: Missing required field (Item_Name or Asset_ID)`);
                continue;
            }

            // Set defaults
            row.Status = row.Status || 'Available';
            row.Category = row.Category || 'Uncategorized';
            row.Cost = Number(row.Cost) || 0;
            row.Health_Score = Number(row.Health_Score) || 100;

            data.push(row);
        }

        return { data, errors };
    };

    // Handle file drop
    const handleDrop = (e) => {
        e.preventDefault();
        setDragActive(false);

        const file = e.dataTransfer.files[0];
        if (file && (file.name.endsWith('.csv') || file.name.endsWith('.xlsx'))) {
            processFile(file);
        } else {
            setImportErrors(['Please upload a CSV or Excel file']);
        }
    };

    // Handle file select
    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) processFile(file);
    };

    // Process uploaded file (CSV or XLSX)
    const processFile = (file) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            if (file.name.endsWith('.csv')) {
                // Legacy CSV Text Parsing
                const text = e.target.result;
                const { data, errors } = parseCSV(text);
                setImportData(data);
                setImportErrors(errors);
            } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
                // Modern Excel (XLSX) Binary Parsing
                try {
                    const buffer = e.target.result;
                    const workbook = XLSX.read(buffer, { type: 'array' });

                    // Always pull the first worksheet
                    const firstSheetName = workbook.SheetNames[0];
                    const worksheet = workbook.Sheets[firstSheetName];

                    // Convert sheet to strictly mapped JSON
                    const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

                    if (jsonData.length === 0) {
                        setImportErrors(['Excel file appears to be empty']);
                        return;
                    }

                    // Run the same validation logic as the text parser
                    const errors = [];
                    const data = [];

                    jsonData.forEach((row, rawIdx) => {
                        const i = rawIdx + 1; // 1-indexed for error reporting

                        // Validate strictly required fields
                        if (!row.Item_Name && !row.Asset_ID) {
                            errors.push(`Row ${i + 1}: Missing required fields (Item_Name, Asset_ID)`);
                            return;
                        } else if (!row.Item_Name) {
                            errors.push(`Row ${i + 1}: Missing Item_Name`);
                            return;
                        } else if (!row.Asset_ID) {
                            errors.push(`Row ${i + 1}: Missing Asset_ID`);
                            return;
                        }

                        // Cast defaults exactly like the csv parser
                        const cleanRow = { ...row };
                        cleanRow.Status = cleanRow.Status || 'Available';
                        cleanRow.Category = cleanRow.Category || 'Uncategorized';
                        cleanRow.Cost = Number(cleanRow.Cost) || 0;
                        cleanRow.Health_Score = Number(cleanRow.Health_Score) || 100;

                        data.push(cleanRow);
                    });

                    setImportData(data);
                    setImportErrors(errors);

                } catch (err) {
                    console.error('Excel parse error:', err);
                    setImportErrors(['Failed to read Excel file. Please ensure it is a valid .xlsx or .xls file.']);
                }
            }
        };

        // Read based on file type
        if (file.name.endsWith('.csv')) {
            reader.readAsText(file);
        } else {
            reader.readAsArrayBuffer(file);
        }
    };

    // Confirm import
    const handleImport = async () => {
        if (!isAdmin || importData.length === 0) return;

        setImporting(true);
        try {
            // Simulate import delay
            await new Promise(resolve => setTimeout(resolve, 1000));

            if (onImport) {
                onImport(importData);
            }

            logAction('BULK_IMPORT', `Imported ${importData.length} assets from CSV`, 'System', 'success');
            setImportData([]);
            setImportErrors([]);
            alert(`Successfully imported ${importData.length} assets!`);
        } catch (error) {
            setImportErrors([`Import failed: ${error.message}`]);
        }
        setImporting(false);
    };

    // Export assets
    const handleExport = () => {
        const headers = ['Asset_ID', 'Item_Name', 'Category', 'Status', 'Cost', 'Location', 'Assigned_To', 'Purchase_Date', 'Health_Score'];

        let content = '';
        if (exportFormat === 'csv') {
            content = headers.join(',') + '\n';
            assets.forEach(asset => {
                const row = headers.map(h => {
                    let val = asset[h] || '';
                    if (h === 'Assigned_To') val = asset.Assigned_User?.display_value || '';
                    if (typeof val === 'string' && val.includes(',')) val = `"${val}"`;
                    return val;
                });
                content += row.join(',') + '\n';
            });
        } else {
            // JSON export
            content = JSON.stringify(assets, null, 2);
        }

        const blob = new Blob([content], { type: exportFormat === 'csv' ? 'text/csv' : 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `asset_export_${new Date().toISOString().split('T')[0]}.${exportFormat}`;
        a.click();
        URL.revokeObjectURL(url);

        logAction('EXPORT', `Exported ${assets.length} assets as ${exportFormat.toUpperCase()}`, 'System', 'info');
    };

    // Download template
    const downloadTemplate = () => {
        const template = 'Asset_ID,Item_Name,Category,Status,Cost,Location,Serial_Number,Purchase_Date\nBW-001,Sample Laptop,Electronics,Available,45000,A-108,SN12345,2024-01-15\nBW-002,Office Chair,Furniture,Assigned,8500,J-18,,2024-02-20';
        const blob = new Blob([template], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'asset_import_template.csv';
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>📥 Import / Export Assets</h2>
            <p style={styles.subtitle}>Bulk upload assets via Excel (XLSX) or CSV, or export your inventory data</p>

            {/* Tab Switcher */}
            <div style={styles.tabs}>
                <button
                    onClick={() => setActiveTab('import')}
                    style={{ ...styles.tab, ...(activeTab === 'import' ? styles.tabActive : {}) }}
                >
                    📤 Import
                </button>
                <button
                    onClick={() => setActiveTab('export')}
                    style={{ ...styles.tab, ...(activeTab === 'export' ? styles.tabActive : {}) }}
                >
                    📥 Export
                </button>
            </div>

            <AnimatePresence mode="wait">
                {activeTab === 'import' ? (
                    <motion.div
                        key="import"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        style={styles.section}
                    >
                        {/* Drop Zone */}
                        <div
                            onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                            onDragLeave={() => setDragActive(false)}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current?.click()}
                            style={{ ...styles.dropZone, ...(dragActive ? styles.dropZoneActive : {}) }}
                        >
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileSelect}
                                accept=".csv,.xlsx,.xls"
                                style={{ display: 'none' }}
                            />
                            <div style={styles.dropIcon}>📁</div>
                            <h3 style={styles.dropTitle}>Drop Excel or CSV file here</h3>
                            <p style={styles.dropText}>or click to browse</p>
                        </div>

                        {/* Template Download */}
                        <button onClick={downloadTemplate} style={styles.templateBtn}>
                            📄 Download Formatting Template (CSV)
                        </button>

                        {/* Import Preview */}
                        {importData.length > 0 && (
                            <div style={styles.previewSection}>
                                <h4 style={styles.previewTitle}>Preview ({importData.length} records)</h4>
                                <div style={styles.previewTable}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                        <thead>
                                            <tr>
                                                <th style={styles.th}>Asset ID</th>
                                                <th style={styles.th}>Name</th>
                                                <th style={styles.th}>Category</th>
                                                <th style={styles.th}>Status</th>
                                                <th style={styles.th}>Cost</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {importData.slice(0, 5).map((row, idx) => (
                                                <tr key={idx}>
                                                    <td style={styles.td}>{row.Asset_ID}</td>
                                                    <td style={styles.td}>{row.Item_Name}</td>
                                                    <td style={styles.td}>{row.Category}</td>
                                                    <td style={styles.td}>{row.Status}</td>
                                                    <td style={styles.td}>₹{row.Cost?.toLocaleString()}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    {importData.length > 5 && (
                                        <p style={styles.moreRows}>...and {importData.length - 5} more rows</p>
                                    )}
                                </div>

                                <button
                                    onClick={handleImport}
                                    disabled={!isAdmin || importing}
                                    style={{ ...styles.importBtn, opacity: (!isAdmin || importing) ? 0.5 : 1 }}
                                >
                                    {importing ? '⏳ Importing...' : `✅ Confirm Import (${importData.length} assets)`}
                                </button>
                            </div>
                        )}

                        {/* Errors */}
                        {importErrors.length > 0 && (
                            <div style={styles.errorBox}>
                                <h4>⚠️ Import Warnings</h4>
                                <ul>
                                    {importErrors.map((err, idx) => (
                                        <li key={idx}>{err}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </motion.div>
                ) : (
                    <motion.div
                        key="export"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        style={styles.section}
                    >
                        <div style={styles.exportCard}>
                            <div style={styles.exportIcon}>📊</div>
                            <h3 style={styles.exportTitle}>Export Asset Data</h3>
                            <p style={styles.exportDesc}>Download your complete asset inventory</p>

                            <div style={styles.exportStats}>
                                <div style={styles.exportStat}>
                                    <span style={styles.exportStatValue}>{assets.length}</span>
                                    <span style={styles.exportStatLabel}>Total Assets</span>
                                </div>
                                <div style={styles.exportStat}>
                                    <span style={styles.exportStatValue}>
                                        ₹{assets.reduce((sum, a) => sum + (Number(a.Cost) || 0), 0).toLocaleString()}
                                    </span>
                                    <span style={styles.exportStatLabel}>Total Value</span>
                                </div>
                            </div>

                            <div style={styles.formatSelector}>
                                <label style={styles.formatLabel}>Export Format:</label>
                                <div style={styles.formatOptions}>
                                    <button
                                        onClick={() => setExportFormat('csv')}
                                        style={{ ...styles.formatBtn, ...(exportFormat === 'csv' ? styles.formatBtnActive : {}) }}
                                    >
                                        📄 CSV
                                    </button>
                                    <button
                                        onClick={() => setExportFormat('json')}
                                        style={{ ...styles.formatBtn, ...(exportFormat === 'json' ? styles.formatBtnActive : {}) }}
                                    >
                                        🔧 JSON
                                    </button>
                                </div>
                            </div>

                            <button onClick={handleExport} style={styles.exportBtn}>
                                📥 Download {exportFormat.toUpperCase()}
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const styles = {
    container: { padding: '32px', maxWidth: '900px', margin: '0 auto' },
    title: { fontSize: '28px', fontWeight: '800', marginBottom: '8px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
    subtitle: { fontSize: '14px', color: 'var(--textSecondary)', marginBottom: '32px' },

    tabs: { display: 'flex', gap: '8px', marginBottom: '24px' },
    tab: { padding: '12px 24px', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--background)', color: 'var(--text)', fontSize: '14px', fontWeight: '700', cursor: 'pointer', transition: '0.2s' },
    tabActive: { background: 'var(--accent)', color: 'white', borderColor: 'var(--accent)' },

    section: { background: 'var(--surface)', borderRadius: '24px', padding: '32px', border: '1px solid var(--border)' },

    dropZone: { border: '2px dashed var(--border)', borderRadius: '20px', padding: '60px', textAlign: 'center', cursor: 'pointer', transition: '0.2s', marginBottom: '20px' },
    dropZoneActive: { borderColor: 'var(--accent)', background: 'var(--accentLight)' },
    dropIcon: { fontSize: '48px', marginBottom: '16px' },
    dropTitle: { fontSize: '18px', fontWeight: '700', marginBottom: '8px' },
    dropText: { fontSize: '13px', color: 'var(--textSecondary)' },

    templateBtn: { width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--background)', color: 'var(--text)', fontSize: '14px', fontWeight: '600', cursor: 'pointer' },

    previewSection: { marginTop: '24px' },
    previewTitle: { fontSize: '16px', fontWeight: '700', marginBottom: '16px' },
    previewTable: { background: 'var(--background)', borderRadius: '16px', overflow: 'hidden', marginBottom: '20px' },
    th: { padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', color: 'var(--textSecondary)', borderBottom: '1px solid var(--border)' },
    td: { padding: '12px 16px', fontSize: '13px', borderBottom: '1px solid var(--border)' },
    moreRows: { textAlign: 'center', padding: '12px', fontSize: '12px', color: 'var(--textSecondary)' },

    importBtn: { width: '100%', padding: '16px', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg, #00b894 0%, #00cec9 100%)', color: 'white', fontSize: '16px', fontWeight: '700', cursor: 'pointer' },

    errorBox: { marginTop: '20px', padding: '16px', background: 'rgba(231, 76, 60, 0.1)', border: '1px solid rgba(231, 76, 60, 0.2)', borderRadius: '12px', color: '#e74c3c', fontSize: '13px' },

    exportCard: { textAlign: 'center', padding: '40px' },
    exportIcon: { fontSize: '64px', marginBottom: '20px' },
    exportTitle: { fontSize: '24px', fontWeight: '800', marginBottom: '8px' },
    exportDesc: { fontSize: '14px', color: 'var(--textSecondary)', marginBottom: '32px' },

    exportStats: { display: 'flex', justifyContent: 'center', gap: '40px', marginBottom: '32px' },
    exportStat: { textAlign: 'center' },
    exportStatValue: { display: 'block', fontSize: '28px', fontWeight: '800', color: 'var(--accent)' },
    exportStatLabel: { fontSize: '12px', color: 'var(--textSecondary)', textTransform: 'uppercase' },

    formatSelector: { marginBottom: '24px' },
    formatLabel: { display: 'block', fontSize: '12px', fontWeight: '700', color: 'var(--textSecondary)', marginBottom: '12px', textTransform: 'uppercase' },
    formatOptions: { display: 'flex', justifyContent: 'center', gap: '12px' },
    formatBtn: { padding: '12px 24px', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--background)', color: 'var(--text)', fontSize: '14px', fontWeight: '600', cursor: 'pointer' },
    formatBtnActive: { background: 'var(--accent)', color: 'white', borderColor: 'var(--accent)' },

    exportBtn: { padding: '16px 48px', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', fontSize: '16px', fontWeight: '700', cursor: 'pointer', boxShadow: '0 8px 24px rgba(102, 126, 234, 0.3)' }
};

export default ImportExport;
