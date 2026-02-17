import React, { createContext, useContext, useState, useEffect } from 'react';
import CONFIG from '../config';

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

// Map Creator roles to app roles
const mapCreatorRole = (creatorRole) => {
    const roleMap = {
        'admin': 'super-admin',
        'manager': 'manager',
        'employee': 'technician',
        'user': 'viewer',
        'super-admin': 'super-admin',
        'technician': 'technician',
        'viewer': 'viewer'
    };
    return roleMap[creatorRole?.toLowerCase()] || 'viewer';
};

export const UserProvider = ({ children }) => {
    // Check for Creator session first
    const getInitialUser = () => {
        // If we have Creator user info from config
        if (CONFIG.CREATOR_USER) {
            return {
                name: CONFIG.CREATOR_USER.name,
                role: mapCreatorRole(CONFIG.CREATOR_USER.role),
                id: CONFIG.CREATOR_USER.id,
                email: CONFIG.CREATOR_USER.email,
                avatar: CONFIG.CREATOR_USER.name?.charAt(0).toUpperCase() || 'U',
                isCreatorSession: true
            };
        }
        // Default to Super Admin for direct access
        return {
            name: "Bluewud Admin",
            role: "super-admin",
            avatar: "BW"
        };
    };

    const [currentUser, setCurrentUser] = useState(getInitialUser);

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

    // Switch user (for demo purposes)
    const switchUser = (userInfo) => {
        setCurrentUser({
            ...userInfo,
            avatar: userInfo.name?.charAt(0).toUpperCase() || 'U'
        });
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
        <UserContext.Provider value={{ currentUser, login, hasPermission, switchUser }}>
            {children}
        </UserContext.Provider>
    );
};
