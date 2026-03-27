"use client";

import { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import {
    User,
    Lock,
    Palette,
    Trash2,
    ArrowLeft,
    Check,
    Eye,
    EyeOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import { UserAvatar } from "@/components/common/UserAvatar";
import { Logo } from "@/components/common/Logo";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
    const t = useTranslations("settings");
    const tc = useTranslations("common");
    const locale = useLocale();
    const router = useRouter();
    const { user, logout, changePassword } = useAuth();

    const [activeTab, setActiveTab] = useState("profile");
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [profileForm, setProfileForm] = useState({
        firstName: user?.firstName || "",
        lastName: user?.lastName || "",
        email: user?.email || "",
    });
    const [passwordForm, setPasswordForm] = useState({
        current: "",
        newPass: "",
        confirm: "",
    });
    const [saved, setSaved] = useState(false);
    const [passwordError, setPasswordError] = useState("");
    const [passwordLoading, setPasswordLoading] = useState(false);
    const [showCurrentPass, setShowCurrentPass] = useState(false);
    const [showNewPass, setShowNewPass] = useState(false);
    const [showConfirmPass, setShowConfirmPass] = useState(false);

    // Sync user data to form when it is loaded
    useEffect(() => {
        if (user) {
            setProfileForm({
                firstName: user.firstName || "",
                lastName: user.lastName || "",
                email: user.email || "",
            });
        }
    }, [user]);

    const tabs = [
        { id: "profile", label: t("profile"), icon: User },
        { id: "security", label: t("security"), icon: Lock },
        { id: "preferences", label: t("preferences"), icon: Palette },
    ];

    const handleChangePassword = async () => {
        setPasswordError("");

        if (!passwordForm.current || !passwordForm.newPass || !passwordForm.confirm) {
            setPasswordError(t("fillAllFields"));
            return;
        }
        if (passwordForm.newPass !== passwordForm.confirm) {
            setPasswordError(t("passwordMismatch"));
            return;
        }

        setPasswordLoading(true);
        try {
            const result = await changePassword(passwordForm.current, passwordForm.newPass);
            if (result.success) {
                setSaved(true);
                setTimeout(() => setSaved(false), 2000);
                setPasswordForm({ current: "", newPass: "", confirm: "" });
            } else if (result.error === "wrong_password") {
                setPasswordError(t("currentPasswordWrong"));
            } else {
                setPasswordError(t("passwordChangeError"));
            }
        } catch {
            setPasswordError(t("passwordChangeError"));
        } finally {
            setPasswordLoading(false);
        }
    };

    const handleDeleteAccount = () => {
        logout();
        router.push(`/${locale}/login`);
    };

    const handleLanguageChange = (newLocale: string) => {
        const segments = window.location.pathname.split("/");
        segments[1] = newLocale;
        localStorage.setItem("safeebot_locale", newLocale);
        router.push(segments.join("/"));
    };

    return (
        <div className="min-h-screen bg-[hsl(var(--background))]">
            {/* Header */}
            <div className="border-b border-[hsl(var(--border))] bg-[hsl(var(--background))]">
                <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-3">
                    <button
                        onClick={() => router.push(`/${locale}/dashboard/chat`)}
                        className="p-2 rounded-[var(--radius)] hover:bg-[hsl(var(--accent))] transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <Logo width={20} height={20} className="w-5 h-5" />
                    <h1 className="text-lg font-semibold">{t("title")}</h1>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row gap-6">
                    {/* Tab nav */}
                    <div className="md:w-56 shrink-0 space-y-1">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={cn(
                                    "w-full flex items-center gap-3 px-4 py-2.5 rounded-[var(--radius)] text-sm font-medium transition-colors",
                                    activeTab === tab.id
                                        ? "bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]"
                                        : "hover:bg-[hsl(var(--accent))] text-[hsl(var(--foreground))]",
                                )}
                            >
                                <tab.icon className="w-4 h-4" />
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Content */}
                    <div className="flex-1 space-y-6">
                        {/* Profile */}
                        {activeTab === "profile" && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>{t("profile")}</CardTitle>
                                    <CardDescription>
                                        {tc("appName")} — profil məlumatları
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="flex flex-col sm:flex-row items-center gap-6 pb-2">
                                        <UserAvatar
                                            id={user?.id}
                                            alt={profileForm.firstName}
                                            className="w-24 h-24 text-3xl shadow-md bg-[hsl(var(--muted))]"
                                        />
                                        <div className="flex flex-col items-center sm:items-start gap-1">
                                            <p className="text-sm font-medium">Profil İkonu</p>
                                            <p className="text-xs text-muted-foreground text-center sm:text-left max-w-[200px]">
                                                Platforma tərəfindən sizə təyin olunmuş unikal süni intellekt avatarınız.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">
                                                {tc("appName") === "SafeeBot" ? "Ad" : "Name"}
                                            </label>
                                            <Input
                                                value={profileForm.firstName}
                                                disabled
                                                className="bg-[hsl(var(--muted))] cursor-not-allowed text-[hsl(var(--muted-foreground))]"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">
                                                {tc("appName") === "SafeeBot" ? "Soyad" : "Last Name"}
                                            </label>
                                            <Input
                                                value={profileForm.lastName}
                                                disabled
                                                className="bg-[hsl(var(--muted))] cursor-not-allowed text-[hsl(var(--muted-foreground))]"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">E-poçt</label>
                                        <Input
                                            type="email"
                                            value={profileForm.email}
                                            disabled
                                            className="bg-[hsl(var(--muted))] cursor-not-allowed text-[hsl(var(--muted-foreground))]"
                                        />
                                        <p className="text-xs text-[hsl(var(--muted-foreground))]">E-poçt ünvanınızı dəyişdirə bilməzsiniz.</p>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Security */}
                        {activeTab === "security" && (
                            <>
                                <Card>
                                    <CardHeader>
                                        <CardTitle>{t("changePassword")}</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">
                                                {t("currentPassword")}
                                            </label>
                                            <div className="relative">
                                                <Input
                                                    type={showCurrentPass ? "text" : "password"}
                                                    value={passwordForm.current}
                                                    onChange={(e) =>
                                                        setPasswordForm((p) => ({
                                                            ...p,
                                                            current: e.target.value,
                                                        }))
                                                    }
                                                    className="pr-10"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowCurrentPass(!showCurrentPass)}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors"
                                                >
                                                    {showCurrentPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                </button>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">
                                                {t("newPassword")}
                                            </label>
                                            <div className="relative">
                                                <Input
                                                    type={showNewPass ? "text" : "password"}
                                                    value={passwordForm.newPass}
                                                    onChange={(e) =>
                                                        setPasswordForm((p) => ({
                                                            ...p,
                                                            newPass: e.target.value,
                                                        }))
                                                    }
                                                    className="pr-10"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowNewPass(!showNewPass)}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors"
                                                >
                                                    {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                </button>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">
                                                {t("confirmNewPassword")}
                                            </label>
                                            <div className="relative">
                                                <Input
                                                    type={showConfirmPass ? "text" : "password"}
                                                    value={passwordForm.confirm}
                                                    onChange={(e) =>
                                                        setPasswordForm((p) => ({
                                                            ...p,
                                                            confirm: e.target.value,
                                                        }))
                                                    }
                                                    className="pr-10"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowConfirmPass(!showConfirmPass)}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors"
                                                >
                                                    {showConfirmPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                </button>
                                            </div>
                                        </div>
                                        {passwordError && (
                                            <p className="text-sm text-[hsl(var(--destructive))]">{passwordError}</p>
                                        )}
                                        <Button onClick={handleChangePassword} disabled={passwordLoading}>
                                            {passwordLoading ? (
                                                <span className="flex items-center gap-2">
                                                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                    {t("changePassword")}...
                                                </span>
                                            ) : saved ? (
                                                <span className="flex items-center gap-1">
                                                    <Check className="w-4 h-4" /> {t("passwordChanged")}
                                                </span>
                                            ) : (
                                                t("changePassword")
                                            )}
                                        </Button>
                                    </CardContent>
                                </Card>

                                {/* Delete Account */}
                                <Card className="border-[hsl(var(--destructive)/0.3)]">
                                    <CardHeader>
                                        <CardTitle className="text-[hsl(var(--destructive))]">
                                            {t("deleteAccount")}
                                        </CardTitle>
                                        <CardDescription>
                                            {t("deleteAccountWarning")}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <Button
                                            variant="destructive"
                                            onClick={() => setShowDeleteModal(true)}
                                        >
                                            <Trash2 className="w-4 h-4 mr-1" />
                                            {t("deleteAccount")}
                                        </Button>
                                    </CardContent>
                                </Card>
                            </>
                        )}

                        {/* Preferences */}
                        {activeTab === "preferences" && (
                            <>
                                <Card>
                                    <CardHeader>
                                        <CardTitle>{t("selectLanguage")}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex gap-2">
                                            {[
                                                { code: "az", label: "Azərbaycan", flag: "🇦🇿" },
                                                { code: "en", label: "English", flag: "🇬🇧" },
                                                { code: "ru", label: "Русский", flag: "🇷🇺" },
                                            ].map((l) => (
                                                <button
                                                    key={l.code}
                                                    onClick={() => handleLanguageChange(l.code)}
                                                    className={cn(
                                                        "flex items-center gap-2 px-4 py-3 rounded-[var(--radius)] border transition-all duration-200",
                                                        locale === l.code
                                                            ? "border-[hsl(var(--primary))] bg-[hsl(var(--primary)/0.05)]"
                                                            : "border-[hsl(var(--border))] hover:border-[hsl(var(--primary)/0.3)]",
                                                    )}
                                                >
                                                    <span className="text-lg">{l.flag}</span>
                                                    <span className="text-sm font-medium">{l.label}</span>
                                                    {locale === l.code && (
                                                        <Check className="w-4 h-4 text-[hsl(var(--primary))]" />
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>{t("selectTheme")}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <ThemeToggle />
                                    </CardContent>
                                </Card>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Delete confirm modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-[hsl(var(--background))] border border-[hsl(var(--border))] rounded-xl p-6 max-w-sm mx-4 shadow-2xl">
                        <h3 className="text-lg font-semibold mb-2">
                            {t("deleteAccountConfirm")}
                        </h3>
                        <p className="text-sm text-[hsl(var(--muted-foreground))] mb-6">
                            {t("deleteAccountWarning")}
                        </p>
                        <div className="flex gap-3 justify-end">
                            <Button
                                variant="outline"
                                onClick={() => setShowDeleteModal(false)}
                            >
                                {tc("cancel")}
                            </Button>
                            <Button variant="destructive" onClick={handleDeleteAccount}>
                                {t("deleteAccount")}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
