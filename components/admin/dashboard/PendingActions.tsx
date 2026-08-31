import Link from "next/link";
import { ClipboardCheck, Truck, ClipboardX } from "lucide-react";


export type PendingActionType = "inventaire" | "commande_retard" | "retour";

export interface PendingAction {
    id: string;
    type: PendingActionType;
    titre: string;
    description: string;
    href?: string;
}

export interface PendingActionsProps {
    actions: PendingAction[];
    isLoading?: boolean;
}

// Mapping interne pour les icônes et les classes de couleur associées
const ACTION_CONFIG: Record<
    PendingActionType,
    { icon: React.ElementType; colorClass: string }
> = {
    inventaire: {
        icon: ClipboardCheck,
        colorClass: "text-warning",
    },
    commande_retard: {
        icon: Truck,
        colorClass: "text-destructive",
    },
    retour: {
        icon: ClipboardX,
        colorClass: "text-primary",
    },
};

export default function PendingActions({
    actions,
    isLoading = false,
}: PendingActionsProps) {
    const MAX_DISPLAYED_ACTIONS = 5;
    const displayedActions = actions.slice(0, MAX_DISPLAYED_ACTIONS);
    const hasMore = actions.length > MAX_DISPLAYED_ACTIONS;

    // État de chargement : 3 skeletons
    if (isLoading) {
        return (
            <div className="lg:col-span-1 bg-card rounded-[24px] p-8 shadow-sm">
                <h3 className="text-lg font-semibold text-foreground mb-4">
                    Actions en attente
                </h3>
                <div className="space-y-3">
                    {[...Array(3)].map((_, index) => (
                        <div
                            key={index}
                            className="flex items-center gap-3 p-3 rounded-xl border border-border bg-card animate-pulse"
                        >
                            <div className="w-9 h-9 rounded-full bg-muted" />
                            <div className="flex-1 space-y-2">
                                <div className="h-4 bg-muted rounded w-3/4" />
                                <div className="h-3 bg-muted rounded w-1/2" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // État vide
    if (actions.length === 0) {
        return (
            <div className="lg:col-span-1 bg-card rounded-[24px] p-8 shadow-sm flex flex-col items-center justify-center min-h-[200px]">
                <h3 className="text-lg font-semibold text-foreground mb-2">
                    Actions en attente
                </h3>
                <p className="text-muted-foreground text-center">
                    Aucune action en attente 👍
                </p>
            </div>
        );
    }

    return (
        <div className="lg:col-span-1 bg-card rounded-[24px] p-8 shadow-sm">
            <h3 className="text-lg font-semibold text-foreground mb-4">
                Actions en attente
            </h3>

            <div className="space-y-3">
                {displayedActions.map((action) => {
                    const config = ACTION_CONFIG[action.type];
                    const Icon = config.icon;

                    const content = (
                        <>
                            <div
                                className={`flex-shrink-0 flex items-center justify-center w-9 h-9 rounded-full bg-muted/50 ${config.colorClass}`}
                            >
                                <Icon className="w-5 h-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-foreground truncate">
                                    {action.titre}
                                </p>
                                <p className="text-xs text-muted-foreground truncate">
                                    {action.description}
                                </p>
                            </div>
                            {action.href && (
                                <svg
                                    className="w-4 h-4 text-muted-foreground flex-shrink-0"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 5l7 7-7 7"
                                    />
                                </svg>
                            )}
                        </>
                    );

                    // Rendu conditionnel : cliquable (Link) ou statique (div)
                    if (action.href) {
                        return (
                            <Link
                                key={action.id}
                                href={action.href}
                                className="flex items-center gap-3 p-3 rounded-xl border border-border bg-card hover:bg-muted/50 transition-colors cursor-pointer"
                            >
                                {content}
                            </Link>
                        );
                    }

                    return (
                        <div
                            key={action.id}
                            className="flex items-center gap-3 p-3 rounded-xl border border-border bg-card"
                        >
                            {content}
                        </div>
                    );
                })}
            </div>

            {hasMore && (
                <div className="mt-5 text-center">
                    <Link
                        href="#"
                        className="text-sm font-medium text-primary hover:underline transition-all"
                    >
                        Voir tout
                    </Link>
                </div>
            )}
        </div>
    );
}