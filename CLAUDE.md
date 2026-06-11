# Project notes for Claude Code

## Workflow
- When a change is ready, push it to the working branch and open a pull request, then
  **mark the PR ready for review and merge it without asking for confirmation** — the
  user has given standing approval for this. Prefer **squash** merges.
- After merging, sync local to the updated `main`.

## App / deployment
- `index.html` is the whole app (single file) and is what's deployed to GitHub Pages.
- It contains the **live `TEAM_API_URL` and `TEAM_KEY`** for the shared team store near
  the top of the `<script>`. **Never blank or overwrite those two values.** Base edits on
  the current `main` so the deployed config is always preserved.
- The version badge shown top-right in the toolbar is the `<span class="ver" id="appVer">`
  in the topbar. **Bump it (v1 → v2 → …) on each user-facing change.**

## Shared team store
- Backend is `apps-script-team-store.gs` (Google Apps Script web app over one Google
  Sheet). Actions: `list`, `load`, `save`, `delete`; shared-key auth; one row per report.
- The client talks to it via `teamCall(action, payload)` and POSTs `text/plain` to avoid a
  CORS preflight.
