'use client';

import { useTranslations, useLocale } from "next-intl";
import { Logo, LogoWithText } from "@/components/common/Logo";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function PrivacyPage() {
    const t = useTranslations("privacy");
    const ct = useTranslations("common");
    const locale = useLocale();

    const sections = [
        { title: t("sec1Title"), desc: t("sec1Desc") },
        { title: t("sec2Title"), desc: t("sec2Desc") },
        { title: t("sec3Title"), desc: t("sec3Desc") },
        { title: t("sec4Title"), desc: t("sec4Desc") },
    ];

    return (
        <div className="min-h-screen flex">
            {/* Left — Branding */}
            <div className="hidden lg:flex lg:w-1/2 bg-[hsl(var(--primary))] relative overflow-hidden items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--primary)/0.7)]" />
                <div className="relative z-10 text-center px-12">
                    <div className="w-32 h-32 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center mx-auto mb-8 p-2">
                        <Logo width={120} height={120} />
                    </div>
                    <h2 className="text-4xl font-bold text-white mb-4">SafeeBot</h2>
                    <p className="text-white/80 text-lg leading-relaxed">
                        {t('heroSubtitle')}
                    </p>
                </div>
                <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-white/5" />
                <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/5" />
            </div>

            {/* Right — Content */}
            <div className="flex-1 flex flex-col items-center justify-start p-8 bg-[hsl(var(--background))] overflow-y-auto max-h-screen custom-scrollbar relative">
                <div className="w-full max-w-2xl flex flex-col relative py-12">
                    {/* Back Button */}
                    <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="absolute top-4 left-0 lg:-left-4"
                    >
                        <Link
                            href={`/${locale}`}
                            className="flex items-center gap-2 text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--primary))] transition-colors group"
                        >
                            <div className="w-10 h-10 rounded-xl bg-[hsl(var(--muted)/0.1)] flex items-center justify-center group-hover:bg-[hsl(var(--primary)/0.1)] transition-colors">
                                <ArrowLeft className="w-5 h-5" />
                            </div>
                            <span className="font-medium">{ct('back')}</span>
                        </Link>
                    </motion.div>

                    <div className="lg:hidden flex justify-center mb-8">
                        <LogoWithText />
                    </div>

                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold tracking-tight mb-4">{t("title")}</h1>
                        <h2 className="text-2xl font-semibold text-[hsl(var(--primary))] mb-4 whitespace-pre-line">
                            {t("subtitle")}
                        </h2>
                        <p className="text-lg text-[hsl(var(--muted-foreground))]">
                            {t("intro")}
                        </p>
                    </div>

                    <div className="flex flex-col gap-6">
                        {sections.map((section, idx) => (
                            <div
                                key={idx}
                                className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-2xl p-6 shadow-sm"
                            >
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[hsl(var(--primary)/0.1)] text-[hsl(var(--primary))] font-bold shrink-0">
                                        {idx + 1}
                                    </div>
                                    <h3 className="text-xl font-semibold">{section.title}</h3>
                                </div>
                                <p className="text-[hsl(var(--muted-foreground))] leading-relaxed">
                                    {section.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
