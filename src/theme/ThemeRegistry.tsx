'use client';

import type { ReactNode } from 'react';
import * as React from 'react';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import { useServerInsertedHTML } from 'next/navigation';

type ThemeRegistryProps = {
  children: ReactNode;
};

type CacheWithFlush = ReturnType<typeof createCache> & {
  flush: () => Array<{ name: string; isGlobal: boolean }>;
};

const createEmotionCache = (): CacheWithFlush => {
  const insertionPoint =
    typeof document !== 'undefined'
      ? document.querySelector<HTMLMetaElement>('meta[name="emotion-insertion-point"]') ?? undefined
      : undefined;

  const cache = createCache({ key: 'mui', prepend: true, insertionPoint });
  cache.compat = true;

  let inserted: Array<{ name: string; isGlobal: boolean }> = [];
  const prevInsert = cache.insert;

  cache.insert = (...args) => {
    const [selector, serialized] = args;
    if (cache.inserted[serialized.name] === undefined) {
      inserted.push({ name: serialized.name, isGlobal: !selector });
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return prevInsert(...args);
  };

  const flush = () => {
    const prev = inserted;
    inserted = [];
    return prev;
  };

  return Object.assign(cache, { flush });
};

export const ThemeRegistry = ({ children }: ThemeRegistryProps) => {
  const [{ cache, flush }] = React.useState(() => {
    const c = createEmotionCache();
    return { cache: c, flush: c.flush };
  });

  useServerInsertedHTML(() => {
    const names = flush();
    if (names.length === 0) return null;

    let styles = '';
    for (const { name } of names) {
      styles += cache.inserted[name] ?? '';
    }

    return (
      <style
        data-emotion={`${cache.key} ${names.map((n) => n.name).join(' ')}`}
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: styles }}
      />
    );
  });

  return <CacheProvider value={cache}>{children}</CacheProvider>;
};


