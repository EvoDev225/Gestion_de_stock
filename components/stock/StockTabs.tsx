"use client";

interface StockTabsProps {
    activeTab: "lots" | "mouvements";
    onTabChange: (tab: "lots" | "mouvements") => void;
    lotsCount?: number;
    mouvementsCount?: number;
}

export default function StockTabs({
    activeTab,
    onTabChange,
    lotsCount,
    mouvementsCount,
}: StockTabsProps) {
    return (
        <div className="flex gap-6 border-b border-border">
            <button
                type="button"
                onClick={() => onTabChange("lots")}
                className={`pb-3 px-1 text-sm font-medium transition-colors duration-200 border-b-2 ${activeTab === "lots"
                        ? "text-primary border-primary font-semibold"
                        : "text-muted-foreground border-transparent hover:text-foreground"
                    }`}
            >
                Lots
                {lotsCount !== undefined && (
                    <span className="ml-1.5 text-xs">({lotsCount})</span>
                )}
            </button>

            <button
                type="button"
                onClick={() => onTabChange("mouvements")}
                className={`pb-3 px-1 text-sm font-medium transition-colors duration-200 border-b-2 ${activeTab === "mouvements"
                        ? "text-primary border-primary font-semibold"
                        : "text-muted-foreground border-transparent hover:text-foreground"
                    }`}
            >
                Mouvements
                {mouvementsCount !== undefined && (
                    <span className="ml-1.5 text-xs">({mouvementsCount})</span>
                )}
            </button>
        </div>
    );
}