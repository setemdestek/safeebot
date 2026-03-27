"use client";

import { useRef, useCallback, useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Turnstile } from "@marsidev/react-turnstile";
import type { TurnstileInstance } from "@marsidev/react-turnstile";

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

interface TurnstileWidgetProps {
    onVerify: (token: string | null) => void;
    resetKey?: number;
}

export function TurnstileWidget({ onVerify, resetKey = 0 }: TurnstileWidgetProps) {
    const t = useTranslations("auth");
    const ref = useRef<TurnstileInstance>(null);
    const [hasFailed, setHasFailed] = useState(false);

    // Auto-reset when parent increments resetKey
    useEffect(() => {
        if (resetKey > 0) {
            setHasFailed(false);
            ref.current?.reset();
        }
    }, [resetKey]);

    const handleSuccess = useCallback(
        (token: string) => {
            setHasFailed(false);
            onVerify(token);
        },
        [onVerify],
    );

    const handleError = useCallback(() => {
        setHasFailed(true);
        onVerify(null);
    }, [onVerify]);

    const handleExpire = useCallback(() => {
        onVerify(null);
    }, [onVerify]);

    const handleRetry = () => {
        setHasFailed(false);
        ref.current?.reset();
    };

    if (!SITE_KEY) {
        return (
            <p className="text-xs text-[hsl(var(--destructive))] text-center">
                {t("captchaNotConfigured")}
            </p>
        );
    }

    return (
        <div className="flex flex-col items-center gap-2">
            <Turnstile
                ref={ref}
                siteKey={SITE_KEY}
                onSuccess={handleSuccess}
                onError={handleError}
                onExpire={handleExpire}
                options={{
                    theme: "auto",
                    size: "flexible",
                }}
            />
            {hasFailed && (
                <button
                    type="button"
                    onClick={handleRetry}
                    className="text-xs text-[hsl(var(--primary))] hover:underline"
                >
                    {t("captchaRetry")}
                </button>
            )}
        </div>
    );
}
