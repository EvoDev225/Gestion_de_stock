import { redirect } from "next/navigation";
import TopNavbar from "@/components/dashboard/TopNavbar";
import { obtenirSessionServeur } from "@/lib/auth";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await obtenirSessionServeur();

    if (!session) {
        redirect("/login");
    }

    return (
        <div className="min-h-screen bg-background">
            <TopNavbar
                utilisateurNom={session.nom}
                utilisateurRole={session.role}
            />
            <main className="px-6 py-6">{children}</main>
        </div>
    );
}