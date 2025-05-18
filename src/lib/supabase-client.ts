
import { createClient } from '@supabase/supabase-js';

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Check if environment variables are available
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Please check your project settings and .env file.');
}

// Check if URL is valid before creating client
const isValidUrl = (urlString: string): boolean => {
  try {
    return Boolean(urlString && new URL(urlString));
  } catch (e) {
    return false;
  }
};

// Create a dummy client when credentials are not available or valid
let supabaseClient;

if (supabaseUrl && supabaseAnonKey && isValidUrl(supabaseUrl)) {
  // Only initialize the client if we have valid credentials
  try {
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
    console.info('Supabase client initialized successfully');
  } catch (error) {
    console.error('Failed to initialize Supabase client:', error);
    supabaseClient = createMockClient();
  }
} else {
  console.warn('Invalid Supabase configuration, using mock client');
  supabaseClient = createMockClient();
}

// Create a mock client to prevent runtime errors
function createMockClient() {
  return {
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
  return Boolean(supabaseUrl && supabaseAnonKey && isValidUrl(supabaseUrl));
};
