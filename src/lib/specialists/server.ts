import { createServerSupabaseClient } from '@/lib/supabase/server';
import type { SpecialistRow } from '@/types/supabase';

const AVATAR_BUCKET = 'avatars';

export async function getSpecialistByEmail(email: string): Promise<SpecialistRow | null> {
  const supabase = await createServerSupabaseClient();

  const normalizedEmail = (email ?? '').trim().toLowerCase();

  const { data, error } = await supabase
    .from('specialists')
    .select<'*', SpecialistRow>('*')
    .eq('email', normalizedEmail)
    .order('created_at', { ascending: false })
    .limit(1);

  if (error) throw new Error(error.message);
  return data?.[0] ?? null;
}

export async function getSignedAvatarUrl(avatarPath: string, expiresInSeconds = 60 * 10) {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase.storage
    .from(AVATAR_BUCKET)
    .createSignedUrl(avatarPath, expiresInSeconds);

  if (error) throw new Error(error.message);
  return data.signedUrl;
}
