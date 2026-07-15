/**
 * James Blond — Auto-add wasteful search terms as negatives
 * Schedule: Weekly, Monday 06:00 (run AFTER script #1)
 *
 * Finds search terms with ≥ MIN_CLICKS clicks and 0 conversions in the last
 * LOOKBACK_DAYS days, and adds them as PHRASE negatives to the shared list
 * named SHARED_LIST_NAME. Skips terms already present, brand terms, and terms
 * that already exist in the account negatives.
 */

var ALERT_EMAIL = 'you@jamesblond.co.nz'; // <-- CHANGE ME
var SHARED_LIST_NAME = 'JB Master Negatives 2026-06';
var LOOKBACK_DAYS = 30;
var MIN_CLICKS = 20;
var DRY_RUN = true; // flip to false after 1-2 clean preview runs
var SKIP_IF_CONTAINS = ['james blond', 'jamesblond', 'vancy']; // never negate brand

function main() {
  var list = getOrCreateSharedNegativeList(SHARED_LIST_NAME);
  if (!list) { Logger.log('Could not find/create shared list: ' + SHARED_LIST_NAME); return; }

  var existing = {};
  var it = list.negativeKeywords().get();
  while (it.hasNext()) existing[it.next().getText().toLowerCase()] = true;

  var query =
    "SELECT search_term_view.search_term, metrics.clicks, metrics.cost_micros, metrics.conversions " +
    "FROM search_term_view " +
    "WHERE segments.date DURING LAST_30_DAYS " +
    "AND metrics.clicks >= " + MIN_CLICKS + " " +
    "AND metrics.conversions = 0";

  var report = AdsApp.search(query);
  var added = [];
  while (report.hasNext()) {
    var row = report.next();
    var term = (row.searchTermView.searchTerm || '').toLowerCase().trim();
    if (!term) continue;
    if (existing[term]) continue;
    if (containsAny(term, SKIP_IF_CONTAINS)) continue;

    var phrase = '"' + term + '"';
    if (!DRY_RUN) list.addNegativeKeyword(phrase);
    added.push({
      term: term,
      clicks: row.metrics.clicks,
      cost: (Number(row.metrics.costMicros) / 1000000).toFixed(2),
    });
    existing[term] = true;
  }

  if (added.length === 0) { Logger.log('No new negatives to add.'); return; }

  var body =
    (DRY_RUN ? '[PREVIEW — nothing was actually added]\n\n' : '') +
    'Added ' + added.length + ' phrase negatives to "' + SHARED_LIST_NAME + '":\n\n' +
    added.map(function (r) { return '"' + r.term + '" — ' + r.clicks + ' clicks, $' + r.cost + ' wasted'; }).join('\n');

  Logger.log(body);
  if (ALERT_EMAIL && ALERT_EMAIL.indexOf('@') > -1) {
    MailApp.sendEmail(ALERT_EMAIL, '[Google Ads] Added ' + added.length + ' search-term negatives', body);
  }
}

function getOrCreateSharedNegativeList(name) {
  var it = AdsApp.negativeKeywordLists().withCondition("Name = '" + name.replace(/'/g, "\\'") + "'").get();
  if (it.hasNext()) return it.next();
  var op = AdsApp.newNegativeKeywordListBuilder().withName(name).build();
  return op.isSuccessful() ? op.getResult() : null;
}

function containsAny(s, arr) {
  for (var i = 0; i < arr.length; i++) if (s.indexOf(arr[i]) > -1) return true;
  return false;
}