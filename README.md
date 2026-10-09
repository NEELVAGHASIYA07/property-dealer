# Fieldhouse Real Estate Platform (Next.js + AdonisJS + MySQL)

આ પ્રોજેક્ટ હવે પૂર્ણ-સ્ટેક (Full-Stack) આર્કિટેક્ચર સાથે સેટ થઈ ગયો છે:
- **Frontend**: Next.js 16 (React 19) port `3000` પર ચાલે છે.
- **Backend API**: AdonisJS v6 (Node.js framework) port `3333` પર ચાલે છે.
- **SQL Database**: MySQL (Lucid ORM) સાથે `property_dealer` ડેટાબેઝમાં કનેક્ટેડ છે.

---

## 🚀 Quick Start (કેવી રીતે રન કરવું)

### 1. બન્ને સર્વર એક સાથે રન કરવા (Frontend + Backend):
```bash
npm run dev:all
```
આ કમાન્ડ `concurrently` નો ઉપયોગ કરીને Next.js (`http://localhost:3000`) અને AdonisJS API (`http://localhost:3333`) બન્ને સાથે ચલાવશે.

### 2. વ્યક્તિગત કમાન્ડ્સ:
- **ફક્ત Frontend ચલાવવા**:
  ```bash
  npm run dev
  ```
- **ફક્ત AdonisJS Backend ચલાવવા**:
  ```bash
  npm run backend
  ```
- **Database Migrations રન કરવા**:
  ```bash
  npm run backend:migrate
  ```
- **Database Seed કરવા (Properties & Cities Data)**:
  ```bash
  npm run backend:seed
  ```

---

## 📡 REST API Endpoints (AdonisJS - `http://localhost:3333`)

| Method | Endpoint | વર્ણન (Description) |
|---|---|---|
| `GET` | `/` | API status અને endpoints સૂચિ |
| `GET` | `/api/properties` | બધી પ્રોપર્ટીઝ લિસ્ટ (Filter by `mode`, `city`, `type`, `bedrooms`, `priceMin`, `priceMax`, `search`, `trending`) |
| `GET` | `/api/properties/:id` | ચોક્કસ પ્રોપર્ટી ની વિગતો |
| `POST` | `/api/properties` | નવી પ્રોપર્ટી ઉમેરવા |
| `DELETE` | `/api/properties/:id` | પ્રોપર્ટી ડિલીટ કરવા |
| `GET` | `/api/trending` | હોમપેજ માટે ટ્રેન્ડિંગ પ્રોપર્ટીઝ |
| `GET` | `/api/cities` | ગુજરાતના શહેરો અને પ્રોપર્ટી કાઉન્ટ |
| `POST` | `/api/v1/auth/signup` | નવું એકાઉન્ટ રજીસ્ટર કરવા |
| `POST` | `/api/v1/auth/login` | યુઝર લોગિન અને એક્સેસ ટોકન |
| `GET` | `/api/v1/account/profile` | ઓથેન્ટિકેટેડ પ્રોફાઇલ (Bearer token) |

### API Filter Examples:
- **Rent Properties**: `GET http://localhost:3333/api/properties?mode=rent`
- **Buy Properties in Ahmedabad**: `GET http://localhost:3333/api/properties?mode=buy&city=Ahmedabad`
- **3+ BHK Villas**: `GET http://localhost:3333/api/properties?type=Villa&bedrooms=3`
- **Price Filter**: `GET http://localhost:3333/api/properties?priceMin=5000000&priceMax=20000000`
- **Search**: `GET http://localhost:3333/api/properties?search=penthouse`

---

## 🗄️ SQL Database & Lucid ORM

- **Database**: MySQL (Database Name: `property_dealer`, Port: `3306`)
- **Models**:
  - `backend/app/models/property.ts` (id, name, city, location, mode, type, price, priceLabel, size, bedrooms, bathrooms, details, image, tag, isTrending, description)
  - `backend/app/models/city.ts` (id, name, propertiesCount, image)
  - `backend/app/models/user.ts` (id, fullName, email, password)
- **Migrations**:
  - `backend/database/migrations/*_create_properties_table.ts`
  - `backend/database/migrations/*_create_cities_table.ts`
  - `backend/database/migrations/*_create_users_table.ts`
  - `backend/database/migrations/*_create_access_tokens_table.ts`
- **Seeder**:
  - `backend/database/seeders/property_seeder.ts` (22+ વાસ્તવિક પ્રોપર્ટીઝ અને 12 ગુજરાત શહેરો)

---

## 🖥️ Frontend Integration (`app/lib/api.js`)

ફ્રન્ટએન્ડ આપોઆપ બેકએન્ડ API સાથે જોડાયેલું છે:
- હોમપેજ (`/`) ટ્રેન્ડિંગ પ્રોપર્ટીઝ અને સિટીઝ SQLite માંથી લોડ કરે છે.
- Buy પેજ (`/buy`), Rent પેજ (`/rent`), Short-Term પેજ (`/short-term`) ડાયરેક્ટ SQLite ડેટા સાથે ફિલ્ટરિંગ કરે છે.
- જો ક્યારેક બેકએન્ડ સર્વર બંધ હોય, તો પણ ફ્રન્ટએન્ડ ગ્રેસફુલ ફોલબેક (graceful fallback) સાથે કામ કરતું રહેશે!
