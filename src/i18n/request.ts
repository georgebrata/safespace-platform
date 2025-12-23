import { getRequestConfig } from 'next-intl/server';

export const locales = ['en', 'ro'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'ro';

async function resolveLocale(): Promise<Locale> {
  const { cookies, headers } = await import('next/headers');

  const cookieStore = await cookies();
  const headerStore = await headers();

  const cookieLocale = cookieStore.get('NEXT_LOCALE')?.value;
  if (cookieLocale && locales.includes(cookieLocale as Locale)) {
    return cookieLocale as Locale;
  }

  const acceptLanguage = headerStore.get('accept-language');
  if (acceptLanguage) {
    const preferred = acceptLanguage
      .split(',')
      .map((part) => part.split(';')[0]?.trim().toLowerCase())
      .filter(Boolean);

    for (const lang of preferred) {
      if (locales.includes(lang as Locale)) return lang as Locale;
      const base = lang ? lang.split('-')[0] : null;
      if (base && locales.includes(base as Locale)) return base as Locale;
    }
  }

  return defaultLocale;
}

export default getRequestConfig(async () => {
  const locale = await resolveLocale();

  const [common, profile, avatar] = await Promise.all([
    import(`../../messages/${locale}/common.json`),
    import(`../../messages/${locale}/profile.json`),
    import(`../../messages/${locale}/avatar.json`)
  ]);

  const messages = {
    ...common.default,
    ...profile.default,
    ...avatar.default
  };

  return { locale, messages };
});
