/**
 * ASSET LEDGER PRO - PRODUCTION CONFIGURATION
 * Centralized settings for environment switching and API endpoints.
 */

// Auto-detect environment based on current hostname
const getApiBaseUrl = () => {
    if (typeof window === 'undefined') return '/server/bridgex';

    const hostname = window.location.hostname;

    // Production: coredev-913495338.catalystserverless.com
    if (hostname.includes('catalystserverless.com') && !hostname.includes('development')) {
        return 'https://coredev-913495338.catalystserverless.com/server/bridgex';
    }

    // Development: coredev-913495338.development.catalystserverless.com
    if (hostname.includes('development.catalystserverless.com')) {
        return 'https://coredev-913495338.development.catalystserverless.com/server/bridgex';
    }

    // GitHub/Vercel/External hosting - fallback to dev or prod based on your preference
    // If you are pushing to Github and Slate, it needs the absolute URL to Catalyst.
    return 'https://coredev-913495338.catalystserverless.com/server/bridgex'; // Default to PROD for external UI
};

// Detect if running inside Creator iframe
const isCreatorEmbed = () => {
    if (typeof window === 'undefined') return false;
    const params = new URLSearchParams(window.location.search);
    return (
        window.location.href.includes('creator.zoho.com') ||
        params.has('zuid') ||
        params.has('creator')
    );
};

// Get Creator user info from URL params
const getCreatorUser = () => {
    if (typeof window === 'undefined') return null;
    const params = new URLSearchParams(window.location.search);
    const zuid = params.get('zuid');
    const role = params.get('role') || params.get('user_role');
    const name = params.get('name') || params.get('user_name');
    const email = params.get('email');

    if (zuid) {
        return {
            id: zuid,
            name: name || 'User',
            email: email || '',
            role: role || 'employee',
            isCreatorSession: true
        };
    }
    return null;
};

const CONFIG = {
    // MASTER SWITCH: Set to true for presentations/demos, false for actual company use.
    IS_DEMO_MODE: false,

    // APP BRANDING
    BRAND_NAME: 'Bluewud Asset Ledger Pro',
    VERSION: '5.6.0',
    LAUNCH_DATE: '2025-12-21',

    // EMBED DETECTION
    IS_EMBEDDED: isCreatorEmbed(),
    CREATOR_USER: getCreatorUser(),

    // API ENDPOINTS - Auto-detects based on current hostname
    API: {
        BASE_URL: getApiBaseUrl(),
        RETRY_ATTEMPTS: 3,
        TIMEOUT: 5000,
    },

    // FEATURE FLAGS
    FEATURES: {
        MAINTENANCE: true,
        AUDIT_MODE: true,
        ACTIVITY_LOG: true,
        CHECK_IN_OUT: true,
        ANALYTICS: true,
    }
};

export default CONFIG;
