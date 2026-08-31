import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { obtenirSessionServeur } from "@/lib/auth";
import { SidebarProvider } from "@/components/contexts/SidebarContext";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminTopbar from "@/components/admin/AdminTopbar";

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
        <SidebarProvider>
            <div className="min-h-screen bg-background">
                <AdminSidebar userName={session.nom} userRole={roleAffiche} />
                <AdminTopbar userName={session.nom} userRole={roleAffiche} />

                {/* La marge suit la largeur réelle de la sidebar à chaque breakpoint */}
                <main className="ml-0 md:ml-20 lg:ml-64 px-4 md:px-6 lg:px-8 py-6 transition-[margin] duration-300">
                    {children}
                </main>
            </div>
        </SidebarProvider>
    );
}