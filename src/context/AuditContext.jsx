import React, { createContext, useContext, useState, useEffect } from 'react';

const AuditContext = createContext();

export const useAudit = () => useContext(AuditContext);

export const AuditProvider = ({ children }) => {
    const [logs, setLogs] = useState([]);

    // Load logs from localStorage on mount
    useEffect(() => {
        const savedLogs = localStorage.getItem('audit_logs');
        if (savedLogs) {
            try {
                setLogs(JSON.parse(savedLogs));
            } catch (e) {
                console.error("Failed to parse audit logs", e);
            }
        } else {
            // Seed with initial login if empty
            const initialLog = {
                id: Date.now(),
                action: 'SYSTEM_INIT',
                details: 'Audit Trail initialized.',
                user: 'System',
                timestamp: new Date().toISOString(),
                type: 'info'
            };
            setLogs([initialLog]);
            localStorage.setItem('audit_logs', JSON.stringify([initialLog]));
        }
    }, []);

    const logAction = (action, details, user = "System", type = "info") => {
        const newLog = {
            id: Date.now(),
            action,
            details,
            user,
            timestamp: new Date().toISOString(),
            type // 'info', 'warning', 'error', 'success'
        };

        setLogs(prevLogs => {
            const updatedLogs = [newLog, ...prevLogs].slice(0, 100); // Keep last 100 logs
            localStorage.setItem('audit_logs', JSON.stringify(updatedLogs));
            return updatedLogs;
        });
    };

    const clearLogs = () => {
        setLogs([]);
        localStorage.removeItem('audit_logs');
    };

    return (
        <AuditContext.Provider value={{ logs, logAction, clearLogs }}>
            {children}
        </AuditContext.Provider>
    );
};
