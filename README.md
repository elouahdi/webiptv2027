# RegardezIPTV

Plateforme de gestion de contenu (CMS) et site web pour la vente de packs IPTV avec support multilingue et programme sports en temps réel.

## 📋 Table des matières

- [Description du Projet](#description-du-projet)
- [Stack Technique](#stack-technique)
- [Prérequis](#prérequis)
- [Installation](#installation)
- [Configuration](#configuration)
- [Utilisation](#utilisation)
- [Dépendances](#dépendances)
- [Structure du Projet](#structure-du-projet)
- [Scripts Disponibles](#scripts-disponibles)
- [Base de Données](#base-de-données)
- [Déploiement](#déploiement)
- [Support](#support)
- [License](#license)

## 📖 Description du Projet

RegardezIPTV est une application Next.js complète offrant :

- **Vitrine publique** : Pages de présentation des packs IPTV (1, 3, 6, 12 et 24 mois)
- **Blog intégré** : Système de gestion d'articles avec éditeur riche
- **CMS Administration** : Interface d'administration sécurisée pour gérer le contenu
- **Programme Sports** : Affichage des scores et programmes sports en temps réel via l'API BSD Sports
- **Support multilingue** : Structure i18n avec routing par locale (Français, Anglais, Allemand, Espagnol)
- **Système de commande** : Processus de checkout et gestion des commandes
- **Système de paiement** : Intégration Stripe et PayPal
- **Gestion des médias** : Upload et gestion d'images et fichiers

## 🛠 Stack Technique

| Catégorie | Technologies |
|-----------|-------------|
| **Framework** | Next.js 15.1.3 |
| **Langage** | TypeScript 5.7.2 |
| **Frontend** | React 19.0, TailwindCSS 3.4.19 |
| **Base de données** | MySQL 8+ |
| **UI Components** | Radix UI, ShadCN UI, Lucide React |
| **Éditeur de texte** | Tiptap (extensions: table, image, link, underline, text-align) |
| **Authentification** | JWT (jose), bcryptjs |
| **Drag & Drop** | @dnd-kit/sortable |
| **Carrousel** | Embla Carousel |
| **Animations** | Framer Motion |
| **Gestion des formulaires** | React Hook Form + Zod |
| **Paiement** | Stripe, PayPal SDK |
| **Icons** | Lucide React, FontAwesome |

## ✅ Prérequis

- **Node.js** >= 18.0.0
- **PNPM** >= 8.0.0 (recommandé) ou npm >= 9.0.0
- **Base de données MySQL** 8+ en cours d'exécution
- **Git** pour le clonage du repository

## 🚀 Installation

### 1. Cloner le projet

```bash
git clone <repository-url>
cd iptv_2027
```

### 2. Installer les dépendances

```bash
# Avec pnpm (recommandé)
pnpm install

# Ou avec npm
npm install
```

### 3. Configurer les variables d'environnement

```bash
cp .env.example .env.local
```

Éditez le fichier `.env.local` avec vos configurations (voir section [Configuration](#configuration)).

### 4. Configurer la base de données

Créez la base de données MySQL :

```sql
CREATE DATABASE cms_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

## ⚙️ Configuration

### Variables d'environnement requises

| Variable | Description | Exemple |
|----------|-------------|---------|
| `NEXT_PUBLIC_SITE_URL` | URL du site en production | `https://www.regardeziptv.fr` |
| `NEXT_PUBLIC_SITE_NAME` | Nom du site | `RegardezIPTV` |
| `CMS_AUTH_SECRET` | Clé secrète pour l'authentification CMS (changer en production !) | `votre-cle-secrete-securisee` |
| `BSD_SPORTS_API_KEY` | Clé API BSD Sports pour les scores en temps réel | `votre-cle-api-bsd` |
| `DB_HOST` | Hôte de la base de données MySQL | `localhost` |
| `DB_PORT` | Port de la base de données | `3306` |
| `DB_USER` | Utilisateur MySQL | `root` |
| `DB_PASSWORD` | Mot de passe MySQL | `votre-mot-de-passe` |
| `DB_NAME` | Nom de la base de données | `cms_db` |

### Variables d'environnement optionnelles

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | Domaine pour l'analytics Plausible |
| `NEXT_PUBLIC_PLAUSIBLE_URL` | URL du script Plausible |

### Obtention de la clé API BSD Sports

Pour activer le programme sports en temps réel :

1. Visitez [https://bzzoiro.com/sports](https://bzzoiro.com/sports)
2. Créez un compte gratuit
3. Obtenez votre clé API
4. Ajoutez-la à votre fichier `.env.local` dans `BSD_SPORTS_API_KEY`

⚠️ **Important** : Cette variable ne doit PAS être préfixée par `NEXT_PUBLIC_` car elle est utilisée côté serveur uniquement.

## 🎮 Utilisation

### Lancement en mode développement

```bash
# Avec Turbo (recommandé pour un développement plus rapide)
pnpm dev

# Sans Turbo
npm run dev
```

L'application sera accessible à l'adresse : **http://localhost:3000**

### Build de production

```bash
pnpm build
```

### Lancement en mode production

```bash
pnpm start
```

### Linting du code

```bash
pnpm lint
```

### Analyse du bundle

```bash
pnpm analyze
```

Cela générera un rapport d'analyse du bundle dans le dossier `.next/analyze`.

## 📦 Dépendances

### Dépendances principales

```json
{
  "dependencies": {
    "@dnd-kit/core": "^6.3.1",
    "@dnd-kit/sortable": "^10.0.0",
    "@dnd-kit/utilities": "^3.2.2",
    "@fortawesome/fontawesome-free": "^7.2.0",
    "@paypal/checkout-server-sdk": "^1.0.3",
    "@radix-ui/react-accordion": "^1.2.1",
    "@radix-ui/react-dialog": "^1.1.2",
    "@radix-ui/react-dropdown-menu": "^2.1.2",
    "@radix-ui/react-label": "^2.1.0",
    "@radix-ui/react-slot": "^1.1.0",
    "@radix-ui/react-visually-hidden": "^1.1.0",
    "@stripe/stripe-js": "^9.8.0",
    "@tiptap/extension-image": "^3.26.0",
    "@tiptap/extension-link": "^3.26.0",
    "@tiptap/extension-placeholder": "^3.26.0",
    "@tiptap/extension-table": "^3.26.0",
    "@tiptap/extension-table-cell": "^3.26.0",
    "@tiptap/extension-table-header": "^3.26.0",
    "@tiptap/extension-table-row": "^3.26.0",
    "@tiptap/extension-text-align": "^3.26.0",
    "@tiptap/extension-underline": "^3.26.0",
    "@tiptap/pm": "^3.26.0",
    "@tiptap/react": "^3.26.0",
    "@tiptap/starter-kit": "^3.26.0",
    "@vercel/og": "^0.6.4",
    "bcryptjs": "^3.0.3",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "date-fns": "^4.4.0",
    "embla-carousel-react": "^8.3.1",
    "framer-motion": "^11.11.11",
    "jose": "^6.2.3",
    "lucide-react": "^0.462.0",
    "mysql2": "^3.22.5",
    "next": "15.1.3",
    "next-themes": "^0.4.6",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "react-hook-form": "^7.54.0",
    "stripe": "^22.2.0",
    "tailwind-merge": "^2.5.5",
    "uuid": "^14.0.0",
    "zod": "^3.23.8"
  }
}
```

### Dépendances de développement

```json
{
  "devDependencies": {
    "@next/bundle-analyzer": "^15.1.3",
    "@types/bcryptjs": "^2.4.6",
    "@types/node": "^22.10.1",
    "@types/react": "^19.0.1",
    "@types/react-dom": "^19.0.2",
    "@types/uuid": "^10.0.0",
    "autoprefixer": "^10.5.0",
    "postcss": "^8.5.15",
    "tailwindcss": "^3.4.19",
    "typescript": "^5.7.2"
  }
}
```

## 📁 Structure du Projet

```
iptv_2027/
├── app/                          # Pages et routes (App Router)
│   ├── [locale]/                # Routes multilingues
│   │   ├── blog/                # Section blog
│   │   │   ├── [slug]/         # Détail d'un article
│   │   │   └── page.tsx        # Liste des articles
│   │   ├── checkout/            # Processus de paiement
│   │   │   └── CheckoutForm.tsx
│   │   ├── commander/           # Commande de packs
│   │   ├── contact/             # Page contact
│   │   ├── faq/                 # FAQ
│   │   ├── nos-plans/           # Présentation des forfaits
│   │   ├── programme-sports/    # Programme sports
│   │   ├── pack-iptv-*/         # Pages des packs (1, 3, 6, 12, 24 mois)
│   │   ├── essai-gratuit/       # Essai gratuit
│   │   ├── layout.tsx           # Layout principal
│   │   └── page.tsx             # Page d'accueil
│   ├── admin/                   # Interface d'administration
│   │   ├── blog/                # Gestion des articles
│   │   │   ├── posts/          # Liste et édition des posts
│   │   │   ├── categories/     # Gestion des catégories
│   │   │   └── tags/           # Gestion des tags
│   │   ├── media/               # Gestion des médias
│   │   ├── pages/               # Gestion des pages
│   │   ├── settings/            # Paramètres du site
│   │   ├── site/                # Configuration du site
│   │   │   ├── pricing/        # Gestion des prix
│   │   │   ├── seo/            # Configuration SEO
│   │   │   └── page.tsx        # Page d'accueil admin
│   │   ├── sports/              # Programme sports admin
│   │   ├── users/               # Gestion des utilisateurs
│   │   ├── layout.tsx           # Layout admin
│   │   └── page.tsx             # Dashboard admin
│   └── api/                     # API Routes
│       ├── auth/                # Authentification
│       ├── cms/                 # API CMS
│       └── ...
├── components/                  # Composants réutilisables
│   ├── admin/                   # Composants admin
│   ├── blog/                    # Composants blog
│   ├── layout/                  # Layout et header/footer
│   ├── providers/               # Context providers
│   ├── sections/                # Sections de pages
│   └── ui/                      # Composants UI de base (ShadCN)
├── lib/                         # Logique métier
│   ├── cms/                     # Fonctions CMS
│   │   ├── repositories/        # Repositories de données
│   │   └── storage.ts           # Stockage CMS
│   ├── data/                    # Accès aux données
│   ├── seo/                     # SEO et métadonnées
│   └── utils/                   # Utilitaires
├── public/                      # Assets statiques
│   └── uploads/                 # Fichiers uploadés
├── config/                      # Configuration (i18n, etc.)
├── hooks/                       # React hooks personnalisés
├── scripts/                     # Scripts utilitaires
├── .env.example                 # Exemple de variables d'environnement
├── .eslintrc.json              # Configuration ESLint
├── next.config.ts              # Configuration Next.js
├── tailwind.config.ts          # Configuration Tailwind
├── tsconfig.json               # Configuration TypeScript
└── vercel.json                 # Configuration Vercel
```

## 📜 Scripts Disponibles

| Script | Description |
|--------|-------------|
| `pnpm dev` | Démarre le serveur de développement avec Turbo |
| `pnpm build` | Build de production optimisé |
| `pnpm start` | Démarre le serveur de production |
| `pnpm lint` | Lint du code avec ESLint |
| `pnpm analyze` | Build avec analyse du bundle (pour l'optimisation) |

## 🗄️ Base de Données

### Configuration MySQL

Le projet utilise MySQL 8+. Assurez-vous que la base de données est créée et accessible :

```sql
CREATE DATABASE cms_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### Schéma de la base de données

Le schéma de la base de données est défini dans le fichier `database-schema.sql`. Les principales tables incluent :

- `users` - Utilisateurs administrateurs
- `posts` - Articles de blog
- `categories` - Catégories d'articles
- `tags` - Tags d'articles
- `media` - Fichiers médias uploadés
- `pages` - Pages du site
- `settings` - Configuration du site

### Connexion à la base de données

La connexion est configurée via les variables d'environnement (voir section [Configuration](#configuration)). Les fonctions d'accès aux données sont situées dans `lib/cms/repositories/`.

## 🚀 Déploiement

### Déploiement sur Vercel

Le projet est configuré pour Vercel via le fichier `vercel.json`.

1. **Connectez votre repository** à Vercel
2. **Configurez les variables d'environnement** dans les settings Vercel
3. **Déployez** automatiquement via Git push

### Déploiement manuel

Pour un déploiement sur votre propre serveur :

1. **Configurez toutes les variables d'environnement** sur le serveur
2. **Installez les dépendances** :
   ```bash
   pnpm install --production
   ```
3. **Build de production** :
   ```bash
   pnpm build
   ```
4. **Démarrer l'application** :
   ```bash
   pnpm start
   ```

### Variables d'environnement en production

⚠️ **Important** : En production, vous devez absolument :

- Changer `CMS_AUTH_SECRET` par une clé forte et unique
- Utiliser une base de données MySQL sécurisée
- Configurer HTTPS avec un certificat SSL valide
- Ne jamais exposer les variables d'environnement dans le code client

## 🆘 Support

Pour toute question ou problème :

1. Consultez la documentation dans ce README
2. Vérifiez les issues existantes sur le repository
3. Créez une nouvelle issue avec une description détaillée du problème

## 📄 License

Copyright (c) 2024 RegardezIPTV

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.