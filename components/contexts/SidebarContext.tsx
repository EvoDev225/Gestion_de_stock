"use client";

import {
    createContext,
    useContext,
    useState,
    type ReactNode,
} from "react";

interface SidebarContextValue {
    isMobileOpen: boolean;
    openMobile: () => void;
    closeMobile: () => void;
    openSections: Record<string, boolean>;
    toggleSection: (title: string) => void;
}

const SidebarContext = createContext<SidebarContextValue | null>(null);

export function SidebarProvider({ children }: { children: ReactNode }) {
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

    const toggleSection = (title: string) => {
        setOpenSections((prev) => ({ ...prev, [title]: !prev[title] }));
    };

    return (
        <SidebarContext.Provider
            value={{
                isMobileOpen,
                openMobile: () => setIsMobileOpen(true),
                closeMobile: () => setIsMobileOpen(false),
                openSections,
                toggleSection,
            }}
        >
            {children}
        </SidebarContext.Provider>
    );
}

export function useSidebar() {
    const ctx = useContext(SidebarContext);
    if (!ctx) throw new Error("useSidebar doit être utilisé dans un SidebarProvider");
    return ctx;
}