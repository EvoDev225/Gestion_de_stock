"use client";

import { useState, type FormEvent } from "react";

interface ModifierProfilFormProps {
    utilisateur: { id: string; nom: string; email: string };
    onSubmit: (data: {
        nom?: string;
        email?: string;
        motDePasseActuel?: string;
        nouveauMotDePasse?: string;
    }) => Promise<void>;
    isSubmitting: boolean;
}

interface FormErrors {
    nom?: string;
    email?: string;
    motDePasseActuel?: string;
    nouveauMotDePasse?: string;
    confirmerNouveauMotDePasse?: string;
}

export default function ModifierProfilForm({
    utilisateur,
    onSubmit,
    isSubmitting,
}: ModifierProfilFormProps) {
    const [nom, setNom] = useState(utilisateur.nom);
    const [email, setEmail] = useState(utilisateur.email);
    const [motDePasseActuel, setMotDePasseActuel] = useState("");
    const [nouveauMotDePasse, setNouveauMotDePasse] = useState("");
    const [confirmerNouveauMotDePasse, setConfirmerNouveauMotDePasse] = useState("");
    const [errors, setErrors] = useState<FormErrors>({});

    function valider(): FormErrors {
        const nouveauxErreurs: FormErrors = {};

        if (!nom.trim()) {
            nouveauxErreurs.nom = "Le nom est requis.";
        }

        if (!email.trim()) {
            nouveauxErreurs.email = "L'email est requis.";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            nouveauxErreurs.email = "Format d'email invalide.";
        }

        const unChampMdpRempli =
            motDePasseActuel !== "" ||
            nouveauMotDePasse !== "" ||
            confirmerNouveauMotDePasse !== "";

        if (unChampMdpRempli) {
            if (!motDePasseActuel) {
                nouveauxErreurs.motDePasseActuel =
                    "Le mot de passe actuel est requis.";
            }
            if (!nouveauMotDePasse) {
                nouveauxErreurs.nouveauMotDePasse =
                    "Le nouveau mot de passe est requis.";
            } else if (nouveauMotDePasse.length < 8) {
                nouveauxErreurs.nouveauMotDePasse =
                    "Le nouveau mot de passe doit contenir au moins 8 caractères.";
            }
            if (nouveauMotDePasse !== confirmerNouveauMotDePasse) {
                nouveauxErreurs.confirmerNouveauMotDePasse =
                    "Les mots de passe ne correspondent pas.";
            }
        }

        return nouveauxErreurs;
    }

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();

        const nouveauxErreurs = valider();
        setErrors(nouveauxErreurs);

        if (Object.keys(nouveauxErreurs).length > 0) {
            return;
        }

        const unChampMdpRempli =
            motDePasseActuel !== "" ||
            nouveauMotDePasse !== "" ||
            confirmerNouveauMotDePasse !== "";

        const data: {
            nom?: string;
            email?: string;
            motDePasseActuel?: string;
            nouveauMotDePasse?: string;
        } = {
            nom: nom.trim(),
            email: email.trim(),
        };

        if (unChampMdpRempli) {
            data.motDePasseActuel = motDePasseActuel;
            data.nouveauMotDePasse = nouveauMotDePasse;
        }

        await onSubmit(data);

        setMotDePasseActuel("");
        setNouveauMotDePasse("");
        setConfirmerNouveauMotDePasse("");
        setErrors({});
    }

    return (
        <div className="bg-card border border-border rounded-xl p-6">
            <form onSubmit={handleSubmit} className="space-y-5">
                {/* ── Informations générales ── */}
                <div className="space-y-4">
                    <h2 className="text-lg font-semibold text-foreground">
                        Informations personnelles
                    </h2>

                    <div>
                        <label
                            htmlFor="profil-nom"
                            className="block text-sm font-medium text-foreground mb-1"
                        >
                            Nom <span className="text-destructive">*</span>
                        </label>
                        <input
                            id="profil-nom"
                            type="text"
                            value={nom}
                            onChange={(e) => setNom(e.target.value)}
                            disabled={isSubmitting}
                            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                        />
                        {errors.nom && (
                            <p className="text-destructive text-sm mt-1">
                                {errors.nom}
                            </p>
                        )}
                    </div>

                    <div>
                        <label
                            htmlFor="profil-email"
                            className="block text-sm font-medium text-foreground mb-1"
                        >
                            Email <span className="text-destructive">*</span>
                        </label>
                        <input
                            id="profil-email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={isSubmitting}
                            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                        />
                        {errors.email && (
                            <p className="text-destructive text-sm mt-1">
                                {errors.email}
                            </p>
                        )}
                    </div>
                </div>

                {/* ── Séparateur ── */}
                <hr className="border-border" />

                {/* ── Changement de mot de passe ── */}
                <div className="space-y-4">
                    <h2 className="text-lg font-semibold text-foreground">
                        Changer le mot de passe
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        Laissez ces champs vides si vous ne souhaitez pas modifier votre mot de passe.
                    </p>

                    <div>
                        <label
                            htmlFor="profil-mdp-actuel"
                            className="block text-sm font-medium text-foreground mb-1"
                        >
                            Mot de passe actuel
                        </label>
                        <input
                            id="profil-mdp-actuel"
                            type="password"
                            value={motDePasseActuel}
                            onChange={(e) => setMotDePasseActuel(e.target.value)}
                            disabled={isSubmitting}
                            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                        />
                        {errors.motDePasseActuel && (
                            <p className="text-destructive text-sm mt-1">
                                {errors.motDePasseActuel}
                            </p>
                        )}
                    </div>

                    <div>
                        <label
                            htmlFor="profil-nouveau-mdp"
                            className="block text-sm font-medium text-foreground mb-1"
                        >
                            Nouveau mot de passe
                        </label>
                        <input
                            id="profil-nouveau-mdp"
                            type="password"
                            value={nouveauMotDePasse}
                            onChange={(e) => setNouveauMotDePasse(e.target.value)}
                            disabled={isSubmitting}
                            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                        />
                        {errors.nouveauMotDePasse && (
                            <p className="text-destructive text-sm mt-1">
                                {errors.nouveauMotDePasse}
                            </p>
                        )}
                    </div>

                    <div>
                        <label
                            htmlFor="profil-confirmer-mdp"
                            className="block text-sm font-medium text-foreground mb-1"
                        >
                            Confirmer le nouveau mot de passe
                        </label>
                        <input
                            id="profil-confirmer-mdp"
                            type="password"
                            value={confirmerNouveauMotDePasse}
                            onChange={(e) =>
                                setConfirmerNouveauMotDePasse(e.target.value)
                            }
                            disabled={isSubmitting}
                            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                        />
                        {errors.confirmerNouveauMotDePasse && (
                            <p className="text-destructive text-sm mt-1">
                                {errors.confirmerNouveauMotDePasse}
                            </p>
                        )}
                    </div>
                </div>

                {/* ── Bouton ── */}
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {isSubmitting ? "Enregistrement..." : "Enregistrer les modifications"}
                </button>
            </form>
        </div>
    );
}