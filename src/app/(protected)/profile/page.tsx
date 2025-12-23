import Link from 'next/link';
import { Box, Button, Paper, Typography } from '@mui/material';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { getSignedAvatarUrl, getSpecialistByEmail } from '@/lib/specialists/server';
import Avatar from '@mui/material/Avatar';
import { emailInitial, stringToColor } from '@/app/utils/avatar';
import { getTranslations } from 'next-intl/server';
import { appTheme } from '@/theme/theme';

export const dynamic = 'force-dynamic';

export default async function ProfilePage() {
  const t = await getTranslations('profile');
  const tApp = await getTranslations('app');

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

  const displayName = specialist?.fullname?.trim() || userEmail;
  const about = specialist?.about?.trim() || null;
  const phone = specialist?.phone?.trim() || null;
  const website = specialist?.website?.trim() || null;

  return (
    <Box sx={{ display: 'grid', gap: 2 }}>
      {/* Banner header (inspired by your reference): image area + avatar overlap + tabs */}
      <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <Box
          sx={{
            height: { xs: 140, sm: 170, md: 200 },
            backgroundColor: 'action.hover',
            backgroundImage: `linear-gradient(135deg, ${appTheme.palette.primary.main}CC 0%, ${appTheme.palette.secondary.main}B3 55%, ${appTheme.palette.primary.main}80 100%), url(/brand/profile-hero.png)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />

        <Box
          sx={{
            px: { xs: 2, sm: 2.5 },
            pt: 0,
            pb: 1.5
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              gap: 2,
              flexWrap: 'wrap'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 2, minWidth: 0 }}>
              <Avatar
                alt={displayName}
                src={initialAvatarUrl ?? undefined}
                sx={{
                  width: { xs: 84, sm: 96 },
                  height: { xs: 84, sm: 96 },
                  mt: { xs: -5, sm: -6 },
                  border: '4px solid',
                  borderColor: 'background.paper',
                  bgcolor: stringToColor(userEmail)
                }}
              >
                <Typography component="span" sx={{ fontWeight: 900, fontSize: { xs: 34, sm: 40 } }}>
                  {emailInitial(userEmail)}
                </Typography>
              </Avatar>

              <Box sx={{ minWidth: 0, pb: 0.5 }}>
                <Typography variant="h6" sx={{ fontWeight: 900 }} noWrap>
                  {displayName}
                </Typography>
                <Typography variant="body2" color="text.secondary" noWrap>
                  {userEmail}
                </Typography>
              </Box>
            </Box>

            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                flexWrap: 'wrap',
                pb: 0.5
              }}
            >
              <Button
                component={Link}
                href="/profile"
                variant="text"
                sx={{
                  borderRadius: 0,
                  borderBottom: 2,
                  borderColor: 'primary.main',
                  px: 1.25,
                  minWidth: 0
                }}
              >
                {tApp('myProfile')}
              </Button>
              <Button
                component={Link}
                href="/profile/edit"
                variant="text"
                sx={{
                  borderRadius: 0,
                  borderBottom: 2,
                  borderColor: 'transparent',
                  px: 1.25,
                  minWidth: 0
                }}
              >
                {tApp('editProfile')}
              </Button>
            </Box>
          </Box>
        </Box>
      </Paper>

      {/* Content */}
      <Box
        sx={{
          display: 'grid',
          gap: 2,
          gridTemplateColumns: { xs: '1fr', md: '1fr 2fr' },
          alignItems: 'start'
        }}
      >
        {/* Specialist information */}
        <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 1,
              mb: 1.25
            }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 900 }}>
              {t('view.specialistInfoTitle')}
            </Typography>
          </Box>

          <Box sx={{ display: 'grid', gap: 0.75 }}>
            <Typography variant="body2">
              <strong>{t('contactCard.fullNameLabel')}:</strong> {displayName}
            </Typography>
            <Typography variant="body2" sx={{ overflowWrap: 'anywhere' }}>
              <strong>{t('contactCard.emailLabel')}:</strong> {userEmail}
            </Typography>
            {phone ? (
              <Typography variant="body2">
                <strong>{t('contactCard.phoneLabel')}:</strong> {phone}
              </Typography>
            ) : null}
            {website ? (
              <Typography variant="body2" sx={{ overflowWrap: 'anywhere' }}>
                <strong>{t('contactCard.websiteLabel')}:</strong> {website}
              </Typography>
            ) : null}
          </Box>
        </Paper>

        {/* Main description */}
        <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 900, mb: 1 }}>
            {t('view.whoIsTitle', { name: displayName })}
          </Typography>
          <Typography variant="body2" color={about ? 'text.primary' : 'text.secondary'}>
            {about ?? t('bioCard.subtitle')}
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
}


