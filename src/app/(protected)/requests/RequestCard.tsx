'use client';

import * as React from 'react';
import { Box, Button, Card, CardActions, CardContent, Chip, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';
import type { ChatRequestRow, ChatRequestStatus } from '@/lib/chat-requests/client';

export type RequestCardProps = {
  request: ChatRequestRow;
  specialistId: number | null;
  acceptingId: string | null;
  onAccept: (requestId: string) => void | Promise<void>;
  formatDateTime: (value: string) => string;
  statusColor: (status: ChatRequestStatus) => 'default' | 'success' | 'warning';
};

export default function RequestCard({
  request,
  specialistId,
  acceptingId,
  onAccept,
  formatDateTime,
  statusColor
}: RequestCardProps) {
  const t = useTranslations('requests');

  return (
    <Card variant="outlined" sx={{ borderRadius: 2 }}>
      <CardContent sx={{ display: 'grid', gap: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
            {t('cardTitle', { id: request.id })}
          </Typography>
          <Chip
            size="small"
            label={t(`status.${request.status}`)}
            color={statusColor(request.status)}
            variant={request.status === 'closed' ? 'outlined' : 'filled'}
          />
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ overflowWrap: 'anywhere' }}>
          <strong>{t('fields.createdBy')}:</strong> {request.created_by_name || '—'}
        </Typography>

        <Typography variant="body2" color="text.secondary">
          <strong>{t('fields.createdAt')}:</strong> {formatDateTime(request.created_at)}
        </Typography>

        {request.closed_at ? (
          <Typography variant="body2" color="text.secondary">
            <strong>{t('fields.closedAt')}:</strong> {formatDateTime(request.closed_at)}
          </Typography>
        ) : null}
      </CardContent>

      {specialistId && request.status === 'pending' ? (
        <CardActions sx={{ px: 2, pb: 2 }}>
          <Button variant="contained" onClick={() => onAccept(request.id)} disabled={acceptingId === request.id}>
            {acceptingId === request.id ? t('ongoing') : t('actions.takeCase')}
          </Button>
        </CardActions>
      ) : null}
    </Card>
  );
}
