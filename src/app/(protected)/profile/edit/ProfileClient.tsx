'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Paper,
  Typography
} from '@mui/material';
import { createSpecialist, updateSpecialist, uploadPrivateAvatar } from '@/lib/specialists/client';
import type { SpecialistInsert, SpecialistRow, SpecialistUpdate } from '@/types/supabase';
import ContactCard from './components/ContactCard';
import BioCard from './components/BioCard';
import { profileFormSchema, type FormValues } from './formSchema';
import { useState } from 'react';
import ProfilePictureCard from './components/ProfilePictureCard';
import { useNotify } from '@/components/feedback/SnackbarProvider';
import { useTranslations } from 'next-intl';

interface ProfileClientProps {
  userId: string;
  userEmail: string;
  initialSpecialist?: SpecialistRow | null;
  initialAvatarUrl?: string | null;
}

export const ProfileClient = ({ userId, userEmail, initialSpecialist, initialAvatarUrl }: ProfileClientProps) => {
  const notify = useNotify();
  const tProfile = useTranslations('profile');
  const tStatus = useTranslations('profile.status');

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [specialist, setSpecialist] = useState<SpecialistRow | null>(initialSpecialist ?? null);
  const [pendingImageFile, setPendingImageFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isDirty }
  } = useForm<FormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      fullname: specialist?.fullname ?? '',
      phone: specialist?.phone ?? '',
      website: specialist?.website ?? '',
      about: specialist?.about ?? '',
      avatarAlt: (specialist as any)?.avatar_alt ?? '',
      isVerified: specialist?.isVerified ?? false
    }
  });

  const syncFormToSaved = (saved: SpecialistRow) => {
    reset({
      fullname: saved.fullname ?? '',
      phone: (saved.phone ?? '') as any,
      website: (saved.website ?? '') as any,
      about: (saved.about ?? '') as any,
      avatarAlt: ((saved as any)?.avatar_alt ?? '') as any,
      isVerified: saved.isVerified ?? false
    });
    
    setPendingImageFile(null);
  };

  const toNullable = (v: string) => {
    const trimmed = v.trim();
    return trimmed === '' ? null : trimmed;
  };

  const createProfile = async (values: FormValues) => {
    const created = await createSpecialist({
      email: userEmail,
      fullname: values.fullname.trim(),
      phone: toNullable(values.phone),
      website: toNullable(values.website),
      about: toNullable(values.about),
      isVerified: false,
      avatar_alt: toNullable(values.avatarAlt ?? '')
    });

    if (pendingImageFile) {
      const avatarPath = await uploadPrivateAvatar(userId, pendingImageFile);

      const updated = await updateSpecialist(created.id, {
        avatar_path: avatarPath,
        avatar_alt: toNullable(values.avatarAlt ?? '')
      });

      setPendingImageFile(null);
      return updated;
    }

    return created;
  };

  const updateProfile = async (values: FormValues) => {
    if (!specialist) throw new Error('No specialist to update');

    const payload: SpecialistUpdate = {
      fullname: values.fullname.trim(),
      phone: toNullable(values.phone),
      website: toNullable(values.website),
      about: toNullable(values.about),
      avatar_alt: toNullable(values.avatarAlt ?? '')
    };

    if (pendingImageFile) {
      const avatarPath = await uploadPrivateAvatar(userId, pendingImageFile);
      payload.avatar_path = avatarPath;
    }

    const updated = await updateSpecialist(specialist.id, payload);
    setPendingImageFile(null);
    return updated;
  };

  const onSubmit = async (values: FormValues) => {
    setErrorMessage(null);
    setIsSaving(true);

    try {
      const isCreate = !specialist;
      const data = isCreate ? await createProfile(values) : await updateProfile(values);

      setSpecialist(data);
      syncFormToSaved(data);

      notify.success(isCreate ? tProfile('created') : tProfile('saved'));
    } catch (err: any) {
      const msg = err?.message ?? tProfile('saveFailed');
      setErrorMessage(msg);
      notify.error(tProfile('saveFailed'));
      return;
    } finally {
      setIsSaving(false);
    }
  };

  const hasUnsavedChanges = isDirty || !!pendingImageFile;

  return (
    <>
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{
          display: 'grid',
          gap: 2,
          '& .MuiTypography-body2': {
            fontSize: { xs: '0.98rem', md: '1.02rem' },
            lineHeight: 1.55
          },
          '& .MuiTypography-subtitle2': {
            fontSize: { xs: '1.05rem', md: '1.12rem' },
            fontWeight: 700
          }
        }}
      >
        {errorMessage ? (
          <Alert severity="error" role="alert">
            {errorMessage}
          </Alert>
        ) : null}

        <Box
          sx={{
            display: 'grid',
            gap: 2,
            gridTemplateColumns: { xs: '1fr', lg: '580px 1fr' },
            alignItems: 'stretch'
          }}
        >
          <Box sx={{ display: 'grid', gap: 2, alignContent: 'start' }}>
            <Box sx={{ height: '100%' }}>
              <ProfilePictureCard
                email={userEmail}
                initialImageUrl={initialAvatarUrl}
                onFileChange={setPendingImageFile}
              />
            </Box>

            <Box sx={{ height: '100%' }}>
              <ContactCard
                userEmail={userEmail}
                register={register}
                errors={errors}
              />
            </Box>
          </Box>

          <Box sx={{ height: '100%' }}>
            <BioCard register={register} errors={errors} watch={watch} />
          </Box>
        </Box>

        <Paper
          variant="outlined"
          sx={{
            p: 2,
            borderRadius: 2,
            display: 'flex',
            alignItems: { xs: 'stretch', sm: 'center' },
            justifyContent: 'space-between',
            gap: 2,
            flexDirection: { xs: 'column', sm: 'row' }
          }}
        >
          <Box sx={{ display: 'grid', gap: 0.25 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
              {hasUnsavedChanges ? tStatus('unsavedTitle') : tStatus('savedTitle')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {hasUnsavedChanges ? tStatus('unsavedHint') : tStatus('savedHint')}
            </Typography>
          </Box>

          <Button
            type="submit"
            variant="contained"
            disabled={isSaving || (!!specialist && !hasUnsavedChanges)}
            sx={{ width: { xs: '100%', sm: 'auto' }, minWidth: { sm: 160 } }}
          >
            {isSaving ? (
              <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1 }}>
                <CircularProgress size={18} color="inherit" />
                {tProfile('saving')}
              </Box>
            ) : specialist ? (
              tProfile('saveChanges')
            ) : (
              tProfile('createProfile')
            )}
          </Button>
        </Paper>
      </Box>
    </>
  );
};


