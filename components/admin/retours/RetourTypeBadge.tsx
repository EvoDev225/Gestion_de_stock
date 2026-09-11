import type { TypeRetour } from "@/types/retour";

interface RetourTypeBadgeProps {
    type: TypeRetour;
}

export default function RetourTypeBadge({ type }: RetourTypeBadgeProps) {
    const estClient = type === "CLIENT";

    return (
        <span
            className={
                estClient
                    ? "inline-flex items-center rounded-full border border-border bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary"
                    : "inline-flex items-center rounded-full border border-border bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground"
            }
        >
            {estClient ? "Client" : "Fournisseur"}
        </span>
    );
}