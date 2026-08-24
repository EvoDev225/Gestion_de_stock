import React from "react";
import Link from "next/link";

export function Footer() {
    return (
        <footer className="w-full bg-background border-t border-border py-6 px-4 md:px-8">
            <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                {/* Gauche : Liens de navigation & ressources */}
                <nav className="flex items-center gap-3 text-sm text-foreground-muted font-sans flex-wrap">
                    <Link
                        href="#features"
                        className="hover:text-foreground transition-colors"
                    >
                        Fonctionnalités
                    </Link>
                    <span className="text-foreground-subtle select-none">•</span>
                    <Link
                        href="#how-it-works"
                        className="hover:text-foreground transition-colors"
                    >
                        Comment ça marche
                    </Link>
                    <span className="text-foreground-subtle select-none">•</span>
                    <a
                        href="https://github.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-foreground transition-colors"
                    >
                        Code source
                    </a>
                </nav>

                {/* Droite : Clarification du contexte portfolio */}
                <div className="text-sm text-foreground-subtle font-sans">
                    Projet portfolio — Réalisé avec Next.js & Tailwind CSS
                </div>
            </div>
        </footer>
    );
}