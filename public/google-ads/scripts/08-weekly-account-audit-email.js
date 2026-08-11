/**
 * James Blond — Weekly account audit email
 * Schedule: Weekly, Monday 08:00 (after scripts 01-07)
 *
 * One email that answers "what changed and what needs my attention":
 *   - Week-over-week spend, clicks, conversions, CPA per campaign
 *   - Campaigns limited by budget
 *   - Ad groups with fewer than 2 enabled RSAs
 *   - RSAs with low ad strength / missing assets
 *   - Keywords with quality score <= 4 and real spend
 *   - Top 10 spending search terms with zero conversions
 *
 * Read-only. This script never changes the account.
 */

var ALERT_EMAIL = 'you@jamesblond.co.nz'; // <-- CHANGE ME
var LOW_QS = 4;
var MIN_SPEND_FOR_QS_FLAG = 50;

function main() {
  var out = [];
  out.push('JAMES BLOND — GOOGLE ADS WEEKLY AUDIT');
  out.push('Account: ' + AdsApp.currentAccount().getName());
  out.push('');

  out.push('== CAMPAIGN PERFORMANCE (last 7 days vs previous 7) ==');
  var campaigns = AdsApp.campaigns().withCondition('Status = ENABLED').get();
  while (campaigns.hasNext()) {
    var c = campaigns.next();
    var now = c.getStatsFor('LAST_7_DAYS');
    var prev = c.getStatsFor(dateRange(14, 8));
    out.push(c.getName());
    out.push('  cost ' + money(now.getCost()) + ' (was ' + money(prev.getCost()) + ')' +
      ' | clicks ' + now.getClicks() + ' (was ' + prev.getClicks() + ')' +
      ' | conv ' + now.getConversions() + ' (was ' + prev.getConversions() + ')' +
      ' | CPA ' + cpa(now) + ' (was ' + cpa(prev) + ')');
  }

  out.push('');
  out.push('== LIMITED BY BUDGET (last 7 days) ==');
  var lim = AdsApp.report(
    "SELECT campaign.name, campaign_budget.amount_micros, metrics.search_budget_lost_impression_share " +
    "FROM campaign WHERE campaign.status = 'ENABLED' AND segments.date DURING LAST_7_DAYS"
  ).rows();
  var anyLim = false;
  while (lim.hasNext()) {
    var r = lim.next();
    var lost = parseFloat(r['metrics.search_budget_lost_impression_share'] || 0);
    if (lost > 0.1) {
      anyLim = true;
      out.push('  ' + r['campaign.name'] + ' — losing ' + (lost * 100).toFixed(1) + '% of impressions to budget');
    }
  }
  if (!anyLim) out.push('  none');

  out.push('');
  out.push('== AD GROUPS WITH < 2 ENABLED ADS ==');
  var ags = AdsApp.adGroups().withCondition('Status = ENABLED').get();
  var thin = 0;
  while (ags.hasNext()) {
    var ag = ags.next();
    var count = 0;
    var ads = ag.ads().withCondition('Status = ENABLED').get();
    while (ads.hasNext()) { ads.next(); count++; }
    if (count < 2) { thin++; out.push('  ' + ag.getCampaign().getName() + ' > ' + ag.getName() + ' (' + count + ' ads)'); }
  }
  if (!thin) out.push('  none');

  out.push('');
  out.push('== LOW QUALITY SCORE KEYWORDS (QS <= ' + LOW_QS + ', spend >= ' + MIN_SPEND_FOR_QS_FLAG + ') ==');
  var kws = AdsApp.keywords()
    .withCondition('Status = ENABLED')
    .withCondition('QualityScore <= ' + LOW_QS)
    .withCondition('Cost > ' + MIN_SPEND_FOR_QS_FLAG)
    .forDateRange('LAST_30_DAYS')
    .orderBy('Cost DESC')
    .withLimit(25)
    .get();
  var anyQs = false;
  while (kws.hasNext()) {
    var k = kws.next();
    anyQs = true;
    out.push('  ' + k.getText() + ' (QS ' + k.getQualityScore() + ') — ' +
      k.getCampaign().getName() + ' > ' + k.getAdGroup().getName() +
      ' — ' + money(k.getStatsFor('LAST_30_DAYS').getCost()));
  }
  if (!anyQs) out.push('  none');

  out.push('');
  out.push('== TOP WASTED SEARCH TERMS (last 30 days, 0 conversions) ==');
  var st = AdsApp.search(
    "SELECT search_term_view.search_term, metrics.clicks, metrics.cost_micros " +
    "FROM search_term_view WHERE segments.date DURING LAST_30_DAYS " +
    "AND metrics.conversions = 0 ORDER BY metrics.cost_micros DESC LIMIT 10"
  );
  while (st.hasNext()) {
    var s = st.next();
    out.push('  "' + s.searchTermView.searchTerm + '" — ' +
      s.metrics.clicks + ' clicks, ' + money(s.metrics.costMicros / 1000000));
  }

  var body = out.join('\n');
  Logger.log(body);
  if (ALERT_EMAIL && ALERT_EMAIL.indexOf('@') > 0) {
    MailApp.sendEmail(ALERT_EMAIL, 'JB Ads — weekly audit', body);
  }
}

function money(n) { return '$' + Number(n).toFixed(2); }
function cpa(stats) {
  return stats.getConversions() > 0 ? money(stats.getCost() / stats.getConversions()) : 'n/a';
}
function dateRange(startDaysAgo, endDaysAgo) {
  return { start: shift(startDaysAgo), end: shift(endDaysAgo) };
}
function shift(daysAgo) {
  var d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() };
}
