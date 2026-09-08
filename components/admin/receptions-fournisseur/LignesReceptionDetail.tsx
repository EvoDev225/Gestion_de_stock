"use client";

import { motion } from "motion/react";
import type { LigneReception } from "@/types/reception-fournisseur";

interface LignesReceptionDetailProps {
    lignesReception: LigneReception[];
}

// --- Utilitaires ---

const parsePrice = (priceStr: string): number => {
    const parsed = parseFloat(priceStr);
    return isNaN(parsed) ? 0 : parsed;
};

const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: "EUR",
    }).format(amount);
};

// --- Composant Principal ---

export default function LignesReceptionDetail({
    lignesReception,
}: LignesReceptionDetailProps) {

    const totalGeneral = lignesReception.reduce((acc, ligne) => {
        const prixUnitaire = parsePrice(ligne.ligneCommandeFournisseur.prixAchatUnitaire);
        return acc + ligne.quantiteRecue * prixUnitaire;
    }, 0);

    return (
        <div className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-muted/30 text-xs uppercase text-muted-foreground">
                        <tr>
                            <th className="px-4 py-3 font-medium">Produit</th>
                            <th className="px-4 py-3 font-medium text-right">Qté Commandée</th>
                            <th className="px-4 py-3 font-medium text-right">Qté Reçue</th>
                            <th className="px-4 py-3 font-medium text-right">Prix Unitaire</th>
                            <th className="px-4 py-3 font-medium text-right">Sous-total</th>
                        </tr>
                    </thead>

                    <motion.tbody
                        initial="hidden"
                        animate="visible"
                        variants={{
                            visible: { transition: { staggerChildren: 0.05 } },
                        }}
                    >
                        {lignesReception.map((ligne) => {
                            const prixUnitaire = parsePrice(ligne.ligneCommandeFournisseur.prixAchatUnitaire);
                            const sousTotal = ligne.quantiteRecue * prixUnitaire;

                            return (
                                <motion.tr
                                    key={ligne.id}
                                    variants={{
                                        hidden: { opacity: 0, x: -5 },
                                        visible: { opacity: 1, x: 0 },
                                    }}
                                    className="border-b border-border hover:bg-muted/30 transition-colors"
                                >
                                    {/* Produit */}
                                    <td className="px-4 py-4">
                                        <div className="text-foreground font-medium">
                                            {ligne.ligneCommandeFournisseur.produit.nom}
                                        </div>
                                        <div className="text-muted-foreground text-xs mt-0.5 font-mono">
                                            SKU: {ligne.ligneCommandeFournisseur.produit.sku}
                                        </div>
                                    </td>

                                    {/* Quantité Commandée */}
                                    <td className="px-4 py-4 text-right text-foreground">
                                        {ligne.ligneCommandeFournisseur.quantiteCommande}
                                    </td>

                                    {/* Quantité Reçue (Mise en valeur) */}
                                    <td className="px-4 py-4 text-right text-primary font-semibold">
                                        {ligne.quantiteRecue}
                                    </td>

                                    {/* Prix Unitaire */}
                                    <td className="px-4 py-4 text-right text-foreground">
                                        {formatCurrency(prixUnitaire)}
                                    </td>

                                    {/* Sous-total */}
                                    <td className="px-4 py-4 text-right text-foreground font-medium">
                                        {formatCurrency(sousTotal)}
                                    </td>
                                </motion.tr>
                            );
                        })}
                    </motion.tbody>

                    {/* Pied de tableau : Total */}
                    <tfoot>
                        <tr className="bg-muted/30">
                            <td
                                colSpan={4}
                                className="px-4 py-3 text-right text-foreground font-semibold text-sm uppercase tracking-wide"
                            >
                                Total Reçu
                            </td>
                            <td className="px-4 py-3 text-right text-foreground font-bold text-base">
                                {formatCurrency(totalGeneral)}
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    );
}