'use client';

import * as React from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Paper,
  Snackbar,
  Switch,
  TextField,
  Typography
} from '@mui/material';
import { createBrowserSupabaseClient } from '@/lib/supabase/client';
import type { SpecialistInsert, SpecialistRow, SpecialistUpdate } from '@/types/supabase';

const optionalUrl = z
  .string()
  .trim()
  .refine((v) => v === '' || z.string().url().safeParse(v).success, {
    message: 'Enter a valid URL (include https://)'
  });

const optionalPhone = z
  .string()
  .trim()
  .refine((v) => v === '' || /^[+()\-\s\d]{7,}$/.test(v), {
    message: 'Enter a valid phone number'
  });

const schema = z.object({
  fullname: z.string().trim().min(2, 'Full name must be at least 2 characters'),
  phone: optionalPhone,
  website: optionalUrl,
  about: z.string().trim().max(2000, 'About must be at most 2000 characters'),
  // Specialists cannot self-verify; we render it read-only (server-controlled).
  isVerified: z.boolean()
});

type FormValues = z.infer<typeof schema>;

type ProfileClientProps = {
  userEmail: string;
  initialSpecialist: SpecialistRow | null;
};

export const ProfileClient = ({ userEmail, initialSpecialist }: ProfileClientProps) => {
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);
  const [isSaving, setIsSaving] = React.useState(false);
  const [specialist, setSpecialist] = React.useState<SpecialistRow | null>(initialSpecialist);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullname: initialSpecialist?.fullname ?? '',
      phone: initialSpecialist?.phone ?? '',
      website: initialSpecialist?.website ?? '',
      about: initialSpecialist?.about ?? '',
      isVerified: initialSpecialist?.isVerified ?? false
    }
  });

  const toNullable = (v: string) => {
    const trimmed = v.trim();
    return trimmed === '' ? null : trimmed;
  };

  const onSubmit = async (values: FormValues) => {
    setErrorMessage(null);
    setIsSaving(true);
    try {
      const supabase = createBrowserSupabaseClient();

      if (!specialist) {
        const payload: SpecialistInsert = {
          email: userEmail,
          fullname: values.fullname.trim(),
          phone: toNullable(values.phone),
          website: toNullable(values.website),
          about: toNullable(values.about),
          // server-controlled; do not allow self-verify
          isVerified: false
        };

        const { data, error } = await supabase
          .from('specialists')
          .insert(payload)
          .select<'*', SpecialistRow>('*')
          .single();

        if (error) {
          setErrorMessage(error.message);
          return;
        }
        setSpecialist(data);
        setSuccessMessage('Profile created');
        return;
      }

      const payload: SpecialistUpdate = {
        fullname: values.fullname.trim(),
        phone: toNullable(values.phone),
        website: toNullable(values.website),
        about: toNullable(values.about)
      };

      const { data, error } = await supabase
        .from('specialists')
        .update(payload)
        .eq('id', specialist.id)
        .select<'*', SpecialistRow>('*')
        .single();

      if (error) {
        setErrorMessage(error.message);
        return;
      }
      setSpecialist(data);
      setSuccessMessage('Profile updated');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Paper sx={{ p: { xs: 2.5, md: 3 }, borderRadius: 3, border: 1, borderColor: 'divider' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, mb: 2 }}>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 800 }}>
            Specialist profile
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Update your public information.
          </Typography>
        </Box>
        <Chip
          label={specialist?.isVerified ? 'Verified' : 'Unverified'}
          color={specialist?.isVerified ? 'success' : 'default'}
          variant={specialist?.isVerified ? 'filled' : 'outlined'}
        />
      </Box>

      {errorMessage ? (
        <Alert severity="error" sx={{ mb: 2 }} role="alert">
          {errorMessage}
        </Alert>
      ) : null}

      <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ display: 'grid', gap: 2 }}>
        <TextField label="Email" value={userEmail} disabled fullWidth />

        <TextField
          label="Full name"
          required
          fullWidth
          error={!!errors.fullname}
          helperText={errors.fullname?.message}
          {...register('fullname')}
        />

        <TextField
          label="Phone"
          fullWidth
          error={!!errors.phone}
          helperText={errors.phone?.message}
          {...register('phone')}
        />

        <TextField
          label="Website"
          fullWidth
          error={!!errors.website}
          helperText={errors.website?.message}
          {...register('website')}
        />

        <TextField
          label="About"
          fullWidth
          multiline
          minRows={4}
          error={!!errors.about}
          helperText={errors.about?.message}
          {...register('about')}
        />

        <Controller
          name="isVerified"
          control={control}
          render={({ field }) => (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                  Verified
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Verification is managed by admins.
                </Typography>
              </Box>
              <Switch checked={field.value} disabled />
            </Box>
          )}
        />

        <Button type="submit" variant="contained" disabled={isSaving} sx={{ justifySelf: 'start' }}>
          {isSaving ? (
            <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1 }}>
              <CircularProgress size={18} color="inherit" />
              Saving…
            </Box>
          ) : specialist ? (
            'Save changes'
          ) : (
            'Create profile'
          )}
        </Button>
      </Box>

      <Snackbar
        open={!!successMessage}
        autoHideDuration={2500}
        onClose={() => setSuccessMessage(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setSuccessMessage(null)} severity="success" variant="filled">
          {successMessage}
        </Alert>
      </Snackbar>
    </Paper>
  );
};


