// Get the current hostname
const hostname = window.location.hostname;

// If we're in production, use the same hostname, otherwise use localhost
export const API_URL = process.env.NODE_ENV === 'production'
  ? ''  // Empty string means same origin
  : 'http://localhost:5000'; 