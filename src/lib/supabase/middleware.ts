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

const PASSWORD_RATE_LIMIT_MAX = 5
const PASSWORD_RATE_LIMIT_WINDOW = 15 * 60 * 1000
const PASSWORD_BLOCK_DURATION = 30 * 60 * 1000

// Cleanup expired entries every 5 minutes
const CLEANUP_INTERVAL = 5 * 60 * 1000
setInterval(() => {
  const now = Date.now()
  for (const [key, entry] of rateLimitStore) {
    if (now > entry.resetTime && (!entry.blockedUntil || now > entry.blockedUntil)) {
      rateLimitStore.delete(key)
    }
  }
}, CLEANUP_INTERVAL)

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

  const isPasswordEndpoint = endpoint === '/api/auth/change-password'
  const window = isPasswordEndpoint ? PASSWORD_RATE_LIMIT_WINDOW : RATE_LIMIT_WINDOW
  const max = isPasswordEndpoint ? PASSWORD_RATE_LIMIT_MAX : RATE_LIMIT_MAX
  const block = isPasswordEndpoint ? PASSWORD_BLOCK_DURATION : BLOCK_DURATION

  if (!entry) {
    rateLimitStore.set(key, { count: 1, resetTime: now + window })
    return false
  }

  if (entry.blockedUntil && now < entry.blockedUntil) {
    return true
  }

  if (now > entry.resetTime) {
    rateLimitStore.set(key, { count: 1, resetTime: now + window })
    return false
  }

  entry.count++

  if (entry.count > max) {
    entry.blockedUntil = now + block
    return true
  }

  return false
}

export async function updateSession(request: NextRequest) {
  const ip = getClientIp(request)

  const endpoint = request.nextUrl.pathname
  if (endpoint.startsWith('/api/')) {
    // CSRF protection: verify Origin header for state-changing requests
    const method = request.method.toUpperCase()
    if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(method)) {
      const origin = request.headers.get('origin')
      const host = request.headers.get('host')
      if (origin && host) {
        const originHost = new URL(origin).host
        if (originHost !== host) {
          return NextResponse.json(
            { error: 'İcazəsiz sorğu mənbəyi.' },
            { status: 403 }
          )
        }
      }
    }

    // Stricter rate limit for password change endpoint
    const isPasswordEndpoint = endpoint === '/api/auth/change-password'
    const maxRequests = isPasswordEndpoint ? PASSWORD_RATE_LIMIT_MAX : RATE_LIMIT_MAX
    const blockDuration = isPasswordEndpoint ? PASSWORD_BLOCK_DURATION : BLOCK_DURATION

    if (isRateLimited(ip, endpoint)) {
      return NextResponse.json(
        { error: 'Çox sayda sorğu göndərildi. Bir az sonra cəhd edin.' },
        {
          status: 429,
          headers: {
            'Retry-After': String(Math.floor(blockDuration / 1000)),
            'X-RateLimit-Limit': String(maxRequests),
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
