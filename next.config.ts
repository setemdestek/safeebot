import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  output: "standalone",
  async rewrites() {
    const rrUrl = process.env.REACTIVE_RESUME_INTERNAL_URL || "http://reactive-resume:3000";
    return [
      // CV Builder — page routes and static assets (Vite base: /cv/)
      {
        source: "/cv",
        destination: `${rrUrl}/cv`,
      },
      {
        source: "/cv/:path*",
        destination: `${rrUrl}/cv/:path*`,
      },
      // CV Builder — ORPC API (browser requests to /api/rpc/*)
      {
        source: "/api/rpc/:path*",
        destination: `${rrUrl}/api/rpc/:path*`,
      },
      // CV Builder — OpenAPI spec
      {
        source: "/api/openapi/:path*",
        destination: `${rrUrl}/api/openapi/:path*`,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/_next/static/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/loqo.(jpeg|webp|png|avif)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, stale-while-revalidate=604800",
          },
        ],
      },
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.google.com https://www.gstatic.com https://*.supabase.co https://challenges.cloudflare.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: blob:",
              "media-src 'self' blob:",
              "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://*.spline.design https://unpkg.com https://challenges.cloudflare.com",
              "frame-src 'self' https://www.google.com https://www.gstatic.com https://challenges.cloudflare.com",
              "worker-src 'self' blob:",
            ].join("; "),
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), payment=()",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains",
          },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
