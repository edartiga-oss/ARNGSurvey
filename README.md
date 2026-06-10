# IH Report Builder

A single-file web app for building standardized **Industrial Hygiene** survey deliverables for Army National Guard maintenance facilities. Everything runs in the browser — no install, no server, no data leaves the machine.

## Features

Two tabs that share one Site Information panel:

1. **Hazards & Controls** — per-process inventory of chemical / physical / biological / ergonomic hazards and engineering / administrative / PPE controls (including PPE comment: MFG, model, NRR). Pick a site type (AASF, CSMS, FMS, MATES, UTES) and load its standard processes pre-filled from the example library.
2. **Program Review, Deficiencies & Recommendations** — the 19 standard OSHA / Army programs with CFR / DA-PAM references, typical program notes, deficiencies, recommendations, and color-coded RAC. Load the standard checklist, then edit.

Both tabs produce a clean, colored, landscape printout (Print / Save as PDF), and your work saves/loads as a single `.json` file. The browser also auto-saves between sessions.

## Use it

- **Live site:** https://USERNAME.github.io/ih-report-builder/  *(update after enabling GitHub Pages)*
- **Locally:** download `index.html` and double-click it.

## Develop

It's one self-contained file — `index.html` — with the data library embedded as a JSON object in the `const LIBRARY = {…}` line near the top of the `<script>` block. Edit in any text editor, refresh the browser to see changes.

```
ih-report-builder/
└── index.html      # the entire app + embedded data library
```

To regenerate or extend the embedded library (process taxonomies, program checklist, typical deficiencies/recommendations), edit the `LIBRARY` object directly, or rebuild it from the source spreadsheets/reports.

## Data sources

Process and hazard taxonomies were derived from TX ANG/ARNG IHA reports (AASF, CSMS, FMS, MATES, UTES) and the example "Tables and RACs" workbooks. The Program Review checklist and typical deficiency/recommendation language were derived from the example "Program Review, Deficiencies, Recommendations" workbooks.

## License

No license is set yet. Add one (e.g. MIT) via **Add file → Create new file → `LICENSE`** on GitHub if you want to allow reuse.
