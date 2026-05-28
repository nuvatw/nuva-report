# Design Spec

## Design Read

Reading this as an interactive long-form report for stakeholders, with a calm premium white/blue brand language. The experience should feel like a comfortable reading room for operational knowledge, not a generic landing page and not a dense dashboard.

## Design Principles

- Quiet confidence: strong hierarchy, restrained motion, clear structure.
- Warm white/blue: off-white surfaces, soft blue tints, deep blue ink, neutral supporting grays.
- Utility over spectacle: interactions should help reading, not distract from it.
- Print parity: screen components need a print equivalent.
- Brand presence: the provided nuva logo appears intentionally on the hub and report cover.

## Visual System

- Background: warm white to soft blue, with a very light grid or paper texture.
- Primary ink: deep blue, near `#102a5f`.
- Accent: vivid but restrained blue, near `#2563eb`.
- Soft surface: `#f6f9ff`, `#edf4ff`, and white.
- Radius: 8px for cards and panels, pill radius only for compact filters or tags.
- Shadows: soft blue-tinted shadows only where elevation helps hierarchy.
- Typography: keep the current web font approach, with high-contrast heading scale and readable Chinese body copy.
- Imagery: use provided logo assets and existing report imagery where relevant. Do not invent a new mark.

## Information Architecture

- Hub first viewport: brand, purpose, current index health, search, and filters.
- Hub body: month timeline, report cards, visibility affordances for admin mode.
- Report first pages: cover, route/summary, reading flow, phase overview, week map, then deep chapters.
- Report persistent UI: reader search, section list, reading progress, and print/export actions.

## Components

- Layout shell: page width, responsive gutters, print-safe page boundaries.
- Section: heading, short intro, body, and optional source note.
- Card: report card, phase card, week card, route card.
- Metric: small factual count with label and supporting note.
- Table: scroll-safe on screen, unclipped in print.
- Figure: diagram or map with caption.
- Callout: short operational note, risk note, or next-step note.
- Citation/source note: visible link text, print-readable URL where practical.
- Nav: hub filters, reader TOC, reader search, section progress.
- Print fallback: hide fixed controls and show static content.

## Interaction

- Hover states lift or tint subtly, under 200ms.
- Active press states should feel tactile with a tiny scale or translate.
- Search opens from button or keyboard and returns focus predictably.
- Section nav highlights the visible section.
- Reading progress is passive and should not animate in print.
- Reduced motion disables entrance animation and smooth scrolling where possible.

## Accessibility

- Semantic headings remain in order.
- Links and buttons have visible focus states.
- Color contrast targets WCAG AA.
- Icon-only controls need accessible labels.
- Images use alt text, or empty alt only when decorative.
- Tables keep headings and do not rely on color alone.

## Print/PDF

- White background and dark text.
- Fixed action bars, nav, hover-only UI, and admin controls are hidden.
- Interactive details default open or are represented as static content.
- Tables use page-break handling and avoid clipped overflow.
- Headings avoid orphaning at page bottoms.
- Logo remains visible with the blue logo on white paper.

