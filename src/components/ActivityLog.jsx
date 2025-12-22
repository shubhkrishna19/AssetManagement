import React, { useState } from 'react';
import { useAudit } from '../context/AuditContext';

const ActivityLog = () => {
    const { logs, clearLogs } = useAudit();
    const [filter, setFilter] = useState('all');

    const filteredLogs = filter === 'all'
        ? logs
        : logs.filter(log => log.type === filter);

    const getIcon = (action) => {
        if (!action) return '📝';
        if (action.includes('Import')) return '📥';
        if (action.includes('Bulk')) return '🚀';
        if (action.includes('Login') || action.includes('Role')) return '👤';
        if (action.includes('Report')) return '🔧';
        return '📝';
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>📜 Activity Log</h2>
            <p style={styles.subtitle}>Complete audit trail of asset lifecycle events</p>

            {/* Controls */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={() => setFilter('all')} style={{ ...styles.filterBtn, background: filter === 'all' ? 'var(--accent)' : 'var(--surface)', color: filter === 'all' ? 'white' : 'var(--text)' }}>All</button>
                    <button onClick={() => setFilter('success')} style={{ ...styles.filterBtn, background: filter === 'success' ? '#00b894' : 'var(--surface)', color: filter === 'success' ? 'white' : 'var(--text)' }}>Actions</button>
                    <button onClick={() => setFilter('info')} style={{ ...styles.filterBtn, background: filter === 'info' ? '#0984e3' : 'var(--surface)', color: filter === 'info' ? 'white' : 'var(--text)' }}>System</button>
                </div>
                <button onClick={clearLogs} style={styles.clearBtn}>Clear History</button>
            </div>

            <div style={styles.logCard}>
                <div style={styles.timeline}>
                    {filteredLogs.length === 0 ? (
                        <div style={{ padding: '40px', textAlign: 'center', color: 'var(--textSecondary)' }}>No logs found 🤷‍♂️</div>
                    ) : (
                        filteredLogs.map((activity, index) => (
                            <div key={activity.id} style={styles.activityItem}>
                                <div style={styles.leftCol}>
                                    <div style={styles.dotWrapper}>
                                        <div style={{ ...styles.dot, background: activity.type === 'error' ? 'red' : 'var(--accent)' }} />
                                        {index !== filteredLogs.length - 1 && <div style={styles.line} />}
                                    </div>
                                    <div style={styles.iconBox}>{getIcon(activity.action || activity.details)}</div>
                                </div>

                                <div style={styles.rightCol}>
                                    <div style={styles.itemHeader}>
                                        <span style={styles.userName}>{activity.user}</span>
                                        <span style={styles.time}>{new Date(activity.timestamp).toLocaleString()}</span>
                                    </div>
                                    <div style={styles.actionText}>{activity.details}</div>
                                    <div style={styles.typeTag}>{activity.action}</div>
                                </div>
                            </div>
                        )))}
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
    filterBtn: { padding: '8px 16px', border: '1px solid var(--border)', borderRadius: '10px', cursor: 'pointer', fontWeight: '600', fontSize: '12px' },
    clearBtn: { padding: '8px 16px', background: 'transparent', color: 'var(--danger)', border: 'none', cursor: 'pointer', fontWeight: '700', fontSize: '12px' }
};

export default ActivityLog;
