# Platforma Moderne E-Learning

Ky repositorium përmban kodin burimor për një sistem të plotë e-learning të ndërtuar me FastAPI. Projekti ofron funksionalitete moderne si menaxhimi i kurseve, modulet, leksionet, detyrat, quiz-et, njoftimet, diskutimet dhe komunikimin me mesazhe private.

## Si të nisni
- Ndiq udhëzuesin hap pas hapi në [RUNNING.md](RUNNING.md) për të nisur shpejt backend-in dhe frontend-in në të njëjtin kompjuter.
- Lexo dokumentin [backend/README.md](backend/README.md) për udhëzime të detajuara rreth instalimit të varësive, konfigurimit të domenit të autorizuar për hyrje dhe startimit të serverit.

### Testimi i plotë i aplikacionit
1. **Nis API-në** duke ndjekur hapat në `backend/README.md` (krijimi i ambientit virtual, instalimi i varësive dhe komanda `uvicorn`).
2. **Konfiguro `.env` në backend** për të përcaktuar `ALLOWED_EMAIL_DOMAIN` (p.sh. `ALLOWED_EMAIL_DOMAIN=universiteti.edu`).
3. **Regjistro një përdorues testues** me `POST /auth/register` duke përdorur një email që përfundon me domain-in e lejuar.
4. **Merr token hyrjeje** me `POST /auth/login` dhe përdore në kërkesat e sigurta të API-së.
5. **Nis frontend-in** (shih seksionin më poshtë) dhe futu me kredencialet që krijove.
6. Navigo në pultin e studentit/instruktorit për të provuar menaxhimin e kurseve, detyrave, quiz-eve, mesazheve dhe njoftimeve.

### Të dhëna demo gati për përdorim
Për të testuar më shpejt platformën mund të populoni bazën e të dhënave me përdorues, kurs dhe të dhëna komunikimi të gatshme:

```bash
python -m backend.app.seeds
```

Komanda krijon një admin, një instruktor dhe një student (`admin@example.com`, `instructor@example.com`, `student@example.com`) me fjalëkalimin e përbashkët `Password123!`. Pasi të ketë përfunduar, hyr me këto kredenciale në frontend ose përdori për kërkesa API-je. Sigurohu që ndryshorja `ALLOWED_EMAIL_DOMAIN` të jetë `example.com` (ose përshtat adresat për domain-in tënd).

### Klonimi i projektit në Windows (PowerShell)
Nëse po përdorni PowerShell në Windows, sigurohuni ta nisni sesionin në një dosje të zakonshme si “Documents” ose “Desktop”, jo në `C:\Windows\System32`. Hapat tipik janë:

1. Hap PowerShell (pa qenë nevoja “Run as administrator”).
2. Lëviz në dosjen ku dëshiron të ruash projektin, p.sh.:
   ```powershell
   cd $HOME\Documents
   ```
3. Ekzekuto komandën e klonimit duke përdorur URL-në e repositoriumit nga GitHub:
   ```powershell
   git clone https://github.com/<organizata>/<repo>.git
   ```
   Zëvendëso `https://github.com/<organizata>/<repo>.git` me URL-në reale të projektit.
4. Hyr në dosjen e sapokrijuar:
   ```powershell
   cd agollirenaldo
   ```
5. Kontrollo që të gjithë skedarët janë klonuar (p.sh. do të shohësh edhe dosjet `backend` dhe `frontend`):
   ```powershell
   Get-ChildItem
   ```

Nëse ke klonuar aksidentalisht në `C:\Windows\System32`, fshije dosjen `agollirenaldo` që është krijuar aty dhe përsërit hapat më lart duke u siguruar që je në vendin e duhur përpara se të përdorësh `git clone`.

### Nisja e ndërfaqes moderne React

Për ta parë frontend-in lokal, ndiq këto hapa pa u shkëputur nga rrënja e projektit:

1. **Sigurohu që backend-i është në funksion.** Në një terminal të veçantë, ndjek udhëzimet në `backend/README.md` dhe lëre komandën `uvicorn backend.app.main:app --reload` të qëndrojë aktive.
2. **Hap një terminal të ri** (ose një dritare të re PowerShell) dhe kaloni në dosjen e projektit në PC-në tënd, p.sh. `cd C:\Users\Emri\Documents\agollirenaldo`.
3. **Hyr në dosjen e frontend-it:** `cd frontend`.
4. **Instalo varësitë** vetëm herën e parë: `npm install`.
5. **Konfiguro variablat e ambientit:**
   ```powershell
   copy .env.example .env
   ```
   Hap `.env` dhe cakto `VITE_API_BASE_URL` te URL-ja ku po ekzekutohet backend-i (p.sh. `http://localhost:8000`).
6. **Nis serverin e zhvillimit:** `npm run dev`. Komanda do të tregojë një adresë të ngjashme me `http://localhost:5173`.
7. **Hap shfletuesin** dhe vizito adresën e treguar për të parë ndërfaqen moderne të platformës. Identifikohu me kredencialet e llogarisë që ke krijuar ose ato të demo-s.

Nëse PowerShell nuk njeh komandën `copy`, mund të përdorësh ekuivalentin `cp` nga Git Bash, ose të krijosh manualisht skedarin `.env` duke kopjuar përmbajtjen nga `.env.example`.

## Struktura
- `backend/` - përmban aplikacionin FastAPI dhe të gjitha modulët e nevojshëm për API-në.
- `frontend/` - ndërfaqja moderne React/Vite me dizajn "glassmorphism" dhe integrim të plotë me API-në.
- `README.md` - ky dokument informues.

Kontributet dhe zgjerimet janë të mirëpritura!
