import { ReactNode, useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';

interface ProtectedRouteProps {
  children: ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute = ({
  children,
  requireAdmin = false,
}: ProtectedRouteProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          setIsAuthenticated(true);

          // Check if user is admin (you'll need to adjust this based on your user role logic)
          // For now, checking if user metadata has an admin role
          const isUserAdmin =
            user.user_metadata?.role === 'admin' ||
            user.email?.endsWith('@admin.halalhub.sg');
          setIsAdmin(isUserAdmin);
        } else {
          setIsAuthenticated(false);
          setIsAdmin(false);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setIsAuthenticated(false);
        setIsAdmin(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    // Set up auth state listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
      if (session?.user) {
        const isUserAdmin =
          session.user.user_metadata?.role === 'admin' ||
          session.user.email?.endsWith('@admin.halalhub.sg');
        setIsAdmin(isUserAdmin);
      } else {
        setIsAdmin(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card className="p-6">
          <div className="flex items-center space-x-2">
            <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-primary"></div>
            <span>Checking authentication...</span>
          </div>
        </Card>
      </div>
    );
  }

  // Not authenticated - redirect to auth page
  if (!isAuthenticated) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Authenticated but requires admin and user is not admin
  if (requireAdmin && !isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card className="p-6">
          <h2 className="mb-4 text-xl font-bold text-destructive">
            Access Denied
          </h2>
          <p className="text-muted-foreground">
            You do not have permission to access this page. Admin privileges are
            required.
          </p>
        </Card>
      </div>
    );
  }

  // All checks passed - render protected content
  return <>{children}</>;
};

export default ProtectedRoute;
