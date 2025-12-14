// IMPORTANT:
// Next.js only inlines NEXT_PUBLIC_* variables in client bundles when accessed statically.
// We do NOT throw at import-time (which can break `next build` during prerender).
export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';

export const supabasePublishableKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ?? '';

export const assertSupabaseEnv = () => {
  if (!supabaseUrl) {
    throw new Error(
      'Missing required environment variable: NEXT_PUBLIC_SUPABASE_URL. ' +
        'For local dev, add it to .env.local and restart `next dev`.'
    );
  }
  if (!supabasePublishableKey) {
    throw new Error(
      'Missing required environment variable: NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY. ' +
        'For local dev, add it to .env.local and restart `next dev`.'
    );
  }
};


