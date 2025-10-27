# Modern E-Learning Platform API

Ky projekt ofron nje API te plote per nje platforme bashkekohore e-learning me funksione te avancuara si menaxhimi i kurseve, mesimeve, testeve, detyrave, diskutimeve, mesazheve dhe certifikatave.

## Karakteristikat kryesore
- **Autentikim & Autorizim** me JWT dhe kufizim te hyrjeve sipas domain-it te lejuar.
- **Menaxhim i kurseve** me module, leksione, materiale video dhe burime shtese.
- **Detyra & Dorëzime** me notim dhe feedback nga instruktorët.
- **Teste & Quiz** me pyetje me alternativa, boolean dhe ese, plus llogaritje automatike te pikëve.
- **Analitika** per instruktorët dhe panel progresi per studentët.
- **Njoftime** individuale dhe sistem per njoftime te lexuara.
- **Diskutime & Mesazhe** per komunikim ne forum dhe mesazhe private.
- **Certifikata** digjitale per studentet e diplomuar.

## Struktura e projektit
```
backend/
 ├─ app/
 │   ├─ core/           # Konfigurime & siguri
 │   ├─ routers/        # Endpoint-et e ndara sipas domenit
 │   ├─ models.py       # Modelet SQLAlchemy
 │   ├─ schemas.py      # Modelet Pydantic
 │   ├─ db.py           # Lidhja me bazën e të dhënave
 │   └─ main.py         # Aplikacioni FastAPI
 ├─ requirements.txt    # Varësitë
 └─ README.md           # Ky dokument
```

## Nisja lokale
1. Krijo nje ambient virtual dhe instalo varësitë:
   ```bash
   python3 -m venv .venv
   source .venv/bin/activate
   pip install -r backend/requirements.txt
   ```
2. Opsionale: vendos ndryshore mjedisi ne `.env`:
   ```env
   SECRET_KEY=super-secret-key
   ALLOWED_EMAIL_DOMAIN=universiteti.edu
   ```
3. Starto serverin FastAPI:
   ```bash
   uvicorn app.main:app --reload --app-dir backend
   ```
4. Vizito `http://localhost:8000/docs` per dokumentimin interaktiv.

## Shënime të tjera
- Baza e të dhënave SQLite krijohet automatikisht (`elearning.db`).
- Rrugët janë të sigurta sipas roleve (`student`, `instructor`, `admin`).
- Për integrim me front-end, përdor endpoint-et REST ose gjenero SDK nga dokumentimi OpenAPI.
