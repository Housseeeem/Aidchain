import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:5000',
});

// Export setAuthToken function
export const setAuthToken = (token) => {
    if (token) {
        API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete API.defaults.headers.common['Authorization'];
    }
};

// Initialize token from localStorage on client-side
if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
        setAuthToken(token);
    }
}

export default API;