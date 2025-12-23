'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import Avatar from '@mui/material/Avatar';
import ButtonBase from '@mui/material/ButtonBase';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import { emailInitial, stringToColor } from '@/app/utils/avatar';

type Props = {
  email: string;
  initialImageUrl?: string | null;
  onFileChange?: (file: File | null) => void;
};

const SIZE = { xs: 112, sm: 128, md: 144 } as const;
const MAX_BYTES = 5 * 1024 * 1024;

export function UploadAvatar({ email, initialImageUrl = null, onFileChange }: Props) {
  const t = useTranslations('avatar');

  const [avatarSrc, setAvatarSrc] = React.useState<string>();
  const [pendingFileName, setPendingFileName] = React.useState<string | null>(null);
  const [errorText, setErrorText] = React.useState<string | null>(null);

  const fallbackBg = stringToColor(email);
  const fallbackLetter = emailInitial(email);

  React.useEffect(() => {
    setAvatarSrc(initialImageUrl ?? undefined);
    setPendingFileName(null);
    setErrorText(null);
  }, [initialImageUrl]);

  const handleAvatarChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    setErrorText(null);

    const input = event.currentTarget;
    const file = input.files?.[0] ?? null;

    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorText(t('invalidType'));
      input.value = '';
      return;
    }

    if (file.size > MAX_BYTES) {
      setErrorText(t('tooLarge'));
      input.value = '';
      return;
    }

    setPendingFileName(file.name);
    onFileChange?.(file);

    const reader = new FileReader();
    reader.onload = () => {
      setAvatarSrc(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Allow selecting the same file again later (otherwise onChange may not fire)
    input.value = '';
  };

  const handleRemoveClick: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    e.stopPropagation();

    setErrorText(null);
    setPendingFileName(null);
    onFileChange?.(null);

    setAvatarSrc(initialImageUrl ?? undefined);
  };

  const isShowingPending = !!pendingFileName;

  return (
    <Box sx={{ display: 'grid', justifyItems: 'center', gap: 1 }}>
      <ButtonBase
        component="label"
        tabIndex={-1}
        aria-label="Upload avatar image"
        sx={{
          borderRadius: '999px',
          cursor: 'pointer',
          '&:has(:focus-visible)': {
            outline: '2px solid',
            outlineOffset: '2px'
          }
        }}
      >
        <Box
          sx={{
            position: 'relative',
            width: SIZE,
            height: SIZE,
            borderRadius: '999px',
            overflow: 'hidden'
          }}
        >
          <Avatar
            alt="Profile picture"
            src={avatarSrc}
            sx={{
              width: SIZE,
              height: SIZE,
              bgcolor: avatarSrc ? undefined : fallbackBg,
              fontWeight: 800,
              fontSize: { xs: 36, sm: 44, md: 52 }
            }}
          >
            {avatarSrc ? null : fallbackLetter}
          </Avatar>

          <Box
            aria-hidden="true"
            sx={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'rgba(0,0,0,0.45)',
              color: '#fff',
              opacity: 0,
              transition: 'opacity 160ms ease',
              pointerEvents: 'none',
              '.MuiButtonBase-root:hover &': { opacity: 1 },
              '.MuiButtonBase-root:has(:focus-visible) &': { opacity: 1 }
            }}
          >
            <Box sx={{ display: 'grid', justifyItems: 'center', gap: 0.5 }}>
              <AddAPhotoIcon sx={{ fontSize: { xs: 44, sm: 52, md: 60 } }} />
              <Typography variant="caption" sx={{ fontWeight: 700, letterSpacing: 0.2, lineHeight: 1.2 }}>
                {t('uploadImage')}
              </Typography>
            </Box>
          </Box>
        </Box>

        <input
          type="file"
          accept="image/*"
          onChange={handleAvatarChange}
          style={{
            border: 0,
            clip: 'rect(0 0 0 0)',
            height: 1,
            margin: -1,
            overflow: 'hidden',
            padding: 0,
            position: 'absolute',
            whiteSpace: 'nowrap',
            width: 1
          }}
        />
      </ButtonBase>

      {errorText ? (
        <Typography variant="body2" color="error" sx={{ textAlign: 'center', maxWidth: 320 }}>
          {errorText}
        </Typography>
      ) : isShowingPending ? (
        <Box sx={{ display: 'grid', gap: 0.25, justifyItems: 'center' }}>
          <Typography variant="body2" sx={{ fontWeight: 700, textAlign: 'center' }}>
            {t('selected', { fileName: pendingFileName })}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center' }}>
            {t('notSavedYet')}
          </Typography>

          <Button size="small" variant="text" onClick={handleRemoveClick}>
            {t('remove')}
          </Button>
        </Box>
      ) : undefined}
    </Box>
  );
}