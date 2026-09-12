import type { Utilisateur } from "@/types/utilisateur";
import RoleBadge from "./RoleBadge";
import StatutBadge from "./StatutBadge";

interface UtilisateursTableProps {
    utilisateurs: Utilisateur[];
    utilisateurCourantId: string;
    onDemanderDesactivation: (utilisateur: Utilisateur) => void;
}

function formaterDate(iso: string) {
    return new Date(iso).toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });
}

export default function UtilisateursTable({
    utilisateurs,
    utilisateurCourantId,
    onDemanderDesactivation,
}: UtilisateursTableProps) {
    return (
        <div className="overflow-hidden rounded-lg border border-border bg-card">
            <table className="min-w-full divide-y divide-border">
                <thead className="bg-muted">
                    <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-muted-foreground">Nom</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-muted-foreground">Email</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-muted-foreground">Rôle</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-muted-foreground">Statut</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-muted-foreground">Créé le</th>
                        <th className="px-4 py-3 text-right text-xs font-semibold uppercase text-muted-foreground">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-border">
                    {utilisateurs.map((utilisateur) => {
                        const estSoiMeme = utilisateur.id === utilisateurCourantId;
                        return (
                            <tr key={utilisateur.id} className="hover:bg-muted/50">
                                <td className="px-4 py-3 text-sm text-foreground">{utilisateur.nom}</td>
                                <td className="px-4 py-3 text-sm text-muted-foreground">{utilisateur.email}</td>
                                <td className="px-4 py-3"><RoleBadge role={utilisateur.role} /></td>
                                <td className="px-4 py-3"><StatutBadge actif={utilisateur.actif} /></td>
                                <td className="px-4 py-3 text-sm text-muted-foreground">{formaterDate(utilisateur.dateCreation)}</td>
                                <td className="px-4 py-3 text-right">
                                    <button
                                        type="button"
                                        onClick={() => onDemanderDesactivation(utilisateur)}
                                        disabled={estSoiMeme || !utilisateur.actif}
                                        title={
                                            estSoiMeme
                                                ? "Vous ne pouvez pas désactiver votre propre compte"
                                                : !utilisateur.actif
                                                ? "Compte déjà désactivé"
                                                : "Désactiver ce compte"
                                        }
                                        className="rounded-md px-3 py-1.5 text-sm font-medium text-foreground hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                                    >
                                        Désactiver
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                    {utilisateurs.length === 0 && (
                        <tr>
                            <td colSpan={6} className="px-4 py-8 text-center text-sm text-muted-foreground">
                                Aucun utilisateur trouvé pour ce filtre.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}