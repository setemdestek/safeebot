"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import type { ChatMessage, ChatSession } from "@/types";
import { WEBHOOK_URL, CHAT_TIMEOUT_MS } from "@/lib/constants";
import { createClient } from "@/lib/supabase/client";

export function useChat() {
    const [sessions, setSessions] = useState<ChatSession[]>([]);
    const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isMessageSending, setIsMessageSending] = useState(false);
    const abortRef = useRef<AbortController | null>(null);
    const supabase = createClient();

    // Söhbətləri Supabase-dən yükləmək
    const loadSessions = useCallback(async () => {
        setIsLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            setIsLoading(false);
            return;
        }

        // Sessions fetch
        const { data: sessionData, error: sessionErr } = await supabase
            .from("chat_sessions")
            .select("*")
            .order("updated_at", { ascending: false });

        if (!sessionErr && sessionData) {
            // Fetch messages for these sessions
            // DİQQƏT: çox böyük verilənlərdə ayrı-ayrı fetch daha yaxşı ola bilər. Burada sadəlik üçün bütöv edirik
            const { data: msgData, error: msgErr } = await supabase
                .from("chat_messages")
                .select("*")
                .order("created_at", { ascending: true });

            const formattedSessions: ChatSession[] = sessionData.map((s) => {
                const sessionMessages = (msgData || [])
                    .filter((m) => m.session_id === s.id)
                    .map((m) => ({
                        id: m.id,
                        role: m.role as "user" | "bot",
                        content: m.content,
                        timestamp: new Date(m.created_at).getTime(),
                    }));

                return {
                    id: s.id,
                    title: s.title,
                    messages: sessionMessages,
                    createdAt: new Date(s.created_at).getTime(),
                    updatedAt: new Date(s.updated_at).getTime(),
                };
            });

            setSessions(formattedSessions);
            if (formattedSessions.length > 0 && !activeSessionId) {
                setActiveSessionId(formattedSessions[0].id);
            }
        }
        setIsLoading(false);
    }, [supabase, activeSessionId]);

    useEffect(() => {
        loadSessions();
    }, [loadSessions]);

    const activeSession = sessions.find((s) => s.id === activeSessionId) || null;
    const messages = activeSession?.messages || [];

    const updateSessionLocally = useCallback(
        (sessionId: string, updater: (s: ChatSession) => ChatSession) => {
            setSessions((prev) => prev.map((s) => (s.id === sessionId ? updater(s) : s)));
        },
        [],
    );

    const createNewChat = useCallback(async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return null;

        const { data, error } = await supabase
            .from("chat_sessions")
            .insert({ user_id: user.id, title: "__new_chat__" })
            .select()
            .single();

        if (error || !data) {
            console.error("Yeni söhbət yaradılarkən xəta:", error);
            return null;
        }

        const newSession: ChatSession = {
            id: data.id,
            title: data.title,
            messages: [],
            createdAt: new Date(data.created_at).getTime(),
            updatedAt: new Date(data.updated_at).getTime(),
        };

        setSessions((prev) => [newSession, ...prev]);
        setActiveSessionId(newSession.id);
        return newSession.id;
    }, [supabase]);

    const deleteSession = useCallback(
        async (sessionId: string) => {
            // Optimistic update
            setSessions((prev) => prev.filter((s) => s.id !== sessionId));
            if (activeSessionId === sessionId) {
                setSessions((prev) => {
                    setActiveSessionId(prev.length > 0 ? prev[0].id : null);
                    return prev;
                });
            }

            const { error } = await supabase
                .from("chat_sessions")
                .delete()
                .eq("id", sessionId);

            if (error) {
                console.error("Söhbəti silərkən xəta:", error);
                loadSessions(); // rollback
            }
        },
        [activeSessionId, supabase, loadSessions],
    );

    const renameSession = useCallback(
        async (sessionId: string, newTitle: string) => {
            const trimmed = newTitle.trim();
            if (!trimmed) return;

            updateSessionLocally(sessionId, (s) => ({ ...s, title: trimmed }));

            const { error } = await supabase
                .from("chat_sessions")
                .update({ title: trimmed })
                .eq("id", sessionId);

            if (error) {
                console.error("Söhbətin adını dəyişərkən xəta:", error);
                loadSessions();
            }
        },
        [supabase, updateSessionLocally, loadSessions],
    );

    const clearMessages = useCallback(async () => {
        if (!activeSessionId) return;

        // Optimistic
        updateSessionLocally(activeSessionId, (s) => ({
            ...s,
            messages: [],
            updatedAt: Date.now(),
        }));

        const { error } = await supabase
            .from("chat_messages")
            .delete()
            .eq("session_id", activeSessionId);

        if (error) {
            console.error("Mesajları təmizləyərkən xəta:", error);
            loadSessions(); // rollback
        }
    }, [activeSessionId, updateSessionLocally, supabase, loadSessions]);

    const sendMessage = useCallback(
        async (content: string, errorMessages: { network: string; timeout: string }) => {
            if (!content.trim() || isMessageSending) return;

            let sessionId = activeSessionId;
            if (!sessionId) {
                sessionId = await createNewChat();
                if (!sessionId) return;
            }

            // Mətni bazaya göndər
            // Temp UUID for UI before db response
            const tempUserId = "temp_" + Date.now();
            const tempUserMsg: ChatMessage = {
                id: tempUserId,
                role: "user",
                content: content.trim(),
                timestamp: Date.now(),
            };

            // Əvvəlcə Local olaraq UI-da göstər
            updateSessionLocally(sessionId, (s) => {
                const isFirst = s.messages.length === 0;
                return {
                    ...s,
                    messages: [...s.messages, tempUserMsg],
                    title: isFirst ? content.trim().slice(0, 40) : s.title,
                    updatedAt: Date.now(),
                };
            });

            setIsMessageSending(true);

            // Supabase-ə user mesajını daxil et
            const { data: dbUserMsg, error: insertErr } = await supabase
                .from("chat_messages")
                .insert({
                    session_id: sessionId,
                    role: "user",
                    content: content.trim(),
                })
                .select()
                .single();

            if (insertErr) {
                console.error("User mesajını yadda saxlayarkən xəta:", insertErr);
                // Geri qaytarmaq optional ola bilər, limit bitdi fərz edək
            }

            // Gözləyən id-ni real id ilə əvəzlə
            if (dbUserMsg) {
                updateSessionLocally(sessionId, (s) => ({
                    ...s,
                    messages: s.messages.map(m => m.id === tempUserId ? { ...m, id: dbUserMsg.id } : m),
                }));
            }

            try {
                abortRef.current = new AbortController();
                const timeoutId = setTimeout(
                    () => abortRef.current?.abort(),
                    CHAT_TIMEOUT_MS,
                );

                const response = await fetch("/api/chat", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        chatInput: content.trim(),
                        sessionId: sessionId,
                    }),
                    signal: abortRef.current.signal,
                });

                clearTimeout(timeoutId);

                if (!response.ok) throw new Error("Network error");

                const data = await response.json();

                // '/api/chat' özü artıq bot mesajını bazaya yazıb qaytarır (`data.dbMessage`).
                const botMsgData = data.dbMessage;

                if (botMsgData) {
                    const finalBotMsg: ChatMessage = {
                        id: botMsgData.id,
                        role: "bot",
                        content: botMsgData.content,
                        timestamp: new Date(botMsgData.created_at).getTime(),
                    };

                    updateSessionLocally(sessionId, (s) => ({
                        ...s,
                        messages: [...s.messages, finalBotMsg],
                        updatedAt: Date.now(),
                    }));
                } else { // Fallback, eger dbMessage API-dan islemeye qayitmazsa
                    const botContent = data.output || data.text || "...";
                    const fallbackBotMsg: ChatMessage = {
                        id: "temp_bot_" + Date.now(),
                        role: "bot",
                        content: botContent,
                        timestamp: Date.now()
                    };
                    updateSessionLocally(sessionId, (s) => ({
                        ...s,
                        messages: [...s.messages, fallbackBotMsg],
                        updatedAt: Date.now(),
                    }));
                }

            } catch (err: unknown) {
                const isAbort = err instanceof DOMException && err.name === "AbortError";
                // Xəta halında "Sistem xəta mesajını" real API-yə yazmırıq (söhbəti çirkləndirmir), yalnız UI-da göstəririk
                const errorBotMsg: ChatMessage = {
                    id: "error_" + Date.now(),
                    role: "bot",
                    content: isAbort ? errorMessages.timeout : errorMessages.network,
                    timestamp: Date.now(),
                };

                updateSessionLocally(sessionId, (s) => ({
                    ...s,
                    messages: [...s.messages, errorBotMsg],
                    updatedAt: Date.now(),
                }));
            } finally {
                setIsMessageSending(false);
            }
        },
        [activeSessionId, isMessageSending, createNewChat, updateSessionLocally, supabase],
    );

    return {
        sessions,
        activeSession,
        activeSessionId,
        messages,
        isLoading,
        isMessageSending,
        setActiveSessionId,
        createNewChat,
        deleteSession,
        renameSession,
        clearMessages,
        sendMessage,
    };
}
