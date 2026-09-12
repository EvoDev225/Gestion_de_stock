import type { Rapport, InventaireOption } from "@/types/rapport";
import { obtenirSessionServeur } from "@/lib/auth";
import { redirect } from "next/navigation";
import { listerRapports } from "@/lib/services/rapport.service";
import { serialiserRapports } from "@/lib/serializers/rapport";
import { listerInventaires } from "@/lib/services/inventaire.service";
import { serialiserInventaireOptions } from "@/lib/serializers/inventaire-option";
import RapportsExportsPageClient from "@/components/admin/rapports/RapportsExportsPageClient";

export default async function RapportsPage() {
    const session = await obtenirSessionServeur();

    if (!session) {
        redirect("/login");
    }

    // Vérifie que le rôle est autorisé (ADMIN ou EMPLOYEE)
    if (session.role !== "ADMIN" && session.role !== "EMPLOYEE") {
        redirect("/dashboard");
    }

    // Chargement conditionnel des données selon le rôle
    // Typage explicite pour éviter l'inférence any[] en mode strict
    let rapportsSerialises: Rapport[] = [];
    let inventairesSerialises: InventaireOption[] = [];

    if (session.role === "ADMIN") {
        // ADMIN : charge les rapports et inventaires depuis la base
        const [rapports, inventaires] = await Promise.all([
            listerRapports(),
            listerInventaires(),
        ]);

        rapportsSerialises = serialiserRapports(rapports);
        inventairesSerialises = serialiserInventaireOptions(inventaires);
    }
    // EMPLOYEE : tableaux vides (données non nécessaires)

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-foreground">
                Rapports et exports
            </h1>
            <RapportsExportsPageClient
                role={session.role as "ADMIN" | "EMPLOYEE"}
                rapportsInitiaux={rapportsSerialises}
                inventaires={inventairesSerialises}
            />
        </div>
    );
}