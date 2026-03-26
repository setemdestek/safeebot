"use client";

import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

interface ConsentDeclarationProps {
    className?: string;
}

interface Section {
    title: string;
    subtitle?: string;
    items: string[];
    note?: string;
    highlight?: string;
    ordered?: boolean;
}

export function ConsentDeclaration({ className }: ConsentDeclarationProps) {
    const t = useTranslations("consent");

    const sections: Section[] = [
        {
            title: t("s1.title"),
            items: [t("s1.d1"), t("s1.d2"), t("s1.d3"), t("s1.d4")],
            note: t("s1.note"),
        },
        {
            title: t("s2.title"),
            items: [t("s2.d1"), t("s2.d2"), t("s2.d3"), t("s2.d4"), t("s2.d5"), t("s2.d6")],
        },
        {
            title: t("s3.title"),
            items: [t("s3.d1"), t("s3.d2")],
            highlight: t("s3.highlight"),
        },
        {
            title: t("s4.title"),
            items: [t("s4.d1"), t("s4.d2"), t("s4.d3")],
        },
        {
            title: t("s5.title"),
            subtitle: t("s5.subtitle"),
            items: [t("s5.d1"), t("s5.d2"), t("s5.d3"), t("s5.d4")],
        },
        {
            title: t("s6.title"),
            items: [t("s6.d1")],
        },
        {
            title: t("s7.title"),
            subtitle: t("s7.subtitle"),
            items: [t("s7.d1"), t("s7.d2"), t("s7.d3")],
            ordered: true,
        },
    ];

    return (
        <div className={cn("flex flex-col gap-6", className)}>
            {sections.map((section, idx) => (
                <div
                    key={idx}
                    className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-2xl p-6 shadow-sm"
                >
                    <h3 className="text-xl font-bold mb-4 text-[hsl(var(--foreground))]">
                        {section.title}
                    </h3>

                    {section.subtitle && (
                        <p className="text-[hsl(var(--foreground)/0.9)] mb-3 font-medium">
                            {section.subtitle}
                        </p>
                    )}

                    <ul className={cn(
                        "space-y-2 pl-5",
                        section.ordered ? "list-decimal" : "list-disc"
                    )}>
                        {section.items.map((item, idy) => (
                            <li key={idy} className="text-[hsl(var(--muted-foreground))] leading-relaxed">
                                {item}
                            </li>
                        ))}
                    </ul>

                    {section.note && (
                        <div className="mt-4 p-4 rounded-xl bg-[hsl(var(--primary)/0.05)] border-l-4 border-[hsl(var(--primary))] italic text-sm text-[hsl(var(--muted-foreground))]">
                            {section.note}
                        </div>
                    )}

                    {section.highlight && (
                        <p className="mt-4 font-bold text-[hsl(var(--primary))]">
                            {section.highlight}
                        </p>
                    )}
                </div>
            ))}
        </div>
    );
}
