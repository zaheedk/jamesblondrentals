# James Blond — Google Ads Scripts

Four scripts that automate the ongoing hygiene work from `restructure-plan-v2.md`.
All run **inside** Google Ads (Tools → Bulk actions → Scripts) — no API token, no OAuth.

## How to install (one-time, per script)

1. Google Ads → **Tools → Bulk actions → Scripts** → **+ New script**
2. Name it (e.g. "JB — Pause zero-conversion keywords")
3. Paste the file contents, replacing everything in the editor
4. Click **Authorize** → allow access to your account
5. Click **Preview** — read the log, confirm the changes look right
6. Click **Run** once manually
7. Click **Schedule** and set the frequency listed below

## The four scripts

| File | What it does | Schedule | Est. saving |
|---|---|---|---|
| `01-pause-zero-conversion-keywords.js` | Pauses any keyword with ≥100 clicks and 0 conversions in the last 60 days | Weekly (Mon 6am) | $200-400/mo wasted spend |
| `02-auto-add-search-term-negatives.js` | Adds search terms with ≥20 clicks and 0 conv to the "JB Master Negatives 2026-06" shared list | Weekly (Mon 6am) | Compounds over time |
| `03-budget-pacing-alert.js` | Emails you when any campaign is >120% or <60% of expected daily pacing | Daily (7am) | Prevents overspend / under-delivery |
| `04-broken-final-url-check.js` | Emails you if any ad's Final URL returns non-200 (catches 404s after site redeploys) | Daily (2am) | Prevents wasted clicks on dead pages |

## Before you install

1. Create the shared negative list first: **Tools → Shared library → Negative keyword lists → +** → name it exactly `JB Master Negatives 2026-06` and upload `../negative-keywords.csv`. Script #2 writes to that list by name.
2. Set your alert email in each script (search for `ALERT_EMAIL` at the top).
3. Always **Preview** before scheduling — the preview log shows exactly what would change without touching your account.

## Safety

- Every script logs every change it makes. Check the script's **Logs** tab after each run for the first week.
- Scripts #1 and #2 exclude your **Brand** campaign (`Rebranding – Vancy to James Blond`) by name — brand keywords have low conv rates but high value, don't pause them.
- Nothing here deletes anything. Keywords are paused (reversible), negatives are added (reversible via the shared list UI).

## What these do NOT do

- They don't build new ad groups or RSAs (that's a one-time Google Ads Editor import from the CSVs in `../` — see `restructure-plan-v2.md`).
- They don't repoint Final URLs (also a one-time Editor push).
- They don't shift budgets automatically (script #3 only alerts — auto-budget-shifting is risky without offline conversion import).

Do the one-time restructure in Google Ads Editor, then let these four scripts handle the ongoing hygiene.