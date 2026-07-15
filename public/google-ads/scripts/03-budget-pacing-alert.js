/**
 * James Blond — Daily budget pacing alert
 * Schedule: Daily, 07:00
 *
 * Emails you when any ENABLED campaign is spending outside a healthy pace band.
 *   - OVERSPENDING: today's cost > OVER_PCT of daily budget by 2pm+
 *   - MONTH-TO-DATE DRIFT: MTD spend > OVER_MTD_PCT or < UNDER_MTD_PCT of expected
 *
 * No changes are made. Alerts only. Reply to the email = go pause/increase manually.
 */

var ALERT_EMAIL = 'you@jamesblond.co.nz'; // <-- CHANGE ME
var OVER_PCT = 1.5;      // 150% of daily budget = alert
var OVER_MTD_PCT = 1.2;  // 120% of expected MTD spend = alert
var UNDER_MTD_PCT = 0.6; // 60% of expected MTD spend = alert (under-delivering)

function main() {
  var alerts = [];
  var now = new Date();
  var day = now.getDate();
  var daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  var monthProgress = day / daysInMonth;

  var it = AdsApp.campaigns().withCondition('Status = ENABLED').get();
  while (it.hasNext()) {
    var c = it.next();
    var budget = c.getBudget().getAmount();
    if (!budget) continue;

    var today = c.getStatsFor('TODAY').getCost();
    var mtd = c.getStatsFor('THIS_MONTH').getCost();
    var expectedMtd = budget * day;

    if (today > budget * OVER_PCT) {
      alerts.push('⚠️ OVER TODAY: ' + c.getName() + ' spent $' + today.toFixed(2) +
        ' vs $' + budget.toFixed(2) + ' daily budget (' + Math.round(today / budget * 100) + '%)');
    }
    if (mtd > expectedMtd * OVER_MTD_PCT) {
      alerts.push('⚠️ OVER MTD: ' + c.getName() + ' spent $' + mtd.toFixed(2) +
        ' vs $' + expectedMtd.toFixed(2) + ' expected (' + Math.round(mtd / expectedMtd * 100) + '%)');
    }
    if (monthProgress > 0.15 && mtd < expectedMtd * UNDER_MTD_PCT) {
      alerts.push('🐢 UNDER MTD: ' + c.getName() + ' spent $' + mtd.toFixed(2) +
        ' vs $' + expectedMtd.toFixed(2) + ' expected (' + Math.round(mtd / expectedMtd * 100) + '%)');
    }
  }

  if (alerts.length === 0) { Logger.log('All campaigns pacing normally.'); return; }

  var body = 'Budget pacing alerts (' + now.toDateString() + '):\n\n' + alerts.join('\n');
  Logger.log(body);
  if (ALERT_EMAIL && ALERT_EMAIL.indexOf('@') > -1) {
    MailApp.sendEmail(ALERT_EMAIL, '[Google Ads] ' + alerts.length + ' budget pacing alert(s)', body);
  }
}