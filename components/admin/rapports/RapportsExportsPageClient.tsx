"use client";

import type { Rapport, InventaireOption } from "@/types/rapport";
import RapportsSection from "./RapportsSection";
import ExportsSection from "./ExportsSection";

interface RapportsExportsPageClientProps {
    role: "ADMIN" | "EMPLOYEE";
    rapportsInitiaux: Rapport[];
    inventaires: InventaireOption[];
}

/**
 * Composant orchestrateur de la page Rapports & Exports.
 *
 * - La section "Rapports IA" est affichée uniquement pour le rôle ADMIN.
 * - La section "Exports Excel" est affichée pour tous les rôles,
 *   avec un contenu adapté au rôle courant.
 */
export default function RapportsExportsPageClient({
    role,
    rapportsInitiaux,
    inventaires,
}: RapportsExportsPageClientProps) {
    return (
        <div className="space-y-8">
            {/* Section Rapports IA, réservée aux administrateurs */}
            {role === "ADMIN" && (
                <RapportsSection rapportsInitiaux={rapportsInitiaux} />
            )}

            {/* Section Exports Excel, visible par tous */}
            <ExportsSection role={role} inventaires={inventaires} />
        </div>
    );
}