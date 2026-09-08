"use client";

import { useState, useMemo } from "react";
import { Plus, Search } from "lucide-react";
import {ClientsTable} from "@/components/admin/clients/ClientsTable";
import {ClientFormModal} from "@/components/admin/clients/ClientFormModal";
import {ClientCard} from "@/components/admin/clients/ClientCard";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import type { Client } from "@/types/client";

interface ClientsPageClientProps {
    clients: Client[];
    role: "ADMIN" | "EMPLOYEE";
}

export default function ClientsPageClient({ clients, role }: ClientsPageClientProps) {
    const [listeClients, setListeClients] = useState<Client[]>(clients);
    const [recherche, setRecherche] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [clientAModifier, setClientAModifier] = useState<Client | null>(null);
    const [clientASupprimer, setClientASupprimer] = useState<Client | null>(null);
    const [isSupprimantClient, setIsSupprimantClient] = useState(false);
    const [erreurSuppression, setErreurSuppression] = useState<string | null>(null);

    const clientsFiltres = useMemo(() => {
        const termeRecherche = recherche.toLowerCase().trim();
        if (!termeRecherche) return listeClients;

        return listeClients.filter(
            (client) =>
                client.nom.toLowerCase().includes(termeRecherche) ||
                client.telephone.includes(termeRecherche) ||
                (client.email?.toLowerCase().includes(termeRecherche) ?? false)
        );
    }, [listeClients, recherche]);

    function ouvrirCreation() {
        setClientAModifier(null);
        setIsModalOpen(true);
    }

    function ouvrirEdition(client: Client) {
        setClientAModifier(client);
        setIsModalOpen(true);
    }

    function fermerModal() {
        setIsModalOpen(false);
        setClientAModifier(null);
    }

    function gererSucces(client: Client) {
        setListeClients((prev) => {
            const existeDeja = prev.some((c) => c.id === client.id);
            if (existeDeja) {
                return prev.map((c) => (c.id === client.id ? { ...c, ...client } : c));
            }
            return [...prev, client].sort((a, b) => a.nom.localeCompare(b.nom));
        });
        fermerModal();
    }

    function demanderSuppression(client: Client) {
        setErreurSuppression(null);
        setClientASupprimer(client);
    }

    async function confirmerSuppression() {
        if (!clientASupprimer) return;

        setIsSupprimantClient(true);
        setErreurSuppression(null);

        try {
            const response = await fetch(`/api/clients/${clientASupprimer.id}`, {
                method: "DELETE",
            });
            const result = await response.json();

            if (!response.ok) {
                setErreurSuppression(result.error || "Erreur lors de la suppression");
                return;
            }

            setListeClients((prev) => prev.filter((c) => c.id !== clientASupprimer.id));
            setClientASupprimer(null);
        } catch (error) {
            setErreurSuppression("Erreur réseau, veuillez réessayer");
        } finally {
            setIsSupprimantClient(false);
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold text-foreground">Clients</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Gestion des fiches clients et historique d&apos;achats.
                    </p>
                </div>

                <button
                    onClick={ouvrirCreation}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
                >
                    <Plus className="h-4 w-4" />
                    Nouveau client
                </button>
            </div>

            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                    type="text"
                    value={recherche}
                    onChange={(e) => setRecherche(e.target.value)}
                    placeholder="Rechercher par nom, téléphone ou email..."
                    className="w-full pl-9 pr-3 py-2 rounded-md bg-card border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
            </div>

            <div className="hidden md:block">
                <ClientsTable
                    clients={clientsFiltres}
                    role={role}
                    onEdit={ouvrirEdition}
                    onDelete={demanderSuppression}
                />
            </div>

            <div className="md:hidden grid grid-cols-1 gap-4">
                {clientsFiltres.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-8">
                        Aucun client ne correspond à votre recherche.
                    </p>
                ) : (
                    clientsFiltres.map((client) => (
                        <ClientCard
                            key={client.id}
                            client={client}
                            role={role}
                            onEdit={ouvrirEdition}
                            onDelete={demanderSuppression}
                        />
                    ))
                )}
            </div>

            <ClientFormModal
                isOpen={isModalOpen}
                onClose={fermerModal}
                clientAModifier={clientAModifier}
                onSuccess={gererSucces}
            />

            <ConfirmDialog
                isOpen={clientASupprimer !== null}
                onClose={() => setClientASupprimer(null)}
                onConfirm={confirmerSuppression}
                isConfirming={isSupprimantClient}
                titre="Supprimer ce client ?"
                message={
                    clientASupprimer
                        ? `Voulez-vous vraiment supprimer ${clientASupprimer.nom} ? Cette action est irréversible.`
                        : ""
                }
                erreur={erreurSuppression}
            />
        </div>
    );
}