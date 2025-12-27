import React, { useState, useMemo } from 'react';
import { motion, Reorder } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

const DashboardWidgets = ({ assets = [], onNavigate }) => {
    const [widgets, setWidgets] = useState([
        { id: 'stats', type: 'stats', title: '📊 Quick Stats', visible: true },
        { id: 'health', type: 'health', title: '💚 Health Overview', visible: true },
        { id: 'category', type: 'category', title: '📦 By Category', visible: true },
        { id: 'actions', type: 'actions', title: '⚡ Quick Actions', visible: true },
        { id: 'alerts', type: 'alerts', title: '🔔 Active Alerts', visible: true },
        { id: 'recent', type: 'recent', title: '🕐 Recent Activity', visible: true },
    ]);

    const [isEditing, setIsEditing] = useState(false);

    // Computed data
    const stats = useMemo(() => {
        const totalValue = assets.reduce((sum, a) => sum + (Number(a.Cost) || 0), 0);
        const available = assets.filter(a => a.Status === 'Available').length;
        const maintenance = assets.filter(a => a.Status === 'Under Maintenance').length;
        const assigned = assets.filter(a => a.Status === 'Assigned').length;

        return { total: assets.length, totalValue, available, maintenance, assigned };
    }, [assets]);

    const healthData = useMemo(() => {
        const healthy = assets.filter(a => (Number(a.Health_Score) || 100) >= 70).length;
        const warning = assets.filter(a => {
            const score = Number(a.Health_Score) || 100;
            return score >= 40 && score < 70;
        }).length;
        const critical = assets.filter(a => (Number(a.Health_Score) || 100) < 40).length;

        return [
            { name: 'Healthy', value: healthy, color: '#00b894' },
            { name: 'Warning', value: warning, color: '#fdcb6e' },
            { name: 'Critical', value: critical, color: '#e74c3c' },
        ];
    }, [assets]);

    const categoryData = useMemo(() => {
        const cats = {};
        assets.forEach(a => {
            const cat = a.Category && !a.Category.match(/^[0-9.]+$/) ? a.Category : 'Other';
            cats[cat] = (cats[cat] || 0) + 1;
        });
        return Object.entries(cats)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 5);
    }, [assets]);

    const alerts = useMemo(() => ([
        { id: 1, type: 'warning', message: `${stats.maintenance} assets under maintenance`, priority: 'high' },
        { id: 2, type: 'info', message: `${stats.available} assets available`, priority: 'low' },
        { id: 3, type: 'alert', message: `${healthData[2]?.value || 0} assets need attention`, priority: 'high' },
    ]), [stats, healthData]);

    const formatCurrency = (val) => new Intl.NumberFormat('en-IN', {
        style: 'currency', currency: 'INR', maximumFractionDigits: 0
    }).format(val);

    const toggleWidget = (id) => {
        setWidgets(prev => prev.map(w => w.id === id ? { ...w, visible: !w.visible } : w));
    };

    const renderWidget = (widget) => {
        if (!widget.visible) return null;

        switch (widget.type) {
            case 'stats':
                return (
                    <div style={styles.statsGrid}>
                        <div style={styles.statCard}>
                            <span style={styles.statValue}>{stats.total}</span>
                            <span style={styles.statLabel}>Total Assets</span>
                        </div>
                        <div style={styles.statCard}>
                            <span style={{ ...styles.statValue, color: 'var(--accent)' }}>
                                {formatCurrency(stats.totalValue)}
                            </span>
                            <span style={styles.statLabel}>Total Value</span>
                        </div>
                        <div style={styles.statCard}>
                            <span style={{ ...styles.statValue, color: '#00b894' }}>{stats.available}</span>
                            <span style={styles.statLabel}>Available</span>
                        </div>
                        <div style={styles.statCard}>
                            <span style={{ ...styles.statValue, color: '#f39c12' }}>{stats.maintenance}</span>
                            <span style={styles.statLabel}>Maintenance</span>
                        </div>
                    </div>
                );

            case 'health':
                return (
                    <div style={styles.chartContainer}>
                        <ResponsiveContainer width="100%" height={150}>
                            <PieChart>
                                <Pie
                                    data={healthData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={40}
                                    outerRadius={60}
                                    dataKey="value"
                                >
                                    {healthData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                        <div style={styles.legend}>
                            {healthData.map(item => (
                                <div key={item.name} style={styles.legendItem}>
                                    <div style={{ ...styles.legendDot, background: item.color }} />
                                    <span>{item.name}: {item.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                );

            case 'category':
                return (
                    <div style={styles.chartContainer}>
                        <ResponsiveContainer width="100%" height={150}>
                            <BarChart data={categoryData}>
                                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                                <YAxis tick={{ fontSize: 10 }} />
                                <Tooltip />
                                <Bar dataKey="value" fill="var(--accent)" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                );

            case 'actions':
                return (
                    <div style={styles.actionsGrid}>
                        <button onClick={() => onNavigate?.('Audit')} style={styles.actionBtn}>
                            ➕ Add Asset
                        </button>
                        <button onClick={() => onNavigate?.('Reports')} style={styles.actionBtn}>
                            📄 Reports
                        </button>
                        <button onClick={() => onNavigate?.('Maintenance')} style={styles.actionBtn}>
                            🔧 Maintenance
                        </button>
                        <button onClick={() => onNavigate?.('Analytics')} style={styles.actionBtn}>
                            📊 Analytics
                        </button>
                    </div>
                );

            case 'alerts':
                return (
                    <div style={styles.alertsList}>
                        {alerts.map(alert => (
                            <div key={alert.id} style={{
                                ...styles.alertItem,
                                borderLeft: `3px solid ${alert.priority === 'high' ? '#e74c3c' : '#3498db'}`
                            }}>
                                <span>{alert.message}</span>
                            </div>
                        ))}
                    </div>
                );

            case 'recent':
                return (
                    <div style={styles.recentList}>
                        {assets.slice(0, 4).map(asset => (
                            <div key={asset.Asset_ID} style={styles.recentItem}>
                                <span style={styles.recentId}>{asset.Asset_ID}</span>
                                <span style={styles.recentName}>{asset.Item_Name?.substring(0, 20)}...</span>
                                <span style={styles.recentStatus}>{asset.Status}</span>
                            </div>
                        ))}
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <div>
                    <h2 style={styles.title}>🏠 Dashboard</h2>
                    <p style={styles.subtitle}>Customize your view by dragging widgets</p>
                </div>
                <button
                    onClick={() => setIsEditing(!isEditing)}
                    style={{ ...styles.editBtn, background: isEditing ? 'var(--accent)' : 'var(--background)' }}
                >
                    {isEditing ? '✓ Done' : '⚙️ Customize'}
                </button>
            </div>

            {isEditing && (
                <div style={styles.widgetToggles}>
                    <span style={styles.toggleLabel}>Show/Hide Widgets:</span>
                    {widgets.map(w => (
                        <button
                            key={w.id}
                            onClick={() => toggleWidget(w.id)}
                            style={{
                                ...styles.toggleBtn,
                                background: w.visible ? 'var(--accent)' : 'var(--background)',
                                color: w.visible ? 'white' : 'var(--text)'
                            }}
                        >
                            {w.title}
                        </button>
                    ))}
                </div>
            )}

            <Reorder.Group axis="y" values={widgets} onReorder={setWidgets} style={styles.widgetGrid}>
                {widgets.filter(w => w.visible).map(widget => (
                    <Reorder.Item key={widget.id} value={widget} style={styles.widget}>
                        <motion.div
                            layout
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            style={styles.widgetInner}
                        >
                            <div style={styles.widgetHeader}>
                                <h3 style={styles.widgetTitle}>{widget.title}</h3>
                                {isEditing && <span style={styles.dragHandle}>⋮⋮</span>}
                            </div>
                            {renderWidget(widget)}
                        </motion.div>
                    </Reorder.Item>
                ))}
            </Reorder.Group>
        </div>
    );
};

const styles = {
    container: { padding: '24px', maxWidth: '1200px', margin: '0 auto' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' },
    title: { fontSize: '28px', fontWeight: '800', marginBottom: '4px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
    subtitle: { fontSize: '13px', color: 'var(--textSecondary)' },
    editBtn: { padding: '10px 20px', borderRadius: '12px', border: '1px solid var(--border)', color: 'var(--text)', fontSize: '13px', fontWeight: '700', cursor: 'pointer' },

    widgetToggles: { display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '24px', padding: '16px', background: 'var(--surface)', borderRadius: '16px', alignItems: 'center' },
    toggleLabel: { fontSize: '12px', fontWeight: '700', color: 'var(--textSecondary)', marginRight: '8px' },
    toggleBtn: { padding: '6px 12px', borderRadius: '8px', border: 'none', fontSize: '11px', fontWeight: '600', cursor: 'pointer' },

    widgetGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', listStyle: 'none', padding: 0 },
    widget: { cursor: 'grab' },
    widgetInner: { background: 'var(--surface)', borderRadius: '20px', padding: '20px', border: '1px solid var(--border)', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' },
    widgetHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' },
    widgetTitle: { fontSize: '14px', fontWeight: '800' },
    dragHandle: { color: 'var(--textSecondary)', cursor: 'grab' },

    statsGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' },
    statCard: { textAlign: 'center', padding: '16px', background: 'var(--background)', borderRadius: '12px' },
    statValue: { display: 'block', fontSize: '24px', fontWeight: '800' },
    statLabel: { fontSize: '11px', color: 'var(--textSecondary)', textTransform: 'uppercase' },

    chartContainer: { minHeight: '150px' },
    legend: { display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '8px' },
    legendItem: { display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px' },
    legendDot: { width: '8px', height: '8px', borderRadius: '50%' },

    actionsGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' },
    actionBtn: { padding: '14px', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--background)', color: 'var(--text)', fontSize: '12px', fontWeight: '700', cursor: 'pointer', transition: '0.2s' },

    alertsList: { display: 'flex', flexDirection: 'column', gap: '8px' },
    alertItem: { padding: '12px', background: 'var(--background)', borderRadius: '8px', fontSize: '12px' },

    recentList: { display: 'flex', flexDirection: 'column', gap: '8px' },
    recentItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', background: 'var(--background)', borderRadius: '8px' },
    recentId: { fontSize: '11px', fontWeight: '700', color: 'var(--accent)' },
    recentName: { fontSize: '11px', flex: 1, marginLeft: '12px' },
    recentStatus: { fontSize: '10px', color: 'var(--textSecondary)' }
};

export default DashboardWidgets;
