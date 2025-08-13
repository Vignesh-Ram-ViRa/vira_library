import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '../constants/apiEndpoints';

// Initialize Supabase client with session configuration
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    // Session will persist in localStorage
    persistSession: true,
    // Auto refresh tokens
    autoRefreshToken: true,
    // Detect session in URL
    detectSessionInUrl: true
  }
});

/**
 * Helper function to get the current user
 * @returns {Promise<Object|null>} User object or null if not authenticated
 */
export const getCurrentUser = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) {
      // Don't log session missing errors as they're normal when not logged in
      if (error.message !== 'Auth session missing!') {
        console.error('Error getting current user:', error);
      }
      return null;
    }
    return user;
  } catch (error) {
    // Don't log session missing errors as they're normal when not logged in
    if (error.message !== 'Auth session missing!') {
      console.error('Error in getCurrentUser:', error);
    }
    return null;
  }
};

/**
 * Helper function to check if user is authenticated
 * @returns {Promise<boolean>} True if authenticated, false otherwise
 */
export const isAuthenticated = async () => {
  const user = await getCurrentUser();
  return !!user;
};

/**
 * Helper function to sign out user
 * @returns {Promise<Object>} Supabase auth response
 */
export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error);
      throw error;
    }
    return { success: true };
  } catch (error) {
    console.error('Error in signOut:', error);
    throw error;
  }
};

/**
 * Helper function to sign in user
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<Object>} Supabase auth response
 */
export const signIn = async (email, password) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    if (error) {
      console.error('Error signing in:', error);
      throw error;
    }
    return data;
  } catch (error) {
    console.error('Error in signIn:', error);
    throw error;
  }
};

/**
 * Helper function to sign up user
 * @param {string} email - User email
 * @param {string} password - User password
 * @param {Object} userData - Additional user data
 * @returns {Promise<Object>} Supabase auth response
 */
export const signUp = async (email, password, userData = {}) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    });
    if (error) {
      console.error('Error signing up:', error);
      throw error;
    }
    return data;
  } catch (error) {
    console.error('Error in signUp:', error);
    throw error;
  }
};

/**
 * Helper function to sign in with magic link
 * @param {string} email - User email
 * @returns {Promise<Object>} Supabase auth response
 */
export const signInWithMagicLink = async (email) => {
  try {
    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: false
      }
    });
    if (error) {
      console.error('Error sending magic link:', error);
      throw error;
    }
    return data;
  } catch (error) {
    console.error('Error in signInWithMagicLink:', error);
    throw error;
  }
};

/**
 * Listen for auth state changes
 * @param {Function} callback - Callback function to handle auth state changes
 * @returns {Function} Unsubscribe function
 */
export const onAuthStateChange = (callback) => {
  const { data: { subscription } } = supabase.auth.onAuthStateChange(callback);
  return () => subscription.unsubscribe();
};

// Guest mode functionality
const GUEST_USER_KEY = 'vira-library-guest-user';

/**
 * Enter guest mode
 * @returns {Object} Guest user object
 */
export const enterGuestMode = () => {
  const guestUser = {
    id: 'guest-user',
    email: 'guest@viralibrary.dev',
    user_metadata: {
      display_name: 'Guest User',
      is_guest: true
    },
    app_metadata: {},
    aud: 'authenticated',
    created_at: new Date().toISOString()
  };
  
  localStorage.setItem(GUEST_USER_KEY, JSON.stringify(guestUser));
  return guestUser;
};

/**
 * Exit guest mode
 */
export const exitGuestMode = () => {
  localStorage.removeItem(GUEST_USER_KEY);
};

/**
 * Check if in guest mode
 * @returns {boolean} True if in guest mode
 */
export const isGuestMode = () => {
  return !!localStorage.getItem(GUEST_USER_KEY);
}; 