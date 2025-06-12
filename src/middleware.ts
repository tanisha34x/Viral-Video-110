import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const referrer = request.headers.get('referer')
  const url = request.nextUrl

  // Check if the request comes from Facebook or has fbclid parameter
  if (referrer?.includes('facebook.com') || url.searchParams.has('fbclid')) {
    return NextResponse.redirect(new URL('https://tapatap.com/'))
  }

  return NextResponse.next()
}

// Configure which paths the middleware should run on
export const config = {
  matcher: '/:path*',
} 