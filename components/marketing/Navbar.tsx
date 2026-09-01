"use client";

import { motion, AnimatePresence } from "motion/react";
import { Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";
import ThemeToggle from "../shared/ThemeToggle";

export default function Navbar() {
    const [mounted, setMounted] = useState(false);
    

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
                
                <ThemeToggle />
            </div>
        </motion.nav>
    );
}