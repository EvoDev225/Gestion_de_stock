// components/CommandeCard.tsx

import Link from "next/link";
import type { CommandeFournisseur } from "@/types/commande-fournisseur";
import { Calendar, Building2, Layers, Banknote } from "lucide-react";

const statutConfig = {
    EN_ATTENTE: { label: "En attente", classes: "bg-muted text-muted-foreground" },
    ENVOYEE: { label: "Envoyée", classes: "bg-accent-subtle text-accent-hover" },
    RECUE_PARTIELLE: { label: "Reçue partielle", classes: "bg-warning/10 text-warning" },
    RECUE: { label: "Reçue", classes: "bg-primary/10 text-primary" },
} as const;

function formatDate(dateString: string): string {
    return new Intl.DateTimeFormat("fr-FR", {
        day: "numeric",
        month: "short",
        year: "numeric",
    }).format(new Date(dateString));
}

function formatMontant(montant: number): string {
    return new Intl.NumberFormat("fr-FR").format(montant) + " FCFA";
}

function calculateTotal(lignes: CommandeFournisseur["ligneCommandeFournisseur"]): number {
    return lignes.reduce((sum, ligne) => {
        return sum + Number(ligne.quantiteCommande) * Number(ligne.prixAchatUnitaire);
    }, 0);
}

interface CommandeCardProps {
    commande: CommandeFournisseur;
}

export default function CommandeCard({ commande }: CommandeCardProps) {
    const statut = statutConfig[commande.statut];
    const total = calculateTotal(commande.ligneCommandeFournisseur);

    return (
        <Link
            href={`/dashboard/commandes-fournisseur/${commande.id}`}
            className="block rounded-xl border border-border bg-card p-6 transition-colors hover:bg-muted/30"
        >
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" aria-hidden="true" />
                    <span>{formatDate(commande.dateCommande)}</span>
                </div>
                <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${statut.classes}`}>
                    {statut.label}
                </span>
            </div>

            <div className="flex items-center gap-2 mb-4">
                <Building2 className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
                <h3 className="text-lg font-semibold text-foreground truncate">
                    {commande.fournisseur.nom}
                </h3>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                <div className="flex items-center gap-2">
                    <Layers className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                    <div>
                        <p className="text-xs text-muted-foreground">Lignes</p>
                        <p className="text-sm font-medium text-foreground">
                            {commande.ligneCommandeFournisseur.length}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Banknote className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                    <div>
                        <p className="text-xs text-muted-foreground">Total</p>
                        <p className="text-sm font-bold text-primary">
                            {formatMontant(total)}
                        </p>
                    </div>
                </div>
            </div>
        </Link>
    );
}