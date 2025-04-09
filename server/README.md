# 🎬 Film Booking API

API REST construite avec **NestJS** permettant de :
- Consulter les films disponibles (via [TMDB API](https://www.themoviedb.org/)),
- Gérer l’inscription et la connexion utilisateur (JWT),
- Réserver des films avec prévention des conflits d’horaires,
- Accéder à ses propres réservations.

Lien du swagger : http://localhost:3000/api/

---

## 👤 Auteur

**Mounirou Abdul Kodir**  
Développeur Fullstack & DevOps

---

## ⚙️ Technologies utilisées

- [NestJS](https://nestjs.com/)
- [Prisma ORM](https://www.prisma.io/)
- [PostgreSQL](https://www.postgresql.org/)
- [TMDB API](https://www.themoviedb.org/)
- [Swagger](https://swagger.io/)
- [JWT](https://jwt.io/)

---

## 🚀 Fonctionnalités

- Authentification (inscription / connexion via JWT)
- Récupération des films populaires via TMDB
- Système de réservation de films
- Prévention de doublons de réservation sur la même plage horaire (2h avant/après)
- Documentation Swagger disponible

---

## 📦 Installation

### 1. Cloner le repo

```bash
git clone https://github.com/ton-user/film-booking-api.git
cd film-booking-api
```

### 2. Installer des dépendances

```bash
npm install
```

### 3. Créer un fichier .env

```bash
API_JETON=your_tmdb_api_key
JWT_SECRET=your_jwt_secret
DATABASE_URL=postgresql://USER:PASSWORD@localhost:5432/your_db_name
```

### 4. Lancer les migrations

```bash
npx prisma migrate dev --name init
```

### 5. Lancer l'application
```bash
npm run start:dev
```

## 🧪 Lancer les tests

```bash
npm run test
```

Pour lancer un seul test :
```bash
npm run test -- reservation.service.spec.ts
```

## 📮 Endpoints principaux

Tous les endpoints sont documentés dans Swagger :  
📎 `http://localhost:3000/api`

---

### 🔐 Authentification

| Méthode | Endpoint         | Description              |
|---------|------------------|--------------------------|
| `POST`  | `/auth/register` | Créer un nouveau compte |
| `POST`  | `/auth/login`    | Se connecter et recevoir un JWT |

---

### 👤 Utilisateur connecté

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `GET`   | `/users` | Récupère les informations de tous les utilisateurs |
| `GET`   | `/users/me` | Récupère les informations de l'utilisateur connecté |
| `GET`   | `/users/:id` | Récupère les informations d'un utilisateur'|

> 🔒 Protégé par JWT

---

### 🎬 Films

| Méthode | Endpoint             | Description                                                  |
|---------|----------------------|--------------------------------------------------------------|
| `GET`   | `/movies`            | Liste paginée des films populaires |
> 🔒 Protégé par JWT

page: numéro de la page

> ✅ Utilise l’API The Movie DB  
> 📌 Le token TMDB est requis dans le `.env`

---

### 📆 Réservations

| Méthode | Endpoint              | Description                                  |
|---------|-----------------------|----------------------------------------------|
| `POST`  | `/reservations`       | Créer une réservation                        |
| `GET`   | `/reservations`  | Voir toutes les réservations du user connecté |
| `Delete`   | `/reservations/:id`  | Annuler une réservation |

> 🕓 Vérifie automatiquement qu’aucune réservation ne chevauche une autre dans les **2h avant ou après** le film choisi.  
> 🔒 Protégé par JWT

---

## ⚙️ Technologies

- NestJS
- Prisma + PostgreSQL
- TMDB API
- JWT
- Swagger

## 📚 Références

- 🧬 [Prisma + NestJS: Build a REST API](https://www.prisma.io/blog/nestjs-prisma-rest-api-7D056s1BmOL0)
- 📘 [Documentation officielle de NestJS](https://docs.nestjs.com/)
- 🧾 [Documentation Prisma](https://www.prisma.io/docs)
- 🎞️ [TMDB API Docs](https://developer.themoviedb.org/docs)
- 🛡️ [JWT Authentication in NestJS](https://docs.nestjs.com/security/authentication)
- 🧪 [Testing in NestJS](https://docs.nestjs.com/fundamentals/testing)