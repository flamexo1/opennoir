# Point-and-comment design review

The **Feedback** button is available at the bottom right on every page, including application dialogs.

1. Open Feedback and select **Point & comment**.
2. Click any element or blank area. In placement mode, clicking a button selects its location without triggering its normal action.
3. Type a comment and save. The server stores a numbered pin, route, customer context, target label, element selector and relative coordinates in the organization's SQLite document.
4. Use **This page** / **All pages**, replies, **Resolve** / **Reopen**, and the Resolved checkbox to review the list.
5. **Show pin** navigates to its page, scrolls to the target and temporarily uncovers/highlights it. Clicking the pin reopens its thread.
6. **Export comments** downloads a local JSON file with the comments and location metadata visible in the current customer scope.

Use **Page comment** for a keyboard-only note without selecting a mouse location. Escape cancels placement or closes review. All comment controls have accessible names; the editor uses native form fields.

This is a design-review layer, separate from support tickets and operational incidents. It does not send comments to an external service or automatically ask an AI to implement them. Tell your collaborator to review the saved feedback when ready. The local API's `/api/state` includes `feedback`, so local tools can read the same persisted comments.

## Scope and boundaries

Comments are saved per organization. A customer-scoped comment carries that customer ID; scoped reads omit unrelated and organization-wide notes, and scoped mutations validate ownership. These remain trusted-local-operator controls, not authentication. Data is included in the SQLite backup. No screenshots, credentials, browser histories or external page data are captured automatically. Target labels may include text from the selected UI element; avoid selecting sensitive text in production extensions.

Pins use best-effort DOM selectors and normalized element offsets. If an element is removed or a dialog is closed, the original page-relative coordinates are the fallback. Reopen a modal manually to inspect its original controls. Large layout/content changes can move anchors; the stored target label and route remain available as context. This is not a pixel-perfect screenshot annotation service or a real-time multi-user collaboration system.

## API commands

All use the current workspace revision like the other commands:

- `feedback.create`: `customerId` (or null), `route`, `anchor`, `target`, `body`, `x`, `y`, `offsetX`, `offsetY`. Positions must be finite numbers from 0 to 1; body up to 3,000 characters.
- `feedback.reply`: `id`, `body` (up to 3,000 characters).
- `feedback.update`: `id`, optional `body`, optional `status` (`open` or `resolved`).

Routes and selectors are validated; replies and status changes re-check customer ownership. There is no permanent-delete action. Current client presents replies and resolve/reopen; editing a saved body is available through the local command API.

## Review continuity update

The sidebar now defaults to **All pages** with explicit counts. Its organization-level review list comes from `GET /api/feedback` and intentionally remains visible when the trusted local operator changes customer context. This does not alter the customer-scoped operational `/api/state` response. The feedback command client uses organization context for review actions. This is an operator design-review feature, not a customer-facing portal or authorization boundary.

Unfinished comments are cached in this browser's localStorage per organization. Navigation, closing review, Escape and reload retain the draft. Save or explicitly Cancel to clear it; a new draft cannot silently replace a non-empty draft. A pending draft retains its original page and customer location. Browser cache/storage clearing can remove unsaved drafts; saved comments remain in SQLite.
