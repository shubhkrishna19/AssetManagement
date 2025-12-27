import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';

const QRGenerator = ({ asset, assets = [], selectedIds = [], onClose }) => {
    const [mode, setMode] = useState(asset ? 'single' : 'bulk');
    const [labelSize, setLabelSize] = useState('medium');
    const [includeDetails, setIncludeDetails] = useState(true);
    const printRef = useRef(null);

    const targetAssets = mode === 'single' && asset
        ? [asset]
        : assets.filter(a => selectedIds.includes(a.Asset_ID));

    const sizes = {
        small: { qr: 80, label: { width: 150, padding: 12 } },
        medium: { qr: 120, label: { width: 200, padding: 16 } },
        large: { qr: 180, label: { width: 280, padding: 20 } }
    };

    const currentSize = sizes[labelSize];

    // Generate QR data string
    const getQRData = (item) => {
        return JSON.stringify({
            id: item.Asset_ID,
            name: item.Item_Name,
            category: item.Category,
            org: 'Bluewud'
        });
    };

    // Print labels
    const handlePrint = () => {
        const printContent = printRef.current;
        const win = window.open('', '', 'height=600,width=800');
        win.document.write('<html><head><title>Asset QR Labels</title>');
        win.document.write('<style>');
        win.document.write(`
            body { font-family: 'Inter', sans-serif; margin: 0; padding: 20px; }
            .label-grid { display: flex; flex-wrap: wrap; gap: 16px; }
            .label { 
                border: 1px solid #e2e8f0; 
                border-radius: 12px; 
                padding: ${currentSize.label.padding}px;
                width: ${currentSize.label.width}px;
                text-align: center;
                page-break-inside: avoid;
            }
            .qr-code { margin-bottom: 12px; }
            .asset-id { font-weight: 800; font-size: 14px; margin-bottom: 4px; }
            .asset-name { font-size: 11px; color: #64748b; margin-bottom: 4px; }
            .asset-category { font-size: 10px; color: #94a3b8; }
            @media print {
                body { padding: 0; }
                .label { break-inside: avoid; }
            }
        `);
        win.document.write('</style></head><body>');
        win.document.write(printContent.innerHTML);
        win.document.write('</body></html>');
        win.document.close();
        win.focus();
        win.print();
        win.close();
    };

    // Download as PNG (for single QR)
    const downloadQR = (assetItem) => {
        const canvas = document.createElement('canvas');
        const svg = document.querySelector(`#qr-${assetItem.Asset_ID}`);
        const svgData = new XMLSerializer().serializeToString(svg);
        const img = new Image();

        img.onload = () => {
            canvas.width = currentSize.qr;
            canvas.height = currentSize.qr;
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);

            const link = document.createElement('a');
            link.download = `QR_${assetItem.Asset_ID}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
        };

        img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
    };

    return (
        <div style={styles.overlay}>
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                style={styles.modal}
            >
                <div style={styles.header}>
                    <div>
                        <h2 style={styles.title}>🏷️ QR Label Generator</h2>
                        <p style={styles.subtitle}>Generate printable QR codes for physical asset tagging</p>
                    </div>
                    <button onClick={onClose} style={styles.closeBtn}>✕</button>
                </div>

                {/* Controls */}
                <div style={styles.controls}>
                    {!asset && (
                        <div style={styles.controlGroup}>
                            <label style={styles.controlLabel}>Mode</label>
                            <div style={styles.toggleGroup}>
                                <button
                                    onClick={() => setMode('bulk')}
                                    style={{ ...styles.toggleBtn, ...(mode === 'bulk' ? styles.toggleActive : {}) }}
                                >
                                    Bulk ({selectedIds.length})
                                </button>
                            </div>
                        </div>
                    )}

                    <div style={styles.controlGroup}>
                        <label style={styles.controlLabel}>Label Size</label>
                        <div style={styles.toggleGroup}>
                            {['small', 'medium', 'large'].map(size => (
                                <button
                                    key={size}
                                    onClick={() => setLabelSize(size)}
                                    style={{ ...styles.toggleBtn, ...(labelSize === size ? styles.toggleActive : {}) }}
                                >
                                    {size.charAt(0).toUpperCase() + size.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div style={styles.controlGroup}>
                        <label style={styles.controlLabel}>
                            <input
                                type="checkbox"
                                checked={includeDetails}
                                onChange={(e) => setIncludeDetails(e.target.checked)}
                                style={{ marginRight: '8px' }}
                            />
                            Include Asset Details
                        </label>
                    </div>
                </div>

                {/* Preview */}
                <div style={styles.previewArea}>
                    <div ref={printRef} style={styles.labelGrid}>
                        {targetAssets.length === 0 ? (
                            <div style={styles.emptyState}>
                                <span>📭</span>
                                <p>No assets selected. Select assets from the inventory to generate QR codes.</p>
                            </div>
                        ) : (
                            targetAssets.map(item => (
                                <div
                                    key={item.Asset_ID}
                                    style={{ ...styles.label, width: currentSize.label.width, padding: currentSize.label.padding }}
                                    className="label"
                                >
                                    <div className="qr-code" style={styles.qrWrapper}>
                                        <QRCodeSVG
                                            id={`qr-${item.Asset_ID}`}
                                            value={getQRData(item)}
                                            size={currentSize.qr}
                                            level="M"
                                            includeMargin={true}
                                        />
                                    </div>
                                    {includeDetails && (
                                        <div style={styles.labelDetails}>
                                            <div className="asset-id" style={styles.labelId}>{item.Asset_ID}</div>
                                            <div className="asset-name" style={styles.labelName}>{item.Item_Name}</div>
                                            <div className="asset-category" style={styles.labelCategory}>{item.Category}</div>
                                        </div>
                                    )}
                                    {mode === 'single' && (
                                        <button
                                            onClick={() => downloadQR(item)}
                                            style={styles.downloadBtn}
                                        >
                                            ⬇️ Download PNG
                                        </button>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Actions */}
                <div style={styles.actions}>
                    <button onClick={onClose} style={styles.cancelBtn}>Cancel</button>
                    <button
                        onClick={handlePrint}
                        disabled={targetAssets.length === 0}
                        style={{ ...styles.printBtn, opacity: targetAssets.length === 0 ? 0.5 : 1 }}
                    >
                        🖨️ Print Labels ({targetAssets.length})
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

const styles = {
    overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 },
    modal: { background: 'var(--surface)', width: '90%', maxWidth: '800px', maxHeight: '90vh', borderRadius: '24px', overflow: 'hidden', display: 'flex', flexDirection: 'column' },

    header: { padding: '24px 32px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
    title: { fontSize: '24px', fontWeight: '800', marginBottom: '4px' },
    subtitle: { fontSize: '13px', color: 'var(--textSecondary)' },
    closeBtn: { background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: 'var(--textSecondary)' },

    controls: { padding: '20px 32px', background: 'var(--background)', borderBottom: '1px solid var(--border)', display: 'flex', gap: '24px', flexWrap: 'wrap' },
    controlGroup: { display: 'flex', flexDirection: 'column', gap: '8px' },
    controlLabel: { fontSize: '12px', fontWeight: '700', color: 'var(--textSecondary)', textTransform: 'uppercase' },
    toggleGroup: { display: 'flex', gap: '8px' },
    toggleBtn: { padding: '8px 16px', borderRadius: '10px', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text)', fontSize: '12px', fontWeight: '600', cursor: 'pointer' },
    toggleActive: { background: 'var(--accent)', color: 'white', borderColor: 'var(--accent)' },

    previewArea: { flex: 1, overflowY: 'auto', padding: '24px 32px' },
    labelGrid: { display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center' },

    label: { background: 'white', borderRadius: '16px', border: '1px solid var(--border)', textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' },
    qrWrapper: { marginBottom: '12px' },
    labelDetails: { marginBottom: '12px' },
    labelId: { fontSize: '14px', fontWeight: '800', color: 'var(--accent)', marginBottom: '4px' },
    labelName: { fontSize: '12px', color: 'var(--text)', marginBottom: '4px' },
    labelCategory: { fontSize: '10px', color: 'var(--textSecondary)', textTransform: 'uppercase' },
    downloadBtn: { padding: '8px 16px', borderRadius: '8px', border: 'none', background: 'var(--background)', color: 'var(--accent)', fontSize: '11px', fontWeight: '700', cursor: 'pointer', marginTop: '8px' },

    emptyState: { textAlign: 'center', padding: '60px', color: 'var(--textSecondary)', width: '100%' },

    actions: { padding: '20px 32px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end', gap: '12px' },
    cancelBtn: { padding: '12px 24px', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--background)', color: 'var(--text)', fontSize: '14px', fontWeight: '600', cursor: 'pointer' },
    printBtn: { padding: '12px 24px', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', fontSize: '14px', fontWeight: '700', cursor: 'pointer' }
};

export default QRGenerator;
