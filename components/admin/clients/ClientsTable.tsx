"tsx"
import React from "react"
import Link from "next/link"
import { motion } from "motion/react"
import { Users, Edit, Trash2 } from "lucide-react"
import type { Client } from "@/types/client"

interface ClientsTableProps {
    clients: Client[]
    role: "ADMIN" | "EMPLOYEE"
    onEdit: (client: Client) => void
    onDelete: (client: Client) => void
    isLoading?: boolean
}

export const ClientsTable: React.FC<ClientsTableProps> = ({
    clients,
    role,
    onEdit,
    onDelete,
    isLoading = false,
}) => {
    if (isLoading) {
        return (
            <div className="w-full overflow-x-auto rounded-lg border border-border bg-card">
                <table className="w-full text-left border-collapse text-sm">
                    <thead>
                        <tr className="border-b border-border bg-muted/50 text-muted-foreground">
                            <th className="p-4 font-medium">Nom</th>
                            <th className="p-4 font-medium">Téléphone</th>
                            <th className="p-4 font-medium">Email</th>
                            <th className="p-4 font-medium">Adresse</th>
                            <th className="p-4 font-medium">Ventes</th>
                            <th className="p-4 font-medium text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {[...Array(5)].map((_, i) => (
                            <tr key={i} className="animate-pulse">
                                <td className="p-4"><div className="h-4 w-32 rounded bg-muted/30" /></td>
                                <td className="p-4"><div className="h-4 w-24 rounded bg-muted/30" /></td>
                                <td className="p-4"><div className="h-4 w-36 rounded bg-muted/30" /></td>
                                <td className="p-4"><div className="h-4 w-40 rounded bg-muted/30" /></td>
                                <td className="p-4"><div className="h-4 w-8 rounded bg-muted/30" /></td>
                                <td className="p-4 text-right"><div className="ml-auto h-8 w-16 rounded bg-muted/30" /></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )
    }

    if (clients.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center rounded-lg border border-border bg-card p-12 text-center">
                <div className="mb-4 rounded-full bg-muted/50 p-4 text-muted-foreground">
                    <Users className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-medium text-foreground">Aucun client enregistré</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                    Les clients ajoutés apparaîtront dans ce tableau.
                </p>
            </div>
        )
    }

    return (
        <div className="w-full overflow-x-auto rounded-lg border border-border bg-card shadow-sm">
            <table className="w-full text-left border-collapse text-sm">
                <thead>
                    <tr className="border-b border-border bg-muted/50 text-muted-foreground">
                        <th className="p-4 font-medium">Nom</th>
                        <th className="p-4 font-medium">Téléphone</th>
                        <th className="p-4 font-medium">Email</th>
                        <th className="p-4 font-medium">Adresse</th>
                        <th className="p-4 font-medium">Ventes</th>
                        <th className="p-4 font-medium text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-border">
                    {clients.map((client, index) => (
                        <motion.tr
                            key={client.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2, delay: index * 0.03 }}
                            className="transition-colors hover:bg-muted/30 text-foreground"
                        >
                            <td className="p-4 font-medium">
                                <Link
                                    href={`/admin/clients/${client.id}`}
                                    className="text-primary hover:underline transition-colors"
                                >
                                    {client.nom}
                                </Link>
                            </td>
                            <td className="p-4 text-muted-foreground">{client.telephone}</td>
                            <td className="p-4">
                                {client.email ? (
                                    <span className="text-foreground">{client.email}</span>
                                ) : (
                                    <span className="text-muted-foreground italic">Non communiqué</span>
                                )}
                            </td>
                            <td className="p-4 max-w-xs truncate">
                                {client.adresse ? (
                                    <span className="truncate block text-foreground" title={client.adresse}>
                                        {client.adresse}
                                    </span>
                                ) : (
                                    <span className="text-muted-foreground italic">Non communiquée</span>
                                )}
                            </td>
                            <td className="p-4">
                                <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                                    {client._count?.ventes ?? 0}
                                </span>
                            </td>
                            <td className="p-4 text-right">
                                <div className="flex items-center justify-end gap-2">
                                    <button
                                        onClick={() => onEdit(client)}
                                        className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                                        title="Modifier"
                                        aria-label={`Modifier ${client.nom}`}
                                    >
                                        <Edit className="h-4 w-4" />
                                    </button>
                                    {role === "ADMIN" && (
                                        <button
                                            onClick={() => onDelete(client)}
                                            className="p-2 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                                            title="Supprimer"
                                            aria-label={`Supprimer ${client.nom}`}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    )}
                                </div>
                            </td>
                        </motion.tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}