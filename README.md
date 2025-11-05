# DugnadHub

React Native / Expo-applikasjon for å koordinere lokale dugnader med Firebase som backend. Prosjektet inneheld både ein teoretisk rapport (Oppgåve 1) og ei praktisk implementering (Oppgåve 2) for eksamenscase TDS200 haust 2025.

## Kom i gang

1. Installer avhengigheiter:
   ```bash
   npm install
   ```
2. Kopier `.env.example` til `.env` og legg inn Firebase-konfigurasjon.
3. Start Expo-utviklingsserveren:
   ```bash
   npm start
   ```
4. Opne appen i Expo Go, Android-emulator eller iOS-simulator.

## Struktur

- `App.tsx` – hovudinngang med navigasjon og auth-fløde.
- `src/` – skjermer, komponentar, konfigurasjon og hooks.
- `docs/Oppgave1_rapport.md` – teoretisk rapport om teknisk tilråding.
- `Task2-readme.txt` – oversikt over implementert funksjonalitet og teststatus.

## Testing

- Kjør linting:
  ```bash
  npm run lint
  ```
- Firebase Emulator Suite kan nyttast for integrasjonstesting lokalt.

## Lisens

Prosjektet er levert som del av eksamensbesvarelse og er ikkje lisensiert for kommersiell bruk utan samtykke.
