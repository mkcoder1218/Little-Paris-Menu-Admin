import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  if (path.startsWith('/admin')) {
    const session = request.cookies.get('admin_session')
    
    if (path === '/admin/login') {
      if (session) {
        return NextResponse.redirect(new URL('/admin/categories', request.url))
      }
      return NextResponse.next()
    }

    if (!session) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/admin/:path*',
}
