"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import Link from "next/link";
import { useLocale } from "next-intl";
import { ArrowRight, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BeamsBackground } from "./BeamsBackground";

export function HeroSection() {
    const t = useTranslations("hero");
    const locale = useLocale();

    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
            <BeamsBackground />

            <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                >
                    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-6">
                        {t.rich("title", {
                            highlight: (chunks) => <span className="text-[hsl(var(--primary))]">{chunks}</span>
                        })}
                    </h1>

                    {/* Subtitle */}
                    <p className="text-lg sm:text-xl text-[hsl(var(--muted-foreground))] max-w-2xl mx-auto mb-10 leading-relaxed">
                        {t("subtitle")}
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Button asChild size="lg" className="group text-base px-8 bg-[#e11d48] text-white hover:bg-[#be123c] border-none shadow-lg shadow-black/20">
                            <Link href={`/${locale}/login`}>
                                <span>{t("cta")}</span>
                                <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                            </Link>
                        </Button>
                        <Button
                            variant="outline"
                            size="lg"
                            className="text-base px-8 border-neutral-800 hover:bg-neutral-800/50 text-[hsl(var(--foreground))] backdrop-blur-sm"
                            onClick={() => {
                                document
                                    .getElementById("how-it-works")
                                    ?.scrollIntoView({ behavior: "smooth" });
                            }}
                        >
                            <span>{t("howItWorks")}</span>
                            <ChevronDown className="w-4 h-4 ml-1" />
                        </Button>
                    </div>
                </motion.div>
            </div>

            {/* Scroll indicator */}
            <motion.div
                className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
                <ChevronDown className="w-6 h-6 text-[hsl(var(--muted-foreground))]" />
            </motion.div>
        </section>
    );
}
