import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { obtenirSessionServeur } from "@/lib/auth";

export default async function EmployeLayout({
    children,
}: {
    children: ReactNode;
}) {
    const session = await obtenirSessionServeur();

    if (!session) {
        redirect("/login");
    }

    if (session.role !== "EMPLOYEE") {
        redirect("/dashboard");
    }

    return <>{children}</>;
}