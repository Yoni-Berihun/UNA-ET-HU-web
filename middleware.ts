import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAdmin = (token?.role as string) === 'ADMIN';
    const isSuperAdmin = (token?.role as string) === 'SUPER_ADMIN';

    if (req.nextUrl.pathname.startsWith('/admin') && !isAdmin && !isSuperAdmin) {
      return NextResponse.redirect(new URL('/auth/signin', req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        if (req.nextUrl.pathname.startsWith('/admin')) {
          return (token?.role as string) === 'ADMIN' || (token?.role as string) === 'SUPER_ADMIN';
        }
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: ['/admin/:path*'],
};
