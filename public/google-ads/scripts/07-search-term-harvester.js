/**
 * James Blond — Converting search-term harvester
 * Schedule: Weekly, Monday 07:30
 *
 * The opposite of script #2. Finds search terms that CONVERTED but are not yet
 * keywords, and adds them as EXACT match keywords into the ad group that
 * already serves them — so they get their own bid, their own RSA and stop
 * competing on a loose broad match.
 *
 * DRY_RUN = true logs only.
 */

var ALERT_EMAIL = 'you@jamesblond.co.nz'; // <-- CHANGE ME
var LOOKBACK_DAYS = 90;
var MIN_CONVERSIONS = 1;
var MIN_CLICKS = 3;
var MAX_ADDS_PER_RUN = 25;
var DRY_RUN = true;

// Never harvest these — brand terms belong in the brand campaign, and
// relocation/one-dollar intent is not our business model.
var SKIP_IF_CONTAINS = [
  'james blond', 'jamesblond', 'vancy',
  'relocation', 'relocate', '$1', '1 dollar', 'free',
  'jucy', 'usave', 'hireace', 'handy', 'apex', 'gorentals'
];

function main() {
  var existing = buildExistingKeywordSet();
  var log = [];
  var adds = 0;

  var query =
    "SELECT search_term_view.search_term, campaign.name, ad_group.name, " +
    "metrics.clicks, metrics.conversions, metrics.cost_micros " +
    "FROM search_term_view " +
    "WHERE segments.date DURING LAST_" + LOOKBACK_DAYS + "_DAYS " +
    "AND metrics.conversions >= " + MIN_CONVERSIONS + " " +
    "AND metrics.clicks >= " + MIN_CLICKS + " " +
    "ORDER BY metrics.conversions DESC";

  var rows = AdsApp.search(query);
  while (rows.hasNext() && adds < MAX_ADDS_PER_RUN) {
    var row = rows.next();
    var term = (row.searchTermView.searchTerm || '').toLowerCase().trim();
    if (!term) continue;
    if (existing[term]) continue;
    if (containsAny(term, SKIP_IF_CONTAINS)) continue;

    var adGroup = findAdGroup(row.campaign.name, row.adGroup.name);
    if (!adGroup) { log.push('NO AD GROUP for "' + term + '"'); continue; }

    log.push((DRY_RUN ? 'WOULD ADD ' : 'ADDED ') + '[' + term + '] -> ' +
      row.campaign.name + ' > ' + row.adGroup.name +
      ' | clicks ' + row.metrics.clicks + ', conv ' + row.metrics.conversions);

    if (!DRY_RUN) {
      var op = adGroup.newKeywordBuilder().withText('[' + term + ']').build();
      if (!op.isSuccessful()) log.push('  FAILED: ' + op.getErrors().join('; '));
    }
    existing[term] = true;
    adds++;
  }

  Logger.log(log.length ? log.join('\n') : 'No new converting search terms to harvest.');
  if (ALERT_EMAIL && ALERT_EMAIL.indexOf('@') > 0 && log.length) {
    MailApp.sendEmail(ALERT_EMAIL,
      (DRY_RUN ? '[PREVIEW] ' : '') + 'JB Ads — harvested ' + adds + ' converting search terms',
      log.join('\n'));
  }
}

function buildExistingKeywordSet() {
  var set = {};
  var it = AdsApp.keywords().get();
  while (it.hasNext()) set[it.next().getText().replace(/[\[\]"+]/g, '').toLowerCase().trim()] = true;
  return set;
}

function findAdGroup(campaignName, adGroupName) {
  var it = AdsApp.adGroups()
    .withCondition('CampaignName = "' + campaignName + '"')
    .withCondition('Name = "' + adGroupName + '"')
    .withCondition('Status = ENABLED')
    .get();
  return it.hasNext() ? it.next() : null;
}

function containsAny(text, list) {
  var t = (text || '').toLowerCase();
  for (var i = 0; i < list.length; i++) if (t.indexOf(list[i].toLowerCase()) > -1) return true;
  return false;
}
