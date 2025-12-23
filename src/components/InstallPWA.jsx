import React, { useState, useEffect } from 'react';

const InstallPWA = () => {
    const [supportsPWA, setSupportsPWA] = useState(false);
    const [promptInstall, setPromptInstall] = useState(null);

    useEffect(() => {
        const handler = (e) => {
            e.preventDefault();
            setSupportsPWA(true);
            setPromptInstall(e);
        };
        window.addEventListener('beforeinstallprompt', handler);

        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    const onClick = (evt) => {
        evt.preventDefault();
        if (!promptInstall) {
            return;
        }
        promptInstall.prompt();
    };

    if (!supportsPWA) {
        return null;
    }

    return (
        <button
            onClick={onClick}
            style={{
                width: '100%',
                padding: '12px',
                marginBottom: '15px',
                background: 'linear-gradient(135deg, #6c5ce7, #a29bfe)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                boxShadow: '0 4px 15px rgba(108, 92, 231, 0.3)',
                transition: 'transform 0.2s'
            }}
            title="Install as App"
        >
            <span>📲</span> Install App
        </button>
    );
};

export default InstallPWA;
