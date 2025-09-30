// This file configures the middleware for the Next.js application.
// Middleware allows you to run code before a request is completed. 
// Based on the incoming request, you can modify the response by rewriting, redirecting, 
// modifying headers, or streaming.

// Import the necessary types from Next.js.
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// The main middleware function.
export function middleware(request: NextRequest) {
  // This is a placeholder for actual middleware logic.
  // For example, you could check for an authentication token in the cookies
  // and redirect unauthenticated users from protected routes.

  // Example: Protecting a route
  // const authToken = request.cookies.get('auth-token');
  // const { pathname } = request.nextUrl;
  
  // if (pathname.startsWith('/dashboard') && !authToken) {
  //   const url = request.nextUrl.clone();
  //   url.pathname = '/login';
  //   return NextResponse.redirect(url);
  // }
  
  // If no redirection or modification is needed, just pass the request through.
  return NextResponse.next();
}

// The `config` object specifies which paths the middleware should run on.
// Using a `matcher` is more efficient than running the middleware on every single request.
export const config = {
  // This matcher applies the middleware to all routes except for those that are
  // typically static files or internal Next.js assets.
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
