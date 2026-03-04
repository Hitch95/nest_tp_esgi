# MovieAPI

API REST de catalogue de films construite avec [NestJS](https://nestjs.com/), dans le cadre de l'examen M2 ESGI IW 2026 — Thème A (CineAPI).

> Base URL : `http://localhost:3000/api`  
> Documentation interactive : `http://localhost:3000/api/docs` (Scalar)  
> Spec OpenAPI JSON : `http://localhost:3000/api/docs-json`

---

## Authentification

Toutes les routes (sauf `POST /auth/register` et les routes de lecture publiques sur `/films`) requièrent le header :

```
X-API-Key: <votre_clef>
```

Les routes d'écriture (`POST`, `PUT`, `PATCH`, `DELETE` sur `/films`) sont réservées aux comptes `admin`.

---

## Routes disponibles

### Auth — `/api/auth`

| Méthode | Route | Accès | Description |
|---|---|---|---|
| `POST` | `/auth/register` | Public | Créer un compte — retourne `{ apiKey }` |
| `GET` | `/auth/me` | Authentifié | Profil de l'utilisateur courant |
| `POST` | `/auth/regenerate-key` | Authentifié | Régénérer la clef API |
| `DELETE` | `/auth/account` | Authentifié | Supprimer son compte |

### Films — `/api/films`

| Méthode | Route | Accès | Description |
|---|---|---|---|
| `GET` | `/films` | Public | Liste paginée avec filtres (`genre`, `status`, `language`, `year`, `sortBy`, `sortOrder`) |
| `GET` | `/films/search?q=` | Public | Recherche full-text sur titre, réalisateur et synopsis |
| `GET` | `/films/:id` | Public | Détail d'un film |
| `POST` | `/films` | Admin | Créer un film — 409 si le titre existe déjà |
| `PUT` | `/films/:id` | Admin | Remplacer un film entièrement |
| `PATCH` | `/films/:id` | Admin | Modifier partiellement un film |
| `DELETE` | `/films/:id` | Admin | Supprimer un film — 409 si statut `upcoming` |

### Codes HTTP notables

| Code | Signification |
|---|---|
| `201` | Ressource créée |
| `204` | Suppression réussie (pas de corps) |
| `400` | Corps ou paramètre invalide |
| `401` | Header `X-API-Key` absent |
| `403` | Clef invalide ou rôle insuffisant |
| `404` | Ressource introuvable |
| `409` | Conflit (titre dupliqué, suppression d'un film `upcoming`) |

---

## Modèle Film

```json
{
  "id": 1,
  "title": "Inception",
  "director": "Christopher Nolan",
  "cast": ["Leonardo DiCaprio", "Joseph Gordon-Levitt"],
  "genres": ["Sci-Fi", "Thriller"],
  "year": 2010,
  "duration": 148,
  "rating": 8.8,
  "language": "en",
  "synopsis": "...",
  "status": "released"
}
```

Valeurs de `status` : `released` | `upcoming` | `in production`  
Valeurs de `language` : `en` | `fr` | `ja` | `ko` | `es` | `pr`

---

## Installation & démarrage

```bash
pnpm install

# développement (watch)
pnpm run start:dev

# production
pnpm run start:prod
```

## Tests

```bash
pnpm run test        # tests unitaires
pnpm run test:e2e    # tests end-to-end
pnpm run test:cov    # couverture
```
