# Fundament AI Foodsale

Cele:
- Utworzyć działający projekt Angular/NestJS/PostgreSQL z katalogiem produktów.
- Dodać Docker, migracje, seed, testy i CircleCI oraz sprawdzoną instrukcję uruchomienia.

Specyfikacja: [Fundament aplikacji](../specs/implemented/2026-11-03-fundament-aplikacji.md)
Status: done

## Historia commitów

### 2026-11-03 — Specyfikacja i plan świeżego projektu AI Foodsale.
Decyzje / pułapki: README określa Angular/NestJS; materiał DevMentor adaptujemy wyłącznie w zakresie ogólnych standardów; Node 24 dla Angular 22, pg i trzy workspaces.
Weryfikacja: odczyt wszystkich dokumentów repozytorium, dostępne Docker i Chrome, wersje Angular/NestJS sprawdzone w npm i dokumentacji.
Pozostało: implementacja kontraktów, API, UI, infrastruktury i uruchomienie wszystkich kontroli ze specyfikacji.

### 2026-11-03 — Uruchamialne workspaces Angular/NestJS/kontrakty, katalog z PostgreSQL, migracje i seed, Docker, testy, CircleCI i README.
Decyzje / pułapki: jawne DI Nest, parametryzowane SQL, grosze zamiast kwot zmiennoprzecinkowych; testy na osobnej bazie; skorygowano TMPDIR dla Chrome i podatny minimatch. Specyfikację przeniesiono do implemented, wnioski zapisano w lessons.
Weryfikacja: npm ci, lint, typecheck, 26 unit/HTTP, 8 integracji i 10 E2E przeszły; build, format:check, Compose i produkcyjny smoke przez Nginx oraz npm run dev przeszły; audit: 0 podatności. CircleCI skonfigurowano, bez zewnętrznego uruchomienia.
Pozostało: brak w zakresie fundamentu; konta, panel sprzedawcy, zakupy i rezerwacje to kolejne zadania opisane w README.
