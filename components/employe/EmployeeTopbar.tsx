"use client";

import { useState } from "react";
import Link from "next/link";
import { Bell, Menu, Search } from "lucide-react";

import ThemeToggle from "../shared/ThemeToggle";
import { useSidebar } from "../contexts/SidebarContext";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface EmployeeTopbarProps {
    userName?: string;
    userRole?: string;
}

/* ------------------------------------------------------------------ */
/*  Composant                                                          */
/* ------------------------------------------------------------------ */

export default function EmployeeTopbar({
    userName = "Employé Dupont",
    userRole = "EMPLOYEE",
}: EmployeeTopbarProps) {
    const { openSidebar } = useSidebar();
    const [recherche, setRecherche] = useState("");

    /* Notifications — placeholder, à brancher sur un vrai compteur plus tard */
    const nombreNotifications = 0;

    /* Initiales pour l'avatar */
    const initiales = userName
        .split(" ")
        .map((mot) => mot[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

    return (
        <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center gap-4 border-b border-border bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:px-6">
            {/* Bouton menu mobile */}
            <button
                type="button"
                onClick={openSidebar}
                className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground lg:hidden"
                aria-label="Ouvrir le menu"
            >
                <Menu className="h-5 w-5" />
            </button>

            {/* Barre de recherche */}
            <div className="relative w-full max-w-md">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                    type="search"
                    value={recherche}
                    onChange={(e) => setRecherche(e.target.value)}
                    placeholder="Rechercher une vente, un client..."
                    className="h-9 w-full rounded-md border border-border bg-muted/40 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
            </div>

            {/* Actions à droite */}
            <div className="ml-auto flex items-center gap-2">
                {/* Thème */}
                <ThemeToggle />

                {/* Notifications */}
                <Link
                    href="/dashboard/notifications"
                    className="relative rounded-md p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                    aria-label="Notifications"
                >
                    <Bell className="h-5 w-5" />
                    {nombreNotifications > 0 && (
                        <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-semibold text-destructive-foreground">
                            {nombreNotifications}
                        </span>
                    )}
                </Link>

                {/* Bloc profil */}
                <Link
                    href="/dashboard/profil"
                    className="flex items-center gap-3 rounded-md px-2 py-1.5 transition-colors hover:bg-accent"
                >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground">
                        {initiales}
                    </div>
                    <div className="hidden text-left md:block">
                        <p className="truncate text-sm font-medium leading-tight">
                            {userName}
                        </p>
                        <p className="truncate text-xs leading-tight text-muted-foreground">
                            {userRole}
                        </p>
                    </div>
                </Link>
            </div>
        </header>
    );
}