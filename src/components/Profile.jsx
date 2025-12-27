import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useUser } from '../context/UserContext';

const Profile = () => {
    const { isDark, toggleTheme } = useTheme();
    const { currentUser, login } = useUser();
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({ ...currentUser });

    const handleSave = () => {
        login(editData.role); // In a real app, this would update more fields in a DB
        // For simulation, we'll just alert success
        alert("✅ Profile updated successfully.");
        setIsEditing(false);
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>👤 Profile & Settings</h2>
            <p style={styles.subtitle}>Manage your account and enterprise configurations</p>

            <div style={styles.grid}>
                {/* User Card */}
                <div style={styles.card}>
                    <div style={styles.profileHeader}>
                        <div style={styles.largeAvatar}>{currentUser.avatar}</div>
                        <div>
                            <h3 style={styles.userName}>{currentUser.name}</h3>
                            <p style={styles.userRole}>{currentUser.role.toUpperCase()}</p>
                        </div>
                    </div>

                    {isEditing ? (
                        <div style={styles.editForm}>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Full Name</label>
                                <input
                                    style={styles.input}
                                    value={editData.name}
                                    onChange={e => setEditData({ ...editData, name: e.target.value })}
                                />
                            </div>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Avatar Initials</label>
                                <input
                                    style={styles.input}
                                    value={editData.avatar}
                                    onChange={e => setEditData({ ...editData, avatar: e.target.value })}
                                />
                            </div>
                            <div style={styles.modalActions}>
                                <button style={styles.cancelBtn} onClick={() => setIsEditing(false)}>Cancel</button>
                                <button style={styles.saveBtn} onClick={handleSave}>Save Changes</button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div style={styles.infoList}>
                                <InfoItem label="Email" value={`${currentUser.name.split(' ')[0].toLowerCase()}@bluewud.com`} />
                                <InfoItem label="Organization" value="Bluewud Enterprise" />
                                <InfoItem label="Role" value={currentUser.role} />
                                <InfoItem label="Status" value="Active" />
                            </div>
                            <button style={styles.editBtn} onClick={() => setIsEditing(true)}>Edit Profile</button>
                        </>
                    )}
                </div>

                {/* System Settings */}
                <div style={styles.card}>
                    <h3 style={styles.sectionTitle}>System Preferences</h3>

                    <div style={styles.settingItem}>
                        <div>
                            <div style={styles.settingLabel}>Display Theme</div>
                            <div style={styles.settingDesc}>Switch between light and dark modes</div>
                        </div>
                        <button onClick={toggleTheme} style={styles.toggleBtn}>
                            {isDark ? '🌙 Dark Mode' : '☀️ Light Mode'}
                        </button>
                    </div>

                    <div style={styles.settingItem}>
                        <div>
                            <div style={styles.settingLabel}>Email Notifications</div>
                            <div style={styles.settingDesc}>Receive maintenance and audit alerts</div>
                        </div>
                        <input type="checkbox" defaultChecked style={styles.checkbox} />
                    </div>
                </div>

                {/* Enterprise Branding */}
                <div style={styles.card}>
                    <h3 style={styles.sectionTitle}>Enterprise Branding</h3>
                    <p style={styles.settingDesc}>Upload your company logo and customize the dashboard palette.</p>

                    <div style={styles.logoDropzone}>
                        <span style={{ fontSize: '32px' }}>🖼️</span>
                        <p style={{ fontSize: '12px', color: 'var(--textSecondary)', marginTop: '8px' }}>Click to upload enterprise logo</p>
                    </div>

                    <button style={{ ...styles.editBtn, background: 'var(--text)', color: 'var(--background)', marginTop: '20px' }}>
                        Apply Branding
                    </button>
                </div>
            </div>
        </div>
    );
};

const InfoItem = ({ label, value }) => (
    <div style={styles.infoItem}>
        <span style={styles.infoLabel}>{label}</span>
        <span style={styles.infoValue}>{value}</span>
    </div>
);

const styles = {
    container: { padding: '24px', maxWidth: '1400px', margin: '0 auto' },
    title: { fontSize: '28px', fontWeight: '800', marginBottom: '8px', color: 'var(--text)' },
    subtitle: { fontSize: '14px', color: 'var(--textSecondary)', marginBottom: '32px' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' },
    card: { background: 'var(--surface)', padding: '32px', borderRadius: '24px', border: '1px solid var(--border)', boxShadow: 'var(--shadow)' },
    profileHeader: { display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '32px' },
    largeAvatar: { width: '80px', height: '80px', background: 'var(--accent)', borderRadius: '24px', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', fontWeight: '900' },
    userName: { fontSize: '24px', fontWeight: '800', color: 'var(--text)', marginBottom: '4px' },
    userRole: { fontSize: '14px', color: 'var(--textSecondary)', fontWeight: '600' },
    infoList: { display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' },
    infoItem: { display: 'flex', justifyContent: 'space-between', paddingBottom: '12px', borderBottom: '1px solid var(--border)' },
    infoLabel: { fontSize: '13px', color: 'var(--textSecondary)', fontWeight: '500' },
    infoValue: { fontSize: '14px', color: 'var(--text)', fontWeight: '700' },
    editBtn: { width: '100%', padding: '14px', borderRadius: '12px', border: 'none', background: 'var(--accent)', color: 'white', fontWeight: '700', cursor: 'pointer', transition: '0.2s' },
    editForm: { display: 'flex', flexDirection: 'column', gap: '20px' },
    formGroup: { display: 'flex', flexDirection: 'column', gap: '8px' },
    label: { fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', color: 'var(--textSecondary)' },
    input: { padding: '12px', borderRadius: '10px', border: '1px solid var(--border)', background: 'var(--background)', color: 'var(--text)', outline: 'none' },
    modalActions: { display: 'flex', gap: '10px', marginTop: '10px' },
    saveBtn: { flex: 1, padding: '12px', borderRadius: '10px', border: 'none', background: 'var(--accent)', color: 'white', fontWeight: '700', cursor: 'pointer' },
    cancelBtn: { flex: 1, padding: '12px', borderRadius: '10px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--text)', fontWeight: '700', cursor: 'pointer' },
    sectionTitle: { fontSize: '18px', fontWeight: '700', color: 'var(--text)', marginBottom: '24px' },
    settingItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', paddingBottom: '20px', borderBottom: '1px solid var(--border)' },
    settingLabel: { fontSize: '15px', fontWeight: '700', color: 'var(--text)', marginBottom: '4px' },
    settingDesc: { fontSize: '13px', color: 'var(--textSecondary)' },
    toggleBtn: { padding: '8px 16px', borderRadius: '20px', border: '1px solid var(--border)', background: 'var(--background)', color: 'var(--text)', fontWeight: '600', cursor: 'pointer', fontSize: '12px' },
    checkbox: { width: '20px', height: '20px', cursor: 'pointer' },
    logoDropzone: { height: '120px', border: '2px dashed var(--border)', borderRadius: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', marginTop: '10px' },
};

export default Profile;
