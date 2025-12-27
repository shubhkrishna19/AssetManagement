import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
    // Default to Super Admin for development
    const [currentUser, setCurrentUser] = useState({
        name: "Bluewud Admin",
        role: "super-admin", // 'super-admin', 'manager', 'technician', 'viewer'
        avatar: "BW"
    });

    const login = (role) => {
        const roleNames = {
            'super-admin': "Bluewud SuperAdmin",
            'manager': "Bluewud Manager",
            'technician': "Bluewud Technician",
            'viewer': "Bluewud Viewer"
        };
        setCurrentUser(prev => ({
            ...prev,
            role: role,
            name: roleNames[role] || "User"
        }));
    };

    const hasPermission = (action) => {
        const { role } = currentUser;

        if (role === 'super-admin') return true;

        const permissions = {
            manager: ['create', 'edit', 'import', 'bulk_action', 'maintenance', 'consumables', 'audit', 'checkout', 'reservations'],
            technician: ['maintenance', 'audit', 'checkout', 'status_update', 'scan'],
            viewer: []
        };

        const allowedActions = permissions[role] || [];

        // Viewer can only read (default true if not in restricted list)
        const restrictedGlobal = ['create', 'edit', 'delete', 'import', 'bulk_action', 'settings'];

        if (role === 'viewer') {
            return !restrictedGlobal.includes(action);
        }

        // Specific role checks
        if (action === 'delete') return role === 'super-admin'; // Only super-admin deletes

        return allowedActions.includes(action);
    };

    return (
        <UserContext.Provider value={{ currentUser, login, hasPermission }}>
            {children}
        </UserContext.Provider>
    );
};
