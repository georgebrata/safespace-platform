import { createBrowserClient } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';
import { assertSupabaseEnv, supabasePublishableKey, supabaseUrl } from './env';

// NOTE: @supabase/ssr's `createBrowserClient` currently returns a `SupabaseClient`
// type that doesn't align with the latest supabase-js generic parameter order.
// We cast to the correct `SupabaseClient<Database, 'public', 'public'>` so `.from()`
// and `.insert()` don't collapse to `never`.
export const createBrowserSupabaseClient = (): SupabaseClient<Database, 'public', 'public'> =>
  (assertSupabaseEnv(),
  createBrowserClient(supabaseUrl, supabasePublishableKey) as unknown as SupabaseClient<
      Database,
      'public',
      'public'
    >);


