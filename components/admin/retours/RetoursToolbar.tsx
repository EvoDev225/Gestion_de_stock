"use client";

type TypeFiltre = "TOUS" | "CLIENT" | "FOURNISSEUR";

interface RetoursToolbarProps {
    filtreType: TypeFiltre;
    onFiltreTypeChange: (filtre: TypeFiltre) => void;
}

const OPTIONS: { valeur: TypeFiltre; label: string }[] = [
    { valeur: "TOUS", label: "Tous" },
    { valeur: "CLIENT", label: "Client" },
    { valeur: "FOURNISSEUR", label: "Fournisseur" },
];

export default function RetoursToolbar({ filtreType, onFiltreTypeChange }: RetoursToolbarProps) {
    return (
        <div className="flex flex-wrap items-center gap-2 rounded-lg border border-border bg-card p-3">
            {OPTIONS.map((option) => (
                <button
                    key={option.valeur}
                    type="button"
                    onClick={() => onFiltreTypeChange(option.valeur)}
                    className={
                        filtreType === option.valeur
                            ? "rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground"
                            : "rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground hover:bg-muted"
                    }
                >
                    {option.label}
                </button>
            ))}
        </div>
    );
}