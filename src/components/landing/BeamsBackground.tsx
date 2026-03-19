"use client";

import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface Beam {
    x: number;
    width: number;
    duration: number;
    delay: number;
    opacity: number;
}

export function BeamsBackground({ className }: { className?: string }) {
    const containerRef = useRef<HTMLDivElement>(null);

    const beams: Beam[] = [
        { x: 10, width: 2, duration: 7, delay: 0, opacity: 0.15 },
        { x: 25, width: 3, duration: 9, delay: 1.5, opacity: 0.1 },
        { x: 40, width: 1.5, duration: 6, delay: 3, opacity: 0.2 },
        { x: 55, width: 2.5, duration: 11, delay: 0.5, opacity: 0.12 },
        { x: 70, width: 2, duration: 8, delay: 2, opacity: 0.18 },
        { x: 85, width: 3, duration: 10, delay: 4, opacity: 0.1 },
        { x: 15, width: 1, duration: 12, delay: 5, opacity: 0.08 },
        { x: 60, width: 2, duration: 7.5, delay: 3.5, opacity: 0.14 },
        { x: 35, width: 1.5, duration: 9.5, delay: 1, opacity: 0.16 },
        { x: 90, width: 2, duration: 6.5, delay: 2.5, opacity: 0.11 },
    ];

    return (
        <div
            ref={containerRef}
            className={cn(
                "absolute inset-0 overflow-hidden pointer-events-none",
                className
            )}
        >
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-[hsl(var(--background))] via-transparent to-[hsl(var(--background))]" />

            {/* Beams */}
            {beams.map((beam, i) => (
                <div
                    key={i}
                    className="beam absolute h-[200%]"
                    style={{
                        left: `${beam.x}%`,
                        width: `${beam.width}px`,
                        background: `linear-gradient(180deg, transparent, hsl(var(--primary) / ${beam.opacity}), transparent)`,
                        ["--beam-duration" as string]: `${beam.duration}s`,
                        ["--beam-delay" as string]: `${beam.delay}s`,
                    }}
                />
            ))}

            {/* Radial glow */}
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[hsl(var(--primary)/0.06)] blur-[100px]" />
        </div>
    );
}
