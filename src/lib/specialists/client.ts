import { createBrowserSupabaseClient } from '@/lib/supabase/client';
import type { SpecialistInsert, SpecialistRow, SpecialistUpdate } from '@/types/supabase';

export async function createSpecialist(payload: SpecialistInsert): Promise<SpecialistRow> {
  const supabase = createBrowserSupabaseClient();
  const { data, error } = await supabase
    .from('specialists')
    .insert(payload)
    .select<'*', SpecialistRow>('*')
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function updateSpecialist(id: number, payload: SpecialistUpdate): Promise<SpecialistRow> {
  const supabase = createBrowserSupabaseClient();
  const { data, error } = await supabase
    .from('specialists')
    .update(payload)
    .eq('id', id)
    .select<'*', SpecialistRow>('*')
    .single();

  if (error) throw new Error(error.message);
  return data;
}

const AVATAR_BUCKET = 'avatars';

function fileExt(file: File) {
  const parts = file.name.split('.');
  const ext = parts.length > 1 ? parts.pop() : '';
  return (ext ?? '').toLowerCase() || 'jpg';
}

export async function uploadPrivateAvatar(userId: string, file: File): Promise<string> {
  const supabase = createBrowserSupabaseClient();

  const ext = fileExt(file);
  const path = `${userId}/avatar-${Date.now()}.${ext}`;

  const { error } = await supabase.storage.from(AVATAR_BUCKET).upload(path, file, {
    upsert: true,
    cacheControl: '3600',
    contentType: file.type
  });

  if (error) throw new Error(error.message);

  return path;
}
