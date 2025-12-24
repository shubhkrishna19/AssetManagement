import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Market price reference data (Flipkart/Amazon averages for office assets)
const marketPrices = {
    // IT Equipment
    'telephone': { low: 800, high: 2500, avg: 1650 },
    'receiver': { low: 800, high: 2500, avg: 1650 },
    'laptop': { low: 35000, high: 95000, avg: 65000 },
    'dell': { low: 45000, high: 85000, avg: 65000 },
    'latitude': { low: 45000, high: 85000, avg: 65000 },
    'mouse': { low: 300, high: 1500, avg: 900 },
    'wireless mouse': { low: 400, high: 2000, avg: 1200 },
    'webcam': { low: 1000, high: 5000, avg: 3000 },
    'camera': { low: 1000, high: 5000, avg: 3000 },
    'monitor': { low: 8000, high: 18000, avg: 13000 },
    'display': { low: 10000, high: 25000, avg: 17500 },
    'printer': { low: 8000, high: 35000, avg: 21500 },
    'scanner': { low: 8000, high: 25000, avg: 16500 },
    // Furniture
    'chair': { low: 3000, high: 15000, avg: 9000 },
    'table': { low: 5000, high: 25000, avg: 15000 },
    'desk': { low: 8000, high: 30000, avg: 19000 },
    'cabinet': { low: 8000, high: 35000, avg: 21500 },
    'rack': { low: 5000, high: 20000, avg: 12500 },
    // Machinery
    'machine': { low: 50000, high: 500000, avg: 275000 },
    'multiboaring': { low: 150000, high: 800000, avg: 475000 },
    'cutting': { low: 80000, high: 400000, avg: 240000 },
    'punching': { low: 50000, high: 300000, avg: 175000 },
    'die': { low: 20000, high: 150000, avg: 85000 },
    'saw': { low: 30000, high: 200000, avg: 115000 },
    'panel': { low: 100000, high: 600000, avg: 350000 },
    // Electronics
    'ac': { low: 30000, high: 65000, avg: 47500 },
    'remote': { low: 300, high: 1500, avg: 900 },
    'ups': { low: 5000, high: 25000, avg: 15000 },
    'router': { low: 2000, high: 8000, avg: 5000 },
    // Vehicles
    'vehicle': { low: 400000, high: 2000000, avg: 1200000 },
    'car': { low: 500000, high: 2500000, avg: 1500000 },
    'bike': { low: 50000, high: 200000, avg: 125000 },
    // Default
    'default': { low: 5000, high: 50000, avg: 27500 }
};

const getMarketPrice = (itemName) => {
    const name = (itemName || '').toLowerCase();
    for (const [key, value] of Object.entries(marketPrices)) {
        if (name.includes(key)) return value;
    }
    return marketPrices.default;
};

const normalizeItemName = (name) => {
    if (!name) return 'Unknown';
    return name.trim().toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .replace(/\s+/g, ' ')
        .split(' ').slice(0, 3).join(' ');
};

