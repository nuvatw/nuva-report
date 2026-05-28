# PRD

## Product Read

This project is a static report hub for nuva reports. The primary output is a polished browser reading experience that can also be saved cleanly to PDF. The current stack is static HTML, CSS, JavaScript, and Node build scripts. That stack can meet the quality bar without migrating to a heavier framework.

## Audit

- Audience: clients, internal operators, course stakeholders, and future collaborators reviewing reports on screen or as PDFs.
- Current strengths: static deployment, metadata indexing, searchable timeline, per-report actions, reader sidebar, private report affordances, release checks, and screenshot checks.
- Current gaps: visual tone is inconsistent, logo assets are not consistently used, long reports need stronger wayfinding, print rules need to be treated as product behavior, and the newest n8n report needs a warmer premium shell.
- Assets: `blue_logo_nuva.png`, `white-nuva-logo.png`, `assets/favicon.svg`, and report-specific imagery under `assets/reports/`.
- Package manager: npm. No lockfile or dependency tree is required today.
- Deploy assumption: static export from repository root, supported by `vercel.json` with `outputDirectory: "."`.

## Brand Rules

- Always write `nuva` lowercase in visible UI and docs.
- Do not bold `nuva`.
- Use provided blue and white logo PNGs. Do not draw or invent a logo.
- Tone: white, soft blue, deep blue, neutral, warm, calm, premium, comfortable.
- Avoid gimmicks, heavy glassmorphism, random decoration, fake precision, and unsupported business facts.

## Goals

1. Make the report hub and the newest generated n8n report feel premium on screen.
2. Preserve current report content and metadata.
3. Improve scanability with stronger headings, summary cards, captions, labels, tables, and navigation.
4. Keep interactivity useful: search, section navigation, reading progress, hover/focus states, and keyboard support.
5. Make print/PDF output complete, readable, and unclipped.
6. Keep the static deployment path simple and maintainable.

## Non Goals

- Do not migrate to Next.js unless static HTML can no longer meet requirements.
- Do not introduce unsupported business claims or new facts.
- Do not replace existing report content with marketing copy.
- Do not add server-side auth. Current visibility controls remain a static convenience, not a security system.

## Success Criteria

- The hub uses the provided nuva logo and a premium white/blue visual language.
- The newest report has a clear cover, table of contents, reusable report components, improved tables, and print-aware structure.
- Navigation, search, and progress remain keyboard usable.
- `prefers-reduced-motion` and print media simplify motion and interactive surfaces.
- `npm run build`, `npm run verify`, `npm run check:links`, `npm run audit:maintenance`, and `npm run check:visual` pass or documented blockers explain why.
- PDF export workflow is documented and practical.

