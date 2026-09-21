import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, User, Truck } from "lucide-react";
import { obtenirSessionServeur } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { serialiserReception } from "@/lib/serializers/reception-fournisseur";
import LignesReceptionDetail from "@/components/admin/receptions-fournisseur/LignesReceptionDetail";

export default async function ReceptionDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const session = await obtenirSessionServeur();

    if (!session || session.role !== "ADMIN") {
        redirect("/connexion");
    }

    const { id } = await params;

    const reception = await prisma.receptionFournisseur.findUnique({
        where: { id },
        include: {
            lignesReception: {
                include: { ligneCommandeFournisseur: { include: { produit: true } } },
            },
            commandeFournisseur: { include: { fournisseur: true } },
            utilisateur: true,
        },
    });

    if (!reception) {
        notFound();
    }

    const receptionSerialisee = serialiserReception(reception);

    return (
        <div className="space-y-6">
            <Link
                href="/dashboard/receptions-fournisseur"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
                <ArrowLeft className="h-4 w-4" />
                Retour aux réceptions
            </Link>

            <div className="bg-card border border-border rounded-lg p-6 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h1 className="text-xl font-semibold text-foreground">
                            Réception du{" "}
                            {new Date(receptionSerialisee.dateReception).toLocaleDateString("fr-FR")}
                        </h1>
                        <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                            <Truck className="h-4 w-4" />
                            {receptionSerialisee.commandeFournisseur?.fournisseur.nom ?? "Fournisseur inconnu"}
                        </p>
                    </div>

                    <div className="text-sm text-muted-foreground flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Reçu par {receptionSerialisee.utilisateur?.nom}
                    </div>
                </div>

                <Link
                    href={`/dashboard/commandes-fournisseur/${receptionSerialisee.commandeFournisseurId}`}
                    className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                >
                    Voir la commande liée
                </Link>
            </div>

            <LignesReceptionDetail lignesReception={receptionSerialisee.lignesReception} />
        </div>
    );
}