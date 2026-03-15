import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const isValidUrl = (url: string | undefined) => {
  try {
    return Boolean(new URL(url || ''));
  } catch (e) {
    return false;
  }
};

export const supabase = isValidUrl(supabaseUrl) && supabaseAnonKey 
  ? createClient(supabaseUrl as string, supabaseAnonKey) 
  : null;

