"use client";

import { useTranslations } from "next-intl";
import { ConsentDeclaration } from "@/components/auth/ConsentDeclaration";
import { Logo, LogoWithText } from "@/components/common/Logo";

export default function ConsentPage() {
    const t = useTranslations("consent");
    const ta = useTranslations("auth");

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
                        {ta("slogan")}
                    </p>
                </div>
                <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-white/5" />
                <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/5" />
            </div>

            {/* Right — Content */}
            <div className="flex-1 flex flex-col items-center justify-start p-4 sm:p-8 bg-[hsl(var(--background))] overflow-y-auto max-h-screen custom-scrollbar">
                <div className="w-full max-w-2xl flex flex-col relative py-12">
                    <div className="lg:hidden flex justify-center mb-8">
                        <LogoWithText />
                    </div>

                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold tracking-tight mb-4">{t("pageTitle")}</h1>
                        <p className="text-lg text-[hsl(var(--muted-foreground))] leading-relaxed text-center">
                            {t("pageDesc")}
                        </p>
                    </div>

                    <ConsentDeclaration />
                </div>
            </div>
        </div>
    );
}
