/**
 * James Blond — Pause zero-conversion keywords
 * Schedule: Weekly, Monday 06:00
 *
 * Pauses any ENABLED keyword that has:
 *   - ≥ MIN_CLICKS clicks in the last LOOKBACK_DAYS days
 *   - 0 conversions in that window
 * Excludes brand campaigns (see EXCLUDE_CAMPAIGN_NAME_CONTAINS).
 *
 * Safe by default: run PREVIEW first. Set DRY_RUN = false to actually pause.
 */

var ALERT_EMAIL = 'you@jamesblond.co.nz'; // <-- CHANGE ME
var LOOKBACK_DAYS = 60;
var MIN_CLICKS = 100;
var DRY_RUN = true; // set to false after you've reviewed 1-2 preview runs
var EXCLUDE_CAMPAIGN_NAME_CONTAINS = ['Brand', 'Rebranding', 'Vancy']; // never pause brand

function main() {
  var dateRange = 'LAST_' + LOOKBACK_DAYS + '_DAYS';
  // Google Ads only accepts a fixed set of preset ranges; fall back to date literals otherwise.
  var validPresets = { LAST_7_DAYS: 1, LAST_14_DAYS: 1, LAST_30_DAYS: 1 };
  var range = validPresets[dateRange] ? dateRange : dateRangeLastNDays(LOOKBACK_DAYS);

  var iterator = AdsApp.keywords()
    .withCondition('Status = ENABLED')
    .withCondition('AdGroupStatus = ENABLED')
    .withCondition('CampaignStatus = ENABLED')
    .withCondition('Clicks >= ' + MIN_CLICKS)
    .withCondition('Conversions = 0')
    .forDateRange(range)
    .get();

  var paused = [];
  while (iterator.hasNext()) {
    var kw = iterator.next();
    var campaignName = kw.getCampaign().getName();
    if (isExcluded(campaignName)) continue;

    var stats = kw.getStatsFor(range);
    var row = {
      campaign: campaignName,
      adGroup: kw.getAdGroup().getName(),
      keyword: kw.getText(),
      matchType: kw.getMatchType(),
      clicks: stats.getClicks(),
      cost: stats.getCost().toFixed(2),
    };
    paused.push(row);

    if (!DRY_RUN) kw.pause();
  }

  if (paused.length === 0) {
    Logger.log('No zero-conversion keywords to pause.');
    return;
  }

  var lines = paused.map(function (r) {
    return [r.campaign, r.adGroup, r.matchType + ' ' + r.keyword, r.clicks + ' clicks', '$' + r.cost].join(' | ');
  });
  var body =
    (DRY_RUN ? '[PREVIEW — nothing was actually paused]\n\n' : '') +
    'Paused ' + paused.length + ' zero-conversion keywords (last ' + LOOKBACK_DAYS + ' days, ≥' + MIN_CLICKS + ' clicks):\n\n' +
    lines.join('\n');

  Logger.log(body);
  if (ALERT_EMAIL && ALERT_EMAIL.indexOf('@') > -1) {
    MailApp.sendEmail(ALERT_EMAIL, '[Google Ads] Paused ' + paused.length + ' zero-conv keywords', body);
  }
}

function isExcluded(campaignName) {
  for (var i = 0; i < EXCLUDE_CAMPAIGN_NAME_CONTAINS.length; i++) {
    if (campaignName.toLowerCase().indexOf(EXCLUDE_CAMPAIGN_NAME_CONTAINS[i].toLowerCase()) > -1) return true;
  }
  return false;
}

function dateRangeLastNDays(n) {
  var today = new Date();
  var start = new Date(today.getTime() - n * 86400000);
  return { start: fmt(start), end: fmt(today) };
}
function fmt(d) {
  var m = ('0' + (d.getMonth() + 1)).slice(-2);
  var day = ('0' + d.getDate()).slice(-2);
  return d.getFullYear() + m + day;
}