"use client";

import { useState, useEffect, useCallback } from "react";
import type { User } from "@/types";
import { createClient, createLoginClient } from "@/lib/supabase/client";

export function useAuth() {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        const fetchUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
                // Fetch additional profile data if needed, or just construct from metadata
                setUser({
                    id: session.user.id,
                    firstName: session.user.user_metadata?.first_name || session.user.email?.split("@")[0] || "",
                    lastName: session.user.user_metadata?.last_name || "",
                    email: session.user.email || "",
                    locale: "az", // Can be fetched from preferences
                    theme: "system",
                });
            } else {
                setUser(null);
            }
            setIsLoading(false);
        };

        fetchUser();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session?.user) {
                setUser({
                    id: session.user.id,
                    firstName: session.user.user_metadata?.first_name || session.user.email?.split("@")[0] || "",
                    lastName: session.user.user_metadata?.last_name || "",
                    email: session.user.email || "",
                    locale: "az",
                    theme: "system",
                });
            } else {
                setUser(null);
            }
        });

        return () => subscription.unsubscribe();
    }, [supabase]);

    const login = useCallback(
        async (email: string, password: string, rememberMe: boolean = true, captchaToken?: string): Promise<boolean> => {
            const loginClient = createLoginClient(rememberMe);
            const { error } = await loginClient.auth.signInWithPassword({
                email,
                password,
                options: captchaToken ? { captchaToken } : undefined,
            });

            if (error) {
                console.error("Login failed:", error.message);
                return false;
            }

            // Refresh the main client's session state after a successful login
            await supabase.auth.getSession();
            return true;
        },
        [supabase],
    );

    const register = useCallback(
        async (data: {
            firstName: string;
            lastName: string;
            email: string;
            password: string;
            captchaToken?: string;
        }): Promise<boolean> => {
            const { error } = await supabase.auth.signUp({
                email: data.email,
                password: data.password,
                options: {
                    data: {
                        first_name: data.firstName,
                        last_name: data.lastName,
                    },
                    ...(data.captchaToken ? { captchaToken: data.captchaToken } : {}),
                }
            });

            if (error) {
                console.error("Registration failed:", error.message);
                throw error;
            }

            return true;
        },
        [supabase],
    );

    const logout = useCallback(async () => {
        await supabase.auth.signOut();
    }, [supabase]);

    const updateProfile = useCallback(
        (updates: Partial<User>) => {
            // To be implemented completely later with Supabase UPDATE on profiles 
            // and user_metadata
            if (user) {
                const updated = { ...user, ...updates };
                setUser(updated);
            }
        },
        [user],
    );

    const resetPassword = useCallback(
        async (email: string, captchaToken?: string, locale?: string): Promise<boolean> => {
            const loc = locale || "az";
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/${loc}/update-password`,
                captchaToken,
            });

            if (error) {
                console.error("Password reset failed:", error.message);
                return false;
            }

            return true;
        },
        [supabase],
    );

    const updatePassword = useCallback(
        async (newPassword: string): Promise<boolean> => {
            const { error } = await supabase.auth.updateUser({
                password: newPassword,
            });

            if (error) {
                console.error("Password update failed:", error.message);
                return false;
            }

            return true;
        },
        [supabase],
    );

    return { user, isLoading, login, register, logout, updateProfile, resetPassword, updatePassword };
}
