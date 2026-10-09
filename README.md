# Fieldhouse Real Estate Platform

A modern, full-stack real estate marketplace platform built with **Next.js**, **AdonisJS**, and **Lucid ORM**.

## Tech Stack & Architecture

- **Frontend**: Next.js 16 (React 19) running on `http://localhost:3000`
- **Backend API**: AdonisJS v6 (Node.js framework) running on `http://localhost:3333`
- **Database & ORM**: MySQL / SQLite with Lucid ORM
- **Maps & Geolocation**: Leaflet & Google Maps integration
- **Styling**: Vanilla CSS design system with responsive layouts

---

## 🚀 Quick Start

### 1. Run Both Servers Concurrently (Frontend + Backend):
```bash
npm run dev:all
```
This runs both the Next.js frontend (`http://localhost:3000`) and the AdonisJS API (`http://localhost:3333`) simultaneously using `concurrently`.

### 2. Individual Commands:
- **Run Frontend Only**:
  ```bash
  npm run dev
  ```
- **Run AdonisJS Backend Only**:
  ```bash
  npm run backend
  ```
- **Run Database Migrations**:
  ```bash
  npm run backend:migrate
  ```
- **Seed Database (Properties, Cities & Dealers Data)**:
  ```bash
  npm run backend:seed
  ```

---

## 📡 REST API Endpoints (AdonisJS - `http://localhost:3333`)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | API status and available endpoints list |
| `GET` | `/api/properties` | List all properties (Filter by `mode`, `city`, `type`, `bedrooms`, `priceMin`, `priceMax`, `search`, `trending`) |
| `GET` | `/api/properties/:id` | Retrieve specific property details |
| `POST` | `/api/properties` | Create a new property listing |
| `DELETE` | `/api/properties/:id` | Remove a property listing |
| `GET` | `/api/trending` | Top trending properties for the homepage |
| `GET` | `/api/cities` | List Gujarat cities with active property counts |
| `POST` | `/api/v1/auth/signup` | Register a new user account |
| `POST` | `/api/v1/auth/login` | User authentication and access token generation |
| `GET` | `/api/v1/account/profile` | Authenticated user profile (Bearer token) |

### API Filter Query Examples:
- **Rental Listings**: `GET http://localhost:3333/api/properties?mode=rent`
- **Properties for Sale in Ahmedabad**: `GET http://localhost:3333/api/properties?mode=buy&city=Ahmedabad`
- **3+ BHK Villas**: `GET http://localhost:3333/api/properties?type=Villa&bedrooms=3`
- **Price Range Filter**: `GET http://localhost:3333/api/properties?priceMin=5000000&priceMax=20000000`
- **Keyword Search**: `GET http://localhost:3333/api/properties?search=penthouse`

---

## 🗄️ Database Models & Migrations

- **Database**: MySQL / SQLite (`property_dealer`)
- **Key Models**:
  - `backend/app/models/property.ts` (id, name, city, location, mode, type, price, priceLabel, size, bedrooms, bathrooms, details, image, tag, isTrending, description)
  - `backend/app/models/city.ts` (id, name, propertiesCount, image)
  - `backend/app/models/dealer.ts` (id, name, company, phone, email, avatar, rating, reviewsCount, verified)
  - `backend/app/models/user.ts` (id, fullName, email, password)
- **Migrations**:
  - `backend/database/migrations/*_create_users_table.ts`
  - `backend/database/migrations/*_create_access_tokens_table.ts`
  - `backend/database/migrations/*_create_properties_table.ts`
  - `backend/database/migrations/*_create_cities_table.ts`
  - `backend/database/migrations/*_create_dealers_and_update_properties_table.ts`
- **Seeders**:
  - `backend/database/seeders/property_seeder.ts` (Pre-seeded with verified properties across Gujarat)

---

## 🖥️ Frontend Features & Integration

- **Dynamic Property Pages**: Dedicated routes for `/buy`, `/rent`, `/short-term`, and `/property/:id`.
- **Interactive Map Search**: Split-screen desktop browsing with responsive sync between listing cards and Leaflet map pins.
- **Photo Mosaic & Lightbox**: 5-photo layout with full-screen photo viewer, Left/Right navigation indicators, and keyboard controls.
- **Architectural Floor Plan & 360° Street View**: Dedicated interactive modal exploration tools.
- **Authentication & Saved Homes**: Modal sign-in/sign-up dialog with localStorage bookmarking and auth-protected dealer interactions.
- **Graceful Offline Fallback**: If the backend API server is offline or unreachable, the frontend gracefully falls back to bundled curated data without crashing.
