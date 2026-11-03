# Instrukcje i struktura pracy z AI

Cele:
- Utworzyć zgodne instrukcje `AGENTS.md` i `CLAUDE.md` z obowiązkowym obiegiem dokumentacji AI.
- Przygotować specyfikacje SDD, przyrostowe dzienniki zadań oraz pamięć lessons w `.ai/`.
- Sprawdzić strukturę, nazwy, odnośniki i zgodność instrukcji oraz zapisać zmiany w Git.
- Dopasować wskazówki Borisa Cherny’ego do zasad projektu i wczytywać AGENTS.md z CLAUDE.md przez import.

Specyfikacja: brak — zadanie dokumentacyjne na podstawie polecenia użytkownika.
Źródło uzupełnienia: [10 wskazówek Borisa Cherny’ego](https://ykdojo.github.io/claude-code-tips/content/boris-claude-code-tips).
Status: done

## Historia commitów

### 2026-11-03 — Instrukcje AGENTS.md i CLAUDE.md oraz struktura specs, runs i lessons.
Decyzje / pułapki: identyczne instrukcje; istniejąca specyfikacja otrzymała datę z nagłówka bez zmiany treści; odmienny kontekst DevMentor opisano w lessons.
Weryfikacja: kontrola zgodności instrukcji, katalogów, nazw, lokalnych linków i zachowania treści specyfikacji zakończona powodzeniem; git diff --check bez błędów.
Pozostało: brak; zadanie dokumentacyjne ukończone.

### 2026-11-03 — Planowanie złożonych zadań, dowody weryfikacji i wnioski po poprawkach; CLAUDE.md importuje AGENTS.md.
Decyzje / pułapki: wybrano wskazówki pasujące do projektu i uzupełniono istniejące sekcje; wymóg identycznych kopii zastąpiono jednym źródłem zasad i importem poza blokiem kodu.
Weryfikacja: kontrola aktywnego importu i jego celu, lokalnych linków, braku duplikatów sekcji i zachowania wcześniejszej historii; git diff --check bez błędów. Składnia potwierdzona w dokumentacji Claude Code, bez uruchamiania sesji Claude.
Pozostało: brak; zmiany dokumentacyjne ukończone.
