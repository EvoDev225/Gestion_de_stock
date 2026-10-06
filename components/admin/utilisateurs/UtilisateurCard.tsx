import type { Utilisateur } from "@/types/utilisateur";
import RoleBadge from "./RoleBadge";
import StatutBadge from "./StatutBadge";

interface UtilisateurCardProps {
    utilisateur: Utilisateur;
    utilisateurCourantId: string;
    onDemanderDesactivation: (utilisateur: Utilisateur) => void;
    onDemanderReactivation: (utilisateur: Utilisateur) => void;
}

function formaterDate(iso: string) {
    return new Date(iso).toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });
}

export default function UtilisateurCard({
    utilisateur,
    utilisateurCourantId,
    onDemanderDesactivation,
    onDemanderReactivation,
}: UtilisateurCardProps) {
    const estSoiMeme = utilisateur.id === utilisateurCourantId;

    return (
        <div className="rounded-lg border border-border bg-card p-4 space-y-3">
            <div className="flex items-start justify-between">
                <div className="space-y-1">
                    <h3 className="font-semibold text-foreground">{utilisateur.nom}</h3>
                    <p className="text-sm text-muted-foreground">{utilisateur.email}</p>
                </div>
                <div className="flex flex-col gap-1 items-end">
                    <RoleBadge role={utilisateur.role} />
                    <StatutBadge actif={utilisateur.actif} />
                </div>
            </div>

            <div className="text-xs text-muted-foreground">
                Créé le {formaterDate(utilisateur.dateCreation)}
            </div>

            <div className="pt-2 border-t border-border">
                {utilisateur.actif ? (
                    <button
                        type="button"
                        onClick={() => onDemanderDesactivation(utilisateur)}
                        disabled={estSoiMeme}
                        title={
                            estSoiMeme
                                ? "Vous ne pouvez pas désactiver votre propre compte"
                                : "Désactiver ce compte"
                        }
                        className="w-full rounded-md px-3 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent transition-colors"
                    >
                        Désactiver
                    </button>
                ) : (
                    <button
                        type="button"
                        onClick={() => onDemanderReactivation(utilisateur)}
                        className="w-full rounded-md px-3 py-2 text-sm font-medium text-primary hover:bg-primary/10 transition-colors"
                    >
                        Réactiver
                    </button>
                )}
            </div>
        </div>
    );
}