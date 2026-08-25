// components/dashboard/CommandesEnAttenteCard.tsx
import { Card } from "@/components/ui/card";
import { ClipboardList } from "lucide-react";

type CommandesEnAttenteCardProps = {
    nombre: number;
};

export function CommandesEnAttenteCard({ nombre }: CommandesEnAttenteCardProps) {
    return (
        <Card className="rounded-2xl bg-card p-4">
            <div className="mb-2.5 flex items-center gap-1.5">
                <ClipboardList className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                    Commandes en attente
                </span>
            </div>

            <p className="text-2xl font-medium text-card-foreground">{nombre}</p>

            <p className="mt-1 text-xs text-muted-foreground">
                {nombre === 0
                    ? "Aucune commande en attente"
                    : "En attente d'envoi ou de réception"}
            </p>
        </Card>
    );
}