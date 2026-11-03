# AI Foodsale

Platforma dla małych gospodarstw, rzemieślniczych wytwórców i lokalnych kuchni.
Docelowo sprzedawcy będą zarządzać produktami, dostępnością i rezerwacjami, a kupujący
odkrywać ofertę, kupować i kontaktować się bezpośrednio z wytwórcami.

Projekt startowy zawiera działający publiczny katalog produktów: wyszukiwanie po
nazwie, opisie, wytwórcy i miejscowości, kategorie, filtr dostępności, paginację
API oraz szczegóły produktu i sprzedawcy. UI jest po polsku, działa na telefonie
oraz obsługuje ładowanie, pusty wynik i błąd połączenia. Przykładowe dane są fikcyjne.

## Technologie i struktura

- Angular 22, standalone components, routing, sygnały, TypeScript 6, SCSS i Tailwind 4.
- Angular CLI i domyślny builder aplikacji: esbuild oraz Vite podczas developmentu.
- NestJS 12, PostgreSQL 18, sterownik `pg`, parametryzowane zapytania i migracje SQL.
- npm workspaces, Zod dla wspólnych kontraktów, Vitest, Playwright, ESLint i Prettier.
- Docker Compose dla aplikacji i odseparowanej bazy testowej; CircleCI dla kontroli.

```text
apps/
  web/src/app/
    catalog/             # widoki, klient HTTP i stan katalogu
    shared/              # wspólne stany ładowania/błędu i brak strony
  api/src/
    catalog/             # kontrakt repozytorium, serwis i cienki kontroler
    config/              # walidacja środowiska
    database/            # adapter PostgreSQL, migracje i seed
    health/              # liveness i gotowość bazy
    http/                # bezpieczne odpowiedzi błędów
packages/contracts/      # wspólne schematy i typy; bez importów frameworków
e2e/                    # scenariusze przeglądarkowe
docker/                 # obrazy API i frontendu oraz reverse proxy Nginx
.ai/                    # specyfikacje, dzienniki i trwałe wnioski
```

Logika pozostaje w małych serwisach i funkcjach. Komponenty składają widoki,
kontrolery obsługują HTTP, a repozytorium odpowiada za bazę. DI zapewnia Nest.
Wspólne kontrakty nie zależą od Angulara, Nest ani bazy; ESLint pilnuje kierunku
importów. Ogólne zasady z materiału DevMentor dopasowano do tego stosu;
nie wprowadzono React, Next.js, Awilix ani spekulatywnej infrastruktury.

## Wymagania

- Node **24.22.2** (zgodny zakres: `>=24.15.0 <25`), npm 10+.
- Docker z Docker Compose v2+.

Jeśli używasz nvm: `nvm install && nvm use`. Wersję określają `.nvmrc`
i `.node-version`. `.npmrc` odrzuca instalację pod niezgodną wersją Node.

## Lokalny development

Uruchom z katalogu głównego repozytorium:

```bash
npm ci
cp .env.example .env
cp .env.test.example .env.test
npm run db:up
npm run db:migrate
npm run db:seed
npm run dev
```

Frontend: **http://localhost:4200**, API: **http://localhost:3000/api**.
Angular proxy przekazuje `/api` do lokalnego backendu. `.env` nie trafia do Git.
Przykładowe hasła służą wyłącznie lokalnym, demonstracyjnym kontenerom.
Bez seeda katalog jest pusty, ale działa poprawnie.

Migracje wykonuj jawnie: `npm run db:migrate`. Wykonywane migracje są zapisywane
z sumą kontrolną, a kolejne uruchomienie ich nie powtarza. Nie edytuj zastosowanych
migracji: dodaj następny numerowany plik SQL. Cały przebieg jest transakcyjny
z blokadą przed równoległym wykonaniem.

Seed `npm run db:seed` wymaga `ALLOW_DEMO_SEED=true` oraz nazwy bazy zakończonej
`_dev` lub `_test`. Dodaje brakujące rekordy bez czyszczenia tabel i bez nadpisywania
zmienionych danych. Zmiana danych przykładowych wymaga świadomej migracji lub nowego ID.

## Cała aplikacja w Dockerze

```bash
docker compose up --build -d --wait
# Opcjonalnie dodaj fikcyjne produkty i sprzedawców:
docker compose --profile demo run --rm seed
```

Aplikacja: **http://localhost:8080**. Nginx serwuje Angular i przekazuje `/api`
do Nest. PostgreSQL ma trwały wolumen; migracje kończą się przed startem API.
Seed nie uruchamia się automatycznie. Kontenery bazy, API i frontendu mają healthchecki.
Kontener API działa jako użytkownik `node`. To konfiguracja lokalna, bez TLS
ani integracji produkcyjnych.

`docker compose down` zatrzymuje aplikację i zachowuje bazę. Nie dodawaj `-v`,
jeśli chcesz zachować dane. Baza testowa używa tmpfs i jest odtwarzalna.

