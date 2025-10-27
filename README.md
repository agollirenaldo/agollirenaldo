# Platforma Moderne E-Learning

Ky repositorium përmban kodin burimor për një sistem të plotë e-learning të ndërtuar me FastAPI. Projekti ofron funksionalitete moderne si menaxhimi i kurseve, modulet, leksionet, detyrat, quiz-et, njoftimet, diskutimet dhe komunikimin me mesazhe private.

## Si të nisni
Lexoni dokumentin [backend/README.md](backend/README.md) për udhëzime të detajuara rreth instalimit të varësive, konfigurimit të domenit të autorizuar për hyrje dhe startimit të serverit.

Për të ekzekutuar ndërfaqen moderne në React:

1. Navigoni tek direktoria `frontend/` dhe instaloni varësitë: `npm install`.
2. Krijoni një skedar `.env` në `frontend/` dhe vendosni URL-në e API-së (p.sh. `VITE_API_BASE_URL=http://localhost:8000`).
3. Nisni aplikacionin: `npm run dev` dhe hapni shfletuesin në adresën e shfaqur (zakonisht `http://localhost:5173`).

## Struktura
- `backend/` - përmban aplikacionin FastAPI dhe të gjitha modulët e nevojshëm për API-në.
- `frontend/` - ndërfaqja moderne React/Vite me dizajn "glassmorphism" dhe integrim të plotë me API-në.
- `README.md` - ky dokument informues.

Kontributet dhe zgjerimet janë të mirëpritura!
