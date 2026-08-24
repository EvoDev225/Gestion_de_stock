"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function HeroSection() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Délais d'animation d'entrée en cascade (ms)
    const getItemStyle = (delayMs: number) => ({
        opacity: mounted ? 1 : 0,
        transform: mounted ? "translateY(0)" : "translateY(12px)",
        transition: `opacity 500ms ease-out ${delayMs}ms, transform 500ms ease-out ${delayMs}ms`,
    });

    return (
        <section className="relative overflow-hidden bg-background pt-[116px] pb-18 px-4 md:px-8">
            {/* Configuration des Keyframes CSS pour l'animation des halos */}
            <style jsx>{`
        @keyframes haloFloatOne {
          0%, 100% {
            transform: translate(0, 0);
          }
          50% {
            transform: translate(60px, 40px);
          }
        }
        @keyframes haloFloatTwo {
          0%, 100% {
            transform: translate(0, 0);
          }
          50% {
            transform: translate(-60px, -40px);
          }
        }
        .animate-halo-1 {
          animation: haloFloatOne 14s ease-in-out infinite;
        }
        .animate-halo-2 {
          animation: haloFloatTwo 18s ease-in-out infinite;
        }
      `}</style>

            {/* 1. Halos lumineux animés en arrière-plan */}
            <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
                <div
                    className="absolute w-[520px] h-[520px] rounded-full opacity-[0.16] blur-[60px] animate-halo-1 -top-[160px] -left-[120px]"
                    style={{
                        background:
                            "radial-gradient(circle, var(--accent) 0%, transparent 70%)",
                    }}
                />
                <div
                    className="absolute w-[420px] h-[420px] rounded-full opacity-[0.12] blur-[60px] animate-halo-2 top-[40px] -right-[100px]"
                    style={{
                        background:
                            "radial-gradient(circle, var(--accent) 0%, transparent 70%)",
                    }}
                />
            </div>

            {/* 2. Contenu principal */}
            <div className="relative z-10 mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-[1fr_0.9fr] gap-10 items-center">
                {/* Colonne Gauche : Contenu textuel */}
                <div className="flex flex-col items-start">
                    {/* Label */}
                    <span
                        style={getItemStyle(0)}
                        className="text-[12px] font-medium tracking-[0.08em] uppercase text-accent mb-4"
                    >
                        GESTION DE STOCK, REPENSÉE
                    </span>

                    {/* Titre principal */}
                    <h1
                        style={getItemStyle(80)}
                        className="font-display text-4xl md:text-6xl font-medium leading-tight tracking-tight text-foreground mb-[20px]"
                    >
                        Arrêtez de deviner votre stock.
                    </h1>

                    {/* Description */}
                    <p
                        style={getItemStyle(160)}
                        className="font-sans text-[15px] text-foreground-muted leading-relaxed max-w-[420px] mb-[28px]"
                    >
                        Conçu pour les petits commerces qui veulent une traçabilité
                        complète, sans la complexité d'un outil pensé pour de grandes
                        chaînes.
                    </p>

                    {/* Ligne de CTA */}
                    <div
                        style={getItemStyle(240)}
                        className="flex items-center gap-[20px]"
                    >
                        <Link
                            href="/register"
                            className="h-[44px] px-[22px] rounded-lg bg-accent text-accent-foreground text-sm font-medium hover:bg-accent-hover transition-colors inline-flex items-center justify-center"
                        >
                            Découvrir
                        </Link>

                        <Link
                            href="#how-it-works"
                            className="group text-sm font-medium text-foreground inline-flex items-center gap-1 hover:gap-2 transition-all duration-200"
                        >
                            <span>Voir comment ça marche</span>
                            <ArrowRight className="w-[14px] h-[14px] transition-transform duration-200" />
                        </Link>
                    </div>
                </div>

                {/* Colonne Droite : Mockup produit */}
                <div
                    style={getItemStyle(320)}
                    className="w-full flex justify-center lg:justify-end mt-4 lg:mt-0"
                >
                    <div className="w-full max-w-[420px] bg-surface border border-border-strong rounded-xl p-[20px] transform rotate-[2deg] transition-transform duration-300 hover:rotate-0">
                        {/* Header de la carte */}
                        <div className="text-[12px] text-foreground-subtle mb-4 font-sans font-medium uppercase tracking-wider">
                            Alertes de stock
                        </div>

                        {/* Liste d'alertes */}
                        <div className="flex flex-col">
                            {/* Ligne 1 */}
                            <div className="py-3 flex items-center justify-between border-b border-border">
                                <div>
                                    <div className="text-[13px] font-medium text-foreground">
                                        Huile d'olive Bio 75cl
                                    </div>
                                    <div className="text-[12px] text-foreground-subtle">
                                        Reste 3 unités
                                    </div>
                                </div>
                                <span className="text-[11px] font-medium px-2 py-[3px] rounded-md bg-warning/14 text-warning">
                                    Seuil bas
                                </span>
                            </div>

                            {/* Ligne 2 */}
                            <div className="py-3 flex items-center justify-between border-b border-border">
                                <div>
                                    <div className="text-[13px] font-medium text-foreground">
                                        Café Grain Arabica 1kg
                                    </div>
                                    <div className="text-[12px] text-foreground-subtle">
                                        Péremption dans 5 jours
                                    </div>
                                </div>
                                <span className="text-[11px] font-medium px-2 py-[3px] rounded-md bg-warning/14 text-warning">
                                    À écouler
                                </span>
                            </div>

                            {/* Ligne 3 */}
                            <div className="py-3 flex items-center justify-between">
                                <div>
                                    <div className="text-[13px] font-medium text-foreground">
                                        Thé Vert Menthe 250g
                                    </div>
                                    <div className="text-[12px] text-foreground-subtle">
                                        42 unités disponibles
                                    </div>
                                </div>
                                <span className="text-[11px] font-medium px-2 py-[3px] rounded-md bg-accent-subtle text-accent">
                                    OK
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}