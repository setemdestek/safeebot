"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { User, Check, Copy } from "lucide-react";
import { Logo } from "@/components/common/Logo";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";
import type { ChatMessage } from "@/types";
import { LumaSpin } from "@/components/ui/luma-spin";
import { CpuArchitecture } from "@/components/ui/cpu-architecture";

interface ChatAreaProps {
    messages: ChatMessage[];
    isLoading: boolean;
    isMessageSending?: boolean;
}

const CodeBlock = ({ inline, className, children, ...props }: any) => {
    const [copied, setCopied] = useState(false);
    const match = /language-(\w+)/.exec(className || "");
    const codeText = String(children).replace(/\n$/, "");

    const handleCopy = () => {
        navigator.clipboard.writeText(codeText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (inline) {
        return (
            <code className="bg-[hsl(var(--muted))] text-[hsl(var(--foreground))] rounded px-1.5 py-0.5 text-xs font-mono border border-[hsl(var(--border))]" {...props}>
                {children}
            </code>
        );
    }

    return (
        <div className="relative group my-5 rounded-xl overflow-hidden border border-[hsl(var(--border))] bg-[#1a1b26] text-[#a9b1d6] shadow-sm">
            <div className="flex items-center justify-between px-4 py-2 bg-[#16161e] border-b border-black/20">
                <div className="text-xs font-mono font-medium text-[#7aa2f7]">
                    {match ? match[1] : "code"}
                </div>
                <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 text-xs text-[#9aa5ce] hover:text-white transition-colors py-1"
                >
                    {copied ? <Check className="w-3.5 h-3.5 text-[#9ece6a]" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? "Copied!" : "Kopyala"}</span>
                </button>
            </div>
            <div className="p-4 overflow-x-auto text-[13px] font-mono leading-relaxed">
                <code className={className} {...props}>
                    {children}
                </code>
            </div>
        </div>
    );
};

export function ChatArea({ messages, isLoading, isMessageSending }: ChatAreaProps) {
    const t = useTranslations("chat");
    const bottomRef = useRef<HTMLDivElement>(null);

    // Auto scroll
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isLoading, isMessageSending]);

    const markdownComponents = {
        code: CodeBlock,
        p: ({ children }: any) => <p className="mb-3 last:mb-0 leading-[1.6] text-[15px]">{children}</p>,
        ul: ({ children }: any) => <ul className="mb-4 pl-6 list-disc [&>li]:mt-2 leading-relaxed text-[15px] text-[hsl(var(--foreground))]">{children}</ul>,
        ol: ({ children }: any) => <ol className="mb-4 pl-6 list-decimal [&>li]:mt-2 leading-relaxed text-[15px] text-[hsl(var(--foreground))]">{children}</ol>,
        table: ({ children }: any) => (
            <div className="my-5 overflow-hidden rounded-xl border border-[hsl(var(--border))] shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left border-collapse bg-[hsl(var(--card))]">{children}</table>
                </div>
            </div>
        ),
        th: ({ children }: any) => (
            <th className="px-5 py-3.5 bg-[hsl(var(--secondary))] text-[hsl(var(--secondary-foreground))] font-semibold border-b border-[hsl(var(--border))]">
                {children}
            </th>
        ),
        td: ({ children }: any) => (
            <td className="px-5 py-3.5 border-b border-[hsl(var(--border))] last:border-0 align-top text-[hsl(var(--foreground))]">
                {children}
            </td>
        ),
        a: ({ href, children }: any) => (
            <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 hover:underline transition-colors font-medium">
                {children}
            </a>
        ),
        h1: ({ children }: any) => <h1 className="text-2xl font-bold mt-6 mb-4 text-[hsl(var(--foreground))]">{children}</h1>,
        h2: ({ children }: any) => <h2 className="text-xl font-bold mt-5 mb-3 text-[hsl(var(--foreground))]">{children}</h2>,
        h3: ({ children }: any) => <h3 className="text-lg font-semibold mt-4 mb-2 text-[hsl(var(--foreground))]">{children}</h3>,
        blockquote: ({ children }: any) => (
            <blockquote className="border-l-[3px] border-[hsl(var(--primary))] pl-4 py-1.5 my-5 bg-[hsl(var(--muted)/0.3)] rounded-r-lg text-[hsl(var(--muted-foreground))] italic text-[15px]">
                {children}
            </blockquote>
        ),
        hr: () => <hr className="my-6 border-[hsl(var(--border))]" />
    };

    return (
        <div className="flex-1 relative flex flex-col overflow-hidden">
            {/* Background Animation */}
            <div className="absolute inset-0 z-0 flex items-center justify-center opacity-[0.03] dark:opacity-[0.08] pointer-events-none overflow-hidden">
                <CpuArchitecture width="100%" height="100%" text="SafeeBot" className="scale-125 md:scale-100 object-cover" />
            </div>

            {/* Chat Content */}
            <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6 relative z-10 w-full">
                {/* Welcome message if no messages */}
                {messages.length === 0 && !isLoading && (
                    <div className="flex flex-col items-center justify-end h-full text-center px-4 pb-12 sm:pb-24">
                        <h2 className="text-2xl font-semibold mb-3 tracking-tight">SafeeBot</h2>
                        <p className="text-[hsl(var(--muted-foreground))] max-w-md leading-relaxed text-[15px]">
                            {t("welcome")}
                        </p>
                    </div>
                )}

                {/* Messages */}
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={cn(
                            "flex gap-3 max-w-4xl", // Xüsusi markdownlar, cədvəllər üçün daha geniş məkana ehtiyac var
                            msg.role === "user" ? "ml-auto flex-row-reverse" : "",
                        )}
                    >
                        {/* Avatar */}
                        <div
                            className={cn(
                                "w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1 shadow-sm",
                                msg.role === "bot"
                                    ? "bg-[hsl(var(--primary)/0.1)] border border-[hsl(var(--primary)/0.2)]"
                                    : "bg-[hsl(var(--secondary))] border border-[hsl(var(--border))]",
                            )}
                        >
                            {msg.role === "bot" ? (
                                <Logo width={18} height={18} />
                            ) : (
                                <User className="w-4 h-4 text-[hsl(var(--secondary-foreground))]" />
                            )}
                        </div>

                        {/* Content */}
                        <div
                            className={cn(
                                "rounded-2xl px-4 sm:px-5 py-3.5 max-w-[92%] sm:max-w-[85%]",
                                msg.role === "user"
                                    ? "bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] rounded-br-sm shadow-sm"
                                    : "bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-bl-sm shadow-sm",
                                "transition-all duration-200"
                            )}
                        >
                            {msg.role === "bot" ? (
                                <div className="chat-markdown text-[hsl(var(--foreground))] w-full overflow-x-hidden">
                                    <ReactMarkdown
                                        remarkPlugins={[remarkGfm]}
                                        components={markdownComponents}
                                    >
                                        {msg.content}
                                    </ReactMarkdown>
                                </div>
                            ) : (
                                <p className="text-[15px] leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                            )}
                        </div>
                    </div>
                ))}

                {/* Initial Loading (Spinner) */}
                {isLoading && (
                    <div className="flex gap-3 max-w-3xl">
                        <div className="w-8 h-8 rounded-full bg-[hsl(var(--primary)/0.1)] flex items-center justify-center shrink-0 mt-1 shadow-sm border border-[hsl(var(--primary)/0.2)]">
                            <Logo width={18} height={18} />
                        </div>
                        <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-2xl rounded-bl-sm px-6 py-5 flex items-center justify-center min-w-[120px] shadow-sm">
                            <LumaSpin />
                        </div>
                    </div>
                )}

                {/* Message Sending (Skeleton Loader Pulse) */}
                {isMessageSending && !isLoading && (
                    <div className="flex gap-3 max-w-3xl animate-pulse">
                        <div className="w-8 h-8 rounded-full bg-[hsl(var(--primary)/0.1)] flex items-center justify-center shrink-0 mt-1 shadow-sm border border-[hsl(var(--primary)/0.2)]">
                            <Logo width={18} height={18} />
                        </div>
                        <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-2xl rounded-bl-sm p-5 w-full min-w-[300px] max-w-[400px] shadow-sm flex flex-col gap-3">
                            <div className="h-3 bg-[hsl(var(--muted-foreground)/0.2)] rounded-md w-3/4"></div>
                            <div className="h-3 bg-[hsl(var(--muted-foreground)/0.2)] rounded-md w-full"></div>
                            <div className="h-3 bg-[hsl(var(--muted-foreground)/0.2)] rounded-md w-5/6"></div>
                        </div>
                    </div>
                )}

                <div ref={bottomRef} className="h-2" />
            </div>
        </div>
    );
}
