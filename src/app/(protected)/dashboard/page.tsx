import { Box, Paper, Typography } from '@mui/material';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import RequestChatButton from './RequestChatButton';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  const userId = user?.id ?? null;
  const userEmail = user?.email ?? null;

  return (
    <Box sx={{ display: 'grid', gap: 2 }}>
      <Typography variant="h4">Dashboard</Typography>
      <Paper sx={{ p: 2.5 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
          Signed in
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {user?.email ?? 'Unknown user'}
        </Typography>

        <Box sx={{ mt: 2 }}>
          <RequestChatButton userId={userId} userEmail={userEmail} />
        </Box>
      </Paper>
    </Box>
  );
}


