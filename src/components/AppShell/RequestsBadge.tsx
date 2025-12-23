'use client';

import * as React from 'react';
import Link from 'next/link';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import MailIcon from '@mui/icons-material/Mail';
import { useTranslations } from 'next-intl';
import { countPendingRequestsForSpecialists } from '@/lib/chat-requests/client';

export default function RequestsBadge({ specialistId }: { specialistId: number | null }) {
  const t = useTranslations('requests');
  const [pending, setPending] = React.useState<number | null>(null);

  const refresh = React.useCallback(async () => {
    if (!specialistId) return setPending(null);
    try {
      const c = await countPendingRequestsForSpecialists();
      setPending(c);
    } catch {
      setPending(null);
    }
  }, [specialistId]);

  React.useEffect(() => {
    void refresh();
  }, [refresh]);

  React.useEffect(() => {
    const onUpdated = () => void refresh();
    window.addEventListener('requests:updated', onUpdated);
    return () => window.removeEventListener('requests:updated', onUpdated);
  }, [refresh]);

  if (!specialistId) return null;

  return (
    <IconButton color="inherit" aria-label={t('title')} component={Link} href="/requests" sx={{ ml: 0.5 }}>
      <Badge color="error" badgeContent={pending ?? undefined} invisible={!pending}>
          <MailIcon color="action" />
      </Badge>
    </IconButton>
  );
}
