# Njangi — Landing Page & Waitlist Backend

Landing page de pré-lancement Njangi avec backend réel, système de waitlist, dashboard admin et notifications de lancement.

## Stack

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS 4, shadcn/ui
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL avec Prisma ORM
- **Email**: Resend
- **Auth Admin**: Secret partagé (header-based)

## Structure du projet

```
njangi/
├── njangi/                     # Next.js landing page + backend API
│   ├── app/
│   │   ├── api/
│   │   │   ├── waitlist/       # POST /api/waitlist
│   │   │   └── waitlist/count/ # GET /api/waitlist/count
│   │   ├── admin/              # Dashboard admin protégé
│   │   │   ├── layout.tsx      # Auth wrapper
│   │   │   └── page.tsx        # Vue principale
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── waitlist-form.tsx   # Formulaire connecté au backend
│   │   └── waitlist-counter.tsx # Compteur réel d'inscrits
│   ├── lib/
│   │   ├── prisma.ts           # Client Prisma
│   │   ├── validation.ts       # Schémas Zod
│   │   └── email.ts            # Service email (Resend)
│   ├── prisma/
│   │   ├── schema.prisma       # Schéma base de données
│   │   └── seed.ts             # Seed admin
│   ├── __tests__/              # Tests unitaires
│   ├── .env.example
│   ├── next.config.mjs
│   └── package.json
├── lib/                        # Flutter mobile app
├── pubspec.yaml
└── README.md
```

## Installation

### Prérequis

- Node.js >= 18
- PostgreSQL >= 14
- npm ou pnpm

### 1. Cloner le dépôt

```bash
git clone https://github.com/DanielBeni-tech/njangui.git
cd njangui/njangi
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Configurer les variables d'environnement

Copier `.env.example` vers `.env` :

```bash
cp .env.example .env
```

Variables à configurer :

```env
DATABASE_URL="postgresql://user:password@localhost:5432/njangi?schema=public"

RESEND_API_KEY="re_xxx"
EMAIL_FROM="Njangi <noreply@njangi.app>"
APP_BASE_URL="https://njangi.app"

ADMIN_SECRET="change-me-in-production"
```

### 4. Initialiser la base de données

```bash
npx prisma migrate dev --name init
npx prisma db seed
```

### 5. Lancer le serveur de développement

```bash
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000).

## Variables d'environnement

| Variable | Requis | Description |
|----------|--------|-------------|
| `DATABASE_URL` | Oui | URL de connexion PostgreSQL |
| `RESEND_API_KEY` | Non | Clé API Resend pour les emails |
| `EMAIL_FROM` | Non | Adresse email d'envoi |
| `APP_BASE_URL` | Non | URL de base de l'application |
| `ADMIN_SECRET` | Oui | Secret pour accéder au dashboard admin |

## API

### POST /api/waitlist

Inscrire un utilisateur à la waitlist.

**Body**:
```json
{
  "email": "user@example.com",
  "phone": "+237670000001",
  "countryCode": "+237",
  "preferredNotificationMethod": "email",
  "source": "landing-page",
  "device": "mobile",
  "utmSource": "instagram",
  "utmMedium": "social",
  "utmCampaign": "launch"
}
```

**Réponse 201**:
```json
{
  "message": "Inscription réussie",
  "id": "clx..."
}
```

**Réponse 409** (doublon):
```json
{
  "error": "Vous êtes déjà inscrit à la liste d'attente Njangi..."
}
```

### GET /api/waitlist/count

Récupérer le nombre total d'inscrits.

**Réponse**:
```json
{
  "count": 347
}
```

## Admin Dashboard

Accès : `/admin`

Protégé par `ADMIN_SECRET`.

Fonctionnalités :
- Vue d'ensemble des statistiques
- Liste des inscrits avec pagination
- Recherche par email/téléphone
- Filtrage par statut de notification
- Export CSV
- Suppression d'utilisateurs
- Déclenchement des notifications de lancement

## Sécurité

- Validation Zod côté serveur
- Rate limiting (5 requêtes/minute par IP)
- Honeypot anti-bot
- Vérification des doublons en base
- Sanitation des inputs
- CORS configuré
- Auth admin par secret partagé
- Pas de secrets dans le frontend

## Tests

```bash
npm test
```

Couverture :
- Validation du formulaire
- API waitlist (création, doublons, erreurs)
- Rate limiting
- Compteur

## Déploiement

### Frontend (Vercel)

```bash
vercel deploy
```

### Backend API

Les API routes sont déployées avec Next.js sur Vercel.

### Base de données

Utiliser un service PostgreSQL managé :
- **Vercel Postgres** (intégré)
- **Supabase** (généreux free tier)
- **Railway**
- **Render**

### Email

1. Créer un compte sur [Resend](https://resend.com)
2. Ajouter et vérifier le domaine
3. Configurer `RESEND_API_KEY`

### SMS (futur)

Voir `docs/SMS.md`.

## Checklist de lancement

- [ ] Base de données PostgreSQL configurée
- [ ] Backend déployé
- [ ] Frontend connecté au backend
- [ ] Formulaire testé (email + phone)
- [ ] Compteur testé
- [ ] Admin sécurisé
- [ ] Email configuré et testé
- [ ] SMS préparé (architecture)
- [ ] Politique de confidentialité publiée
- [ ] Opt-in vérifié
- [ ] Tests effectués
- [ ] Landing page en production
- [ ] Waitlist opérationnelle
- [ ] Campagne de lancement prête

## Documentation

- `docs/SMS.md` — Architecture SMS
- `prisma/schema.prisma` — Schéma base de données
- `lib/email.ts` — Service email

## Support

Pour toute question : support@njangi.app
