import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Server-side authentication middleware
 *
 * NOTE: We're using bearer token auth (localStorage), not cookie-based auth.
 * Server-side middleware cannot access localStorage, so we rely on client-side
 * route guards in the page components instead.
 *
 * This middleware is currently disabled but kept for future cookie-based auth.
 */
export function middleware(request: NextRequest) {
  // DISABLED: Server-side auth check doesn't work with localStorage-based tokens
  // Client-side route protection is handled in layout components

  // Allow all requests to proceed
  return NextResponse.next();
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
