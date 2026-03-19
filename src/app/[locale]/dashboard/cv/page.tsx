"use client";

import { useTranslations } from "next-intl";
import { Construction } from "lucide-react";

export default function CvPage() {
    const t = useTranslations("cvSection");

    return (
        <div className="min-h-screen flex items-center justify-center p-8">
            <div className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-[hsl(var(--primary)/0.1)] flex items-center justify-center mx-auto mb-6">
                    <Construction className="w-8 h-8 text-[hsl(var(--primary))]" />
                </div>
                <h1 className="text-2xl font-bold mb-3">{t("title")}</h1>
                <p className="text-[hsl(var(--muted-foreground))] max-w-md">
                    {t("comingSoon")}
                </p>
            </div>
        </div>
    );
}
