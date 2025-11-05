DugnadHub – funksjonalitet og testdekning
=========================================

Implementerte hovudfunksjonar
-----------------------------
1. E-post-/passord-registrering og innlogging via Firebase Authentication.
2. Liste over kommande dugnader med søk og filtrering på tittel, stad og kategori.
3. Detaljvising med påmelding/avmelding, anerkjenning og deltakaroversikt.
4. Oppretting av nye dugnader med støtte for bilete frå galleri og kameratilgang.
5. Profilvising med enkel statistikk og utlogging.
6. Saumlaus navigasjon mellom tabbar (Home, Create, Profile) og detaljskjerm.

Testing
-------
- Utvikling og manuell testing køyrt i Expo Go (iOS-simulator).
- Firebase Emulator Suite kan nyttast for lokal testing av autentisering og Firestore.

Firebase-prosjekt
-----------------
Legg inn eigne Firebase-konfigurasjonsverdiar i `.env` med `EXPO_PUBLIC_FIREBASE_*` nøklar før bygging. Sjå `firebaseConfig` for lista over parameternamn.

Testbrukar
----------
Sjå `test-users.txt` for e-post og passord som kan brukast ved sensur.
