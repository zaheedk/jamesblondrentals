/**
 * James Blond — Device + ad-schedule bid optimiser
 * Schedule: Weekly, Monday 06:30
 *
 * Looks at the last LOOKBACK_DAYS and sets bid adjustments so spend follows
 * conversions instead of clicks:
 *   - Device: compares each device's cost/conv against the campaign average.
 *   - Hour of day: bids down dead hours, up on the best converting blocks.
 *
 * Adjustments are clamped to [MIN_MOD, MAX_MOD] and moved gradually
 * (never more than MAX_STEP per run) so nothing swings wildly.
 * DRY_RUN = true logs only. Preview first, then flip to false.
 */

var ALERT_EMAIL = 'you@jamesblond.co.nz'; // <-- CHANGE ME
var LOOKBACK_DAYS = 90;
var MIN_CONVERSIONS_TO_ACT = 3;   // need signal before touching a segment
var MIN_CLICKS_TO_ACT = 40;       // or enough clicks to prove zero-conv is real
var MIN_MOD = 0.6;                // -40%
var MAX_MOD = 1.4;                // +40%
var MAX_STEP = 0.15;              // max change per run
var DRY_RUN = true;
var EXCLUDE_CAMPAIGN_NAME_CONTAINS = ['Brand', 'Rebranding', 'Vancy'];

function main() {
  var range = 'LAST_' + LOOKBACK_DAYS + '_DAYS';
  var log = [];

  var campaigns = AdsApp.campaigns().withCondition('Status = ENABLED').get();
  while (campaigns.hasNext()) {
    var c = campaigns.next();
    if (isExcluded(c.getName())) continue;

    var base = c.getStatsFor(range);
    var baseConv = base.getConversions();
    var baseCost = base.getCost();
    if (baseConv < MIN_CONVERSIONS_TO_ACT) {
      log.push('SKIP (not enough conversions): ' + c.getName());
      continue;
    }
    var baseCpa = baseCost / baseConv;

    tuneDevices(c, range, baseCpa, log);
    tuneHours(c, range, baseCpa, log);
  }

  Logger.log(log.join('\n'));
  if (ALERT_EMAIL && ALERT_EMAIL.indexOf('@') > 0 && log.length) {
    MailApp.sendEmail(ALERT_EMAIL,
      (DRY_RUN ? '[PREVIEW] ' : '') + 'JB Ads — device/schedule bid changes',
      log.join('\n'));
  }
}

function tuneDevices(campaign, range, baseCpa, log) {
  var targets = campaign.targeting().platforms().get();
  while (targets.hasNext()) {
    var p = targets.next();
    var s = p.getStatsFor(range);
    var next = suggestModifier(p.getBidModifier(), s, baseCpa);
    if (next === null) continue;
    log.push(fmt(campaign.getName(), 'device ' + p.getName(), p.getBidModifier(), next, s));
    if (!DRY_RUN) p.setBidModifier(next);
  }
}

function tuneHours(campaign, range, baseCpa, log) {
  var schedules = campaign.targeting().adSchedules().get();
  while (schedules.hasNext()) {
    var sch = schedules.next();
    var s = sch.getStatsFor(range);
    var next = suggestModifier(sch.getBidModifier(), s, baseCpa);
    if (next === null) continue;
    var label = sch.getDayOfWeek() + ' ' + sch.getStartHour() + '-' + sch.getEndHour();
    log.push(fmt(campaign.getName(), 'schedule ' + label, sch.getBidModifier(), next, s));
    if (!DRY_RUN) sch.setBidModifier(next);
  }
}

/** Returns a clamped, step-limited modifier, or null when there is no signal / no change. */
function suggestModifier(current, stats, baseCpa) {
  var conv = stats.getConversions();
  var clicks = stats.getClicks();
  var cost = stats.getCost();
  if (conv < MIN_CONVERSIONS_TO_ACT && clicks < MIN_CLICKS_TO_ACT) return null;

  var target;
  if (conv === 0) {
    target = current - MAX_STEP; // proven clicks, zero conversions
  } else {
    var cpa = cost / conv;
    var ratio = baseCpa / cpa; // >1 means cheaper than average -> bid up
    target = current * Math.max(0.75, Math.min(1.25, ratio));
  }

  target = Math.max(current - MAX_STEP, Math.min(current + MAX_STEP, target));
  target = Math.max(MIN_MOD, Math.min(MAX_MOD, target));
  target = Math.round(target * 100) / 100;
  if (Math.abs(target - current) < 0.03) return null;
  return target;
}

function fmt(campaign, seg, from, to, s) {
  return (DRY_RUN ? 'WOULD SET ' : 'SET ') + campaign + ' | ' + seg +
    ' | ' + from + ' -> ' + to +
    ' | clicks ' + s.getClicks() + ', conv ' + s.getConversions() +
    ', cost ' + s.getCost().toFixed(2);
}

function isExcluded(name) {
  for (var i = 0; i < EXCLUDE_CAMPAIGN_NAME_CONTAINS.length; i++) {
    if (name.toLowerCase().indexOf(EXCLUDE_CAMPAIGN_NAME_CONTAINS[i].toLowerCase()) > -1) return true;
  }
  return false;
}
