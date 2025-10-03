
# Cleaning Marketplace (MVP)

Next.js 14 + TypeScript + **bez Tailwind** (CSS Modules).

## Szybki start
```bash
pnpm i # albo npm install / yarn
pnpm dev # http://localhost:3000
```
## Kluczowe widoki
- Strona główna `/`
- Jak to działa `/how-it-works`
- Rejestracja `/register` (multi-step, Klient/Usługodawca, weryfikacja e-mail *mock*)
- Profile `/profiles` (lista + wyszukiwarka)
- Szczegóły profilu `/profiles/[id]` (zamówienie usługi *mock*)
- Kokpit usługodawcy `/dashboard` (zakładki: Konto, Zlecenia, Powiadomienia, Opinie, Wiadomości, Subskrypcje, Pomoc)

> Dane są trzymane w plikach JSON w katalogu `data/` jako proste **mock API** (do podmiany na DB).

## Zamiana mock na prawdziwą bazę
- Zastąp `app/api/*` backendem (np. Prisma + Postgres).
- Dodaj auth (np. NextAuth) i wysyłkę e-maili (Resend/SMTP).
- Zastąp weryfikację kodu w `/api/auth/verify` prawdziwą obsługą.

## Stylowanie
- CSS Modules w `*.module.css`.
- Komponenty dostępnościowe i bez przeładowań (SPA feel) w miejscach rejestracji i dashboardu.

## Licencja
MIT (do użytku komercyjnego bez gwarancji).
