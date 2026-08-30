import { Boxes, MoreHorizontal, Package, TriangleAlert } from "lucide-react";

export function AuthVisualPanel() {
    return (
        <div className="hidden lg:flex relative overflow-hidden h-full min-h-screen flex-col p-8 md:p-12 bg-brand-panel select-none">
            {/* Arrière-plan avec motif de points (dot-grid) */}
            <div
                className="absolute inset-0 z-0 pointer-events-none"
                style={{
                    backgroundImage: "radial-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px)",
                    backgroundSize: "24px 24px",
                }}
            />

            {/* En-tête avec Logo */}
            <div className="relative z-10 flex items-center gap-2 text-brand-panel-foreground font-bold text-xl">
                <Boxes className="w-6 h-6" />
                <span>CorticalEvo</span>
            </div>

            {/* Contenu central */}
            <div className="relative z-10 grow flex flex-col justify-center max-w-md mx-auto w-full">
                <h2 className="text-2xl md:text-3xl font-bold text-brand-panel-foreground mb-12 leading-tight">
                    Reprenez le contrôle de votre stock
                </h2>

                {/* Carte mockup flottante */}
                <div className="bg-white rounded-xl p-6 ambient-shadow transform -rotate-2 hover:rotate-0 transition-transform duration-500 ease-out flex flex-col w-full">
                    
                    {/* En-tête de la carte */}
                    <div className="flex items-center justify-between border-b border-border pb-4 mb-5">
                        <span className="text-sm font-medium text-foreground">
                            Aperçu de l'inventaire
                        </span>
                        <MoreHorizontal className="w-5 h-5 text-muted-foreground" />
                    </div>

                    {/* Lignes de stock */}
                    <div className="flex flex-col gap-5">
                        {/* Ligne 1 : Optimal */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                                    <Package className="w-5 h-5" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm font-medium text-foreground">
                                        Composants Électroniques
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                        1 240 Unités
                                    </span>
                                </div>
                            </div>
                            <div className="bg-primary/10 text-primary rounded-full px-2.5 py-1 text-xs font-medium">
                                Optimal
                            </div>
                        </div>

                        {/* Ligne 2 : Critique */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-destructive/10 text-destructive flex items-center justify-center shrink-0">
                                    <TriangleAlert className="w-5 h-5" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm font-medium text-foreground">
                                        Matériaux d'Emballage
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                        45 Unités
                                    </span>
                                </div>
                            </div>
                            <div className="bg-destructive/10 text-destructive rounded-full px-2.5 py-1 text-xs font-medium">
                                Critique
                            </div>
                        </div>
                    </div>

                    {/* Mini bar chart en pied de carte */}
                    <div className="border-t border-border pt-5 mt-6">
                        <div className="flex items-end justify-between gap-1.5 h-16 w-full">
                            <div className="bg-primary/20 w-full rounded-t-sm h-[30%]" />
                            <div className="bg-primary/40 w-full rounded-t-sm h-[50%]" />
                            <div className="bg-primary/50 w-full rounded-t-sm h-[40%]" />
                            <div className="bg-primary/70 w-full rounded-t-sm h-[70%]" />
                            <div className="bg-primary/90 w-full rounded-t-sm h-[90%]" />
                            <div className="bg-primary w-full rounded-t-sm h-full" />
                        </div>
                    </div>
                    
                </div>
            </div>
        </div>
    );
}