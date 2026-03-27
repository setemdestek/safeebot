"use client";

import { useState, useMemo } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Lock, Eye, EyeOff, CheckCircle, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/common/Logo";

function getPasswordStrength(pass: string): number {
    let score = 0;
    if (pass.length >= 6) score++;
    if (pass.length >= 10) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    return Math.min(score, 5);
}

function validatePassword(pass: string, t: (key: string) => string): string[] {
    const errors: string[] = [];
    if (pass.length < 10) errors.push(t("valMinLength"));
    if (!/[A-Z]/.test(pass)) errors.push(t("valUppercase"));
    if (!/[a-z]/.test(pass)) errors.push(t("valLowercase"));
    if (!/[0-9]/.test(pass)) errors.push(t("valDigit"));
    if (!/[@$!%*?&]/.test(pass)) errors.push(t("valSpecial"));
    return errors;
}

export default function UpdatePasswordPage() {
    const t = useTranslations("auth");
    const locale = useLocale();
    const router = useRouter();
    const searchParams = useSearchParams();
    const { updatePassword } = useAuth();

    const isLinkExpired = searchParams.get("error_code") === "otp_expired" || searchParams.get("error") === "access_denied";

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const strength = useMemo(() => getPasswordStrength(password), [password]);
    const passwordErrors = useMemo(() => validatePassword(password, t), [password, t]);
    const strengthLabel = strength <= 1 ? t("passwordWeak") : strength <= 3 ? t("passwordMedium") : strength === 4 ? t("passwordGood") : t("passwordVeryStrong");
    const strengthColor = strength <= 1 ? "bg-red-500" : strength <= 3 ? "bg-amber-500" : strength === 4 ? "bg-blue-500" : "bg-emerald-500";

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!password || !confirmPassword) {
            setError(t("fieldRequired"));
            return;
        }
        if (password !== confirmPassword) {
            setError(t("passwordMismatch"));
            return;
        }

        const validationErrors = validatePassword(password, t);
        if (validationErrors.length > 0) {
            setError(validationErrors[0]);
            return;
        }

        setLoading(true);
        try {
            const ok = await updatePassword(password);
            if (ok) {
                setSuccess(true);
                setTimeout(() => {
                    router.push(`/${locale}/login`);
                }, 2500);
            } else {
                setError(t("updatePasswordError"));
            }
        } catch {
            setError(t("updatePasswordError"));
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

                {/* Expired Link Warning */}
                {isLinkExpired && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-4 p-4 rounded-xl border border-amber-500/30 bg-amber-500/10 flex items-start gap-3"
                    >
                        <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
                        <div className="space-y-2">
                            <p className="text-sm font-medium text-amber-500">{t("linkExpired")}</p>
                            <Link href={`/${locale}/forgot-password`}>
                                <Button variant="outline" size="sm">{t("requestNewLink")}</Button>
                            </Link>
                        </div>
                    </motion.div>
                )}

                {/* Card */}
                <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-2xl p-8 shadow-xl">
                    {success ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center"
                        >
                            <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
                                <CheckCircle className="w-8 h-8 text-emerald-500" />
                            </div>
                            <h2 className="text-xl font-bold mb-2">{t("updatePasswordSuccess")}</h2>
                            <p className="text-[hsl(var(--muted-foreground))] text-sm">
                                {t("backToLogin")}...
                            </p>
                        </motion.div>
                    ) : (
                        <>
                            <h2 className="text-xl font-bold mb-2 tracking-tight">
                                {t("updatePasswordTitle")}
                            </h2>
                            <p className="text-[hsl(var(--muted-foreground))] text-sm mb-6 leading-relaxed">
                                {t("updatePasswordSubtitle")}
                            </p>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* New Password */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">{t("newPassword")}</label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(var(--muted-foreground))]" />
                                        <Input
                                            type={showPassword ? "text" : "password"}
                                            placeholder="••••••••"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="pl-10 pr-10"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-[hsl(var(--muted-foreground))]"
                                        >
                                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                    {/* Strength bar */}
                                    {password && (
                                        <div className="space-y-1">
                                            <div className="flex gap-1">
                                                {[1, 2, 3, 4, 5].map((i) => (
                                                    <div
                                                        key={i}
                                                        className={cn(
                                                            "h-1 flex-1 rounded-full transition-colors duration-300",
                                                            i <= strength ? strengthColor : "bg-[hsl(var(--muted))]",
                                                        )}
                                                    />
                                                ))}
                                            </div>
                                            <div className="flex justify-between text-xs">
                                                <p className="text-[hsl(var(--muted-foreground))]">
                                                    {strengthLabel}
                                                </p>
                                                {passwordErrors.length > 0 && (
                                                    <p className="text-[hsl(var(--destructive))]">
                                                        {t("requirementsNotMet", { count: passwordErrors.length })}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Confirm New Password */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">{t("confirmNewPassword")}</label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(var(--muted-foreground))]" />
                                        <Input
                                            type="password"
                                            placeholder="••••••••"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className="pl-10"
                                        />
                                    </div>
                                </div>

                                {error && (
                                    <p className="text-sm text-[hsl(var(--destructive))]">{error}</p>
                                )}

                                <Button type="submit" className="w-full" size="lg" disabled={loading}>
                                    {loading ? (
                                        <span className="flex items-center gap-2">
                                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            {t("updatePasswordButton")}...
                                        </span>
                                    ) : (
                                        t("updatePasswordButton")
                                    )}
                                </Button>
                            </form>
                        </>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
