# IH Report Builder

A single-file web app for building standardized **Industrial Hygiene** survey deliverables for Army National Guard maintenance facilities. Everything runs in the browser — no install and no backend to maintain. By default nothing leaves your machine; optionally, the whole team can share reports through one Google Sheet (see [Shared team store](#shared-team-store-google-sheet)).

## Features

Two tabs that share one Site Information panel:

1. **Hazards & Controls** — per-process inventory of chemical / physical / biological / ergonomic hazards and engineering / administrative / PPE controls (including PPE comment: MFG, model, NRR). Pick a site type (AASF, CSMS, FMS, MATES, UTES) and load its standard processes pre-filled from the example library.
2. **Program Review, Deficiencies & Recommendations** — the 19 standard OSHA / Army programs with CFR / DA-PAM references, typical program notes, deficiencies, recommendations, and color-coded RAC. Load the standard checklist, then edit.

Both tabs produce a clean, colored, landscape printout (Print / Save as PDF), and your work saves/loads as a single `.json` file. The browser auto-saves between sessions, and the **👥 Team** menu can save to / open from one shared Google Sheet so the whole team works from the same set of reports (see below).

## Use it

- **Live site:** https://USERNAME.github.io/ih-report-builder/  *(update after enabling GitHub Pages)*
- **Locally:** download `index.html` and double-click it.

## Shared team store (Google Sheet)

The **👥 Team** menu saves each report to one shared Google Sheet, so the whole team sees and opens the same reports. It works through a small **Google Apps Script web app** ([`apps-script-team-store.gs`](apps-script-team-store.gs)) that reads/writes the Sheet — the script runs as you (the owner), so teammates need **no Google setup of their own** and there's **no OAuth or app verification** to deal with.

**One-time setup** (full step-by-step is in the comments of `apps-script-team-store.gs`):

1. Create a Google Sheet at [sheet.new](https://sheet.new) — it holds the reports.
2. In that Sheet: **Extensions → Apps Script**, paste in the contents of `apps-script-team-store.gs`, and set `SHARED_KEY` to a long random string.
3. **Deploy → New deployment → Web app**, with **Execute as: Me** and **Who has access: Anyone**. Copy the **Web app URL** (ends in `/exec`).
4. In `index.html`, set `TEAM_API_URL` to that URL and `TEAM_KEY` to your `SHARED_KEY` (near the top of the `<script>`), then redeploy the site. *(To try it before editing the file, paste both into the app's **Team → Team settings…** dialog — they're saved in your browser and override the built-in values.)*

Then everyone uses **Save to Team**, **Save as new report…**, and **Open from Team…**. Each report is one row in the Sheet (`id`, `name`, `site`, `siteType`, `date`, `updated`, and the full report `json`); saving an opened report updates its row in place.

> **Security:** the store is reachable by anyone who has both the Web app URL **and** the shared key — and the key ships in the site's public JavaScript, so treat it as internal/low-sensitivity rather than secret. If it leaks, rotate it by changing `SHARED_KEY` in the script and `TEAM_KEY` in the site. For stronger access control, switch to per-user Google sign-in or restrict the web app to a Workspace domain.

## Develop

It's one self-contained file — `index.html` — with the data library embedded as a JSON object in the `const LIBRARY = {…}` line near the top of the `<script>` block. Edit in any text editor, refresh the browser to see changes.

```
ih-report-builder/
├── index.html                 # the entire app + embedded data library
└── apps-script-team-store.gs  # Google Apps Script backend for the shared team store
```

To regenerate or extend the embedded library (process taxonomies, program checklist, typical deficiencies/recommendations), edit the `LIBRARY` object directly, or rebuild it from the source spreadsheets/reports.

## Data sources

Process and hazard taxonomies were derived from TX ANG/ARNG IHA reports (AASF, CSMS, FMS, MATES, UTES) and the example "Tables and RACs" workbooks. The Program Review checklist and typical deficiency/recommendation language were derived from the example "Program Review, Deficiencies, Recommendations" workbooks.

## License

No license is set yet. Add one (e.g. MIT) via **Add file → Create new file → `LICENSE`** on GitHub if you want to allow reuse.
