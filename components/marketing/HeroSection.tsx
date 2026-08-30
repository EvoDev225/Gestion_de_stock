"use client";

import { Info, ListFilter, Search, TriangleAlert } from "lucide-react";
import { motion, type Variants } from "motion/react";

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.15 },
    },
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: "easeOut" },
    },
};

export default function HeroSection() {
    return (
        <motion.section
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="relative w-full pt-36 pb-20 px-6 flex flex-col items-center overflow-hidden"
        >
            {/* --- En-tête Hero --- */}
            <motion.h1
                variants={itemVariants}
                className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground text-center leading-tight"
            >
                La Gestion de Stock<br />Enfin Simple
            </motion.h1>

            <motion.p
                variants={itemVariants}
                className="mt-6 text-lg text-muted-foreground max-w-2xl text-center leading-relaxed"
            >
                Contrôle précis de l'inventaire pour les petites entreprises. Finies les tableurs approximatifs et les ruptures de stock, place à un système intuitif et fiable.
            </motion.p>

            <motion.div
                variants={itemVariants}
                className="mt-10 flex flex-col sm:flex-row items-center gap-4"
            >
                <button className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-primary text-primary-foreground font-medium shadow-sm transition-transform hover:scale-105">
                    Commencer
                </button>
                <button className="w-full sm:w-auto px-8 py-3.5 rounded-full border border-primary text-primary font-medium bg-transparent transition-transform hover:scale-105">
                    Voir comment ça marche
                </button>
            </motion.div>

            {/* --- Section Carte Mockup --- */}
            <motion.div
                variants={itemVariants}
                className="mt-20 relative w-full max-w-5xl mx-auto"
            >
                {/* Annotation flottante : Haut Gauche */}
                <motion.div
                    variants={itemVariants}
                    className="hidden lg:flex absolute -left-12 top-12 items-center z-10"
                >
                    <div className="bg-background rounded-full px-4 py-2 ambient-shadow border border-border text-sm font-medium text-foreground whitespace-nowrap">
                        Suivi des stocks en temps réel
                    </div>
                    <div className="w-12 border-t border-dashed border-border" />
                </motion.div>

                {/* Annotation flottante : Bas Droite */}
                <motion.div
                    variants={itemVariants}
                    className="hidden lg:flex absolute -right-8 bottom-16 items-center z-10"
                >
                    <div className="w-12 border-t border-dashed border-border" />
                    <div className="bg-background rounded-full px-4 py-2 ambient-shadow border border-border text-sm font-medium text-foreground whitespace-nowrap">
                        Alertes automatiques
                    </div>
                </motion.div>

                {/* Conteneur Mockup */}
                <div className="corner-brackets corner-brackets-tl-br p-2 md:p-3 relative z-0">
                    <div className="bg-card rounded-3xl p-6 md:p-10 ambient-shadow border border-border overflow-hidden">

                        {/* Header Mockup */}
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="font-semibold text-lg text-foreground">Vue d'ensemble</h3>
                            <div className="flex gap-4 text-muted-foreground">
                                <Search className="w-5 h-5 cursor-pointer hover:text-foreground transition-colors" />
                                <ListFilter className="w-5 h-5 cursor-pointer hover:text-foreground transition-colors" />
                            </div>
                        </div>

                        {/* Grille de contenu */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                            {/* Carte gauche : Graphique */}
                            <div className="md:col-span-2 border border-border/60 rounded-2xl p-6 bg-background">
                                <p className="text-xs uppercase tracking-wide text-muted-foreground font-medium">
                                    Vitesse des ventes
                                </p>
                                <p className="text-3xl font-bold text-foreground mt-2">
                                    2 450 unités
                                </p>

                                {/* SVG Area Chart */}
                                <div className="mt-8 h-32 w-full text-primary relative">
                                    <svg
                                        viewBox="0 0 400 100"
                                        className="w-full h-full overflow-visible"
                                        preserveAspectRatio="none"
                                    >
                                        <defs>
                                            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor="currentColor" stopOpacity="0.15" />
                                                <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
                                            </linearGradient>
                                        </defs>
                                        <path
                                            d="M0,100 L0,80 Q50,90 100,60 T200,40 T300,50 T400,20 L400,100 Z"
                                            fill="url(#chartGradient)"
                                        />
                                        <motion.path
                                            d="M0,80 Q50,90 100,60 T200,40 T300,50 T400,20"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="3"
                                            strokeLinecap="round"
                                            initial={{ pathLength: 0 }}
                                            animate={{ pathLength: 1 }}
                                            transition={{ duration: 1.5, ease: "easeInOut", delay: 0.8 }}
                                        />
                                    </svg>
                                </div>
                            </div>

                            {/* Colonne droite : Alertes */}
                            <div className="flex flex-col gap-4">
                                {/* Alerte 1 */}
                                <div className="flex items-start gap-4 p-5 rounded-2xl border border-border/60 bg-background hover:bg-background/80 transition-colors">
                                    <div className="p-2.5 rounded-full bg-destructive/10 text-destructive shrink-0">
                                        <TriangleAlert className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-semibold text-foreground leading-tight">
                                            Stock faible : Grains Arabica
                                        </h4>
                                        <p className="text-xs text-muted-foreground mt-1.5">
                                            Il reste seulement 12 unités
                                        </p>
                                    </div>
                                </div>

                                {/* Alerte 2 */}
                                <div className="flex items-start gap-4 p-5 rounded-2xl border border-border/60 bg-background hover:bg-background/80 transition-colors">
                                    <div className="p-2.5 rounded-full bg-warning/10 text-warning shrink-0">
                                        <Info className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-semibold text-foreground leading-tight">
                                            Réapprovisionnement suggéré
                                        </h4>
                                        <p className="text-xs text-muted-foreground mt-1.5">
                                            Tasses en céramique (SKU-102)
                                        </p>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.section>
    );
}