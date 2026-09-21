import { obtenirSessionServeur } from "@/lib/auth"; // ⚠️ ajuste le chemin réel si différent
import InventaireDetailPageClient from "./InventaireDetailPageClient";

export default async function InventaireDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const session = await obtenirSessionServeur();

    return <InventaireDetailPageClient inventaireId={id} role={session?.role ?? "EMPLOYEE"} />;
}