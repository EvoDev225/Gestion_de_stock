import Link from "next/link";
import { LoginForm } from "@/components/auth/LoginForm";
import { AuthVisualPanel } from "@/components/auth/AuthVisualPanel";

export default function LoginPage() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-[55%_45%] min-h-screen">
            {/* Colonne Gauche : Header discret + Formulaire centré verticalement */}
            <div className="flex flex-col px-6 sm:px-8 lg:px-16 min-h-screen">
                <div className="pt-8">
                    <Link
                        href="/"
                        className="font-display text-sm font-medium text-foreground hover:opacity-80 transition-opacity inline-block"
                    >
                        Stockflow
                    </Link>
                </div>

                <div className="flex-1 flex items-center py-12">
                    <LoginForm />
                </div>
            </div>

            {/* Colonne Droite : Panneau visuel avec halo (Masqué sur mobile/tablette) */}
            <AuthVisualPanel />
        </div>
    );
}