
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase-client';
import type { User, AuthError } from '@supabase/supabase-js';
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

// Helper function to get error messages
const getErrorMessage = (error: AuthError): string => {
  if (error.message.includes('User already registered')) {
    return 'An account with this email already exists. Please try logging in instead.';
  }
  if (error.message.includes('Invalid email')) {
    return 'Please enter a valid email address.';
  }
  if (error.message.includes('Password should be at least')) {
    return 'Password must be at least 6 characters long.';
  }
  return error.message || 'An error occurred during registration.';
};

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
    console.log('Starting signup process for:', email);
    
    try {
      if (!isSupabaseReady) {
        console.error('Supabase not ready');
        return { 
          error: new Error('Authentication service not available'),
          message: 'Authentication service is not properly configured. Please try again later.'
        };
      }

      // Test connectivity before attempting signup
      console.log('Testing Supabase connectivity...');
      try {
        const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/rest/v1/`, {
          method: 'HEAD',
          headers: {
            'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY
          }
        });
        console.log('Connectivity test response status:', response.status);
      } catch (connectivityError) {
        console.error('Connectivity test failed:', connectivityError);
        return {
          error: new Error('Connection failed'),
          message: 'Unable to connect to authentication service. Please check your internet connection and try again.'
        };
      }

      console.log('Calling Supabase signUp...');
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin + '/login'
        }
      });

      if (error) {
        console.error('Supabase signup error:', error);
        
        // Handle specific network-related errors
        if (error.message.includes('Failed to fetch') || error.message.includes('fetch')) {
          return {
            error,
            message: 'Unable to connect to authentication service. Please check your internet connection and try again.'
          };
        }
        
        return { 
          error,
          message: getErrorMessage(error)
        };
      }

      console.log('Signup successful, attempting to send welcome email...');
      
      // Send welcome email after successful signup - but don't fail signup if email fails
      try {
        const { useEmail } = await import('@/hooks/use-email');
        const { sendSignupWelcomeEmail } = useEmail();
        await sendSignupWelcomeEmail(email);
        console.log('Welcome email sent successfully');
      } catch (emailError) {
        console.error('Failed to send welcome email (but signup was successful):', emailError);
        // Continue with successful signup even if email fails
      }

      console.log('Signup process completed successfully');
      return { 
        error: null,
        message: 'Registration successful! Please check your email to verify your account.'
      };
    } catch (err) {
      console.error('Unexpected signup error:', err);
      
      // Handle network errors at the catch level too
      if (err instanceof TypeError && err.message.includes('fetch')) {
        return {
          error: err,
          message: 'Unable to connect to authentication service. Please check your internet connection and try again.'
        };
      }
      
      return { 
        error: new Error('An unexpected error occurred'),
        message: 'An unexpected error occurred during registration. Please try again.'
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
