# 🧠 CorticalEvo — Gestion de Stock Intelligente

**CorticalEvo** est une application web complète de gestion de stock, de ventes et d'achats, conçue pour les commerces et PME. Elle intègre un **module d'analyse IA** qui génère automatiquement des rapports et des recommandations à partir des données réelles de l'entreprise.

🔗 **Démo en ligne :** [https://gestion-de-stocks-omega.vercel.app](https://gestion-de-stocks-omega.vercel.app)

---

## 👥 Comptes de démonstration

| Rôle | Email | Mot de passe |
|---|---|---|
| Administrateur | `admin@corticalevo.com` | `admin123` |
| Employé | `employe@corticalevo.com` | `employe123` |

> ⚠️ La base de données est **réinitialisée automatiquement chaque vendredi à 00h00 (UTC)** par un cron Vercel. Les comptes ci-dessus sont recréés automatiquement.

---

## ✨ Fonctionnalités

### 🔐 Authentification & rôles
- Connexion sécurisée par **JWT (cookie httpOnly)** et mots de passe hashés (bcrypt)
- Deux rôles : **ADMIN** (accès complet) et **EMPLOYEE** (espace dédié : ventes, clients, produits, stock)
- Gestion des utilisateurs : création, **désactivation / réactivation** de comptes

### 📊 Tableau de bord administrateur
- Valeur du stock et répartition par catégorie
- Alertes : **seuil minimum** atteint et **péremptions proches** (≤ 7 jours)
- Ventes du jour et du mois, évolution des ventes sur 30 jours
- Top produits vendus, top clients, créances en cours (ventes à crédit)
- Statistiques retours, fournisseurs (délai moyen de réception), écarts d'inventaire
- Liste des **actions en attente** (inventaires à valider, commandes en retard, péremptions)

### 📦 Stock & produits
- Produits avec **variantes**, images, seuils minimum, archivage
- **Lots** avec dates de péremption et filtres (expirés / bientôt expirés)
- Historique complet des **mouvements de stock**
- **Inventaires** : comptage, écarts calculés automatiquement, justification et validation

### 🛒 Achats & fournisseurs
- Fournisseurs (CRUD complet)
- **Commandes fournisseurs** multi-lignes avec statuts (EN_ATTENTE, ENVOYEE, RECUE…)
- **Réceptions** partielles ou totales avec mise à jour automatique du stock
- Retours fournisseurs

### 💰 Ventes & clients
- Clients avec historique des ventes et montant total dépensé
- Ventes avec plusieurs **modes de paiement** (espèces, mobile money, crédit…)
- Gestion des **créances** (ventes à crédit)
- Retours clients avec remise en stock

### 🤖 Module IA (Groq)
- **Rapports d'analyse générés par IA** : synthèse de l'activité, tendances, recommandations
- Export des données (CSV)

### 📱 & 🎨 Expérience utilisateur
- Interface **100% responsive** (tableaux → cartes sur mobile)
- **Thème clair / sombre**
- Journal d'activité complet (traçabilité de toutes les actions)

---

## 🛠️ Stack technique

| Catégorie | Technologie |
|---|---|
| Framework | **Next.js 16** (App Router, Turbopack) |
| Langage | **TypeScript** |
| Base de données | **PostgreSQL** (Prisma Postgres / Neon) |
| ORM | **Prisma** |
| Authentification | **JWT (jose)** + bcryptjs |
| Validation | **Zod** |
| UI | **Tailwind CSS**, Lucide Icons, Sonner (toasts) |
| IA | **API Groq** (LLM) |
| Hébergement | **Vercel** (Serverless + Cron Jobs) |

---

## 📁 Structure du projet

```
app/
├── (marketing)/          # Landing page, politique de confidentialité
├── api/                  # Routes API REST (auth, produits, ventes, IA, maintenance…)
├── dashboard/
│   ├── (admin)/          # Espace administrateur
│   └── employe/          # Espace employé
└── login/                # Connexion
components/
├── admin/  employe/  stock/  ui/   # Composants métier et UI réutilisable
lib/
├── services/             # Logique métier (ventes, stock, inventaires, IA, reset…)
├── serializers/          # Transformation des données Prisma → JSON API
├── auth.ts               # Sessions JWT & garde de rôles
└── prisma.ts             # Client Prisma singleton
prisma/
├── schema.prisma         # Modèle de données
├── migrations/           # Migrations SQL
└── seed.ts               # Comptes initiaux
types/                    # Types TypeScript partagés
```

---

## 🚀 Installation locale

### Prérequis
- Node.js 18+
- PostgreSQL local ou distant

### Étapes

```bash
# 1. Cloner le projet
git clone https://github.com/EvoDev225/Gestion_de_stock.git
cd Gestion_de_stock

# 2. Installer les dépendances
npm install

# 3. Configurer les variables d'environnement
cp .env.example .env   # puis renseigner les valeurs (voir ci-dessous)

# 4. Créer la base et générer le client Prisma
npx prisma migrate deploy
npx prisma generate

# 5. Créer les comptes initiaux
npx prisma db seed

# 6. Lancer en développement
npm run dev
```

Application disponible sur `http://localhost:3000`.

---

## 🔑 Variables d'environnement

| Variable | Description |
|---|---|
| `DATABASE_URL` | URL de connexion PostgreSQL |
| `JWT_SECRET` | Secret de signature des sessions JWT |
| `AI_API_KEY` | Clé API Groq |
| `AI_BASE_URL` | `https://api.groq.com/openai/v1` |
| `AI_MODEL` | Modèle IA (ex : `openai/gpt-oss-120b`) |
| `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` | Compte administrateur par défaut |
| `SEED_EMPLOYEE_EMAIL` / `SEED_EMPLOYEE_PASSWORD` | Compte employé par défaut |
| `RESET_SECRET` | Secret pour la remise à zéro manuelle |
| `CRON_SECRET` | Secret utilisé par le cron Vercel |

---

## ☁️ Déploiement (Vercel)

- **Build command :**
  ```bash
  npx prisma generate && npx prisma migrate deploy && next build
  ```
- **Cron job** (`vercel.json`) : remise à zéro hebdomadaire
  ```
  0 0 * * 5   →   GET /api/maintenance/reset   (Bearer CRON_SECRET)
  ```
- Remise à zéro manuelle :
  ```bash
  curl -X POST https://VOTRE-PROJET.vercel.app/api/maintenance/reset \
       -H "Authorization: Bearer VOTRE_RESET_SECRET"
  ```
  → Vide toutes les tables métier et recrée les comptes de démonstration.

---

## 🧠 Modèle de données (simplifié)

`Utilisateur` · `Categorie` · `Produit` → `Variante` → `Lot` · `MouvementStock` ·
`Client` · `Vente` → `LigneVente` · `Retour` ·
`Fournisseur` · `CommandeFournisseur` → `LigneCommandeFournisseur` · `ReceptionFournisseur` ·
`Inventaire` → `LigneInventaire` · `JournalActivite`

---

## 🗺️ Roadmap / limites connues

- Upload d'images stocké en **base64** (limite 2 Mo) — migration vers Vercel Blob prévue
- Multi-entrepôts non supporté
- Module IA limité à la génération de rapports (pas de prédictions série temporelle)

---

## 📄 Licence

Projet de démonstration — usage pédagogique.

---

**Développé avec ❤️ par [Kambou Oziel / EvoDev225]**
