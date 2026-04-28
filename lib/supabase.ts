
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
        console.warn('Missing Supabase environment variables. File upload will not work.');
    }
}

// Fallback to avoid crash during build/dev if env vars are missing
// Requests will fail if these are invalid, but the app won't crash on load.
export const supabase = createClient(
    supabaseUrl || 'https://placeholder.supabase.co',
    supabaseAnonKey || 'placeholder'
);
