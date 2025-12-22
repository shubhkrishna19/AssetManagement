import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
    // Default to Admin for development convenience
    const [currentUser, setCurrentUser] = useState({
        name: "Demo User",
        role: "admin", // 'admin' or 'viewer'
        avatar: "SK"
    });

    const login = (role) => {
        setCurrentUser(prev => ({
            ...prev,
            role: role,
            name: role === 'admin' ? "Demo Admin" : "Demo Viewer"
        }));
    };

    const hasPermission = (action) => {
        if (currentUser.role === 'admin') return true;

        // Viewer Restrictions
        const restrictedActions = [
            'create', 'edit', 'delete', 'import', 'bulk_action', 'settings'
        ];

        if (restrictedActions.includes(action)) return false;

        return true; // Default to allowing read-only actions
    };

    return (
        <UserContext.Provider value={{ currentUser, login, hasPermission }}>
            {children}
        </UserContext.Provider>
    );
};
