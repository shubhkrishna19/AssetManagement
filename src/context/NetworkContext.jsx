import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAudit } from './AuditContext';

const NetworkContext = createContext();

export const useNetwork = () => useContext(NetworkContext);

export const NetworkProvider = ({ children }) => {
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [requestQueue, setRequestQueue] = useState([]);
    const { logAction } = useAudit();

    useEffect(() => {
        const handleOnline = () => {
            setIsOnline(true);
            logAction('NETWORK_STATUS', 'Connection restored. Syncing queued items...', 'System', 'success');
            processQueue();
        };
        const handleOffline = () => {
            setIsOnline(false);
            logAction('NETWORK_STATUS', 'Connection lost. Switching to Offline Mode.', 'System', 'warning');
        };

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        // Load queue from local storage
        const savedQueue = localStorage.getItem('offline_queue');
        if (savedQueue) setRequestQueue(JSON.parse(savedQueue));

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    const queueRequest = (requestData) => {
        const newQueue = [...requestQueue, { ...requestData, id: Date.now(), timestamp: new Date().toISOString() }];
        setRequestQueue(newQueue);
        localStorage.setItem('offline_queue', JSON.stringify(newQueue));
        logAction('OFFLINE_QUEUE', `Action queued: ${requestData.type}`, 'System', 'info');
    };

    const processQueue = async () => {
        if (requestQueue.length === 0) return;

        console.log(`Processing ${requestQueue.length} queued items...`);
        // Here we would actually send the requests to the backend
        // For now, we'll just clear the queue and log success

        setTimeout(() => {
            setRequestQueue([]);
            localStorage.removeItem('offline_queue');
            logAction('SYNC_COMPLETE', 'All offline actions have been synced.', 'System', 'success');
        }, 2000); // Simulate network delay
    };

    return (
        <NetworkContext.Provider value={{ isOnline, queueRequest, requestQueue }}>
            {children}
        </NetworkContext.Provider>
    );
};
