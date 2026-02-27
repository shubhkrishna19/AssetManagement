import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import CONFIG from '../config';

const AuditContext = createContext();

export const useAudit = () => useContext(AuditContext);

export const AuditProvider = ({ children }) => {
    const [logs, setLogs] = useState([]);

    // Load logs from backend on mount
    useEffect(() => {
        const loadLogs = async () => {
            try {
                const res = await fetch(CONFIG.API.BASE_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ action: 'getLogs' })
                });
                const data = await res.json();
                if (data.status === 'success') {
                    const records = data.records || [];
                    // Normalize backend keys (Action -> action, Type -> type, etc)
                    const normalized = records.map(r => {
                        const row = r.Logs || r;
                        return {
                            id: row.Log_ID,
                            action: row.Action,
                            details: row.Details,
                            user: row.User_Name,
                            timestamp: row.Timestamp,
                            type: row.Type
                        };
                    });
                    setLogs(normalized);
                }
            } catch (e) {
                console.error("Failed to fetch logs from cloud", e);
                // Fallback to local storage if offline
                const savedLogs = localStorage.getItem('audit_logs');
                if (savedLogs) setLogs(JSON.parse(savedLogs));
            }
        };
        loadLogs();
    }, []);

    const logAction = useCallback(async (action, details, user = "System", type = "info") => {
        const newLog = {
            Log_ID: `LOG-${Date.now()}`,
            Action: action,
            Details: details,
            User_Name: user,
            Timestamp: new Date().toISOString(),
            Type: type
        };

        // Optimistic UI update
        setLogs(prevLogs => {
            const updated = [newLog, ...prevLogs].slice(0, 100);
            localStorage.setItem('audit_logs', JSON.stringify(updated));
            return updated;
        });

        // Sync to Cloud
        try {
            await fetch(CONFIG.API.BASE_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'create', data: newLog, table_name: 'Logs' })
            });
        } catch (e) {
            console.error("Failed to sync log to cloud", e);
        }
    }, []);

    const clearLogs = async () => {
        if (window.confirm("Permanently clear cloud logs?")) {
            setLogs([]);
            localStorage.removeItem('audit_logs');
            try {
                await fetch(CONFIG.API.BASE_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ action: 'reset_all', table_name: 'Logs' })
                });
            } catch (e) {
                console.error("Failed to clear cloud logs", e);
            }
        }
    };

    return (
        <AuditContext.Provider value={{ logs, logAction, clearLogs }}>
            {children}
        </AuditContext.Provider>
    );
};
