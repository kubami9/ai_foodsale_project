# Instrukcje pracy z AI

Te zasady obowiązują wszystkich asystentów pracujących w tym repozytorium.
Zwracaj się do użytkownika „boss” lub „sensei”.
Pliki `AGENTS.md` i `CLAUDE.md` muszą zawierać te same instrukcje; zmieniając
zasady, aktualizuj oba w tym samym commicie.

## Obowiązkowy początek pracy

1. Przeczytaj `README.md`, `.ai/lessons.md` i powiązane notatki z `.ai/lessons/`.
2. Znajdź specyfikację i istniejący dziennik zadania w `.ai/runs/`. Przy wznowieniu
   lub przejęciu zadania przeczytaj cały dziennik i kontynuuj w tym samym pliku.
   Nie zakładaj nowego dziennika tylko dlatego, że zmieniła się sesja, osoba lub data.
3. Przeczytaj właściwą specyfikację przed implementacją. Sprawdź, czy dotyczy tego
   projektu i aktualnego zadania; nie przenoś założeń z obcych lub archiwalnych dokumentów.

## Struktura `.ai/`

```text
.ai/
├── specs/
│   ├── YYYY-MM-DD-slug.md       # bieżące specyfikacje SDD
│   ├── implemented/             # specyfikacje zrealizowane
│   └── archive/                 # specyfikacje wycofane lub zastąpione
├── runs/
│   └── YYYY-MM-DD-slug.md       # jeden przyrostowy dziennik na zadanie
├── lessons.md                   # indeks trwałych ustaleń i krótkie wnioski
└── lessons/
    └── slug.md                  # rozwinięcia wniosków i procedury
```

Katalog `.ai/cezar/` jest zapleczem narzędzia; nie zastępuje powyższej dokumentacji.
Dokumentację `.ai/` przechowuj w Git. Puste katalogi utrzymuj plikami `.gitkeep`.

## Specyfikacje SDD

- Każda specyfikacja ma nazwę `YYYY-MM-DD-slug.md`: data utworzenia, małe litery
  ASCII i słowa oddzielone myślnikami, np. `2026-11-03-rezerwacja-stolika.md`.
- Przed implementacją zachowania w trybie SDD utwórz lub uzupełnij specyfikację:
  cel, zakres, wymagane zachowanie i kryteria akceptacji możliwe do sprawdzenia.
  Zmiany czysto dokumentacyjne nie wymagają osobnej specyfikacji.
- Po spełnieniu kryteriów akceptacji przenieś specyfikację do `specs/implemented/`.
  Dokument wycofany lub zastąpiony przenieś do `specs/archive/`; wskaż powód
  i następcę, jeśli istnieje. Przy przenoszeniu zachowaj nazwę pliku.
- Aktualizuj bieżące odnośniki, w tym link w nagłówku dziennika. Nie przepisuj
  historycznych wpisów dziennika; zmianę lokalizacji odnotuj w kolejnym wpisie.

## Dziennik zadania — obowiązkowy przy każdym commicie

- Najpóźniej podczas przygotowania pierwszego commita zadania utwórz
  `.ai/runs/YYYY-MM-DD-slug.md`. Data w nazwie to dzień rozpoczęcia zadania,
  także gdy pierwszy commit następuje później. Slug opisuje zadanie.
- Dla jednego zadania istnieje dokładnie jeden dziennik. Nie zmieniaj jego nazwy
  ani nie twórz kolejnego przy następnej sesji, przejęciu czy pracy przez kilka dni.
- Na początku utrzymuj stały nagłówek: tytuł, cele, link do specyfikacji (jeśli
  istnieje; w przeciwnym razie wpisz „brak”) i dokładnie jedną linię
  `Status: in-progress` albo `Status: done`. Aktualizuj cele i status w nagłówku.
  Ustaw `done` dopiero, gdy zadanie jest ukończone i zweryfikowane.
- **Przed każdym commitem** dopisz na końcu tego samego pliku wpis o długości
  **2–5 linii**: data, zakres commita, decyzje lub napotkane pułapki i co pozostało
  do zrobienia. Uwzględnij wynik weryfikacji. Gdy nie ma dalszych prac, napisz to wprost.
- Wpis przygotuj przed commitem i dodaj do tego samego commita co opisywane zmiany.
  Dotyczy to także commitów dokumentacji i poprawek. Nie odkładaj zapisu do końca sesji.
  Nie zmieniaj ani nie usuwaj wcześniejszych wpisów; sprostowania dopisuj na końcu.

Wzór dziennika (zastąp nawiasy kwadratowe własną treścią):

```markdown
# [Tytuł zadania]

Cele:
- [Cel i kryterium ukończenia]

Specyfikacja: [nazwa](../specs/YYYY-MM-DD-slug.md)
Status: in-progress

## Historia commitów

### YYYY-MM-DD — [zakres commita]
Decyzje / pułapki: [ustalenia albo brak].
Weryfikacja: [wykonane sprawdzenia i wynik].
Pozostało: [konkretne prace albo brak].
```

## Ustalenia i pamięć długoterminowa

- `.ai/lessons.md` to punkt wejścia: zapisuj krótkie, przydatne w przyszłości
  ustalenia i linki do szczegółów w `.ai/lessons/slug.md`.
- Po naprawieniu błędu, odkryciu pułapki albo usprawnieniu pracy zapisz trwały
  wniosek, jeśli może zapobiec powtórzeniu problemu. Nie twórz wpisów bez wartości
  dla kolejnych zadań ani kopii dziennika.
- Podaj kontekst, wniosek, zalecane działanie oraz źródło lub sposób weryfikacji.
  Przed dodaniem sprawdź istniejące wpisy; uzupełniaj je zamiast tworzyć duplikaty.
  Nieaktualny wniosek oznacz jako zastąpiony i wskaż aktualne ustalenie.
- Nie zapisuj sekretów, tokenów, haseł ani danych osobowych w dokumentacji.

## Kontrola przed commitem i zakończeniem

Przed każdym commitem sprawdź, że dziennik zawiera przygotowany wpis 2–5 linii,
ma aktualne cele, link i status oraz jest dodany do tego samego commita.
Sprawdź zgodność zmian ze specyfikacją, jeśli istnieje, wykonaj właściwe dla zmian
testy lub kontrolę dokumentacji i zapisz wynik. Zapisz nowe trwałe wnioski w lessons,
jeśli wystąpiły. Nie twórz commita bez wpisu w dzienniku.
Przed zakończeniem sprawdź kryteria ukończenia, ustaw `Status: done` i uwzględnij
to w końcowym commicie zadania. Niewykonane sprawdzenia i blokady opisz jawnie;
nie oznaczaj nieukończonego zadania jako `done`.
