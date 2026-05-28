# Infra and Build

## Package and Install

- Package manager: npm.
- Current dependency model: no declared runtime or dev dependencies.
- Install command for hosts that require it: `npm install`.
- Local work does not require install unless future dependencies are added.

## Build

```bash
npm run build
```

The build command runs `scripts/build-report-index.mjs`, injects shared report scripts when missing, and regenerates:

- `data/reports.json`
- `data/reports.js`

## Preview

```bash
npm run dev
```

The dev server builds the report index, serves the repository root, watches `reports/`, and starts at `127.0.0.1:4173` or the next free port.

## Deployment

The project is a static site. Required deployment files:

- `index.html`
- `login.html`
- `assets/`
- `data/`
- `reports/`
- logo assets at repository root unless moved and references are updated

Vercel is configured as:

```json
{
  "buildCommand": "npm run build",
  "installCommand": "npm install",
  "outputDirectory": "."
}
```

## Release Checks

Primary release command:

```bash
npm run release:check
```

Supporting checks:

```bash
npm run check:links
npm run check:visual
npm run audit:maintenance
```

## PDF Export Workflow

1. Run `npm run build`.
2. Start `npm run dev`.
3. Open the target report in Chrome.
4. Use Print, Save as PDF.
5. Confirm the cover logo is visible, fixed controls are hidden, tables are not clipped, and important content is present.

Future automation candidate: add a Playwright print check that loads the newest report, emulates print media, exports PDF, and validates that the PDF file exists and is above a minimum byte threshold.

## Risks

- Static visibility controls are not real access control.
- Generated report HTML is large, so generator changes should be careful and validated with build output.
- Data files change timestamps during builds.
- Browser print behavior can vary across Chrome, Safari, and system PDF printers.

