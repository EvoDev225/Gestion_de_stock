"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    LayoutDashboard,
    Receipt,
    Users,
    Package,
    Boxes,
    BarChart3,
    Settings,
    ChevronDown,
    X,
    LogOut,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { useSidebar } from "../contexts/SidebarContext";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface NavItem {
    label: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
}

interface NavSection {
    title: string;
    items: NavItem[];
}

interface EmployeeSidebarProps {
    userName?: string;
    userRole?: string;
}

/* ------------------------------------------------------------------ */
/*  Navigation — périmètre EMPLOYEE                                    */
/* ------------------------------------------------------------------ */

const navSections: NavSection[] = [
    {
        title: "Vue d'ensemble",
        items: [
            { label: "Tableau de bord", href: "/dashboard/employe", icon: LayoutDashboard },
        ],
    },
    {
        title: "Ventes",
        items: [
            { label: "Ventes", href: "/dashboard/employe/ventes", icon: Receipt },
            { label: "Clients", href: "/dashboard/employe/clients", icon: Users },
        ],
    },
    {
        title: "Stock",
        items: [
            { label: "Produits & Variantes", href: "/dashboard/employe/products", icon: Package },
            { label: "Stock & Lots", href: "/dashboard/employe/stock", icon: Boxes },
        ],
    },
    {
        title: "Système",
        items: [
            { label: "Rapports & Exports", href: "/dashboard/rapports", icon: BarChart3 },
            { label: "Paramètres", href: "/dashboard/parametres", icon: Settings },
        ],
    },
];

/* ------------------------------------------------------------------ */
/*  Composant                                                          */
/* ------------------------------------------------------------------ */

export default function EmployeeSidebar({
    userName = "Employé Dupont",
    userRole = "EMPLOYEE",
}: EmployeeSidebarProps) {
    const pathname = usePathname();
    const router = useRouter();
    const { isOpen, closeSidebar } = useSidebar();

    /* Accordéon mobile : une section ouverte à la fois */
    const [openSections, setOpenSections] = useState<Record<string, boolean>>(
        () =>
            Object.fromEntries(
                navSections.map((section) => [
                    section.title,
                    section.items.some((item) => pathname.startsWith(item.href)),
                ]),
            ),
    );

    const toggleSection = (title: string) => {
        setOpenSections((prev) => ({ ...prev, [title]: !prev[title] }));
    };

    /* Déconnexion */
    const handleLogout = async () => {
        try {
            await fetch("/api/auth/logout", { method: "POST" });
        } finally {
            router.push("/login");
        }
    };

    /* Initiales pour l'avatar */
    const initiales = userName
        .split(" ")
        .map((mot) => mot[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

    /* ---------------------------------------------------------------- */
    /*  Rendu d'un lien de navigation                                    */
    /* ---------------------------------------------------------------- */

    const renderNavItem = (item: NavItem, compact: boolean = false) => {
        const actif =
            item.href === "/dashboard/employe"
                ? pathname === item.href
                : pathname.startsWith(item.href);

        return (
            <Link
                key={item.href}
                href={item.href}
                onClick={closeSidebar}
                className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    actif
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                    compact && "justify-center px-2",
                )}
                title={compact ? item.label : undefined}
            >
                <item.icon className="h-5 w-5 shrink-0" />
                {!compact && <span>{item.label}</span>}
            </Link>
        );
    };

    /* ---------------------------------------------------------------- */
    /*  Contenu de la sidebar (réutilisé pour drawer et sidebar fixe)    */
    /* ---------------------------------------------------------------- */

    const sidebarContent = (compact: boolean = false) => (
        <div className="flex h-full flex-col">
            {/* Logo */}
            <div
                className={cn(
                    "flex h-16 shrink-0 items-center border-b border-border",
                    compact ? "justify-center px-2" : "gap-3 px-4",
                )}
            >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
                    CE
                </div>
                {!compact && (
                    <span className="text-lg font-semibold tracking-tight">
                        CorticalEvo
                    </span>
                )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto px-3 py-4">
                <ul className="space-y-6">
                    {navSections.map((section) => (
                        <li key={section.title}>
                            {/* Titre de section */}
                            {!compact && (
                                <button
                                    type="button"
                                    onClick={() => toggleSection(section.title)}
                                    className="mb-1 flex w-full items-center justify-between px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                                >
                                    <span>{section.title}</span>
                                    <ChevronDown
                                        className={cn(
                                            "h-3.5 w-3.5 transition-transform",
                                            openSections[section.title] && "rotate-180",
                                        )}
                                    />
                                </button>
                            )}

                            {/* Items */}
                            {(compact || openSections[section.title]) && (
                                <ul className={cn("space-y-1", !compact && "mt-1")}>
                                    {section.items.map((item) => (
                                        <li key={item.href}>
                                            {renderNavItem(item, compact)}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </li>
                    ))}
                </ul>
            </nav>

            {/* Bloc profil */}
            <div
                className={cn(
                    "shrink-0 border-t border-border p-4",
                    compact && "flex flex-col items-center px-2",
                )}
            >
                <div
                    className={cn(
                        "flex items-center gap-3",
                        compact && "flex-col gap-2",
                    )}
                >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-semibold text-muted-foreground">
                        {initiales}
                    </div>
                    {!compact && (
                        <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium">{userName}</p>
                            <p className="truncate text-xs text-muted-foreground">
                                {userRole}
                            </p>
                        </div>
                    )}
                    <button
                        type="button"
                        onClick={handleLogout}
                        className={cn(
                            "shrink-0 rounded-md p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive",
                            compact && "mt-1",
                        )}
                        title="Se déconnecter"
                    >
                        <LogOut className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </div>
    );

    /* ---------------------------------------------------------------- */
    /*  JSX principal                                                    */
    /* ---------------------------------------------------------------- */

    return (
        <>
            {/* Overlay mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 lg:hidden"
                    onClick={closeSidebar}
                    aria-hidden="true"
                />
            )}

            {/* Drawer mobile */}
            <aside
                className={cn(
                    "fixed inset-y-0 left-0 z-50 w-64 transform bg-background shadow-lg transition-transform duration-200 ease-in-out lg:hidden",
                    isOpen ? "translate-x-0" : "-translate-x-full",
                )}
            >
                {/* Bouton fermer mobile */}
                <button
                    type="button"
                    onClick={closeSidebar}
                    className="absolute right-3 top-4 rounded-md p-1 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                >
                    <X className="h-5 w-5" />
                </button>

                {sidebarContent()}
            </aside>

            {/* Rail tablette (md) — icônes uniquement */}
            <aside className="hidden md:fixed md:inset-y-0 md:left-0 md:z-30 md:block md:w-16 md:border-r md:border-border md:bg-background lg:hidden">
                {sidebarContent(true)}
            </aside>

            {/* Sidebar complète (lg+) */}
            <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-30 lg:block lg:w-64 lg:border-r lg:border-border lg:bg-background">
                {sidebarContent()}
            </aside>
        </>
    );
}