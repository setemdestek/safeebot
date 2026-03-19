"use client";

import { useTranslations } from "next-intl";
import { Mail, Headphones, ArrowRight } from "lucide-react";

const SUPPORT_EMAIL = "setemdestek@hotmail.com";

export function SupportSection() {
    const t = useTranslations("support");

    return (
        <section className="relative py-20 overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[hsl(var(--primary)/0.03)] to-transparent" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[hsl(var(--primary)/0.04)] blur-3xl pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[hsl(var(--primary)/0.1)] text-[hsl(var(--primary))] text-sm font-medium mb-4">
                        <Headphones className="w-4 h-4" />
                        {t("title")}
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[hsl(var(--foreground))]">
                        {t("subtitle")}
                    </h2>
                    <p className="text-[hsl(var(--muted-foreground))] max-w-xl mx-auto text-base md:text-lg leading-relaxed">
                        {t("description")}
                    </p>
                </div>

                {/* Email Card */}
                <div className="max-w-lg mx-auto">
                    <div className="group relative rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-8 transition-all duration-300 hover:shadow-xl hover:shadow-[hsl(var(--primary)/0.08)] hover:border-[hsl(var(--primary)/0.3)]">
                        {/* Glow effect on hover */}
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[hsl(var(--primary)/0.05)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                        <div className="relative z-10 flex flex-col items-center text-center gap-5">
                            {/* Icon */}
                            <div className="w-16 h-16 rounded-2xl bg-[hsl(var(--primary)/0.1)] flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                <Mail className="w-8 h-8 text-[hsl(var(--primary))]" />
                            </div>

                            {/* Label */}
                            <p className="text-sm font-medium text-[hsl(var(--muted-foreground))] uppercase tracking-wider">
                                {t("emailLabel")}
                            </p>

                            {/* Email address */}
                            <p className="text-lg md:text-xl font-semibold text-[hsl(var(--foreground))] select-all">
                                {SUPPORT_EMAIL}
                            </p>

                            {/* CTA Button */}
                            <a
                                href={`mailto:${SUPPORT_EMAIL}`}
                                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] font-medium text-sm hover:opacity-90 transition-all duration-200 group/btn hover:gap-3"
                            >
                                {t("emailButton")}
                                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover/btn:translate-x-0.5" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
