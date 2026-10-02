// Centralized API configuration supporting local development and cloud production (AWS / EC2)
export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL !== undefined
  ? import.meta.env.VITE_BACKEND_URL
  : (typeof window !== 'undefined' && window.location.port === '5173' ? 'http://localhost:8001' : '');
