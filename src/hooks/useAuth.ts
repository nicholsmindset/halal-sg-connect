import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  role: string | null;
}

/**
 * Authentication hook that manages user session state
 * Automatically syncs with Supabase auth state changes
 */
export function useAuth(): AuthState {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user ?? null);
      } catch (error) {
        console.error('Error fetching session:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setUser(session?.user ?? null);
        setIsLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Extract role from user metadata
  const role = user?.user_metadata?.role || user?.app_metadata?.role || null;

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    role,
  };
}

/**
 * Check if user has required role
 */
export function useRequireRole(requiredRole: string): boolean {
  const { role } = useAuth();
  return role === requiredRole || role === 'super_admin';
}

/**
 * Check if user is admin (admin or super_admin)
 */
export function useIsAdmin(): boolean {
  const { role } = useAuth();
  return role === 'admin' || role === 'super_admin';
}
