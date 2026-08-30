"use client";

import { motion } from "motion/react";

export default function Navbar() {
    return (
        <motion.nav
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-7xl flex items-center justify-between px-6 py-3 rounded-full bg-background/70 backdrop-blur-xl border border-border ambient-shadow"
        >
            {/* Logo */}
            <div className="flex-shrink-0">
                <a href="#" className="text-xl font-bold text-primary">
                    CorticalEvo
                </a>
            </div>

            {/* Liens de navigation centrés (cachés sur mobile) */}
            <div className="hidden md:flex items-center gap-8">
                <a
                    href="#"
                    className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                >
                    Fonctionnalités
                </a>
                <a
                    href="#"
                    className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                >
                    Tarifs
                </a>
                <a
                    href="#"
                    className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                >
                    À propos
                </a>
            </div>

            {/* Actions à droite */}
            <div className="flex items-center gap-6">
                <a
                    href="#"
                    className="hidden md:block text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                >
                    Connexion
                </a>
                <motion.a
                    href="#"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="inline-flex items-center justify-center px-7 py-2.5 text-sm font-medium rounded-full bg-primary text-primary-foreground shadow-sm transition-colors"
                >
                    Essai gratuit
                </motion.a>
            </div>
        </motion.nav>
    );
}