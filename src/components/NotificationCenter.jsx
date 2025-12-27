import React, { useState, createContext, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Notification Context
const NotificationContext = createContext();

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([
        { id: 1, type: 'maintenance', title: 'Maintenance Due', message: 'HP LaserJet Pro requires scheduled maintenance', time: '5 min ago', read: false, priority: 'high' },
        { id: 2, type: 'audit', title: 'Audit Reminder', message: 'Quarterly audit scheduled for next week', time: '1 hour ago', read: false, priority: 'medium' },
        { id: 3, type: 'alert', title: 'Low Health Alert', message: '3 assets have health score below 50%', time: '2 hours ago', read: true, priority: 'high' },
        { id: 4, type: 'info', title: 'System Update', message: 'New features available in Reports module', time: '1 day ago', read: true, priority: 'low' },
    ]);

    const addNotification = (notification) => {
        const newNotif = {
            id: Date.now(),
            time: 'Just now',
            read: false,
            ...notification
        };
        setNotifications(prev => [newNotif, ...prev]);
    };

    const markAsRead = (id) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    };

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    const clearNotification = (id) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    const clearAll = () => {
        setNotifications([]);
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <NotificationContext.Provider value={{
            notifications,
            unreadCount,
            addNotification,
            markAsRead,
            markAllAsRead,
            clearNotification,
            clearAll
        }}>
            {children}
        </NotificationContext.Provider>
    );
};

// Notification Bell Component
export const NotificationBell = ({ onClick }) => {
    const { unreadCount } = useNotifications();

    return (
        <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClick}
            style={styles.bellBtn}
        >
            🔔
            {unreadCount > 0 && (
                <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    style={styles.badge}
                >
                    {unreadCount > 9 ? '9+' : unreadCount}
                </motion.span>
            )}
        </motion.button>
    );
};

// Notification Panel Component
const NotificationCenter = ({ isOpen, onClose }) => {
    const { notifications, markAsRead, markAllAsRead, clearNotification, clearAll, unreadCount } = useNotifications();
    const [filter, setFilter] = useState('all');

    const filteredNotifications = filter === 'all'
        ? notifications
        : filter === 'unread'
            ? notifications.filter(n => !n.read)
            : notifications.filter(n => n.type === filter);

    const getIcon = (type) => {
        switch (type) {
            case 'maintenance': return '🔧';
            case 'audit': return '📋';
            case 'alert': return '⚠️';
            case 'success': return '✅';
            default: return 'ℹ️';
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high': return '#e74c3c';
            case 'medium': return '#f39c12';
            default: return '#3498db';
        }
    };

    if (!isOpen) return null;

    return (
        <>
            <div style={styles.overlay} onClick={onClose} />
            <motion.div
                initial={{ opacity: 0, x: 300 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 300 }}
                style={styles.panel}
            >
                <div style={styles.header}>
                    <div>
                        <h3 style={styles.title}>Notifications</h3>
                        <p style={styles.subtitle}>{unreadCount} unread</p>
                    </div>
                    <div style={styles.headerActions}>
                        <button onClick={markAllAsRead} style={styles.actionBtn}>Mark all read</button>
                        <button onClick={onClose} style={styles.closeBtn}>✕</button>
                    </div>
                </div>

                {/* Filters */}
                <div style={styles.filters}>
                    {['all', 'unread', 'maintenance', 'alert', 'audit'].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            style={{ ...styles.filterBtn, ...(filter === f ? styles.filterActive : {}) }}
                        >
                            {f.charAt(0).toUpperCase() + f.slice(1)}
                        </button>
                    ))}
                </div>

                {/* Notification List */}
                <div style={styles.list}>
                    <AnimatePresence>
                        {filteredNotifications.length === 0 ? (
                            <div style={styles.empty}>
                                <span>🔔</span>
                                <p>No notifications</p>
                            </div>
                        ) : (
                            filteredNotifications.map(notif => (
                                <motion.div
                                    key={notif.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, x: -100 }}
                                    onClick={() => markAsRead(notif.id)}
                                    style={{
                                        ...styles.notifItem,
                                        background: notif.read ? 'var(--background)' : 'var(--surface)',
                                        borderLeft: `3px solid ${getPriorityColor(notif.priority)}`
                                    }}
                                >
                                    <div style={styles.notifIcon}>{getIcon(notif.type)}</div>
                                    <div style={styles.notifContent}>
                                        <div style={styles.notifTitle}>{notif.title}</div>
                                        <div style={styles.notifMessage}>{notif.message}</div>
                                        <div style={styles.notifTime}>{notif.time}</div>
                                    </div>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); clearNotification(notif.id); }}
                                        style={styles.removeBtn}
                                    >
                                        ✕
                                    </button>
                                    {!notif.read && <div style={styles.unreadDot} />}
                                </motion.div>
                            ))
                        )}
                    </AnimatePresence>
                </div>

                {/* Footer */}
                {notifications.length > 0 && (
                    <div style={styles.footer}>
                        <button onClick={clearAll} style={styles.clearAllBtn}>
                            🗑️ Clear All Notifications
                        </button>
                    </div>
                )}
            </motion.div>
        </>
    );
};

