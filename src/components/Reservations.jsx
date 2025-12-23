import React, { useState, useMemo } from 'react';
import { mockReservations } from '../mockData';
import { useUser } from '../context/UserContext';

const Reservations = ({ assets = [] }) => {
    const { currentUser } = useUser();
    const [view, setView] = useState('list'); // 'list' | 'new'
    const [reservations, setReservations] = useState(mockReservations);

    // Form State
    const [selectedAssetId, setSelectedAssetId] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [purpose, setPurpose] = useState('');

    // Filter assets that can be reserved (e.g., in use or available, but trackable)
    const reservableAssets = useMemo(() => {
        return assets.filter(a => ['Electronics', 'Vehicles', 'Equipment'].includes(a.Category));
    }, [assets]);

    const checkAvailability = (assetId, start, end) => {
        if (!assetId || !start || !end) return { available: true };

        const s = new Date(start).getTime();
        const e = new Date(end).getTime();

        const conflict = reservations.find(r => {
            if (r.assetId !== assetId || r.status === 'Cancelled') return false;
            const rStart = new Date(r.startDate).getTime();
            const rEnd = new Date(r.endDate).getTime();
            return (s < rEnd && e > rStart); // Strict overlap
        });

        return conflict ? { available: false, conflict } : { available: true };
    };

    const conflictInfo = useMemo(() => checkAvailability(selectedAssetId, startDate, endDate), [selectedAssetId, startDate, endDate, reservations]);

    const handleBook = (e) => {
        e.preventDefault();
        if (!selectedAssetId || !startDate || !endDate) return;

        const availability = checkAvailability(selectedAssetId, startDate, endDate);
        if (!availability.available) {
            alert(`❌ CONFLICT DETECTED: This asset is already booked by ${availability.conflict.userName} during this period.`);
            return;
        }

        const newRes = {
            id: Date.now(),
            assetId: selectedAssetId,
            userId: currentUser.id || 'user-x', // Fallback for demo
            userName: currentUser.name || 'Current User',
            startDate,
            endDate,
            status: 'Approved', // Auto-approve for demo
            purpose
        };

        setReservations([...reservations, newRes]);
        alert("✅ Reservation Confirmed!");
        setView('list');
        // Reset form
        setPurpose('');
        setStartDate('');
        setEndDate('');
        setSelectedAssetId('');
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <div>
                    <h2 style={styles.title}>Asset Reservations</h2>
                    <p style={styles.subtitle}>Book shared resources and view availability.</p>
                </div>
                <button
                    style={view === 'new' ? styles.secondaryBtn : styles.primaryBtn}
                    onClick={() => setView(view === 'new' ? 'list' : 'new')}
                >
                    {view === 'new' ? 'Cancel Booking' : '+ New Reservation'}
                </button>
            </div>

            {view === 'new' ? (
                <div style={styles.formCard} className="glass-card">
                    <h3 style={styles.cardTitle}>New Booking Request</h3>
                    <form onSubmit={handleBook} style={styles.form}>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Select Asset</label>
                            <select
                                style={styles.input}
                                value={selectedAssetId}
                                onChange={e => setSelectedAssetId(e.target.value)}
                                required
                            >
                                <option value="">-- Choose Asset --</option>
                                {reservableAssets.map(a => (
                                    <option key={a.Asset_ID} value={a.Asset_ID}>
                                        {a.Item_Name} ({a.Asset_ID})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div style={styles.row}>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Start Date</label>
                                <input
                                    type="date"
                                    style={styles.input}
                                    value={startDate}
                                    onChange={e => setStartDate(e.target.value)}
                                    min={new Date().toISOString().split('T')[0]}
                                    required
                                />
                            </div>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>End Date</label>
                                <input
                                    type="date"
                                    style={styles.input}
                                    value={endDate}
                                    onChange={e => setEndDate(e.target.value)}
                                    min={startDate}
                                    required
                                />
                            </div>
                        </div>

                        <div style={styles.formGroup}>
                            <label style={styles.label}>Purpose</label>
                            <input
                                type="text"
                                style={styles.input}
                                placeholder="e.g., Client Meeting, Field Visit"
                                value={purpose}
                                onChange={e => setPurpose(e.target.value)}
                                required
                            />
                        </div>

                        {!conflictInfo.available && (
                            <div style={styles.conflictPanel}>
                                ⚠️ <strong>Booking Conflict:</strong> {selectedAssetId} is reserved by <strong>{conflictInfo.conflict.userName}</strong> from {new Date(conflictInfo.conflict.startDate).toLocaleDateString()} to {new Date(conflictInfo.conflict.endDate).toLocaleDateString()}.
                            </div>
                        )}

                        <button
                            type="submit"
                            style={{ ...styles.submitBtn, opacity: conflictInfo.available ? 1 : 0.5 }}
                            disabled={!conflictInfo.available}
                        >
                            {conflictInfo.available ? 'Confirm Booking' : 'Resolve Conflict to Book'}
                        </button>
                    </form>
                </div>
            ) : (
                <div style={styles.timelineContainer}>
                    {reservations.length === 0 ? (
                        <div style={styles.empty}>
                            <span>📅</span>
                            <p>No active reservations found.</p>
                        </div>
                    ) : (
                        reservations.sort((a, b) => new Date(a.startDate) - new Date(b.startDate)).map(res => {
                            const asset = assets.find(a => a.Asset_ID === res.assetId) || { Item_Name: 'Unknown Asset' };
                            return (
                                <div key={res.id} style={styles.resCard}>
                                    <div style={styles.resDate}>
                                        <span style={styles.month}>{new Date(res.startDate).toLocaleString('default', { month: 'short' })}</span>
                                        <span style={styles.day}>{new Date(res.startDate).getDate()}</span>
                                    </div>
                                    <div style={styles.resInfo}>
                                        <h4 style={styles.resTitle}>{asset.Item_Name}</h4>
                                        <p style={styles.resMeta}>
                                            {new Date(res.startDate).toLocaleDateString()} ➔ {new Date(res.endDate).toLocaleDateString()}
                                        </p>
                                        <span style={styles.resUser}>👤 {res.userName} • {res.purpose}</span>
                                    </div>
                                    <div style={styles.resStatus}>
                                        <span style={{ ...styles.badge, background: res.status === 'Approved' ? 'var(--success)' : 'var(--warning)' }}>
                                            {res.status}
                                        </span>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            )}
        </div>
    );
};

const styles = {
    container: { padding: '24px', maxWidth: '1000px', margin: '0 auto' },
    header: { marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    title: { fontSize: '28px', fontWeight: '800', marginBottom: '8px' },
    subtitle: { color: 'var(--textSecondary)', fontSize: '14px' },
    primaryBtn: { padding: '12px 24px', background: 'var(--accent)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: '700', cursor: 'pointer' },
    secondaryBtn: { padding: '12px 24px', background: 'transparent', color: 'var(--text)', border: '1px solid var(--border)', borderRadius: '12px', fontWeight: '700', cursor: 'pointer' },

    formCard: { padding: '30px', borderRadius: '24px', background: 'var(--surface)', border: '1px solid var(--border)', maxWidth: '600px', margin: '0 auto' },
    cardTitle: { fontSize: '20px', fontWeight: '800', marginBottom: '24px' },
    form: { display: 'flex', flexDirection: 'column', gap: '20px' },
    formGroup: { display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 },
    row: { display: 'flex', gap: '20px' },
    label: { fontSize: '13px', fontWeight: '600', color: 'var(--textSecondary)' },
    input: { padding: '12px', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--background)', color: 'var(--text)', fontSize: '14px' },
    submitBtn: { padding: '14px', background: 'var(--accent)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: '700', cursor: 'pointer', marginTop: '10px' },

    timelineContainer: { display: 'flex', flexDirection: 'column', gap: '16px' },
    resCard: {
        display: 'flex', alignItems: 'center', padding: '20px',
        background: 'var(--surface)', borderRadius: '20px', border: '1px solid var(--border)',
        boxShadow: 'var(--shadow)'
    },
    resDate: {
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        padding: '0 20px 0 0', borderRight: '1px solid var(--border)', marginRight: '20px'
    },
    month: { fontSize: '12px', textTransform: 'uppercase', fontWeight: 'bold', color: 'var(--accent)' },
    day: { fontSize: '24px', fontWeight: '800', color: 'var(--text)' },
    resInfo: { flex: 1 },
    resTitle: { fontSize: '16px', fontWeight: '700', marginBottom: '4px' },
    resMeta: { fontSize: '13px', color: 'var(--textSecondary)', marginBottom: '4px' },
    resUser: { fontSize: '12px', color: 'var(--text)', fontWeight: '600' },
    badge: { padding: '4px 10px', borderRadius: '8px', fontSize: '11px', fontWeight: '800', color: 'white' },
    conflictPanel: { padding: '15px', background: '#fff5f5', border: '1px solid #feb2b2', borderRadius: '12px', color: '#c53030', fontSize: '12px', lineHeight: '1.4' },
    empty: { textAlign: 'center', padding: '60px', color: 'var(--textSecondary)' }
};

export default Reservations;
