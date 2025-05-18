
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase-client';
import type { User } from '@supabase/supabase-js';
import { useToast } from "@/hooks/use-toast";

type AuthContextType = {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
  signUp: (email: string, password: string) => Promise<{ error: Error | null; message?: string }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null; message?: string }>;
  isSupabaseReady: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSupabaseReady, setIsSupabaseReady] = useState(isSupabaseConfigured());
  const { toast } = useToast();

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

  const signIn = async (email: string, password: string) => {
    if (!isSupabaseReady) {
      return { 
        error: new Error('Supabase is not configured'),
        message: 'Authentication service is not available. Please try again later or contact support.'
      };
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error('Supabase signin error:', error);
        
        if (error.message.includes('Invalid login')) {
          return { 
            error,
            message: 'Invalid email or password. Please check your credentials and try again.'
          };
        }
        
        return { 
          error,
          message: error.message || 'Login failed. Please try again.'
        };
      }

      return { error: null };
    } catch (error) {
      console.error('Error during sign in:', error);
      
      // Handle network errors separately
      if (error instanceof TypeError && error.message.includes('fetch')) {
        toast({
          title: "Connection Error",
          description: "Unable to reach authentication service. Please check your internet connection.",
          variant: "destructive"
        });
        
        return { 
          error: error instanceof Error ? error : new Error('Network error'),
          message: 'Unable to connect to authentication service. Please check your internet connection and try again.'
        };
      }
      
      return { 
        error: error instanceof Error ? error : new Error('Unknown error during sign in'),
        message: 'Login failed due to a technical issue. Please try again later.'
      };
    }
  };

  const signUp = async (email: string, password: string) => {
    if (!isSupabaseReady) {
      console.error('Supabase is not configured');
      return { 
        error: new Error('Supabase is not configured. Please check your environment variables.'),
        message: 'Authentication service is not available. Please try again later or contact support.'
      };
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) {
        console.error('Supabase signup error:', error);
        return { 
          error,
          message: error.message || 'Registration failed. Please try again.'
        };
      }

      return { 
        error: null,
        message: 'Registration successful! Please check your email to verify your account.'
      };
    } catch (error) {
      console.error('Error during sign up:', error);
      
      // Handle network errors separately
      if (error instanceof TypeError && error.message.includes('fetch')) {
        toast({
          title: "Connection Error",
          description: "Unable to reach authentication service. Please check your internet connection.",
          variant: "destructive"
        });
        
        return { 
          error: error instanceof Error ? error : new Error('Network error'),
          message: 'Unable to connect to authentication service. Please check your internet connection and try again.'
        };
      }
      
      return { 
        error: error instanceof Error ? error : new Error('Unknown error during sign up'),
        message: 'Registration failed due to a technical issue. Please try again later.'
      };
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signOut, signUp, signIn, isSupabaseReady }}>
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
