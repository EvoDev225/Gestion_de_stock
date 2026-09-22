"use client";

interface ProductsTabsProps {
    activeTab: "produits" | "categories";
    onTabChange: (tab: "produits" | "categories") => void;
    produitsCount?: number;
    categoriesCount?: number;
}

export default function ProductsTabs({
    activeTab,
    onTabChange,
    produitsCount,
    categoriesCount,
}: ProductsTabsProps) {
    return (
        <div className="flex gap-6 border-b border-border">
            <button
                type="button"
                onClick={() => onTabChange("produits")}
                className={`pb-3 px-1 text-sm font-medium transition-colors duration-200 border-b-2 ${activeTab === "produits"
                        ? "text-primary border-primary font-semibold"
                        : "text-muted-foreground border-transparent hover:text-foreground"
                    }`}
            >
                Produits
                {produitsCount !== undefined && (
                    <span className="ml-1.5 text-xs">({produitsCount})</span>
                )}
            </button>

            <button
                type="button"
                onClick={() => onTabChange("categories")}
                className={`pb-3 px-1 text-sm font-medium transition-colors duration-200 border-b-2 ${activeTab === "categories"
                        ? "text-primary border-primary font-semibold"
                        : "text-muted-foreground border-transparent hover:text-foreground"
                    }`}
            >
                Catégories
                {categoriesCount !== undefined && (
                    <span className="ml-1.5 text-xs">({categoriesCount})</span>
                )}
            </button>
        </div>
    );
}