# Plan naprawy: bezpieczne chipy NFC i panel produkcji — Cudowna Doniczka

> **Dla Claude Code.** Ten plik opisuje zmiany w repozytorium `code-mike-code/cudowna-doniczka`.
> Wrzuć go do katalogu głównego repo (nie do `docs/` — ten katalog jest w `.gitignore`) i poproś Claude Code:
> *„Przeczytaj PLAN_NAPRAWY_NFC.md i zrealizuj Etap 0. Po każdym etapie zatrzymaj się i pokaż mi zmiany.”*

Stan wyjściowy: commit `1568a35` (28.04.2026). Jeśli kod na produkcji jest nowszy, najpierw porównaj go z tym opisem.

---

## Zasady pracy (obowiązują we wszystkich etapach)

1. Każdy etap na osobnej gałęzi (`fix/etap-0-hotfix`, `feat/etap-1-konta` …) i osobny pull request.
2. Nigdy nie commituj sekretów: `.env`, kluczy AES, haseł, plików manifestu od dostawcy chipów z kluczami. Dodaj `keys/`, `*.keys`, `manifest*.csv` do `.gitignore`.
3. Migracje bazy jako pliki SQL w `server/migrations/NNN_nazwa.sql`, uruchamiane skryptem. **Przed uruchomieniem migracji na produkcji zapytaj właściciela.**
4. Każda zmiana backendu z testami (Vitest jest już w projekcie; dla serwera dodaj `vitest` + `supertest` w `server/`).
5. Komunikaty w UI po polsku, kod i nazwy w kodzie po angielsku (jak dotychczas).
6. Nie zmieniaj wyglądu strony publicznej poza tym, co opisano.

---

## Etap 0 — Hotfix (zrobić od razu, przed nowymi chipami)

Cel: zamknąć dziury, które da się wykorzystać już dziś.

| # | Problem | Plik | Zmiana |
|---|---|---|---|
| 0.1 | Chip po zapisie da się nadpisać dowolnym telefonem (podmiana linku na phishing) | `src/pages/AdminPage.tsx` | Po udanym `ndef.write(...)` wywołaj `await ndef.makeReadOnly()`. Status „Zapisano ✓” dopiero po udanym zablokowaniu. Jeśli `makeReadOnly` nie jest wspierane lub zawiedzie — pokaż błąd „Chip NIE został zablokowany — odłóż doniczkę”. |
| 0.2 | Brak limitu prób logowania | `server/routes/admin.js`, `server/index.js` | Dodaj `express-rate-limit` na `POST /api/admin/login`: max 5 prób / 15 min / IP, odpowiedź 429. Ustaw `app.set('trust proxy', 1)` jeśli serwer stoi za reverse proxy (sprawdź hosting). |
| 0.3 | Kolizje numerów seryjnych (2 losowe bajty) | `server/routes/admin.js`, migracja | Tabela `serial_counters (model_type, day, last_value)` lub `AUTO_INCREMENT`; format `CD-{model}-{RRRRMMDD}-{NNNNN}`. Insert w transakcji. |
| 0.4 | `SELECT *` na publicznym endpoincie | `server/routes/pot.js` | Wypisz kolumny wprost: `id, serial_number, mass_kg, model_type, color, production_date`. |
| 0.5 | Brak nagłówków bezpieczeństwa | `server/index.js` | `helmet()` z CSP dopasowanym do strony (EmailJS, fonty, obrazy). Przetestuj, że strona i formularz kontaktowy działają. `express.json({ limit: '10kb' })`. |
| 0.6 | Fałszywe „zarejestrowane” doniczki, gdy zapis chipu się nie uda | `server/routes/admin.js`, migracja | Kolumna `pots.status ENUM('registered','encoded','active','void') DEFAULT 'registered'`. Nowy endpoint `POST /api/admin/pots/:id/confirm-encoded` wołany po udanym zapisie i zablokowaniu chipu. Strona `/pot/:uuid` pokazuje tylko `encoded`/`active`. |

