"use client";

import { motion, AnimatePresence } from "motion/react";
import { Menu, X } from "lucide-react"; // Remplacé Sun/Moon par Menu/X
import { useEffect, useState } from "react";
import Link from "next/link";
import ThemeToggle from "../shared/ThemeToggle";

export default function Navbar() {
    const [mounted, setMounted] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Ferme le menu quand on clique sur un lien
    const handleLinkClick = () => {
        setIsMenuOpen(false);
    };

    return (
        <>
            <motion.nav
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-7xl flex items-center justify-between px-6 py-3 rounded-full bg-background/70 backdrop-blur-xl border border-border ambient-shadow"
            >
                {/* Logo */}
                <div className="shrink-0">
                    <Link href={"/"} className="text-xl font-bold text-primary">
                        CorticalEvo
                    </Link>
                </div>
                
                {/* Liens Desktop (masqués sur mobile) */}
                <div className="hidden md:flex items-center gap-8">
                    <a href="#fonctionnalites" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                        Fonctionnalités
                    </a>
                    <a href="#comment-ca-marche" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                        Comment ça marche
                    </a>
                </div>
                
                {/* Actions Desktop + Bouton Menu Mobile */}
                <div className="flex items-center gap-4">
                    <Link href="/login" className="hidden md:block text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                        Connexion
                    </Link>
                    
                    <ThemeToggle />
                    
                    {/* Bouton Hamburger (visible uniquement sur mobile) */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="md:hidden p-2 text-muted-foreground hover:text-primary transition-colors"
                        aria-label={isMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
                    >
                        {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>
            </motion.nav>

            {/* Menu Mobile Déroulant */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="fixed top-24 left-1/2 -translate-x-1/2 z-40 w-[90%] max-w-7xl rounded-2xl bg-background/95 backdrop-blur-xl border border-border shadow-lg md:hidden overflow-hidden"
                    >
                        <div className="flex flex-col p-4 gap-2">
                            <a
                                href="#fonctionnalites"
                                onClick={handleLinkClick}
                                className="px-4 py-3 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-muted rounded-lg transition-colors"
                            >
                                Fonctionnalités
                            </a>
                            <a
                                href="#comment-ca-marche"
                                onClick={handleLinkClick}
                                className="px-4 py-3 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-muted rounded-lg transition-colors"
                            >
                                Comment ça marche
                            </a>
                            
                            <div className="my-2 border-t border-border" />
                            
                            <Link
                                href="/login"
                                onClick={handleLinkClick}
                                className="px-4 py-3 text-sm font-medium text-center text-primary-foreground bg-primary hover:bg-primary/90 rounded-lg transition-colors"
                            >
                                Connexion
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}