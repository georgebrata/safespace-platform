const requirePublicEnv = (key: 'NEXT_PUBLIC_SUPABASE_URL' | 'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY', value: string | undefined): string => {
  if (!value) {
    throw new Error(
      `Missing required environment variable: ${key}. ` +
        `For local dev, add it to .env.local and restart \`next dev\`.`
    );
  }
  return value;
};

// IMPORTANT:
// Next.js only inlines NEXT_PUBLIC_* variables in client bundles when accessed statically.
export const supabaseUrl = requirePublicEnv(
  'NEXT_PUBLIC_SUPABASE_URL',
  process.env.NEXT_PUBLIC_SUPABASE_URL
);

export const supabasePublishableKey = requirePublicEnv(
  'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY',
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY
);


