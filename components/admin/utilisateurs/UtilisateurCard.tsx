import type { Utilisateur } from "@/types/utilisateur";
import RoleBadge from "./RoleBadge";
import StatutBadge from "./StatutBadge";

interface UtilisateurCardProps {
    utilisateur: Utilisateur;
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

export default function UtilisateurCard({
    utilisateur,
    utilisateurCourantId,
    onDemanderDesactivation,
}: UtilisateurCardProps) {
    const estSoiMeme = utilisateur.id === utilisateurCourantId;

    return (
        <div className="rounded-lg border border-border bg-card p-4 space-y-2">
            <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-foreground">{utilisateur.nom}</p>
                <RoleBadge role={utilisateur.role} />
            </div>
            <p className="text-sm text-muted-foreground">{utilisateur.email}</p>
            <div className="flex items-center justify-between">
                <StatutBadge actif={utilisateur.actif} />
                <span className="text-xs text-muted-foreground">Créé le {formaterDate(utilisateur.dateCreation)}</span>
            </div>
            <button
                type="button"
                onClick={() => onDemanderDesactivation(utilisateur)}
                disabled={estSoiMeme || !utilisateur.actif}
                className="w-full rounded-md border border-border px-3 py-1.5 text-sm font-medium text-foreground hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed"
            >
                {estSoiMeme ? "Votre compte" : !utilisateur.actif ? "Déjà désactivé" : "Désactiver"}
            </button>
        </div>
    );
}