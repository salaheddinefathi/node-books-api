// Central API configuration
const getApiBaseUrl = () => {
    if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL;

    // In production/mobile, localhost:5000 won't work. 
    // If we're on a non-localhost domain, we might want to use a relative path /api
    // or a hardcoded production URL.
    if (typeof window !== 'undefined' && !window.location.hostname.includes('localhost')) {
        // Fallback for your specific Vercel deployment if VITE_API_URL is missing
        return 'https://node-books-api-ekwm.vercel.app';
    }

    return 'http://localhost:5000';
};

const API_BASE_URL = getApiBaseUrl();

export default API_BASE_URL;
