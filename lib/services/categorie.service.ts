import { prisma } from "@/lib/prisma";

export async function listerCategories() {
    return prisma.categorie.findMany({
        orderBy: { nom: "asc" },
    });
}

export async function obtenirCategorieParId(id: string) {
    return prisma.categorie.findUnique({
        where: { id },
    });
}

export async function creerCategorie(data: {
    nom: string;
    description?: string;
}) {
    return prisma.categorie.create({
        data,
    });
}

export async function modifierCategorie(
    id: string,
    data: { nom?: string; description?: string },
) {
    return prisma.categorie.update({
        where: { id },
        data,
    });
}

export async function supprimerCategorie(id: string) {
    const produitsLies = await prisma.produit.count({
        where: { categorieId: id },
    });

    if (produitsLies > 0) {
        throw new Error(
            "Impossible de supprimer une catégorie liée à des produits",
        );
    }

    return prisma.categorie.delete({
        where: { id },
    });
}
