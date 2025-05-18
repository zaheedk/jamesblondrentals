
import { createClient } from '@supabase/supabase-js';

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Check if environment variables are available
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Please check your project settings and .env file.');
}

// Initialize the Supabase client with fallback empty strings to prevent runtime errors
// (this will allow the app to load, though Supabase features won't work)
export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);

// Export a helper function to check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  return Boolean(supabaseUrl && supabaseAnonKey);
};
