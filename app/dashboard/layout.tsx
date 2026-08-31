// app/dashboard/layout.tsx
import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { obtenirSessionServeur } from "@/lib/auth";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminTopbar from "@/components/admin/AdminTopbar";

// TODO: à confirmer une fois lib/auth.ts collé — nom exact de la fonction
// et forme du retour (on sait déjà que le payload JWT contient id / role / nom,
// pas d'email).
export default async function DashboardLayout({
    children,
}: {
    children: ReactNode;
}) {
    const session = await obtenirSessionServeur();

    if (!session) {
        redirect("/login");
    }

    const roleAffiche = session.role === "ADMIN" ? "Administrateur" : session.role;

    return (
        <div className="min-h-screen bg-background">
            {/* AdminSidebar est déjà fixed left-0 top-0 h-screen w-64 */}
            <AdminSidebar userName={session.nom} userRole={roleAffiche} />

            {/* AdminTopbar porte déjà ml-64 en interne */}
            <AdminTopbar userName={session.nom} userRole={roleAffiche} />

            {/* ml-64 pour compenser la sidebar fixe (même valeur que la Topbar) */}
            <main className="ml-64 px-8 py-6">{children}</main>
        </div>
    );
}