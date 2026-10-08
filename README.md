# Film Booking

Film Booking est une application full-stack de réservation de films. Elle propose une interface React/Vite pour découvrir les films, rechercher et filtrer les contenus, puis réserver ou annuler une séance. L’API NestJS gère l’authentification, les profils utilisateur et la persistance des réservations dans PostgreSQL.

Cette application est conçue pour être lancée en deux services distincts :

- **client** : interface utilisateur React, TypeScript et Tailwind CSS ;
- **server** : API REST NestJS, authentication JWT et accès aux données ;
- **base de données** : PostgreSQL via Prisma ORM.

## Fonctionnalités

- Découverte de films populaires et récents via The Movie Database (TMDB).
- Recherche de films par mot-clé et tri par popularité croissante ou décroissante.
- Pagination des résultats de films.
- Inscription et connexion d’un utilisateur.
- Authentification JWT et protection des routes sensibles.
- Consultation du profil utilisateur connecté.
- Réservation d’un film avec une vérification de disponibilité temporelle.
- Consultation de ses propres réservations.
- Annulation d’une réservation appartenant à l’utilisateur connecté.
- Interface responsive avec mode sombre et mode clair.
- Notifications et états de charge dans l’interface.
- Documentation Swagger automatique pour l’API.

## Architecture

```text
React / Vite client
        │ HTTP / Axios
        ▼
NestJS API + Swagger
        │ Prisma ORM
        ▼
PostgreSQL
        │
        └── TMDB API (données de films)
```

### Frontend

Le frontend est une application React 19 développée avec TypeScript, Vite, React Router et Tailwind CSS. Il utilise Axios pour communiquer avec l’API et stocke le token JWT dans le navigateur.

### Backend

Le backend utilise NestJS et expose une API REST. Les modules principaux sont :

- `auth` : connexion, inscription et validation JWT ;
- `movies` : récupération et filtrage des films TMDB ;
- `reservation` : création, consultation et suppression des réservations ;
- `users` : gestion du profil et des utilisateurs ;
- `prisma` : accès aux données PostgreSQL.

### Base de données

Le schéma Prisma définit deux entités principales :

- `User` : identifiant, nom, email et mot de passe ;
- `Reservation` : référence utilisateur, film, date de réservation et horodatage.

La logique de réservation empêche deux réservations couvrant un intervalle de deux heures autour de la date sélectionnée. Elle exige également au moins cinq minutes d’anticipation.

## Prérequis

- Node.js 20 ou une version compatible avec le projet ;
- npm ;
- PostgreSQL 16 ou une version compatible avec le schéma ;
- une clé API TMDB ;
- une chaîne secrète pour les JWT.

Le projet utilise PostgreSQL 16 dans la configuration Docker Compose.

## Installation

### 1. Cloner le dépôt

```bash
git clone https://github.com/abdul-kodir2020/film-booking.git
cd film-booking
```

### 2. Installer les dépendances

```bash
cd client
npm install
cd ../server
npm install
```

### 3. Configurer la base de données

Lancer PostgreSQL avec Docker Compose :

```bash
docker compose up -d db
```

Le service crée une base nommée `my_db` avec un utilisateur `postgres` et un mot de passe `postgres`.

### 4. Créer les variables d’environnement

Il n’y a pas de fichier d’environnement fourni dans le dépôt. Créez les fichiers suivants :

#### server/.env

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/my_db
JWT_SECRET=remplacez_cette_valeur_par_une_suite_secrete
API_JETON=votre_cle_tmdb
PORT=3000
```

`API_JETON` sert à authentifier les requêtes vers TMDB. `JWT_SECRET` est utilisé pour signer et vérifier les tokens JWT.

#### client/.env

```env
VITE_API_URL=http://localhost:3000
```

> Vérifiez que l’URL du client correspond à l’adresse publique du backend. En mode développement, elle est généralement `http://localhost:3000`.

### 5. Initialiser la base de données

```bash
cd server
npx prisma migrate dev --name init
```

Pour réinitialiser une base déjà existante, exécutez :

```bash
npx prisma db push
```

Vous pouvez également remplir la base avec les données de démonstration :

```bash
npm run seed
```

## Lancer le projet

### Lancer l’API

```bash
cd server
npm run start:dev
```

L’API est disponible sur :

- API : `http://localhost:3000`
- Swagger : `http://localhost:3000/api`

### Lancer le client

```bash
cd client
npm run dev
```

Le client est disponible sur :

- Interface : `http://localhost:5173`

L’application ouvre automatiquement la page de découverte après connexion. Les utilisateurs non authentifiés sont redirigés vers la page de connexion.

## Authentification et accès

Les routes suivantes nécessitent un token JWT dans l’en-tête `Authorization: Bearer <token>` :

- `GET /movies` ;
- `GET /users` ;
- `GET /users/me` ;
- `GET /users/:id` ;
- `POST /reservation` ;
- `GET /reservation` ;
- `DELETE /reservation/:id`.

Les routes d’inscription et de connexion sont publiques :

| Méthode | Route | Description |
|---|---|---|
| `POST` | `/auth/register` | Crée un nouveau compte utilisateur |
| `POST` | `/auth/login` | Authentifie un utilisateur et retourne un JWT |

Le token généré lors de la connexion expire après quatre heures. La configuration de signature du module JWT utilise une durée de cinq minutes uniquement pour les options de module et ne doit pas être confondue avec l’expiration du token réellement généré.

## API principale

| Méthode | Route | Description |
|---|---|---|
| `GET` | `/movies?page=1&search_keyword=...&sortBy=desc` | Liste les films TMDB avec pagination, recherche et tri |
| `GET` | `/users/me` | Récupère le profil de l’utilisateur connecté |
| `POST` | `/reservation` | Crée une réservation |
| `GET` | `/reservation` | Récupère les réservations de l’utilisateur connecté |
| `DELETE` | `/reservation/:id` | Annule sa réservation |

La documentation complète des paramètres et des réponses est disponible dans Swagger :

```text
http://localhost:3000/api
```

## Vérification

### Vérifier le backend

```bash
cd server
npm test
npm run build
```

### Vérifier le frontend

```bash
cd client
npm run lint
npm run build
```

Le build frontend produit les fichiers de production dans le dossier `dist`.

## Structure du dépôt

```text
client/        Interface React et application utilisateur
server/        API NestJS, Prisma et tests
server/prisma/ Schéma et migrations Prisma
docker-compose.yml  Configuration PostgreSQL
echos/         Exemples et scripts d’utilisation
```

## Remarques

- Le client utilise une variable `VITE_API_URL` au moment de la compilation, donc elle doit être définie avant le lancement de Vite.
- Les réservations sont liées à un utilisateur et ne peuvent être annulées que par leur propriétaire.
- L’API de films dépend de TMDB et nécessite une clé valide.
- Le fichier `.env` ne doit jamais être ajouté au contrôle de version.
- La configuration actuelle utilise des identifiants de ressources et des champs qui peuvent être adaptés si le projet est déployé sur un environnement de production.

## Licence

Ce projet est distribué sous la licence `UNLICENSED`, telle qu’elle est déclarée dans les métadonnées du dépôt.
