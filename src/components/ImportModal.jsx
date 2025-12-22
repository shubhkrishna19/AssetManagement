import React, { useState } from 'react';

const ImportModal = ({ onClose, onImport }) => {
    const [dragActive, setDragActive] = useState(false);
    const [file, setFile] = useState(null);
    const [previewData, setPreviewData] = useState([]);
    const [headers, setHeaders] = useState([]);

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    const handleFile = (file) => {
        if (file.type !== "text/csv" && !file.name.endsWith('.csv')) {
            alert("Please upload a CSV file.");
            return;
        }
        setFile(file);

        const reader = new FileReader();
        reader.onload = function (e) {
            const text = e.target.result;
            parseCSV(text);
        };
        reader.readAsText(file);
    };

    const parseCSV = (text) => {
        const lines = text.split('\n');
        if (lines.length < 2) return;

        const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
        setHeaders(headers);

        const data = [];
        // Preview first 5 rows
        for (let i = 1; i < Math.min(lines.length, 6); i++) {
            if (!lines[i].trim()) continue;
            const row = lines[i].split(',').map(cell => cell.trim().replace(/^"|"$/g, ''));
            const obj = {};
            headers.forEach((h, index) => {
                obj[h] = row[index];
            });
            data.push(obj);
        }
        setPreviewData(data);
    };

    const processFullImport = () => {
        const reader = new FileReader();
        reader.onload = function (e) {
            const text = e.target.result;
            const lines = text.split('\n');
            const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));

            const fullData = [];
            for (let i = 1; i < lines.length; i++) {
                if (!lines[i].trim()) continue;
                const row = lines[i].split(',').map(cell => cell.trim().replace(/^"|"$/g, ''));
                const obj = {};
                // Basic mapping and ID generation
                headers.forEach((h, index) => {
                    // Map common CSV headers to our schema if needed
                    // For now assume direct mapping
                    obj[h] = row[index];
                });

                // Generate ID if missing
                if (!obj.Asset_ID) {
                    obj.Asset_ID = `IMP-${Math.floor(Math.random() * 10000)}`;
                }
                // Default status
                if (!obj.Status) obj.Status = 'Available';

                fullData.push(obj);
            }
            onImport(fullData);
        };
        reader.readAsText(file);
    };

    return (
        <div style={styles.overlay}>
            <div style={styles.modal} className="glass-card">
                <div style={styles.header}>
                    <h3 style={styles.title}>📥 Import Assets</h3>
                    <button style={styles.closeBtn} onClick={onClose}>×</button>
                </div>

                {!file ? (
                    <div
                        style={{ ...styles.dropZone, ...(dragActive ? styles.dropZoneActive : {}) }}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                    >
                        <span style={styles.uploadIcon}>☁️</span>
                        <p style={styles.uploadText}>Drag & Drop your CSV file here</p>
                        <p style={styles.orText}>OR</p>
                        <label style={styles.browseBtn}>
                            Browse Files
                            <input type="file" style={{ display: 'none' }} onChange={handleChange} accept=".csv" />
                        </label>
                    </div>
                ) : (
                    <div style={styles.previewArea}>
                        <div style={styles.fileInfo}>
                            <span>📄 {file.name}</span>
                            <button style={styles.changeBtn} onClick={() => { setFile(null); setPreviewData([]) }}>Change</button>
                        </div>

                        <div style={styles.tableWrapper}>
                            <table style={styles.table}>
                                <thead>
                                    <tr>
                                        {headers.map((h, i) => <th key={i} style={styles.th}>{h}</th>)}
                                    </tr>
                                </thead>
                                <tbody>
                                    {previewData.map((row, i) => (
                                        <tr key={i}>
                                            {headers.map((h, j) => <td key={j} style={styles.td}>{row[h]}</td>)}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <p style={styles.hint}>Showing first 5 rows preview...</p>
                    </div>
                )}

                <div style={styles.footer}>
                    <button style={styles.cancelBtn} onClick={onClose}>Cancel</button>
                    <button
                        style={{ ...styles.importBtn, ...(file ? {} : styles.disabledBtn) }}
                        disabled={!file}
                        onClick={processFullImport}
                    >
                        Import Assets
                    </button>
                </div>
            </div>
        </div>
    );
};

const styles = {
    overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' },
    modal: { width: '800px', maxWidth: '90vw', padding: '32px', background: 'var(--surface)', borderRadius: '24px', border: '1px solid var(--border)', boxShadow: '0 20px 50px rgba(0,0,0,0.3)' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' },
    title: { fontSize: '24px', fontWeight: '800', color: 'var(--text)' },
    closeBtn: { background: 'none', border: 'none', fontSize: '28px', color: 'var(--textSecondary)', cursor: 'pointer' },

    dropZone: { border: '2px dashed var(--border)', borderRadius: '16px', padding: '40px', textAlign: 'center', transition: 'all 0.2s', background: 'var(--background)' },
    dropZoneActive: { borderColor: 'var(--accent)', background: 'var(--accentLight)' },
    uploadIcon: { fontSize: '48px', marginBottom: '16px', display: 'block' },
    uploadText: { fontSize: '18px', fontWeight: 'bold', color: 'var(--text)', marginBottom: '8px' },
    orText: { fontSize: '12px', color: 'var(--textSecondary)', margin: '12px 0', textTransform: 'uppercase', fontWeight: 'bold' },
    browseBtn: { padding: '10px 24px', background: 'var(--text)', color: 'var(--background)', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', display: 'inline-block' },

    previewArea: { background: 'var(--background)', borderRadius: '16px', padding: '16px', border: '1px solid var(--border)' },
    fileInfo: { display: 'flex', justifyContent: 'space-between', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid var(--border)', color: 'var(--text)', fontWeight: 'bold' },
    changeBtn: { border: 'none', background: 'none', color: 'var(--accent)', fontWeight: 'bold', cursor: 'pointer' },
    tableWrapper: { overflowX: 'auto' },
    table: { width: '100%', borderCollapse: 'collapse', fontSize: '12px' },
    th: { textAlign: 'left', padding: '8px', color: 'var(--textSecondary)', borderBottom: '1px solid var(--border)' },
    td: { padding: '8px', color: 'var(--text)', borderBottom: '1px solid var(--border)' },
    hint: { fontSize: '11px', color: 'var(--textSecondary)', marginTop: '8px', fontStyle: 'italic' },

    footer: { display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '32px' },
    cancelBtn: { padding: '12px 24px', background: 'transparent', border: '1px solid var(--border)', borderRadius: '12px', fontWeight: 'bold', color: 'var(--text)', cursor: 'pointer' },
    importBtn: { padding: '12px 32px', background: 'var(--accent)', border: 'none', borderRadius: '12px', fontWeight: 'bold', color: 'white', cursor: 'pointer', boxShadow: '0 4px 12px rgba(9, 132, 227, 0.3)' },
    disabledBtn: { opacity: 0.5, cursor: 'not-allowed', boxShadow: 'none' }
};

export default ImportModal;
