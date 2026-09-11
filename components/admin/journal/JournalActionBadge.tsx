import { Activity, Pencil, PlusCircle, Trash2 } from "lucide-react";

export interface JournalActionBadgeProps {
    action: string;
}


function determinerCategorieAction(action: string): "creation" | "modification" | "suppression" | "autre" {
    const actionMajuscule = action.toUpperCase();

    if (actionMajuscule.includes("CREE") || actionMajuscule.includes("CREATION")) {
        return "creation";
    }

    if (
        actionMajuscule.includes("MODIFIE") ||
        actionMajuscule.includes("MODIFICATION") ||
        actionMajuscule.includes("VALIDE") ||
        actionMajuscule.includes("VALIDATION")
    ) {
        return "modification";
    }

    if (actionMajuscule.includes("SUPPRIME") || actionMajuscule.includes("SUPPRESSION")) {
        return "suppression";
    }

    return "autre";
}


function formaterTexteAction(action: string): string {
    const texteBase = action.replaceAll("_", " ").trim().toLowerCase();

    if (texteBase.length === 0) {
        return "";
    }

    return texteBase.charAt(0).toUpperCase() + texteBase.slice(1);
}

export default function JournalActionBadge({ action }: JournalActionBadgeProps) {
    const categorie = determinerCategorieAction(action);
    const texteAffiche = formaterTexteAction(action);

    return (
        <span className="inline-flex items-center gap-1.5 rounded-md border border-border bg-muted/50 px-2 py-1 text-xs font-medium text-foreground">
            {categorie === "creation" && (
                <PlusCircle size={14} className="text-muted-foreground" aria-hidden="true" />
            )}
            {categorie === "modification" && (
                <Pencil size={14} className="text-muted-foreground" aria-hidden="true" />
            )}
            {categorie === "suppression" && (
                <Trash2 size={14} className="text-muted-foreground" aria-hidden="true" />
            )}
            {categorie === "autre" && (
                <Activity size={14} className="text-muted-foreground" aria-hidden="true" />
            )}
            {texteAffiche}
        </span>
    );
}