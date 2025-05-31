# Wiki XIV

Une application de documentation basée sur Nuxt.js 3 permettant de créer, gérer et publier des articles organisés par catégories.

## Fonctionnalités

- Interface publique pour consulter les articles
- Dashboard administrateur pour gérer les articles
- Éditeur WYSIWYG avec support des images
- Gestion des catégories
- Système de visibilité des articles
- Base de données Supabase
- Déploiement sur Netlify

## Configuration requise

- Node.js 18+
- Compte Supabase
- Compte Netlify

## Installation

1. Clonez le dépôt :
```bash
git clone <votre-repo>
cd wiki-xiv
```

2. Installez les dépendances :
```bash
npm install
```

3. Créez un fichier `.env` à partir du fichier `.env.example` et remplissez les variables :
```bash
NUXT_PUBLIC_SUPABASE_URL=votre_url_supabase
NUXT_PUBLIC_SUPABASE_KEY=votre_cle_publique_supabase
```

4. Configurez votre base de données Supabase :

Créez les tables suivantes dans votre projet Supabase :

**Table: categories**
- id (uuid, primary key)
- name (text)
- color (text)
- created_at (timestamp with timezone)

**Table: articles**
- id (uuid, primary key)
- title (text)
- content (text)
- category_id (uuid, foreign key references categories.id)
- visible (boolean)
- created_at (timestamp with timezone)
- updated_at (timestamp with timezone)

5. Lancez le serveur de développement :
```bash
npm run dev
```

## Déploiement sur Netlify

1. Connectez-vous à votre compte Netlify

2. Créez un nouveau site depuis Git et sélectionnez votre dépôt

3. Configurez les variables d'environnement dans les paramètres du site Netlify :
   - NUXT_PUBLIC_SUPABASE_URL
   - NUXT_PUBLIC_SUPABASE_KEY

4. Déployez !

## Utilisation

1. Accédez à `/auth/login` pour vous connecter au dashboard administrateur
2. Utilisez le dashboard pour créer des catégories et des articles
3. Les articles peuvent être rendus visibles ou non
4. Les visiteurs peuvent consulter les articles publiés sur la page d'accueil

## Licence

MIT