**Kryteria odbioru Etapu 0**
- Test: 6. próba logowania w 15 min zwraca 429.
- Test: 10 000 rejestracji tego samego modelu tego samego dnia — zero kolizji.
- Test: odpowiedź `/api/pot/:uuid` zawiera dokładnie 6 pól.
- Ręcznie: zapisany chip nie daje się nadpisać aplikacją „NFC Tools” na Androidzie.
- Po wdrożeniu: zmień `ADMIN_PASSWORD` i `JWT_SECRET` na produkcji (unieważnia stare sesje).

---

## Etap 1 — Konta pracowników, role i dziennik zdarzeń

Cel: każdy pracownik ma własne konto; produkcja może tylko rejestrować doniczki; wiadomo, kto co zrobił; dostęp można odebrać natychmiast.

### 1.1 Baza (migracja)

```sql
CREATE TABLE users (
  id            CHAR(36) PRIMARY KEY,
  email         VARCHAR(254) NOT NULL UNIQUE,
  display_name  VARCHAR(100) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,          -- argon2id
  role          ENUM('admin','production') NOT NULL,
  is_active     BOOLEAN NOT NULL DEFAULT TRUE,
  token_version INT NOT NULL DEFAULT 0,         -- podbicie = wylogowanie wszędzie
  totp_secret   VARCHAR(64) NULL,               -- wymagane dla roli admin
  failed_logins INT NOT NULL DEFAULT 0,
  locked_until  DATETIME NULL,
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE audit_log (
  id         BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id    CHAR(36) NULL,
  action     VARCHAR(50) NOT NULL,   -- login_ok, login_fail, pot_register, tag_assign, tag_revoke, user_create ...
  target_id  VARCHAR(64) NULL,
  ip         VARCHAR(45) NULL,
  details    JSON NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX (user_id), INDEX (action), INDEX (created_at)
);

ALTER TABLE pots
  ADD COLUMN created_by CHAR(36) NULL,
  ADD COLUMN chip_uid   CHAR(14) NULL UNIQUE;   -- 7 bajtów UID w hex
```

### 1.2 Backend
- Hasła: `argon2` (argon2id). Minimalna długość 12 znaków.
- Logowanie: `POST /api/auth/login` → po sukcesie ustaw cookie sesyjne `HttpOnly; Secure; SameSite=Strict; Path=/api`, ważne 8 h dla produkcji, 2 h dla admina. W JWT: `sub`, `role`, `tv` (token_version).
- Middleware `requireAuth` sprawdza podpis **i** w bazie: `is_active` oraz zgodność `token_version`. Middleware `requireRole('admin' | 'production')`.
- Blokada konta: 10 nieudanych prób → `locked_until = now + 30 min` (niezależnie od limitu per IP).
- 2FA TOTP (`otplib`) obowiązkowe dla roli `admin`.
- CSRF: przy `SameSite=Strict` dodatkowo wymagaj nagłówka `X-Requested-With: cudowna` na żądaniach zmieniających dane.
- `POST /api/auth/logout`, `GET /api/auth/me`.
- Panel admina (tylko `admin`): lista użytkowników, dodaj, dezaktywuj, „wyloguj wszędzie” (podbija `token_version`), reset hasła.
- Skrypt `server/scripts/create-admin.js` do utworzenia pierwszego admina z konsoli.
- Usuń logowanie wspólnym `ADMIN_PASSWORD` po migracji (zostaw tylko jako awaryjne wyłączone domyślnie, albo usuń całkiem).
- Każda akcja zapisuje wpis w `audit_log`.

### 1.3 Frontend
- Usuń przechowywanie tokenu w `localStorage`; używaj cookie (`credentials: 'include'`).
- Ekran logowania: e-mail + hasło (+ kod TOTP dla admina).
- Widok zależny od roli: `production` widzi tylko „Rejestracja doniczki”; `admin` dodatkowo użytkowników, dziennik, partie chipów.

