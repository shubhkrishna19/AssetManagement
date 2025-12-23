import React, { useState } from 'react';

const BarcodeGenerator = ({ assets = [] }) => {
    const [selectedAssets, setSelectedAssets] = useState([]);
    const [tagSize, setTagSize] = useState('md'); // 'sm' | 'md' | 'lg'

    const toggleAsset = (asset) => {
        if (selectedAssets.find(a => a.Asset_ID === asset.Asset_ID)) {
            setSelectedAssets(selectedAssets.filter(a => a.Asset_ID !== asset.Asset_ID));
        } else {
            setSelectedAssets([...selectedAssets, asset]);
        }
    };

    const selectAll = () => setSelectedAssets([...assets]);
    const clearAll = () => setSelectedAssets([]);

    const getSizePx = () => {
        if (tagSize === 'sm') return { width: '120px', qr: '60px', font: '10px' };
        if (tagSize === 'lg') return { width: '250px', qr: '120px', font: '16px' };
        return { width: '180px', qr: '90px', font: '13px' };
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div style={styles.container}>
            <div style={styles.noPrint}>
                <div style={styles.header}>
                    <div>
                        <h2 style={styles.title}>🏷️ Asset Tag Generator v2</h2>
                        <p style={styles.subtitle}>Batch generate enterprise-grade QR labels for physical tracking.</p>
                    </div>
                    <div style={{ display: 'flex', gap: '15px' }}>
                        <select
                            style={styles.sizeSelect}
                            value={tagSize}
                            onChange={(e) => setTagSize(e.target.value)}
                        >
                            <option value="sm">Small Tags</option>
                            <option value="md">Standard Tags</option>
                            <option value="lg">Large Industrial</option>
                        </select>
                        <button style={styles.primaryBtn} onClick={handlePrint} disabled={selectedAssets.length === 0}>
                            🖨️ Print {selectedAssets.length} Labels
                        </button>
                    </div>
                </div>

                <div style={styles.selector}>
                    <div style={styles.selectorHeader}>
                        <h4>Select Assets:</h4>
                        <div style={styles.batchActions}>
                            <button style={styles.batchBtn} onClick={selectAll}>Select All</button>
                            <button style={styles.batchBtn} onClick={clearAll}>Clear All</button>
                        </div>
                    </div>
                    <div style={styles.list}>
                        {assets.map(asset => {
                            const isSelected = !!selectedAssets.find(a => a.Asset_ID === asset.Asset_ID);
                            return (
                                <div
                                    key={asset.Asset_ID}
                                    style={{
                                        ...styles.listItem,
                                        background: isSelected ? 'var(--accentLight)' : 'var(--surface)',
                                        borderColor: isSelected ? 'var(--accent)' : 'var(--border)'
                                    }}
                                    onClick={() => toggleAsset(asset)}
                                >
                                    <span style={styles.checkbox}>{isSelected ? '☑' : '☐'}</span>
                                    <span style={{ fontWeight: 'bold' }}>{asset.Asset_ID}</span>
                                    <span style={{ color: 'var(--textSecondary)' }}> - {asset.Item_Name}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {selectedAssets.length > 0 && (
                <div style={styles.previewSection}>
                    <h3 style={styles.noPrint}>Print Preview:</h3>
                    <div style={styles.grid} id="printable-area">
                        {selectedAssets.map(asset => {
                            const dims = getSizePx();
                            return (
                                <div key={asset.Asset_ID} style={{ ...styles.tag, width: dims.width }}>
                                    <div style={styles.tagHeader}>Asset Ledger Pro</div>
                                    <img
                                        src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${asset.Asset_ID}`}
                                        alt={asset.Asset_ID}
                                        style={{ ...styles.qr, width: dims.qr, height: dims.qr }}
                                    />
                                    <div style={{ ...styles.tagCode, fontSize: dims.font }}>{asset.Asset_ID}</div>
                                    <div style={{ ...styles.tagName, fontSize: `calc(${dims.font} - 3px)` }}>{asset.Category}</div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            <style>{`
        @media print {
            body * {
                visibility: hidden;
            }
            #printable-area, #printable-area * {
                visibility: visible;
            }
            #printable-area {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                display: grid !important;
                grid-template-columns: repeat(3, 1fr) !important;
                gap: 20px !important;
            }
            .glass-card { box-shadow: none !important; border: 1px solid #ccc !important; }
        }
      `}</style>
        </div>
    );
};

const styles = {
    container: { padding: '24px', maxWidth: '1200px', margin: '0 auto' },
    header: { marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    title: { fontSize: '28px', fontWeight: '800', marginBottom: '8px' },
    subtitle: { color: 'var(--textSecondary)', fontSize: '14px' },
    primaryBtn: { padding: '12px 24px', background: 'var(--accent)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: '700', cursor: 'pointer' },
    sizeSelect: { padding: '10px 15px', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text)', outline: 'none', fontWeight: 'bold' },

    selector: { marginBottom: '40px', background: 'var(--surface)', padding: '24px', borderRadius: '24px', border: '1px solid var(--border)' },
    selectorHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' },
    batchActions: { display: 'flex', gap: '8px' },
    batchBtn: { padding: '6px 12px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--background)', color: 'var(--textSecondary)', fontSize: '11px', fontWeight: '700', cursor: 'pointer' },
    list: { display: 'flex', flexWrap: 'wrap', gap: '10px', maxHeight: '300px', overflowY: 'auto', marginTop: '10px', paddingRight: '10px' },
    listItem: { padding: '8px 16px', borderRadius: '10px', border: '1px solid var(--border)', cursor: 'pointer', fontSize: '13px', display: 'flex', gap: '8px', alignItems: 'center', transition: '0.2s' },

    previewSection: { marginTop: '20px' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '20px' },

    tag: {
        border: '2px solid black', borderRadius: '8px', padding: '15px',
        display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
        background: 'white', color: 'black', pageBreakInside: 'avoid'
    },
    tagHeader: { fontSize: '10px', textTransform: 'uppercase', fontWeight: 'bold', marginBottom: '5px' },
    qr: { width: '80px', height: '80px', marginBottom: '5px' },
    tagCode: { fontSize: '14px', fontWeight: '900', letterSpacing: '1px' },
    tagName: { fontSize: '10px' },

    noPrint: {}
};

export default BarcodeGenerator;
