import { NextRequest, NextResponse } from 'next/server';
import { exigerRole } from '@/lib/auth';

import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
    try {
        // Vérification de sécurité (Type Guard strict)
        const resultatAuth = await exigerRole(request, ['ADMIN']);
        if ('erreur' in resultatAuth) {
            return resultatAuth.erreur;
        }

        // Pagination simple via Query Params (?limit=20)
        const { searchParams } = new URL(request.url);
        const limitParam = parseInt(searchParams.get('limit') || '20', 10);
        const limit = Math.min(Math.max(isNaN(limitParam) ? 20 : limitParam, 1), 100);

        const rapports = await prisma.rapportActivite.findMany({
            orderBy: { dateGeneration: 'desc' },
            take: limit,
            include: {
                utilisateur: {
                    select: {
                        id: true,
                        nom: true,
                        email: true,
                    },
                },
            },
        });

        return NextResponse.json(rapports, { status: 200 });
    } catch (erreur) {
        console.error('[API rapports] Erreur serveur :', erreur);

        return NextResponse.json(
            { erreur: 'Une erreur est survenue lors de la récupération des rapports.' },
            { status: 500 }
        );
    }
}