**Kryteria odbioru Etapu 1**
- Testy: produkcja nie ma dostępu do endpointów admina (403); dezaktywowany użytkownik traci dostęp przy następnym żądaniu; „wyloguj wszędzie” unieważnia stare cookie; brak tokenu w `localStorage`.
- Dziennik pokazuje kto, kiedy, z jakiego IP zarejestrował każdą doniczkę.

---

## Etap 2 — Chipy NTAG 424 DNA z weryfikacją SUN

Cel: chip przy każdym odczycie generuje nowy, kryptograficznie podpisany link. Serwer go weryfikuje. Skopiowany link nie działa. Klucze nigdy nie trafiają do przeglądarki ani na telefon pracownika.

### 2.1 Założenia (uzgodnione z dostawcą — patrz instrukcja zakupu chipów)
- Chipy przychodzą **spersonalizowane przez dostawcę**. Na produkcji niczego się do chipu nie zapisuje.
- Szablon linku na chipie: `https://cudownadoniczka.pl/t?p=<32 hex>&m=<16 hex>`
  - `p` = zaszyfrowane PICCData (UID + licznik odczytów), AES-128, klucz `SDM_META_READ` (wspólny dla partii).
  - `m` = SDMMAC (8 bajtów), liczony kluczem sesyjnym z `SDM_FILE_READ` (dywersyfikowany per UID).
- Klucz `APP_MASTER` (K0) dywersyfikowany per UID — do ewentualnej rekonfiguracji, serwer go nie potrzebuje do weryfikacji.
- Dywersyfikacja zgodnie z NXP AN10922 (AES-128) — **dokładny wariant i wektory testowe dostarcza dostawca**.

### 2.2 Baza (migracja)

```sql
CREATE TABLE tag_batches (
  id             VARCHAR(32) PRIMARY KEY,        -- np. 2026-12-A
  supplier       VARCHAR(100) NOT NULL,
  received_at    DATE NOT NULL,
  key_ref        VARCHAR(64) NOT NULL,           -- nazwa klucza w KMS / zmiennej środowiskowej, NIE sam klucz
  tag_count      INT NOT NULL
);

CREATE TABLE tags (
  uid            CHAR(14) PRIMARY KEY,           -- hex, wielkie litery
  batch_id       VARCHAR(32) NOT NULL,
  status         ENUM('received','assigned','active','revoked','defective') NOT NULL DEFAULT 'received',
  last_counter   INT UNSIGNED NOT NULL DEFAULT 0,
  pot_id         CHAR(36) NULL UNIQUE,
  assigned_by    CHAR(36) NULL,
  assigned_at    DATETIME NULL,
  FOREIGN KEY (batch_id) REFERENCES tag_batches(id),
  FOREIGN KEY (pot_id) REFERENCES pots(id)
);
```

### 2.3 Moduł kryptograficzny `server/lib/sun.js`
Zgodnie z NXP **AN12196** („NTAG 424 DNA and NTAG 424 DNA TagTamper features and hints”):
1. `decryptPiccData(pHex, metaKey)` → AES-128-CBC, IV = 16×0x00, bez paddingu. Bajt 0 = PICCDataTag (oczekiwane `0xC7` = UID + licznik). Bajty 1–7 = UID, 8–10 = licznik (LSB first).
2. `deriveFileReadKey(masterKey, uid)` → wg AN10922 (wariant uzgodniony z dostawcą).
3. `sessionMacKey(fileReadKey, uid, counter)` → `CMAC(fileReadKey, SV2)`, gdzie `SV2 = 3C C3 00 01 00 80 || UID(7) || counter(3, LSB)`.
4. `sdmMac(sessionKey)` → `CMAC(sessionKey, pusty ciąg)`, następnie bierzemy bajty o **nieparzystych** indeksach (1,3,…,15) → 8 bajtów.
5. Porównanie `m` w czasie stałym (`crypto.timingSafeEqual`).
- AES-CMAC: Node nie ma wbudowanego CMAC — zaimplementuj wg RFC 4493 na `crypto.createCipheriv('aes-128-ecb')` albo użyj sprawdzonej, utrzymywanej biblioteki (zweryfikuj licencję i aktywność repo).
- **Testy jednostkowe na wektorach z AN12196** (rozdział o SUN) oraz na wektorach od dostawcy. Bez zielonych testów nie wdrażamy.
- Partie: jeśli jest kilka kluczy `SDM_META_READ`, próbuj kolejno; poprawny jest ten, po którym PICCDataTag = `0xC7` i UID istnieje w `tags`.

