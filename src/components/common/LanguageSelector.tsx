"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { Globe } from "lucide-react";
import { cn } from "@/lib/utils";

const LOCALES = [
    { code: "az", label: "AZ", flag: "🇦🇿" },
    { code: "en", label: "EN", flag: "🇬🇧" },
    { code: "ru", label: "RU", flag: "🇷🇺" },
] as const;

export function LanguageSelector() {
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    const switchLocale = (newLocale: string) => {
        // Replace the locale prefix in the pathname
        const segments = pathname.split("/");
        segments[1] = newLocale;
        const newPath = segments.join("/");
        localStorage.setItem("safebot_locale", newLocale);
        router.push(newPath);
        setOpen(false);
    };

    const current = LOCALES.find((l) => l.code === locale) || LOCALES[0];

    return (
        <div className="relative" ref={ref}>
            <button
                onClick={() => setOpen(!open)}
                className={cn(
                    "flex items-center gap-1.5 px-3 py-2 rounded-[var(--radius)] text-sm font-medium",
                    "hover:bg-[hsl(var(--accent))] transition-colors duration-200",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))]"
                )}
                aria-label="Select language"
            >
                <Globe className="w-4 h-4" />
                <span>{current.flag} {current.label}</span>
            </button>

            {open && (
                <div className="absolute right-0 top-full mt-2 w-36 rounded-[var(--radius)] border border-[hsl(var(--border))] bg-[hsl(var(--popover))] text-[hsl(var(--popover-foreground))] shadow-lg z-50 overflow-hidden">
                    {LOCALES.map((l) => (
                        <button
                            key={l.code}
                            onClick={() => switchLocale(l.code)}
                            className={cn(
                                "w-full flex items-center gap-2 px-3 py-2.5 text-sm transition-colors duration-150",
                                l.code === locale
                                    ? "bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]"
                                    : "hover:bg-[hsl(var(--accent))]"
                            )}
                        >
                            <span>{l.flag}</span>
                            <span>{l.label}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
