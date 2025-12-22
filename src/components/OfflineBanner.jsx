import React from 'react';
import { useNetwork } from '../context/NetworkContext';

const OfflineBanner = () => {
    const { isOnline, requestQueue } = useNetwork();

    if (isOnline) return null;

    return (
        <div style={styles.banner}>
            <span style={{ fontSize: '18px' }}>📡</span>
            <div style={styles.content}>
                <strong>You are currently offline</strong>
                <span style={styles.subText}>
                    {requestQueue.length > 0
                        ? `${requestQueue.length} changes will be synced when you reconnect.`
                        : "Changes you make will be saved locally."}
                </span>
            </div>
            <div style={styles.pulse} />
        </div>
    );
};

const styles = {
    banner: {
        position: 'fixed',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        background: '#2d3436',
        color: 'white',
        padding: '12px 24px',
        borderRadius: '30px',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
        zIndex: 1000,
        border: '1px solid rgba(255,255,255,0.1)',
        backdropFilter: 'blur(10px)',
        maxWidth: '90%',
        width: 'auto'
    },
    content: {
        display: 'flex',
        flexDirection: 'column',
        gap: '2px'
    },
    subText: {
        fontSize: '11px',
        opacity: 0.8
    },
    pulse: {
        width: '8px',
        height: '8px',
        background: '#e17055',
        borderRadius: '50%',
        animation: 'pulse 1.5s infinite'
    }
};

export default OfflineBanner;
