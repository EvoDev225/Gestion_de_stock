"use client";

import { motion, type Variants } from "motion/react";
import { History, Download, Sparkles, ClipboardCheck, type LucideIcon } from "lucide-react";

type Feature = {
    title: string;
    description: string;
    icon: LucideIcon;
};

const features: Feature[] = [
    {
        title: "Journal d'activité complet",
        description:
            "Chaque action (vente, réception, ajustement de stock) est tracée automatiquement avec horodatage et utilisateur responsable, pour une traçabilité totale.",
        icon: History,
    },
    {
        title: "Export Excel en un clic",
        description:
            "Générez des rapports Excel professionnels (stock actuel, historique des ventes, mouvements) directement depuis l'application, sans manipulation manuelle.",
        icon: Download,
    },
    {
        title: "Rapports d'activité par IA",
        description:
            "Une intelligence artificielle génère des synthèses claires de l'activité de votre entreprise, consultables à tout moment par les administrateurs.",
        icon: Sparkles,
    },
    {
        title: "Validation d'inventaire à deux niveaux",
        description:
            "Un employé lance le comptage physique, un administrateur valide les écarts avant mise à jour du stock officiel — zéro erreur non contrôlée.",
        icon: ClipboardCheck,
    },
];

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.12,
        },
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

export default function FeaturesSection() {
    return (
        <section className="w-full py-24 px-6 bg-background overflow-hidden">
            <div className="max-w-5xl mx-auto flex flex-col items-center">

                {/* En-tête de section */}
                <div className="text-center max-w-2xl mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                        Tout ce dont vous avez besoin pour gérer votre stock
                    </h2>
                    <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                        Conçu pour les réalités du commerce moderne. Simple, précis, sans compromis.
                    </p>
                </div>

                {/* Grille de fonctionnalités */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full"
                >
                    {features.map((feature) => {
                        const Icon = feature.icon;
                        return (
                            <motion.div
                                key={feature.title}
                                variants={itemVariants}
                                className="flex flex-col bg-card rounded-3xl p-8 ambient-shadow border border-border transition-transform hover:-translate-y-1"
                            >
                                {/* Placeholder de l'illustration */}
                                <div className="h-40 w-full bg-muted rounded-2xl overflow-hidden flex items-center justify-center mb-6">
                                    <Icon className="w-12 h-12 text-primary opacity-60" />
                                </div>

                                {/* Contenu textuel */}
                                <h3 className="font-semibold text-lg text-foreground mb-2">
                                    {feature.title}
                                </h3>
                                <p className="text-muted-foreground text-sm flex-grow mb-6 leading-relaxed">
                                    {feature.description}
                                </p>

                                {/* Icône en pied de carte */}
                                <div className="mt-auto">
                                    <Icon className="w-6 h-6 text-primary" />
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>

            </div>
        </section>
    );
}