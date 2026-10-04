import { prisma } from "../lib/prisma";
import bcrypt from "bcryptjs";

async function main() {
  console.log("🌱 Démarrage du processus de seed...");

  // 0. Lecture des mots de passe depuis l'environnement (jamais en dur)
  const motDePasseAdmin = process.env.SEED_ADMIN_PASSWORD;
  const motDePasseEmploye = process.env.SEED_EMPLOYE_PASSWORD;

  if (!motDePasseAdmin || !motDePasseEmploye) {
    throw new Error(
      "SEED_ADMIN_PASSWORD et SEED_EMPLOYE_PASSWORD doivent être définies dans .env"
    );
  }

  // 1. Vidage dynamique et sécurisé de toutes les tables du schéma public
  console.log("🧹 Troncature de la base de données...");

  // Sélectionne et formate chaque nom de table avec quote_ident pour éviter les injections SQL
  const tablenames = await prisma.$queryRawUnsafe<{ tablename: string }[]>(
    `SELECT quote_ident(tablename) as tablename
     FROM pg_tables
     WHERE schemaname = 'public'
       AND tablename != '_prisma_migrations';`
  );

  if (tablenames.length > 0) {
    // Construction de la liste des tables séparées par des virgules
    const listOfTables = tablenames.map((t) => t.tablename).join(", ");

    // Une seule instruction TRUNCATE CASCADE avec RESTART IDENTITY
    await prisma.$executeRawUnsafe(
      `TRUNCATE TABLE ${listOfTables} RESTART IDENTITY CASCADE;`
    );

    console.log(`✅ ${tablenames.length} table(s) vidée(s) avec succès.`);
  } else {
    console.log("ℹ️ Aucune table à vider.");
  }

  // 2. Hashage des mots de passe
  console.log("🔐 Hashage des mots de passe avec bcryptjs...");
  const hashAdmin = await bcrypt.hash(motDePasseAdmin, 10);
  const hashEmploye = await bcrypt.hash(motDePasseEmploye, 10);

  // 3. Création des 2 utilisateurs
  console.log("👤 Création des comptes utilisateurs par défaut...");

  const admin = await prisma.utilisateur.create({
    data: {
      nom: "admin",
      email: "admin@gmail.com",
      motDePasse: hashAdmin,
      role: "ADMIN",
    },
  });

  const employe = await prisma.utilisateur.create({
    data: {
      nom: "employe",
      email: "employe@gmail.com",
      motDePasse: hashEmploye,
      role: "EMPLOYEE",
    },
  });

  console.log(`✅ Compte Administrateur créé : ${admin.email} (${admin.id})`);
  console.log(`✅ Compte Employé créé        : ${employe.email} (${employe.id})`);
  console.log("🎉 Seed terminé avec succès !");
}

main()
  .catch((e) => {
    console.error("❌ Erreur pendant l'exécution du seed :", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });