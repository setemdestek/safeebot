// n8n Webhook URL — loaded from environment variable (WEBHOOK_URL)
// NEVER hardcode webhook URLs in source code
export const WEBHOOK_URL: string = process.env.WEBHOOK_URL || "";

// Chat config
export const CHAT_TIMEOUT_MS = 300_000; // 300 seconds (5 minutes)

// Supported locales
export const LOCALES = ["az", "en", "ru"] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "az";

// App info
export const APP_NAME = "SafeeBot";
export const APP_YEAR = 2026;
