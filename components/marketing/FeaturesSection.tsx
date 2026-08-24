"use client";

import React, { useEffect, useRef, useState } from "react";
import {
    ArrowDownRight,
    ArrowUpRight,
    AlertTriangle,
    Check,
    Package,
} from "lucide-react";

// Wrapper pour animer chaque bloc lors de l'entrée dans le viewport
function AnimatedBlock({ children }: { children: React.ReactNode }) {
    const [isVisible, setIsVisible] = useState(false);
    const blockRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.15 }
        );

        if (blockRef.current) {
            observer.observe(blockRef.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <div
            ref={blockRef}
            className={`transition-all duration-700 ease-out ${isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
        >
            {children}
        </div>
    );
}

export function FeaturesSection() {
    return (
        <section className="bg-background py-32 px-4 md:px-8">
            <div className="mx-auto max-w-7xl">
                {/* BLOC 1 : Traçabilité des mouvements */}
                <div className="mb-32">
                    <AnimatedBlock>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-center">
                            {/* Texte */}
                            <div>
                                <span className="text-xs font-medium tracking-wide uppercase text-accent mb-4 block">
                                    TRAÇABILITÉ
                                </span>
                                <h2 className="font-display text-3xl font-medium text-foreground mb-4">
                                    Chaque mouvement, enregistré.
                                </h2>
                                <p className="font-sans text-base text-foreground-muted leading-relaxed mb-6">
                                    Entrées, sorties, ajustements : chaque changement de stock est
                                    tracé automatiquement, avec l'utilisateur et l'horodatage.
                                </p>

                                <ul className="space-y-3 font-sans text-sm text-foreground">
                                    <li className="flex items-center gap-3">
                                        <span className="flex items-center justify-center w-5 h-5 rounded-full bg-accent-subtle text-accent shrink-0">
                                            <Check className="w-3.5 h-3.5" />
                                        </span>
                                        Historique complet et inaltérable des opérations
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <span className="flex items-center justify-center w-5 h-5 rounded-full bg-accent-subtle text-accent shrink-0">
                                            <Check className="w-3.5 h-3.5" />
                                        </span>
                                        Identification claire de l'opérateur sur chaque action
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <span className="flex items-center justify-center w-5 h-5 rounded-full bg-accent-subtle text-accent shrink-0">
                                            <Check className="w-3.5 h-3.5" />
                                        </span>
                                        Filtres instantanés par produit, date ou type d'action
                                    </li>
                                </ul>
                            </div>

                            {/* Visuel */}
                            <div>
                                <div className="bg-surface border border-border rounded-xl p-6">
                                    <div className="text-xs font-sans font-medium uppercase tracking-wider text-foreground-subtle mb-4">
                                        Mouvements récents
                                    </div>

                                    <div className="divide-y divide-border font-sans">
                                        {/* Ligne 1 */}
                                        <div className="py-3 flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 rounded-lg bg-accent-subtle text-accent">
                                                    <ArrowDownRight className="w-4 h-4" />
                                                </div>
                                                <div>
                                                    <div className="text-sm font-medium text-foreground">
                                                        Huile d'olive Bio 75cl
                                                    </div>
                                                    <div className="text-xs text-foreground-subtle">
                                                        Par Jean D.
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-sm font-medium text-accent">
                                                    +24
                                                </div>
                                                <div className="text-xs text-foreground-subtle">
                                                    il y a 2h
                                                </div>
                                            </div>
                                        </div>

                                        {/* Ligne 2 */}
                                        <div className="py-3 flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 rounded-lg bg-background-subtle text-foreground-muted">
                                                    <ArrowUpRight className="w-4 h-4" />
                                                </div>
                                                <div>
                                                    <div className="text-sm font-medium text-foreground">
                                                        Café Grain Arabica 1kg
                                                    </div>
                                                    <div className="text-xs text-foreground-subtle">
                                                        Vente Caisse #2
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-sm font-medium text-foreground">
                                                    -2
                                                </div>
                                                <div className="text-xs text-foreground-subtle">
                                                    il y a 4h
                                                </div>
                                            </div>
                                        </div>

                                        {/* Ligne 3 */}
                                        <div className="py-3 flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 rounded-lg bg-background-subtle text-foreground-muted">
                                                    <ArrowUpRight className="w-4 h-4" />
                                                </div>
                                                <div>
                                                    <div className="text-sm font-medium text-foreground">
                                                        Thé Vert Menthe 250g
                                                    </div>
                                                    <div className="text-xs text-foreground-subtle">
                                                        Ajustement inventaire
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-sm font-medium text-foreground">
                                                    -1
                                                </div>
                                                <div className="text-xs text-foreground-subtle">
                                                    il y a 1d
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </AnimatedBlock>
                </div>

                {/* BLOC 2 : Alertes intelligentes (Visuel Gauche / Texte Droite) */}
                <div className="mb-32">
                    <AnimatedBlock>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-center">
                            {/* Visuel (placé en 2nd dans le DOM mobile, déplacé via order-last/order-first sur desktop) */}
                            <div className="order-last md:order-first">
                                <div className="bg-surface border border-border rounded-xl p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-xs font-sans font-medium uppercase tracking-wider text-foreground-subtle">
                                            Alertes actives
                                        </span>
                                        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-warning/14 text-warning">
                                            2 Nécessitent votre attention
                                        </span>
                                    </div>

                                    <div className="space-y-3 font-sans">
                                        {/* Alerte 1 */}
                                        <div className="p-3.5 rounded-lg border border-border bg-background-subtle flex items-start gap-3">
                                            <div className="p-1.5 rounded-md bg-warning/14 text-warning shrink-0 mt-0.5">
                                                <AlertTriangle className="w-4 h-4" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between gap-2 mb-1">
                                                    <span className="text-sm font-medium text-foreground truncate">
                                                        Jus de Pomme Artisanal
                                                    </span>
                                                    <span className="text-xs font-medium text-warning shrink-0">
                                                        Seuil atteint
                                                    </span>
                                                </div>
                                                <p className="text-xs text-foreground-muted">
                                                    Stock actuel : 2 unités (Seuil critique : 5)
                                                </p>
                                            </div>
                                        </div>

                                        {/* Alerte 2 */}
                                        <div className="p-3.5 rounded-lg border border-border bg-background-subtle flex items-start gap-3">
                                            <div className="p-1.5 rounded-md bg-warning/14 text-warning shrink-0 mt-0.5">
                                                <AlertTriangle className="w-4 h-4" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between gap-2 mb-1">
                                                    <span className="text-sm font-medium text-foreground truncate">
                                                        Farine T55 5kg
                                                    </span>
                                                    <span className="text-xs font-medium text-warning shrink-0">
                                                        Expiration proche
                                                    </span>
                                                </div>
                                                <p className="text-xs text-foreground-muted">
                                                    Lot #B204 expire dans 4 jours (12 kg restants)
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Texte */}
                            <div className="order-first md:order-last">
                                <span className="text-xs font-medium tracking-wide uppercase text-accent mb-4 block">
                                    ANTICIPATION
                                </span>
                                <h2 className="font-display text-3xl font-medium text-foreground mb-4">
                                    Alertes intelligentes.
                                </h2>
                                <p className="font-sans text-base text-foreground-muted leading-relaxed mb-6">
                                    Alertes de seuil bas et de péremption calculées à la volée.
                                    Ne perdez plus de temps à vérifier manuellement chaque rayon.
                                </p>

                                <ul className="space-y-3 font-sans text-sm text-foreground">
                                    <li className="flex items-center gap-3">
                                        <span className="flex items-center justify-center w-5 h-5 rounded-full bg-accent-subtle text-accent shrink-0">
                                            <Check className="w-3.5 h-3.5" />
                                        </span>
                                        Seuils de réapprovisionnement personnalisables par article
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <span className="flex items-center justify-center w-5 h-5 rounded-full bg-accent-subtle text-accent shrink-0">
                                            <Check className="w-3.5 h-3.5" />
                                        </span>
                                        Notifications automatiques avant péremption des lots
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <span className="flex items-center justify-center w-5 h-5 rounded-full bg-accent-subtle text-accent shrink-0">
                                            <Check className="w-3.5 h-3.5" />
                                        </span>
                                        Vue consolidée des urgences dès la connexion
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </AnimatedBlock>
                </div>

                {/* BLOC 3 : Multi-lots & Variantes */}
                <div>
                    <AnimatedBlock>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-center">
                            {/* Texte */}
                            <div>
                                <span className="text-xs font-medium tracking-wide uppercase text-accent mb-4 block">
                                    FLEXIBILITÉ
                                </span>
                                <h2 className="font-display text-3xl font-medium text-foreground mb-4">
                                    Multi-lots & variantes.
                                </h2>
                                <p className="font-sans text-base text-foreground-muted leading-relaxed mb-6">
                                    Produit simple pour un commerce généraliste, variantes de
                                    taille/couleur pour le textile ou gestion de lots pour
                                    l'alimentaire : l'outil s'adapte exactement à votre activité.
                                </p>

                                <ul className="space-y-3 font-sans text-sm text-foreground">
                                    <li className="flex items-center gap-3">
                                        <span className="flex items-center justify-center w-5 h-5 rounded-full bg-accent-subtle text-accent shrink-0">
                                            <Check className="w-3.5 h-3.5" />
                                        </span>
                                        Déclinaisons par déclinaisons (Taille, Couleur, Matière)
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <span className="flex items-center justify-center w-5 h-5 rounded-full bg-accent-subtle text-accent shrink-0">
                                            <Check className="w-3.5 h-3.5" />
                                        </span>
                                        Suivi précis des numéros de lots et DLC/DLUO
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <span className="flex items-center justify-center w-5 h-5 rounded-full bg-accent-subtle text-accent shrink-0">
                                            <Check className="w-3.5 h-3.5" />
                                        </span>
                                        Codes-barres et SKU distincts par variante
                                    </li>
                                </ul>
                            </div>

                            {/* Visuel */}
                            <div>
                                <div className="bg-surface border border-border rounded-xl p-6 font-sans">
                                    {/* Header de la fiche */}
                                    <div className="flex items-center gap-3 pb-4 mb-4 border-b border-border">
                                        <div className="p-2.5 rounded-lg bg-background-subtle text-foreground-muted">
                                            <Package className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <div className="text-sm font-medium text-foreground">
                                                T-Shirt Coton Bio
                                            </div>
                                            <div className="text-xs text-foreground-subtle">
                                                SKU: TS-BIO-01
                                            </div>
                                        </div>
                                    </div>

                                    {/* Contrôles de type de produit */}
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="text-foreground-muted">
                                                Gestion par Variantes
                                            </span>
                                            <span className="px-2 py-0.5 rounded-full bg-accent-subtle text-accent font-medium">
                                                Activée
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between text-xs">
                                            <span className="text-foreground-muted">
                                                Suivi par Lots / DLC
                                            </span>
                                            <span className="px-2 py-0.5 rounded-full bg-background-subtle text-foreground-subtle font-medium">
                                                Désactivé
                                            </span>
                                        </div>

                                        {/* Aperçu des variantes */}
                                        <div className="pt-2">
                                            <div className="text-xs font-medium text-foreground-subtle mb-2 uppercase tracking-wider">
                                                Variantes en stock
                                            </div>
                                            <div className="grid grid-cols-3 gap-2 text-center text-xs">
                                                <div className="p-2 rounded-lg border border-border bg-background-subtle">
                                                    <div className="font-medium text-foreground">S / Noir</div>
                                                    <div className="text-foreground-muted">14 ex.</div>
                                                </div>
                                                <div className="p-2 rounded-lg border border-border bg-background-subtle">
                                                    <div className="font-medium text-foreground">M / Noir</div>
                                                    <div className="text-foreground-muted">8 ex.</div>
                                                </div>
                                                <div className="p-2 rounded-lg border border-border bg-background-subtle">
                                                    <div className="font-medium text-foreground">L / Noir</div>
                                                    <div className="text-foreground-muted">22 ex.</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </AnimatedBlock>
                </div>
            </div>
        </section>
    );
}