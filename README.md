# Studio Dentistico Briguglia — Sito web

Sito vetrina realizzato con **Next.js (App Router)**, TypeScript e Tailwind CSS,
con un **pannello di amministrazione** che permette di gestire in autonomia tutti
i testi e le immagini del sito.

## Avvio in locale

```bash
npm install
npm run dev      # http://localhost:3000
```

Per la produzione:

```bash
npm run build
npm start
```

## Struttura del sito pubblico

- `/` — Home
- `/studio` — Lo Studio (storia, missione, valori)
- `/professionisti` — Elenco professionisti
- `/professionisti/[slug]` — Scheda dettaglio del singolo professionista
- `/servizi` — I nostri servizi (trattamenti)
- `/contatti` — Recapiti, sedi e modulo di contatto

## Pannello di gestione contenuti

Accesso da **`/admin`** (es. `https://iltuodominio.it/admin`).

Le credenziali si impostano nel file **`.env.local`** (vedi `.env.example`):

```env
ADMIN_USERNAME=admin
ADMIN_PASSWORD=scegli-una-password-robusta
SESSION_SECRET=stringa-casuale-lunga-e-segreta   # es. openssl rand -base64 32
```

> Non è prevista la registrazione: l'unico utente è quello definito nel file `.env`.
> Ricordarsi di **cambiare la password** prima della consegna e di impostare un
> `SESSION_SECRET` casuale.

Dal pannello si possono modificare, divisi per schede:

- **Generale** — nome, claim, presentazione, missione, citazione, immagine hero, SEO
- **Interfaccia** — testi globali UI (header, footer, CTA, home, contatti, form) per locale IT/EN
- **Storia & Valori** — tappe della storia e valori dello studio
- **Numeri** — i contatori/credenziali della home
- **Sedi & Contatti** — recapiti, dati legali, elenco sedi
- **Privacy** — dati privacy dedicati usati solo nella pagina Informativa Privacy
- **Servizi** — titoli, descrizioni, icone e prestazioni (aggiungi/rimuovi/riordina)
- **Professionisti** — schede complete con foto, biografia, formazione, contatti

Premendo **"Salva e pubblica"** le modifiche dei testi sono immediatamente
visibili sul sito.

### Immagini

Dal pannello admin puoi caricare immagini con upload diretto via API:

- percorso target: `public/uploads/cms/`
- formati supportati: `webp`, `jpg`, `png`
- limite dimensione: `700 KB` per file
- limite quantità: `max 3` immagini CMS attive

Il campo immagine accetta comunque anche un percorso manuale (es.
`/uploads/cms/nome-file.webp`). Lasciando vuoto il campo foto di un
professionista, viene mostrato l'avatar con le iniziali.

## Come funziona la persistenza (testi)

I testi modificati dal pannello sono salvati su **GitHub repository** come
source of truth, con commit atomici multi-file:

- file canonico: `content/site.bundle.json`
- snapshot append-only: `content/backups/<timestamp>-<revision>.json`
- contenuti bilingua nel bundle: `it` + `en`
- metadati di versione: `revision`, `updatedAt`, `updatedBy`, `idempotencyKey`
- controllo concorrenza: `expectedRevision` (salvataggi stantii rifiutati)
- idempotenza: `idempotencyKey` per retry senza duplicati

**Configurazione su Vercel:**

1. Crea un token GitHub fine-grained con permesso **Contents: Read and write**
   sul repository.
2. Imposta `GITHUB_TOKEN`, `GITHUB_REPO`, `GITHUB_BRANCH` tra le
   Environment Variables del progetto.
3. Imposta anche `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `SESSION_SECRET`.
4. (Opzionale) Imposta `VERCEL_WEBHOOK_SECRET` per il webhook di deploy.

**In locale:** senza configurazione GitHub, i testi vengono salvati nel file
`content/site.bundle.json` con snapshot in `content/backups/`.

## Webhook di deploy

- endpoint: `POST /api/vercel/deploy-webhook`
- autenticazione: `Authorization: Bearer <VERCEL_WEBHOOK_SECRET>` oppure header
  `x-webhook-secret`

Il webhook riceve gli eventi di deploy da Vercel e restituisce un ACK JSON.

## Runbook ripristino contenuti

Ordine consigliato in caso incidente:

1. Ripristino da `content/site.bundle.json` (stato canonico corrente).
2. Ripristino da snapshot in `content/backups/` scegliendo la revision desiderata.

Per verificare integrità, confronta hash e metadati (`revision`, `updatedAt`,
`idempotencyKey`) tra fonte di ripristino e stato atteso.

## Esportatore per `defaultContent.ts`

Per sostituire i contenuti di default con quelli scritti dal cliente puoi usare
lo script di export:

```bash
npm run export:default-content
```

Opzioni utili:

- `--locale it|en` per esportare una lingua specifica dal bundle
- `--source <path>` per usare un JSON alternativo (es. snapshot di backup)
- `--output <path>` per scegliere il file di destinazione
- `--no-backup` per evitare il backup automatico

Esempi:

```bash
npm run export:default-content -- --locale en
npm run export:default-content -- --source ./site-bundle-backup.json
```

Lo script crea automaticamente un file `.bak` del precedente
`src/lib/defaultContent.ts` prima di sovrascrivere.

## Personalizzazione tecnica

- Palette e font: `src/app/globals.css`
- Contenuti predefiniti: `src/lib/defaultContent.ts`
- Icone disponibili per le aree: `src/lib/icons.ts`
- Componenti UI: `src/components/`
- Pannello admin: `src/app/admin/` e `src/components/admin/`
