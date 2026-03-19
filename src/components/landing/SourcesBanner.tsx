"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

import { ReactNode } from "react";

interface SourceItem {
    name: string;
    abbreviation: string;
    type: "az" | "intl";
    customLogo?: ReactNode;
}

const Logos = {
    IOSH: (
        <svg viewBox="0 0 100 40" className="w-12 h-auto text-[hsl(var(--foreground))]">
            <text x="50%" y="55%" fontSize="28" fontWeight="800" textAnchor="middle" dominantBaseline="middle" fill="currentColor" fontFamily="sans-serif">iosh</text>
            <circle cx="85" cy="12" r="4" fill="hsl(var(--primary))" />
        </svg>
    ),
    NEBOSH: (
        <svg viewBox="0 0 120 40" className="w-14 h-auto text-[hsl(var(--foreground))]">
            <rect width="120" height="40" rx="4" fill="currentColor" />
            <text x="50%" y="55%" fontSize="20" fontWeight="900" textAnchor="middle" dominantBaseline="middle" fill="hsl(var(--background))" fontFamily="sans-serif">NEBOSH</text>
        </svg>
    ),
    LOLER: (
        <svg viewBox="0 0 100 40" className="w-12 h-auto text-[hsl(var(--foreground))]">
            <path d="M2,2 L98,2 L98,38 L2,38 Z" fill="none" stroke="currentColor" strokeWidth="4" rx="4" />
            <text x="50%" y="55%" fontSize="18" fontWeight="800" textAnchor="middle" dominantBaseline="middle" fill="currentColor" fontFamily="sans-serif">LOLER</text>
        </svg>
    )
};

const SOURCES: SourceItem[] = [
    { name: "Atmosfer havasının mühafizəsi haqqında Qanun", abbreviation: "AHMHQ", type: "az" },
    { name: "Azərbaycan Respublikasının Konstitusiyası", abbreviation: "ARK", type: "az" },
    { name: "İcbari tibbi müayinələrin təkmilləşdirilməsi", abbreviation: "İTMT", type: "az" },
    { name: "Yanğın Təhlükəsizliyi Qaydaları", abbreviation: "YTQ", type: "az" },
    { name: "AZS ISO 45001", abbreviation: "ISO 45001", type: "az" },
    { name: "Tikintinin təşkili — FHN", abbreviation: "FHN-TT", type: "az" },
    { name: "İnzibati Xətalar Məcəlləsi", abbreviation: "İXM", type: "az" },
    { name: "Auditor xidməti haqqında Qanun", abbreviation: "AXQ", type: "az" },
    { name: "Energetika Nazirliyinin Kollegiya Qərarı", abbreviation: "ENKQ", type: "az" },
    { name: "AZS ГОСТ 12.4.011:2024", abbreviation: "ГОСТ", type: "az" },
    { name: "Ətraf mühitin mühafizəsi haqqında Qanun", abbreviation: "ƏTMHQ", type: "az" },
    { name: "Institution of Occupational Safety and Health", abbreviation: "IOSH", type: "intl", customLogo: Logos.IOSH },
    { name: "National Examination Board in Occupational Safety", abbreviation: "NEBOSH", type: "intl", customLogo: Logos.NEBOSH },
    { name: "Lifting Operations and Lifting Equipment Regs", abbreviation: "LOLER", type: "intl", customLogo: Logos.LOLER },
];

function SourceCard({ source }: { source: SourceItem }) {
    const isAZ = source.type === "az";
    const hasCustomLogo = !!source.customLogo;

    return (
        <div
            className={cn(
                "flex-shrink-0 flex items-center gap-4 px-6 py-4 rounded-2xl",
                "border border-[hsl(var(--border))] bg-[hsl(var(--card))]",
                "hover:border-[hsl(var(--primary)/0.4)] hover:shadow-lg",
                "transition-all duration-300 cursor-default select-none group"
            )}
        >
            {/* Logo Container */}
            <div className="flex items-center justify-center min-w-[3.5rem] min-h-[3.5rem] rounded-xl bg-[hsl(var(--background))] border border-[hsl(var(--border))] shadow-sm overflow-hidden relative group-hover:scale-105 transition-transform">
                {hasCustomLogo ? (
                    <div className="flex items-center justify-center p-2">
                        {source.customLogo}
                    </div>
                ) : (
                    <>
                        {isAZ && (
                            <div className="absolute top-0 w-full h-[4px] flex opacity-90">
                                <div className="flex-1 bg-[#00b5e2]"></div>
                                <div className="flex-1 bg-[#ef3340]"></div>
                                <div className="flex-1 bg-[#509e2f]"></div>
                            </div>
                        )}
                        <span className="text-sm font-black tracking-tight text-[hsl(var(--foreground))] p-2 text-center">
                            {source.abbreviation}
                        </span>
                    </>
                )}
            </div>

            {/* Text */}
            <div className="min-w-0 pr-2">
                <p className="text-base font-bold leading-tight truncate text-[hsl(var(--foreground))] group-hover:text-[hsl(var(--primary))] transition-colors">
                    {source.abbreviation}
                </p>
                <p className="text-xs text-[hsl(var(--muted-foreground))] truncate max-w-[200px] mt-1">
                    {source.name}
                </p>
            </div>
        </div>
    );
}

export function SourcesBanner() {
    const t = useTranslations("sources");

    return (
        <section id="sources" className="py-16 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[hsl(var(--primary)/0.1)] border border-[hsl(var(--primary)/0.2)] text-[hsl(var(--primary))] text-xs font-semibold uppercase tracking-wider mb-4">
                        {t("badge")}
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold mb-3">{t("title")}</h2>
                    <p className="text-[hsl(var(--muted-foreground))] max-w-2xl mx-auto">
                        {t("subtitle")}
                    </p>
                </motion.div>
            </div>

            {/* Marquee */}
            <div className="relative">
                {/* Fade edges */}
                <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[hsl(var(--background))] to-transparent z-10 pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[hsl(var(--background))] to-transparent z-10 pointer-events-none" />

                <div className="animate-marquee flex gap-4 w-max">
                    {/* Duplicate for seamless loop */}
                    {[...SOURCES, ...SOURCES].map((source, i) => (
                        <SourceCard key={`${source.abbreviation}-${i}`} source={source} />
                    ))}
                </div>
            </div>
        </section>
    );
}
