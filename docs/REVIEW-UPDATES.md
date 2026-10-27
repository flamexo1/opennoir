# Review changes — October 27, 2026

Implemented from the nine saved user comments (numbers 2–10). Each received an implementation reply and remains open for user review.

- Regular-weight deployment text/actions and resource-detail customer-deployment labels.
- Equal-height deployment cards and aligned action buttons, including confidential deployments.
- Consistent back buttons on Incidents and run/resource detail pages.
- Plain Incidents & maintenance heading.
- Status/priority filtering by dropdown and clickable badges; readable issue details/history.
- Guided scripted incident assistant replacing the manual resolution-note form. It simulates diagnostics and recovery, requires confirmation, and saves a generated resolution note through the existing API. No live AI or hardware repair is claimed.
- Card customization lives in Settings; new Settings symbol and local operator Profile page below it.
- Organization-wide feedback stays visible across page/customer context changes; All pages is the default. Drafts survive navigation/reload using local browser storage. Saved comments remain in SQLite.

Validation: 18 automated tests passed. Browser checks showed all nine open comments across pages and customer scope; a draft survived navigation and reload; three deployment cards had equal measured heights and identical action positions; regular text measured weight 400; assistant stages, run back navigation and profile routing worked. Operational incidents were not automatically resolved during UI verification.
