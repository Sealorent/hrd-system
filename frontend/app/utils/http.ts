// /utils/http.ts
import { storage } from './storage';
import { StorageKeys } from './storageKeys';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || ''; // Base URL of your API

const http = {
  get: async (url: string, options = {}) => {
    return httpRequest('GET', url, options);
  },
  post: async (url: string, body: any, options = {}) => {
    return httpRequest('POST', url, { ...options, body: JSON.stringify(body) });
  },
  put: async (url: string, body: any, options = {}) => {
    return httpRequest('PUT', url, { ...options, body: JSON.stringify(body) });
  },
  delete: async (url: string, options = {}) => {
    return httpRequest('DELETE', url, options);
  },
};

async function httpRequest(method: string, url: string, options: RequestInit) {
    const token = storage.getItem(StorageKeys.TOKEN);
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    // Log the request details
    console.log('Request:', {
        method,
        url: `${API_BASE_URL}${url}`,
        headers,
        body: options.body || null,
    });


    const response = await fetch(`${API_BASE_URL}${url}`, {
        method,
        headers,
        ...options,
    });

    // Log the raw response before parsing
    console.log('Raw Response:', response);

    if (response.status === 404 && response.url.includes('/employees/profile')) {
        console.error('Profile not found (404), logging out...');
        handleUnauthorized();
    }
    // Intercept 401 response and handle logout
    if (response.status === 401 || response.status === 403) {
        handleUnauthorized();
    }

    const data = await response.json();
    if (!response.ok) {
        console.log('Error Response:', data.error);
        throw new Error(data.error);
    }
    
    return data;
}

function handleUnauthorized() {
    // Token expired or unauthorized
    // goto login page where the path now not /login or /register
    storage.removeItem(StorageKeys.TOKEN);

    const currentPath = window.location.pathname; // Get the current path
    if (currentPath !== '/login' && currentPath !== '/login' && currentPath !== '/register') {
        window.location.href = '/login'; // Force redirect to login
    }
    


}

export default http;
