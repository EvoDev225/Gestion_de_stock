import { motion } from 'motion/react';
import { ExternalLink } from 'lucide-react';
import Link from 'next/link';
import type { VenteResume } from '@/types/client';

interface ClientVentesHistoriqueProps {
    ventes: VenteResume[];
}

function formatDate(dateString: string): string {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR',
    }).format(amount);
}

function ModePaiementBadge({ mode }: { mode: string }) {
    const isTotal = mode === 'TOTAL';

    return (
        <span
            className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${isTotal ? 'bg-primary/10 text-primary' : 'bg-warning/10 text-warning'
                }`}
        >
            {mode}
        </span>
    );
}

function StatutBadge({ statut }: { statut: string }) {
    const isValidee = statut === 'VALIDEE';

    return (
        <span
            className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${isValidee ? 'bg-primary/10 text-primary' : 'bg-destructive/10 text-destructive'
                }`}
        >
            {statut}
        </span>
    );
}

export function ClientVentesHistorique({ ventes }: ClientVentesHistoriqueProps) {
    if (ventes.length === 0) {
        return (
            <div className="text-center py-12 text-muted-foreground">
                Aucun achat enregistré pour ce client.
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-card border border-border rounded-lg overflow-hidden"
        >
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-border bg-muted/30">
                            <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">
                                Date
                            </th>
                            <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">
                                Montant total
                            </th>
                            <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">
                                Mode de paiement
                            </th>
                            <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">
                                Statut
                            </th>
                            <th className="text-right px-4 py-3 text-sm font-medium text-muted-foreground">
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {ventes.map((vente, index) => (
                            <motion.tr
                                key={vente.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.2, delay: index * 0.05 }}
                                className="border-b border-border hover:bg-muted/50 transition-colors"
                            >
                                <td className="px-4 py-3 text-sm text-foreground">
                                    {formatDate(vente.date)}
                                </td>
                                <td className="px-4 py-3 text-sm font-semibold text-foreground">
                                    {formatCurrency(vente.montantTotal)}
                                </td>
                                <td className="px-4 py-3">
                                    <ModePaiementBadge mode={vente.modePaiement} />
                                </td>
                                <td className="px-4 py-3">
                                    <StatutBadge statut={vente.statut} />
                                </td>
                                <td className="px-4 py-3 text-right">
                                    <Link
                                        href={`/admin/ventes/${vente.id}`}
                                        className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-primary hover:bg-primary/10 rounded-md transition-colors"
                                    >
                                        <span>Voir</span>
                                        <ExternalLink className="w-4 h-4" />
                                    </Link>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </motion.div>
    );
}