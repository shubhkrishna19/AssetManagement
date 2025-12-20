import React from 'react';
import { useTheme } from '../context/ThemeContext';

const Profile = () => {
    const { isDark, toggleTheme } = useTheme();

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>👤 Profile & Settings</h2>
            <p style={styles.subtitle}>Manage your account and enterprise configurations</p>

            <div style={styles.grid}>
                {/* User Card */}
                <div style={styles.card}>
                    <div style={styles.profileHeader}>
                        <div style={styles.largeAvatar}>SK</div>
                        <div>
                            <h3 style={styles.userName}>Shubh Krishna</h3>
                            <p style={styles.userRole}>System Administrator</p>
                        </div>
                    </div>

                    <div style={styles.infoList}>
                        <InfoItem label="Email" value="shubh@onslate.com" />
                        <InfoItem label="Organization" value="AssetPro Enterprise" />
                        <InfoItem label="Role" value="Managing Director" />
                        <InfoItem label="Location" value="Bangalore, India" />
                    </div>

                    <button style={styles.editBtn}>Edit Profile</button>
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

                    <div style={styles.settingItem}>
                        <div>
                            <div style={styles.settingLabel}>Export Defaults</div>
                            <div style={styles.settingDesc}>Preferred format for report downloads</div>
                        </div>
                        <select style={styles.select}>
                            <option>CSV (Excel)</option>
                            <option>PDF Report</option>
                            <option>JSON Data</option>
                        </select>
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
    editBtn: { width: '100%', padding: '14px', borderRadius: '12px', border: 'none', background: 'var(--accent)', color: 'white', fontWeight: '700', cursor: 'pointer' },
    sectionTitle: { fontSize: '18px', fontWeight: '700', color: 'var(--text)', marginBottom: '24px' },
    settingItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', paddingBottom: '20px', borderBottom: '1px solid var(--border)' },
    settingLabel: { fontSize: '15px', fontWeight: '700', color: 'var(--text)', marginBottom: '4px' },
    settingDesc: { fontSize: '13px', color: 'var(--textSecondary)' },
    toggleBtn: { padding: '8px 16px', borderRadius: '20px', border: '1px solid var(--border)', background: 'var(--background)', color: 'var(--text)', fontWeight: '600', cursor: 'pointer', fontSize: '12px' },
    checkbox: { width: '20px', height: '20px', cursor: 'pointer' },
    select: { padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--background)', color: 'var(--text)', outline: 'none' },
    logoDropzone: { height: '120px', border: '2px dashed var(--border)', borderRadius: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', marginTop: '10px' },
};

export default Profile;
