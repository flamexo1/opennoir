# opennoir

Open-source software for managing agents, connected devices and work. **v0.5.0 — connected self-hosted preview.** MIT-licensed application source.

Marketplace → My team → Work → Earnings. A shared design system, local fonts and private SQLite persistence are included.

## Run it

Install **Node.js 24+** and Git, then:

```sh
git clone https://github.com/flamexo1/opennoir.git
cd opennoir
npm ci
npm start
```

Open **http://127.0.0.1:4180**. On first launch, create the administrator account. That account manages the existing workspaces; upgrading preserves their records and feedback. Other accounts require an invitation from an owner.

For the downloadable source ZIP, extract it, open the `opennoir-platform` folder in your terminal, run `npm ci`, then `npm start`.

No external account is required for local accounts, deterministic document processing, the device test client, or demo browsing. The optional AI and payment services need configuration. All runtime data lives in `data/opennoir.sqlite`; keep the entire data directory private.

## What actually works

| Feature | Behavior |
| --- | --- |
| Accounts | Better Auth email/password sign-in, signed sessions, password changes, offline administrator recovery |
| Workspace access | Owner, operator and viewer permissions checked on the server; invitation links expire after 24 hours |
| Document processor | Real keyword/email extraction, word counts and an extractive summary; deterministic, not an AI model |
| Local AI adapter | Ollama connection check and queued summaries when a model is configured; no bundled model |
| Task processing | Persistent queue, saved results/events, cancellation, explicit retries, expired-lease recovery |
| Device gateway | Hashed device tokens, monotonic telemetry, online/offline state, read-only diagnostic commands and acknowledgement, revocation |
| Networked device simulator | Separate Node process that uses the same gateway; clearly labeled simulated hardware |
| Stripe integration | Test checkout, signature-verified notifications, amount/currency checks, duplicate-event handling, service activation and refund revocation |
| Data and feedback | Private screenshots, support cases, persistent page pins/replies, export and backup |

The original robot/brand catalog, assignments, sample runs, demo earnings and demo payouts remain labeled demonstrations. Tesla/NVIDIA reference concepts are not offers or partnerships. New connected tasks and verified Stripe test transactions are displayed separately. No real vehicle, robot motion control, live seller payouts, global ID federation or manufacturer certification is included. This is not an audited production marketplace.

## First useful workflow

1. Create your account and open **Connections**.
2. Choose **Install built-in processor**.
3. Paste text and choose **Run task**.
4. Open the saved result under **Connected tasks** or **Activity**.
5. Add a **Networked simulator** device and run the separate client to inspect online telemetry and diagnostics.

See [setup and deployment](docs/SETUP.md), [device protocol](docs/DEVICE-PROTOCOL.md), [architecture](docs/ARCHITECTURE.md), [security](docs/SECURITY.md), [design system](docs/DESIGN-SYSTEM.md), and [API](docs/API.md).

## Check and maintain

```sh
npm run check
npm test
npm run doctor
npm run backup
```

Backups include account/session data and screenshots. Keep them private. To recover a password, stop the server and run `npm run account:reset -- user@example.com` in an interactive terminal; it prompts for a hidden password and invalidates that user's sessions.

To update: make a backup, stop the server, run `git pull`, `npm ci`, then `npm start`. Preserve `.env` and `data/`. Do not run multiple server processes against this SQLite installation.

## Optional configuration

Copy `.env.example` to `.env`. Set only what you use. Credentials stay on the server; never commit them. `APP_URL` must match the address used in the browser. Configure HTTPS and a reverse proxy for remote hosting. See [SETUP.md](docs/SETUP.md) for local AI, Stripe test webhooks, Docker and recovery.

## Verification

38 automated tests currently cover original lifecycle/feedback behavior plus secure access, invitations/roles, real text processing, queue recovery, device-token isolation, telemetry replay rejection, diagnostics, provider fixtures and signed Stripe event processing. Browser checks exercised first-run account creation, installing a processor, completing a task, and a separate device client receiving and acknowledging diagnostics.

Actual Ollama inference, Stripe-hosted checkout against an account, physical hardware, seller payouts and deployment infrastructure require external setup and have not been verified in this environment. Payment and AI protocol fixtures are not proof that an external account is connected.

## License and assets

Application source: [MIT](LICENSE). Inter font: SIL Open Font License in `public/assets/fonts/LICENSE.txt`. Photographs retain the separate Unsplash license: [credits](docs/PHOTO-CREDITS.md). Generated concept images: [asset notes](docs/GENERATED-ASSETS.md).
