"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
    LayoutDashboard,
    Package,
    Boxes,
    ClipboardCheck,
    Truck,
    ShoppingCart,
    PackageCheck,
    Users,
    Receipt,
    Undo2,
    History,
    BarChart3,
    UserCog,
    Settings,
    LogOut,
    ChevronDown,
    X,
    type LucideIcon,
} from "lucide-react";
import { useSidebar } from "@/components/contexts/SidebarContext";


interface NavItem {
    label: string;
    href: string;
    icon: LucideIcon;
}

interface NavSection {
    title: string;
    items: NavItem[];
}

interface AdminSidebarProps {
    userName?: string;
    userRole?: string;
}

const navSections: NavSection[] = [
    {
        title: "Vue d'ensemble",
        items: [{ label: "Tableau de bord", href: "/dashboard", icon: LayoutDashboard }],
    },
    {
        title: "Stock",
        items: [
            { label: "Produits & Variantes", href: "/dashboard/products", icon: Package },
            { label: "Stock & Lots", href: "/dashboard/stock", icon: Boxes },
            { label: "Inventaires", href: "/dashboard/inventaires", icon: ClipboardCheck },
        ],
    },
    {
        title: "Achats",
        items: [
            { label: "Fournisseurs", href: "/dashboard/fournisseurs", icon: Truck },
            { label: "Commandes fournisseurs", href: "/dashboard/purchase-orders", icon: ShoppingCart },
            { label: "Réceptions", href: "/dashboard/receptions", icon: PackageCheck },
        ],
    },
    {
        title: "Ventes",
        items: [
            { label: "Clients", href: "/dashboard/customers", icon: Users },
            { label: "Ventes", href: "/dashboard/sales", icon: Receipt },
            { label: "Retours", href: "/dashboard/returns", icon: Undo2 },
        ],
    },
    {
        title: "Système",
        items: [
            { label: "Journal d'activité", href: "/dashboard/logs", icon: History },
            { label: "Rapports & Exports", href: "/dashboard/reports", icon: BarChart3 },
            { label: "Utilisateurs", href: "/dashboard/users", icon: UserCog },
            { label: "Paramètres", href: "/dashboard/settings", icon: Settings },
        ],
    },
];

