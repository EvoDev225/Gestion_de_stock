import type { RoleUtilisateur } from "@/types/utilisateur";

interface RoleBadgeProps {
    role: RoleUtilisateur;
}

export default function RoleBadge({ role }: RoleBadgeProps) {
    const estAdmin = role === "ADMIN";

    return (
        <span
            className={
                estAdmin
                    ? "inline-flex items-center rounded-full border border-border bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary"
                    : "inline-flex items-center rounded-full border border-border bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground"
            }
        >
            {estAdmin ? "Admin" : "Employé"}
        </span>
    );
}