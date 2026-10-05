import Link from "next/link";
import Navbar from "@/components/marketing/Navbar";
import Footer from "@/components/marketing/Footer";

export default function PolitiqueConfidentialitePage() {
  return (
    <main className="bg-background min-h-screen flex flex-col">
      
      <div className="grow max-w-4xl mx-auto px-6 py-32">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-8 tracking-tight">
          Politique de Confidentialité
        </h1>
        
        <div className="space-y-8 text-muted-foreground text-base leading-relaxed">
          <p className="text-sm italic">
            Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
          </p>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">
              1. Données collectées
            </h2>
            <p className="mb-4">
              Dans le cadre du fonctionnement de CorticalEvo, nous collectons et traitons les données suivantes :
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li><strong className="text-foreground">Comptes utilisateurs :</strong> Nom, adresse e-mail et mot de passe (haché de manière sécurisée) pour l'authentification.</li>
              <li><strong className="text-foreground">Données professionnelles :</strong> Noms, numéros de téléphone et adresses des clients et fournisseurs, strictement dans le but de gérer les transactions et les stocks.</li>
              <li><strong className="text-foreground">Journal d'activité :</strong> Enregistrement des actions (création, modification, suppression) pour assurer la traçabilité et la sécurité de l'inventaire.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">
              2. Finalité du traitement
            </h2>
            <p className="mb-6">
              Ces données sont utilisées exclusivement pour : assurer le bon fonctionnement de l'application de gestion de stock, permettre l'authentification des utilisateurs, et générer des rapports d'activité internes. Aucune donnée n'est vendue ou partagée avec des tiers à des fins commerciales.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">
              3. Politique des Cookies
            </h2>
            <p className="mb-6">
              CorticalEvo n'utilise <strong className="text-foreground">que des cookies techniques strictement nécessaires</strong> au fonctionnement du site (maintien de la session de connexion). Nous n'utilisons aucun cookie de traçage, de publicité ou d'analyse d'audience. Aucun bandeau de consentement n'est donc requis.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">
              4. Sécurité des données
            </h2>
            <p className="mb-6">
              Les mots de passe sont hachés via l'algorithme bcrypt. Les accès à l'application sont protégés par un système d'authentification par rôle (Administrateur / Employé). L'hébergement et la base de données respectent les standards de sécurité actuels.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">
              5. Durée de conservation (Spécificité Démo)
            </h2>
            <p className="mb-6">
              Dans le cadre de l'environnement de démonstration de cette application, <strong className="text-foreground">l'intégralité des données métier (ventes, stocks, clients) est automatiquement supprimée chaque vendredi à 00h00</strong>. Seuls les comptes utilisateurs de base sont conservés pour permettre une reconnexion.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">
              6. Contact
            </h2>
            <p className="mb-6">
              Pour toute question relative à cette politique, vous pouvez nous contacter via l'adresse e-mail de l'administrateur de l'application.
              
            </p>
          </section>
        </div>

        <div className="mt-16 pt-8 border-t border-border">
          <Link 
            href="/" 
            className="inline-flex items-center text-primary hover:text-accent-hover font-medium transition-colors"
          >
            ← Retour à l'accueil
          </Link>
        </div>
      </div>

    </main>
  );
}