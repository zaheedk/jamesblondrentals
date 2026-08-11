/**
 * James Blond — Geo bid optimiser + no-branch region guard
 * Schedule: Weekly, Monday 07:00
 *
 * 1. Excludes locations we cannot service (no branch) so we stop paying for
 *    clicks we can never fulfil.
 * 2. Adjusts location bid modifiers toward the campaign's average CPA.
 *
 * DRY_RUN = true logs only.
 */

var ALERT_EMAIL = 'you@jamesblond.co.nz'; // <-- CHANGE ME
var LOOKBACK_DAYS = 90;
var DRY_RUN = true;

// We only have branches in Auckland, Wellington, Christchurch, Hamilton.
// Anything here gets bid down hard (Google Ads Scripts cannot add negative
// locations, so we floor the modifier instead and report it for manual exclusion).
var NO_BRANCH_CONTAINS = ['Queenstown', 'Nelson', 'Dunedin', 'Invercargill', 'Rotorua', 'Taupo'];

var MIN_CONVERSIONS_TO_ACT = 3;
var MIN_CLICKS_TO_ACT = 30;
var MIN_MOD = 0.5;
var MAX_MOD = 1.3;
var MAX_STEP = 0.15;
var EXCLUDE_CAMPAIGN_NAME_CONTAINS = ['Brand', 'Rebranding', 'Vancy'];

function main() {
  var range = 'LAST_' + LOOKBACK_DAYS + '_DAYS';
  var log = [];
  var manualExclusions = [];

  var campaigns = AdsApp.campaigns().withCondition('Status = ENABLED').get();
  while (campaigns.hasNext()) {
    var c = campaigns.next();
    if (isExcluded(c.getName())) continue;

    var base = c.getStatsFor(range);
    var baseCpa = base.getConversions() > 0 ? base.getCost() / base.getConversions() : null;

    var locs = c.targeting().targetedLocations().get();
    while (locs.hasNext()) {
      var loc = locs.next();
      var name = loc.getName() || '';
      var s = loc.getStatsFor(range);
      var current = loc.getBidModifier();

      if (containsAny(name, NO_BRANCH_CONTAINS)) {
        manualExclusions.push(c.getName() + ' | ' + name +
          ' (cost ' + s.getCost().toFixed(2) + ', conv ' + s.getConversions() + ')');
        if (current > MIN_MOD) {
          log.push((DRY_RUN ? 'WOULD FLOOR ' : 'FLOOR ') + c.getName() + ' | ' + name +
            ' | ' + current + ' -> ' + MIN_MOD + ' (no branch)');
          if (!DRY_RUN) loc.setBidModifier(MIN_MOD);
        }
        continue;
      }

      if (baseCpa === null) continue;
      var next = suggest(current, s, baseCpa);
      if (next === null) continue;
      log.push((DRY_RUN ? 'WOULD SET ' : 'SET ') + c.getName() + ' | ' + name +
        ' | ' + current + ' -> ' + next +
        ' | clicks ' + s.getClicks() + ', conv ' + s.getConversions() +
        ', cost ' + s.getCost().toFixed(2));
      if (!DRY_RUN) loc.setBidModifier(next);
    }
  }

  if (manualExclusions.length) {
    log.push('');
    log.push('MANUAL ACTION — exclude these no-branch locations in the UI:');
    log.push(manualExclusions.join('\n'));
  }

  Logger.log(log.join('\n'));
  if (ALERT_EMAIL && ALERT_EMAIL.indexOf('@') > 0 && log.length) {
    MailApp.sendEmail(ALERT_EMAIL,
      (DRY_RUN ? '[PREVIEW] ' : '') + 'JB Ads — geo bid changes', log.join('\n'));
  }
}

function suggest(current, stats, baseCpa) {
  var conv = stats.getConversions();
  var clicks = stats.getClicks();
  if (conv < MIN_CONVERSIONS_TO_ACT && clicks < MIN_CLICKS_TO_ACT) return null;
  var target;
  if (conv === 0) {
    target = current - MAX_STEP;
  } else {
    var ratio = baseCpa / (stats.getCost() / conv);
    target = current * Math.max(0.75, Math.min(1.25, ratio));
  }
  target = Math.max(current - MAX_STEP, Math.min(current + MAX_STEP, target));
  target = Math.max(MIN_MOD, Math.min(MAX_MOD, target));
  target = Math.round(target * 100) / 100;
  if (Math.abs(target - current) < 0.03) return null;
  return target;
}

function containsAny(text, list) {
  var t = (text || '').toLowerCase();
  for (var i = 0; i < list.length; i++) if (t.indexOf(list[i].toLowerCase()) > -1) return true;
  return false;
}

function isExcluded(name) { return containsAny(name, EXCLUDE_CAMPAIGN_NAME_CONTAINS); }
