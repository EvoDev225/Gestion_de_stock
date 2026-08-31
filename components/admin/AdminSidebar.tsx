"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
    type LucideIcon,
} from "lucide-react";

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
        items: [
            { label: "Tableau de bord", href: "/dashboard", icon: LayoutDashboard },
        ],
    },
    {
        title: "Stock",
        items: [
            { label: "Produits & Variantes", href: "/dashboard/products", icon: Package },
            { label: "Stock & Lots", href: "/dashboard/stock", icon: Boxes },
            { label: "Inventaires", href: "/dashboard/inventory", icon: ClipboardCheck },
        ],
    },
    {
        title: "Achats",
        items: [
            { label: "Fournisseurs", href: "/dashboard/suppliers", icon: Truck },
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

    // Helper pour extraire les initiales de l'utilisateur pour le fallback de l'avatar
    const getInitials = (name: string): string => {
        return name
            .split(" ")
            .map((part) => part[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <aside className="w-64 h-screen fixed left-0 top-0 bg-card shadow-[24px_0_48px_rgba(26,26,26,0.04)] flex flex-col z-50 border-r border-border">
            {/* Logo */}
            <div className="h-20 flex items-center px-6">
                <span className="text-xl font-bold text-primary">CorticalEvo</span>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto py-4 px-3 flex flex-col gap-6">
                {navSections.map((section) => (
                    <div key={section.title}>
                        <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                            {section.title}
                        </h3>
                        <div className="flex flex-col gap-1">
                            {section.items.map((item) => {
                                const Icon = item.icon;
                                const isActive = pathname === item.href;

                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${isActive
                                                ? "bg-primary/10 text-primary font-bold border-l-4 border-primary"
                                                : "text-muted-foreground hover:text-primary hover:bg-muted/50"
                                            }`}
                                    >
                                        <Icon className="w-5 h-5 shrink-0" />
                                        <span className="text-sm font-medium">{item.label}</span>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </nav>

            {/* Profile Block */}
            <div className="p-4 border-t border-border mt-auto">
                <div className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold text-sm border border-border shrink-0">
                            {getInitials(userName)}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-medium text-foreground truncate">{userName}</p>
                            <p className="text-xs text-muted-foreground truncate">{userRole}</p>
                        </div>
                    </div>
                    <button
                        type="button"
                        className="text-muted-foreground hover:text-destructive transition-colors p-1 cursor-pointer"
                        aria-label="Déconnexion"
                    >
                        <LogOut className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </aside>
    );
}