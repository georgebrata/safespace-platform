## Safespace — Next.js + MUI + Supabase (Auth + CRUD) Boilerplate

### Stack
- **Next.js (App Router)** + **TypeScript**
- **MUI (Material UI)** with Emotion SSR support (App Router-compatible)
- **Supabase** using `@supabase/supabase-js` + `@supabase/ssr` (cookie-based SSR auth)
- **Vercel** deployment friendly

### Environment variables (required)
Add these in **Vercel → Project → Settings → Environment Variables** (Production + Preview + Development), or locally in a `.env.local` file:

```
NEXT_PUBLIC_SUPABASE_URL=https://vintoxzeoruioeapnpnh.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=sb_publishable_y0a7pQQgTcZI71ajv4W6rg_ZpIZKe77
```

You can copy `env.example` → `.env.local`.

### Routes
- Public:
  - `/login`
  - `/register`
- Protected (middleware + server checks):
  - `/dashboard`
  - `/profile` (specialist can create/edit own profile)
  - `/specialists` (scoped to authenticated specialist by email)

### Supabase notes
- This boilerplate **never** uses service role keys.
- It assumes **Row Level Security (RLS)** is enabled.
- Ensure your `specialists` table policies allow the intended access for authenticated users.

### Specialist self-profile (email match)
To enforce “a specialist can edit their own profile only when `specialists.email` equals the authenticated user email”, apply:
- `supabase/rls_specialists_email.sql`


