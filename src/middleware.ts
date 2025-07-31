import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  // If the request is already for the root, do nothing and continue.
  if (request.nextUrl.pathname === '/' || request.nextUrl.pathname === '/score' || request.nextUrl.pathname === '/error') {
    return NextResponse.next()
  }
 
  // Otherwise, redirect to the root. This uses a 307 status code by default.
  return NextResponse.redirect(new URL('/', request.url))
}
 
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}