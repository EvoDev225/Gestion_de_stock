import Link from "next/link";

export default function Footer() {
    return (
        <footer className="w-full border-t border-border py-16 px-6 bg-background">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-8">

                {/* Bloc gauche : Logo et Copyright */}
                <div className="flex flex-col gap-2">
                    <span className="font-bold text-lg text-foreground">CorticalEvo</span>
                    <p className="text-sm text-muted-foreground">
                        © {new Date().getFullYear()} CorticalEvo. Tous droits réservés.
                    </p>
                </div>

                {/* Bloc droit : Liens */}
                <div className="flex gap-12">

                    {/* Colonne 1 : Navigation */}
                    <div className="flex flex-col gap-3">
                        <Link
                            href="#fonctionnalites"
                            className="text-sm text-muted-foreground hover:text-primary transition-colors"
                        >
                            Fonctionnalités
                        </Link>
                        <Link
                            href="#comment-ca-marche"
                            className="text-sm text-muted-foreground hover:text-primary transition-colors"
                        >
                            Comment ça marche
                        </Link>
                    </div>

                    {/* Colonne 2 : Légal */}
                    <div className="flex flex-col gap-3">
                        <Link
                            href="/login"
                            className="text-sm text-muted-foreground hover:text-primary transition-colors"
                        >
                            Connexion
                        </Link>
                        <Link
                            href="/politique-confidentialite"
                            className="text-sm text-muted-foreground hover:text-primary transition-colors"
                        >
                            Politique de confidentialité
                        </Link>
                    </div>

                </div>
            </div>
        </footer>
    );
}