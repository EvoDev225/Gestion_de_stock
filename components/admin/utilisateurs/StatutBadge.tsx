interface StatutBadgeProps {
    actif: boolean;
}

export default function StatutBadge({ actif }: StatutBadgeProps) {
    return (
        <span
            className={
                actif
                    ? "inline-flex items-center rounded-full border border-border bg-card px-2.5 py-0.5 text-xs font-medium text-foreground"
                    : "inline-flex items-center rounded-full border border-border bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground"
            }
        >
            {actif ? "Actif" : "Inactif"}
        </span>
    );
}