import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ViewToggle = ({ viewMode, setViewMode }) => {
    const isGrouped = viewMode === 'grouped';

    return (
        <button
            onClick={() => setViewMode(isGrouped ? 'list' : 'grouped')}
            style={{
                ...styles.button,
                background: isGrouped
                    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                    : 'rgba(15, 23, 42, 0.08)',
            }}
            title={isGrouped ? 'Switch to List View' : 'Switch to Grouped View'}
        >
            <AnimatePresence mode="wait">
                <motion.div
                    key={isGrouped ? 'grouped' : 'list'}
                    initial={{ scale: 0.5, opacity: 0, rotate: -180 }}
                    animate={{ scale: 1, opacity: 1, rotate: 0 }}
                    exit={{ scale: 0.5, opacity: 0, rotate: 180 }}
                    transition={{ duration: 0.3, ease: 'backOut' }}
                    style={{
                        ...styles.iconWrapper,
                        color: isGrouped ? 'white' : 'var(--text)'
                    }}
                >
                    {isGrouped ? '▦' : '☰'}
                </motion.div>
            </AnimatePresence>
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
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    },
    iconWrapper: {
        fontSize: '18px',
        fontWeight: 'bold',
        transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
    },
};

export default ViewToggle;
