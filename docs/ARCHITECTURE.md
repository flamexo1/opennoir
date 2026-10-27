# Architecture and decisions

## Request flow

Browser UI → same-origin Node HTTP API → Store transaction → domain command → mock adapter (on explicit completion) → SQLite commit → UI fetches current view.

The application uses Node 24 built-ins only. This was chosen to keep local setup free and manageable, retain the existing HTML/CSS/JS design, and avoid a frontend build, paid database, external AI provider, or framework installation.

## Entities

Each workspace row contains an `id`, JSON `document`, and monotonic `revision`. Documents contain:

- Customers: individual/business identity, contact reference and service-plan label.
- Resources: agent/robot type, capabilities, model, health, status, reference rate and mock connector ID.
- Deployments: customer-resource binding, capability, status, privacy flag and creation timestamp.
- Runs: deployment/resource/customer IDs, status, current attempt count, units, cost, modeled service value and event timeline.
- Incidents: execution/maintenance kind, customer (nullable for unassigned resources), resource, severity, state and resolution events.
- Support tickets: customer, issue title/body, state and resolution events.
- Workspace settings and bounded operational audit events.

IDs are validated inside the selected workspace, never searched globally. A customer-scoped view includes their deployments and related resources, runs, incidents and tickets; workspace audit events are omitted. Mutations recheck object ownership. A workspace selector is intentionally not tenant authorization.

## State machines

Deployments: `draft → active → paused → active`; any draft/active/paused deployment may end when no queued/running work exists. Draft creation immediately reserves an available compatible resource. End releases it. Exactly one non-ended binding is possible because reserved/deployed resources cannot be selected again.

Runs: `queued → running → succeeded | failed`; queued/running may be cancelled. A failed run may retry to queued if its deployment is active and its resource deployed. A resource may have only one queued/running run. Terminal success/cancel is not reversible.

Robot failure: failed run → open maintenance incident → resource maintenance + health 42 → deployment paused. Resolution restores health and reserved status; operator must activate before retrying. Agent failure creates an execution incident and leaves deployment active, allowing explicit retry.

Support tickets: `open → resolved`, with a required resolution note. They never directly change robot or deployment state.

## Consistency

Writes use `BEGIN IMMEDIATE`. Domain logic changes an in-memory document; only successful commands persist it and increment revision. Any exception rolls back. Every command requires the exact revision most recently read; conflicts return 409 and the UI refreshes. This prevents stale-tab overwrites. It is not request idempotency: integrations need persistent idempotency keys before remote side effects.

## Explicit tradeoffs

- Synchronous adapter execution is deterministic and local. Never insert network calls inside this database transaction in a production connector.
- No authentication, roles or user membership. Loopback-only trusted operator scope.
- No server-side polling, scheduler, webhook ingestion, durable external queue or automatic recovery.
- JSON documents simplify the initial slice, but whole-workspace reads/writes need normalization and pagination at scale.
- Current attempt status is retained on a retry; prior failure details remain in the event history. Costs of failed mock attempts are zero.
- Seeded customer and organization names are fictional. The design concept is independently branded.

## Marketplace and local identity extension

`platform.js` owns the illustrative catalog, stable local public-ID derivation, document hydration and scripted assistant answers. SQLite now also stores `directory` and `attachments` tables. The directory holds public profile JSON, private pairing-code salts/hashes and claimed-workspace ownership. Attachments are workspace-scoped image BLOBs. Hydration adds missing IDs/collections to old documents without resetting feedback or operational history; persisted writes retain the existing document transaction/revision path. Directory claim changes and resource creation commit or roll back together.

Marketplace purchases are simulated order records. Adding a purchased item creates a separate resource and marks the order added; repeats are rejected. Browser screen preview/capture is a local user-permission flow, independent of the mock execution connector. Screenshot uploads use a dedicated bounded upload route, while ticket creation validates attachment ownership through Store services.
