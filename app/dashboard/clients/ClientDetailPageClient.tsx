"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Phone, Mail, MapPin, Edit, Trash2 } from "lucide-react";
import { ClientFormModal } from "@/components/admin/clients/ClientFormModal";
import type { ClientAvecVentes, Client } from "@/types/client";
import { ClientVentesHistorique } from "@/components/admin/clients/ClientVentesHistorique";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

interface ClientDetailPageClientProps {
    client: ClientAvecVentes;
    role: "ADMIN" | "EMPLOYEE";
}

export default function ClientDetailPageClient({
    client: clientInitial,
    role,
}: ClientDetailPageClientProps) {
    const router = useRouter();
    const [client, setClient] = useState<ClientAvecVentes>(clientInitial);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [isSupprimant, setIsSupprimant] = useState(false);
    const [erreurSuppression, setErreurSuppression] = useState<string | null>(null);

    function gererSucces(clientModifie: Client) {
        setClient((prev) => ({ ...prev, ...clientModifie }));
        setIsModalOpen(false);
    }

    async function confirmerSuppression() {
        setIsSupprimant(true);
        setErreurSuppression(null);

        try {
            const response = await fetch(`/api/clients/${client.id}`, {
                method: "DELETE",
            });
            const result = await response.json();

            if (!response.ok) {
                setErreurSuppression(result.error || "Erreur lors de la suppression");
                return;
            }

            router.push("/dashboard/clients");
        } catch (error) {
            setErreurSuppression("Erreur réseau, veuillez réessayer");
        } finally {
            setIsSupprimant(false);
        }
    }

    return (
        <div className="space-y-6">
            <Link
                href="/dashboard/clients"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
                <ArrowLeft className="h-4 w-4" />
                Retour aux clients
            </Link>

            <div className="bg-card border border-border rounded-lg p-6 space-y-4">
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                        <h1 className="text-xl font-semibold text-foreground">{client.nom}</h1>
                        <p className="text-sm text-muted-foreground mt-1">
                            {client._count?.ventes ?? 0} vente(s) enregistrée(s)
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-muted/50 text-foreground text-sm font-medium hover:bg-muted transition-colors"
                        >
                            <Edit className="h-4 w-4" />
                            Modifier
                        </button>

                        {role === "ADMIN" && (
                            <button
                                onClick={() => setIsConfirmOpen(true)}
                                className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-destructive/10 text-destructive text-sm font-medium hover:bg-destructive/20 transition-colors"
                            >
                                <Trash2 className="h-4 w-4" />
                                Supprimer
                            </button>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-border">
                    <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span className="text-foreground">{client.telephone}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className={client.email ? "text-foreground" : "text-muted-foreground"}>
                            {client.email ?? "Non communiqué"}
                        </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className={client.adresse ? "text-foreground" : "text-muted-foreground"}>
                            {client.adresse ?? "Non communiquée"}
                        </span>
                    </div>
                </div>
            </div>

            <div>
                <h2 className="text-lg font-semibold text-foreground mb-3">Historique d&apos;achats</h2>
                <ClientVentesHistorique ventes={client.ventes} />
            </div>

            <ClientFormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                clientAModifier={client}
                onSuccess={gererSucces}
            />

            <ConfirmDialog
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={confirmerSuppression}
                isConfirming={isSupprimant}
                titre="Supprimer ce client ?"
                message={`Voulez-vous vraiment supprimer ${client.nom} ? Cette action est irréversible.`}
                erreur={erreurSuppression}
            />
        </div>
    );
}