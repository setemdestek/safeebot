"use client";

import * as React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface UserAvatarProps {
    id?: string | null;
    alt?: string;
    className?: string;
}

function HelmetRobotIcon({ className }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            {/* Hard hat */}
            <path
                d="M4 12v-2a8 8 0 0 1 16 0v2"
                fill="hsl(var(--primary)/0.2)"
                stroke="hsl(var(--primary))"
            />
            <path d="M2 12h20" stroke="hsl(var(--primary))" />
            {/* Robot Face Box */}
            <rect x="5" y="12" width="14" height="10" rx="3" fill="currentColor" fillOpacity="0.1" stroke="currentColor" />
            {/* Robot Eyes */}
            <circle cx="9" cy="16" r="1.5" fill="currentColor" stroke="none" />
            <circle cx="15" cy="16" r="1.5" fill="currentColor" stroke="none" />
            {/* Robot Mouth */}
            <line x1="10" y1="19" x2="14" y2="19" />
        </svg>
    );
}

export function UserAvatar({ id, alt, className }: UserAvatarProps) {
    const seed = id || "SafeeBot-default-user";
    const src = `https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${encodeURIComponent(seed)}`;

    return (
        <Avatar className={cn("border border-[hsl(var(--border))] bg-[hsl(var(--secondary))]", className)}>
            <AvatarImage src={src} alt={alt || "User avatar"} className="object-cover" />
            <AvatarFallback className="bg-[hsl(var(--secondary))] text-[hsl(var(--secondary-foreground))] shadow-inner">
                <HelmetRobotIcon className="w-3/5 h-3/5" />
            </AvatarFallback>
        </Avatar>
    );
}
