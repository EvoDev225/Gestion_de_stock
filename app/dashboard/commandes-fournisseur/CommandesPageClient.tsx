"use client";

import { useState, useMemo } from "react";
import { toast } from "sonner";
import type { CommandeFournisseur, NouvelleCommandeData, Produit } from "@/types/commande-fournisseur";
import type { Fournisseur } from "@/types/fournisseur";
import CommandesToolbar from "@/components/admin/commandes-fournisseur/CommandesToolbar";
import CommandesTable from "@/components/admin/commandes-fournisseur/CommandesTable";
import CommandeCard from "@/components/admin/commandes-fournisseur/CommandeCard";
import NouvelleCommandeModal from "@/components/admin/commandes-fournisseur/NouvelleCommandeModal";

interface CommandesPageClientProps {
  commandesInitiales: CommandeFournisseur[];
  fournisseurs: Fournisseur[];
  produits: { id: string; nom: string; sku: string }[];
}

type StatutFiltre = "TOUS" | "EN_ATTENTE" | "ENVOYEE" | "RECUE_PARTIELLE" | "RECUE";

export default function CommandesPageClient({
  commandesInitiales,
  fournisseurs,
  produits,
}: CommandesPageClientProps) {
  const [commandes, setCommandes] = useState<CommandeFournisseur[]>(commandesInitiales);
  const [filtreStatut, setFiltreStatut] = useState<StatutFiltre>("TOUS");
  const [modalOuvert, setModalOuvert] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const commandesFiltrees = useMemo(() => {
    if (filtreStatut === "TOUS") return commandes;
    return commandes.filter((commande) => commande.statut === filtreStatut);
  }, [commandes, filtreStatut]);

  const handleCreerCommande = async (data: NouvelleCommandeData) => {
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/commandes-fournisseur", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || result.error || "Une erreur est survenue lors de la création.");
      }

      setCommandes((prev) => [result, ...prev]);
      setModalOuvert(false);
      toast.success("Commande créée avec succès.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erreur lors de la création de la commande.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <CommandesToolbar
        filtreStatut={filtreStatut}
        onFiltreStatutChange={setFiltreStatut}
        onNouvelleCommande={() => setModalOuvert(true)}
      />

      <div className="hidden md:block">
        <CommandesTable commandes={commandesFiltrees} />
      </div>

      <div className="md:hidden grid grid-cols-1 gap-4">
        {commandesFiltrees.map((commande) => (
          <CommandeCard key={commande.id} commande={commande} />
        ))}
      </div>

      <NouvelleCommandeModal
        isOpen={modalOuvert}
        onClose={() => setModalOuvert(false)}
        onSubmit={handleCreerCommande}
        fournisseurs={fournisseurs}
        produits={produits as Produit[]}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}