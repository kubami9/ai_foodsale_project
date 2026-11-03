# Ustalenia i wnioski

Przeczytaj ten plik na początku każdego zadania i otwórz notatki związane z jego
zakresem. Krótkie wnioski zapisuj tutaj, rozwinięcia w `lessons/slug.md` i dodaj
do nich link. Podawaj kontekst, zalecenie i źródło; aktualizuj istniejące ustalenia
zamiast je powielać. Zasady pracy opisują [AGENTS.md](../AGENTS.md)
i [CLAUDE.md](../CLAUDE.md).

## Ustalenia

- 2026-11-03: [Specyfikacja engineering standards](specs/2026-09-01-engineering-standards.md)
  opisuje DevMentor, a `README.md` opisuje AI Foodsale. Przed zastosowaniem jej
  zaleceń sprawdź zgodność z bieżącym projektem; nie traktuj wymienionych tam
  pakietów i technologii jako istniejącej architektury AI Foodsale. Źródło:
  nagłówek i treść specyfikacji oraz [README.md](../README.md).
- 2026-11-03: Wspólne zasady utrzymuj w `AGENTS.md`, a w `CLAUDE.md` pozostaw
  import `@AGENTS.md` poza blokiem kodu. Pozwala to uniknąć rozbieżnych kopii;
  składnię importu potwierdza [dokumentacja Claude Code](https://code.claude.com/docs/en/memory#import-additional-files).
- 2026-11-03: [Uruchamianie fundamentu aplikacji](lessons/fundament-aplikacji.md):
  zgodna wersja Node, krótki TMPDIR dla Chrome w worktree i sprawdzony override
  zależności narzędziowej po audycie npm.
