# Reconciliation workspace

Keep the master palette, typography and navigation. The results ledger is the first content panel below the page heading; never put a long evidence inspector before the list.

Initial state has no bank records or matches. The main action is **Đồng bộ & đối soát**, a cancellable mock sync which atomically saves a transaction snapshot, sync time and matched invoice IDs. Repeated sync replaces the snapshot and never appends duplicates. Reset removes it. Restore old version-1 workspaces without bank snapshots with zero bank matches while preserving invoices, drafts and conversations.

Show counts and matched value in a compact row inside the results panel. Use columns for bank transaction, invoice/customer, bank credit, invoice gross amount, signed difference, result and a detail affordance. Every row opens evidence; a named button provides the keyboard equivalent. Keep the table horizontally scrollable in a named focusable region on small viewports.

Evidence opens in a wide dialog (up to 1180 px): a verdict and identities/amounts at the top, then bank receipt and invoice fields side by side; stack on phones. Provide a scan/document tab, raw normalized bank record disclosure and full invoice disclosure. Do not nest dialogs. Keep the shared focus trap, focus restoration, Escape, presentation lock and persistent banner.

A match requires the fixture association, invoice number, payer tax ID matching the invoice buyer, beneficiary tax ID matching the invoice seller, identical gross amount and approved invoice. Bank tax IDs are enriched from the fictional partner profile; do not imply banks always supply them in statements. Matched fixtures have zero difference; An Nhiên has 20,000,000 vs 20,350,000 and Không gian Lá has 45,000,000 vs 49,500,000. Signed difference means bank credit minus invoice gross amount.

The fifth presentation case syncs an empty ledger, opens the newly saved 22,000,000 invoice match, expands its source invoice, closes it, opens An Nhiên's -350,000 discrepancy and returns to the results list. All actions use actual UI handlers and abort with stop/reset/Escape.
