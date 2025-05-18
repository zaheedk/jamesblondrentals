
import { createClient } from '@supabase/supabase-js';

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Check if environment variables are available
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Please check your project settings and .env file.');
}

// Create a dummy client when credentials are not available
let supabaseClient;

if (supabaseUrl && supabaseAnonKey) {
  // Only initialize the client if we have valid credentials
  supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
} else {
  // Create a mock client to prevent runtime errors
  supabaseClient = {
    auth: {
      getSession: () => Promise.resolve({ data: { session: null } }),
      signInWithPassword: () => Promise.resolve({ error: new Error('Supabase not configured') }),
      signUp: () => Promise.resolve({ error: new Error('Supabase not configured') }),
      signOut: () => Promise.resolve({ error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      resetPasswordForEmail: () => Promise.resolve({ error: new Error('Supabase not configured') })
    }
  };
}

// Export the client
export const supabase = supabaseClient;

// Export a helper function to check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  return Boolean(supabaseUrl && supabaseAnonKey);
};
