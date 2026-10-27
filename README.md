# opennoir

A local-first marketplace and management console for robots and AI agents. Community preview **v0.3.0**, MIT source license, no paid services required.

**Marketplace → My team → Work → Earnings.**

Start with the plain-language [information architecture](docs/INFORMATION-ARCHITECTURE.md). It explains every page, what a run is, why people/business connections exist, and how account IDs, resource IDs and order references differ.

## Run locally

Requires Node.js 24+ with built-in `node:sqlite` (may print an experimental warning). No package install or build is needed.

```sh
git clone https://github.com/flamexo1/opennoir.git
cd opennoir
npm start
```

Open http://127.0.0.1:4180. The server binds to loopback. Optional settings are in `.env.example`: `PORT` and `DATA_PATH`. Existing workspace documents and feedback are preserved; new fields are hydrated without clearing records. New installations seed fictional data.

```sh
npm run check
npm test
```

Tests use temporary/in-memory databases and an ephemeral local HTTP port, not the working demo database.

## Included

- Marketplace with robot/AI categories, company filters, simulated checkout, saved purchases and Add to My team.
- Original generated robot/agent images, interactive previews and customizable Home card gradients.
- My team with marketplace, custom AI, custom robot and ID/code pairing paths.
- Stable local opennoir IDs, public demo-profile lookup, connection preview and salted-hash pairing-code checks.
- Assignments with validated lifecycle and explicit end confirmation; Activity explains and records individual task attempts.
- Reports, incident history and guided scripted resolution, a separate assistant chat, local screenshot support cases, and permission-based local screen preview/capture.
- Settings, local account profile, in-app app guide and persistent point-and-comment design feedback.

## Try it

1. Browse Marketplace, confirm a simulated purchase, then Add to My team.
2. Open My team → Add to inspect custom registration or ID pairing.
3. Connect a demo person using `ON-P-AVERY001` in People & businesses.
4. Pair an external demo resource using `ON-R-HARBOR01` or `ON-A-MIRA0001`, code `DEMO-PAIR-2026`. Each external demo resource can be claimed once across the installation. Existing owned resources cannot be transferred by pairing again.
5. Create/activate an assignment and queue a run in Activity. Simulate completion or failure; inspect the saved result.
6. End an assignment only after reviewing the red confirmation. Open work prevents ending.
7. In Help & support, attach a screenshot and save a case. Screen capture requires a browser that supports it and explicit user selection/permission; upload is the fallback.
8. Leave feedback anywhere; All pages is the default and drafts survive navigation/reload.

## Data and boundaries

Real records and image attachments save in `data/opennoir.sqlite`. Stop the server before backing up the complete `data/` directory. To start fresh, move existing data to a backup location before restarting—do not delete operational data. Runtime data and `.env` are excluded from source ZIPs.

This is a **single trusted local-operator foundation**, not a production multi-user marketplace. No authentication, public sign-in, global identity service, live seller inventory, payments, billing, robot control, live AI or remote live support is connected. The assistant is scripted; screenshots are saved, not AI-analyzed. Marketplace brand-reference concepts are not official listings, partnerships or offers. Demo prices are illustrative. Local pairing-code hashing is not a complete device authentication protocol.

Uploads: PNG/JPEG/WebP only, three per case, 2 MB saved size each; larger supported files may be compressed locally. Stored images are not encrypted. There is no attachment deletion/retention UI yet. Screen preview is local and capture stores only a user-selected frame; it does not create a remote session.

See [security and trust model](docs/SECURITY.md), [API](docs/API.md), [architecture](docs/ARCHITECTURE.md), [adapters](docs/ADAPTERS.md), [feedback](docs/FEEDBACK.md), and [contribution guidance](CONTRIBUTING.md). Workspace JSON documents inside SQLite keep this release easy to inspect; normalization, migrations, pagination, durable background dispatch, idempotency and production identity enforcement remain future work.

## Source and attribution

`server.js`, `store.js`, `domain.js` and `platform.js` implement the backend. `public/app.js`, `public/feedback.js` and `public/styles.css` implement the buildless UI. Tests are in `test/`. No external CDN, font, API key, telemetry or paid dependency is required.

Application source: MIT. Unsplash images retain their separate license: [credits](docs/PHOTO-CREDITS.md). Generated concept imagery and prompts: [asset notes](docs/GENERATED-ASSETS.md). Tesla/NVIDIA are used as clearly labeled reference concepts, not affiliated sellers; source context: [Tesla robotics](https://www.tesla.com/SI), [NVIDIA robotics](https://www.nvidia.com/en-us/industries/robotics/).

The earlier static robot-ownership prototype is preserved separately. This edition needs its backend and is not a GitHub Pages static site. Publishing the source does not deploy a live app. This backend cannot run on GitHub Pages.

## Work and earnings preview

Main journey: Marketplace → My team → Work → Earnings. Browse and compare demo products, review checkout, add purchases, explore capability-matched opportunities, and track modeled economics with simulated payouts. See docs/INFORMATION-ARCHITECTURE.md for the complete guide and demo boundaries.
