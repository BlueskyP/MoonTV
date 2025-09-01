import { NextResponse } from 'next/server'

const USER = process.env.BASIC_AUTH_USER
const PASS = process.env.BASIC_AUTH_PASSWORD

export function middleware(req: Request) {
  if (process.env.NODE_ENV === 'development') return NextResponse.next()

  const auth = req.headers.get('authorization') || ''

  if (auth.startsWith('Basic ')) {
    const [, base64] = auth.split(' ')
    const [user, pwd] = atob(base64).split(':')
    if (user === USER && pwd === PASS) {
      return NextResponse.next()
    }
  }

  return new NextResponse('Authentication required', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="Secure Area"' },
  })
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)',
  ],
}
