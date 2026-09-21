import { obtenirSessionServeur } from "@/lib/auth";
import { redirect } from "next/navigation";
import StockPageClient from "@/app/dashboard/(admin)/stock/StockPageClient";


export default async function EmployeeStockPage() {
    // 1. Récupération de la session serveur ; redirection vers /login si absente.
    const session = await obtenirSessionServeur();
    if (!session) {
        redirect("/login");
    }

    // 2. Rendu de la page cliente avec le rôle fixé à "EMPLOYEE" pour activer
    //    le comportement en lecture seule (masquage des créations/modifications/suppressions).
    return <StockPageClient role="EMPLOYEE" />;
}