const styles = {
    bellBtn: { position: 'relative', background: 'var(--background)', border: '1px solid var(--border)', borderRadius: '12px', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '18px' },
    badge: { position: 'absolute', top: '-4px', right: '-4px', background: '#e74c3c', color: 'white', fontSize: '10px', fontWeight: '800', padding: '2px 6px', borderRadius: '10px', minWidth: '18px', textAlign: 'center' },

    overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', zIndex: 1999 },
    panel: { position: 'fixed', top: 0, right: 0, bottom: 0, width: '400px', maxWidth: '100vw', background: 'var(--surface)', boxShadow: '-10px 0 40px rgba(0,0,0,0.2)', zIndex: 2000, display: 'flex', flexDirection: 'column' },

    header: { padding: '24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
    title: { fontSize: '20px', fontWeight: '800', marginBottom: '4px' },
    subtitle: { fontSize: '12px', color: 'var(--textSecondary)' },
    headerActions: { display: 'flex', gap: '12px', alignItems: 'center' },
    actionBtn: { background: 'none', border: 'none', color: 'var(--accent)', fontSize: '12px', fontWeight: '700', cursor: 'pointer' },
    closeBtn: { background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', color: 'var(--textSecondary)' },

    filters: { padding: '12px 24px', borderBottom: '1px solid var(--border)', display: 'flex', gap: '8px', overflowX: 'auto' },
    filterBtn: { padding: '6px 12px', borderRadius: '8px', border: 'none', background: 'var(--background)', color: 'var(--textSecondary)', fontSize: '11px', fontWeight: '700', cursor: 'pointer', whiteSpace: 'nowrap' },
    filterActive: { background: 'var(--accent)', color: 'white' },

    list: { flex: 1, overflowY: 'auto', padding: '12px' },
    notifItem: { position: 'relative', display: 'flex', gap: '12px', padding: '16px', borderRadius: '12px', marginBottom: '8px', cursor: 'pointer', transition: '0.2s' },
    notifIcon: { fontSize: '24px' },
    notifContent: { flex: 1 },
    notifTitle: { fontSize: '14px', fontWeight: '700', marginBottom: '4px' },
    notifMessage: { fontSize: '12px', color: 'var(--textSecondary)', marginBottom: '8px', lineHeight: '1.4' },
    notifTime: { fontSize: '10px', color: 'var(--textSecondary)' },
    removeBtn: { background: 'none', border: 'none', color: 'var(--textSecondary)', cursor: 'pointer', fontSize: '12px', opacity: 0.5 },
    unreadDot: { position: 'absolute', top: '16px', right: '16px', width: '8px', height: '8px', background: 'var(--accent)', borderRadius: '50%' },

    empty: { textAlign: 'center', padding: '60px 20px', color: 'var(--textSecondary)' },

    footer: { padding: '16px 24px', borderTop: '1px solid var(--border)' },
    clearAllBtn: { width: '100%', padding: '12px', borderRadius: '12px', border: 'none', background: 'var(--background)', color: 'var(--textSecondary)', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }
};

export default NotificationCenter;
