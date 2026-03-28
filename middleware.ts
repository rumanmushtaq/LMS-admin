import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // const accessToken = request.cookies.get('access_token');
  // const refreshToken = request.cookies.get('refresh_token');
  // const isLoginPage = request.nextUrl.pathname.startsWith('/login');

  // // If no tokens exist and trying to access protected route
  // if (!accessToken && !refreshToken && !isLoginPage) {
  //   return NextResponse.redirect(new URL('/login', request.url));
  // }

  // // If tokens exist and trying to access login page, redirect to dashboard
  // if ((accessToken || refreshToken) && isLoginPage) {
  //   return NextResponse.redirect(new URL('/', request.url));
  // }

  // return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
