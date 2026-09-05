import { createClient } from '@supabase/supabase-js';

// Ensure the environment variables are defined.
// Vite loads .env variables prefixed with VITE_ automatically.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Missing Supabase credentials. Please ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in your .env file.");
}

// Create and export the shared Supabase client instance
export const supabase = createClient(
  supabaseUrl ?? 'https://your-project.supabase.co',
  supabaseAnonKey ?? 'your-anon-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: false,
    },
  }
);
