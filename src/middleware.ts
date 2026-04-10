import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { updateSession } from "./lib/supabase/middleware";
import { type NextRequest } from "next/server";

const intlMiddleware = createMiddleware(routing);

export async function middleware(request: NextRequest) {
    // First update the Supabase session
    const supabaseResponse = await updateSession(request);

    // If the session update triggered a redirect (e.g. unauthenticated user on protected route)
    // then return that redirect directly.
    if (supabaseResponse.headers.get("x-middleware-redirect")) {
        return supabaseResponse;
    }

    // Otherwise, proceed with the internationalization middleware
    const response = intlMiddleware(request);

    // Copy Supabase cookies to the final response
    supabaseResponse.cookies.getAll().forEach((cookie) => {
        response.cookies.set(cookie.name, cookie.value);
    });

    return response;
}

export const config = {
    matcher: [
        // Match all pathnames except for
        // - API routes
        // - _next (Next.js internals)
        // - static files (icons, images, etc.)
        // - /cv/* (CV Builder — proxied to Reactive Resume)
        "/((?!api|_next|cv|.*\\..*).*)",
    ],
};
