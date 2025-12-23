import React from 'react';
import {
    PieChart, Pie, Cell, ResponsiveContainer,
    BarChart, Bar, XAxis, YAxis, Tooltip,
    LineChart, Line, Legend
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { mockStats } from '../mockData';

const CountUp = ({ value, duration = 1.5 }) => {
    const [count, setCount] = React.useState(0);
    React.useEffect(() => {
        let start = 0;
        const end = parseInt(value);
        if (start === end) return;
        let totalMilisecondsCount = duration * 1000;
        let incrementTime = (totalMilisecondsCount / end) > 10 ? (totalMilisecondsCount / end) : 10;
        let timer = setInterval(() => {
            start += Math.ceil(end / (totalMilisecondsCount / incrementTime));
            if (start >= end) {
                setCount(end);
                clearInterval(timer);
            } else {
                setCount(start);
            }
        }, incrementTime);
        return () => clearInterval(timer);
    }, [value, duration]);
    return <span>{count.toLocaleString()}</span>;
};

const Analytics = ({ assets = [] }) => {
    const stats = React.useMemo(() => {
        const total = assets.length;
        const assigned = assets.filter(a => a.Status === 'In Use' || a.Status === 'Assigned').length;
        const available = assets.filter(a => a.Status === 'Available').length;
        const maintenance = assets.filter(a => a.Status === 'Under Maintenance').length;
        const totalValue = assets.reduce((sum, a) => sum + (Number(a.Cost) || 0), 0);

        // Category Breakdown
        const categories = [...new Set(assets.map(a => a.Category))];
        const categoryData = categories.map((cat, idx) => ({
            name: cat || 'Misc',
            value: assets.filter(a => a.Category === cat).length,
            color: ['#0984e3', '#00b894', '#fdcb6e', '#e74c3c', '#6c5ce7'][idx % 5]
        }));

        // Health Distribution
        const healthData = [
            { name: 'Optimal', value: assets.filter(a => (a.Health_Score || 100) >= 80).length, color: '#00b894' },
            { name: 'Fair', value: assets.filter(a => (a.Health_Score || 100) < 80 && (a.Health_Score || 100) >= 50).length, color: '#f59e0b' },
            { name: 'Critical', value: assets.filter(a => (a.Health_Score || 100) < 50).length, color: '#ef4444' },
        ];

        // Trend Data (Last 6 Months Acquisitions)
        const last6Months = [];
        for (let i = 5; i >= 0; i--) {
            const d = new Date();
            d.setMonth(d.getMonth() - i);
            const label = d.toLocaleString('default', { month: 'short' });
            const prefix = d.toISOString().substring(0, 7);
            const val = assets
                .filter(a => a.Purchase_Date && String(a.Purchase_Date).startsWith(prefix))
                .reduce((sum, a) => sum + (Number(a.Cost) || 0), 0);
            last6Months.push({ month: label, value: val });
        }

        return { total, assigned, available, maintenance, totalValue, categoryData, healthData, trendData: last6Months };
    }, [assets]);
    const formatCurrency = (val) => new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    }).format(val);

    const alerts = [
        { id: 1, type: 'maintenance', title: 'HP LaserJet Maintenance Overdue', date: '3 Days Overdue', severity: 'high' },
        { id: 2, type: 'audit', title: 'Verify 12 Assets in "Fabrication"', date: 'Audit required by Friday', severity: 'medium' },
        { id: 3, type: 'return', title: 'Dell Latitude 5520 Due Back', date: 'Due Today (Aditi T.)', severity: 'critical' },
        { id: 4, type: 'insurance', title: 'Mahindra Bolero Insurance Expiring', date: 'Expiring in 5 days', severity: 'medium' },
    ];
    return (
        <div style={styles.container}>
            <h2 style={styles.title}>📊 Analytics Dashboard</h2>
            <p style={styles.subtitle}>Real-time insights into your asset portfolio</p>

            {/* STATS ROW */}
            <div style={styles.statsRow}>
                <StatCard label="Total Assets" value={stats.total} icon="📦" color="#0984e3" delay={0.1} />
                <StatCard label="Assigned" value={stats.assigned} icon="👤" color="#00b894" delay={0.2} />
                <StatCard label="Available" value={stats.available} icon="✅" color="#fdcb6e" delay={0.3} />
                <StatCard label="Maintenance" value={stats.maintenance} icon="🔧" color="#e74c3c" delay={0.4} />
            </div>

            {/* CHART GRID - 2x2 Layout */}
            <div style={styles.chartGrid}>

                {/* CHART 1: Total Portfolio Value (Donut) */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="glass-card"
                    style={styles.chartCard}
                >
                    <h3 style={styles.chartTitle}>Portfolio Value Distribution</h3>
                    <div style={styles.chartWrapper}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={stats.categoryData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                    animationDuration={1500}
                                    animationBegin={800}
                                >
                                    {stats.categoryData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value) => `${value} Assets`} />
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </ResponsiveContainer>
                        <div style={styles.chartInnerLabel}>
                            <div style={styles.innerValue}>{formatCurrency(stats.totalValue)}</div>
                            <div style={styles.innerSub}>Total Value</div>
                        </div>
                    </div>
                </motion.div>

                {/* CHART 2: Category Breakdown (Bar) */}
                <div style={styles.chartCard}>
                    <h3 style={styles.chartTitle}>Inventory by Category</h3>
                    <div style={styles.chartWrapper}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart layout="vertical" data={stats.categoryData}>
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" width={100} axisLine={false} tickLine={false} />
                                <Tooltip cursor={{ fill: 'transparent' }} />
                                <Bar dataKey="value" radius={[0, 10, 10, 0]}>
                                    {stats.categoryData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* CHART 3: Health Score (Pie) */}
                <div style={styles.chartCard}>
                    <h3 style={styles.chartTitle}>Equipment Health Status</h3>
                    <div style={styles.chartWrapper}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={stats.healthData}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={80}
                                    dataKey="value"
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                >
                                    {stats.healthData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* CHART 4: Growth Trend (Line chart as per Specs) */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.8 }}
                    className="glass-card"
                    style={styles.chartCard}
                >
                    <h3 style={styles.chartTitle}>Asset Acquisition Trend</h3>
                    <div style={styles.chartWrapper}>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={stats.trendData}>
                                <XAxis dataKey="month" axisLine={false} tickLine={false} />
                                <YAxis hide />
                                <Tooltip formatter={(value) => formatCurrency(value)} />
                                <Line
                                    type="monotone"
                                    dataKey="value"
                                    stroke="#3b82f6"
                                    strokeWidth={4}
                                    dot={{ r: 4, strokeWidth: 2, fill: 'var(--surface)' }}
                                    activeDot={{ r: 8 }}
                                    animationDuration={1500}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* CHART 5: Compliance & Alerts Center (New Phase 6 Feature) */}
                <div style={styles.chartCard}>
                    <h3 style={styles.chartTitle}>🔔 Compliance & Alerts Center</h3>
                    <div style={styles.alertList}>
                        {alerts.map(alert => (
                            <div key={alert.id} style={styles.alertItem}>
                                <div style={{ ...styles.alertIndicator, background: alert.severity === 'critical' ? 'var(--danger)' : alert.severity === 'high' ? 'var(--warning)' : 'var(--accent)' }} />
                                <div style={styles.alertMain}>
                                    <div style={styles.alertTitle}>{alert.title}</div>
                                    <div style={styles.alertDate}>{alert.date}</div>
                                </div>
                                <div style={styles.alertAction}>View</div>
                            </div>
                        ))}
                    </div>
                    <div style={styles.auditPrompt}>
                        <span>92% Compliance</span>
                        <button style={styles.auditBtn}>Run System Audit</button>
                    </div>
                </div>

            </div>
        </div>
    );
};

