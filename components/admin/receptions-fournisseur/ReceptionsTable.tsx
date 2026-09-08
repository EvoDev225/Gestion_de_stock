"use client";

import { PackageCheck, Eye } from "lucide-react";
import Link from "next/link";
import { motion } from "motion/react";
import type { ReceptionFournisseur } from "@/types/reception-fournisseur";

interface ReceptionsTableProps {
    receptions: ReceptionFournisseur[];
    isLoading?: boolean;
}

// --- Utilitaires ---

const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });
};

const getTotalQuantity = (
    lignes: ReceptionFournisseur["lignesReception"]
): number => {
    return lignes.reduce((sum, ligne) => sum + ligne.quantiteRecue, 0);
};

const formatUserName = (
    user?: {  nom: string } | null
): string => {
    if (!user) return "Inconnu";
    return ` ${user.nom}`;
};

// --- Sous-composants ---

const StatusBadge = ({ statut }: { statut: string | undefined }) => {
    let classes = "bg-accent-subtle text-accent-hover";
    let label = statut || "Inconnu";

    if (statut === "RECUE") {
        classes = "bg-primary/10 text-primary";
        label = "Reçue";
    } else if (statut === "RECUE_PARTIELLE") {
        classes = "bg-warning/10 text-warning";
        label = "Partielle";
    }

    return (
        <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${classes}`}
        >
            {label}
        </span>
    );
};

const SkeletonRow = () => (
    <tr className="border-b border-border">
        {Array.from({ length: 7 }).map((_, i) => (
            <td key={i} className="px-4 py-4">
                <div className="h-4 bg-muted/30 rounded animate-pulse w-full max-w-[120px]" />
            </td>
        ))}
    </tr>
);

const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-16 text-center bg-card rounded-lg border border-border">
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-muted/30 mb-4">
            <PackageCheck className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground">
            Aucune réception enregistrée
        </h3>
        <p className="text-sm text-muted-foreground mt-1 max-w-sm">
            Les réceptions de commandes fournisseurs apparaîtront ici une fois
            traitées.
        </p>
    </div>
);

// --- Composant Principal ---

export default function ReceptionsTable({
    receptions,
    isLoading,
}: ReceptionsTableProps) {
    if (isLoading) {
        return (
            <div className="w-full overflow-x-auto rounded-lg border border-border bg-card">
                <table className="w-full text-left">
                    <thead className="bg-muted/30">
                        <tr>
                            <th className="px-4 py-3 text-xs font-medium uppercase text-muted-foreground">
                                Date
                            </th>
                            <th className="px-4 py-3 text-xs font-medium uppercase text-muted-foreground">
                                Fournisseur
                            </th>
                            <th className="px-4 py-3 text-xs font-medium uppercase text-muted-foreground">
                                Lignes
                            </th>
                            <th className="px-4 py-3 text-xs font-medium uppercase text-muted-foreground">
                                Qté Totale
                            </th>
                            <th className="px-4 py-3 text-xs font-medium uppercase text-muted-foreground">
                                Reçu par
                            </th>
                            <th className="px-4 py-3 text-xs font-medium uppercase text-muted-foreground">
                                Statut
                            </th>
                            <th className="px-4 py-3 text-xs font-medium uppercase text-muted-foreground text-right">
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.from({ length: 5 }).map((_, i) => (
                            <SkeletonRow key={i} />
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }

    if (receptions.length === 0) {
        return <EmptyState />;
    }

    return (
        <div className="w-full overflow-x-auto rounded-lg border border-border bg-card">
            <table className="w-full text-left text-sm">
                <thead className="bg-muted/30 text-xs uppercase text-muted-foreground">
                    <tr>
                        <th className="px-4 py-3 font-medium">Date</th>
                        <th className="px-4 py-3 font-medium">Fournisseur</th>
                        <th className="px-4 py-3 font-medium">Lignes</th>
                        <th className="px-4 py-3 font-medium">Qté Totale</th>
                        <th className="px-4 py-3 font-medium">Reçu par</th>
                        <th className="px-4 py-3 font-medium">Statut</th>
                        <th className="px-4 py-3 font-medium text-right">Action</th>
                    </tr>
                </thead>
                <motion.tbody
                    initial="hidden"
                    animate="visible"
                    variants={{
                        visible: { transition: { staggerChildren: 0.05 } },
                    }}
                    className="divide-y divide-border"
                >
                    {receptions.map((reception) => (
                        <motion.tr
                            key={reception.id}
                            variants={{
                                hidden: { opacity: 0, y: 10 },
                                visible: { opacity: 1, y: 0 },
                            }}
                            className="hover:bg-muted/30 transition-colors"
                        >
                            <td className="px-4 py-3 whitespace-nowrap text-foreground">
                                {formatDate(reception.dateReception)}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-foreground">
                                {reception.commandeFournisseur?.fournisseur.nom || "N/A"}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">
                                {reception.lignesReception.length}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-foreground font-medium">
                                {getTotalQuantity(reception.lignesReception)}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">
                                {formatUserName(reception.utilisateur)}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                                <StatusBadge statut={reception.commandeFournisseur?.statut} />
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-right">
                                <Link
                                    href={`/dashboard/receptions-fournisseur/${reception.id}`}
                                    className="inline-flex items-center gap-1.5 text-primary hover:text-primary/80 transition-colors font-medium"
                                >
                                    <Eye className="h-4 w-4" />
                                    Voir détail
                                </Link>
                            </td>
                        </motion.tr>
                    ))}
                </motion.tbody>
            </table>
        </div>
    );
}