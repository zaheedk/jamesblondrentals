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
    try {
      if (!isSupabaseReady) {
        return { 
          error: { message: 'Authentication service not available' } as AuthError,
          message: 'Authentication service is not properly configured. Please try again later.'
        };
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin + '/login'
        }
      });

      if (error) {
        return { 
          error,
          message: getErrorMessage(error)
        };
      }

      // Send welcome email after successful signup
      try {
        const { useEmail } = await import('@/hooks/use-email');
        const { sendSignupWelcomeEmail } = useEmail();
        await sendSignupWelcomeEmail(email);
        console.log('Welcome email sent successfully');
      } catch (emailError) {
        console.error('Failed to send welcome email:', emailError);
        // Don't fail the signup process if email fails
      }

      return { 
        error: null,
        message: 'Registration successful! Please check your email to verify your account, and welcome to James Blond Car Rentals!'
      };
    } catch (err) {
      console.error('Signup error:', err);
      return { 
        error: { message: 'An unexpected error occurred' } as AuthError,
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
