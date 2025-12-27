import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

const AllotmentMaster = ({ assets = [] }) => {
    // Group assets by Assigned_User
    const allotments = useMemo(() => {
        const groups = {};
        assets.forEach(asset => {
            const userName = asset.Assigned_User?.display_value || 'Unassigned';
            if (!groups[userName]) {
                groups[userName] = {
                    user: userName,
                    assets: [],
                    totalValue: 0
                };
            }
            groups[userName].assets.push(asset);
            groups[userName].totalValue += asset.Cost || 0;
        });
        return Object.values(groups).sort((a, b) => b.assets.length - a.assets.length);
    }, [assets]);

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <div>
                    <h2 style={styles.title}>👤 Allotment Master View</h2>
                    <p style={styles.subtitle}>Global oversight of asset distribution and custodial responsibility across all users.</p>
                </div>
            </div>

            <div style={styles.grid}>
                {allotments.map((group, idx) => (
                    <motion.div
                        key={group.user}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        style={styles.userCard}
                        className="glass-card"
                    >
                        <div style={styles.userHeader}>
                            <div style={styles.userAvatar}>
                                {group.user.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <h3 style={styles.userName}>{group.user}</h3>
                                <span style={styles.assetCount}>{group.assets.length} Assets Assigned</span>
                            </div>
                        </div>

                        <div style={styles.assetList}>
                            {group.assets.slice(0, 3).map(asset => (
                                <div key={asset.Asset_ID} style={styles.assetMiniItem}>
                                    <div style={styles.dot} />
                                    <span style={styles.miniId}>{asset.Asset_ID}</span>
                                    <span style={styles.miniName}>{asset.Item_Name}</span>
                                </div>
                            ))}
                            {group.assets.length > 3 && (
                                <div style={styles.moreCount}>+ {group.assets.length - 3} more items</div>
                            )}
                        </div>

                        <div style={styles.cardFooter}>
                            <div style={styles.valueRow}>
                                <span>Custodial Value</span>
                                <strong>₹{group.totalValue.toLocaleString()}</strong>
                            </div>
                            <button style={styles.viewBtn}>View Detailed Log</button>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

const styles = {
    container: { padding: '24px', maxWidth: '1400px', margin: '0 auto' },
    header: { marginBottom: '32px' },
    title: { fontSize: '28px', fontWeight: '900', color: 'var(--text)', marginBottom: '8px' },
    subtitle: { fontSize: '14px', color: 'var(--textSecondary)', maxWidth: '600px' },

    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '24px' },
    userCard: { background: 'var(--surface)', borderRadius: '24px', padding: '24px', border: '1px solid var(--border)', boxShadow: 'var(--shadow)', display: 'flex', flexDirection: 'column' },

    userHeader: { display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' },
    userAvatar: { width: '48px', height: '48px', borderRadius: '16px', background: 'var(--accent)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: '900' },
    userName: { fontSize: '18px', fontWeight: '800', margin: 0 },
    assetCount: { fontSize: '12px', fontWeight: '700', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.05em' },

    assetList: { flex: 1, display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px', padding: '16px', background: 'var(--background)', borderRadius: '16px' },
    assetMiniItem: { display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px' },
    dot: { width: '6px', height: '6px', borderRadius: '50%', background: 'var(--border)' },
    miniId: { fontWeight: '800', opacity: 0.6, fontSize: '11px', minWidth: '70px' },
    miniName: { fontWeight: '600', color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
    moreCount: { fontSize: '11px', fontWeight: '800', color: 'var(--textSecondary)', textAlign: 'center', marginTop: '4px' },

    cardFooter: { borderTop: '1px solid var(--border)', paddingTop: '20px' },
    valueRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', fontSize: '14px' },
    viewBtn: { width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--text)', fontWeight: '700', cursor: 'pointer', transition: '0.2s' }
};

export default AllotmentMaster;
