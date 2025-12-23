import * as React from 'react';
import { Paper, Box, TextField, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';
import type { FieldErrors, UseFormRegister } from 'react-hook-form';
import type { FormValues } from '../formSchema';

type Props = {
  userEmail: string;
  register: UseFormRegister<FormValues>;
  errors: FieldErrors<FormValues>;
};

export default function ContactCard({
  userEmail,
  register,
  errors,
}: Props) {
  const t = useTranslations('profile.contactCard');

  return (
    <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
      <Box sx={{ display: 'grid', gap: 0.25, mb: 2 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
          {t('title')}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {t('subtitle')}
        </Typography>
      </Box>

      <Box sx={{ display: 'grid', gap: 2 }}>
        <TextField
          label={t('emailLabel')}
          value={userEmail}
          disabled
          fullWidth
          helperText={t('emailHelper')}
        />

        <TextField
          label={t('fullNameLabel')}
          required
          fullWidth
          error={!!errors.fullname}
          helperText={errors.fullname?.message as string | undefined}
          {...register('fullname')}
        />

        <TextField
          label={t('phoneLabel')}
          fullWidth
          placeholder={t('phonePlaceholder')}
          error={!!errors.phone}
          helperText={errors.phone?.message as string | undefined}
          {...register('phone')}
        />

        <TextField
          label={t('websiteLabel')}
          fullWidth
          placeholder={t('websitePlaceholder')}
          error={!!errors.website}
          helperText={errors.website?.message as string | undefined}
          {...register('website')}
        />
      </Box>
    </Paper>
  );
}