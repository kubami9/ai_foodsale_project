# Uruchamianie fundamentu aplikacji

## Zgodność narzędzi

2026-11-03: domyślny Node środowiska miał wersję 20, podczas gdy Angular 22
wymaga nowszego środowiska. Używaj wersji z `.nvmrc` (24.22.2), również dla
instalacji, kompilacji i testów. Nie obniżaj Angulara, aby ominąć problem lokalnego
runtime. Wersje i zakresy potwierdzono przez `npm view` oraz
[tabelę zgodności Angular](https://angular.dev/reference/versions).

## Chrome w głębokich worktree

2026-11-03: Chrome zakończył się przed otwarciem strony z błędem `Socket path too long`,
gdy `TMPDIR` wskazywał długą ścieżkę `.ai/cezar/tmp/<uuid>/`. W takim środowisku
uruchamiaj Playwright z `TMPDIR=/tmp`; dla zainstalowanego Chrome także
`PLAYWRIGHT_CHROME_CHANNEL=chrome`. Po tej korekcie przeszło 10 scenariuszy E2E.
To problem środowiska, nie powód do pomijania testów. Komendy znajdują się w README.

## Audyt zależności narzędziowych

2026-11-03: świeża instalacja ESLint/TypeScript ESLint zgłosiła podatny transytywny
`minimatch` ([GHSA-g3hv-75wg-m249](https://github.com/advisories/GHSA-g3hv-75wg-m249)).
Override `minimatch: ^11.0.4` usunął zgłoszenie; lint, typecheck i build nadal
przechodzą, a `npm ci` i `npm audit` zgłaszają zero podatności. Przy aktualizacji
narzędzi sprawdź, czy można usunąć override. Nie stosuj w ciemno `audit fix --force`,
który proponował cofnięcie ESLint do wersji 4.
