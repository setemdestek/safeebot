"use client";

import { useState, useMemo } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, User, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/common/Logo";
import { TurnstileWidget } from "@/components/auth/TurnstileWidget";
import { SplineScene } from "@/components/ui/splite";
import { Spotlight } from "@/components/ui/spotlight";

import { Checkbox } from "@/components/ui/checkbox";
import { useMediaQuery } from "@/hooks/use-media-query";

function getPasswordStrength(pass: string): number {
    let score = 0;
    if (pass.length >= 6) score++;
    if (pass.length >= 10) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    return Math.min(score, 5);
}

function validatePassword(pass: string): string[] {
    const errors: string[] = [];
    if (pass.length < 10) errors.push("Parol ən az 10 simvol olmalıdır");
    if (!/[A-Z]/.test(pass)) errors.push("Ən az 1 böyük hərf (A-Z) olmalıdır");
    if (!/[a-z]/.test(pass)) errors.push("Ən az 1 kiçik hərf (a-z) olmalıdır");
    if (!/[0-9]/.test(pass)) errors.push("Ən az 1 rəqəm (0-9) olmalıdır");
    if (!/[@$!%*?&]/.test(pass)) errors.push("Ən az 1 xüsusi simvol olmalıdır (@$!%*?&)");
    return errors;
}

