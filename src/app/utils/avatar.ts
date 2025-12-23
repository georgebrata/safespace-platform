const GuestInitial = 'G';

const PALETTE = [
  '#1a73e8',
  '#34a853',
  '#ea4335',
  '#fbbc05',
  '#8e24aa',
  '#00acc1',
  '#fb8c00'
] as const;

const DEFAULT_COLOR = PALETTE[0];

export function stringToColor(seed?: string | null): string {
  const s = (seed ?? '').trim();
  if (!s) return DEFAULT_COLOR;

  let hash = 0;
  for (let i = 0; i < s.length; i += 1) {
    hash = s.charCodeAt(i) + ((hash << 5) - hash);
  }

  return PALETTE[Math.abs(hash) % PALETTE.length] ?? DEFAULT_COLOR;
}

export function emailInitial(email?: string | null): string {
  const firstChar = email?.trim()?.[0];
  return (firstChar ?? GuestInitial).toUpperCase();
}