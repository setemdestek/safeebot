"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { UserPlus, MessageCircleQuestion, Brain, CheckCircle, ShieldAlert, FileText, BarChart3, Mail } from "lucide-react";

const stagger = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.2 } },
};

const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export function HowItWorks() {
    const t = useTranslations("howItWorks");

    const steps = [
        {
            icon: UserPlus,
            title: t("step1Title"),
            desc: t("step1Desc"),
            color: "hsl(var(--primary))",
        },
        {
            icon: MessageCircleQuestion,
            title: t("step2Title"),
            desc: t("step2Desc"),
            color: "hsl(var(--chart-3))",
        },
        {
            icon: Brain,
            title: t("step3Title"),
            desc: t("step3Desc"),
            color: "hsl(var(--chart-4))",
        },
        {
            icon: CheckCircle,
            title: t("step4Title"),
            desc: t("step4Desc"),
            color: "hsl(var(--chart-2))",
        },
        {
            icon: ShieldAlert,
            title: t("step5Title"),
            desc: t("step5Desc"),
            color: "hsl(var(--chart-5))",
        },
        {
            icon: FileText,
            title: t("step6Title"),
            desc: t("step6Desc"),
            color: "hsl(var(--chart-1))",
        },
        {
            icon: BarChart3,
            title: t("step7Title"),
            desc: t("step7Desc"),
            color: "hsl(var(--chart-3))",
        },
        {
            icon: Mail,
            title: t("step8Title"),
            desc: t("step8Desc"),
            color: "hsl(var(--chart-4))",
        },
    ];

    return (
        <section id="how-it-works" className="py-20 bg-[hsl(var(--card)/0.5)]">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-2xl sm:text-3xl font-bold text-center mb-14"
                >
                    {t("title")}
                </motion.h2>

                <motion.div
                    variants={stagger}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
                >
                    {steps.map((step, i) => (
                        <motion.div
                            key={i}
                            variants={fadeUp}
                            className="relative flex flex-col items-center text-center p-6 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] hover:shadow-lg transition-shadow duration-300"
                        >
                            {/* Step number */}
                            <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] flex items-center justify-center text-sm font-bold">
                                {i + 1}
                            </div>

                            {/* Icon */}
                            <div
                                className="w-14 h-14 rounded-xl flex items-center justify-center mb-5"
                                style={{ backgroundColor: `${step.color}15` }}
                            >
                                <step.icon className="w-7 h-7" style={{ color: step.color }} />
                            </div>

                            <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                            <p className="text-sm text-[hsl(var(--muted-foreground))] leading-relaxed">
                                {step.desc}
                            </p>

                            {i % 4 !== 3 && (
                                <div className="hidden lg:block absolute top-[40%] -right-4 w-8 border-t border-dashed border-[hsl(var(--border))]" />
                            )}
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
