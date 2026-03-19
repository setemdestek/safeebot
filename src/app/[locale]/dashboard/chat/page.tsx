"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Menu, Eraser, ShieldCheck, X } from "lucide-react";
import { ChatSidebar } from "@/components/chat/ChatSidebar";
import { ChatArea } from "@/components/chat/ChatArea";
import JSAAnalyzer from "@/components/jsa/JSAAnalyzer";
import { ChatInput } from "@/components/chat/ChatInput";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import { LanguageSelector } from "@/components/common/LanguageSelector";
import { useChat } from "@/hooks/useChat";
import { cn } from "@/lib/utils";

export default function ChatPage() {
    const t = useTranslations("chat");
    const {
        sessions,
        activeSessionId,
        messages,
        isLoading,
        isMessageSending,
        setActiveSessionId,
        createNewChat,
        deleteSession,
        clearMessages,
        sendMessage,
    } = useChat();

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isJsaModalOpen, setIsJsaModalOpen] = useState(false);

    const handleSend = (content: string) => {
        sendMessage(content, {
            network: t("networkError"),
            timeout: t("timeoutError"),
        });
    };

    return (
        <div className="h-screen flex overflow-hidden bg-[hsl(var(--background))]">
            {/* Sidebar */}
            <ChatSidebar
                sessions={sessions}
                activeSessionId={activeSessionId}
                onSelectSession={(id) => {
                    setActiveSessionId(id);
                    setSidebarOpen(false);
                }}
                onNewChat={() => {
                    createNewChat();
                    setSidebarOpen(false);
                }}
                onDeleteSession={deleteSession}
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
                onOpenJsaModal={() => setIsJsaModalOpen(true)}
            />

            {/* Overlay on mobile */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/40 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Main */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Header */}
                <div className="h-14 border-b border-[hsl(var(--border))] flex items-center justify-between px-4 shrink-0">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="md:hidden p-2 rounded-[var(--radius)] hover:bg-[hsl(var(--accent))] transition-colors"
                        >
                            <Menu className="w-5 h-5" />
                        </button>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={clearMessages}
                            className="p-2 ml-1 rounded-[var(--radius)] hover:bg-[hsl(var(--accent))] transition-colors text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
                            title={t("clearChat")}
                        >
                            <Eraser className="w-4 h-4" />
                        </button>
                        <LanguageSelector />
                        <ThemeToggle />
                    </div>
                </div>

                {/* Chat Area */}
                <ChatArea messages={messages} isLoading={isLoading} isMessageSending={isMessageSending} />

                {/* Input */}
                <ChatInput onSend={handleSend} isLoading={isLoading || isMessageSending} />
            </div>

            {/* JSA Analyzer Modal */}
            {isJsaModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 md:p-6 overflow-y-auto">
                    <div className="relative bg-[#F4F7FB] w-full max-w-6xl rounded-2xl shadow-xl overflow-hidden my-auto max-h-[90vh] flex flex-col">
                        <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-white">
                            <h2 className="text-xl font-bold text-[#1F3864] flex items-center gap-2">
                                <ShieldCheck className="w-6 h-6 text-[#1F3864]" />
                                HSE JSA Analizi
                            </h2>
                            <button
                                onClick={() => setIsJsaModalOpen(false)}
                                className="p-2 text-gray-500 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 md:p-8">
                            <JSAAnalyzer />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
