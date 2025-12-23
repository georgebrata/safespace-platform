import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

const isPublicRoute = (pathname: string) => {
  if (pathname === '/login') return true;
  if (pathname === '/register') return true;
  return false;
};

const isProtectedRoute = (pathname: string) => {
  if (pathname === '/dashboard') return true;
  if (pathname === '/profile' || pathname.startsWith('/profile/')) return true;
  if (pathname === '/requests' || pathname.startsWith('/requests/')) return true;
  if (pathname.startsWith('/specialists')) return true;
  return false;
};

export const middleware = async (request: NextRequest) => {
  const { supabase, response } = await updateSession(request);

  const {
    data: { user }
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  if (!user && isProtectedRoute(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  if (user && isPublicRoute(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  return response;
};

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)']
};


