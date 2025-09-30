// This file implements Next.js Middleware.
// Middleware allows you to run code on the server before a request is completed.
// It's useful for things like authentication, A/B testing, redirects, and more.

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// This is the main middleware function.
// It receives the incoming request as an argument.
export function middleware(request: NextRequest) {
  // In its current state, this middleware does nothing but pass the request along.
  // It's a placeholder for future logic.
  
  // A real-world authentication check might look something like this:
  //
  // 1. Get the session token from the request cookies.
  // const sessionCookie = request.cookies.get('session');
  //
  // 2. If the cookie doesn't exist, redirect to the login page.
  // if (!sessionCookie) {
  //   const loginUrl = new URL('/login', request.url);
  //   return NextResponse.redirect(loginUrl);
  // }
  //
  // 3. Verify the token with a backend service (e.g., Firebase Auth).
  // const isValid = await verifyToken(sessionCookie.value);
  //
  // 4. If the token is invalid, redirect to login.
  // if (!isValid) {
  //   ...
  // }
  
  // `NextResponse.next()` continues the request lifecycle.
  return NextResponse.next()
}

// The `config` object specifies which routes this middleware should run on.
// This is more efficient than running it on every single request.
export const config = {
  // The `matcher` property takes an array of path patterns.
  // Here, it's configured to run for any path inside `/blog/admin` and `/dashboard`.
  // The `:path*` part is a wildcard that matches all sub-paths.
  matcher: ['/blog/admin/:path*', '/dashboard/:path*'],
}
