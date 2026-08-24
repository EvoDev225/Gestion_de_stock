"use client";

import React from "react";

export function AuthVisualPanel() {
    return (
        <div className="hidden lg:flex relative overflow-hidden h-full min-h-screen bg-background-subtle flex-col justify-end p-12 select-none">
            {/* Keyframes pour l'animation douce du halo */}
            <style jsx>{`
        @keyframes haloAuthFloat {
          0%,
          100% {
            transform: translate(0, 0);
          }
          50% {
            transform: translate(40px, 30px);
          }
        }
        .animate-halo-auth {
          animation: haloAuthFloat 16s ease-in-out infinite;
        }
      `}</style>

            {/* 1. Halo lumineux animé en arrière-plan */}
            <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
                <div
                    className="absolute w-[450px] h-[450px] rounded-full opacity-[0.14] blur-[60px] animate-halo-auth top-[10%] left-[20%]"
                    style={{
                        background:
                            "radial-gradient(circle, var(--accent) 0%, transparent 70%)",
                    }}
                />
            </div>

            {/* 2. Contenu textuel aligné en bas */}
            <div className="relative z-10 max-w-[420px]">
                <blockquote className="font-display text-2xl md:text-3xl font-medium text-foreground leading-tight mb-4">
                    « La visibilité sur votre stock, en temps réel. »
                </blockquote>
                <p className="font-sans text-sm text-foreground-subtle">
                    Projet portfolio — architecture Merise, PostgreSQL, Next.js.
                </p>
            </div>
        </div>
    );
}