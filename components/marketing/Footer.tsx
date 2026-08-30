import Link from "next/link";

export default function Footer() {
    return (
        <footer className="w-full border-t border-border py-16 px-6 bg-background">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-8">

                {/* Bloc gauche : Logo et Copyright */}
                <div className="flex flex-col gap-2">
                    <span className="font-bold text-lg text-foreground">CorticalEvo</span>
                    <p className="text-sm text-muted-foreground">
                        © 2026 CorticalEvo. Tous droits réservés.
                    </p>
                </div>

                {/* Bloc droit : Liens */}
                <div className="flex gap-12">

                    {/* Colonne 1 */}
                    <div className="flex flex-col gap-3">
                        <Link
                            href="#"
                            className="text-sm text-muted-foreground hover:text-primary transition-colors"
                        >
                            Fonctionnalités
                        </Link>
                        <Link
                            href="#"
                            className="text-sm text-muted-foreground hover:text-primary transition-colors"
                        >
                            À propos
                        </Link>
                    </div>

                    {/* Colonne 2 */}
                    <div className="flex flex-col gap-3">
                        <Link
                            href="#"
                            className="text-sm text-muted-foreground hover:text-primary transition-colors"
                        >
                            Contact
                        </Link>
                        <Link
                            href="#"
                            className="text-sm text-muted-foreground hover:text-primary transition-colors"
                        >
                            Confidentialité
                        </Link>
                        <Link
                            href="#"
                            className="text-sm text-muted-foreground hover:text-primary transition-colors"
                        >
                            Conditions
                        </Link>
                    </div>

                </div>
            </div>
        </footer>
    );
}