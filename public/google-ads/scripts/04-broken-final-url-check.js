/**
 * James Blond — Broken Final URL check
 * Schedule: Daily, 02:00
 *
 * Fetches every unique Final URL used by ENABLED ads across ENABLED ad groups
 * in ENABLED campaigns. Emails you the list of URLs that returned non-200
 * (or timed out). Catches 404s introduced by site redeploys before they burn
 * ad budget on dead landing pages.
 */

var ALERT_EMAIL = 'you@jamesblond.co.nz'; // <-- CHANGE ME
var TIMEOUT_MS = 15000;

function main() {
  var urls = {};

  var it = AdsApp.ads()
    .withCondition('Status = ENABLED')
    .withCondition('AdGroupStatus = ENABLED')
    .withCondition('CampaignStatus = ENABLED')
    .get();

  while (it.hasNext()) {
    var ad = it.next();
    var urlObj = ad.urls();
    var final = urlObj && urlObj.getFinalUrl && urlObj.getFinalUrl();
    if (final) urls[final] = true;
  }

  var broken = [];
  for (var url in urls) {
    try {
      var resp = UrlFetchApp.fetch(url, {
        muteHttpExceptions: true,
        followRedirects: true,
        validateHttpsCertificates: true,
      });
      var code = resp.getResponseCode();
      if (code >= 400) broken.push(code + ' — ' + url);
    } catch (e) {
      broken.push('ERR — ' + url + ' (' + e + ')');
    }
    Utilities.sleep(200); // be nice to your own origin
  }

  if (broken.length === 0) { Logger.log('All Final URLs return 2xx/3xx.'); return; }

  var body = 'Broken Final URLs in ENABLED ads:\n\n' + broken.join('\n') +
    '\n\nFix the page or repoint the ad group. These are burning click budget.';
  Logger.log(body);
  if (ALERT_EMAIL && ALERT_EMAIL.indexOf('@') > -1) {
    MailApp.sendEmail(ALERT_EMAIL, '[Google Ads] ' + broken.length + ' broken Final URL(s)', body);
  }
}