const StatCard = ({ label, value, icon, color, delay = 0 }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay }}
        style={styles.statCard}
    >
        <div style={{ ...styles.statIcon, background: `${color}15`, color: color }}>{icon}</div>
        <div>
            <div style={styles.statValue}>
                {typeof value === 'number' ? <CountUp value={value} /> : value}
            </div>
            <div style={styles.statLabel}>{label}</div>
        </div>
    </motion.div>
);

const styles = {
    container: { padding: '24px', maxWidth: '1400px', margin: '0 auto' },
    title: { fontSize: '28px', fontWeight: '800', marginBottom: '8px', color: 'var(--text)' },
    subtitle: { fontSize: '14px', color: 'var(--textSecondary)', marginBottom: '32px' },
    statsRow: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '32px' },
    statCard: { background: 'var(--surface)', borderRadius: '24px', padding: '24px', display: 'flex', alignItems: 'center', gap: '20px', boxShadow: 'var(--shadow)', border: '1px solid var(--border)' },
    statIcon: { width: '56px', height: '56px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' },
    statValue: { fontSize: '24px', fontWeight: '800', color: 'var(--text)' },
    statLabel: { fontSize: '12px', color: 'var(--textSecondary)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' },
    chartGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '24px' },
    chartCard: { background: 'var(--surface)', borderRadius: '24px', padding: '24px', boxShadow: 'var(--shadow)', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column' },
    chartTitle: { fontSize: '16px', fontWeight: '700', color: 'var(--text)', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' },
    chartWrapper: { height: '280px', width: '100%', position: 'relative' },
    chartInnerLabel: { position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', pointerEvents: 'none' },
    innerValue: { fontSize: '18px', fontWeight: '800', color: 'var(--text)' },
    innerSub: { fontSize: '10px', color: 'var(--textSecondary)', textTransform: 'uppercase', fontWeight: '600' },

    // Alerts Specific
    alertList: { display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 },
    alertItem: { display: 'flex', alignItems: 'center', gap: '16px', padding: '12px', borderRadius: '12px', background: 'var(--background)', border: '1px solid var(--border)' },
    alertIndicator: { width: '4px', height: '32px', borderRadius: '2px' },
    alertMain: { flex: 1 },
    alertTitle: { fontSize: '13px', fontWeight: '700', color: 'var(--text)', marginBottom: '2px' },
    alertDate: { fontSize: '11px', color: 'var(--textSecondary)' },
    alertAction: { fontSize: '11px', fontWeight: '800', color: 'var(--accent)', cursor: 'pointer', textTransform: 'uppercase' },
    auditPrompt: { marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: 'var(--textSecondary)', fontWeight: '700' },
    auditBtn: { padding: '8px 16px', borderRadius: '8px', border: 'none', background: 'var(--text)', color: 'var(--background)', fontWeight: '700', cursor: 'pointer', fontSize: '11px' },
};

export default Analytics;
