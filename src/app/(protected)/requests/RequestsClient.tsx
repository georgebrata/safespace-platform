'use client';

import * as React from 'react';
import {
  Alert,
  Box,
  CircularProgress,
  Divider,
  Tab,
  Tabs,
  Typography
} from '@mui/material';
import { useTranslations } from 'next-intl';
import { useNotify } from '@/components/feedback/SnackbarProvider';
import type { ChatRequestRow, ChatRequestStatus } from '@/lib/chat-requests/client';
import RequestCard from './RequestCard';
import {
  acceptRequest,
  listAllRequests,
  listMyAcceptedRequests
} from '@/lib/chat-requests/client';

type RequestsClientProps = {
  specialistId: number | null;
};

type TabValue = 'all' | 'mine';

function formatDeterministicUtc(value: string) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toISOString().slice(0, 16).replace('T', ' ');
}

function statusColor(status: ChatRequestStatus) {
  switch (status) {
    case 'pending':
      return 'warning';
    case 'accepted':
      return 'success';
    case 'closed':
      return 'default';
  }
}

export function RequestsClient({ specialistId }: RequestsClientProps) {
  const t = useTranslations('requests');
  const notify = useNotify();

  const [tab, setTab] = React.useState<TabValue>('all');
  const [rows, setRows] = React.useState<ChatRequestRow[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [acceptingId, setAcceptingId] = React.useState<string | null>(null);

  const load = React.useCallback(async () => {
    setError(null);
    setIsLoading(true);
    try {
      if (tab === 'mine') {
        if (!specialistId) {
          setRows([]);
          return;
        }
        const data = await listMyAcceptedRequests(specialistId);
        setRows(data);
        return;
      }

      const data = await listAllRequests();
      setRows(data);
    } catch (e) {
      const message = e instanceof Error ? e.message : t('errors.loadFailed');
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [tab, specialistId, t]);

  React.useEffect(() => {
    void load();
  }, [load]);

  const onAccept = async (id: string) => {
    setAcceptingId(id);
    try {
      await acceptRequest(id);
      notify.success(t('notifications.accepted'));
      window.dispatchEvent(new CustomEvent('requests:updated'));
      await load();
    } catch (e) {
      const message = e instanceof Error ? e.message : t('errors.acceptFailed');
      notify.error(message);
    } finally {
      setAcceptingId(null);
    }
  };

  return (
    <Box sx={{ display: 'grid', gap: 2 }}>
      <Box>
        <Tabs
          value={tab}
          onChange={(_, v: TabValue) => setTab(v)}
          aria-label={t('title')}
        >
          <Tab value="all" label={t('tabs.all')} />
          <Tab value="mine" label={t('tabs.mine')} />
        </Tabs>
        <Divider />
      </Box>

      {error ? (
        <Alert severity="error" role="alert">
          {error}
        </Alert>
      ) : isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress size={28} />
        </Box>
      ) : rows.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          {t('noRequests')}
        </Typography>
      ) : (
        <Box sx={{ display: 'grid', gap: 2 }}>
          {rows.map((r) => (
            <RequestCard
              key={r.id}
              request={r}
              specialistId={specialistId}
              acceptingId={acceptingId}
              onAccept={onAccept}
              formatDateTime={formatDeterministicUtc}
              statusColor={statusColor}
            />
          ))}
        </Box>
      )}
    </Box>
  );
}
