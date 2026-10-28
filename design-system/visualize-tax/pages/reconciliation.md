# Reconciliation workspace

Keep the master palette, typography and navigation. The results ledger is the first content panel below the page heading; never put a long evidence inspector before the list.

Initial state has no bank records or matches. The main action is **Đồng bộ & đối soát**, a cancellable mock sync which atomically saves a transaction snapshot, sync time and matched invoice IDs. Repeated sync replaces the snapshot and never appends duplicates. Reset removes it. Restore old version-1 workspaces without bank snapshots with zero bank matches while preserving invoices, drafts and conversations.

Show counts and matched value in a compact row inside the results panel. Use columns for bank transaction, invoice/customer, bank credit, invoice gross amount, signed difference, result and a detail affordance. Every row opens evidence; a named button provides the keyboard equivalent. Keep the table horizontally scrollable in a named focusable region on small viewports.

Evidence opens in a wide dialog (up to 1180 px): a verdict and identities/amounts at the top, then bank receipt and invoice fields side by side; stack on phones. Provide a scan/document tab, raw normalized bank record disclosure and full invoice disclosure. Do not nest dialogs. Keep the shared focus trap, focus restoration, Escape, presentation lock and persistent banner.

A match requires the fixture association, invoice number, payer tax ID matching the invoice buyer, beneficiary tax ID matching the invoice seller, identical gross amount and approved invoice. Bank tax IDs are enriched from the fictional partner profile; do not imply banks always supply them in statements. Matched fixtures have zero difference; An Nhiên has 20,000,000 vs 20,350,000 and Không gian Lá has 45,000,000 vs 49,500,000. Signed difference means bank credit minus invoice gross amount.

The independent reconciliation presentation has three steps: sync an empty ledger using six seed invoices, inspect Studio Sáng’s 26,400,000 match and source invoice, then inspect An Nhiên’s -350,000 discrepancy. It does not run the assistant or create new invoices/declarations. The picker explains the workflow and the reset-to-seed behavior. Progress uses 3 steps here and 4 in the assistant scenario. All actions use actual UI handlers and abort with stop/reset/Escape.

While syncing, show a prominent spinner, an indeterminate loading track and a short process explanation. Expose busy state on the button and results region, prevent repeated submissions and disable filters/table interactions. Reduced motion keeps the loading state readable without an animated track; never present fabricated numeric completion.
