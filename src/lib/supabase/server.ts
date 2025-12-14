import { createServerClient } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { SetAllCookies } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Database } from '@/types/supabase';
import { assertSupabaseEnv, supabasePublishableKey, supabaseUrl } from './env';

export const createServerSupabaseClient = async () => {
  const cookieStore = await cookies();
  assertSupabaseEnv();

  return createServerClient(supabaseUrl, supabasePublishableKey, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (cookiesToSet: Parameters<SetAllCookies>[0]) => {
        for (const { name, value, options } of cookiesToSet) {
          cookieStore.set(name, value, options);
        }
      }
    }
  }) as unknown as SupabaseClient<Database, 'public', 'public'>;
};