const AssetGroupedView = ({ assets = [], onSelectAsset }) => {
    const [expandedGroup, setExpandedGroup] = useState(null);
    const [categoryFilter, setCategoryFilter] = useState('All');
    const [sortBy, setSortBy] = useState('count'); // count, value, name

    // Group assets by normalized item name
    const groupedData = useMemo(() => {
        const groups = {};
        assets.forEach(asset => {
            const key = normalizeItemName(asset.Item_Name);
            if (!groups[key]) {
                groups[key] = {
                    id: key,
                    name: asset.Item_Name || 'Unknown Item',
                    category: asset.Category || 'Uncategorized',
                    items: [],
                    totalValue: 0,
                    minValue: Infinity,
                    maxValue: 0,
                };
            }
            const cost = Number(asset.Cost) || 0;
            groups[key].items.push(asset);
            groups[key].totalValue += cost;
            groups[key].minValue = Math.min(groups[key].minValue, cost || groups[key].minValue);
            groups[key].maxValue = Math.max(groups[key].maxValue, cost);
        });

        // Calculate averages and market comparison
        Object.values(groups).forEach(g => {
            g.count = g.items.length;
            g.avgValue = g.count > 0 ? Math.round(g.totalValue / g.count) : 0;
            g.minValue = g.minValue === Infinity ? 0 : g.minValue;

            const marketRef = getMarketPrice(g.name);
            g.marketRef = marketRef;
            g.priceStatus = g.avgValue < marketRef.low ? 'below' :
                g.avgValue > marketRef.high ? 'above' : 'fair';
        });

        return Object.values(groups);
    }, [assets]);

    // Get unique categories
    const categories = useMemo(() => {
        const cats = ['All', ...new Set(groupedData.map(g => g.category).filter(c => c && c !== 'Uncategorized'))];
        return cats.slice(0, 8);
    }, [groupedData]);

    // Filter and sort
    const filteredGroups = useMemo(() => {
        let result = groupedData;
        if (categoryFilter !== 'All') {
            result = result.filter(g => g.category === categoryFilter);
        }

        switch (sortBy) {
            case 'count': return result.sort((a, b) => b.count - a.count);
            case 'value': return result.sort((a, b) => b.totalValue - a.totalValue);
            case 'name': return result.sort((a, b) => a.name.localeCompare(b.name));
            default: return result;
        }
    }, [groupedData, categoryFilter, sortBy]);

    const formatCurrency = (val) => new Intl.NumberFormat('en-IN', {
        style: 'currency', currency: 'INR', maximumFractionDigits: 0
    }).format(val);

    const totalAssets = assets.length;
    const totalValue = assets.reduce((sum, a) => sum + (Number(a.Cost) || 0), 0);
    const uniqueItems = groupedData.length;

    return (
        <div style={styles.container}>
            {/* Header Stats */}
            <div style={styles.header}>
                <div>
                    <h2 style={styles.title}>📦 Asset Inventory</h2>
                    <p style={styles.subtitle}>Grouped view with market price comparison</p>
                </div>
                <div style={styles.headerStats}>
                    <div style={styles.headerStat}>
                        <span style={styles.headerStatValue}>{totalAssets}</span>
                        <span style={styles.headerStatLabel}>Total Assets</span>
                    </div>
                    <div style={styles.headerStat}>
                        <span style={styles.headerStatValue}>{uniqueItems}</span>
                        <span style={styles.headerStatLabel}>Unique Items</span>
                    </div>
                    <div style={styles.headerStat}>
                        <span style={styles.headerStatValue}>{formatCurrency(totalValue)}</span>
                        <span style={styles.headerStatLabel}>Total Value</span>
                    </div>
                </div>
            </div>

            {/* Category Filters */}
            <div style={styles.filters}>
                <div style={styles.categoryPills}>
                    {categories.map(cat => (
                        <button
                            key={cat}
                            style={{
                                ...styles.pill,
                                ...(categoryFilter === cat ? styles.pillActive : {})
                            }}
                            onClick={() => setCategoryFilter(cat)}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
                <select style={styles.sortSelect} value={sortBy} onChange={e => setSortBy(e.target.value)}>
                    <option value="count">Sort by Quantity</option>
                    <option value="value">Sort by Value</option>
                    <option value="name">Sort by Name</option>
                </select>
            </div>

            {/* Grouped Cards */}
            <div style={styles.grid}>
                {filteredGroups.map(group => (
                    <motion.div
                        key={group.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={styles.card}
                        className="glass-card"
                    >
                        <div style={styles.cardHeader}>
                            <span style={styles.category}>{group.category}</span>
                            <span style={{
                                ...styles.badge,
                                background: group.priceStatus === 'below' ? '#00b894' :
                                    group.priceStatus === 'above' ? '#e74c3c' : '#f39c12'
                            }}>
                                {group.priceStatus === 'below' ? '↓ Below Market' :
                                    group.priceStatus === 'above' ? '↑ Above Market' : '≈ Fair Price'}
                            </span>
                        </div>

                        <h3 style={styles.cardTitle}>{group.name}</h3>

                        <div style={styles.statsRow}>
                            <div style={styles.stat}>
                                <span style={styles.statValue}>{group.count}</span>
                                <span style={styles.statLabel}>Units</span>
                            </div>
                            <div style={styles.stat}>
                                <span style={styles.statValue}>{formatCurrency(group.avgValue)}</span>
                                <span style={styles.statLabel}>Avg Price</span>
                            </div>
                            <div style={styles.stat}>
                                <span style={styles.statValue}>{formatCurrency(group.totalValue)}</span>
                                <span style={styles.statLabel}>Total</span>
                            </div>
                        </div>

                        <div style={styles.priceRange}>
                            <div style={styles.priceRangeLabel}>
                                <span>Your Range: {formatCurrency(group.minValue)} - {formatCurrency(group.maxValue)}</span>
                            </div>
                            <div style={styles.priceRangeLabel}>
                                <span style={{ color: 'var(--textSecondary)' }}>
                                    Market: {formatCurrency(group.marketRef.low)} - {formatCurrency(group.marketRef.high)}
                                </span>
                            </div>
                        </div>

                        <button
                            style={styles.expandBtn}
                            onClick={() => setExpandedGroup(expandedGroup === group.id ? null : group.id)}
                        >
                            {expandedGroup === group.id ? '▲ Hide Items' : '▼ View All Items'}
                        </button>

                        <AnimatePresence>
                            {expandedGroup === group.id && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    style={styles.expandedContent}
                                >
                                    {group.items.slice(0, 10).map((item, idx) => (
                                        <div
                                            key={idx}
                                            style={styles.expandedItem}
                                            onClick={() => onSelectAsset && onSelectAsset(item)}
                                        >
                                            <span style={styles.itemId}>{item.Asset_ID}</span>
                                            <span style={styles.itemStatus}>{item.Status}</span>
                                            <span style={styles.itemCost}>{formatCurrency(Number(item.Cost) || 0)}</span>
                                        </div>
                                    ))}
                                    {group.items.length > 10 && (
                                        <div style={styles.moreItems}>
                                            +{group.items.length - 10} more items...
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                ))}
            </div>

            {filteredGroups.length === 0 && (
                <div style={styles.empty}>
                    <span>📭</span>
                    <p>No assets found in this category</p>
                </div>
            )}
        </div>
    );
};

const styles = {
    container: { padding: '24px', maxWidth: '1400px', margin: '0 auto' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px', flexWrap: 'wrap', gap: '20px' },
    title: { fontSize: '32px', fontWeight: '800', marginBottom: '8px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
    subtitle: { fontSize: '14px', color: 'var(--textSecondary)' },
    headerStats: { display: 'flex', gap: '24px' },
    headerStat: { textAlign: 'center', padding: '16px 24px', background: 'var(--surface)', borderRadius: '16px', border: '1px solid var(--border)' },
    headerStatValue: { display: 'block', fontSize: '24px', fontWeight: '800', color: 'var(--text)' },
    headerStatLabel: { fontSize: '11px', color: 'var(--textSecondary)', textTransform: 'uppercase', fontWeight: '600' },

    filters: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' },
    categoryPills: { display: 'flex', gap: '8px', flexWrap: 'wrap' },
    pill: { padding: '8px 16px', borderRadius: '20px', border: '1px solid var(--border)', background: 'var(--background)', color: 'var(--text)', fontSize: '13px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s' },
    pillActive: { background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', border: '1px solid transparent' },
    sortSelect: { padding: '10px 16px', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text)', fontSize: '13px', fontWeight: '600' },

    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '24px' },
    card: { padding: '24px', borderRadius: '24px', background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: '0 10px 40px rgba(0,0,0,0.06)' },
    cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' },
    category: { fontSize: '11px', fontWeight: '800', color: 'var(--textSecondary)', textTransform: 'uppercase', letterSpacing: '0.1em' },
    badge: { fontSize: '10px', padding: '4px 10px', borderRadius: '8px', color: 'white', fontWeight: '700' },
    cardTitle: { fontSize: '18px', fontWeight: '800', color: 'var(--text)', marginBottom: '20px', lineHeight: '1.3' },

    statsRow: { display: 'flex', justifyContent: 'space-between', marginBottom: '20px' },
    stat: { textAlign: 'center' },
    statValue: { display: 'block', fontSize: '18px', fontWeight: '800', color: 'var(--text)' },
    statLabel: { fontSize: '10px', color: 'var(--textSecondary)', textTransform: 'uppercase', fontWeight: '600' },

    priceRange: { padding: '12px', borderRadius: '12px', background: 'var(--background)', marginBottom: '16px' },
    priceRangeLabel: { fontSize: '12px', fontWeight: '600', marginBottom: '4px' },

    expandBtn: { width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--text)', fontSize: '13px', fontWeight: '700', cursor: 'pointer' },

    expandedContent: { marginTop: '16px', overflow: 'hidden' },
    expandedItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', borderRadius: '8px', background: 'var(--background)', marginBottom: '8px', cursor: 'pointer', transition: 'transform 0.2s' },
    itemId: { fontSize: '12px', fontWeight: '700', color: 'var(--accent)' },
    itemStatus: { fontSize: '11px', color: 'var(--textSecondary)' },
    itemCost: { fontSize: '12px', fontWeight: '700', color: 'var(--text)' },
    moreItems: { textAlign: 'center', padding: '8px', fontSize: '12px', color: 'var(--textSecondary)', fontWeight: '600' },

    empty: { textAlign: 'center', padding: '60px', color: 'var(--textSecondary)' }
};

export default AssetGroupedView;
