import React, { createContext, useContext, useState, useEffect } from 'react';

export const themes = {
    light: {
        name: 'light',
        background: '#F8FAFC',
        surface: '#FFFFFF',
        surfaceHover: '#F1F5F9',
        text: '#1E293B',
        textSecondary: '#64748B',
        border: '#E2E8F0',
        accent: '#0984e3',
        accentLight: 'rgba(9, 132, 227, 0.1)',
        success: '#00b894',
        warning: '#fdcb6e',
        danger: '#e74c3c',
        shadow: '0 4px 20px rgba(0,0,0,0.05)',
    },
    dark: {
        name: 'dark',
        background: '#0f172a',
        surface: '#1e293b',
        surfaceHover: '#334155',
        text: '#F1F5F9',
        textSecondary: '#94A3B8',
        border: 'rgba(255,255,255,0.1)',
        accent: '#3b82f6',
        accentLight: 'rgba(59, 130, 246, 0.2)',
        success: '#10B981',
        warning: '#F59E0B',
        danger: '#EF4444',
        shadow: '0 8px 32px rgba(0,0,0,0.3)',
    }
};

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [isDark, setIsDark] = useState(() => {
        const saved = localStorage.getItem('theme');
        return saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
    });

    const theme = isDark ? themes.dark : themes.light;

    useEffect(() => {
        localStorage.setItem('theme', isDark ? 'dark' : 'light');

        // Inject CSS variables
        const root = document.documentElement;
        Object.entries(theme).forEach(([key, value]) => {
            if (key !== 'name') {
                root.style.setProperty(`--${key}`, value);
            }
        });

        if (isDark) {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
    }, [isDark, theme]);

    const toggleTheme = () => setIsDark(prev => !prev);

    return (
        <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) throw new Error('useTheme must be used within ThemeProvider');
    return context;
};

export default ThemeProvider;
