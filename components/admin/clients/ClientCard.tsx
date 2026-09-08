import { motion } from 'motion/react';
import { Phone, Mail, Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';
import type { Client } from '@/types/client';

interface ClientCardProps {
    client: Client;
    role: 'ADMIN' | 'EMPLOYEE';
    onEdit: (client: Client) => void;
    onDelete: (client: Client) => void;
}

export function ClientCard({ client, role, onEdit, onDelete }: ClientCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-card border border-border rounded-lg p-4 flex flex-col gap-3"
        >
            {/* En-tête avec nom cliquable */}
            <div className="flex items-start justify-between gap-2">
                <Link
                    href={`/admin/clients/${client.id}`}
                    className="text-foreground font-semibold hover:text-primary transition-colors flex-1"
                >
                    {client.nom}
                </Link>
            </div>

            {/* Informations de contact */}
            <div className="flex flex-col gap-2 text-sm">
                {/* Téléphone */}
                <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="w-4 h-4 flex-shrink-0" />
                    <span>{client.telephone || 'Non communiqué'}</span>
                </div>

                {/* Email */}
                <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">{client.email || 'Non communiqué'}</span>
                </div>
            </div>

            {/* Badge ventes */}
            <div className="flex items-center gap-2">
                <span className="inline-flex items-center px-2 py-1 rounded-md bg-muted text-muted-foreground text-xs font-medium">
                    {client.ventes?.length || 0} vente{(client.ventes?.length || 0) !== 1 ? 's' : ''}
                </span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 pt-2 border-t border-border">
                <button
                    onClick={() => onEdit(client)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-md text-sm font-medium text-foreground hover:bg-muted/50 transition-colors"
                >
                    <Edit className="w-4 h-4" />
                    <span>Modifier</span>
                </button>

                {role === 'ADMIN' && (
                    <button
                        onClick={() => onDelete(client)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-md text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
                    >
                        <Trash2 className="w-4 h-4" />
                        <span>Supprimer</span>
                    </button>
                )}
            </div>
        </motion.div>
    );
}