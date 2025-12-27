import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import { motion } from 'framer-motion';

const AdminDashboard = () => {
    const { currentUser, login } = useUser();
    const [selectedRole, setSelectedRole] = useState(currentUser.role);
    const [categories, setCategories] = useState(['Electronics', 'Furniture', 'IT Equipment', 'Machinery', 'Vehicles', 'Office Equipment']);
    const [newCategory, setNewCategory] = useState('');

    const featureList = [
        { id: 'inventory', label: 'Master Inventory Control', roles: ['super-admin', 'manager'] },
        { id: 'audit', label: 'Physical Audit Access', roles: ['super-admin', 'manager', 'technician'] },
        { id: 'reminders', label: 'Automated Reminders', roles: ['super-admin', 'manager'] },
        { id: 'allotment', label: 'Asset Allotment Master', roles: ['super-admin', 'manager'] },
        { id: 'billing', label: 'Contracts & Documentation', roles: ['super-admin', 'manager'] },
        { id: 'consumables', label: 'Consumables Management', roles: ['super-admin', 'manager', 'technician'] },
    ];

    const handleAddCategory = () => {
        if (newCategory.trim() && !categories.includes(newCategory.trim())) {
            setCategories([...categories, newCategory.trim()]);
            setNewCategory('');
        }
    };

    const handleRemoveCategory = (cat) => {
        setCategories(categories.filter(c => c !== cat));
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h2 style={styles.title}>🛡️ Master Admin Control</h2>
                <p style={styles.subtitle}>Configure enterprise rights, feature visibility, and system-wide security policies.</p>
            </div>

            <div style={styles.grid}>
                {/* Role Simulation / Setup */}
                <div style={styles.card}>
                    <h3 style={styles.sectionTitle}>Identity & Role Assignment</h3>
                    <p style={styles.cardDesc}>Dynamically adjust user permissions for testing and deployment.</p>

                    <div style={styles.roleGrid}>
                        {['super-admin', 'manager', 'technician', 'viewer'].map(role => (
                            <button
                                key={role}
                                onClick={() => { setSelectedRole(role); login(role); }}
                                style={{
                                    ...styles.roleBtn,
                                    background: selectedRole === role ? 'var(--accent)' : 'var(--background)',
                                    color: selectedRole === role ? 'white' : 'var(--text)',
                                    borderColor: selectedRole === role ? 'var(--accent)' : 'var(--border)'
                                }}
                            >
                                {role.toUpperCase()}
                            </button>
                        ))}
                    </div>

                    <div style={styles.rightsOverview}>
                        <h4 style={styles.subLabel}>Active Permissions</h4>
                        <div style={styles.rightsList}>
                            {featureList.map(feat => (
                                <div key={feat.id} style={styles.rightItem}>
                                    <div style={{
                                        ...styles.statusDot,
                                        background: feat.roles.includes(selectedRole) ? '#00b894' : '#e74c3c'
                                    }} />
                                    <span>{feat.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Category Management */}
                <div style={styles.card}>
                    <h3 style={styles.sectionTitle}>📂 Asset Categories</h3>
                    <p style={styles.cardDesc}>Customize the categories available across the system.</p>

                    <div style={styles.categoryList}>
                        {categories.map(cat => (
                            <div key={cat} style={styles.categoryItem}>
                                <span>{cat}</span>
                                <button
                                    onClick={() => handleRemoveCategory(cat)}
                                    style={styles.removeBtn}
                                >×</button>
                            </div>
                        ))}
                    </div>

                    <div style={styles.addCategoryRow}>
                        <input
                            type="text"
                            placeholder="New category name..."
                            value={newCategory}
                            onChange={(e) => setNewCategory(e.target.value)}
                            style={styles.categoryInput}
                            onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()}
                        />
                        <button onClick={handleAddCategory} style={styles.addBtn}>+ Add</button>
                    </div>
                </div>

                {/* System Configuration */}
                <div style={styles.card}>
                    <h3 style={styles.sectionTitle}>Global Feature Flags</h3>
                    <div style={styles.configList}>
                        <ConfigToggle label="Live Zoho Integration" active={true} />
                        <ConfigToggle label="Auto-Depreciation Engine" active={true} />
                        <ConfigToggle label="Multi-Factor Auth" active={false} />
                        <ConfigToggle label="Audit Photo Mandate" active={true} />
                    </div>

                    <div style={styles.warningBox}>
                        <strong>⚠️ System Note:</strong> All changes made here are session-based and will be reconciled with the Catalyst backend on hard-refresh.
                    </div>
                </div>
            </div>
        </div>
    );
};

const ConfigToggle = ({ label, active }) => (
    <div style={styles.configItem}>
        <span>{label}</span>
        <div style={{
            ...styles.toggleBg,
            background: active ? 'var(--accent)' : 'var(--border)'
        }}>
            <div style={{
                ...styles.toggleCircle,
                transform: active ? 'translateX(18px)' : 'translateX(0)'
            }} />
        </div>
    </div>
);

const styles = {
    container: { padding: '24px', maxWidth: '1400px', margin: '0 auto' },
    header: { marginBottom: '32px' },
    title: { fontSize: '28px', fontWeight: '900', color: 'var(--text)', marginBottom: '8px' },
    subtitle: { fontSize: '14px', color: 'var(--textSecondary)', maxWidth: '600px' },

    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '24px' },
    card: { background: 'var(--surface)', borderRadius: '24px', padding: '32px', border: '1px solid var(--border)', boxShadow: 'var(--shadow)' },
    sectionTitle: { fontSize: '20px', fontWeight: '800', marginBottom: '8px' },
    cardDesc: { fontSize: '13px', color: 'var(--textSecondary)', marginBottom: '24px' },

    roleGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '32px' },
    roleBtn: { padding: '14px', borderRadius: '12px', border: '1px solid', fontWeight: '800', cursor: 'pointer', fontSize: '12px', transition: '0.2s' },

    rightsOverview: { padding: '20px', background: 'var(--background)', borderRadius: '20px' },
    subLabel: { fontSize: '12px', fontWeight: '900', textTransform: 'uppercase', color: 'var(--textSecondary)', marginBottom: '16px', display: 'block' },
    rightsList: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' },
    rightItem: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: '700' },
    statusDot: { width: '8px', height: '8px', borderRadius: '50%' },

    configList: { display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '32px' },
    configItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '14px', fontWeight: '700' },
    toggleBg: { width: '40px', height: '22px', borderRadius: '20px', padding: '2px', cursor: 'pointer', transition: '0.3s' },
    toggleCircle: { width: '18px', height: '18px', background: 'white', borderRadius: '50%', transition: '0.3s' },

    warningBox: { padding: '16px', background: 'rgba(243, 156, 18, 0.1)', border: '1px solid rgba(243, 156, 18, 0.2)', borderRadius: '16px', fontSize: '11px', color: '#d35400', lineHeight: '1.4' },

    // Category Management
    categoryList: { display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '20px' },
    categoryItem: { display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', background: 'var(--background)', borderRadius: '12px', border: '1px solid var(--border)', fontSize: '13px', fontWeight: '600' },
    removeBtn: { background: 'transparent', border: 'none', color: '#e74c3c', fontSize: '18px', cursor: 'pointer', marginLeft: '4px', fontWeight: '700' },
    addCategoryRow: { display: 'flex', gap: '10px' },
    categoryInput: { flex: 1, padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text)', fontSize: '13px', outline: 'none' },
    addBtn: { padding: '12px 20px', background: 'var(--accent)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: '700', cursor: 'pointer', fontSize: '13px' }
};

export default AdminDashboard;
