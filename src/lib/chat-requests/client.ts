import { createBrowserSupabaseClient } from '@/lib/supabase/client';
export type { ChatRequestRow, ChatRequestStatus } from './types';
import type { ChatRequestRow } from './types';

export async function createChatRequest(params: {
  createdBy: string;
  createdByName: string;
}): Promise<ChatRequestRow> {
  const supabase = createBrowserSupabaseClient();
  const { data, error } = await supabase
    .from('chat_requests')
    .insert({
      created_by: params.createdBy,
      created_by_name: params.createdByName,
      status: 'pending'
    })
    .select('*')
    .single();

  if (error) throw error;
  return data as ChatRequestRow;
}

export async function listAllRequests() {
  const supabase = createBrowserSupabaseClient();
  const { data, error } = await supabase
    .from('chat_requests')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data ?? []) as ChatRequestRow[];
}

export async function listMyAcceptedRequests(specialistId: number) {
  const supabase = createBrowserSupabaseClient();
  const { data, error } = await supabase
    .from('chat_requests')
    .select('*')
    .eq('accepted_by', specialistId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data ?? []) as ChatRequestRow[];
}

export async function acceptRequest(requestId: string) {
  const supabase = createBrowserSupabaseClient();
  const { data, error } = await supabase.rpc('accept_chat_request', { p_request_id: requestId });
  if (error) throw error;
  return data as ChatRequestRow;
}

export async function countPendingRequestsForSpecialists() {
  const supabase = createBrowserSupabaseClient();
  const { count, error } = await supabase
    .from('chat_requests')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'pending');

  if (error) throw error;
  return count ?? 0;
}