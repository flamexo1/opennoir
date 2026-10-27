# Validation record

Validated locally on October 26, 2026 with Node 24.

## Automated checks

`npm run check` passed for the server, domain logic and browser application.

`npm test`: **12 passed, 0 failed**.

Coverage includes:

- Deployment reservation, activation, successful work and resource release.
- Robot failure → maintenance → blocked retry → resolution → explicit activation → retry.
- Agent failures and retry without robot maintenance.
- Duplicate open runs, invalid transitions and deployment locking.
- Customer-scoped reads and rejected cross-customer deployment/run/incident/ticket operations.
- Capability, resource availability and customer validation.
- SQLite reopen persistence, stale revision rejection and failed-command rollback.
- Separate support ticket resolution.
- Unresolved maintenance remains in force when a paused deployment ends.
- Organization settings persist independently in the selected workspace.
- HTTP static/API responses, JSON errors, missing workspace, wrong Origin, wrong Host and source-file boundary.

## Browser walkthrough

- Created “Afternoon inventory service” for Scout / Forma Retail.
- Activated it; queued and started “Afternoon safety inspection”.
- Simulated failure; inspected failed run timeline and generated maintenance incident.
- Resolved maintenance with a note, explicitly reactivated deployment, retried and completed attempt two.
- Confirmed $9 recorded execution cost, $24 modeled service value and 24 items; total cost rose from $18 to $27.
- Created/resolved a Forma support ticket. Switched to Northline context and verified the ticket was absent.
- Saved organization settings and inspected Reports.
- Restarted the server and confirmed saved records survived.
- Checked responsive widths 390 and 1440 pixels. After overflow corrections, document width equaled viewport width in both cases. Wide tables scroll inside their panels.
- Native controls, dialog focus behavior, accessible labels and skip-link behavior are implemented. This is not a full screen-reader or accessibility-conformance audit.

## Packaging

Runtime data, environment overrides and SQLite files are excluded. The ZIP contains editable source, MIT license, separate image attribution, tests and documentation. Fresh installations seed two sample organizations. The earlier browser-only prototype remains in its original separate folder.

## Limits

Tests exercise local API/data logic and mock outcomes. They do not certify live AI providers, hardware safety, production security, hosted multi-tenant authorization, throughput, browser compatibility on every device, or disaster recovery.

## Feedback feature verification (October 27, 2026)

Automated suite now has **17 passing tests**, including persisted feedback commands, replies, resolution, customer boundaries and invalid-position/selector rejection. Browser checks verified that clicking Add customer in placement mode created a note without opening its dialog; the saved note survived reload; Show pin uncovered the target; a reply and resolved status saved correctly; annotation selection also worked inside an application dialog. A verification-only example was left resolved in the local runtime, excluded from the source ZIP.

## Marketplace-led v0.2 validation

23 automated tests pass, including simulated purchase/add-once behavior, stable IDs and connection lookup, salted-code pairing/reuse rejection, private-code omission from state, scripted assistant storage, PNG upload/retrieval, attachment ownership rejection, and invalid image-signature rejection. Browser testing completed reference-listing purchase → saved order → resource details, ID lookup → profile preview → connection, Add menu choices, and screenshot preview → local upload → saved support case. The red end-assignment confirmation was inspected without ending the existing service. The browser's real screen-sharing permission flow is implemented but not granted/exercised by the agent; availability depends on browser/OS support.

Final v0.2 suite: **24 tests passed**. Added annotation coverage for Marketplace, Assistant, My account and the app guide. Marketplace and support were checked at 390 pixels with document width equal to viewport width. Existing feedback and records survived migration/restart. Browser verification added one simulated purchase/resource, an Avery connection and a paired Harbor demo resource; a verification-only screenshot case was resolved after checking retrieval.

## 0.3.0 Work and earnings
27 automated checks pass, including capability matching, occupied team members, customer boundary rejection, payout fee math, repeated withdrawal rejection, payment-method validation and read-state persistence. Browser review covered opportunity confirmation, ongoing cards, confidential preview blocking, earnings calculations and review-to-demo-checkout. Existing feedback remains visible. No live screen-sharing permission or external payment/AI/device integration was exercised.
