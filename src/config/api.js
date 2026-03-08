// Central API configuration
const getApiBaseUrl = () => {
    // Standard Railway Production URL
    const productionUrl = 'https://node-books-api-production.up.railway.app';

    // Check if running locally
    if (typeof window !== 'undefined') {
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            return 'http://localhost:5000';
        }
    }

    return productionUrl;
};

const API_BASE_URL = getApiBaseUrl();

export default API_BASE_URL;
