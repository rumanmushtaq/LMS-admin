import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const accessToken = request.cookies.get('access_token');
  const refreshToken = request.cookies.get('refresh_token');
  const isLoginPage = request.nextUrl.pathname.startsWith('/login');

  // If no tokens exist and trying to access protected route
  if (!accessToken && !refreshToken && !isLoginPage) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If tokens exist and trying to access login page, redirect to dashboard
  if ((accessToken || refreshToken) && isLoginPage) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Exclude API, Next internals, and any request for a file with an extension
  // (images, fonts, css, …). Without the extension exclusion, static assets
  // like the logo were caught by the auth check and redirected to /login for
  // logged-out visitors, so they never loaded.
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.[^/]+$).*)',
  ],
};
