"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { Logo } from "@/components/common/Logo";
import { TurnstileWidget } from "@/components/auth/TurnstileWidget";

export default function ForgotPasswordPage() {
    const t = useTranslations("auth");
    const locale = useLocale();
    const { resetPassword } = useAuth();

    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const [captchaToken, setCaptchaToken] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!email) {
            setError(t("fieldRequired"));
            return;
        }
        if (!/\S+@\S+\.\S+/.test(email)) {
            setError(t("emailInvalid"));
            return;
        }

        setLoading(true);
        try {
            const success = await resetPassword(email, captchaToken ?? undefined);
            if (success) {
                setSent(true);
            } else {
                setError(t("forgotPasswordError"));
                setCaptchaToken(null);
            }
        } catch {
            setError(t("forgotPasswordError"));
            setCaptchaToken(null);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center relative">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--primary)/0.05)] to-[hsl(var(--background))] pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="relative z-10 w-full max-w-md px-4 sm:px-6"
            >
                {/* Logo */}
                <div className="flex flex-col items-center mb-10">
                    <div className="w-16 h-16 rounded-2xl bg-[hsl(var(--primary)/0.1)] flex items-center justify-center mb-4">
                        <Logo width={44} height={44} />
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight">SafeeBot</h1>
                </div>

                {/* Card */}
                <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-2xl p-8 shadow-xl">
                    {sent ? (
                        /* Success State */
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center"
                        >
                            <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
                                <CheckCircle className="w-8 h-8 text-emerald-500" />
                            </div>
                            <h2 className="text-xl font-bold mb-2">{t("forgotPasswordSuccess")}</h2>
                            <p className="text-[hsl(var(--muted-foreground))] text-sm mb-6 leading-relaxed">
                                {email}
                            </p>
                            <Link href={`/${locale}/login`}>
                                <Button variant="outline" className="w-full">
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    {t("backToLogin")}
                                </Button>
                            </Link>
                        </motion.div>
                    ) : (
                        /* Form State */
                        <>
                            <h2 className="text-xl font-bold mb-2 tracking-tight">
                                {t("forgotPasswordTitle")}
                            </h2>
                            <p className="text-[hsl(var(--muted-foreground))] text-sm mb-6 leading-relaxed">
                                {t("forgotPasswordSubtitle")}
                            </p>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">{t("email")}</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(var(--muted-foreground))]" />
                                        <Input
                                            type="email"
                                            placeholder={t("emailPlaceholder")}
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="pl-10"
                                        />
                                    </div>
                                </div>

                                {/* Turnstile CAPTCHA */}
                                <TurnstileWidget onVerify={setCaptchaToken} />

                                {error && (
                                    <p className="text-sm text-[hsl(var(--destructive))]">{error}</p>
                                )}

                                <Button type="submit" className="w-full" size="lg" disabled={loading || !captchaToken}>
                                    {loading ? (
                                        <span className="flex items-center gap-2">
                                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            {t("sendResetLink")}...
                                        </span>
                                    ) : (
                                        t("sendResetLink")
                                    )}
                                </Button>
                            </form>

                            <div className="mt-6 text-center">
                                <Link
                                    href={`/${locale}/login`}
                                    className="text-sm text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] inline-flex items-center gap-1 transition-colors"
                                >
                                    <ArrowLeft className="w-3 h-3" />
                                    {t("backToLogin")}
                                </Link>
                            </div>
                        </>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
