# Assistant workspace

Retain the master palette, font and global navigation. This page is a product workbench for turning scattered documents into understandable business data.

```text
persistent recreation banner / feature explanation / reset / presentation
workspace navigation and breadcrumb
┌──────────────────────────────────────────────────────────────────────┐
│ Assistant title                                      Demo status     │
├───────────────────────────────────────────────────────┬──────────────┤
│ Conversation (the only scrolling region)              │ Context      │
│ • invoice image and extracted information              │ Approved     │
│ • chart and inspectable data table                     │ revenue      │
│ • draft declaration cards                             │ Documents    │
├───────────────────────────────────────────────────────┤ and drafts   │
│ suggested next actions                                │              │
│ attachment / multiline composer / Ctrl + Enter         │              │
└───────────────────────────────────────────────────────┴──────────────┘
```

The page fills the available viewport below the global banner and topbar. Remove the workspace footer here. The composer stays at the bottom in both empty and populated conversations; the welcome panel can scroll on short mobile viewports. Hide the context rail on mobile. Give structured results more visual weight than plain text: invoice inspection, bar chart, downloadable/printable draft previews. Amounts use tabular numerals.

Cap the main chat workspace at 1468px and center it within the conversation grid column, keeping the context rail in its own column. Messages and the composer share a centered 850px reading width, so long conversations remain aligned and readable on ultrawide screens. The presentation button is the banner's primary action: solid teal with white text and a restrained shadow; hover feedback must not change banner height.

Presentation uses a clearly visible virtual pointer over an inert application. Move it to real controls, highlight the target, show click feedback, type through native input events, and dispatch the same shortcuts users can invoke. It is browser-local simulation; never claim OS-level mouse control. Keep stop/Escape and reset reachable. Clamp the cursor caption within the viewport and respect reduced motion.

The four cases are invoice extraction/save, a revenue answer with chart, 01/GTGT, and 02/CNKD. Persist structured results in the same versioned browser store as ordinary chat. Do not persist file contents or add real OCR/AI/tax integrations.

Feature explanation must distinguish the business goal (capture, organize, reconcile, query, understand tax, prepare forms) from the demo's actual scope. References to POS, payment channels or tax regulations describe goals and explicitly say those systems are not connected in this build.
