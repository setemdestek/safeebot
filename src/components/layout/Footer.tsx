"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Logo } from "@/components/common/Logo";

export function Footer() {
    const t = useTranslations("footer");
    const tc = useTranslations("common");
    const locale = useLocale();

    return (
        <footer className="border-t border-[hsl(var(--border))] bg-[hsl(var(--card))]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    {/* Logo + Copyright */}
                    <div className="flex items-center gap-2 text-sm text-[hsl(var(--muted-foreground))]">
                        <Logo width={28} height={28} />
                        <span>
                            © 2026 {tc("appName")}. {t("rights")}
                        </span>
                    </div>

                    {/* Links */}
                    <div className="flex items-center gap-6 text-sm">
                        <Link
                            href={`/${locale}/privacy`}
                            className="text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors duration-200"
                        >
                            {t("privacy")}
                        </Link>
                        <Link
                            href={`/${locale}/terms`}
                            className="text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors duration-200"
                        >
                            {t("terms")}
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
