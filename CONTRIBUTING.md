# Contributing

1. Use Node 24+. No dependency install/build is needed.
2. Run `npm test` and `npm run check` before and after changing behavior.
3. Keep domain commands deterministic. Add meaningful lifecycle/scope tests for changes to `domain.js` and HTTP tests for route boundaries.
4. Verify UI workflows using the local server, including a narrow viewport and keyboard operation. Preserve labels, native dialogs, visible focus, status text and error announcements.
5. Keep connector behavior explicitly mock until a real adapter, credential policy and durable execution design are implemented and tested.
6. Never commit `data/`, `.env`, customer exports or credentials. Use fictional seed records.
7. For pull requests, explain the user problem, resulting behavior, validation and relevant limits. Avoid claiming production security or real device control based on mocked tests.

## Useful next contributions

Authentication and organization membership; normalized schema/migrations; durable outbox and per-attempt usage; validated adapter schemas; filtered/date-ranged reports; resource/customer editing and archival; pagination; stronger accessibility testing; provider/device sandbox adapters.

Source contributions use MIT; image assets keep their original Unsplash license.
