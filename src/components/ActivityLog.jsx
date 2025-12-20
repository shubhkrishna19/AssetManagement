import React from 'react';

const ActivityLog = () => {
    const activities = [
        { id: 1, type: 'assignment', user: 'Shubh Krishna', action: 'Assigned "Dell Latitude 5520" to Client A', time: '2 hours ago', icon: '👤' },
        { id: 2, type: 'maintenance', user: 'System', action: 'Maintenance requested for "HP LaserJet Pro"', time: '4 hours ago', icon: '🔧' },
        { id: 3, type: 'scan', user: 'Operations', action: 'Scanned & Verified "BW-IT-004"', time: 'Yesterday', icon: '📷' },
        { id: 4, type: 'movement', user: 'Logistics', action: 'Moved "Mahindra Bolero" to Mumbai Depot', time: '2 days ago', icon: '🚚' },
        { id: 5, type: 'provision', user: 'IT Support', action: 'Provisioned new "MacBook Pro 14"', time: '3 days ago', icon: '✨' },
        { id: 6, type: 'return', user: 'Admin', action: 'Returned "Executive Desk" to Warehouse', time: 'Last week', icon: '📥' },
    ];

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>📜 Activity Log</h2>
            <p style={styles.subtitle}>Complete audit trail of asset lifecycle events</p>

            <div style={styles.logCard}>
                <div style={styles.timeline}>
                    {activities.map((activity, index) => (
                        <div key={activity.id} style={styles.activityItem}>
                            <div style={styles.leftCol}>
                                <div style={styles.dotWrapper}>
                                    <div style={styles.dot} />
                                    {index !== activities.length - 1 && <div style={styles.line} />}
                                </div>
                                <div style={styles.iconBox}>{activity.icon}</div>
                            </div>

                            <div style={styles.rightCol}>
                                <div style={styles.itemHeader}>
                                    <span style={styles.userName}>{activity.user}</span>
                                    <span style={styles.time}>{activity.time}</span>
                                </div>
                                <div style={styles.actionText}>{activity.action}</div>
                                <div style={styles.typeTag}>{activity.type}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: { padding: '24px', maxWidth: '1400px', margin: '0 auto' },
    title: { fontSize: '28px', fontWeight: '800', marginBottom: '8px', color: 'var(--text)' },
    subtitle: { fontSize: '14px', color: 'var(--textSecondary)', marginBottom: '32px' },
    logCard: { background: 'var(--surface)', padding: '32px', borderRadius: '24px', border: '1px solid var(--border)', boxShadow: 'var(--shadow)' },
    timeline: { display: 'flex', flexDirection: 'column' },
    activityItem: { display: 'flex', gap: '20px', marginBottom: '10px' },
    leftCol: { display: 'flex', flexDirection: 'column', alignItems: 'center', width: '40px' },
    dotWrapper: { position: 'relative', height: '100%', display: 'flex', justifyContent: 'center' },
    dot: { width: '12px', height: '12px', borderRadius: '50%', background: 'var(--accent)', marginTop: '8px', zIndex: 2 },
    line: { position: 'absolute', top: '20px', bottom: '-20px', width: '2px', background: 'var(--border)', zIndex: 1 },
    iconBox: { marginTop: '10px', fontSize: '18px' },
    rightCol: { flex: 1, paddingBottom: '30px' },
    itemHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: '6px' },
    userName: { fontSize: '15px', fontWeight: '700', color: 'var(--text)' },
    time: { fontSize: '12px', color: 'var(--textSecondary)' },
    actionText: { fontSize: '14px', color: 'var(--text)', marginBottom: '8px', lineHeight: '1.4' },
    typeTag: { display: 'inline-block', padding: '4px 10px', borderRadius: '8px', background: 'var(--background)', color: 'var(--textSecondary)', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' },
};

export default ActivityLog;
