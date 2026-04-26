# Ukelonn Public (Next.js + Firebase)

Delbar mal for ukelønn-app med parent/child-visning, sanntidsdata i Firestore, push-varsler via FCM og Cloud Functions.

## Hva inneholder appen

- `/` startside med onboarding, Firebase-guide og valgfritt runtime-oppsett
- `/parent` forelder-dashboard (admin, godkjenning, innstillinger)
- `/child` barneside med ukesoppgaver, bonus og sparemål
- PWA-støtte (kan installeres)
- Firestore synk på tvers av enheter
- Push-varsler via Firebase Cloud Messaging

## Delbar konfigurasjon

Ingen prosjektspesifikke Firebase-nøkler ligger i repoet.

Konfig kan settes på to måter:

1. Miljøvariabler (anbefalt)
2. Runtime-konfig på startsiden `/` (lagres i localStorage)

For bakgrunnsvarsler i service worker må du i tillegg fylle ut `public/firebase-config.json`.

### Miljøvariabler

Lag `.env.local` i prosjektroten:

Tips: Du kan starte med å kopiere `.env.local.example` til `.env.local`.

Kopieringskommandoer:

```powershell
Copy-Item .env.local.example .env.local
```

```bash
cp .env.local.example .env.local
```

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
NEXT_PUBLIC_FCM_VAPID_KEY=...
NEXT_PUBLIC_ENABLE_FCM=true
```

## Firebase-oppsett (må gjøres i eget prosjekt)

1. Opprett Firebase-prosjekt.
2. Authentication: aktiver Email/Password.
3. Firestore: opprett database.
4. Cloud Messaging: hent Web Push certificate (VAPID key).
5. Legg til Web App i Firebase og kopier SDK-konfig.
6. Deploy Cloud Functions fra `functions`.

## Kom i gang lokalt

```bash
npm install
cd functions
npm install
cd ..
npm run dev
```

Åpne deretter `http://localhost:3000`.

## Scripts

- `npm run dev`
- `npm run lint`
- `npm run build`
- `npm run start`
- `npm run functions:build`
- `npm run functions:deploy`

## Forelder-innstillinger

I `/parent` kan du nå:

- lagre barnets navn
- bytte fargetema mellom `Jente (rosa)` og `Gutt (blå)`
- sette/fjerne PIN for barnesiden

## Cloud Functions

Se `functions/README.md` for detaljer om triggere og varsler.

## Push-varsler

Se `PUSH_NOTIFICATIONS.md` for test- og feilsøkingsflyt.

---

## How to Contribute

Contributions are welcome! The short version:

1. **Fork** this repository.
2. Create a feature branch: `git checkout -b feat/my-feature`
3. Make your changes, then run `npm run lint && npm run build`.
4. Push your branch and open a **Pull Request** against `master`.

See [CONTRIBUTING.md](CONTRIBUTING.md) for full details including coding standards and commit conventions.

## Coding Standards

- TypeScript — keep types explicit where it aids readability.
- ESLint + `eslint-config-next` ruleset (`npm run lint`).
- Tailwind CSS utility classes for styling.
- No secrets or Firebase keys committed — use `.env.local` or runtime config.

## Security

To report a vulnerability, please use [GitHub's private security advisory feature](../../security/advisories/new) instead of a public issue. See [SECURITY.md](SECURITY.md) for full details.

## Discussions

Have a question or idea? Use [GitHub Discussions](../../discussions) rather than opening an issue.
> **Note for maintainer:** Enable Discussions in **Settings → General → Features → Discussions** if not already active.
