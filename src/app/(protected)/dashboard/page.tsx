import { Box, Paper, Typography } from '@mui/material';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

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
      </Paper>
    </Box>
  );
}