### 2.4 Klucze
- Etap przejściowy: klucze w zmiennych środowiskowych serwera (`SUN_META_KEY_<BATCH>`, `SUN_FILE_MASTER_<BATCH>`), plik `.env` z uprawnieniami 600, poza katalogiem aplikacji.
- Docelowo: menedżer sekretów / KMS u dostawcy hostingu. W bazie trzymamy tylko `key_ref`.
- Kopia zapasowa kluczy offline (zaszyfrowana, w dwóch miejscach). **Utrata klucza = wszystkie chipy z partii przestają być weryfikowalne.**

### 2.5 Publiczny endpoint weryfikacji
`GET /api/tap?p=...&m=...`
1. Walidacja formatu (`p`: 32 hex, `m`: 16 hex) → inaczej 400.
2. Odszyfrowanie, odczyt UID i licznika, wyszukanie taga.
3. Weryfikacja MAC.
4. **Ochrona przed powtórzeniem:** licznik musi być `> last_counter`. Jeśli tak — zapisz nowy `last_counter` (atomowo: `UPDATE tags SET last_counter=? WHERE uid=? AND last_counter < ?`).
5. Odpowiedź: dane doniczki (te same 6 pól co dziś) + `verified: true` + jednorazowy `claim_token` ważny 10 min (podpisany, z `uid` i licznikiem) — do przyszłego odbioru NFT.
6. Błędy rozróżniaj w logach (`bad_mac`, `replay`, `unknown_uid`, `revoked`), ale publicznie zwracaj ogólny komunikat „Nie udało się potwierdzić autentyczności tej doniczki”.
7. Rate limit: 30 żądań / min / IP.

Frontend: nowa trasa `/t` (`TapPage.tsx`) — odczytuje `p` i `m` z adresu, woła `/api/tap`, pokazuje stronę doniczki z oznaczeniem „Autentyczność potwierdzona ✓”. Przy błędzie: komunikat + kontakt. Po udanej weryfikacji usuń `p` i `m` z paska adresu (`history.replaceState`), żeby użytkownik nie udostępniał linku z kodem.

### 2.6 Stare doniczki (`/pot/:uuid`)
- Zostaw trasę działającą dla chipów już sprzedanych, ale z wyraźnym oznaczeniem „Chip starszej generacji — bez potwierdzenia autentyczności”.
- Takie doniczki **nie mogą** odbierać NFT.
- Admin może oznaczyć starą doniczkę jako `void`.

**Kryteria odbioru Etapu 2**
- Testy wektorowe AN12196 i dostawcy przechodzą.
- Ten sam link otwarty drugi raz → odrzucony jako powtórzenie.
- Zmieniony jeden znak w `m` → odrzucony.
- Chip ze statusem `revoked` → odrzucony.
- Brak jakiegokolwiek klucza w kodzie frontendu, w repo i w odpowiedziach API.

---

## Etap 3 — Nowy proces na produkcji

Cel: pracownik w kilku sekundach przypisuje chip do doniczki, bez żadnego zapisu na chip.

### 3.1 Import partii chipów (admin)
- `server/scripts/import-batch.js --batch 2026-12-A --manifest manifest.csv --key-ref SUN_..._2026_12_A`
- Manifest od dostawcy: `uid` (+ ewentualnie numer nadrukowany na tagu). **Bez kluczy** — klucze przychodzą osobnym, zaszyfrowanym kanałem.
- Wynik: wpisy w `tags` ze statusem `received`, wpis w `audit_log`.

