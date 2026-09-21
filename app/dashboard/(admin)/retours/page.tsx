import { obtenirSessionServeur } from "@/lib/auth";
import { listerRetours } from "@/lib/services/retour.service";
import { redirect } from "next/navigation";
import { serialiserRetours } from "@/lib/serializers/retour";
import RetoursPageClient from "@/components/admin/retours/RetoursPageClient";

export default async function RetoursPage() {
    const session = await obtenirSessionServeur();

    if (!session) {
        redirect("/login");
    }

    if (session.role !== "ADMIN") {
        redirect("/dashboard");
    }

    const retoursRaw = await listerRetours();
    const retours = serialiserRetours(retoursRaw);

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-foreground">Retours</h1>
            <RetoursPageClient retoursInitiaux={retours} />
        </div>
    );
}