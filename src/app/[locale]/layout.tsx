import type { Metadata } from "next";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { ThemeProvider } from "@/components/common/ThemeProvider";
import StyledComponentsRegistry from "@/lib/StyledComponentsRegistry";
import { Inter, Montserrat, JetBrains_Mono } from "next/font/google";
import "../globals.css";

const inter = Inter({
    subsets: ["latin", "latin-ext"],
    variable: "--font-inter",
    display: "swap",
});

const montserrat = Montserrat({
    subsets: ["latin", "latin-ext"],
    variable: "--font-montserrat",
    display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
    subsets: ["latin", "latin-ext"],
    variable: "--font-mono",
    display: "swap",
});

export const metadata: Metadata = {
    title: "SafeBot — Təhlükəsiz Gələcək, Bu Gündən Başlayır",
    description:
        "Azərbaycanda əməyin mühafizəsi və texniki təhlükəsizlik sahəsində süni intellekt dəstəkli chatbot platforması.",
    keywords: [
        "SafeBot",
        "əmək təhlükəsizliyi",
        "SƏTƏM",
        "chatbot",
        "Azerbaijan",
        "occupational safety",
    ],
    icons: {
        icon: "/loqo.jpeg",
    },
};

export default async function LocaleLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;

    if (!hasLocale(routing.locales, locale)) {
        notFound();
    }

    const messages = await getMessages();

    return (
        <html lang={locale} suppressHydrationWarning>
            <head />
            <body className={`${inter.variable} ${montserrat.variable} ${jetbrainsMono.variable} min-h-screen antialiased`}>
                <ThemeProvider>
                    <NextIntlClientProvider messages={messages}>
                        <StyledComponentsRegistry>
                            {children}
                        </StyledComponentsRegistry>
                    </NextIntlClientProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
