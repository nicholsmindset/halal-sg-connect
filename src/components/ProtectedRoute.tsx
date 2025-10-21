import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Card } from '@/components/ui/card';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'user' | 'admin' | 'super_admin';
  requireAdmin?: boolean;
}

/**
 * Protected route wrapper that enforces authentication and role-based access
 *
 * @param children - The component to render if authorized
 * @param requiredRole - Specific role required (user, admin, super_admin)
 * @param requireAdmin - Shorthand for requiring admin or super_admin role
 */
export function ProtectedRoute({
  children,
  requiredRole,
  requireAdmin = false,
}: ProtectedRouteProps) {
  const { user, isLoading, role } = useAuth();
  const location = useLocation();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Card className="p-8">
          <div className="flex flex-col items-center space-y-4">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
            <p className="text-sm text-muted-foreground">
              Verifying authentication...
            </p>
          </div>
        </Card>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return (
      <Navigate
        to="/auth"
        state={{ from: location }}
        replace
      />
    );
  }

  // Check admin access if required
  if (requireAdmin) {
    if (role !== 'admin' && role !== 'super_admin') {
      return (
        <Navigate
          to="/dashboard"
          state={{ error: 'Insufficient permissions. Admin access required.' }}
          replace
        />
      );
    }
  }

  // Check specific role requirement
  if (requiredRole) {
    // Super admin can access everything
    if (role !== 'super_admin' && role !== requiredRole) {
      return (
        <Navigate
          to="/dashboard"
          state={{
            error: `Access denied. ${requiredRole} role required.`,
          }}
          replace
        />
      );
    }
  }

  // User is authenticated and authorized
  return <>{children}</>;
}

/**
 * Higher-order component version for class components or special cases
 */
export function withProtectedRoute<P extends object>(
  Component: React.ComponentType<P>,
  options?: Omit<ProtectedRouteProps, 'children'>
) {
  return function ProtectedComponent(props: P) {
    return (
      <ProtectedRoute {...options}>
        <Component {...props} />
      </ProtectedRoute>
    );
  };
}
