// Supabase configuration
export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// API endpoints
export const API_ENDPOINTS = {
  // Resources (replacing Projects)
  RESOURCES: '/resources',
  RESOURCE_BY_ID: (id) => `/resources/${id}`,
  
  // Authentication
  AUTH_LOGIN: '/auth/login',
  AUTH_LOGOUT: '/auth/logout',
  AUTH_USER: '/auth/user',
  
  // File upload
  UPLOAD_FILE: '/upload/file',
  UPLOAD_IMAGE: '/upload/image',
  
  // Export
  EXPORT_RESOURCES: '/export/resources'
};

// Database table names
export const TABLES = {
  RESOURCES: 'resources',
  USERS: 'users'
};

// Storage buckets
export const STORAGE_BUCKETS = {
  FILES: 'resource-files',
  IMAGES: 'resource-images'
}; 