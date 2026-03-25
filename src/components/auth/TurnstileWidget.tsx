"use client";

import { useRef, useCallback, useEffect, useState } from "react";
import { Turnstile } from "@marsidev/react-turnstile";
import type { TurnstileInstance } from "@marsidev/react-turnstile";

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

interface TurnstileWidgetProps {
    onVerify: (token: string | null) => void;
}

export function TurnstileWidget({ onVerify }: TurnstileWidgetProps) {
    const ref = useRef<TurnstileInstance>(null);
    const [hasFailed, setHasFailed] = useState(false);

    // If no site key configured, skip CAPTCHA entirely
    useEffect(() => {
        if (!SITE_KEY) {
            onVerify("__skip__");
        }
    }, [onVerify]);

    const handleSuccess = useCallback(
        (token: string) => {
            setHasFailed(false);
            onVerify(token);
        },
        [onVerify],
    );

    const handleError = useCallback(() => {
        // If CAPTCHA fails, allow the user through — Supabase will validate server-side
        setHasFailed(true);
        onVerify("__skip__");
    }, [onVerify]);

    const handleExpire = useCallback(() => {
        onVerify(null);
    }, [onVerify]);

    if (!SITE_KEY) return null;

    return (
        <div className="flex justify-center">
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
                <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1">
                    CAPTCHA yüklənmədi, davam edə bilərsiniz
                </p>
            )}
        </div>
    );
}

export function resetTurnstile(ref: React.RefObject<TurnstileInstance | null>) {
    ref.current?.reset();
}
