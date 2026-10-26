# Visualize Tax — design decisions

## Subject and audience

A Vietnamese tax workspace for a fictional small business. The portfolio demonstrates a connected document workflow: receive → inspect → approve → reconcile → draft. This is a product workspace, not a marketing site.

## Direction

Quiet, clear and human. Use ledger-like alignment for amounts, a soft teal action color, generous content spacing and a document illustration built in CSS. Keep real content and actions prominent. All dates in seeded scenarios belong to the explicitly labeled October 2026 demo period.

The skill's generated recommendations matched an enterprise marketing gateway rather than this workspace, including after a narrower query. They were not persisted or adopted. The choices below are manual design guidance grounded in this brief; use the skill's verified accessibility/stack guidance where relevant.

## Tokens

| Token          | Value     | Purpose                         |
| -------------- | --------- | ------------------------------- |
| Canvas         | `#F7F9FB` | Cool, quiet workspace           |
| Surface        | `#FFFFFF` | Panels, navigation, dialogs     |
| Ink            | `#233449` | Headings, main values           |
| Primary        | `#0C7E73` | Main actions, active navigation |
| Primary soft   | `#EAF6F2` | Active state backgrounds        |
| Warning canvas | `#FFF5DD` | Persistent recreation notice    |

Font: self-hosted **Be Vietnam Pro**, including Vietnamese subsets. Use tabular numerals for financial values. Use one icon family (Lucide). Avoid remote font requests at build or runtime.

## Layout

```text
┌──────────────────── recreation notice / reset / presentation ────────────────────┐
│ Navigation  │ Breadcrumb                                             Search     │
│             ├───────────────────────────────────────────────────────────────────┤
│ Overview    │ Greeting + export                                                │
│ Assistant   │ Workflow introduction / document illustration                    │
│ Invoices    │ Revenue / invoices / reconciled transactions / drafts             │
│ Reconcile   │ Cash flow chart                       Next actions                │
│ Drafts      │ Recent invoices                                                   │
└─────────────┴───────────────────────────────────────────────────────────────────┘
```

Left-align text and labels. Right-align amounts. On smaller screens use a navigation drawer, two-column metrics and single-column panels. Tables scroll inside their panels, never force the page width.

## Motion and interaction

- GSAP `useGSAP` owns the scoped dashboard entrance and chart trace; cleanup on unmount.
- Reduced motion shows final content immediately. No autoplay carousel or decorative perpetual movement.
- Use CSS transitions for hover/focus, dialog entry and confirmation.
- The presentation uses actual DOM controls and cancellable navigation, with a visible step explanation.
- Keep the warning banner reachable above dialogs, and keep stop/Escape available while the shell is inert.

## Content

No real tax advice, regulatory claims, taxpayer information or external service branding. Every generated draft contains the demo disclaimer in both screen and print views. Exports carry a demo label.
