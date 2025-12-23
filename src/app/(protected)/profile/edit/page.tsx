import { Box, Paper, Typography } from '@mui/material';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { getSignedAvatarUrl, getSpecialistByEmail } from '@/lib/specialists/server';
import { ProfileClient } from './ProfileClient';

export const dynamic = 'force-dynamic';

export default async function ProfileEditPage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  const userEmail = (user?.email ?? '').trim().toLowerCase();
  const userId = user?.id ?? null;

  if (!userEmail || !userId) {
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

  const specialist = await getSpecialistByEmail(userEmail);

  const avatarPath = specialist?.avatar_path ?? null;
  const initialAvatarUrl = avatarPath ? await getSignedAvatarUrl(avatarPath) : null;

  return (
    <Box sx={{ display: 'grid', gap: 2 }}>
      <ProfileClient
        userId={userId}
        userEmail={userEmail}
        initialSpecialist={specialist}
        initialAvatarUrl={initialAvatarUrl}
      />
    </Box>
  );
}
