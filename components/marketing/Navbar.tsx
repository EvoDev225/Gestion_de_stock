"use client";

import { motion, AnimatePresence } from "motion/react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";

export default function Navbar() {
    const [mounted, setMounted] = useState(false);
    const { theme, setTheme } = useTheme();

    // Évite le mismatch d'hydratation
    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <motion.nav
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-7xl flex items-center justify-between px-6 py-3 rounded-full bg-background/70 backdrop-blur-xl border border-border ambient-shadow"
        >
            <div className="flex-shrink-0">
                <a href="#" className="text-xl font-bold text-primary">
                    CorticalEvo
                </a>
            </div>
            
            <div className="hidden md:flex items-center gap-8">
                <a href="#" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                    Fonctionnalités
                </a>
                <a href="#" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                    À propos
                </a>
            </div>
            
            <div className="flex items-center gap-6">
                <a href="/login" className="hidden md:block text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                    Connexion
                </a>
                
                <button
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    className="p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center"
                    aria-label="Changer le thème"
                >
                    {mounted ? (
                        <AnimatePresence mode="wait" initial={false}>
                            {theme === "dark" ? (
                                <motion.div
                                    key="moon"
                                    initial={{ scale: 0, rotate: -90 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    exit={{ scale: 0, rotate: 90 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <Moon className="w-5 h-5" />
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="sun"
                                    initial={{ scale: 0, rotate: -90 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    exit={{ scale: 0, rotate: 90 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <Sun className="w-5 h-5" />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    ) : (
                        /* Placeholder de même taille pour éviter les sauts de layout avant l'hydratation */
                        <div className="w-5 h-5" />
                    )}
                </button>
            </div>
        </motion.nav>
    );
}