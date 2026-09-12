"use client";

type RoleFiltre = "TOUS" | "ADMIN" | "EMPLOYEE";

interface UtilisateursToolbarProps {
    filtreRole: RoleFiltre;
    onFiltreRoleChange: (filtre: RoleFiltre) => void;
    onNouvelUtilisateur: () => void;
}

const OPTIONS: { valeur: RoleFiltre; label: string }[] = [
    { valeur: "TOUS", label: "Tous" },
    { valeur: "ADMIN", label: "Admin" },
    { valeur: "EMPLOYEE", label: "Employé" },
];

export default function UtilisateursToolbar({
    filtreRole,
    onFiltreRoleChange,
    onNouvelUtilisateur,
}: UtilisateursToolbarProps) {
    return (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-card p-3">
            <div className="flex flex-wrap items-center gap-2">
                {OPTIONS.map((option) => (
                    <button
                        key={option.valeur}
                        type="button"
                        onClick={() => onFiltreRoleChange(option.valeur)}
                        className={
                            filtreRole === option.valeur
                                ? "rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground"
                                : "rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground hover:bg-muted"
                        }
                    >
                        {option.label}
                    </button>
                ))}
            </div>
            <button
                type="button"
                onClick={onNouvelUtilisateur}
                className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
            >
                Nouvel utilisateur
            </button>
        </div>
    );
}