function RegisterForm() {
    const t = useTranslations("auth");
    const tc = useTranslations("common");
    const locale = useLocale();
    const router = useRouter();
    const { register } = useAuth();
    const isDesktop = useMediaQuery("(min-width: 1024px)");

    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        agreedToTerms: false,
    });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [captchaToken, setCaptchaToken] = useState<string | null>(null);

    const strength = useMemo(
        () => getPasswordStrength(form.password),
        [form.password],
    );
    const passwordErrors = useMemo(
        () => validatePassword(form.password),
        [form.password],
    );
    const strengthLabel = strength <= 1 ? t("passwordWeak") : strength <= 3 ? t("passwordMedium") : strength === 4 ? "Yaxşı" : "Güclü";
    const strengthColor = strength <= 1 ? "bg-red-500" : strength <= 3 ? "bg-amber-500" : strength === 4 ? "bg-blue-500" : "bg-emerald-500";

    const update = (key: string, value: string | boolean) =>
        setForm((prev) => ({ ...prev, [key]: value }));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!form.firstName || !form.email || !form.password) {
            setError(t("fieldRequired"));
            return;
        }
        if (!form.agreedToTerms) {
            setError(t("termsRequired"));
            return;
        }
        if (form.password !== form.confirmPassword) {
            setError(t("passwordMismatch"));
            return;
        }

        const passwordValidationErrors = validatePassword(form.password);
        if (passwordValidationErrors.length > 0) {
            setError(passwordValidationErrors[0]);
            return;
        }
        if (!/\S+@\S+\.\S+/.test(form.email)) {
            setError(t("emailInvalid"));
            return;
        }

        setLoading(true);
        try {
            const success = await register({ ...form, captchaToken: captchaToken ?? undefined });
            if (success) {
                router.push(`/${locale}/dashboard/chat`);
            }
        } catch {
            setError(t("emailInvalid"));
            setCaptchaToken(null);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col lg:flex-row">
            {/* Left — Branding */}
            <div className="hidden lg:flex lg:w-1/2 bg-black/[0.96] relative overflow-hidden">
                <Spotlight
                    className="-top-40 left-0 md:left-60 md:-top-20 pointer-events-none"
                    fill="white"
                />

                {/* Spline Background */}
                <div className="absolute inset-0 w-full h-full z-0">
                    {isDesktop && (
                        <SplineScene
                            scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
                            className="w-full h-full"
                        />
                    )}
                </div>

                {/* Left content Overlay */}
                <div className="relative z-10 w-full h-full flex flex-col justify-center p-12 pointer-events-none">
                    <div className="flex flex-col items-start text-left">
                        <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center mb-6 p-1">
                            <Logo width={60} height={60} />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400">
                            SafeeBot
                        </h1>
                        <p className="mt-4 text-neutral-300 max-w-lg text-lg leading-relaxed">
                            {t("slogan")}
                        </p>
                    </div>
                </div>
            </div>

            {/* Mobile Gradient Header */}
            <div className="lg:hidden w-full bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--primary)/0.7)] rounded-b-[2.5rem] p-6 sm:p-10 flex flex-col items-center justify-center relative shadow-2xl overflow-hidden mb-8 z-10">
                {/* Decorative elements */}
                <div className="absolute -bottom-20 -left-20 w-40 h-40 sm:w-64 sm:h-64 rounded-full bg-white/5 blur-3xl pointer-events-none" />
                <div className="absolute -top-10 -right-10 w-32 h-32 sm:w-48 sm:h-48 rounded-full bg-white/5 blur-2xl pointer-events-none" />

                <div className="w-20 h-20 rounded-[1.25rem] bg-white/10 backdrop-blur-md flex items-center justify-center mb-5 border border-white/20 shadow-xl relative z-10 transition-transform hover:scale-105 duration-500">
                    <Logo width={54} height={54} />
                </div>
                <h2 className="text-3xl font-bold text-white tracking-tight drop-shadow-lg relative z-10">SafeeBot</h2>
                <p className="text-white/80 text-sm mt-3 text-center max-w-[250px] leading-relaxed relative z-10 font-medium">
                    {t("slogan")}
                </p>
            </div>

            {/* Right — Form */}
            <div className="flex-1 flex flex-col items-center px-6 lg:p-8 pb-12 w-full lg:w-1/2 z-20 relative lg:justify-center">
                {/* Back Button */}
                <div className="w-full max-w-md pt-4 mb-4 lg:absolute lg:left-10 lg:top-10 lg:w-auto lg:max-w-none lg:pt-0 lg:mb-0">
                    <Link
                        href={`/${locale}`}
                        className="inline-flex items-center gap-2 text-sm font-medium text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] bg-[hsl(var(--muted)/0.3)] hover:bg-[hsl(var(--muted)/0.5)] px-4 py-2 rounded-full transition-all duration-300"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back
                    </Link>
                </div>
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
                    className="w-full max-w-md"
                >


                    <h1 className="text-3xl font-bold mb-2 tracking-tight">{t("registerTitle")}</h1>
                    <p className="text-[hsl(var(--muted-foreground))] mb-8">
                        {t("registerSubtitle")}
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Name fields */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">{t("firstName")}</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(var(--muted-foreground))]" />
                                    <Input
                                        placeholder={t("firstName")}
                                        value={form.firstName}
                                        onChange={(e) => update("firstName", e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">{t("lastName")}</label>
                                <Input
                                    placeholder={t("lastName")}
                                    value={form.lastName}
                                    onChange={(e) => update("lastName", e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">{t("email")}</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(var(--muted-foreground))]" />
                                <Input
                                    type="email"
                                    placeholder="email@nümunə.az"
                                    value={form.email}
                                    onChange={(e) => update("email", e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">{t("password")}</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(var(--muted-foreground))]" />
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={form.password}
                                    onChange={(e) => update("password", e.target.value)}
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
                            {form.password && (
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
                                                {passwordErrors.length} tələb qarşılanmayıb
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">{t("confirmPassword")}</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(var(--muted-foreground))]" />
                                <Input
                                    type="password"
                                    placeholder="••••••••"
                                    value={form.confirmPassword}
                                    onChange={(e) => update("confirmPassword", e.target.value)}
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
                                    {t("registerTitle")}...
                                </span>
                            ) : (
                                t("registerNow")
                            )}
                        </Button>

                        {/* Checkbox for privacy & consent */}
                        <div className="flex items-start space-x-3 mt-6 p-4 rounded-lg bg-[hsl(var(--primary)/0.03)] border border-[hsl(var(--primary)/0.1)]">
                            <Checkbox
                                id="terms"
                                className="mt-1"
                                checked={form.agreedToTerms}
                                onCheckedChange={(checked) => update("agreedToTerms", checked as boolean)}
                            />
                            <div className="space-y-1 leading-none">
                                <label
                                    htmlFor="terms"
                                    className="text-sm font-medium leading-normal cursor-pointer select-none text-[hsl(var(--muted-foreground))]"
                                >
                                    <Link href={`/${locale}/terms`} target="_blank" className="font-semibold text-[hsl(var(--foreground))] hover:underline">
                                        {t("termsLink")}
                                    </Link>
                                    ,{" "}
                                    <Link href={`/${locale}/privacy`} target="_blank" className="font-semibold text-[hsl(var(--foreground))] hover:underline">
                                        {t("privacyLink")}
                                    </Link>
                                    {" "}{t("and")}{" "}
                                    <Link href={`/${locale}/consent`} target="_blank" className="font-semibold text-[hsl(var(--foreground))] hover:underline">
                                        {t("consentLink")}
                                    </Link>
                                    {t("acceptTermsSuffix")}
                                </label>
                            </div>
                        </div>
                    </form>

                    <p className="text-center text-sm text-[hsl(var(--muted-foreground))] mt-6">
                        {t("hasAccount")}{" "}
                        <Link
                            href={`/${locale}/login`}
                            className="text-[hsl(var(--primary))] font-medium hover:underline"
                        >
                            {t("loginNow")}
                        </Link>
                    </p>
                </motion.div>
            </div>
        </div>
    );
}

export default function RegisterPage() {
    return (
        <RegisterForm />
    );
}

