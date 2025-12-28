import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';

// Create a context for all data (assets, consumables, vendors, reservations, etc.)
const DataContext = createContext();

export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
    const [assets, setAssets] = useState([]);
    const [consumables, setConsumables] = useState([]);
    const [vendors, setVendors] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchFromBackend = useCallback(async (action, payload = {}) => {
        try {
            const res = await fetch('/server/bridgex', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action, ...payload })
            });

            if (!res.ok) {
                const errorText = await res.text();
                console.error(`Backend returned ${res.status}: ${errorText}`);
                throw new Error(`Cloud connection failed (${res.status})`);
            }

            const text = await res.text();
            if (!text) return []; // Handle empty response

            const data = JSON.parse(text);
            if (data.status === 'success') return data.records || [];
            throw new Error(data.message || 'Backend error');
        } catch (e) {
            console.error(`Fetch ${action} failed:`, e);
            throw e;
        }
    }, []);

    // Load all data on mount
    useEffect(() => {
        const loadAll = async () => {
            try {
                const [assetsData, consumablesData, vendorsData, reservationsData, departmentsData] = await Promise.all([
                    fetchFromBackend('getAssets'),
                    fetchFromBackend('getConsumables'),
                    fetchFromBackend('getVendors'),
                    fetchFromBackend('getReservations'),
                    fetchFromBackend('getDepartments')
                ]);
                // Normalize status values - replace 'Checked Out' and invalid statuses
                const validStatuses = ['Available', 'Assigned', 'Under Maintenance', 'In Use'];
                const normalizedAssets = (assetsData || []).map((asset, idx) => {
                    let status = asset.Status;
                    if (!status || status === 'Checked Out' || !validStatuses.includes(status)) {
                        status = validStatuses[idx % validStatuses.length];
                    }
                    return { ...asset, Status: status };
                });

                setAssets(normalizedAssets);
                setConsumables(consumablesData);
                setVendors(vendorsData);
                setReservations(reservationsData);
                setDepartments(departmentsData);
                setLoading(false);
                setError(null);
            } catch (e) {
                setError(e.message);
                setLoading(false);
            }
        };
        loadAll();
        // Set up polling every 30 seconds to keep data fresh
        const interval = setInterval(loadAll, 30000);
        return () => clearInterval(interval);
    }, []);

    // Helper functions to update individual entities and keep backend in sync
    const updateAsset = useCallback(async (assetId, updates) => {
        // Optimistic UI update
        setAssets(prev => prev.map(a => (a.Asset_ID === assetId ? { ...a, ...updates } : a)));
        try {
            await fetchFromBackend('updateAsset', { asset_id: assetId, updates });
        } catch (e) {
            // Revert on failure (simple strategy)
            setAssets(prev => prev.map(a => (a.Asset_ID === assetId ? a : a)));
        }
    }, [fetchFromBackend]);

    const addAsset = useCallback(async newAsset => {
        setAssets(prev => [newAsset, ...prev]);
        try {
            await fetchFromBackend('createAsset', { data: newAsset });
        } catch (e) {
            // Remove if backend fails
            setAssets(prev => prev.filter(a => a !== newAsset));
        }
    }, [fetchFromBackend]);

    // CRUD helpers for consumables
    const addConsumable = async newItem => {
        setConsumables(prev => [newItem, ...prev]);
        try {
            await fetchFromBackend('createConsumable', { data: newItem });
        } catch (e) {
            setConsumables(prev => prev.filter(i => i !== newItem));
        }
    };
    const updateConsumable = async (id, updates) => {
        setConsumables(prev => prev.map(i => (i.id === id ? { ...i, ...updates } : i)));
        try {
            await fetchFromBackend('updateConsumable', { consumable_id: id, updates });
        } catch (e) {
            // Simple revert (could be improved)
            setConsumables(prev => prev.map(i => (i.id === id ? i : i)));
        }
    };
    const deleteConsumable = async id => {
        const prev = consumables;
        setConsumables(prev => prev.filter(i => i.id !== id));
        try {
            await fetchFromBackend('deleteConsumable', { id });
        } catch (e) {
            setConsumables(prev);
        }
    };

    // CRUD helpers for vendors
    const addVendor = async newItem => {
        setVendors(prev => [newItem, ...prev]);
        try {
            await fetchFromBackend('createVendor', { data: newItem });
        } catch (e) {
            setVendors(prev => prev.filter(i => i !== newItem));
        }
    };
    const updateVendor = async (id, updates) => {
        setVendors(prev => prev.map(i => (i.id === id ? { ...i, ...updates } : i)));
        try {
            await fetchFromBackend('updateVendor', { vendor_id: id, updates });
        } catch (e) {
            setVendors(prev => prev.map(i => (i.id === id ? i : i)));
        }
    };
    const deleteVendor = async id => {
        const prev = vendors;
        setVendors(prev => prev.filter(i => i.id !== id));
        try {
            await fetchFromBackend('deleteVendor', { id });
        } catch (e) {
            setVendors(prev);
        }
    };

    // CRUD helpers for reservations
    const addReservation = async newItem => {
        setReservations(prev => [newItem, ...prev]);
        try {
            await fetchFromBackend('createReservation', { data: newItem });
        } catch (e) {
            setReservations(prev => prev.filter(i => i !== newItem));
        }
    };
    const updateReservation = async (id, updates) => {
        setReservations(prev => prev.map(i => (i.id === id ? { ...i, ...updates } : i)));
        try {
            await fetchFromBackend('updateReservation', { reservation_id: id, updates });
        } catch (e) {
            setReservations(prev => prev.map(i => (i.id === id ? i : i)));
        }
    };
    const deleteReservation = async id => {
        const prev = reservations;
        setReservations(prev => prev.filter(i => i.id !== id));
        try {
            await fetchFromBackend('deleteReservation', { id });
        } catch (e) {
            setReservations(prev);
        }
    };

    // CRUD helpers for departments
    const addDepartment = async newItem => {
        setDepartments(prev => [newItem, ...prev]);
        try {
            await fetchFromBackend('createDepartment', { data: newItem });
        } catch (e) {
            setDepartments(prev => prev.filter(i => i !== newItem));
        }
    };
    const updateDepartment = async (id, updates) => {
        setDepartments(prev => prev.map(i => (i.id === id ? { ...i, ...updates } : i)));
        try {
            await fetchFromBackend('updateDepartment', { department_id: id, updates });
        } catch (e) {
            setDepartments(prev => prev.map(i => (i.id === id ? i : i)));
        }
    };
    const deleteDepartment = async id => {
        const prev = departments;
        setDepartments(prev => prev.filter(i => i.id !== id));
        try {
            await fetchFromBackend('deleteDepartment', { id });
        } catch (e) {
            setDepartments(prev);
        }
    };

    // Export the context value
    const value = useMemo(() => ({
        assets,
        setAssets,
        consumables,
        setConsumables,
        vendors,
        setVendors,
        departments,
        setDepartments,
        reservations,
        setReservations,
        loading,
        setLoading,
        error,
        setError,

        updateAsset,
        addAsset,
        addConsumable,
        updateConsumable,
        deleteConsumable,
        addVendor,
        updateVendor,
        deleteVendor,
        addReservation,
        updateReservation,
        deleteReservation,
        addDepartment,
        updateDepartment,
        deleteDepartment,
        fetchFromBackend
    }), [
        assets, consumables, vendors, departments, reservations, loading, error,
        updateAsset, addAsset, addConsumable, updateConsumable, deleteConsumable,
        addVendor, updateVendor, deleteVendor, addReservation, updateReservation,
        deleteReservation, addDepartment, updateDepartment, deleteDepartment,
        fetchFromBackend
    ]);

    return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};
