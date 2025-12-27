import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const BarcodeGenerator = ({ assets = [] }) => {
    const [selectedAssets, setSelectedAssets] = useState([]);
    const [tagSize, setTagSize] = useState('md'); // 'sm' | 'md' | 'lg'
    const [searchTerm, setSearchTerm] = useState('');

    const toggleAsset = (asset) => {
        const isSelected = selectedAssets.find(a => a.Asset_ID === asset.Asset_ID);
        if (isSelected) {
            setSelectedAssets(selectedAssets.filter(a => a.Asset_ID !== asset.Asset_ID));
        } else {
            setSelectedAssets([...selectedAssets, asset]);
        }
    };

    const selectAll = () => {
        const filtered = assets.filter(a =>
            a.Asset_ID.toLowerCase().includes(searchTerm.toLowerCase()) ||
            a.Item_Name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setSelectedAssets(prev => {
            const newBatch = [...prev];
            filtered.forEach(f => {
                if (!newBatch.find(b => b.Asset_ID === f.Asset_ID)) newBatch.push(f);
            });
            return newBatch;
        });
    };

    const clearAll = () => setSelectedAssets([]);

    const getSizePx = () => {
        if (tagSize === 'sm') return { width: '140px', qr: '70px', font: '11px' };
        if (tagSize === 'lg') return { width: '280px', qr: '140px', font: '18px' };
        return { width: '200px', qr: '100px', font: '14px' };
    };

    const handlePrint = () => window.print();

    const filteredAssets = assets.filter(a =>
        a.Asset_ID.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.Item_Name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div style={styles.container}>
            <div style={styles.noPrint}>
                <div style={styles.header}>
                    <div>
                        <h2 style={styles.title}>🏷️ Bluewud Tag Studio</h2>
                        <p style={styles.subtitle}>Batch generate enterprise-grade QR labels for Bluewud Asset Tracking.</p>
                    </div>
                    <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                        <select
                            style={styles.sizeSelect}
                            value={tagSize}
                            onChange={(e) => setTagSize(e.target.value)}
                        >
                            <option value="sm">Compact Tags</option>
                            <option value="md">Standard (Avery Style)</option>
                            <option value="lg">Large Industrial</option>
                        </select>
                        <button
                            style={styles.primaryBtn}
                            onClick={handlePrint}
                            disabled={selectedAssets.length === 0}
                        >
                            🖨️ Print {selectedAssets.length} Labels
                        </button>
                    </div>
                </div>

                <div style={styles.selector} className="glass-card">
                    <div style={styles.selectorHeader}>
                        <div style={styles.searchBox}>
                            <span style={{ marginRight: '10px' }}>🔍</span>
                            <input
                                type="text"
                                placeholder="Filter assets..."
                                style={styles.filterInput}
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div style={styles.batchActions}>
                            <button style={styles.batchBtn} onClick={selectAll}>Select Visible</button>
                            <button style={styles.batchBtn} onClick={clearAll}>Clear All</button>
                        </div>
                    </div>
                    <div style={styles.list}>
                        {filteredAssets.map(asset => {
                            const isSelected = !!selectedAssets.find(a => a.Asset_ID === asset.Asset_ID);
                            return (
                                <motion.div
                                    key={asset.Asset_ID}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    style={{
                                        ...styles.listItem,
                                        background: isSelected ? 'var(--accentLight)' : 'var(--background)',
                                        borderColor: isSelected ? 'var(--accent)' : 'var(--border)',
                                        color: isSelected ? 'var(--accent)' : 'var(--text)'
                                    }}
                                    onClick={() => toggleAsset(asset)}
                                >
                                    <div style={{
                                        ...styles.miniCheck,
                                        background: isSelected ? 'var(--accent)' : 'transparent',
                                        borderColor: isSelected ? 'var(--accent)' : 'var(--border)'
                                    }}>
                                        {isSelected && "✓"}
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <span style={{ fontWeight: '800', fontSize: '12px' }}>{asset.Asset_ID}</span>
                                        <span style={{ fontSize: '10px', opacity: 0.7 }}>{asset.Item_Name}</span>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {selectedAssets.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={styles.previewSection}
                    >
                        <div style={styles.previewHeader} className="no-print">
                            <h3 style={{ margin: 0 }}>Print Preview</h3>
                            <span style={styles.counter}>{selectedAssets.length} Labels Ready</span>
                        </div>

                        <div style={styles.grid} id="printable-area">
                            {selectedAssets.map(asset => {
                                const dims = getSizePx();
                                return (
                                    <div key={asset.Asset_ID} style={{ ...styles.tag, width: dims.width }}>
                                        <div style={styles.tagBrand}>BLUEWUD ASSETS</div>
                                        <div style={styles.tagDivider} />
                                        <img
                                            src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${asset.Asset_ID}`}
                                            alt={asset.Asset_ID}
                                            style={{ ...styles.qr, width: dims.qr, height: dims.qr }}
                                        />
                                        <div style={styles.tagInfo}>
                                            <div style={{ ...styles.tagCode, fontSize: dims.font }}>{asset.Asset_ID}</div>
                                            <div style={{ ...styles.tagName, fontSize: `calc(${dims.font} - 4px)` }}>{asset.Item_Name}</div>
                                        </div>
                                        <div style={styles.tagFooter}>SECURED BY LEDGER</div>
                                    </div>
                                );
                            })}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <style>{`
                @media print {
                    body * { visibility: hidden; background: white !important; }
                    #printable-area, #printable-area * { visibility: visible; }
                    #printable-area {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                        display: grid !important;
                        grid-template-columns: repeat(3, 1fr) !important;
                        gap: 20px !important;
                        padding: 20px;
                    }
                    .no-print { display: none !important; }
                }
            `}</style>
        </div>
    );
};

const styles = {
    container: { padding: '24px', maxWidth: '1200px', margin: '0 auto' },
    header: { marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    title: { fontSize: '28px', fontWeight: '900', color: 'var(--text)' },
    subtitle: { color: 'var(--textSecondary)', fontSize: '14px' },
    primaryBtn: { padding: '12px 28px', background: 'var(--accent)', color: 'white', border: 'none', borderRadius: '14px', fontWeight: '800', cursor: 'pointer', transition: '0.2s', boxShadow: '0 4px 15px rgba(9, 132, 227, 0.3)' },
    sizeSelect: { padding: '12px 20px', borderRadius: '14px', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text)', outline: 'none', fontWeight: '700', cursor: 'pointer' },

    selector: { padding: '30px', borderRadius: '24px', border: '1px solid var(--border)', background: 'var(--surface)', marginBottom: '40px' },
    selectorHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', gap: '20px' },
    searchBox: { flex: 1, display: 'flex', alignItems: 'center', background: 'var(--background)', padding: '12px 20px', borderRadius: '14px', border: '1px solid var(--border)' },
    filterInput: { background: 'transparent', border: 'none', color: 'var(--text)', outline: 'none', width: '100%', fontWeight: '600' },
    batchActions: { display: 'flex', gap: '10px' },
    batchBtn: { padding: '8px 16px', borderRadius: '10px', border: '1px solid var(--border)', background: 'var(--background)', color: 'var(--textSecondary)', fontSize: '12px', fontWeight: '800', cursor: 'pointer', transition: '0.2s' },

    list: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px', maxHeight: '350px', overflowY: 'auto', paddingRight: '10px' },
    listItem: { padding: '15px', borderRadius: '15px', border: '1px solid var(--border)', cursor: 'pointer', display: 'flex', gap: '15px', alignItems: 'center', transition: '0.2s' },
    miniCheck: { width: '18px', height: '18px', border: '2px solid var(--border)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: 'white', fontWeight: 'bold' },

    previewSection: { marginTop: '40px', borderTop: '2px dashed var(--border)', paddingTop: '40px' },
    previewHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' },
    counter: { background: 'var(--accentLight)', color: 'var(--accent)', padding: '6px 16px', borderRadius: '20px', fontWeight: '900', fontSize: '12px' },

    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '30px' },
    tag: {
        border: '1px solid #000', borderRadius: '4px', padding: '20px',
        display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
        background: 'white', color: 'black', position: 'relative', overflow: 'hidden'
    },
    tagBrand: { fontSize: '10px', fontWeight: '900', letterSpacing: '2px', marginBottom: '8px' },
    tagDivider: { width: '40px', height: '2px', background: '#000', marginBottom: '15px' },
    qr: { padding: '5px', border: '1px solid #eee' },
    tagInfo: { marginTop: '15px' },
    tagCode: { fontWeight: '900', marginBottom: '4px' },
    tagName: { fontWeight: '600', opacity: 0.8 },
    tagFooter: { marginTop: '15px', fontSize: '7px', fontWeight: '800', opacity: 0.5, borderTop: '1px solid #eee', pt: '8px', width: '100%' }
};

export default BarcodeGenerator;
