/************************************************************************
 * IH Report Builder — shared team store (Google Sheets backend)
 *
 * This Google Apps Script lets the whole team save and open the SAME set
 * of IH reports through one Google Sheet. The web app runs as YOU (the
 * owner), so teammates need no Google setup of their own — they just open
 * the site.
 *
 * ── ONE-TIME SETUP ──────────────────────────────────────────────────
 * 1. Create a Google Sheet (go to https://sheet.new). Reports are stored
 *    here, one per row — keep it for your team.
 * 2. In that sheet:  Extensions ▸ Apps Script.  Delete the sample code and
 *    paste THIS ENTIRE file in.  Save.
 * 3. Change SHARED_KEY below to a long random string (your "team key").
 * 4. Deploy ▸ New deployment ▸ (gear) ▸ Web app:
 *        Description:      IH team store
 *        Execute as:       Me  (your Google account)
 *        Who has access:   Anyone
 *    Click Deploy, authorize when prompted, then COPY the Web app URL
 *    (it ends in /exec).
 * 5. In index.html, set TEAM_API_URL to that URL and TEAM_KEY to your
 *    SHARED_KEY (near the top of the <script>), then redeploy the site.
 *    (Or, just to test, paste both into the app's  Team ▸ Team settings.)
 *
 * To change this code later: Deploy ▸ Manage deployments ▸ (edit) ▸
 * Version: New version ▸ Deploy — that keeps the same /exec URL.
 *
 * SECURITY NOTE: anyone who knows the URL *and* the key can read/write
 * reports. Keep the key private; if it leaks, change SHARED_KEY here and
 * in the site to rotate it.
 ************************************************************************/

const SHARED_KEY = 'CHANGE-ME-to-a-long-random-string';
const SHEET_NAME = 'Reports';
const HEADERS = ['id', 'name', 'site', 'siteType', 'date', 'updated', 'json'];

function doGet(e) {
  // Visiting the /exec URL in a browser confirms the deployment is live.
  if (!e || !e.parameter || !e.parameter.action) {
    return json_({ ok: true, status: 'IH Report team store is running.' });
  }
  return handle_(e);
}

function doPost(e) {
  return handle_(e);
}

function handle_(e) {
  try {
    var p = (e && e.parameter) || {};
    var body = {};
    if (e && e.postData && e.postData.contents) {
      try { body = JSON.parse(e.postData.contents); } catch (_) {}
    }
    var key = body.key || p.key || '';
    if (key !== SHARED_KEY) return json_({ ok: false, error: 'Unauthorized — check the shared key.' });

    var action = body.action || p.action || 'list';
    if (action === 'list')   return json_({ ok: true, files: listRows_() });
    if (action === 'load')   return json_({ ok: true, report: loadRow_(body.id || p.id) });
    if (action === 'save')   return json_(saveRow_(body));
    if (action === 'delete') return json_(deleteRow_(body.id || p.id));
    return json_({ ok: false, error: 'Unknown action: ' + action });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  }
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function getSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) {
    sh = ss.insertSheet(SHEET_NAME);
    sh.appendRow(HEADERS);
    sh.setFrozenRows(1);
  }
  return sh;
}

function listRows_() {
  var sh = getSheet_();
  if (sh.getLastRow() < 2) return [];
  // columns 1..6 only (skip the big json column for a light list)
  var v = sh.getRange(2, 1, sh.getLastRow() - 1, 6).getValues();
  return v.filter(function (r) { return r[0]; })
    .map(function (r) {
      return { id: r[0], name: r[1], site: r[2], siteType: r[3], date: r[4], updated: r[5] };
    })
    .sort(function (a, b) { return (b.updated > a.updated) ? 1 : (b.updated < a.updated ? -1 : 0); });
}

function findRow_(sh, id) {
  if (!id || sh.getLastRow() < 2) return 0;
  var ids = sh.getRange(2, 1, sh.getLastRow() - 1, 1).getValues();
  for (var i = 0; i < ids.length; i++) {
    if (ids[i][0] === id) return i + 2; // +2: header row + 0-based index
  }
  return 0;
}

function loadRow_(id) {
  var sh = getSheet_();
  var row = findRow_(sh, id);
  if (!row) return null;
  var jsonStr = sh.getRange(row, 7).getValue();
  if (!jsonStr) return null;
  try { return JSON.parse(jsonStr); } catch (e) { return null; }
}

function saveRow_(body) {
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    var sh = getSheet_();
    var state = body.report || {};
    var meta = state.meta || {};
    var now = new Date().toISOString();
    var name = (body.name || meta.site || 'Untitled').toString();
    var rowVals = [body.id || '', name, meta.site || '', meta.siteType || '', meta.date || '', now, JSON.stringify(state)];

    var id = body.id || '';
    if (id) {
      var row = findRow_(sh, id);
      if (row) {
        sh.getRange(row, 1, 1, HEADERS.length).setValues([rowVals]);
        return { ok: true, id: id, name: name, updated: now };
      }
    }
    id = 'r' + Date.now() + Math.floor(Math.random() * 1000);
    rowVals[0] = id;
    sh.appendRow(rowVals);
    return { ok: true, id: id, name: name, updated: now };
  } finally {
    lock.releaseLock();
  }
}

function deleteRow_(id) {
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    var sh = getSheet_();
    var row = findRow_(sh, id);
    if (!row) return { ok: false, error: 'Not found.' };
    sh.deleteRow(row);
    return { ok: true };
  } finally {
    lock.releaseLock();
  }
}
