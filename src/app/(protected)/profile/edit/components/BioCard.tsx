import * as React from 'react';
import { Paper, Box, TextField, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';
import type { FieldErrors, UseFormRegister, UseFormWatch } from 'react-hook-form';
import type { FormValues } from '../formSchema';

type Props = {
  register: UseFormRegister<FormValues>;
  errors: FieldErrors<FormValues>;
  watch: UseFormWatch<FormValues>;
};

const MAX_ABOUT = 2000;

export default function BioCard({ register, errors, watch }: Props) {
  const t = useTranslations('profile.bioCard');

  const aboutLen = watch('about')?.length ?? 0;
  const helper =
    (errors.about?.message as string | undefined) ??
    t('aboutCounter', { count: aboutLen, max: MAX_ABOUT });

  return (
    <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
      <Box sx={{ mb: 1.5 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
          {t('title')}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {t('subtitle')}
        </Typography>
      </Box>

      <Box sx={{ mb: 1.5 }}>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
          {t('tipsTitle')}
        </Typography>
        <Box
          component="ul"
          sx={{
            m: 0,
            pl: 2,
            color: 'text.secondary',
            typography: 'caption',
            display: 'grid',
            gap: 0.25
          }}
        >
          <li>{t('tips.specialties')}</li>
          <li>{t('tips.approach')}</li>
          <li>{t('tips.experience')}</li>
          <li>{t('tips.format')}</li>
        </Box>
      </Box>

      <TextField
        label={t('aboutLabel')}
        fullWidth
        multiline
        minRows={6}
        error={!!errors.about}
        helperText={helper}
        {...register('about')}
      />
    </Paper>
  );
}