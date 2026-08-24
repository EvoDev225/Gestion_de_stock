import React from "react";

interface StatCardProps {
    stat: string;
    statColor?: "accent" | "danger";
    title: string;
    description: string;
}

function StatCard({
    stat,
    statColor = "accent",
    title,
    description,
}: StatCardProps) {
    const textColorClass =
        statColor === "danger" ? "text-danger" : "text-accent";

    return (
        <div className="flex flex-col items-start text-left">
            <div
                className={`font-display text-5xl font-medium ${textColorClass} mb-3`}
            >
                {stat}
            </div>
            <h3 className="font-sans text-base font-medium text-foreground mb-2">
                {title}
            </h3>
            <p className="font-sans text-sm text-foreground-muted leading-relaxed">
                {description}
            </p>
        </div>
    );
}

export function CostOfInactionSection() {
    return (
        <section className="bg-background-subtle py-24 px-4 md:px-8">
            <div className="mx-auto max-w-7xl">
                {/* Titre de section */}
                <h2 className="font-display text-3xl font-medium text-foreground text-center mb-12">
                    Le coût de l'inaction
                </h2>

                {/* Grille de 3 colonnes */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <StatCard
                        stat="23%"
                        statColor="accent"
                        title="Rupture de stock"
                        description="Des ventes perdues chaque mois faute de visibilité sur les niveaux réels."
                    />
                    <StatCard
                        stat="15%"
                        statColor="accent"
                        title="Surstockage & pertes"
                        description="Du capital immobilisé dans des produits qui expirent ou se démodent avant d'être vendus."
                    />
                    <StatCard
                        stat="0"
                        statColor="danger"
                        title="Traçabilité"
                        description="Aucune trace exploitable des mouvements de stock en cas de litige ou d'audit."
                    />
                </div>
            </div>
        </section>
    );
}