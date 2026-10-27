# Trust model

This release is for one trusted operator on localhost. There are **no login, sessions, organization memberships or roles**. Anyone who can access the local HTTP endpoint can read/select either seeded workspace. Workspace/customer selectors are not security identities. Do not market this as secure multi-tenancy.

Implemented safeguards: loopback binding, allowed localhost Host header, same-origin checks, no CORS, JSON-only mutations, 32 KiB request limit, HTML escaping for user content, content security policy, static-file path boundary, SQLite transactions, optimistic revision conflicts, object/customer ownership validation and no external network calls from adapters. These safeguards do not replace authentication. The CSP allows inline styles for meter widths; scripts must be local external files.

Before shared/public deployment, implement authenticated identity with server-side membership checks, scoped authorization on every route (including workspace listing), TLS, CSRF/session handling, rate limits, audit identity, backups, database encryption where appropriate, input/result schemas, dependency/runtime updates, secret management, signed connector callbacks and operational monitoring. A reverse proxy alone is insufficient without route authorization.

UI confidentiality masks deployment names/capabilities only. Data is retained in plaintext SQLite/API. Do not store production customer secrets. Contact references are arbitrary local strings and are never sent. Customer-scoped views exclude unrelated records; this is tested data scoping, not a proof of authorization security.

No vulnerability submission endpoint is configured. For a future public repository, report sensitive issues privately to its verified maintainer rather than posting secrets or exploit details in a public issue. Add a real security contact before public release.

## v0.2 local identity and upload additions

The directory is local to this database. Person/business profiles are intentionally searchable by public ID by the trusted local operator. Pairing codes use random salts with scrypt and constant-time comparison; resource claiming is transactional. This is not public user authentication, a complete device credential protocol, account recovery, ownership verification or cross-installation federation. Demo pairing credentials are published examples and must not be treated as production secrets.

Image uploads accept only PNG/JPEG/WebP, have a 2 MB decoded size limit and are checked against their signatures. Ticket attachment references and image reads are workspace-scoped. Files are BLOBs in SQLite, not executable static files. There is no malware scanning, full image-decoder validation, encryption, quota/retention system or deletion UI. Browser screenshots may contain private information: the user chooses and previews them before submitting locally. getDisplayMedia is user-triggered, video-only, previewed locally and stopped when the capture dialog closes. It does not establish remote live support. No screen-sharing permission was granted automatically during testing.
