import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '@/types/supabase';
import { supabasePublishableKey, supabaseUrl } from './env';

export const createBrowserSupabaseClient = () =>
  createBrowserClient<Database>(supabaseUrl, supabasePublishableKey);


