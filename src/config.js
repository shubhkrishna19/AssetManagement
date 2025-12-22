/**
 * ASSET LEDGER PRO - PRODUCTION CONFIGURATION
 * Centralized settings for environment switching and API endpoints.
 */

const CONFIG = {
    // MASTER SWITCH: Set to true for presentations/demos, false for actual company use.
    IS_DEMO_MODE: false,

    // APP BRANDING
    BRAND_NAME: 'Bluewud Asset Ledger Pro',
    VERSION: '5.5.0',
    LAUNCH_DATE: '2025-12-21',

    // API ENDPOINTS
    API: {
        BASE_URL: '/server/bridgex', // Catalyst API Gateway route
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
