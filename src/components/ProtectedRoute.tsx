import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();
  const [shouldRedirect, setShouldRedirect] = useState(false);

  // Check if URL has OAuth hash that's still being processed
  const hasAuthHash = typeof window !== 'undefined' && 
    window.location.hash.includes('access_token');

  useEffect(() => {
    // Only redirect if:
    // 1. Auth loading is complete
    // 2. No user is authenticated
    // 3. No OAuth hash is being processed
    if (!loading && !user && !hasAuthHash) {
      // Small delay to ensure auth state is fully settled
      const timer = setTimeout(() => {
        setShouldRedirect(true);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [user, loading, hasAuthHash]);

  useEffect(() => {
    if (shouldRedirect) {
      setLocation('/signin');
    }
  }, [shouldRedirect, setLocation]);

  // Show loading spinner while checking authentication or processing OAuth
  if (loading || hasAuthHash) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-emerald-600" />
          <p className="mt-4 text-slate-600">
            {hasAuthHash ? 'Completing sign in...' : 'Loading...'}
          </p>
        </div>
      </div>
    );
  }

  // Show nothing while redirect is pending
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-emerald-600" />
          <p className="mt-4 text-slate-600">Redirecting to sign in...</p>
        </div>
      </div>
    );
  }

  // Render the protected content
  return <>{children}</>;
}
