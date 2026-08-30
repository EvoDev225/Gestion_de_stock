"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";

export function LoginForm() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [motDePasse, setMotDePasse] = useState("");
    const [afficherMotDePasse, setAfficherMotDePasse] = useState(false);
    const [chargement, setChargement] = useState(false);
    const [erreur, setErreur] = useState<string | null>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Utilitaire pour l'animation d'entrée en cascade
    const getItemStyle = (delayMs: number) => ({
        opacity: mounted ? 1 : 0,
        transform: mounted ? "translateY(0)" : "translateY(12px)",
        transition: `opacity 450ms ease-out ${delayMs}ms, transform 450ms ease-out ${delayMs}ms`,
    });

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setChargement(true);
        setErreur(null);

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, motDePasse }),
            });

            if (!res.ok) {
                setErreur("Identifiants invalides.");
                setChargement(false);
                return;
            }

            // Redirection vers le dashboard et rafraîchissement des cookies de session
            router.push("/dashboard");
            router.refresh();
        } catch (err) {
            setErreur("Une erreur est survenue, réessayez.");
            setChargement(false);
        }
    };

    return (
        <div className="relative w-full max-w-md mx-auto bg-card p-8 md:p-12 rounded-[24px] ambient-shadow corner-brackets corner-brackets-tl-br text-left">
            {/* En-tête du formulaire */}
            <h1
                style={getItemStyle(0)}
                className="font-display text-2xl font-medium text-foreground mb-2"
            >
                Bon retour
            </h1>
            <p
                style={getItemStyle(70)}
                className="font-sans text-sm text-foreground-muted mb-8"
            >
                Connectez-vous pour accéder à votre tableau de bord
            </p>

            {/* Formulaire principal */}
            <form onSubmit={handleSubmit} noValidate>
                {/* Bandeau d'erreur conditionnel */}
                {erreur && (
                    <div className="mb-6 p-3 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-sm font-sans animate-in fade-in slide-in-from-top-1 duration-200">
                        {erreur}
                    </div>
                )}

                {/* 1. Champ Email */}
                <div style={getItemStyle(140)} className="mb-[20px]">
                    <label
                        htmlFor="email"
                        className="block text-sm font-medium text-foreground mb-[6px] font-sans"
                    >
                        Email
                    </label>
                    <input
                        id="email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="exemple@domaine.com"
                        className="w-full h-[44px] px-[14px] bg-surface border border-border rounded-lg text-sm text-foreground font-sans placeholder:text-foreground-subtle focus:outline-none focus:border-primary focus:border-[1.5px] transition-colors"
                    />
                </div>

                {/* 2. Champ Mot de Passe */}
                <div style={getItemStyle(210)} className="mb-[28px]">
                    <div className="flex items-center justify-between mb-[6px]">
                        <label
                            htmlFor="motDePasse"
                            className="block text-sm font-medium text-foreground font-sans"
                        >
                            Mot de passe
                        </label>
                        <a href="#" className="text-sm text-primary hover:underline">
                            Mot de passe oublié ?
                        </a>
                    </div>
                    <div className="relative w-full">
                        <input
                            id="motDePasse"
                            type={afficherMotDePasse ? "text" : "password"}
                            required
                            value={motDePasse}
                            onChange={(e) => setMotDePasse(e.target.value)}
                            placeholder="••••••••"
                            className="w-full h-[44px] pl-[14px] pr-[44px] bg-surface border border-border rounded-lg text-sm text-foreground font-sans placeholder:text-foreground-subtle focus:outline-none focus:border-primary focus:border-[1.5px] transition-colors"
                        />
                        <button
                            type="button"
                            onClick={() => setAfficherMotDePasse((prev) => !prev)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground-subtle hover:text-foreground transition-colors cursor-pointer p-1"
                            aria-label={
                                afficherMotDePasse
                                    ? "Masquer le mot de passe"
                                    : "Afficher le mot de passe"
                            }
                        >
                            {afficherMotDePasse ? (
                                <EyeOff className="w-5 h-5" />
                            ) : (
                                <Eye className="w-5 h-5" />
                            )}
                        </button>
                    </div>
                </div>

                {/* 3. Bouton de soumission */}
                <div style={getItemStyle(280)}>
                    <button
                        type="submit"
                        disabled={chargement}
                        className="w-full h-[44px] bg-primary text-primary-foreground rounded-full text-sm font-medium font-sans hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 cursor-pointer"
                    >
                        {chargement ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span>Connexion en cours...</span>
                            </>
                        ) : (
                            "Se connecter"
                        )}
                    </button>
                </div>
            </form>

            <div style={getItemStyle(350)} className="mt-8 pt-6 border-t border-border text-center">
                <p className="text-sm text-muted-foreground">
                    Pas encore de compte ? <span className="text-foreground">Contactez votre administrateur</span>
                </p>
            </div>
        </div>
    );
}