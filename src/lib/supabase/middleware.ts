import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

interface RateLimitEntry {
  count: number
  resetTime: number
  blockedUntil?: number
}

const rateLimitStore = new Map<string, RateLimitEntry>()

const RATE_LIMIT_WINDOW = 15 * 60 * 1000
const RATE_LIMIT_MAX = 100
const BLOCK_DURATION = 15 * 60 * 1000

function getRateLimitKey(ip: string, endpoint: string): string {
  return `${ip}:${endpoint}`
}

function getClientIp(request: NextRequest): string {
  const forwardedFor = request.headers.get('x-forwarded-for')
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim()
  }
  const realIp = request.headers.get('x-real-ip')
  if (realIp) {
    return realIp
  }
  return 'unknown'
}

function isRateLimited(ip: string, endpoint: string): boolean {
  const key = getRateLimitKey(ip, endpoint)
  const now = Date.now()
  const entry = rateLimitStore.get(key)

  if (!entry) {
    rateLimitStore.set(key, { count: 1, resetTime: now + RATE_LIMIT_WINDOW })
    return false
  }

  if (entry.blockedUntil && now < entry.blockedUntil) {
    return true
  }

  if (now > entry.resetTime) {
    rateLimitStore.set(key, { count: 1, resetTime: now + RATE_LIMIT_WINDOW })
    return false
  }

  entry.count++

  if (entry.count > RATE_LIMIT_MAX) {
    entry.blockedUntil = now + BLOCK_DURATION
    return true
  }

  return false
}

export async function updateSession(request: NextRequest) {
  const ip = getClientIp(request)
  
  const endpoint = request.nextUrl.pathname
  if (endpoint.startsWith('/api/')) {
    if (isRateLimited(ip, endpoint)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { 
          status: 429,
          headers: {
            'Retry-After': String(Math.floor(BLOCK_DURATION / 1000)),
            'X-RateLimit-Limit': String(RATE_LIMIT_MAX),
            'X-RateLimit-Remaining': '0',
          }
        }
      )
    }
  }

  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const isProtectedRoute = request.nextUrl.pathname.match(/^\/(en|az|ru|tr)\/(dashboard|settings|profile)/)

  if (isProtectedRoute && !user) {
    const locale = request.nextUrl.pathname.split('/')[1] || 'en'
    const url = request.nextUrl.clone()
    url.pathname = `/${locale}/auth/login`
    return NextResponse.redirect(url)
  }

  const isAuthRoute = request.nextUrl.pathname.match(/^\/(en|az|ru|tr)\/auth\/(login|register)/)
  if (isAuthRoute && user) {
    const locale = request.nextUrl.pathname.split('/')[1] || 'en'
    const url = request.nextUrl.clone()
    url.pathname = `/${locale}/dashboard`
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
