import React, { useState } from 'react';

const BarcodeGenerator = ({ assets = [] }) => {
    const [selectedAssets, setSelectedAssets] = useState([]);

    const toggleAsset = (asset) => {
        if (selectedAssets.find(a => a.ID === asset.ID)) {
            setSelectedAssets(selectedAssets.filter(a => a.ID !== asset.ID));
        } else {
            setSelectedAssets([...selectedAssets, asset]);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div style={styles.container}>
            <div style={styles.noPrint}>
                <div style={styles.header}>
                    <div>
                        <h2 style={styles.title}>Tag Generator</h2>
                        <p style={styles.subtitle}>Select assets to generate printable QR labels.</p>
                    </div>
                    <button style={styles.primaryBtn} onClick={handlePrint} disabled={selectedAssets.length === 0}>
                        🖨️ Print Labels
                    </button>
                </div>

                <div style={styles.selector}>
                    <h4>Select Assets:</h4>
                    <div style={styles.list}>
                        {assets.map(asset => (
                            <div
                                key={asset.ID}
                                style={{
                                    ...styles.listItem,
                                    background: selectedAssets.find(a => a.ID === asset.ID) ? 'var(--accentLight)' : 'var(--surface)',
                                    borderColor: selectedAssets.find(a => a.ID === asset.ID) ? 'var(--accent)' : 'var(--border)'
                                }}
                                onClick={() => toggleAsset(asset)}
                            >
                                <span style={styles.checkbox}>{selectedAssets.find(a => a.ID === asset.ID) ? '☑' : '☐'}</span>
                                <span style={{ fontWeight: 'bold' }}>{asset.Asset_ID}</span>
                                <span style={{ color: 'var(--textSecondary)' }}> - {asset.Item_Name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {selectedAssets.length > 0 && (
                <div style={styles.previewSection}>
                    <h3 style={styles.noPrint}>Print Preview:</h3>
                    <div style={styles.grid} id="printable-area">
                        {selectedAssets.map(asset => (
                            <div key={asset.ID} style={styles.tag}>
                                <div style={styles.tagHeader}>Asset Ledger Pro</div>
                                <img
                                    src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${asset.Asset_ID}`}
                                    alt={asset.Asset_ID}
                                    style={styles.qr}
                                />
                                <div style={styles.tagCode}>{asset.Asset_ID}</div>
                                <div style={styles.tagName}>{asset.Category}</div>
                            </div>
                        ))}
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

    selector: { marginBottom: '40px', background: 'var(--surface)', padding: '20px', borderRadius: '20px', border: '1px solid var(--border)' },
    list: { display: 'flex', flexWrap: 'wrap', gap: '10px', maxHeight: '200px', overflowY: 'auto', marginTop: '10px' },
    listItem: { padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border)', cursor: 'pointer', fontSize: '12px', display: 'flex', gap: '8px', alignItems: 'center' },

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
