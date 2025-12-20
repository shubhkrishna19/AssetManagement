import React from 'react';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = () => {
    const { isDark, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            style={{
                ...styles.button,
                background: isDark ? 'rgba(241, 245, 249, 0.1)' : 'rgba(15, 23, 42, 0.05)',
            }}
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
            <div style={{
                ...styles.iconWrapper,
                transform: isDark ? 'rotate(180deg)' : 'rotate(0deg)',
            }}>
                {isDark ? '☀️' : '🌙'}
            </div>
        </button>
    );
};

const styles = {
    button: {
        width: '40px',
        height: '40px',
        borderRadius: '12px',
        border: 'none',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        outline: 'none',
    },
    iconWrapper: {
        fontSize: '20px',
        transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
    },
};

export default ThemeToggle;
