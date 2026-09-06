// components/CommandesTable.tsx

import Link from "next/link";
import { ClipboardList } from "lucide-react";
import type { CommandeFournisseur } from "@/types/commande-fournisseur";

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

interface CommandesTableProps {
    commandes: CommandeFournisseur[];
}

export default function CommandesTable({ commandes }: CommandesTableProps) {
    return (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
            <table className="w-full text-left">
                <thead className="bg-muted/50 border-b border-border text-xs font-medium text-muted-foreground uppercase">
                    <tr>
                        <th className="py-3 px-6">Date</th>
                        <th className="py-3 px-6">Fournisseur</th>
                        <th className="py-3 px-6">Nb. lignes</th>
                        <th className="py-3 px-6">Montant total</th>
                        <th className="py-3 px-6">Statut</th>
                    </tr>
                </thead>
                <tbody>
                    {commandes.length === 0 ? (
                        <tr>
                            <td colSpan={5} className="py-12 px-6 text-center text-muted-foreground">
                                <div className="flex flex-col items-center gap-3">
                                    <ClipboardList className="h-10 w-10 opacity-50" aria-hidden="true" />
                                    <span className="text-sm font-medium">Aucune commande trouvée</span>
                                </div>
                            </td>
                        </tr>
                    ) : (
                        commandes.map((commande) => {
                            const statut = statutConfig[commande.statut];
                            const total = calculateTotal(commande.ligneCommandeFournisseur);

                            return (
                                <tr
                                    key={commande.id}
                                    className="border-b border-border transition-colors hover:bg-muted/30"
                                >
                                    <td colSpan={5} className="p-0">
                                        <Link
                                            href={`/dashboard/commandes-fournisseur/${commande.id}`}
                                            className="grid grid-cols-5 items-center px-6 py-4"
                                        >
                                            <span className="text-sm font-medium text-foreground">
                                                {formatDate(commande.dateCommande)}
                                            </span>
                                            <span className="text-sm text-muted-foreground truncate">
                                                {commande.fournisseur.nom}
                                            </span>
                                            <span className="text-sm text-muted-foreground">
                                                {commande.ligneCommandeFournisseur.length}
                                            </span>
                                            <span className="text-sm font-semibold text-foreground">
                                                {formatMontant(total)}
                                            </span>
                                            <span
                                                className={`inline-flex w-fit items-center rounded-full px-2.5 py-1 text-xs font-medium ${statut.classes}`}
                                            >
                                                {statut.label}
                                            </span>
                                        </Link>
                                    </td>
                                </tr>
                            );
                        })
                    )}
                </tbody>
            </table>
        </div>
    );
}