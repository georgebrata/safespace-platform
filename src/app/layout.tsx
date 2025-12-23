import type { ReactNode } from 'react';
import './globals.css';
import { ThemeRegistry } from '@/theme/ThemeRegistry';
import { Providers } from './providers';
import { AppSnackbarProvider } from '@/components/feedback/SnackbarProvider';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';
import { defaultLocale, type Locale } from '@/i18n/request';

export const metadata = {
  title: 'Safespace',
  icons: {
    icon: '/brand/safespace favicon dark.png',
    shortcut: '/brand/safespace favicon dark.png',
    apple: '/brand/safespace favicon dark.png'
  }
};

type RootLayoutProps = {
  children: ReactNode;
};

export default async function RootLayout({ children }: RootLayoutProps) {
  const localeStr = await getLocale();
  const messages = await getMessages();

  const locale = (localeStr === 'en' || localeStr === 'ro' ? localeStr : defaultLocale) as Locale;

  return (
    <html lang={locale}>
      <head>
        <meta name="emotion-insertion-point" content="" />
      </head>
      <body>
        <AppSnackbarProvider>
          <ThemeRegistry>
            <NextIntlClientProvider locale={locale} messages={messages}>
              <Providers>{children}</Providers>
            </NextIntlClientProvider>
          </ThemeRegistry>
        </AppSnackbarProvider>
      </body>
    </html>
  );
}


