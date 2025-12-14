import type { ReactNode } from 'react';
import './globals.css';
import { ThemeRegistry } from '@/theme/ThemeRegistry';
import { Providers } from './providers';

export const metadata = {
  title: 'Safespace',
  description: 'Next.js + MUI + Supabase boilerplate'
};

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <head>
        <meta name="emotion-insertion-point" content="" />
      </head>
      <body>
        <ThemeRegistry>
          <Providers>{children}</Providers>
        </ThemeRegistry>
      </body>
    </html>
  );
}


