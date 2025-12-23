import type { Database } from '@/types/supabase';

export type ChatRequestStatus = 'pending' | 'accepted' | 'closed';

type ChatRequestDbRow = Database['public']['Tables']['chat_requests']['Row'];

export type ChatRequestRow = {
  id: ChatRequestDbRow['id'];
  status: ChatRequestStatus;
  created_by: ChatRequestDbRow['created_by'];
  created_by_name: ChatRequestDbRow['created_by_name'];
  accepted_by: ChatRequestDbRow['accepted_by'];
  created_at: ChatRequestDbRow['created_at'];
  closed_at: ChatRequestDbRow['closed_at'];
};
