"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

export function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 20) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        // Vérification initiale au chargement de la page
        handleScroll();

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 h-[76px] px-4 md:px-8 transition-colors duration-200 ${isScrolled
                    ? "bg-surface/80 backdrop-blur-sm border-b border-border"
                    : "bg-transparent border-b border-transparent"
                }`}
        >
            <div className="mx-auto h-full max-w-7xl flex items-center justify-between">
                {/* 1. Gauche : Logo / Marque */}
                <Link
                    href="/"
                    className="font-display text-[17px] font-medium text-foreground tracking-[ -0.015em]"
                >
                    Stockflow
                </Link>

                {/* 2. Centre : Navigation (Cachée sur mobile) */}
                <nav className="hidden md:flex items-center gap-[28px]">
                    <Link
                        href="#features"
                        className="font-sans text-sm text-foreground-muted hover:text-foreground transition-colors"
                    >
                        Fonctionnalités
                    </Link>
                    <Link
                        href="#how-it-works"
                        className="font-sans text-sm text-foreground-muted hover:text-foreground transition-colors"
                    >
                        Comment ça marche
                    </Link>
                    <Link
                        href="#about"
                        className="font-sans text-sm text-foreground-muted hover:text-foreground transition-colors"
                    >
                        À propos
                    </Link>
                </nav>

                {/* 3. Droite : Actions */}
                <div className="flex items-center gap-4">
                    <ThemeToggle />

                    <Link
                        href="/login"
                        className="font-sans text-sm text-foreground-muted hover:text-foreground transition-colors"
                    >
                        Connexion
                    </Link>

                    <Link
                        href="/register"
                        className="h-9 px-4 rounded-lg bg-accent text-accent-foreground text-sm font-medium hover:bg-accent-hover transition-colors inline-flex items-center justify-center"
                    >
                        Découvrir
                    </Link>
                </div>
            </div>
        </header>
    );
}