### 3.2 Ekran „Rejestracja doniczki” (rola production)
1. Pracownik wybiera model i kolor.
2. Klika „Zeskanuj chip” → `NDEFReader.scan()` (Chrome na Androidzie) odczytuje link z chipu (sam odczyt, bez zapisu).
3. Front wysyła `POST /api/production/assign { model_type, color, tap_url }`.
4. Serwer: weryfikuje SUN jak w 2.5 → sprawdza, że tag ma status `received` → w jednej transakcji tworzy doniczkę, przypisuje tag (`assigned`), zapisuje `created_by`, wpis w dzienniku.
5. Ekran prosi o **drugie zbliżenie** (test kontrolny). Poprawny odczyt → tag `active`, doniczka `active`, komunikat „Gotowe ✓ — nr seryjny CD-…”, opcjonalnie drukowanie etykiety.
6. Błędy po polsku i konkretnie: „Ten chip jest już przypisany do CD-…”, „Chip nie pochodzi z naszej partii — odłóż”, „Brak połączenia — spróbuj ponownie”.
- Usuń z panelu całą funkcję zapisu NDEF.

### 3.3 Admin
- Lista partii, liczby chipów wg statusu, wyszukiwarka po UID / numerze seryjnym.
- „Unieważnij chip” (`revoked`) — np. zgubiony, uszkodzony, podejrzenie klonu.
- Alert w dzienniku przy serii nieudanych weryfikacji z jednego UID (możliwa próba podróbki).

**Kryteria odbioru Etapu 3**
- Scenariusz end-to-end na 5 testowych chipach od dostawcy: import → przypisanie → test → strona publiczna → próba powtórki linku (odrzucona).
- Pracownik bez roli admin nie widzi partii ani dziennika.

---

## Etap 4 — Porządki

- Repozytorium ustaw jako **prywatne** (GitHub → Settings → Change visibility).
- `npm audit` w obu `package.json`; aktualizacja podatnych zależności.
- Kopie zapasowe bazy (codziennie) + test odtworzenia.
- Monitoring błędów serwera (logi z rotacją, alert przy wzroście `bad_mac`).
- Zgodność z przewodnikiem prawnym: z `CarbonImpactSection` usuń lub opisz źródłem porównanie do „dni pracy dorosłego drzewa” (`TREE_DAILY_G`) — ryzyko zarzutu greenwashingu. Przy liczbach CO₂ dodaj link do metodologii. Uzgodnij treść z właścicielem przed zmianą.
- Aktualizacja `readme.md` (nowa architektura, proces produkcji, procedura kluczy).

---

## Kolejność i szacunek

| Etap | Zależności | Szacunek pracy |
|---|---|---|
| 0 Hotfix | brak | 0,5–1 dnia |
| 1 Konta i role | Etap 0 | 2–4 dni |
| 2 Weryfikacja SUN | testowe chipy i wektory od dostawcy | 3–5 dni |
| 3 Proces produkcji | Etap 1 i 2 | 2–3 dni |
| 4 Porządki | równolegle | 1–2 dni |

Etap 2 można zacząć na wektorach z AN12196, zanim przyjdą próbki — ale wdrożyć dopiero po teście na prawdziwych chipach.

## Materiały źródłowe dla implementacji
- NXP AN12196 — NTAG 424 DNA and NTAG 424 DNA TagTamper features and hints (SUN, SDM, wektory testowe): https://www.nxp.com/docs/en/application-note/AN12196.pdf
- NXP AN10922 — Symmetric key diversifications.
- NXP NT4H2421Gx — karta katalogowa NTAG 424 DNA.
- RFC 4493 — AES-CMAC.
- Web NFC (`NDEFReader`) — działa tylko w Chrome na Androidzie, wymaga HTTPS.
