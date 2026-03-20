import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoProps {
    className?: string;
    width?: number;
    height?: number;
}

export function Logo({ className, width = 44, height = 44 }: LogoProps) {
    return (
        <Image
            src="/loqo.jpeg"
            alt="SafeeBot Logo"
            width={width}
            height={height}
            className={cn(
                "object-cover rounded-2xl overflow-hidden shadow-sm transition-transform duration-200 group-hover:scale-105 ring-1 ring-[hsl(var(--border))]",
                className
            )}
            unoptimized
        />
    );
}

export function LogoWithText({ className, textClassName, iconSize = 44 }: LogoProps & { textClassName?: string, iconSize?: number }) {
    return (
        <div className={cn("flex items-center gap-2 group", className)}>
            <Logo width={iconSize} height={iconSize} />
            <span className={cn("text-xl font-bold tracking-tight", textClassName)}>
                Safe<span className="text-[hsl(var(--primary))]">Bot</span>
            </span>
        </div>
    );
}
