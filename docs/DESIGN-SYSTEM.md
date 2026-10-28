# opennoir design system — Foundation 1.0

## Intent
A calm, readable workspace for people managing robots and AI agents. Use clear page names, quiet surfaces, restrained status color, and consistent interaction patterns. Avoid marketing headlines inside utility screens.

## Source of truth
`public/design-system.css` defines the shared visual system. It loads after the existing feature/layout stylesheet. New visual changes belong in the shared tokens or component rules here; do not append competing visual patches to `styles.css`.

## Typography and writing
- Inter variable is bundled locally with its SIL Open Font License. The app needs no font CDN. Arial/sans-serif are fallbacks.
- Regular weight (400) throughout. Establish hierarchy through size, spacing, and color.
- Page title: 30/36px desktop, 27px compact. Section title: 17px. Card title: 19px. Body: 13–14px. Form labels/buttons: 12px. Metadata: 11px.
- Sentence case: uppercase the first letter, keep the remaining words lowercase unless they are proper names or acronyms. Examples: “My team”, “Help & support”, “Create work”, “AI agents”.
- Preserve the lowercase opennoir wordmark, user-provided names, IDs, model names, and AI/API/CSV/USD acronyms.
- `ui-text.js` formats system values for display without changing stored identifiers. Deployed → Working, ended → Completed, maintenance → Needs attention.
- Status meaning must appear in text, never through color alone.

## Foundation tokens
- Canvas `#f7f8fa`, surface `#ffffff`, subtle surface `#f1f3f6`.
- Main ink `#253145`, body `#536174`, supporting text `#6b7789`.
- Accent `#4769aa`; positive `#49715c`; warning `#936f36`; danger `#ad5057`.
- Spacing: 4, 8, 12, 16, 20, 24, 32, 40px.
- Radius: controls 8px, small components 12px, cards 16px, dialogs 20px.
- Controls: 40px default height. Visible keyboard focus ring: 2px with 3px offset.

## Shared components
- Primary action: dark ink fill. Secondary: white with border. Destructive: red-tinted surface with explicit text and existing confirmation flow.
- Navigation: left-aligned icon/label rows; active route uses a quiet blue surface. Small screens retain a compact labeled rail.
- All cards use the same border, radius, padding and title scale. Tables have sentence-case headers and scroll within their panel.
- Forms use shared input, dropdown, checkbox, label, helper and error styles. Dropdown chevrons have a consistent 12px inset.
- Dialogs use one header, separator, close control and action row.
- Feedback and the assistant use the same typeface, text scale, fields and controls as the workspace.
- Personalized home gradients remain user-controlled; all surrounding interface chrome follows this system.

## Responsive behavior
The navigation width is token-driven. The content width follows that token. Desktop cards collapse to two columns, then one on small screens. Robot map results sit to the right on wide screens and below the map on narrow screens. Tables retain internal horizontal scrolling. The assistant uses a compact mascot button in the sticky header at every screen size. No rail is shown while closed; chat opens only on request.

## Distribution and limitations
Fonts and UI assets are local, so downloads use the same visual resources on macOS, Windows and Linux. Font rasterization and native browser rendering can still differ slightly. This pass is verified in the available Chromium preview and compact viewport, not every browser/OS combination. Demo tracking, payments, assistant responses and execution retain their existing boundaries.
