# James Blond — Google Ads automation

Eight scripts that run **inside** Google Ads (Tools → Bulk actions → Scripts). No API token, no OAuth, no external server. Once installed and scheduled, the account optimises itself weekly and emails you what changed.

Lovable cannot log into your Google Ads account directly — Google Ads is not an available connector. These scripts are the automation: you paste each one once, and Google runs them on schedule from then on.

## How to install (one-time, per script)

1. Google Ads → **Tools → Bulk actions → Scripts** → **+ New script**
2. Name it (see table below)
3. Paste the file contents, replacing everything in the editor
4. Set `ALERT_EMAIL` at the top of the file to your address
5. Click **Authorize** → allow access
6. Click **Preview** and read the log — with `DRY_RUN = true` nothing is changed
7. After 1–2 clean previews, set `DRY_RUN = false` and click **Run**
8. Click **Schedule** and use the frequency in the table

## The scripts

### Hygiene (stop the waste)

| File | What it does | Schedule |
|---|---|---|
| `01-pause-zero-conversion-keywords.js` | Pauses keywords with ≥100 clicks and 0 conversions in 60 days | Mon 06:00 |
| `02-auto-add-search-term-negatives.js` | Adds wasteful search terms to the `JB Master Negatives 2026-06` shared list | Mon 06:00 |

### Optimisation (move money toward what converts)

| File | What it does | Schedule |
|---|---|---|
| `05-device-and-schedule-bid-optimiser.js` | Sets device and hour-of-day bid modifiers toward campaign CPA, max ±15% per run, clamped to ±40% | Mon 06:30 |
| `06-geo-bid-optimiser.js` | Bid-adjusts locations by CPA, and floors bids on no-branch regions (Queenstown, Nelson, Dunedin, Invercargill, Rotorua, Taupō) plus reports them for manual exclusion | Mon 07:00 |
| `07-search-term-harvester.js` | Promotes converting search terms into exact-match keywords in the ad group already serving them; skips brand, competitor and relocation/$1 intent | Mon 07:30 |

### Monitoring (know what happened)

| File | What it does | Schedule |
|---|---|---|
| `03-budget-pacing-alert.js` | Emails when a campaign is >120% or <60% of expected pacing | Daily 07:00 |
| `04-broken-final-url-check.js` | Emails if any ad's Final URL returns non-200 | Daily 02:00 |
| `08-weekly-account-audit-email.js` | One digest: WoW performance per campaign, budget-limited campaigns, ad groups with <2 ads, QS ≤4 keywords with spend, top 10 wasted search terms. Read-only. | Mon 08:00 |

Install order matters only within a morning: 01 → 02 → 05 → 06 → 07 → 08.

## Guardrails built in

- **Brand is never touched.** Every write script skips campaigns matching `Brand`, `Rebranding`, `Vancy`.
- **No wild swings.** Bid modifiers move at most 15% per run and stay inside 0.5–1.4.
- **Signal thresholds.** A segment must have ≥3 conversions, or ≥30–40 clicks with zero conversions, before it is adjusted.
- **Nothing is deleted.** Keywords get paused, negatives get added, modifiers get changed — all reversible in the UI.
- **DRY_RUN defaults to true** in every write script.
- **No-branch geos are respected.** Script 06 will not let spend build in cities we cannot service.

## Before you install

1. Create the shared negative list: **Tools → Shared library → Negative keyword lists → +** → name it exactly `JB Master Negatives 2026-06` and upload `../negative-keywords.csv`.
2. Confirm conversion tracking is importing the `purchase` event from GA4 — every optimisation script keys off conversions. If conversions are not tracked correctly, set `DRY_RUN = true` and fix tracking first.
3. Do the one-time structural work from `../restructure-plan-v2.md` in Google Ads Editor (new ad groups, RSAs, Final URLs). Scripts do not build structure.

## What these still do NOT do

- Build new campaigns, ad groups or RSAs — that is the Editor import from `../rsa-ad-copy.md`.
- Shift budgets between campaigns automatically (script 03 alerts; auto-shifting needs reliable offline conversion values first).
- Change Smart Bidding tCPA/tROAS targets — do that manually after 4 weeks of clean conversion data.
