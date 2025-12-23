'use client';

import * as React from 'react';
import Link from 'next/link';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Button from '@mui/material/Button';
import LogoutIcon from '@mui/icons-material/Logout';
import { createBrowserSupabaseClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import type { ReactNode } from 'react';
import { useTranslations } from 'next-intl';

type NavItem = { href: string; label: ReactNode; icon: ReactNode };

export default function Sidebar({ navItems, pathname, onClose }: { navItems: NavItem[]; pathname?: string | null; onClose?: () => void }) {
  const router = useRouter();
  const tApp = useTranslations('app');
  const [isSigningOut, setIsSigningOut] = React.useState(false);

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
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Stack sx={{ alignItems: 'center' }}>
        <Box component="img" src="/brand/safespace logo dark vertical.png" alt="Safespace" sx={{ display: 'block', width: 150, height: 150, objectFit: 'contain', mb: 0.75 }} />
      </Stack>
      <Divider />
      <List sx={{ px: 1, py: 1 }}>
        {navItems.map((item) => {
          const selected = pathname === item.href;
          return (
            <ListItemButton key={String(item.href)} component={Link} href={item.href} selected={selected} sx={{ borderRadius: 2 }} onClick={() => onClose?.()}>
              <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          );
        })}
      </List>
      <Box sx={{ mt: 'auto', p: 2 }}>
        <Button fullWidth variant="outlined" onClick={onSignOut} startIcon={<LogoutIcon />} disabled={isSigningOut} aria-label={tApp('signOut')}>
          {isSigningOut ? tApp('signingOut') : tApp('signOut')}
        </Button>
      </Box>
    </Box>
  );
}
