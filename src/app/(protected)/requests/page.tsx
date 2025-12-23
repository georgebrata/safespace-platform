import { Box, Paper, Typography } from '@mui/material';
import { getTranslations } from 'next-intl/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { getSpecialistByEmail } from '@/lib/specialists/server';
import { RequestsClient } from './RequestsClient';

export const dynamic = 'force-dynamic';

export default async function RequestsPage() {
  const t = await getTranslations('requests');

  const supabase = await createServerSupabaseClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  const userEmail = (user?.email ?? '').trim().toLowerCase();

  const specialist = userEmail ? await getSpecialistByEmail(userEmail) : null;
  const specialistId = specialist?.id ?? null;

  return (
    <Box sx={{ display: 'grid', gap: 2 }}>
      <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 900 }}>
          {t('title')}
        </Typography>
      </Paper>

      <RequestsClient specialistId={specialistId} />
    </Box>
  );
}
