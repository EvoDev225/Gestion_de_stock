"use client";

import { useState, type ChangeEvent } from "react";

import { Search, Bell, Menu } from "lucide-react";
import ThemeToggle from "../shared/ThemeToggle";
import { useSidebar } from "@/components/contexts/SidebarContext";

interface AdminTopbarProps {
    userName?: string;
    userRole?: string;
    hasNotifications?: boolean;
    onSearch?: (value: string) => void;
}

export default function AdminTopbar({
    userName = "Admin Dupont",
    userRole = "Administrateur",
    hasNotifications = false,
    onSearch,
}: AdminTopbarProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const { openMobile } = useSidebar();

    const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchQuery(value);
        if (onSearch) {
            onSearch(value);
        }
    };

    const getInitials = (name: string): string => {
        return name
            .split(" ")
            .map((part) => part[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <header className="h-20 ml-0 md:ml-20 lg:ml-64 bg-background/80 backdrop-blur-xl border-b border-border/30 flex justify-between items-center px-4 md:px-8 sticky top-0 z-40 transition-colors">
            {/* Hamburger — mobile uniquement, ouvre le drawer */}
            <button
                type="button"
                onClick={openMobile}
                className="md:hidden p-2 -ml-2 mr-2 text-muted-foreground hover:bg-muted/50 rounded-lg transition-colors cursor-pointer"
                aria-label="Ouvrir le menu"
            >
                <Menu className="w-5 h-5" />
            </button>

            {/* Barre de recherche */}
            <div className="relative w-full max-w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
                <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-muted-foreground"
                    placeholder="Rechercher un produit, client, référence..."
                />
            </div>

            {/* Actions (Notifications, Thème, Profil) */}
            <div className="flex items-center gap-4">
                <button
                    type="button"
                    className="relative p-2 text-muted-foreground hover:bg-muted/50 rounded-full transition-colors cursor-pointer"
                    aria-label="Notifications"
                >
                    <Bell className="w-5 h-5" />
                    {hasNotifications && (
                        <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-destructive rounded-full border-2 border-background" />
                    )}
                </button>

                <ThemeToggle />

                <div className="h-8 w-px bg-border/30 mx-2 hidden sm:block" />

                <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-foreground hidden md:block">
                        {userName}
                    </span>
                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold text-xs border border-border shrink-0">
                        {getInitials(userName)}
                    </div>
                </div>
            </div>
        </header>
    );
}