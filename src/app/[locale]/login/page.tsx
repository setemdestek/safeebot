"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { Logo, LogoWithText } from "@/components/common/Logo";
import { SplineScene } from "@/components/ui/splite";
import { Spotlight } from "@/components/ui/spotlight";

import Image from "next/image";
import { useMediaQuery } from "@/hooks/use-media-query";

function LoginForm() {
    const t = useTranslations("auth");
    const locale = useLocale();
    const router = useRouter();
    const { login } = useAuth();
    const isDesktop = useMediaQuery("(min-width: 1024px)");

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!email || !password) {
            setError(t("fieldRequired"));
            return;
        }

        setLoading(true);
        try {
            const success = await login(email, password, rememberMe);
            if (success) {
                router.push(`/${locale}/dashboard/chat`);
            } else {
                setError(t("emailInvalid"));
            }
        } catch {
            setError(t("emailInvalid"));
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
                            SafeBot
                        </h1>
                        <p className="mt-4 text-neutral-300 max-w-lg text-lg leading-relaxed">
                            Təhlükəsiz Gələcək, Bu Gündən Başlayır
                        </p>
                    </div>
                </div>
            </div>
            {/* Mobile Gradient Header */}
            <div className="lg:hidden w-full bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--primary)/0.7)] rounded-b-[2.5rem] p-10 flex flex-col items-center justify-center relative shadow-2xl overflow-hidden mb-8 z-10">
                {/* Decorative elements */}
                <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-white/5 blur-3xl pointer-events-none" />
                <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/5 blur-2xl pointer-events-none" />

                <div className="w-20 h-20 rounded-[1.25rem] bg-white/10 backdrop-blur-md flex items-center justify-center mb-5 border border-white/20 shadow-xl relative z-10 transition-transform hover:scale-105 duration-500">
                    <Logo width={54} height={54} />
                </div>
                <h2 className="text-3xl font-bold text-white tracking-tight drop-shadow-lg relative z-10">SafeBot</h2>
                <p className="text-white/80 text-sm mt-3 text-center max-w-[250px] leading-relaxed relative z-10 font-medium">
                    Təhlükəsiz Gələcək, Bu Gündən Başlayır
                </p>
            </div>

            {/* Right — Form */}
            <div className="flex-1 flex flex-col items-center justify-center px-6 lg:p-8 pb-12 w-full lg:w-1/2 z-20 relative">
                {/* Floating Back Button */}
                <Link
                    href={`/${locale}`}
                    className="absolute left-6 top-6 lg:left-10 lg:top-10 flex items-center gap-2 text-sm font-medium text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] bg-[hsl(var(--muted)/0.3)] hover:bg-[hsl(var(--muted)/0.5)] px-4 py-2 rounded-full transition-all duration-300"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Ana səhifə
                </Link>
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
                    className="w-full max-w-md"
                >


                    <h1 className="text-3xl font-bold mb-2 tracking-tight">{t("loginTitle")}</h1>
                    <p className="text-[hsl(var(--muted-foreground))] mb-8 leading-relaxed">
                        {t("loginSubtitle")}
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Email */}
                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-medium">{t("email")}</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(var(--muted-foreground))]" />
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="email@nümunə.az"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label htmlFor="password" className="text-sm font-medium">{t("password")}</label>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(var(--muted-foreground))]" />
                                <Input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="pl-10 pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
                                    aria-label="Toggle password visibility"
                                >
                                    {showPassword ? (
                                        <EyeOff className="w-4 h-4" />
                                    ) : (
                                        <Eye className="w-4 h-4" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Remember Me & Forgot Password */}
                        <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="remember"
                                    checked={rememberMe}
                                    onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                                />
                                <label
                                    htmlFor="remember"
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-[hsl(var(--muted-foreground))] cursor-pointer select-none"
                                >
                                    Məni xatırla
                                </label>
                            </div>
                            <Link
                                href={`/${locale}/forgot-password`}
                                className="text-sm font-medium text-[hsl(var(--primary))] hover:underline"
                            >
                                {t("forgotPassword")}
                            </Link>
                        </div>

                        {/* Error */}
                        {error && (
                            <p className="text-sm text-[hsl(var(--destructive))]">{error}</p>
                        )}

                        {/* Submit */}
                        <Button type="submit" className="w-full" size="lg" disabled={loading}>
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    {t("loginTitle")}...
                                </span>
                            ) : (
                                t("loginNow")
                            )}
                        </Button>
                    </form>

                    {/* Register link */}
                    <p className="text-center text-sm text-[hsl(var(--muted-foreground))] mt-6">
                        {t("noAccount")}{" "}
                        <Link
                            href={`/${locale}/register`}
                            className="text-[hsl(var(--primary))] font-medium hover:underline"
                        >
                            {t("registerNow")}
                        </Link>
                    </p>
                </motion.div>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <LoginForm />
    );
}
