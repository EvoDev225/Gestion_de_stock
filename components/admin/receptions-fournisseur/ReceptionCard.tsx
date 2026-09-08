"use client";

import { Calendar, User } from "lucide-react";
import Link from "next/link";
import { motion } from "motion/react";
import type { ReceptionFournisseur } from "@/types/reception-fournisseur";

interface ReceptionCardProps {
    reception: ReceptionFournisseur;
}

// --- Utilitaires ---

const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });
};

// --- Sous-composants ---

const StatusBadge = ({ statut }: { statut?: string }) => {
    let classes = "bg-accent-subtle text-accent-hover";
    let label = "Statut inconnu";

    if (statut === "RECUE") {
        classes = "bg-primary/10 text-primary";
        label = "Reçue";
    } else if (statut === "RECUE_PARTIELLE") {
        classes = "bg-warning/10 text-warning";
        label = "Partielle";
    }

    return (
        <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium shrink-0 ${classes}`}
        >
            {label}
        </span>
    );
};

// --- Composant Principal ---

export default function ReceptionCard({ reception }: ReceptionCardProps) {
    const lignes = reception.lignesReception;
    const displayedLignes = lignes.slice(0, 3);
    const remainingCount = lignes.length - 3;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="bg-card border border-border rounded-lg p-4 flex flex-col gap-4"
        >
            {/* En-tête : Fournisseur + Date + Statut */}
            <div className="flex justify-between items-start gap-3">
                <div className="flex flex-col gap-1 min-w-0">
                    <h3 className="text-foreground font-semibold text-base truncate">
                        {reception.commandeFournisseur?.fournisseur.nom || "Fournisseur inconnu"}
                    </h3>
                    <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
                        <Calendar className="h-4 w-4 shrink-0" />
                        <span>{formatDate(reception.dateReception)}</span>
                    </div>
                </div>
                <StatusBadge statut={reception.commandeFournisseur?.statut} />
            </div>

            {/* Liste compacte des produits reçus */}
            <div className="flex flex-col gap-2 bg-muted/30 rounded-md p-3">
                {displayedLignes.map((ligne) => (
                    <div
                        key={ligne.id}
                        className="flex justify-between items-center text-sm gap-2"
                    >
                        <span className="text-foreground truncate">
                            {ligne.ligneCommandeFournisseur.produit.nom}
                        </span>
                        <span className="text-muted-foreground font-medium whitespace-nowrap">
                            x{ligne.quantiteRecue}
                        </span>
                    </div>
                ))}

                {remainingCount > 0 && (
                    <div className="text-primary text-sm font-medium pt-1 border-t border-border">
                        +{remainingCount} autre{remainingCount > 1 ? "s" : ""}
                    </div>
                )}
            </div>

            {/* Pied de carte : Utilisateur + Action */}
            <div className="flex items-center justify-between gap-2 pt-2 border-t border-border">
                <div className="flex items-center gap-1.5 text-sm min-w-0">
                    <User className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span className="text-muted-foreground shrink-0">Reçu par</span>
                    <span className="text-foreground font-medium truncate">
                        {reception.utilisateur
                            ? `${reception.utilisateur.prenom} ${reception.utilisateur.nom}`
                            : "Inconnu"}
                    </span>
                </div>

                <Link
                    href={`/dashboard/receptions-fournisseur/${reception.id}`}
                    className="bg-primary text-primary-foreground rounded-md px-3 py-1.5 text-sm font-medium transition-colors shrink-0"
                >
                    Voir détail
                </Link>
            </div>
        </motion.div>
    );
}