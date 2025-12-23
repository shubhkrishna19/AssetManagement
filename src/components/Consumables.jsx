import React, { useState } from 'react';
import { useAudit } from '../context/AuditContext';
import { useUser } from '../context/UserContext';

const Consumables = ({ items = [], updateConsumable }) => {
    const [selectedItem, setSelectedItem] = useState(null);
    const [actionType, setActionType] = useState(null); // 'dispense' | 'restock'
    const [amount, setAmount] = useState(1);
    const [showPOModal, setShowPOModal] = useState(false);
    const [poData, setPoData] = useState({ itemName: '', quantity: 1, vendor: '' });
    const { logAction } = useAudit();
    const { currentUser } = useUser();

    const handleUpdate = () => {
        if (!selectedItem || amount <= 0) return;

        let newQty = selectedItem.quantity;
        if (actionType === 'dispense') {
            newQty = Math.max(0, selectedItem.quantity - parseInt(amount));
        } else {
            newQty = selectedItem.quantity + parseInt(amount);
        }

        // Recalculate status
        let newStatus = 'In Stock';
        if (newQty === 0) newStatus = 'Out of Stock';
        else if (newQty <= selectedItem.threshold) newStatus = 'Low Stock';

        updateConsumable(selectedItem.id, { quantity: newQty, status: newStatus });

        logAction('CONSUMABLE_UPDATE',
            `${actionType === 'dispense' ? 'Dispensed' : 'Restocked'} ${amount} ${selectedItem.unit} of ${selectedItem.name}`,
            currentUser.name,
            actionType === 'dispense' ? 'warning' : 'success'
        );

        alert(`✅ Successfully ${actionType === 'dispense' ? 'dispensed' : 'restocked'} ${selectedItem.name}.`);
        setSelectedItem(null);
        setAmount(1);
    };

    const handlePOSubmit = (e) => {
        e.preventDefault();
        const matchingItem = items.find(i => i.name.toLowerCase() === poData.itemName.toLowerCase());

        if (matchingItem) {
            const newQty = matchingItem.quantity + parseInt(poData.quantity);
            const newStatus = newQty > matchingItem.threshold ? 'In Stock' : 'Low Stock';
            updateConsumable(matchingItem.id, { quantity: newQty, status: newStatus });
        }

        logAction('PURCHASE_ORDER', `Executed PO for ${poData.quantity} units of ${poData.itemName} from ${poData.vendor}`, currentUser.name, 'success');
        alert(`🚀 Purchase Order Sent! Stock for ${poData.itemName} will be updated upon delivery simulation.`);
        setShowPOModal(false);
        setPoData({ itemName: '', quantity: 1, vendor: '' });
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <div>
                    <h2 style={styles.title}>Consumables Inventory</h2>
                    <p style={styles.subtitle}>Track stock levels for office supplies and parts.</p>
                </div>
                <button style={styles.primaryBtn} onClick={() => setShowPOModal(true)}>
                    + Create Purchase Order
                </button>
            </div>

            <div style={styles.grid}>
                {items.map(item => (
                    <div key={item.id} style={styles.card} className="glass-card">
                        <div style={styles.cardHeader}>
                            <span style={styles.category}>{item.category}</span>
                            <span style={{
                                ...styles.badge,
                                background: item.status === 'In Stock' ? 'var(--success)' : item.status === 'Low Stock' ? 'var(--warning)' : 'var(--danger)'
                            }}>
                                {item.status}
                            </span>
                        </div>
                        <h3 style={styles.itemName}>{item.name}</h3>

                        <div style={styles.stockInfo}>
                            <div style={styles.stat}>
                                <span style={styles.statValue}>{item.quantity}</span>
                                <span style={styles.statLabel}>{item.unit}</span>
                            </div>
                            <div style={styles.thresholdInfo}>
                                Alert at: <strong>{item.threshold} {item.unit}</strong>
                            </div>
                        </div>

                        <div style={styles.progressBar}>
                            <div style={{
                                ...styles.progressFill,
                                width: `${Math.min(100, (item.quantity / (item.threshold * 3)) * 100)}%`,
                                background: item.quantity <= item.threshold ? 'var(--danger)' : 'var(--accent)'
                            }} />
                        </div>

                        <div style={styles.actions}>
                            <button
                                style={styles.actionBtn}
                                onClick={() => { setSelectedItem(item); setActionType('dispense'); }}
                                disabled={item.quantity === 0}
                            >
                                ➖ Dispense
                            </button>
                            <button
                                style={styles.actionBtn}
                                onClick={() => { setSelectedItem(item); setActionType('restock'); }}
                            >
                                ➕ Restock
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Dispense/Restock Modal */}
            {selectedItem && (
                <div style={styles.overlay}>
                    <div style={styles.modal}>
                        <h3>{actionType === 'dispense' ? 'Dispense Item' : 'Restock Item'}</h3>
                        <p>How many units of <strong>{selectedItem.name}</strong>?</p>

                        <input
                            type="number"
                            min="1"
                            max={actionType === 'dispense' ? selectedItem.quantity : 1000}
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            style={styles.input}
                            autoFocus
                        />

                        <div style={styles.modalActions}>
                            <button style={styles.cancelBtn} onClick={() => setSelectedItem(null)}>Cancel</button>
                            <button style={styles.confirmBtn} onClick={handleUpdate}>Confirm</button>
                        </div>
                    </div>
                </div>
            )}

            {/* PO Modal */}
            {showPOModal && (
                <div style={styles.overlay}>
                    <div style={{ ...styles.modal, width: '400px' }}>
                        <h3 style={{ marginBottom: '20px' }}>📦 New Purchase Order</h3>
                        <form onSubmit={handlePOSubmit} style={{ textAlign: 'left' }}>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Consumable Item</label>
                                <select
                                    style={styles.input}
                                    required
                                    value={poData.itemName}
                                    onChange={e => setPoData({ ...poData, itemName: e.target.value })}
                                >
                                    <option value="">Select Item...</option>
                                    {items.map(i => <option key={i.id} value={i.name}>{i.name}</option>)}
                                </select>
                            </div>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Quantity to Order</label>
                                <input
                                    type="number"
                                    style={styles.input}
                                    min="1"
                                    required
                                    value={poData.quantity}
                                    onChange={e => setPoData({ ...poData, quantity: e.target.value })}
                                />
                            </div>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Vendor Selection</label>
                                <select style={styles.input} required>
                                    <option>TechSupply Corp</option>
                                    <option>Office Depot Pro</option>
                                    <option>Global Logistics</option>
                                </select>
                            </div>
                            <div style={{ ...styles.modalActions, marginTop: '30px' }}>
                                <button type="button" style={styles.cancelBtn} onClick={() => setShowPOModal(false)}>Cancel</button>
                                <button type="submit" style={styles.confirmBtn}>Submit Order</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

const styles = {
    container: { padding: '24px', maxWidth: '1400px', margin: '0 auto' },
    header: { marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    title: { fontSize: '28px', fontWeight: '800', marginBottom: '8px' },
    subtitle: { color: 'var(--textSecondary)', fontSize: '14px' },
    primaryBtn: { padding: '12px 24px', background: 'var(--accent)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: '700', cursor: 'pointer' },

    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' },
    card: { padding: '24px', borderRadius: '20px', background: 'var(--surface)', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column' },
    cardHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: '16px' },
    category: { fontSize: '12px', fontWeight: 'bold', color: 'var(--textSecondary)', letterSpacing: '1px', textTransform: 'uppercase' },
    badge: { padding: '4px 10px', borderRadius: '8px', fontSize: '10px', fontWeight: '800', color: 'white' },
    itemName: { fontSize: '18px', fontWeight: '800', marginBottom: '20px' },

    stockInfo: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '16px' },
    stat: { display: 'flex', alignItems: 'baseline', gap: '4px' },
    statValue: { fontSize: '32px', fontWeight: '900', color: 'var(--text)' },
    statLabel: { fontSize: '14px', fontWeight: '600', color: 'var(--textSecondary)' },
    thresholdInfo: { fontSize: '12px', color: 'var(--textSecondary)' },

    progressBar: { height: '8px', background: 'var(--background)', borderRadius: '4px', overflow: 'hidden', marginBottom: '24px' },
    progressFill: { height: '100%', borderRadius: '4px', transition: 'width 0.5s ease' },

    actions: { display: 'flex', gap: '10px', marginTop: 'auto' },
    actionBtn: { flex: 1, padding: '10px', background: 'var(--background)', border: '1px solid var(--border)', borderRadius: '10px', fontWeight: '700', cursor: 'pointer', transition: '0.2s', color: 'var(--text)' },

    overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
    modal: { background: 'var(--surface)', padding: '30px', borderRadius: '24px', width: '300px', textAlign: 'center' },
    input: { width: '80%', padding: '12px', fontSize: '18px', fontWeight: 'bold', textAlign: 'center', margin: '10px 0', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--background)', color: 'var(--text)' },
    modalActions: { display: 'flex', gap: '10px', justifyContent: 'center' },
    confirmBtn: { padding: '12px 24px', background: 'var(--accent)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', flex: 1 },
    cancelBtn: { padding: '12px 24px', background: 'transparent', color: 'var(--text)', border: '1px solid var(--border)', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', flex: 1 },
    formGroup: { marginBottom: '16px' },
    label: { display: 'block', fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', color: 'var(--textSecondary)', marginBottom: '8px' }
};

export default Consumables;
