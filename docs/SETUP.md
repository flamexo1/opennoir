# Installation and deployment

## Local installation

Use Node.js 24+, run `npm ci` and `npm start`, and open http://127.0.0.1:4180. Create an administrator with a unique password of at least 12 characters. Initial setup is permitted locally; subsequent registration requires an owner-created invitation. Use the exact `APP_URL` address: localhost and 127.0.0.1 are different cookie/origin contexts.

Existing SQLite documents and feedback are preserved. Additive tables hold accounts, membership, jobs, devices, orders and payment events. Better Auth applies its database migrations at startup. Back up before upgrading. This release supports one Node server/worker process and one persistent local SQLite volume, not multiple replicas.

## Team access

Connections → Account & workspace access → Create invitation link. Enter the recipient email and select operator or viewer. Share the private link yourself; no email provider is configured. Links expire after 24 hours and are single-use. New recipients register with the matching email. Existing account holders sign in, open Connections and accept the pending invitation. Viewer accounts can read their workspace but cannot mutate it. Operators can run tasks and manage work; owners control connections, setup and purchases.

## Built-in processing

Install the document processor in Connections, paste text and run a task. It computes real results locally; it is not a language model. The worker claims one job at a time from SQLite. A timed-out or interrupted external request fails without automatically repeating external actions. Expired processing leases are recovered after 90 seconds. Tasks and results persist across restarts.

## Optional Ollama model

Install Ollama and download a model that your machine can run using Ollama's own installation instructions. In the private `.env`, set:

```dotenv
OLLAMA_URL=http://127.0.0.1:11434
OLLAMA_MODEL=your-installed-model-name
```

Restart opennoir. In Connections choose Test connection, then Add AI agent. A task selected for that agent sends its text to your configured model service. Model URLs are controlled by the server administrator, not by arbitrary browser input. Only document summarization is wired; the small assistant still provides labeled scripted app guidance. Model costs are not invented when no rate is configured.

## Separate device test client

In Connections → Add device, keep Networked simulator checked. Copy the one-time device token into a private `device.env` file in the project directory:

```dotenv
OPENNOIR_URL=http://127.0.0.1:4180
DEVICE_TOKEN=the-token-you-just-created
```

Run:

```sh
npm run device:simulate
```

The separate process submits sample telemetry every three seconds and acknowledges read-only diagnostics. Request diagnostics from Connections. Stop it with Ctrl+C and the device becomes offline after 30 seconds. Revoke its connection to reject the token immediately. `.gitignore` excludes `*.env`.

Real hardware uses the same [device protocol](DEVICE-PROTOCOL.md) through a vendor-specific gateway. Do not run the simulator against a device registered as physical hardware. Authentication alone does not establish physical safety or manufacturer compatibility.

## Stripe test checkout

This release accepts **test keys only** and performs no live charge. Create/use your own Stripe account and test environment. Obtain the test API key and a webhook signing secret privately from Stripe. Do not paste them into chat or commit them.

```dotenv
STRIPE_SECRET_KEY=your-stripe-test-secret-key
STRIPE_WEBHOOK_SECRET=your-webhook-signing-secret
```

For local development, use the official Stripe CLI to forward events:

```sh
stripe listen --forward-to http://127.0.0.1:4180/api/payments/webhook
```

Use the signing secret from that listener, restart opennoir, then create a test service listing in Connections. Open it in Marketplace → Connected service store. Checkout goes to Stripe's hosted test page. A return to opennoir is not proof of payment: only a verified `checkout.session.completed` or `checkout.session.async_payment_succeeded` with paid status fulfills the matching session, amount and currency. Replay notifications do not duplicate fulfillment. Expired sessions and `charge.refunded` are handled; partial refunds conservatively revoke service access. Add a verified paid test order to My team to activate the service.

Use Stripe's test payment values, not real card details. Test failures, abandoned checkout, duplicate notifications, refunds and restarts before considering a live integration. Live mode, third-party seller onboarding, commissions and seller payouts remain disabled. Provider fees, taxes and profit are not inferred from test amounts.

## Docker

Copy `.env.example` to `.env` and set a private random `SETUP_TOKEN` of at least 24 characters before the first Docker launch. Enter that token in the initial setup form (container connections do not appear as host-loopback sockets). Then:

```sh
docker compose up --build
```

The service binds the published port to localhost and stores data in the `opennoir-data` named volume. Configuration comes from `.env`. Ollama running on the host is not container localhost; configure a host address supported by your Docker environment. Docker files are supplied; this environment's Docker daemon/build has not been validated.

## Remote hosting

Use a persistent VM/container with HTTPS termination. Configure `HOST=0.0.0.0`, the exact HTTPS `APP_URL`, a high-entropy `BETTER_AUTH_SECRET`, and a temporary high-entropy `SETUP_TOKEN` for first administrator creation. The setup form requests this token on remote installations. Remove it from the environment after setup. The generated fallback auth secret is stored privately in SQLite; always preserve it through backups.

Restrict the origin server so traffic arrives through your HTTPS proxy. Keep database files, device credentials, backups and `.env` out of public directories. Use a single process with a persistent volume, logging, resource limits and regular restore drills. A remote deployment still needs security review, operational monitoring and provider/hardware verification; Docker and authentication alone do not establish production readiness.

## Backup, restore and account recovery

`npm run backup` creates a consistent private SQLite backup, including WAL-visible changes. An optional output path is accepted after `--`. Restore with the server stopped: keep a copy of the existing entire data directory, replace the database using your chosen backup, and ensure obsolete WAL/SHM files are not mixed with the restored database. Preserve the auth secret. Do not publish or email backups casually; they contain account/session and screenshot data.

For forgotten passwords, stop the service and run `npm run account:reset -- user@example.com` from an interactive terminal on the installation host. The new password is hidden during input. Existing sessions for that account are removed. Email-based recovery is not configured.
