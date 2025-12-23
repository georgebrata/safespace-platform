'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { createBrowserSupabaseClient } from '@/lib/supabase/client';
import { useTranslations } from 'next-intl';
import { emailInitial, stringToColor } from '@/app/utils/avatar';

export default function AccountMenu({ userEmail }: { userEmail: string }) {
  const router = useRouter();
  const tApp = useTranslations('app');
  const [anchor, setAnchor] = React.useState<null | HTMLElement>(null);
  const [isSigningOut, setIsSigningOut] = React.useState(false);

  const open = Boolean(anchor);
  const handleOpen = (e: React.MouseEvent<HTMLElement>) => setAnchor(e.currentTarget);
  const handleClose = () => setAnchor(null);

  const onSignOut = async () => {
    try {
      setIsSigningOut(true);
      const supabase = createBrowserSupabaseClient();
      await supabase.auth.signOut();
      router.push('/login');
      router.refresh();
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <>
      <IconButton color="inherit" aria-label={tApp('account')} onClick={handleOpen} sx={{ ml: 0.5 }}>
        <Avatar sx={{ width: 32, height: 32, bgcolor: stringToColor(userEmail) }}>{emailInitial(userEmail)}</Avatar>
      </IconButton>

      <Menu anchorEl={anchor} open={open} onClose={handleClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} transformOrigin={{ vertical: 'top', horizontal: 'right' }}>
        <Box sx={{ px: 2, py: 1, maxWidth: 280 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 800 }} noWrap>{tApp('account')}</Typography>
          <Typography variant="body2" color="text.secondary" noWrap>{userEmail}</Typography>
        </Box>
        <Divider />
        <MenuItem component={Link} href="/profile" onClick={handleClose}>{tApp('myProfile')}</MenuItem>
        <MenuItem component={Link} href="/profile/edit" onClick={handleClose}>{tApp('editProfile')}</MenuItem>
        <Divider />
        <MenuItem onClick={async () => { handleClose(); await onSignOut(); }} disabled={isSigningOut}>{tApp('signOut')}</MenuItem>
      </Menu>
    </>
  );
}
