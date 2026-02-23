import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, authHelpers } from '@/lib/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Clean up OAuth hash fragment from URL after successful authentication.
 * Supabase returns tokens in hash format: #access_token=...&refresh_token=...
 */
function cleanupAuthHash() {
  if (window.location.hash && window.location.hash.includes('access_token')) {
    // Remove the hash fragment while preserving the pathname
    const cleanUrl = window.location.pathname + window.location.search;
    window.history.replaceState({}, document.title, cleanUrl);
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const initializeAuth = async () => {
      try {
        // Check if we have an OAuth hash that needs processing
        const hasAuthHash = window.location.hash.includes('access_token');
        
        if (hasAuthHash) {
          // Supabase will automatically process the hash via detectSessionInUrl
          // Wait a moment for Supabase to process the hash fragment
          await new Promise(resolve => setTimeout(resolve, 100));
        }

        // Get the session (Supabase should have processed the hash by now)
        const currentSession = await authHelpers.getSession();
        
        if (isMounted) {
          setSession(currentSession);
          setUser(currentSession?.user ?? null);
          
          // Clean up the URL hash after successful auth
          if (hasAuthHash && currentSession) {
            cleanupAuthHash();
          }
          
          setLoading(false);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    // Listen for auth changes (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (isMounted) {
          setSession(session);
          setUser(session?.user ?? null);
          setLoading(false);
          
          // Clean up hash on successful sign in
          if (event === 'SIGNED_IN') {
            cleanupAuthHash();
          }
        }
      }
    );

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signInWithGoogle = async () => {
    try {
      await authHelpers.signInWithGoogle();
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await authHelpers.signOut();
      // Get the base URL from environment
      const baseUrl = import.meta.env.BASE_URL || '/';
      const homeUrl = baseUrl.endsWith('/') ? baseUrl : baseUrl + '/';
      // Redirect to home after sign out
      window.location.href = homeUrl;
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  const value = {
    user,
    session,
    loading,
    signInWithGoogle,
    signOut
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
