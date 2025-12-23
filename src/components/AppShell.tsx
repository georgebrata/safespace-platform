'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
  Toolbar,
  Typography
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import LogoutIcon from '@mui/icons-material/Logout';
import { createBrowserSupabaseClient } from '@/lib/supabase/client';
import LocaleSwitcher from '@/components/i18n/LocaleSwitcher';
import { useTranslations } from 'next-intl';
import { emailInitial, stringToColor } from '@/app/utils/avatar';

const drawerWidth = 260;

type AppShellProps = {
  userEmail: string;
  children: React.ReactNode;
};

export const AppShell = ({ userEmail, children }: AppShellProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const tApp = useTranslations('app');
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [isSigningOut, setIsSigningOut] = React.useState(false);
  const [accountAnchorEl, setAccountAnchorEl] = React.useState<null | HTMLElement>(null);

  const isAccountMenuOpen = Boolean(accountAnchorEl);
  const openAccountMenu = (event: React.MouseEvent<HTMLElement>) => setAccountAnchorEl(event.currentTarget);
  const closeAccountMenu = () => setAccountAnchorEl(null);

  const toggleDrawer = () => setMobileOpen((v) => !v);

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

  const navItems = [
    { href: '/dashboard', label: tApp('dashboard'), icon: <DashboardIcon /> },
    { href: '/specialists', label: tApp('specialists'), icon: <PeopleIcon /> }
  ] as const;

  const headerTitle = pathname?.startsWith('/profile')
    ? tApp('myProfile')
    : navItems.find((n) => n.href === pathname)?.label ?? 'App';

  const drawer = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Stack sx={{ alignItems: 'center'}}>
        <Box
          component="img"
          src="/brand/safespace logo dark vertical.png"
          alt="Safespace"
          sx={{
            display: 'block',
            width: 150,
            height: 150,
            objectFit: 'contain',
            mb: 0.75
          }}
        />
      </Stack>
      <Divider />
      <List sx={{ px: 1, py: 1 }}>
        {navItems.map((item) => {
          const selected = pathname === item.href;
          return (
            <ListItemButton
              key={item.href}
              component={Link}
              href={item.href}
              selected={selected}
              sx={{ borderRadius: 2 }}
              onClick={() => setMobileOpen(false)}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          );
        })}
      </List>
      <Box sx={{ mt: 'auto', p: 2 }}>
        <Button
          fullWidth
          variant="outlined"
          onClick={onSignOut}
          startIcon={<LogoutIcon />}
          disabled={isSigningOut}
          aria-label={tApp('signOut')}
        >
          {isSigningOut ? tApp('signingOut') : tApp('signOut')}
        </Button>
      </Box>
    </Box>
  );

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

          <IconButton
            color="inherit"
            aria-label={tApp('account')}
            onClick={openAccountMenu}
            sx={{ ml: 0.5 }}
          >
            <Avatar
              sx={{
                width: 32,
                height: 32,
                bgcolor: stringToColor(userEmail)
              }}
            >
              {emailInitial(userEmail)}
            </Avatar>
          </IconButton>

          <Menu
            anchorEl={accountAnchorEl}
            open={isAccountMenuOpen}
            onClose={closeAccountMenu}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <Box sx={{ px: 2, py: 1, maxWidth: 280 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 800 }} noWrap>
                {tApp('account')}
              </Typography>
              <Typography variant="body2" color="text.secondary" noWrap>
                {userEmail}
              </Typography>
            </Box>
            <Divider />
            <MenuItem component={Link} href="/profile" onClick={closeAccountMenu}>
              {tApp('myProfile')}
            </MenuItem>
            <MenuItem component={Link} href="/profile/edit" onClick={closeAccountMenu}>
              {tApp('editProfile')}
            </MenuItem>
            <Divider />
            <MenuItem
              onClick={async () => {
                closeAccountMenu();
                await onSignOut();
              }}
              disabled={isSigningOut}
            >
              {tApp('signOut')}
            </MenuItem>
          </Menu>
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
          {drawer}
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
          {drawer}
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


