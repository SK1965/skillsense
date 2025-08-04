import { NextResponse } from 'next/server';

export async function middleware() {
  const res = NextResponse.next();

  return res;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
