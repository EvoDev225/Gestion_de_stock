import { redirect } from "next/navigation";
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
            
            <main className="px-6 py-6">{children}</main>
        </div>
    );
}