"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ChevronDown } from "lucide-react";
import type { Rapport } from "@/types/rapport";

interface RapportCardProps {
    rapport: Rapport;
    ouvertParDefaut?: boolean;
}

/**
 * Formate une date ISO en date courte française (jour/mois/année).
 */
function formaterDateCourte(iso: string): string {
    const date = new Date(iso);
    return date.toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });
}

/**
 * Formate une date ISO en date et heure complètes en français.
 */
function formaterDateHeure(iso: string): string {
    const date = new Date(iso);
    const dateFormatee = date.toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });
    const heureFormatee = date.toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
    });
    return `${dateFormatee} à ${heureFormatee}`;
}

/**
 * Carte affichant un rapport d'activité généré par IA,
 * avec un contenu Markdown repliable.
 */
export default function RapportCard({
    rapport,
    ouvertParDefaut = false,
}: RapportCardProps) {
    const [estOuvert, setEstOuvert] = useState<boolean>(ouvertParDefaut);

    return (
        <div className="overflow-hidden rounded-lg border border-border bg-card">
            {/* En-tête cliquable */}
            <button
                type="button"
                onClick={() => setEstOuvert(!estOuvert)}
                className="flex w-full items-center justify-between gap-4 px-4 py-3 text-left hover:bg-muted/50"
            >
                <div className="space-y-0.5">
                    <p className="text-sm font-medium text-foreground">
                        Du {formaterDateCourte(rapport.dateDebut)} au{" "}
                        {formaterDateCourte(rapport.dateFin)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                        Généré le {formaterDateHeure(rapport.dateGeneration)} par{" "}
                        {rapport.utilisateur.nom}
                    </p>
                </div>

                <ChevronDown
                    size={16}
                    className={`shrink-0 text-muted-foreground transition-transform ${
                        estOuvert ? "rotate-180" : ""
                    }`}
                    aria-hidden="true"
                />
            </button>

            {/* Corps affiché uniquement si le rapport est ouvert */}
            {estOuvert && (
                <div className="border-t border-border px-4 pb-4 pt-1">
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                            h2: ({ children }) => (
                                <h2 className="mb-2 mt-4 text-base font-semibold text-foreground">
                                    {children}
                                </h2>
                            ),
                            h3: ({ children }) => (
                                <h3 className="mb-1 mt-3 text-sm font-semibold text-foreground">
                                    {children}
                                </h3>
                            ),
                            p: ({ children }) => (
                                <p className="mb-2 text-sm leading-relaxed text-foreground">
                                    {children}
                                </p>
                            ),
                            ul: ({ children }) => (
                                <ul className="mb-2 list-inside list-disc space-y-1 text-sm text-foreground">
                                    {children}
                                </ul>
                            ),
                            li: ({ children }) => (
                                <li className="text-sm">{children}</li>
                            ),
                        }}
                    >
                        {rapport.contenu}
                    </ReactMarkdown>
                </div>
            )}
        </div>
    );
}