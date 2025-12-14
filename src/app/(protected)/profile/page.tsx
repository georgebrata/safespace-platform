import { Box, Paper, Typography } from '@mui/material';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import type { SpecialistRow } from '@/types/supabase';
import { ProfileClient } from './ProfileClient';

export default async function ProfilePage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  const userEmail = (user?.email ?? '').trim().toLowerCase();

  if (!userEmail) {
    return (
      <Paper sx={{ p: 2.5 }}>
        <Typography color="error" sx={{ fontWeight: 700 }}>
          Missing email on your account
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Your authenticated session does not include an email address. Please re-login.
        </Typography>
      </Paper>
    );
  }

  const { data, error } = await supabase
    .from('specialists')
    .select('*')
    .eq('email', userEmail)
    .order('created_at', { ascending: false })
    .limit(1);

  const specialist: SpecialistRow | null = data?.[0] ?? null;

  return (
    <Box sx={{ display: 'grid', gap: 2 }}>
      <Typography variant="h4">My profile</Typography>

      {error ? (
        <Paper sx={{ p: 2.5 }}>
          <Typography color="error" sx={{ fontWeight: 700 }}>
            Failed to load your profile
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {error.message}
          </Typography>
        </Paper>
      ) : null}

      <ProfileClient userEmail={userEmail} initialSpecialist={specialist} />
    </Box>
  );
}


