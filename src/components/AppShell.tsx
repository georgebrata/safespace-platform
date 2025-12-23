'use client';

import { usePathname } from 'next/navigation';
import { AppBar, Box, Drawer, IconButton, Toolbar, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import LocaleSwitcher from '@/components/i18n/LocaleSwitcher';
import { useTranslations } from 'next-intl';
import RequestsBadge from './AppShell/RequestsBadge';
import AccountMenu from './AppShell/AccountMenu';
import Sidebar from './AppShell/Sidebar';
import { useState } from 'react';

const drawerWidth = 260;

type AppShellProps = {
  userEmail: string;
  specialistId: number | null;
  children: React.ReactNode;
};

export const AppShell = ({ userEmail, specialistId, children }: AppShellProps) => {
  const pathname = usePathname();
  const tApp = useTranslations('app');
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleDrawer = () => setMobileOpen((v) => !v);

  const navItems = [
    { href: '/dashboard', label: tApp('dashboard'), icon: <DashboardIcon /> },
    { href: '/specialists', label: tApp('specialists'), icon: <PeopleIcon /> }
  ];

  const headerTitle = pathname?.startsWith('/profile')
    ? tApp('myProfile')
    : navItems.find((n) => n.href === pathname)?.label ?? 'App';

  return (
    <Box sx={{ display: 'flex', minHeight: '100dvh' }}>
      <AppBar
        position="fixed"
        color="inherit"
        elevation={0}
        sx={{
          zIndex: (t) => t.zIndex.drawer + 2,
          borderBottom: 1,
          borderColor: 'divider',
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` }
        }}
      >
        <Toolbar sx={{ gap: 1 }}>
          <IconButton
            color="inherit"
            edge="start"
            onClick={toggleDrawer}
            sx={{ display: { sm: 'none' } }}
            aria-label="Open navigation menu"
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            {headerTitle}
          </Typography>

          <Box sx={{ flex: 1 }} />

          <LocaleSwitcher size="small" />

          <RequestsBadge specialistId={specialistId} />

          <AccountMenu userEmail={userEmail} />
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{
          width: { sm: drawerWidth },
          flexShrink: { sm: 0 }
        }}
        aria-label="Sidebar navigation"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={toggleDrawer}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              bgcolor: '#F5F1E6'
            }
          }}
        >
          <Sidebar navItems={navItems} pathname={pathname} onClose={() => setMobileOpen(false)} />
        </Drawer>
        <Drawer
          variant="permanent"
          open
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              bgcolor: '#F5F1E6'
            }
          }}
        >
          <Sidebar navItems={navItems} pathname={pathname} />
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          px: { xs: 2, md: 3 },
          py: { xs: 2, md: 3 },
          mt: 8
        }}
      >
        {children}
      </Box>
    </Box>
  );
};


