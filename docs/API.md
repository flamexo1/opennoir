# Local API v0.1

Base: `http://127.0.0.1:4180/api`.

All requests operate as the local trusted operator. No authentication is implemented. `X-Workspace-Id` selects `northstar` (default) or `sandbox`; it is not a security credential. Optional `?customer=<customer-id>` narrows reads and mutations. IDs must belong to the selected workspace and customer context.

## Routes

| Method | Route | Result |
|---|---|---|
| GET | `/workspaces` | Organization IDs and display names |
| GET | `/connectors` | Available connector descriptions (`mock` only) |
| GET | `/state` | Workspace document and revision; optionally customer-scoped |
| POST | `/commands` | Execute validated command, return `{result: record}` |

POST requires `Content-Type: application/json`, a maximum 32 KiB body, and an exact integer `revision` from the latest state response. Refresh state after a successful command. Cross-origin browser requests are rejected. No CORS headers are enabled.

## Example

```sh
curl http://127.0.0.1:4180/api/state -H 'X-Workspace-Id: northstar'
```

A fresh database starts at revision 0. To create a draft:

```sh
curl http://127.0.0.1:4180/api/commands \
  -H 'Content-Type: application/json' \
  -H 'X-Workspace-Id: northstar' \
  -d '{"action":"deployment.create","revision":0,"name":"Inventory service","customerId":"forma","resourceId":"scout","capability":"inspection","confidential":false}'
```

Do not reuse revision 0 after writing; fetch `/state` again. A failed command leaves the revision unchanged.

## Commands

Every payload includes `action` and `revision` plus the following fields:

| Action | Fields |
|---|---|
| `customer.create` | `name`, `type` (`Business` / `Individual`), `contact` |
| `resource.create` | `name`, `type` (`agent` / `robot`), `model`, `capabilities` (non-empty array) |
| `deployment.create` | `name`, `customerId`, `resourceId`, `capability`, optional `confidential` boolean |
| `deployment.transition` | `id`, `status` (`active`, `paused`, `ended`) |
| `run.create` | `name`, `deploymentId` |
| `run.transition` | `id`, `status` (`running`, `succeeded`, `failed`, `cancelled`, `retry`) |
| `incident.resolve` | `id`, required `note` (up to 500 characters) |
| `ticket.create` | `customerId`, `title`, `body` (up to 2,000 characters) |
| `ticket.resolve` | `id`, required `note` |
| `settings.update` | `notifications` boolean; optional `name`, `workspace`, `region` strings |

Supported capabilities: `analysis`, `support`, `classification`, `inspection`, `fulfillment`. Resource registration uses only the mock connector. Customer/resource creation and settings changes require the all-customer context. A selected customer cannot submit another customer ID or operate another customer's object ID.

## Response errors

`{ "error": "Human-readable message" }` with HTTP 400 (invalid command), 403 (context/origin/host boundary), 404 (missing or out-of-scope object), 409 (invalid lifecycle, duplicate open run, or stale revision), 413 (body limit), 415 (non-JSON), 500 (unexpected server failure).

Do not automatically retry 409 mutations; refresh state and review. Failed lookup messages intentionally do not reveal which other customer owns a record. API lacks idempotency keys, pagination, date-range queries, webhooks, credentials, membership authorization and version negotiation. It is a foundation contract, not an external public integration API.

### Card appearance

`appearance.update` requires all four `cards` keys: `reports`, `resources`, `deployments`, `support`. Each contains `image` (`earnings`, `fleet`, `market`, `support`), numeric `overlay` (0–85 percent), `saturation` (0–150 percent), `hue` (0–360 degrees), `blur` (0–10 pixels). Requires current `revision` and all-customers context. Values are validated before storage; image paths/URLs cannot be supplied.

Custom gradients additionally use `mode: "gradient"`, `colors` (three six-digit hex colors), `shape` (`linear` or `radial`), and `angle` (0–360). Image backgrounds remain supported for existing settings. Colors and direction are validated before storage.

## Marketplace, local identities, assistant and screenshots (v0.2)

- `GET /catalog`: demo/reference listings. Not live vendor inventory or pricing.
- `GET /directory/:publicId`: a public local demo profile (name/type/resource metadata only). No pairing hashes or codes are returned.
- `POST /commands` adds `marketplace.purchase {productId}`, `purchase.add {id}`, `customer.connect {publicId}`, `resource.pair {publicId,pairingCode}`, and `assistant.message {body}`. All retain workspace revision checks. Purchases/resource additions/ID connections require the full-workspace context. A simulated order and its resource are separate persisted records; each order can be added once.
- `resource.create` now returns a stable opennoir ID plus a generated registration pairing code once. The code is not stored in the workspace document. The private directory stores a salted scrypt hash. Existing owned resources are not transferable by pairing again. The seeded external demo resources use DEMO-PAIR-2026 and can be claimed once across the installation.
- `POST /attachments`: JSON `{name,mime,data}` with base64 PNG/JPEG/WebP bytes, maximum 2 MB decoded. The server checks the declared image type against its signature. Stored BLOBs are associated with the request's workspace and excluded from source ZIPs.
- `GET /attachments/:id`: image bytes for the selected workspace. Image elements may specify `?workspace=<id>`; this is a context selector, not authentication.
- `ticket.create` accepts optional `customerId` (null for workspace support) and up to three `attachments` IDs, each checked against the workspace. This does not send a ticket externally.
- `assistant.message` appends user/scripted-response pairs locally (latest 100 messages); it performs no model inference.

Public IDs identify local records; order references identify demo orders. Neither is an authentication credential or payment authorization. Public account sign-in, cross-installation lookup and global ID resolution are not implemented.
