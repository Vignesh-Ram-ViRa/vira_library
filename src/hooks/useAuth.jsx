import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  getCurrentUser,
  onAuthStateChange,
  signOut as supabaseSignOut,
  signIn as supabaseSignIn,
  signUp as supabaseSignUp,
  signInWithMagicLink as supabaseSignInWithMagicLink,
  enterGuestMode,
  exitGuestMode,
  isGuestMode
} from '../utils/supabase';

// Create auth context
const AuthContext = createContext();

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(false);

  // Debug auth state
  console.log('AuthProvider state:', { user: !!user, loading, isGuest });

  // Initialize auth state
  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      console.log('Initializing auth...');
      try {
        // Check if in guest mode
        if (isGuestMode()) {
          console.log('Found guest mode');
          const guestUser = enterGuestMode();
          if (mounted) {
            setUser(guestUser);
            setIsGuest(true);
            setLoading(false);
          }
          return;
        }

        // Check for authenticated user
        console.log('Checking for authenticated user...');
        const currentUser = await getCurrentUser();
        console.log('Current user result:', !!currentUser);
        if (mounted) {
          setUser(currentUser);
          setIsGuest(false);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        if (mounted) {
          setUser(null);
          setIsGuest(false);
          setLoading(false);
        }
      }
    };

    initializeAuth();

    return () => {
      mounted = false;
    };
  }, []);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, session?.user?.email);

      if (event === 'SIGNED_IN' && session?.user) {
        exitGuestMode(); // Exit guest mode if signing in
        setUser(session.user);
        setIsGuest(false);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setIsGuest(false);
      }
      
      setLoading(false);
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // Sign in function
  const signIn = async (email, password) => {
    try {
      setLoading(true);
      const response = await supabaseSignIn(email, password);
      // User state will be updated by onAuthStateChange
      return response;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  // Sign up function
  const signUp = async (email, password, userData = {}) => {
    try {
      setLoading(true);
      const response = await supabaseSignUp(email, password, userData);
      // User state will be updated by onAuthStateChange
      return response;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  // Magic link sign in
  const signInWithMagicLink = async (email) => {
    try {
      setLoading(true);
      const response = await supabaseSignInWithMagicLink(email);
      setLoading(false);
      return response;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  // Sign out function
  const signOut = async () => {
    try {
      setLoading(true);
      
      if (isGuest) {
        // Exit guest mode
        exitGuestMode();
        setUser(null);
        setIsGuest(false);
        setLoading(false);
        // Force redirect to login page
        window.location.href = '/login';
        return { success: true };
      } else {
        // Sign out from Supabase
        const response = await supabaseSignOut();
        // User state will be updated by onAuthStateChange
        return response;
      }
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  // Enter guest mode function
  const enterGuest = () => {
    try {
      const guestUser = enterGuestMode();
      setUser(guestUser);
      setIsGuest(true);
      return guestUser;
    } catch (error) {
      console.error('Error entering guest mode:', error);
      throw error;
    }
  };

  // Check if user is authenticated (not guest)
  const isAuthenticated = () => {
    return !!(user && !isGuest);
  };

  // Check if user is owner (authenticated and not guest)
  const isOwner = () => {
    return isAuthenticated();
  };

  // Get user display name
  const getDisplayName = () => {
    if (!user) return 'Anonymous';
    if (isGuest) return 'Guest User';
    return user.user_metadata?.display_name || user.email || 'User';
  };

  const value = {
    // State
    user,
    loading,
    isGuest,
    
    // Auth functions
    signIn,
    signUp,
    signInWithMagicLink,
    signOut,
    enterGuest,
    
    // Helper functions
    isAuthenticated: isAuthenticated(),
    isOwner: isOwner(),
    displayName: getDisplayName()
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 