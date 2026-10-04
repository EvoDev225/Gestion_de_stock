import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

const TOURS_DE_HASHAGE = 10;

// Tables jamais vidées :
// - _prisma_migrations : historique Prisma (le vider ferait tout réappliquer par migrate deploy)
// - utilisateur : comptes conservés pour pouvoir se reconnecter après le reset
export async function remettreBaseAZero(): Promise<{
  tablesVidees: string[];
  comptesRecrees: number;
}> {
  const tablesVidees = await viderToutesLesTables();
  const comptesRecrees = await creerComptesSiAbsents();

  return { tablesVidees, comptesRecrees };
}

async function viderToutesLesTables(): Promise<string[]> {
  return prisma.$transaction(async (tx) => {
    const lignes = await tx.$queryRaw<{ tablename: string }[]>`
      SELECT tablename
      FROM pg_tables
      WHERE schemaname = 'public'
        AND lower(tablename) <> '_prisma_migrations'
        AND lower(tablename) <> 'utilisateur'
    `;

    const tablesVidees = lignes.map((ligne) => ligne.tablename);

    if (tablesVidees.length > 0) {
      const liste = tablesVidees
        .map((nom) => `"${nom.replace(/"/g, '""')}"`)
        .join(", ");
      await tx.$executeRawUnsafe(`TRUNCATE TABLE ${liste} CASCADE`);
    }

    return tablesVidees;
  });
}

// Utile pour le tout premier démarrage en production :
// si la table des comptes est vide (seed jamais lancé sur Vercel),
// recrée les comptes depuis les variables SEED_*.
async function creerComptesSiAbsents(): Promise<number> {
  const nombre = await prisma.utilisateur.count();
  if (nombre > 0) return 0;

  const adminEmail = process.env.SEED_ADMIN_EMAIL;
  const adminPassword = process.env.SEED_ADMIN_PASSWORD;
  if (!adminEmail || !adminPassword) return 0;

  const comptes: {
    nom: string;
    email: string;
    motDePasse: string;
    role: "ADMIN" | "EMPLOYEE";
  }[] = [
    { nom: "Administrateur", email: adminEmail, motDePasse: adminPassword, role: "ADMIN" },
  ];

  const employeeEmail = process.env.SEED_EMPLOYEE_EMAIL;
  const employeePassword = process.env.SEED_EMPLOYEE_PASSWORD;
  if (employeeEmail && employeePassword) {
    comptes.push({
      nom: "Employé",
      email: employeeEmail,
      motDePasse: employeePassword,
      role: "EMPLOYEE",
    });
  }

  for (const compte of comptes) {
    await prisma.utilisateur.create({
      data: {
        nom: compte.nom,
        email: compte.email,
        motDePasse: await bcrypt.hash(compte.motDePasse, TOURS_DE_HASHAGE),
        role: compte.role,
      },
    });
  }

  return comptes.length;
}