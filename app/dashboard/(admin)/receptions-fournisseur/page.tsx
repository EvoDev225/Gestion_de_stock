import { redirect } from "next/navigation";
import { obtenirSessionServeur } from "@/lib/auth";
import { listerReceptions } from "@/lib/services/reception-fournisseur.service";
import { serialiserReceptions } from "@/lib/serializers/reception-fournisseur";
import ReceptionsPageClient from "@/components/admin/receptions-fournisseur/ReceptionsPageClient";

export default async function ReceptionsFournisseurPage() {
  const session = await obtenirSessionServeur();

  if (!session || session.role !== "ADMIN") {
    redirect("/connexion");
  }

  const receptions = await listerReceptions();
  const receptionsSerialisees = serialiserReceptions(receptions);

  return <ReceptionsPageClient receptions={receptionsSerialisees} />;
}