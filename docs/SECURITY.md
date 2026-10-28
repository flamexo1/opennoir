# Security and deployment boundaries

v0.5.0 enables Better Auth password accounts and signed sessions by default. HTTP APIs require a valid session and membership in the selected workspace. Mutations reject viewer accounts; connection enrollment, invitations, setup and purchases require an owner. Cross-origin requests are rejected. Auth cookies are secure on HTTPS origins. Client IP for auth limiting is overwritten from the socket rather than trusted from client-supplied forwarded headers.

The first administrator can claim the preserved workspaces through local setup. Remote first-run setup requires an installation token from the server environment. Subsequent registrations require an expiring, single-use, email-matched invitation. Direct public signup endpoints are blocked. There is no automatic email verification or email recovery; invitation links must be shared through a trusted channel. Offline password recovery requires host/database access and revokes the account's sessions.

Secrets are never returned in connection status. Device bearer tokens are shown only once and retained as hashes. Private environment files, runtime databases, dependency directories and backups are excluded from source archives. The CLI uses a restrictive umask for new runtime files. Backups contain account/session information and must remain private.

Device APIs authenticate their own token and cannot choose another workspace. Telemetry sequences prevent replay. Only read-only diagnostics are supported; device clients deduplicate command IDs. Reported coordinates and self-declared device identity are not independently verified. Simulator output is not physical-device validation.

Stripe uses its official SDK, test keys only, server-defined prices and signed raw-body webhooks. Order/session/amount/currency checks precede fulfillment; event IDs and order activation are idempotent. Refunds revoke activated service access. Live payments, tax handling and third-party payouts are not enabled. Fixture verification does not establish an actual provider account connection.

Ollama URLs/models are administrator-controlled environment settings. The browser cannot supply arbitrary upstream URLs. Document tasks have bounded input, a timeout, saved results, explicit retries and persisted processing leases. The built-in processor is deterministic. The small assistant remains labeled scripted guidance. All user text/output is HTML-escaped in the interface.

This is a single-process self-hosted preview, not an independently audited enterprise or robotics safety system. SQLite is not encrypted at rest. Add disk/volume encryption, HTTPS, proxy restrictions, operational monitoring, restore drills and a security review for a public service. Workspace data remains document-based while runtime accounts/jobs/devices/orders use normalized tables. Multi-replica operation, global identity federation and granular per-record NDA permissions are not implemented. Confidential UI masking is not a separate access-control tier within a workspace.

The exported `createApp({authRequired:false})` option exists only for isolated compatibility tests. The command-line server does not expose an environment switch to disable account protection. Do not use that constructor override in a deployment.
