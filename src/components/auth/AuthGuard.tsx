"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { useAuth } from "@/hooks/useAuth";

export function AuthGuard({ children }: { children: ReactNode }) {
    const { user, isLoading } = useAuth();
    const router = useRouter();
    const locale = useLocale();

    useEffect(() => {
        if (!isLoading && !user) {
            router.push(`/${locale}/login`);
        }
    }, [user, isLoading, router, locale]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-2 border-[hsl(var(--primary))] border-t-transparent rounded-full animate-spin" />
                    <p className="text-sm text-[hsl(var(--muted-foreground))]">
                        Loading...
                    </p>
                </div>
            </div>
        );
    }

    if (!user) return null;

    return <>{children}</>;
}
