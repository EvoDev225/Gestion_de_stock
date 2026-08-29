import { NextRequest, NextResponse } from 'next/server';
import { exigerRole } from '@/lib/auth';
import { genererEtEnregistrerRapport } from '@/lib/services/rapport.service';

export async function POST(request: NextRequest) {
    try {
        // Vérification de sécurité (Type Guard strict)
        const resultatAuth = await exigerRole(request, ['ADMIN']);
        if ('erreur' in resultatAuth) {
            return resultatAuth.erreur;
        }

        const rapport = await genererEtEnregistrerRapport(resultatAuth.session.id);

        return NextResponse.json(rapport, { status: 201 });
    } catch (erreur) {
        console.error('[API rapports/generer] Erreur serveur :', erreur);

        return NextResponse.json(
            { erreur: 'Une erreur est survenue lors de la génération du rapport.' },
            { status: 500 }
        );
    }
}