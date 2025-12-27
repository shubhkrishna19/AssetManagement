import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ReminderManager = ({ assets = [], reminders = [], onUpdateReminders }) => {
    const [isAdding, setIsAdding] = useState(false);
    const [newReminder, setNewReminder] = useState({
        assetId: '',
        type: 'Maintenance',
        frequency: 'Quarterly', // Monthly, Quarterly, Yearly, Custom
        startDate: new Date().toISOString().split('T')[0],
        notes: ''
    });

    const frequencies = ['Monthly', 'Quarterly', 'Yearly', 'Custom'];
    const types = ['Maintenance', 'Physical Audit', 'Safety Check', 'Software Update'];

    const handleAdd = () => {
        if (!newReminder.assetId) {
            alert('Please select an asset.');
            return;
        }
        onUpdateReminders([...reminders, { ...newReminder, id: Date.now(), lastTriggered: null }]);
        setIsAdding(false);
        setNewReminder({ assetId: '', type: 'Maintenance', frequency: 'Quarterly', startDate: new Date().toISOString().split('T')[0], notes: '' });
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <div>
                    <h2 style={styles.title}>🔔 Intelligent Reminders</h2>
                    <p style={styles.subtitle}>Automate your asset lifecycle with recurring maintenance and audit alerts.</p>
                </div>
                <button
                    style={styles.addBtn}
                    onClick={() => setIsAdding(true)}
                >
                    + Create Schedule
                </button>
            </div>

            <div style={styles.grid}>
                <AnimatePresence>
                    {isAdding && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            style={styles.addCard}
                        >
                            <h3 style={styles.cardTitle}>New Schedule</h3>
                            <div style={styles.form}>
                                <div style={styles.field}>
                                    <label style={styles.label}>Select Asset</label>
                                    <select
                                        style={styles.input}
                                        value={newReminder.assetId}
                                        onChange={e => setNewReminder({ ...newReminder, assetId: e.target.value })}
                                    >
                                        <option value="">Choose an asset...</option>
                                        {assets.map(a => (
                                            <option key={a.Asset_ID} value={a.Asset_ID}>
                                                {a.Asset_ID} - {a.Item_Name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div style={styles.row}>
                                    <div style={styles.field}>
                                        <label style={styles.label}>Activity Type</label>
                                        <select
                                            style={styles.input}
                                            value={newReminder.type}
                                            onChange={e => setNewReminder({ ...newReminder, type: e.target.value })}
                                        >
                                            {types.map(t => <option key={t} value={t}>{t}</option>)}
                                        </select>
                                    </div>
                                    <div style={styles.field}>
                                        <label style={styles.label}>Frequency</label>
                                        <select
                                            style={styles.input}
                                            value={newReminder.frequency}
                                            onChange={e => setNewReminder({ ...newReminder, frequency: e.target.value })}
                                        >
                                            {frequencies.map(f => <option key={f} value={f}>{f}</option>)}
                                        </select>
                                    </div>
                                </div>

                                <div style={styles.field}>
                                    <label style={styles.label}>Start Date</label>
                                    <input
                                        type="date"
                                        style={styles.input}
                                        value={newReminder.startDate}
                                        onChange={e => setNewReminder({ ...newReminder, startDate: e.target.value })}
                                    />
                                </div>

                                <div style={styles.btnRow}>
                                    <button style={styles.cancelBtn} onClick={() => setIsAdding(false)}>Cancel</button>
                                    <button style={styles.saveBtn} onClick={handleAdd}>Save Schedule</button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {reminders.length === 0 && !isAdding ? (
                    <div style={styles.emptyState}>
                        <div style={styles.emptyIcon}>📅</div>
                        <h3>No Active Schedules</h3>
                        <p>Create a maintenance or audit cycle to begin monitoring.</p>
                    </div>
                ) : (
                    reminders.map(rem => {
                        const asset = assets.find(a => a.Asset_ID === rem.assetId);
                        return (
                            <motion.div
                                layout
                                key={rem.id}
                                style={styles.reminderCard}
                            >
                                <div style={styles.reminderTop}>
                                    <div style={styles.typeTag}>{rem.type}</div>
                                    <div style={styles.freqBadge}>{rem.frequency}</div>
                                </div>
                                <div style={styles.assetName}>{asset?.Item_Name || 'Unknown Asset'}</div>
                                <div style={styles.assetId}>{rem.assetId}</div>

                                <div style={styles.reminderStatus}>
                                    <div style={styles.statusLine}>
                                        <span>Next Due:</span>
                                        <strong>{rem.startDate}</strong>
                                    </div>
                                    <div style={styles.progressBar}>
                                        <div style={{ ...styles.progressFill, width: '65%' }} />
                                    </div>
                                </div>

                                <div style={styles.cardActions}>
                                    <button style={styles.editBtn}>Edit</button>
                                    <button
                                        style={styles.deleteBtn}
                                        onClick={() => onUpdateReminders(reminders.filter(r => r.id !== rem.id))}
                                    >
                                        Remove
                                    </button>
                                </div>
                            </motion.div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

const styles = {
    container: { padding: '24px', maxWidth: '1200px', margin: '0 auto' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' },
    title: { fontSize: '28px', fontWeight: '900', color: 'var(--text)', marginBottom: '8px' },
    subtitle: { fontSize: '14px', color: 'var(--textSecondary)', maxWidth: '500px' },
    addBtn: { background: 'var(--accent)', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '14px', fontWeight: '800', cursor: 'pointer', boxShadow: '0 8px 16px rgba(0,0,0,0.1)' },

    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' },

    addCard: { background: 'var(--surface)', border: '1px solid var(--accent)', borderRadius: '24px', padding: '24px', boxShadow: 'var(--shadow)' },
    cardTitle: { fontSize: '18px', fontWeight: '900', marginBottom: '20px' },
    form: { display: 'flex', flexDirection: 'column', gap: '16px' },
    field: { display: 'flex', flexDirection: 'column', gap: '8px' },
    label: { fontSize: '12px', fontWeight: '800', color: 'var(--textSecondary)', textTransform: 'uppercase' },
    input: { padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--background)', color: 'var(--text)', outline: 'none', fontSize: '14px' },
    row: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' },
    btnRow: { display: 'flex', gap: '12px', marginTop: '8px' },
    saveBtn: { flex: 1, background: 'var(--accent)', color: 'white', border: 'none', padding: '12px', borderRadius: '12px', fontWeight: '800', cursor: 'pointer' },
    cancelBtn: { padding: '12px 20px', border: '1px solid var(--border)', background: 'transparent', borderRadius: '12px', fontWeight: '700', cursor: 'pointer' },

    reminderCard: { background: 'var(--surface)', borderRadius: '24px', padding: '24px', border: '1px solid var(--border)', boxShadow: 'var(--shadow)', position: 'relative' },
    reminderTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' },
    typeTag: { background: 'rgba(var(--accentRGB), 0.1)', color: 'var(--accent)', padding: '4px 12px', borderRadius: '20px', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase' },
    freqBadge: { fontSize: '11px', fontWeight: '800', color: 'var(--textSecondary)' },
    assetName: { fontSize: '18px', fontWeight: '900', marginBottom: '4px' },
    assetId: { fontSize: '12px', fontWeight: '800', opacity: 0.6, marginBottom: '20px' },

    reminderStatus: { marginBottom: '20px' },
    statusLine: { display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '8px' },
    progressBar: { height: '6px', background: 'var(--background)', borderRadius: '3px', overflow: 'hidden' },
    progressFill: { height: '100%', background: 'linear-gradient(90deg, var(--accent), #6366f1)' },

    cardActions: { display: 'flex', gap: '12px', borderTop: '1px solid var(--border)', paddingTop: '16px' },
    editBtn: { flex: 1, background: 'transparent', border: '1px solid var(--border)', padding: '8px', borderRadius: '10px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' },
    deleteBtn: { flex: 1, background: 'rgba(231, 76, 60, 0.1)', color: '#e74c3c', border: 'none', padding: '8px', borderRadius: '10px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' },

    emptyState: { gridColumn: '1 / -1', textAlign: 'center', padding: '80px 40px', background: 'var(--surface)', borderRadius: '32px', border: '2px dashed var(--border)' },
    emptyIcon: { fontSize: '48px', marginBottom: '20px' }
};

export default ReminderManager;
