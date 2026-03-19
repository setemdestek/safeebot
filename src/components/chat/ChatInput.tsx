"use client";

import { useState, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Send, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface ChatInputProps {
    onSend: (message: string) => void;
    isLoading: boolean;
}

const placeholders = [
    "Əməyin mühafizəsi nədir?",
    "İş yerlərinin attestasiyası necə aparılır?",
    "Təhlükəsizlik qaydalarını necə tətbiq etməli?",
    "Yanğın təhlükəsizliyi qaydaları hansılardır?",
    "Risklərin qiymətləndirilməsi nədən ibarətdir?"
];

export function ChatInput({ onSend, isLoading }: ChatInputProps) {
    const t = useTranslations("chat");
    const [value, setValue] = useState("");
    const [isFocused, setIsFocused] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Typewriter State
    const [placeholderIndex, setPlaceholderIndex] = useState(0);
    const [currentPlaceholder, setCurrentPlaceholder] = useState("");
    const [isTyping, setIsTyping] = useState(true);

    // Auto-resize textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height =
                Math.min(textareaRef.current.scrollHeight, 160) + "px";
        }
    }, [value]);

    // Typewriter Effect
    useEffect(() => {
        let timeout: NodeJS.Timeout;

        if (isTyping) {
            if (currentPlaceholder.length < placeholders[placeholderIndex].length) {
                timeout = setTimeout(() => {
                    setCurrentPlaceholder(placeholders[placeholderIndex].slice(0, currentPlaceholder.length + 1));
                }, 50); // Yazılma sürəti
            } else {
                timeout = setTimeout(() => {
                    setIsTyping(false);
                }, 4000); // Tələb olunan 4 saniyə gözləmə
            }
        } else {
            if (currentPlaceholder.length > 0) {
                timeout = setTimeout(() => {
                    setCurrentPlaceholder(currentPlaceholder.slice(0, -1));
                }, 20); // Silinmə sürəti
            } else {
                setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
                setIsTyping(true);
            }
        }

        return () => clearTimeout(timeout);
    }, [currentPlaceholder, isTyping, placeholderIndex]);

    const handleSend = () => {
        if (!value.trim() || isLoading) return;
        onSend(value);
        setValue("");
        setIsFocused(false);
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        // Submit on Enter (without shift)
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    // Dinamik qutu (Pill box) genişlənmə qaydası 
    const isExpanded = (value.trim().length > 0 || isFocused) && !isLoading;

    return (
        <div className="relative border-t border-[hsl(var(--border))] bg-gradient-to-t from-[hsl(var(--background))] to-[hsl(var(--background))/50] pb-6 pt-4 px-4">
            <div className="max-w-4xl mx-auto flex justify-center w-full">
                <motion.div
                    animate={{
                        width: isExpanded ? "100%" : "70%",
                        borderRadius: isExpanded ? "16px" : "32px",
                    }}
                    transition={{ type: "spring", stiffness: 350, damping: 28 }}
                    className={cn(
                        "flex items-end gap-3 border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-5 py-3.5 mx-auto",
                        "focus-within:ring-2 focus-within:ring-[hsl(var(--ring))] focus-within:border-transparent shadow-lg transition-colors duration-200",
                        isLoading ? "opacity-75 pointer-events-none" : ""
                    )}
                >
                    <textarea
                        ref={textareaRef}
                        value={value}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        onChange={(e) => setValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        // Focus olanda aktiv olaraq heçnə yazılmayıbsa standart placeholder, deyilsə animasiyalı placeholder
                        placeholder={isFocused && value.length === 0 ? "Mesajınızı yazın..." : currentPlaceholder}
                        disabled={isLoading}
                        rows={1}
                        className="flex-1 bg-transparent resize-none text-[15px] outline-none placeholder:text-[hsl(var(--muted-foreground))] max-h-[160px] min-h-[24px] py-1 self-center w-full overflow-y-auto"
                    />
                    <button
                        onClick={handleSend}
                        disabled={!value.trim() || isLoading}
                        className={cn(
                            "shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300",
                            value.trim() && !isLoading
                                ? "bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] hover:bg-[hsl(var(--primary)/0.9)] shadow-[0_2px_10px_rgba(0,0,0,0.15)] active:scale-95"
                                : "bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] cursor-not-allowed",
                        )}
                    >
                        {isLoading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <Send className="w-4 h-4 translate-x-[1px]" />
                        )}
                    </button>
                </motion.div>
            </div>

            <div className="mt-3.5 text-center px-4 w-full">
                <p className="text-xs text-[hsl(var(--muted-foreground))]">
                    SafeBot səhvlər edə bilər. Əhəmiyyətli məlumatları istifadə etməzdən öncə yoxlamağınız tövsiyə olunur.
                </p>
            </div>
        </div>
    );
}
