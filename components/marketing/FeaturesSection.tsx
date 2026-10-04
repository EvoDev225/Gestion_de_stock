"use client";

import Image from "next/image";
import { motion, type Variants } from "motion/react";

type Feature = {
    title: string;
    description: string;
    image: string;
};

const features: Feature[] = [
    {
        title: "Journal d'activité complet",
        description:
            "Chaque action (vente, réception, ajustement de stock) est tracée automatiquement avec horodatage et utilisateur responsable, pour une traçabilité totale.",
        image: "/journal.png",
    },
    {
        title: "Export Excel en un clic",
        description:
            "Générez des rapports Excel professionnels (stock actuel, historique des ventes, mouvements) directement depuis l'application, sans manipulation manuelle.",
        image: "/export.png",
    },
    {
        title: "Rapports d'activité par IA",
        description:
            "Une intelligence artificielle génère des synthèses claires de l'activité de votre entreprise, consultables à tout moment par les administrateurs.",
        image: "/rapport.png",
    },
    {
        title: "Validation d'inventaire à deux niveaux",
        description:
            "Un employé lance le comptage physique, un administrateur valide les écarts avant mise à jour du stock officiel — zéro erreur non contrôlée.",
        image: "/inventaire.png",
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
        transition: {
            duration: 0.6,
            ease: "easeOut",
        },
    },
};

export default function FeaturesSection() {
    return (
        <section id="fonctionnalites" className="w-full py-24 px-6 bg-background overflow-hidden">
            <div className="max-w-5xl mx-auto flex flex-col items-center">

                {/* En-tête de section */}
                <div className="text-center max-w-2xl mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                        Tout ce dont vous avez besoin pour gérer votre stock
                    </h2>

                    <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                        Conçu pour les réalités du commerce moderne. Simple, précis,
                        sans compromis.
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
                    {features.map((feature) => (
                        <motion.div
                            key={feature.title}
                            variants={itemVariants}
                            className="flex flex-col bg-card rounded-3xl p-8 ambient-shadow border border-border transition-transform hover:-translate-y-1"
                        >
                            {/* Illustration */}
                            <div className="w-full bg-muted rounded-2xl overflow-hidden mb-6">
    <Image
        src={feature.image}
        alt={feature.title}
        width={1200}
        height={700}
        quality={100}
        className="w-full h-auto object-contain"
    />
</div>

                            {/* Contenu textuel */}
                            <h3 className="font-semibold text-lg text-foreground mb-2">
                                {feature.title}
                            </h3>

                            <p className="text-muted-foreground text-sm flex-grow mb-6 leading-relaxed">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </motion.div>

            </div>
        </section>
    );
}