Domyślne porty hosta: baza 5433, baza testowa 5434, API 3000, web 8080.
Można je zmienić zmiennymi `DB_PORT`, `TEST_DB_PORT`, `API_PORT`, `WEB_PORT` dla
Compose. Przy zmianie portów lokalnego developmentu dostosuj również `.env`
i `apps/web/proxy.conf.json`.

## API

Wszystkie endpointy są publiczne i wyłącznie do odczytu:

| Metoda i ścieżka          | Wynik                                              |
| ------------------------- | -------------------------------------------------- |
| `GET /api/health`         | Stan procesu; nie wymaga dostępnej bazy            |
| `GET /api/health/ready`   | Sprawdzenie połączenia PostgreSQL; 503 przy awarii |
| `GET /api/products`       | `{ items, total, page, pageSize }`                 |
| `GET /api/products/:uuid` | Produkt z informacją o sprzedawcy; 404 gdy brak    |

Filtry: `query` (maks. 100 znaków), `category` (`dairy`, `bakery`, `produce`,
`pantry`, `meals`), `available` (`true`/`false`), `page` (1–10000), `pageSize`
(1–100, domyślnie 12). Filtry łączą się; sortowanie jest stabilne po nazwie i UUID.
Wyszukiwanie ignoruje wielkość liter; nie pomija polskich znaków diakrytycznych.

```bash
curl 'http://localhost:3000/api/products?category=dairy&available=true'
```

Odpowiedź sukcesu: `{ "ok": true, "data": ... }`.
Błąd: `{ "ok": false, "error": { "code": "...", "message": "..." } }`.
Walidacja zwraca 400, brak produktu 404, niedostępna baza 503. Szczegóły połączenia
ani zapytań SQL nie są zwracane klientowi. Kwoty są liczbą całkowitą groszy, np.
`2400` oznacza 24,00 zł; waluta to PLN. Dostępność wynika ze stanu magazynowego > 0.

## Weryfikacja i testy

```bash
npm run check                 # lint, typecheck, unit/API tests i produkcyjny build
npm run db:test:up            # osobny PostgreSQL: foodsale_test na porcie 5434
npm run test:integration      # rzeczywista baza: migracje, seed, filtry i paginacja
npx playwright install chromium
npm run test:e2e              # Chrome desktop + mobilny viewport, start API i Angular
npm audit
```

Przy zainstalowanym Google Chrome możesz pominąć pobieranie Chromium i użyć:

```bash
TMPDIR=/tmp PLAYWRIGHT_CHROME_CHANNEL=chrome npm run test:e2e
```

Testy integracyjne i E2E używają **wyłącznie `TEST_DATABASE_URL`**, wymagają nazwy
bazy zakończonej `_test` i nie korzystają z `DATABASE_URL`. Domyślnie czytają
`.env.test`. Nie wskazuj w nim żadnej bazy z istotnymi danymi: te testy utrzymują
własne dane demonstracyjne. Nie usuwają bazy deweloperskiej.

E2E sam uruchamia API na 3100 i Angular na 4300, przygotowuje migracje i seed,
a następnie zamyka serwery. Te dwa porty muszą być wolne. Scenariusze obejmują
wyszukiwanie, filtry, szczegóły z odświeżeniem strony, powrót z zachowaniem filtrów,
pusty wynik, niedostępne API i ponowienie. Jednostkowo testujemy zachowanie logiki
i kontraktów; UI sprawdzamy przez scenariusze użytkownika, bez testów szczegółów DOM.

CircleCI (`.circleci/config.yml`) uruchamia te same kontrole, własny PostgreSQL
oraz Playwright i przechowuje raport HTML. Plik jest gotowy do podłączenia
repozytorium do CircleCI; lokalna weryfikacja nie uruchamia usługi CI.

`minimatch` ma tymczasowy override na `^11.0.4`: usuwa zgłoszenie
GHSA-g3hv-75wg-m249 z zależności narzędzi ESLint. Po aktualizacji tych narzędzi
sprawdź, czy override nadal jest potrzebny. Nie cofaj lintera do starej wersji
sugerowanej przez `npm audit fix --force`.

## Dalsze etapy

1. Konta kupujących i sprzedawców, bezpieczne sesje i sprawdzanie właściciela zasobów.
2. Panel sprzedawcy: oferta, opisy i media, planowanie dostępności.
3. Zakupy, rezerwacje produktów oraz stolików z ochroną przed podwójną rezerwacją.
4. Płatności przez port integracji, kontakt kupującego z wytwórcą.

Żaden z tych etapów nie jest obecnie zaimplementowany. Publiczne endpointy zapisu
pojawią się razem z kontrolą dostępu. Dalsze funkcje prowadź przez SDD i kryteria
akceptacji, bez tworzenia pustych modułów na zapas.

Zasady pracy: [AGENTS.md](AGENTS.md); Claude Code wczytuje je przez `CLAUDE.md`.
Specyfikacje, dzienniki i pamięć projektu znajdują się w `.ai/`.
