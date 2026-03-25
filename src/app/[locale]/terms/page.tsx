'use client';

import { Logo, LogoWithText } from "@/components/common/Logo";
import { useTranslations, useLocale } from "next-intl";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function TermsPage() {
    const t = useTranslations('terms');
    const ct = useTranslations('common');
    const locale = useLocale();

    const sections = [
        {
            title: t('sections.s1.title'),
            desc: [
                t('sections.s1.d1'),
                t('sections.s1.d2'),
                t('sections.s1.d3')
            ]
        },
        {
            title: t('sections.s2.title'),
            desc: [
                t('sections.s2.d1'),
                t('sections.s2.d2')
            ]
        },
        {
            title: t('sections.s3.title'),
            desc: [
                t('sections.s3.d1'),
                t('sections.s3.d2')
            ]
        },
        {
            title: t('sections.s4.title'),
            desc: [
                t('sections.s4.d1'),
                t('sections.s4.d2'),
                t('sections.s4.d3'),
                t('sections.s4.d4')
            ]
        },
        {
            title: t('sections.s5.title'),
            desc: [
                t('sections.s5.d1'),
                t('sections.s5.d2'),
                t('sections.s5.d3')
            ]
        },
        {
            title: t('sections.s6.title'),
            desc: [
                t('sections.s6.d1'),
                t('sections.s6.d2'),
                t('sections.s6.d3')
            ]
        },
        {
            title: t('sections.s7.title'),
            desc: [
                t('sections.s7.d1')
            ]
        }
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
            <div className="flex-1 flex flex-col items-center justify-start p-4 sm:p-8 bg-[hsl(var(--background))] overflow-y-auto max-h-screen custom-scrollbar relative">
                <div className="w-full max-w-2xl flex flex-col relative py-12">
                    {/* Back Button */}
                    <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="absolute top-4 left-2 sm:left-0 lg:-left-4"
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
                        <h1 className="text-4xl font-bold tracking-tight mb-4">{t('title')}</h1>
                        <p className="text-lg text-[hsl(var(--muted-foreground))]">
                            {t('subtitle')}
                        </p>
                    </div>

                    <div className="flex flex-col gap-6">
                        {sections.map((section, idx) => (
                            <div
                                key={idx}
                                className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-2xl p-6 shadow-sm"
                            >
                                <h3 className="text-xl font-bold mb-4 text-[hsl(var(--foreground))]">{section.title}</h3>
                                <ul className="space-y-2 list-disc pl-5">
                                    {section.desc.map((item, idy) => (
                                        <li key={idy} className="text-[hsl(var(--muted-foreground))] leading-relaxed">
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
