# Fundament AI Foodsale

Status: done
Data: 2026-11-03

## Cel i zakres

Utworzyć uruchamialny projekt bazowy zgodny z README: Angular + TypeScript,
SCSS i Tailwind, NestJS + TypeScript oraz PostgreSQL w Dockerze. Pierwszy
pionowy wycinek to publiczny katalog lokalnej żywności i szczegóły produktu
z informacją o sprzedawcy. To fundament pod dalszą realizację platformy.

Konta kupujących i sprzedawców, panel sprzedawcy, płatności, zamówienia,
wiadomości i rezerwacje pozostają kolejnymi etapami. Nie udostępniamy publicznych
endpointów zapisu bez uwierzytelniania. Dane demonstracyjne są jawnie oznaczone.

## Źródła i decyzje

- `README.md` określa produkt i nadrzędny stos technologiczny.
- `AGENTS.md`, `CLAUDE.md` i `.ai/lessons.md` określają dokumentację i sposób pracy.
- Specyfikacja DevMentor jest materiałem porównawczym: stosujemy małe funkcje,
  podział według domen, cienkie kontrolery i komponenty, wspólne kontrakty,
  parametryzowane zapytania, walidację i testy zachowania. Jej React/Next.js,
  shadcn, schemat pakietów i kontener Awilix nie dotyczą nowego projektu.
- Trzy npm workspaces: `apps/web`, `apps/api`, `packages/contracts`.
  API dzieli się na konfigurację, HTTP, bazę i domenę katalogu. DI zapewnia Nest.
- Angular CLI z domyślnym builderem aplikacji (esbuild/Vite), standalone components,
  sygnały i routing; bez dodatkowego silnika budowania.
- Aktualny Angular 22 wymaga Node 24.15+ na linii 24 i TypeScript 6.0.
  Wersje przypinamy lockfile i `.nvmrc`; domyślny Node środowiska to 20.
- PostgreSQL przez `pg`, repozytorium z parametryzowanymi zapytaniami i migracje SQL
  w transakcjach. Na tym etapie dwa proste modele nie wymagają dodatkowego ORM.
- Wspólne schematy Zod walidują kontrakty wejścia i odpowiedzi. API zwraca
  `{ ok: true, data }` lub `{ ok: false, error: { code, message } }`.
- Kwoty jako całkowita liczba groszy, waluta PLN. Identyfikatory UUID.
- Domyślne dane lokalnej bazy są wyłącznie demonstracyjne. Osobna baza testowa
  i port; testy nie usuwają danych bazy deweloperskiej.

## Wymagane zachowanie

1. `GET /api/health` działa bez bazy; `GET /api/health/ready` sprawdza bazę.
2. `GET /api/products` zwraca posortowaną, stronicowaną listę; pozwala filtrować
   tekst, kategorię i dostępność. Niepoprawne parametry zwracają 400.
3. `GET /api/products/:id` zwraca szczegóły albo 404; niepoprawny UUID zwraca 400.
4. UI pokazuje produkty, cenę z jednostką, pochodzenie, dostępność, wyszukiwanie,
   kategorie i szczegóły. Obsługuje ładowanie, pusty wynik, błąd API i powrót do listy.
5. Sprzedawcy i produkty są trwałe w PostgreSQL. Migracje można uruchomić ponownie,
   seed jest idempotentny i nie czyści tabel.
6. Brak bazy nie blokuje kompilacji. Błąd bazy daje bezpieczną odpowiedź 503,
   bez ujawniania połączenia, SQL lub stosu błędu.

## Plan i ryzyka

1. Zapisać decyzje, kontrakty i testy oczekiwanego zachowania.
2. Przygotować workspace, konfigurację, API, migracje i seed.
3. Dodać klienta Angular, wspólne wyświetlanie stanów i widoki katalogu.
4. Dodać Docker Compose, izolację testowej bazy i CircleCI.
5. Uruchomić lint, typecheck, testy jednostkowe, integrację PostgreSQL, build,
   E2E w przeglądarce i sprawdzenie kontenerów; uzupełnić README i wnioski.

Ryzyka: zgodność nowych wersji narzędzi; konflikt portów z innymi projektami;
uruchamianie testów na niewłaściwej bazie. Ograniczenia: wersje zweryfikowane
w rejestrze npm, porty konfigurowalne i osobne środowisko testowe.

## Kryteria akceptacji

- `npm ci`, `npm run lint`, `npm run typecheck`, `npm test` i `npm run build` przechodzą.
- Migracje i seed działają dwukrotnie bez powielania danych; integracja sprawdza
  faktyczne filtrowanie, paginację, szczegóły i izolację przed SQL injection.
- E2E sprawdza katalog → wyszukiwanie/filtrowanie → szczegóły → powrót,
  pusty wynik i błąd API. CircleCI uruchamia ten sam zestaw kontroli.
- `docker compose up --build` uruchamia PostgreSQL, API i frontend z healthcheckami;
  migracje poprzedzają API, seed wymaga osobnej komendy.
- README opisuje instalację, uruchomienie, migracje, seed, testy, strukturę,
  ograniczenia i dalsze etapy. `CLAUDE.md` zachowuje import `@AGENTS.md`.

## Wynik weryfikacji

- Czyste `npm ci` i `npm audit`: zero podatności.
- `npm run check`: lint, typecheck, 26 testów jednostkowych/HTTP i build przeszły.
- `npm run test:integration`: 8 testów na prawdziwym PostgreSQL przeszło.
- `TMPDIR=/tmp PLAYWRIGHT_CHROME_CHANNEL=chrome npm run test:e2e`:
  10 scenariuszy desktop/mobile przeszło; obejrzano zrzuty obu widoków.
- `npm run format:check` oraz walidacja Compose przeszły.
- Obrazy Docker zbudowano i uruchomiono z healthcheckami; seed wykonano ponownie.
  Smoke przez Nginx sprawdził 6 produktów, bezpośredni adres szczegółów i odświeżenie
  bez błędów JavaScript. `npm run dev` sprawdzono także z API uruchamianym przez tsx.
- CircleCI jest skonfigurowane; zewnętrznego przebiegu CI nie uruchamiano.
