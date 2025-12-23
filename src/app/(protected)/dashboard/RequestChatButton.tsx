'use client';

import * as React from 'react';
import { Button } from '@mui/material';
import { useTranslations } from 'next-intl';
import { useNotify } from '@/components/feedback/SnackbarProvider';
import { createChatRequest } from '@/lib/chat-requests/client';
import { createBrowserSupabaseClient } from '@/lib/supabase/client';

type RequestChatButtonProps = {
  userId: string | null;
  userEmail: string | null;
};

export default function RequestChatButton({ userId, userEmail }: RequestChatButtonProps) {
  const t = useTranslations('requests');
  const notify = useNotify();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const onClick = async () => {
    if (!userId) {
      notify.error(t('errors.missingUser'));
      return;
    }

    setIsSubmitting(true);
    try {
      const email = (userEmail ?? '').trim();
      let createdByName = email || 'User';

      if (email) {
        try {
          const supabase = createBrowserSupabaseClient();
          const { data } = await supabase
            .from('users')
            .select('fullname')
            .eq('email', email)
            .maybeSingle();

          const fullName = (data?.fullname ?? '').trim();
          if (fullName) createdByName = fullName;
        } catch {
        }
      }

      await createChatRequest({
        createdBy: userId,
        createdByName
      });

      notify.success(t('notifications.created'));
      window.dispatchEvent(new CustomEvent('requests:updated'));
    } catch (e) {
      const message = e instanceof Error ? e.message : t('errors.createFailed');
      notify.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Button variant="contained" onClick={onClick} disabled={isSubmitting}>
      {isSubmitting ? t('actions.requestChatOngoing') : t('actions.requestChat')}
    </Button>
  );
}
