// Central API configuration
const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://node-books-api-production.up.railway.app';

export default API_BASE_URL;
