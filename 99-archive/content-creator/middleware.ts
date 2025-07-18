import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Define protected routes here - add new routes to this array to protect them
// IMPORTANT: When adding routes here, also add them to the matcher config at the bottom of the file
// For each route added here, you need to add TWO entries in the matcher: '/route' and '/route/:path*'
export const PROTECTED_ROUTES = [
  '/gamma', '/setlists', '/themes',
  // Add additional protected routes here
]

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  // Check if the current path is protected
  const isProtectedPath = PROTECTED_ROUTES.some(path =>
    request.nextUrl.pathname.startsWith(path)
  )

  // Skip middleware if not a protected path
  if (!isProtectedPath) {
    return NextResponse.next()
  }

  // Check if the user is authenticated via cookies
  // Note: localStorage is not accessible in middleware, only cookies
  const isAuthenticated = request.cookies.has('gamma_auth')

  // If not authenticated, redirect to the login page with the original path as a query parameter
  if (!isAuthenticated) {
    // Create a URL using the current host to ensure it works with custom domains
    const url = new URL('/login', request.url)
    url.searchParams.set('redirect', request.nextUrl.pathname)

    // Log the redirect URL for debugging
    console.log('Redirecting unauthenticated user to:', url.toString())

    return NextResponse.redirect(url)
  }

  // If authenticated, allow access to the protected page
  return NextResponse.next()
}

// Configure the paths that should be matched by this middleware
// Note: This must be a static array, not a dynamic expression
export const config = {
  matcher: [
    // Make sure to update this list when you add routes to PROTECTED_ROUTES
    '/gamma',
    '/gamma/:path*',
    '/setlists',
    '/setlists/:path*',
    '/themes',
    '/themes/:path*',
    // Add additional matchers here for each route in PROTECTED_ROUTES
  ],
}