export default function AdminSidebar({
    userName = "Admin Dupont",
    userRole = "Administrateur",
}: AdminSidebarProps) {
    const pathname = usePathname();
    const router = useRouter();
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const {
        isMobileOpen,
        closeMobile,
        openSections,
        toggleSection,
    } = useSidebar();

    const getInitials = (name: string): string =>
        name.split(" ").map((part) => part[0]).join("").toUpperCase().slice(0, 2);

    // Ferme le drawer mobile à chaque changement de route
    useEffect(() => {
        closeMobile();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pathname]);

    // Une section est "ouverte" si l'utilisateur l'a togglée (mobile uniquement),
    // ou par défaut si elle contient la page active
    const isSectionOpen = (section: NavSection) => {
        if (section.title in openSections) return openSections[section.title];
        return section.items.some((item) => item.href === pathname);
    };

    const handleLogout = async () => {
        if (isLoggingOut) return;
        setIsLoggingOut(true);
        try {
            await fetch("/api/auth/logout", { method: "POST" });
            router.push("/login");
            router.refresh(); // force le middleware à revalider l'absence de session
        } catch (error) {
            console.error("Erreur lors de la déconnexion :", error);
            setIsLoggingOut(false);
        }
    };

    return (
        <>
            {/* Overlay mobile */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 bg-foreground/40 backdrop-blur-sm z-40 md:hidden"
                    onClick={closeMobile}
                    aria-hidden="true"
                />
            )}

            <aside
                className={`fixed left-0 top-0 h-screen bg-card shadow-[24px_0_48px_rgba(26,26,26,0.04)] flex flex-col z-50 border-r border-border
                    transition-transform duration-300 ease-in-out
                    w-72 ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
                    md:translate-x-0 md:w-20 lg:w-64`}
            >
                {/* Logo */}
                <div className="h-20 flex items-center justify-between px-4 shrink-0 overflow-hidden">
                    {/* Nom complet : visible en drawer mobile et en desktop, masqué en rail tablette */}
                    <span className="inline md:hidden lg:inline text-xl font-bold text-primary whitespace-nowrap">
                        CorticalEvo
                    </span>
                    {/* Abréviation : visible uniquement en rail tablette */}
                    <span className="hidden md:inline lg:hidden text-xl font-bold text-primary">
                        CE
                    </span>

                    {/* Fermer le drawer (mobile uniquement) */}
                    <button
                        type="button"
                        onClick={closeMobile}
                        className="md:hidden text-muted-foreground hover:text-primary p-1"
                        aria-label="Fermer le menu"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto overflow-x-hidden py-4 px-3 flex flex-col gap-2">
                    {navSections.map((section) => {
                        const sectionOpen = isSectionOpen(section);

                        return (
                            <div key={section.title} className="group/section">
                                {/* En-tête de section — accordéon cliquable, mobile uniquement */}
                                <button
                                    type="button"
                                    onClick={() => toggleSection(section.title)}
                                    className="w-full flex md:hidden items-center justify-between px-3 mb-1 text-xs font-semibold font-display text-muted-foreground uppercase tracking-wider"
                                >
                                    {section.title}
                                    <ChevronDown
                                        className={`w-3.5 h-3.5 transition-transform duration-200 ${
                                            sectionOpen ? "rotate-0" : "-rotate-90"
                                        }`}
                                    />
                                </button>

                                {/* Séparateur discret en rail tablette (pas d'en-tête de section là) */}
                                <div className="hidden md:block lg:hidden h-px bg-border mx-2 mb-2" />

                                {/* Titre de section en desktop (statique, jamais repliable) */}
                                <p className="hidden lg:block px-3 mb-1 text-xs font-semibold font-display text-muted-foreground uppercase tracking-wider">
                                    {section.title}
                                </p>

                                <div
                                    className={`flex flex-col gap-1 overflow-hidden transition-all duration-200
                                        md:max-h-none lg:max-h-none
                                        ${!sectionOpen ? "max-h-0" : "max-h-[500px]"}
                                    `}
                                >
                                    {section.items.map((item) => {
                                        const Icon = item.icon;
                                        const isActive = pathname === item.href;

                                        return (
                                            <Link
                                                key={item.href}
                                                href={item.href}
                                                title={item.label}
                                                className={`relative flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors
                                                    md:justify-center lg:justify-start
                                                    ${
                                                        isActive
                                                            ? "bg-primary/10 text-primary font-bold border-l-4 border-primary md:border-l-0 lg:border-l-4"
                                                            : "text-muted-foreground hover:text-primary hover:bg-muted/50"
                                                    }`}
                                            >
                                                <Icon className="w-5 h-5 shrink-0" />
                                                <span className="text-sm font-medium truncate md:hidden lg:inline">
                                                    {item.label}
                                                </span>
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </nav>

                {/* Profile Block */}
                <div className="p-3 border-t border-border mt-auto shrink-0">
                    <div className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                        <div className="flex items-center gap-3 min-w-0">
                            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold text-sm border border-border shrink-0">
                                {getInitials(userName)}
                            </div>
                            <div className="overflow-hidden md:hidden lg:block">
                                <p className="text-sm font-medium text-foreground truncate">{userName}</p>
                                <p className="text-xs text-muted-foreground truncate">{userRole}</p>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={handleLogout}
                            disabled={isLoggingOut}
                            className="text-muted-foreground hover:text-destructive transition-colors p-1 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed md:hidden lg:block"
                            aria-label="Déconnexion"
                        >
                            <LogOut className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
}