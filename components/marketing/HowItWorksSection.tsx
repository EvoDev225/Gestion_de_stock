"use client";

import { motion, type Variants } from "motion/react";

type Step = {
  number: number;
  title: string;
  description: string;
};

const steps: Step[] = [
  {
    number: 1,
    title: "Ajoutez vos produits",
    description: "Importez ou saisissez votre catalogue en quelques minutes.",
  },
  {
    number: 2,
    title: "Suivez en temps réel",
    description: "Chaque vente et réception met à jour votre stock instantanément.",
  },
  {
    number: 3,
    title: "Décidez avec des données fiables",
    description: "Rapports, alertes et statistiques vous aident à anticiper.",
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
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const circleVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

export default function HowItWorksSection() {
  return (
    <section className="w-full py-24 px-6 border-t border-border bg-background overflow-hidden">
      <div className="max-w-5xl mx-auto flex flex-col items-center">
        
        <h2 className="text-3xl md:text-4xl font-bold text-foreground text-center mb-16">
          Comment ça marche
        </h2>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-12 w-full"
        >
          {steps.map((step) => (
            <motion.div
              key={step.title}
              variants={itemVariants}
              className="flex flex-col items-center text-center"
            >
              <motion.div
                variants={circleVariants}
                className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg mb-6 shadow-sm"
              >
                {step.number}
              </motion.div>
              
              <h3 className="font-semibold text-lg text-foreground mb-3">
                {step.title}
              </h3>
              
              <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
                {step.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
        
      </div>
    </section>
  );
}