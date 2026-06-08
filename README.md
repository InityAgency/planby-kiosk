# Planby Kiosk

Tablet PWA za evidenciju radnog vremena (PIN check-in/out).

## Pokretanje

```bash
pnpm install
pnpm dev
```

Aplikacija radi na `http://localhost:3002/kiosk/{token}`.

## Okruženje

Kopiraj `.env.example` u `.env` i postavi `VITE_API_URL` na backend (`http://localhost:3000` lokalno).

Backend mora imati `http://localhost:3002` u `CORS_ORIGINS`.

## PWA

Na Android tabletu otvori link u Chromeu, dodaj na početni ekran ili koristi App Pinning (Kiosk Mode).
