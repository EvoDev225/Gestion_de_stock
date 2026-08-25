"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Search, Bell, ChevronDown } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type UserRole = "ADMIN" | "EMPLOYEE";

type TopNavbarProps = {
    utilisateurNom: string;
    utilisateurRole: UserRole;
    hasNotifications?: boolean;
};

const NAV_ITEMS = [
    { label: "Vue d'ensemble", href: "/dashboard" },
    { label: "Produits", href: "/dashboard/produits" },
    { label: "Ventes", href: "/dashboard/ventes" },
    { label: "Commandes", href: "/dashboard/commandes" },
    { label: "Activité", href: "/dashboard/activite" },
];

export function TopNavbar({
    utilisateurNom,
    utilisateurRole,
    hasNotifications = false,
}: TopNavbarProps) {
    const pathname = usePathname();
    const router = useRouter();

    const initials = utilisateurNom
        .split(" ")
        .map((part) => part[0])
        .join("")
        .toUpperCase()
        .slice(0, 2) || "AD";

    const handleLogout = async () => {
        try {
            await fetch("/api/auth/logout", { method: "POST" });
        } catch {
            // ignore
        } finally {
            router.push("/login");
        }
    };

    return (
        <header className="flex h-16 items-center justify-between border-b border-border bg-background px-5">
            {/* Gauche */}
            <div className="flex items-center gap-5">
                <span className="font-display text-sm font-medium text-foreground">
                    Stockflow
                </span>

                <nav
                    className="flex items-center gap-1 rounded-full bg-secondary p-1"
                    aria-label="Navigation principale"
                >
                    {NAV_ITEMS.map((item) => {
                        const isActive =
                            pathname === item.href || pathname.startsWith(item.href + "/");
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${isActive
                                        ? "bg-foreground text-background"
                                        : "text-muted-foreground hover:text-foreground"
                                    }`}
                            >
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            {/* Droite */}
            <div className="flex items-center gap-2.5">
                <button
                    type="button"
                    aria-label="Rechercher"
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary transition-colors hover:bg-secondary/80"
                >
                    <Search className="h-3.5 w-3.5 text-muted-foreground" />
                </button>

                <button
                    type="button"
                    aria-label="Notifications"
                    className="relative flex h-8 w-8 items-center justify-center rounded-full bg-secondary transition-colors hover:bg-secondary/80"
                >
                    <Bell className="h-3.5 w-3.5 text-muted-foreground" />
                    {hasNotifications && (
                        <span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-destructive" />
                    )}
                </button>

                <DropdownMenu>
    <DropdownMenuTrigger
        render={
            <button
                type="button"
                className="flex items-center gap-1.5 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label="Menu utilisateur"
            />
        }
    >
        <Avatar className="h-8 w-8 rounded-full bg-primary">
            <AvatarFallback className="h-full w-full rounded-full bg-primary text-xs font-medium text-primary-foreground">
                {initials}
            </AvatarFallback>
        </Avatar>
        <ChevronDown className="h-3 w-3 text-muted-foreground" />
    </DropdownMenuTrigger>

    <DropdownMenuContent align="end" className="w-56">
        <div className="px-2 py-1.5">
            <p className="text-sm font-medium text-foreground">
                {utilisateurNom}
            </p>
            <p className="text-xs text-muted-foreground">
                {utilisateurRole === "ADMIN" ? "Administrateur" : "Employé"}
            </p>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem render={<Link href="/dashboard/parametres" />}>
            Paramètres du compte
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
            className="text-destructive focus:text-destructive"
            onSelect={(e) => {
                e.preventDefault();
                handleLogout();
            }}
        >
            Déconnexion
        </DropdownMenuItem>
    </DropdownMenuContent>
</DropdownMenu>
            </div>
        </header>
    );
}

export default TopNavbar;