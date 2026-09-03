import { redirect } from "next/navigation";
import { obtenirSessionServeur } from "@/lib/auth";
import { listerFournisseurs } from "@/lib/services/fournisseur.service";
import FournisseursPageClient from "./FournisseursPageClient";

export default async function FournisseursPage() {
    const session = await obtenirSessionServeur();

    if (!session) {
        redirect("/login");
    }

    if (session.role !== "ADMIN") {
        redirect("/dashboard");
    }

    const fournisseurs = await listerFournisseurs();

    return (
        <div className="mx-auto max-w-7xl space-y-6 p-6">
            <h1 className="text-2xl font-semibold text-gray-900">Fournisseurs</h1>
            <FournisseursPageClient fournisseursInitiaux={fournisseurs} />
        </div>
    );
}