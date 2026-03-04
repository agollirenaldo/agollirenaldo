# Si ta nisesh projektin hap pas hapi

Këto udhëzime të shkurtra të ndihmojnë të ndezësh si backend-in ashtu edhe frontend-in lokal, duke përdorur të njëjtin kompjuter.

## 1. Klono projektin

```powershell
# hap PowerShell te dosja ku do ta ruash, p.sh. Documents
cd $HOME\Documents

# klono repositoriumin
git clone https://github.com/agollirenaldo/agollirenaldo.git

# hyr në projekt
cd agollirenaldo
```

> Nëse përdor Git Bash/Linux/macOS, zëvendëso `cd $HOME\Documents` me `cd ~/Documents`.

## 2. Nis backend-in FastAPI

1. Hyr në dosjen e backend-it dhe krijo një ambient virtual:
   ```powershell
   cd backend
   python -m venv .venv
   .\.venv\Scripts\Activate.ps1   # në PowerShell
   # ose
   source .venv/bin/activate        # në Linux/macOS
   ```
2. Instalo varësitë e API-së:
   ```powershell
   pip install -r requirements.txt
   ```
3. (Opsionale) Populo të dhënat e provës:
   ```powershell
   python -m backend.app.seeds
   ```
4. Nis serverin:
   ```powershell
   uvicorn backend.app.main:app --reload --port 8000
   ```
   Lëre këtë terminal të hapur që API-ja të vazhdojë të funksionojë.

## 3. Nis frontend-in React

1. Hap një terminal të ri dhe kalo në rrënjën e projektit nëse nuk je aty:
   ```powershell
   cd $HOME\Documents\agollirenaldo
   ```
2. Hyr në dosjen `frontend/` dhe instalo varësitë (vetëm herën e parë):
   ```powershell
   cd frontend
   npm install
   ```
3. Krijo skedarin `.env` duke përdorur shembullin:
   ```powershell
   copy .env.example .env
   ```
   Hap `.env` dhe sigurohu që rreshti `VITE_API_BASE_URL=http://localhost:8000` përputhet me portin e backend-it.
4. Nis serverin e zhvillimit:
   ```powershell
   npm run dev
   ```
5. PowerShell do të të tregojë një adresë si `http://localhost:5173`. Hap shfletuesin dhe vizito atë URL për të parë ndërfaqen.

## 4. Hyr në aplikacion

- Përdor kredencialet që krijove me endpoint-et e backend-it ose përdor llogaritë demo:
  - `admin@example.com`
  - `instructor@example.com`
  - `student@example.com`
  - fjalëkalim: `Password123!`
- Sigurohu që `ALLOWED_EMAIL_DOMAIN` në backend është vendosur në `example.com` nëse do të përdorësh llogaritë demo.

## 5. Çaktivizo ambientin virtual kur mbaron

Në PowerShell: `deactivate`

Në Linux/macOS: `deactivate`

---

Për më shumë detaje rreth konfigurimit, lexo edhe [`README.md`](README.md) dhe [`backend/README.md`](backend/README.md).
