import React from 'react';

const HamburgerMenu = ({ isOpen, onClick }) => (
    <button
        onClick={onClick}
        style={{
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: '8px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-around',
            width: '32px',
            height: '32px',
            zIndex: 200, // Above sidebar
        }}
        aria-label="Toggle Menu"
    >
        <div style={{ ...barStyle, transform: isOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none' }} />
        <div style={{ ...barStyle, opacity: isOpen ? 0 : 1 }} />
        <div style={{ ...barStyle, transform: isOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none' }} />
    </button>
);

const barStyle = {
    width: '100%',
    height: '3px',
    background: 'var(--text)',
    borderRadius: '2px',
    transition: 'all 0.3s linear',
    transformOrigin: '1px'
};

export default HamburgerMenu;
