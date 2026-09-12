import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { toast } from "sonner";
import type { Client } from '@/types/client';

interface ClientFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    clientAModifier: Client | null;
    onSuccess: (client: Client) => void;
}

export function ClientFormModal({
    isOpen,
    onClose,
    clientAModifier,
    onSuccess,
}: ClientFormModalProps) {
    const [nom, setNom] = useState('');
    const [telephone, setTelephone] = useState('');
    const [email, setEmail] = useState('');
    const [adresse, setAdresse] = useState('');
    const [errors, setErrors] = useState<{ nom?: string; telephone?: string }>({});
    const [apiError, setApiError] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Réinitialiser le formulaire quand clientAModifier change
    useEffect(() => {
        if (clientAModifier) {
            setNom(clientAModifier.nom);
            setTelephone(clientAModifier.telephone);
            setEmail(clientAModifier.email || '');
            setAdresse(clientAModifier.adresse || '');
        } else {
            setNom('');
            setTelephone('');
            setEmail('');
            setAdresse('');
        }
        setErrors({});
        setApiError('');
    }, [clientAModifier, isOpen]);

    const validate = (): boolean => {
        const newErrors: { nom?: string; telephone?: string } = {};

        if (!nom.trim()) {
            newErrors.nom = 'Le nom est obligatoire';
        }

        if (!telephone.trim()) {
            newErrors.telephone = 'Le téléphone est obligatoire';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validate()) return;

        setIsSubmitting(true);
        setApiError('');

        try {
            const payload = {
                nom: nom.trim(),
                telephone: telephone.trim(),
                email: email.trim() || null,
                adresse: adresse.trim() || null,
            };

            const url = clientAModifier
                ? `/api/clients/${clientAModifier.id}`
                : '/api/clients';

            const method = clientAModifier ? 'PATCH' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Une erreur est survenue');
            }

            onSuccess(result);
            toast.success(clientAModifier ? "Client modifié avec succès." : "Client créé avec succès.");
            onClose();
        } catch (error) {
            setApiError(error instanceof Error ? error.message : 'Erreur inconnue');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80"
                    onClick={onClose}
                >
                    <motion.div
                        key={clientAModifier?.id || 'new'}
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.2 }}
                        className="bg-card border border-border rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* En-tête */}
                        <div className="flex items-center justify-between p-6 border-b border-border">
                            <h2 className="text-xl font-semibold text-foreground">
                                {clientAModifier ? 'Modifier le client' : 'Nouveau client'}
                            </h2>
                            <button
                                onClick={onClose}
                                className="text-muted-foreground hover:text-foreground transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Contenu */}
                        <div className="p-6 space-y-4">
                            {/* Erreur API */}
                            {apiError && (
                                <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm">
                                    {apiError}
                                </div>
                            )}

                            {/* Nom */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-foreground">
                                    Nom <span className="text-destructive">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={nom}
                                    onChange={(e) => {
                                        setNom(e.target.value);
                                        if (errors.nom) setErrors({ ...errors, nom: undefined });
                                    }}
                                    className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                                    placeholder="Nom du client"
                                    disabled={isSubmitting}
                                />
                                {errors.nom && (
                                    <p className="text-sm text-destructive">{errors.nom}</p>
                                )}
                            </div>

                            {/* Téléphone */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-foreground">
                                    Téléphone <span className="text-destructive">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={telephone}
                                    onChange={(e) => {
                                        setTelephone(e.target.value);
                                        if (errors.telephone) setErrors({ ...errors, telephone: undefined });
                                    }}
                                    className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                                    placeholder="Numéro de téléphone"
                                    disabled={isSubmitting}
                                />
                                {errors.telephone && (
                                    <p className="text-sm text-destructive">{errors.telephone}</p>
                                )}
                                <p className="text-xs text-muted-foreground">
                                    Requis pour assurer la traçabilité
                                </p>
                            </div>

                            {/* Email */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-foreground">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                                    placeholder="Non communiqué"
                                    disabled={isSubmitting}
                                />
                            </div>

                            {/* Adresse */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-foreground">
                                    Adresse
                                </label>
                                <textarea
                                    value={adresse}
                                    onChange={(e) => setAdresse(e.target.value)}
                                    rows={3}
                                    className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                                    placeholder="Non communiquée"
                                    disabled={isSubmitting}
                                />
                            </div>
                        </div>

                        {/* Pied de modale */}
                        <div className="flex items-center justify-end gap-3 p-6 border-t border-border">
                            <button
                                onClick={onClose}
                                disabled={isSubmitting}
                                className="px-4 py-2 text-sm font-medium text-foreground hover:bg-muted/50 rounded-md transition-colors disabled:opacity-50"
                            >
                                Annuler
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 rounded-md transition-colors disabled:opacity-50"
                            >
                                {isSubmitting
                                    ? 'En cours...'
                                    : clientAModifier
                                        ? 'Enregistrer'
                                        : 'Créer'}
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}