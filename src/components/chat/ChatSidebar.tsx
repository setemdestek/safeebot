"use client";

import { useState, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import {
    Plus,
    MessageSquare,
    Trash2,
    Settings,
    LogOut,
    ChevronLeft,
    Shield,
    FileText,
    Mail,
    Pencil,
    Check,
    X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { WordFadeIn } from "@/components/ui/word-fade-in";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { UserAvatar } from "@/components/common/UserAvatar";
import { Logo } from "@/components/common/Logo";
import type { ChatSession } from "@/types";

interface ChatSidebarProps {
    sessions: ChatSession[];
    activeSessionId: string | null;
    onSelectSession: (id: string) => void;
    onNewChat: () => void;
    onDeleteSession: (id: string) => void;
    onRenameSession?: (id: string, newTitle: string) => void;
    isOpen: boolean;
    onClose: () => void;
    onOpenJsaModal?: () => void;
}

function formatDate(ts: number, t: (key: string) => string): string {
    const now = Date.now();
    const diff = now - ts;
    const day = 86400000;

    if (diff < day) return t("today");
    if (diff < day * 2) return t("yesterday");
    if (diff < day * 7) return t("lastWeek");
    return new Date(ts).toLocaleDateString();
}

function getDisplayTitle(title: string, t: (key: string) => string): string {
    return title === "__new_chat__" ? t("newChat") : title;
}

export function ChatSidebar({
    sessions,
    activeSessionId,
    onSelectSession,
    onNewChat,
    onDeleteSession,
    onRenameSession,
    isOpen,
    onClose,
    onOpenJsaModal,
}: ChatSidebarProps) {
    const t = useTranslations("chat");
    const tc = useTranslations("common");
    const ts = useTranslations("support");
    const locale = useLocale();
    const router = useRouter();
    const { user, logout } = useAuth();

    const [editingId, setEditingId] = useState<string | null>(null);
    const [editValue, setEditValue] = useState("");
    const editInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (editingId && editInputRef.current) {
            editInputRef.current.focus();
            editInputRef.current.select();
        }
    }, [editingId]);

    const startRename = (session: ChatSession) => {
        setEditingId(session.id);
        setEditValue(getDisplayTitle(session.title, t));
    };

    const confirmRename = () => {
        if (editingId && editValue.trim() && onRenameSession) {
            onRenameSession(editingId, editValue.trim());
        }
        setEditingId(null);
    };

    const cancelRename = () => {
        setEditingId(null);
    };

    const handleLogout = () => {
        logout();
        router.push(`/${locale}/login`);
    };

    // Group by date
    const grouped: Record<string, ChatSession[]> = {};
    sessions.forEach((s) => {
        const label = formatDate(s.updatedAt, t);
        if (!grouped[label]) grouped[label] = [];
        grouped[label].push(s);
    });

    return (
        <aside
            className={cn(
                "flex flex-col h-full bg-[hsl(var(--sidebar-background))] border-r border-[hsl(var(--sidebar-border))] transition-all duration-300",
                "w-72 shrink-0",
                "max-md:fixed max-md:inset-y-0 max-md:left-0 max-md:z-50",
                isOpen ? "max-md:translate-x-0" : "max-md:-translate-x-full",
            )}
        >
            {/* Header */}
            <div className="p-4 border-b border-[hsl(var(--sidebar-border))]">
                <div className="flex items-center gap-2 mb-6 mt-2 justify-center">
                    <Logo width={32} height={32} />
                    <WordFadeIn
                        words="SafeeBot"
                        className="text-xl md:text-2xl md:leading-none tracking-normal drop-shadow-none text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))]"
                    />
                </div>
                <div className="flex items-center justify-between mb-3">
                    <h2 className="text-sm font-semibold text-[hsl(var(--sidebar-foreground))]">
                        {t("chatHistory")}
                    </h2>
                    <button
                        onClick={onClose}
                        className="md:hidden p-1 rounded hover:bg-[hsl(var(--sidebar-accent))]"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                </div>
                <Button onClick={onNewChat} className="w-full" size="sm">
                    <Plus className="w-4 h-4 mr-1" />
                    {t("newChat")}
                </Button>
                {onOpenJsaModal && (
                    <Button
                        onClick={() => {
                            onOpenJsaModal();
                            onClose();
                        }}
                        className="w-full mt-2 bg-red-600 hover:bg-red-700 text-white"
                        size="sm"
                    >
                        <Shield className="w-4 h-4 mr-2" />
                        {t("jsaButton")}
                    </Button>
                )}
            </div>

            {/* Sessions List */}
            <div className="flex-1 overflow-y-auto p-2 space-y-3">
                {Object.entries(grouped).map(([label, group]) => (
                    <div key={label}>
                        <p className="px-2 py-1 text-[10px] font-medium uppercase tracking-wider text-[hsl(var(--muted-foreground))]">
                            {label}
                        </p>
                        <div className="space-y-0.5">
                            {group.map((session) => (
                                <div
                                    key={session.id}
                                    className={cn(
                                        "w-full flex items-center gap-2 px-3 py-2.5 rounded-[var(--radius)] text-sm text-left group transition-colors duration-150 cursor-pointer",
                                        session.id === activeSessionId
                                            ? "bg-[hsl(var(--sidebar-primary))] text-[hsl(var(--sidebar-primary-foreground))]"
                                            : "hover:bg-[hsl(var(--sidebar-accent))] text-[hsl(var(--sidebar-foreground))]",
                                    )}
                                    onClick={() => {
                                        if (editingId !== session.id) {
                                            onSelectSession(session.id);
                                        }
                                    }}
                                >
                                    <MessageSquare className="w-4 h-4 shrink-0 opacity-60" />

                                    {editingId === session.id ? (
                                        <form
                                            className="flex-1 flex items-center gap-1"
                                            onSubmit={(e) => {
                                                e.preventDefault();
                                                confirmRename();
                                            }}
                                        >
                                            <input
                                                ref={editInputRef}
                                                value={editValue}
                                                onChange={(e) => setEditValue(e.target.value)}
                                                onKeyDown={(e) => {
                                                    if (e.key === "Escape") cancelRename();
                                                }}
                                                onBlur={confirmRename}
                                                className="flex-1 bg-transparent border-b border-current outline-none text-sm min-w-0"
                                            />
                                            <button
                                                type="submit"
                                                className="p-0.5 rounded hover:bg-white/20"
                                                onMouseDown={(e) => e.preventDefault()}
                                            >
                                                <Check className="w-3 h-3" />
                                            </button>
                                            <button
                                                type="button"
                                                className="p-0.5 rounded hover:bg-white/20"
                                                onMouseDown={(e) => {
                                                    e.preventDefault();
                                                    cancelRename();
                                                }}
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </form>
                                    ) : (
                                        <>
                                            <span className="truncate flex-1">
                                                {getDisplayTitle(session.title, t)}
                                            </span>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    startRename(session);
                                                }}
                                                className={cn(
                                                    "opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-[hsl(var(--sidebar-accent))] transition-opacity",
                                                    session.id === activeSessionId && "hover:bg-white/20",
                                                )}
                                                title="Rename"
                                            >
                                                <Pencil className="w-3 h-3" />
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onDeleteSession(session.id);
                                                }}
                                                className={cn(
                                                    "opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-[hsl(var(--destructive)/0.1)] transition-opacity",
                                                    session.id === activeSessionId && "hover:bg-white/20",
                                                )}
                                                title={t("deleteChat")}
                                            >
                                                <Trash2 className="w-3 h-3" />
                                            </button>
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
                {sessions.length === 0 && (
                    <p className="text-center text-sm text-[hsl(var(--muted-foreground))] py-8">
                        {t("newChat")}
                    </p>
                )}
            </div>

            {/* User Section */}
            <div className="p-3 border-t border-[hsl(var(--sidebar-border))] space-y-1">
                <div className="flex items-center gap-3 px-2 py-2">
                    <UserAvatar
                        id={user?.id}
                        alt={user?.firstName || "User"}
                        className="w-8 h-8 rounded-full shadow-sm"
                    />
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                            {user?.firstName} {user?.lastName}
                        </p>
                        <p className="text-[11px] text-[hsl(var(--muted-foreground))] truncate">
                            {user?.email}
                        </p>
                    </div>
                </div>
                <button
                    onClick={() => router.push(`/${locale}/dashboard/cv`)}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-[var(--radius)] text-sm hover:bg-[hsl(var(--primary)/0.1)] text-[hsl(var(--primary))] font-medium transition-colors"
                >
                    <FileText className="w-4 h-4 opacity-60" />
                    {tc("cv")}
                </button>
                <button
                    onClick={() => router.push(`/${locale}/dashboard/settings`)}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-[var(--radius)] text-sm hover:bg-[hsl(var(--sidebar-accent))] transition-colors"
                >
                    <Settings className="w-4 h-4 opacity-60" />
                    {tc("settings")}
                </button>
                <a
                    href="mailto:setemdestek@hotmail.com"
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-[var(--radius)] text-sm hover:bg-[hsl(var(--primary)/0.1)] text-[hsl(var(--primary))] transition-colors"
                >
                    <Mail className="w-4 h-4 opacity-60" />
                    {ts("title")}
                </a>
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-[var(--radius)] text-sm hover:bg-[hsl(var(--destructive)/0.1)] text-[hsl(var(--destructive))] transition-colors"
                >
                    <LogOut className="w-4 h-4 opacity-60" />
                    {tc("logout")}
                </button>
            </div>
        </aside>
    );
}
