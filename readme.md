# Cudowna Doniczka

Strona internetowa promująca ekologiczne doniczki wykonane z Mineralnego Kompozytu Konopnego (MKK). Projekt łączy w sobie nowoczesny design, ekologię i technologię, prezentując zalety produktu oraz budując społeczność wokół marki.

## O Projekcie

"Cudowna Doniczka" to inicjatywa, która wykracza poza sprzedaż produktu. To platforma edukacyjna i społecznościowa, która inspiruje do życia w zgodzie z naturą.

**Główne Funkcje:**
*   **Strona Główna:** Efektowna wizytówka z animowanym Hero Section i kursorami interaktywnymi.
*   **Wydarzenia:** Sekcja z relacjami i zapowiedziami wydarzeń, warsztatów i targów.
*   **Blog:** Artykuły edukacyjne o ekologii, MKK i pielęgnacji roślin.
*   **Formularz Kontaktowy:** Zintegrowany z EmailJS do bezpośredniej komunikacji.
*   **Responsywność:** Pełne wsparcie dla urządzeń mobilnych (RWD).

## Technologie

Projekt został zbudowany przy użyciu nowoczesnego stosu technologicznego:

*   **Frontend:** React 18
*   **Język:** TypeScript
*   **Build Tool:** Vite
*   **Style:** Tailwind CSS
*   **Komponenty UI:** shadcn/ui (Radix UI)
*   **Routing:** React Router v6
*   **Zarządzanie Stanem / Dane:** TanStack Query (React Query)
*   **Formularze:** React Hook Form + Zod
*   **Ikony:** Lucide React
*   **Email:** EmailJS

## Wymagania

*   Node.js (v18 lub nowszy)
*   npm (v9 lub nowszy)

## Instalacja i Uruchomienie

1.  **Sklonuj repozytorium:**
    ```bash
    git clone <URL_REPOZYTORIUM>
    cd cudowna-doniczka-lovable
    ```

2.  **Zainstaluj zależności:**
    ```bash
    npm install
    ```

3.  **Skonfiguruj zmienne środowiskowe:**
    Stwórz plik `.env` na podstawie `.env.example` i uzupełnij go swoimi danymi EmailJS:
    ```env
    VITE_EMAILJS_SERVICE_ID=twoj_service_id
    VITE_EMAILJS_TEMPLATE_ID=twoj_template_id
    VITE_EMAILJS_PUBLIC_KEY=twoj_public_key
    ```

4.  **Uruchom serwer deweloperski:**
    ```bash
    npm run dev
    ```
    Aplikacja będzie dostępna pod adresem `http://localhost:8080`.

## Dostępne Skrypty

*   `npm run dev`: Uruchamia serwer deweloperski.
*   `npm run build`: Buduje aplikację produkcyjną.
*   `npm run preview`: Uruchamia podgląd wersji zbudowanej.
*   `npm run lint`: Sprawdza kod pod kątem błędów (ESLint).
*   `npx tsc -b`: Sprawdza typy TypeScript.

## Struktura Katalogów

*   `/src`: Kod źródłowy aplikacji.
    *   `/components`: Komponenty React (podzielone na `ui` i dedykowane).
    *   `/pages`: Główne widoki strony (Index, Events, Blog, Article itp.).
    *   `/lib`: Pliki pomocnicze, definicje typów i dane (`data.ts`).
*   `/public`: Zasoby statyczne.

## Ostatnie Zmiany

*   **Wydajność:** Wdrożono Lazy Loading dla wszystkich podstron.
*   **Stabilność:** Aplikacja działa w `React.StrictMode`, poprawiono typowanie TypeScript (`strict: true`).
*   **UI/UX:** Zrefaktoryzowano mechanizm scrollowania (`useLayoutEffect`), naprawiono renderowanie HTML w artykułach.
*   **Bezpieczeństwo:** Konfiguracja EmailJS przeniesiona do zmiennych środowiskowych.