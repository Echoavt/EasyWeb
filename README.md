# Akustický Inovativní Simulátor

Tento repozitář obsahuje ukázkovou full‑stack aplikaci rozdělenou na **backend** a **frontend**.

## Backend
- Node.js + Express
- MongoDB (Mongoose)
- JWT autentizace
- CRUD operace pro presety a projekty
- Sdílení projektů veřejným URL

Spuštění:
```bash
cd backend
npm install
cp .env.example .env # nastavte proměnné
npm start
```

## Frontend
- React (Vite)
- React Router, Context API

Spuštění:
```bash
cd frontend/app
npm install
npm run dev
```

Frontend očekává běžící backend na stejném hostiteli.
