"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Menu, X, Shield } from "lucide-react";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import { LanguageSelector } from "@/components/common/LanguageSelector";
import { LogoWithText } from "@/components/common/Logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
    const t = useTranslations("common");
    const locale = useLocale();
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const navLinks: { href: string; label: string }[] = [];

    return (
        <>
            <header
                className={cn(
                    "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
                    scrolled
                        ? "bg-[hsl(var(--background)/0.8)] backdrop-blur-xl border-b border-[hsl(var(--border))] shadow-sm"
                        : "bg-transparent"
                )}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <Link
                            href={`/${locale}`}
                            className="inline-block"
                        >
                            <LogoWithText />
                        </Link>

                        {/* Desktop Nav */}
                        <nav className="hidden md:flex items-center gap-1">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="px-4 py-2 text-sm font-medium rounded-[var(--radius)] text-[hsl(var(--foreground)/0.7)] hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--accent))] transition-colors duration-200"
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </nav>

                        {/* Desktop Right */}
                        <div className="hidden md:flex items-center gap-2">
                            <LanguageSelector />
                            <ThemeToggle />
                            <Button asChild size="sm">
                                <Link href={`/${locale}/login`}>{t("start")}</Link>
                            </Button>
                        </div>

                        {/* Mobile Toggle */}
                        <button
                            className="md:hidden w-10 h-10 flex items-center justify-center rounded-[var(--radius)] hover:bg-[hsl(var(--accent))] transition-colors"
                            onClick={() => setMobileOpen(!mobileOpen)}
                            aria-label="Menu"
                        >
                            {mobileOpen ? (
                                <X className="w-5 h-5" />
                            ) : (
                                <Menu className="w-5 h-5" />
                            )}
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-x-0 top-16 z-40 md:hidden"
                    >
                        <div className="bg-[hsl(var(--background))] border-b border-[hsl(var(--border))] shadow-lg p-4 space-y-2">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setMobileOpen(false)}
                                    className="block px-4 py-3 text-sm font-medium rounded-[var(--radius)] hover:bg-[hsl(var(--accent))] transition-colors"
                                >
                                    {link.label}
                                </Link>
                            ))}
                            <div className="flex items-center gap-2 pt-2 border-t border-[hsl(var(--border))]">
                                <LanguageSelector />
                                <ThemeToggle />
                            </div>
                            <Button asChild className="w-full mt-2">
                                <Link href={`/${locale}/login`} onClick={() => setMobileOpen(false)}>
                                    {t("start")}
                                </Link>
                            </Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
