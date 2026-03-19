import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
    return createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
}

export function createLoginClient(rememberMe: boolean) {
    return createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            isSingleton: false,
            cookieOptions: {
                // If rememberMe is true, keep it for 7 days (in seconds).
                // If false, setting maxAge to undefined creates a session cookie.
                maxAge: rememberMe ? 7 * 24 * 60 * 60 : undefined,
            }
        }
    )
}
