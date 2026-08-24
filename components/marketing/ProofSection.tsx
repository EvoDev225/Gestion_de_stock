import React from "react";

interface TechnicalProofCardProps {
    title: string;
    description: string;
    diagram: React.ReactNode;
}

function TechnicalProofCard({
    title,
    description,
    diagram,
}: TechnicalProofCardProps) {
    return (
        <div className="bg-surface border border-border rounded-xl p-6 flex flex-col justify-between">
            <div>
                {/* En-tête avec schéma technique */}
                <div className="h-[60px] w-full flex items-center justify-center text-accent mb-6 bg-background-subtle/50 rounded-lg border border-border/50">
                    {diagram}
                </div>

                {/* Titre & Description */}
                <h3 className="font-sans text-base font-medium text-foreground mb-2">
                    {title}
                </h3>
                <p className="font-sans text-sm text-foreground-muted leading-relaxed">
                    {description}
                </p>
            </div>
        </div>
    );
}

export function ProofSection() {
    return (
        <section className="bg-background-subtle py-24 px-4 md:px-8">
            <div className="mx-auto max-w-7xl">
                {/* Titre & Sous-titre */}
                <h2 className="font-display text-3xl font-medium text-foreground text-center mb-4">
                    Une architecture pensée, pas assemblée.
                </h2>
                <p className="font-sans text-foreground-muted text-center mb-16 max-w-[500px] mx-auto text-base">
                    Chaque décision technique répond à une exigence métier réelle.
                </p>

                {/* Grille 2x2 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Carte 1 : Modélisation Merise */}
                    <TechnicalProofCard
                        title="Modélisation Merise"
                        description="MCD, MLD et schéma SQL formalisés avant la première ligne de code, avec contraintes d'intégrité pensées dès la conception."
                        diagram={
                            <svg
                                width="180"
                                height="40"
                                viewBox="0 0 180 40"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                {/* Entité 1 */}
                                <rect x="5" y="8" width="45" height="24" rx="3" />
                                <line x1="5" y1="16" x2="50" y2="16" />
                                {/* Relation / Cardinalité */}
                                <line x1="50" y1="20" x2="80" y2="20" />
                                <polygon points="90,12 100,20 90,28 80,20" />
                                <line x1="100" y1="20" x2="130" y2="20" />
                                {/* Entité 2 */}
                                <rect x="130" y="8" width="45" height="24" rx="3" />
                                <line x1="130" y1="16" x2="175" y2="16" />
                            </svg>
                        }
                    />

                    {/* Carte 2 : Transactions atomiques */}
                    <TechnicalProofCard
                        title="Transactions atomiques"
                        description="Chaque opération métier (vente, réception, inventaire) est encapsulée dans une transaction : tout réussit, ou rien n'est appliqué."
                        diagram={
                            <svg
                                width="180"
                                height="40"
                                viewBox="0 0 180 40"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                {/* Flux principal */}
                                <circle cx="20" cy="20" r="4" />
                                <line x1="24" y1="20" x2="70" y2="20" />
                                <circle cx="74" cy="20" r="4" />
                                <line x1="78" y1="20" x2="124" y2="20" />
                                <circle cx="128" cy="20" r="4" strokeDasharray="2 2" />
                                {/* Rollback flèche */}
                                <path d="M 124 14 C 100 2, 50 2, 24 14" />
                                <polyline points="20,8 24,14 30,12" />
                            </svg>
                        }
                    />

                    {/* Carte 3 : Traçabilité complète */}
                    <TechnicalProofCard
                        title="Traçabilité complète"
                        description="Un journal d'activité horodaté enregistre chaque action sensible, avec l'utilisateur responsable."
                        diagram={
                            <svg
                                width="180"
                                height="40"
                                viewBox="0 0 180 40"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                {/* Ligne chronologique */}
                                <line x1="10" y1="20" x2="170" y2="20" />
                                {/* Jalons horodatés */}
                                <circle cx="30" cy="20" r="3" fill="currentColor" />
                                <line x1="30" y1="20" x2="30" y2="10" />
                                <circle cx="85" cy="20" r="3" fill="currentColor" />
                                <line x1="85" y1="20" x2="85" y2="30" />
                                <circle cx="145" cy="20" r="3" fill="currentColor" />
                                <line x1="145" y1="20" x2="145" y2="10" />
                            </svg>
                        }
                    />

                    {/* Carte 4 : Contrôle d'accès par rôle */}
                    <TechnicalProofCard
                        title="Contrôle d'accès par rôle"
                        description="Authentification et permissions vérifiées à chaque requête, avec séparation claire entre les rôles Admin et Employé."
                        diagram={
                            <svg
                                width="180"
                                height="40"
                                viewBox="0 0 180 40"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                {/* Rôle Admin (Bouclier) */}
                                <path d="M 45 10 L 60 10 L 60 22 C 60 28, 52.5 32, 52.5 32 C 52.5 32, 45 28, 45 22 Z" />
                                {/* Connexion / Séparation */}
                                <line x1="68" y1="20" x2="112" y2="20" strokeDasharray="3 3" />
                                {/* Rôle User (Badge) */}
                                <rect x="120" y="10" width="18" height="20" rx="2" />
                                <circle cx="129" cy="17" r="3" />
                                <path d="M 123 26 C 123 23, 135 23, 135 26" />
                            </svg>
                        }
                    />
                </div>
            </div>
        </section>
    );
}