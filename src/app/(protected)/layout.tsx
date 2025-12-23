import type { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { getSpecialistByEmail } from '@/lib/specialists/server';
import { AppShell } from '@/components/AppShell';

type ProtectedLayoutProps = {
  children: ReactNode;
};

export default async function ProtectedLayout({ children }: ProtectedLayoutProps) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const userEmail = (user.email ?? 'Account').trim().toLowerCase();
  const specialist = userEmail ? await getSpecialistByEmail(userEmail) : null;
  const specialistId = specialist?.id ?? null;

  return (
    <AppShell userEmail={userEmail} specialistId={specialistId}>
      {children}
    </AppShell>
  );
}


