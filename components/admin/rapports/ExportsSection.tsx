"use client";

import { useState } from "react";
import type { InventaireOption } from "@/types/rapport";
import ExportButton from "./ExportButton";
import ExportDateRangeFields from "./ExportDateRangeFields";
import InventaireSelect from "./InventaireSelect";

interface ExportsSectionProps {
    role: "ADMIN" | "EMPLOYEE";
    inventaires: InventaireOption[];
}

/**
 * Période de dates pour un export filtrable.
 */
type PeriodeDates = {
    debut: string;
    fin: string;
};

const classesCarte = "space-y-3 rounded-lg border border-border bg-card p-4";
const classesTitreCarte = "text-sm font-semibold text-foreground";
const classesDescription = "text-xs text-muted-foreground";

/**
 * Section listant les exports Excel disponibles selon le rôle,
 * avec les filtres associés à chaque export.
 */
export default function ExportsSection({
    role,
    inventaires,
}: ExportsSectionProps) {
    // États de filtrage indépendants par export.
    const [datesMouvements, setDatesMouvements] = useState<PeriodeDates>({
        debut: "",
        fin: "",
    });
    const [datesVentes, setDatesVentes] = useState<PeriodeDates>({
        debut: "",
        fin: "",
    });
    const [datesCreances, setDatesCreances] = useState<PeriodeDates>({
        debut: "",
        fin: "",
    });
    const [inventaireSelectionne, setInventaireSelectionne] = useState<string>("");

    const estAdmin = role === "ADMIN";

    return (
        <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground">
                Exports Excel
            </h2>

            <div className="space-y-4">
                {/* Export : Stock actuel (visible par tous) */}
                <div className={classesCarte}>
                    <h3 className={classesTitreCarte}>Stock actuel</h3>
                    <p className={classesDescription}>
                        Liste des produits non archivés avec leurs quantités.
                    </p>
                    <ExportButton type="stock" label="Télécharger" />
                </div>

                {/* Export : Produits détaillés (visible par tous) */}
                <div className={classesCarte}>
                    <h3 className={classesTitreCarte}>Produits détaillés</h3>
                    <p className={classesDescription}>
                        Produits, variantes et lots, en détail.
                    </p>
                    <ExportButton type="produits-detail" label="Télécharger" />
                </div>

                {/* Export : Mouvements de stock (visible par tous, filtrable par période) */}
                <div className={classesCarte}>
                    <h3 className={classesTitreCarte}>Mouvements de stock</h3>
                    <p className={classesDescription}>
                        Historique des mouvements, filtrable par période.
                    </p>
                    <ExportDateRangeFields
                        dateDebut={datesMouvements.debut}
                        dateFin={datesMouvements.fin}
                        onDateDebutChange={(valeur) =>
                            setDatesMouvements((precedent) => ({
                                ...precedent,
                                debut: valeur,
                            }))
                        }
                        onDateFinChange={(valeur) =>
                            setDatesMouvements((precedent) => ({
                                ...precedent,
                                fin: valeur,
                            }))
                        }
                    />
                    <ExportButton
                        type="mouvements"
                        label="Télécharger"
                        parametres={{
                            dateDebut: datesMouvements.debut,
                            dateFin: datesMouvements.fin,
                        }}
                    />
                </div>

                {/* Exports réservés au rôle ADMIN */}
                {estAdmin && (
                    <>
                        {/* Export : Ventes */}
                        <div className={classesCarte}>
                            <h3 className={classesTitreCarte}>Ventes</h3>
                            <p className={classesDescription}>
                                Historique des ventes, filtrable par période.
                            </p>
                            <ExportDateRangeFields
                                dateDebut={datesVentes.debut}
                                dateFin={datesVentes.fin}
                                onDateDebutChange={(valeur) =>
                                    setDatesVentes((precedent) => ({
                                        ...precedent,
                                        debut: valeur,
                                    }))
                                }
                                onDateFinChange={(valeur) =>
                                    setDatesVentes((precedent) => ({
                                        ...precedent,
                                        fin: valeur,
                                    }))
                                }
                            />
                            <ExportButton
                                type="ventes"
                                label="Télécharger"
                                parametres={{
                                    dateDebut: datesVentes.debut,
                                    dateFin: datesVentes.fin,
                                }}
                            />
                        </div>

                        {/* Export : Créances */}
                        <div className={classesCarte}>
                            <h3 className={classesTitreCarte}>Créances</h3>
                            <p className={classesDescription}>
                                Ventes à crédit uniquement, filtrable par période.
                            </p>
                            <ExportDateRangeFields
                                dateDebut={datesCreances.debut}
                                dateFin={datesCreances.fin}
                                onDateDebutChange={(valeur) =>
                                    setDatesCreances((precedent) => ({
                                        ...precedent,
                                        debut: valeur,
                                    }))
                                }
                                onDateFinChange={(valeur) =>
                                    setDatesCreances((precedent) => ({
                                        ...precedent,
                                        fin: valeur,
                                    }))
                                }
                            />
                            <ExportButton
                                type="creances"
                                label="Télécharger"
                                parametres={{
                                    dateDebut: datesCreances.debut,
                                    dateFin: datesCreances.fin,
                                }}
                            />
                        </div>

                        {/* Export : Fournisseurs */}
                        <div className={classesCarte}>
                            <h3 className={classesTitreCarte}>Fournisseurs</h3>
                            <p className={classesDescription}>
                                Commandes et réceptions fournisseurs.
                            </p>
                            <ExportButton type="fournisseur" label="Télécharger" />
                        </div>

                        {/* Export : Écarts d'inventaire */}
                        <div className={classesCarte}>
                            <h3 className={classesTitreCarte}>
                                Écarts d{"'"} inventaire
                            </h3>
                            <p className={classesDescription}>
                                Écarts constatés, filtrable par inventaire précis.
                            </p>
                            <InventaireSelect
                                inventaires={inventaires}
                                valeur={inventaireSelectionne}
                                onChange={(id) => setInventaireSelectionne(id)}
                            />
                            <ExportButton
                                type="inventaires"
                                label="Télécharger"
                                parametres={{
                                    inventaireId: inventaireSelectionne,
                                }}
                            />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}