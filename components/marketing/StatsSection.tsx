"use client";

import { motion, type Variants } from "motion/react";

type Stat = {
    value: string;
    label: string;
};

const stats: Stat[] = [
    {
        value: "99.9%",
        label: "Précision de l'inventaire",
    },
    {
        value: "15+",
        label: "Heures économisées par semaine",
    },
    {
        value: "10k+",
        label: "Entreprises nous font confiance",
    },
];

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
        },
    },
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: "easeOut" },
    },
};

export default function StatsSection() {
    return (
        <section className="w-full border-y border-border py-16 md:py-20 bg-background">
            <div className="max-w-7xl mx-auto px-6">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                    className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border"
                >
                    {stats.map((stat) => (
                        <motion.div
                            key={stat.label}
                            variants={itemVariants}
                            className="flex flex-col items-center justify-center py-8 md:py-4 px-4 text-center"
                        >
                            <span className="text-4xl md:text-5xl font-bold text-foreground">
                                {stat.value}
                            </span>
                            <span className="mt-3 text-xs uppercase tracking-widest text-muted-foreground font-medium">
                                {stat.label}
                            </span>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}