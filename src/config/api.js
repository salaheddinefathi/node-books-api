// Central API configuration
const getApiBaseUrl = () => {
    // 1. Check environment variable first (standard Vite way)
    const envUrl = import.meta.env.VITE_API_URL;
    if (envUrl && envUrl.trim() !== "") return envUrl;

    // 2. Production Fallback: If we are not on localhost, use the Railway URL
    // We use the one you provided which is more stable
    const productionUrl = 'https://node-books-api-production.up.railway.app';

    if (typeof window !== 'undefined') {
        if (!window.location.hostname.includes('localhost') &&
            !window.location.hostname.includes('127.0.0.1')) {
            return productionUrl;
        }
    }

    // 3. Local Fallback
    return 'http://localhost:5000';
};

const API_BASE_URL = getApiBaseUrl();

export default API_BASE_URL;
