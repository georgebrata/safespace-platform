import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { locales, type Locale } from '@/i18n/request';

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as { locale?: string } | null;
  const locale = body?.locale;

  if (!locale || !locales.includes(locale as Locale)) {
    return NextResponse.json({ error: 'Invalid locale' }, { status: 400 });
  }

  const cookieStore = await cookies();
  cookieStore.set('NEXT_LOCALE', locale, {
    path: '/',
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 365 // 1 year
  });

  return NextResponse.json({ ok: true });
}