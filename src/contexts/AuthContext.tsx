
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase-client';
import type { User } from '@supabase/supabase-js';

type AuthContextType = {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
  signUp: (email: string, password: string) => Promise<{ error: Error | null }>;
  isSupabaseReady: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSupabaseReady, setIsSupabaseReady] = useState(isSupabaseConfigured());

  useEffect(() => {
    // Skip Supabase auth if not configured
    if (!isSupabaseReady) {
      setLoading(false);
      return;
    }

    // Check current auth status
    const checkUser = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        setUser(data.session?.user ?? null);
      } catch (error) {
        console.error('Error fetching user:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [isSupabaseReady]);

  const signOut = async () => {
    if (!isSupabaseReady) return Promise.resolve();
    
    try {
      await supabase.auth.signOut();
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const signUp = async (email: string, password: string) => {
    if (!isSupabaseReady) {
      console.error('Supabase is not configured');
      return { error: new Error('Supabase is not configured') };
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      return { error: error };
    } catch (error) {
      console.error('Error during sign up:', error);
      return { error: error instanceof Error ? error : new Error('Unknown error during sign up') };
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signOut, signUp, isSupabaseReady }}>
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
