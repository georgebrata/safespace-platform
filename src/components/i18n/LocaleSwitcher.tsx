'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { FormControl, MenuItem, Select, type SelectChangeEvent } from '@mui/material';
import { useLocale } from 'next-intl';
import { locales, type Locale } from '@/i18n/request';

type Props = {
  value?: Locale;
  size?: 'small' | 'medium';
};

export default function LocaleSwitcher({ value, size = 'small' }: Props) {
  const router = useRouter();
  const activeLocale = useLocale() as Locale;
  const [pending, setPending] = React.useState(false);

  const current = value ?? activeLocale;

  const onChange = async (e: SelectChangeEvent) => {
    const next = e.target.value as Locale;
    if (!locales.includes(next) || next === current) return;

    setPending(true);
    try {
      const res = await fetch('/api/locale', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ locale: next })
      });

      if (!res.ok) return;

      router.refresh();
    } finally {
      setPending(false);
    }
  };

  return (
    <FormControl size={size} disabled={pending} variant="outlined">
      <Select value={current} onChange={onChange} aria-label="Language">
        <MenuItem value="ro">RO</MenuItem>
        <MenuItem value="en">EN</MenuItem>
      </Select>
    </FormControl>
  );
}