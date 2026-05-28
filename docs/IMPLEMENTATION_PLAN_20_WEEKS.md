# Implementation Plan: 20 Weeks

This roadmap is strategic. The current implementation should ship the strongest complete static version now, then use later weeks for refinement and scale.

| Week | Focus | Outcome |
| --- | --- | --- |
| 01 | Audit and product definition | PRD, design spec, tech spec, infrastructure notes, progress log. |
| 02 | Brand system | nuva logo usage, white/blue tokens, typography scale, print-safe colors. |
| 03 | Hub IA | Stronger masthead, search, filters, report cards, empty states, admin clarity. |
| 04 | Report shell | Cover, summary, TOC, reusable section/card/table/callout components. |
| 05 | Reader navigation | Section nav, progress, keyboard search, active section states. |
| 06 | Motion and reduced motion | Purposeful hover/focus/entry motion with `prefers-reduced-motion`. |
| 07 | Print foundation | Print CSS, page breaks, table handling, static fallbacks. |
| 08 | PDF workflow | Manual PDF checklist, first automated export spike. |
| 09 | Accessibility pass | Heading order, focus, contrast, labels, alt text, keyboard tests. |
| 10 | Content scanability | Summaries, captions, better labels, and explicit missing-fact markers. |
| 11 | Report template update | Bring new components into `templates/report-template.html`. |
| 12 | Existing report migration | Apply shared shell improvements to older reports carefully. |
| 13 | Visual regression | Screenshot baselines for hub and key reports. |
| 14 | PDF regression | Automated print media and PDF file checks. |
| 15 | Performance cleanup | Remove dead CSS, optimize fixed UI, keep static path light. |
| 16 | Metadata quality | Stronger report metadata checks, thumbnails/PDF fields. |
| 17 | Maintenance UX | Admin mode clarity, safer visibility copy, handoff notes. |
| 18 | Deployment polish | Vercel/static host docs, cache assumptions, release checklist. |
| 19 | Content governance | Editorial checklist, brand casing checks, supported-fact policy. |
| 20 | Launch readiness | Full release run, PDF QA, accessibility review, final sign-off notes. |

## Current Sprint Scope

- Keep static architecture.
- Upgrade hub and newest generated report.
- Add reader progress and print-aware polish.
- Document PDF workflow.
- Run current validation commands.
