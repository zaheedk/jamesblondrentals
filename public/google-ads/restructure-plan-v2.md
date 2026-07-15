# James Blond — Google Ads Restructure Plan v2 (2026-07 refresh)

Refresh of `restructure-plan.md` against the current live site. Since v1 (Jun 2026) the
following new landing pages have shipped and are indexable — every ad group below now
points to a dedicated LP instead of the homepage, which is the single biggest Quality
Score lever left on the account.

**New / newly-mapped landing pages since v1**

- `/12-seater-van-hire-wellington`
- `/12-seater-van-hire-christchurch`
- `/14-seater-van-hire-auckland`
- `/christchurch-minibus-hire`
- `/hamilton-minibus-hire`
- `/furniture-truck-hire-hamilton`
- `/moving-truck-hire-hamilton`
- `/moving-truck-hire-auckland`
- `/van-hire-hamilton`, `/truck-hire-hamilton`
- `/west-auckland-van-hire`, `/west-auckland-truck-rentals-hire`
- `/central-christchurch-{car,van,truck}-hire`
- `/trailer-hire-{auckland,wellington,christchurch,hamilton}`

---

## 1. Updated ad-group → landing-page map

Only the deltas vs v1 are shown. Keep everything else from v1 as-is.

| Ad group | Final URL |
|---|---|
| Van Hire – Auckland | `/12-seater-van-hire-auckland` (routes to AucklandVanHire) |
| Van Hire – Wellington | `/van-hire-wellington` |
| Van Hire – Christchurch | `/van-hire-christchurch` |
| Van Hire – West Auckland | `/west-auckland-van-hire` |
| Van Hire – Hamilton | `/van-hire-hamilton` |
| Cargo Van – Auckland Airport | `/auckland-airport-cargo-van-rentals-hire` |
| Cargo Van – Central / South / West Auckland | `/central-auckland-cargo-van-rentals-hire`, `/south-auckland-cargo-van-rentals-hire`, `/west-auckland-cargo-van-rentals-hire` |
| Truck Hire – Auckland (moving) | `/moving-truck-hire-auckland` |
| Truck Hire – Wellington | `/truck-hire-wellington` |
| Truck Hire – Christchurch | `/truck-hire-christchurch` |
| Truck Hire – Hamilton | `/truck-hire-hamilton` |
| Furniture Truck – Hamilton ⭐ | `/furniture-truck-hire-hamilton` (880/mo, KD 20 — highest-ROI new group) |
| Moving Truck – Hamilton | `/moving-truck-hire-hamilton` |
| Tipper | `/tipper-truck-hire` |
| Tail-lift / box truck | `/fleet/trucks/2-tonne-box-12m3-tail` |
| Minibus / 12-seater – Auckland | `/12-seater-van-hire-auckland` |
| Minibus / 14-seater – Auckland | `/14-seater-van-hire-auckland` |
| Minibus / 12-seater – Wellington | `/12-seater-van-hire-wellington` |
| Minibus / 12-seater – Christchurch | `/12-seater-van-hire-christchurch` |
| Minibus – Christchurch (general) | `/christchurch-minibus-hire` |
| Minibus – Hamilton | `/hamilton-minibus-hire` |
| Minibus – Auckland Airport | `/auckland-airport-minibus-rentals-hire` |
| Trailer – Auckland | `/trailer-hire-auckland` |
| Trailer – Wellington | `/trailer-hire-wellington` |
| Trailer – Christchurch | `/trailer-hire-christchurch` |
| Trailer – Hamilton | `/trailer-hire-hamilton` |
| Car Hire – Auck / Wgtn / Chch / Hamilton | `/car-hire-auckland`, `/car-rental-wellington-new-zealand`, `/car-hire-christchurch`, `/car-hire-hamilton` |
| One-way | `/one-way-car-hire` |

---

## 2. New ad groups to build (post-v1 pages)

These didn't exist as targetable LPs when v1 was written. Each is a fast QS win —
launch with a single tightly-themed RSA, exact + phrase match only:

1. **Furniture Truck – Hamilton** — target `furniture truck hire hamilton`, `furniture truck hamilton`, `hamilton furniture removal truck`. Est. 880/mo, KD 20. Highest priority.
2. **12-Seater Van – Wellington** — `12 seater van hire wellington`, `12 seater minibus wellington`.
3. **12-Seater Van – Christchurch** — `12 seater van hire christchurch`, `minibus hire christchurch`.
4. **14-Seater Van – Auckland** — `14 seater van hire auckland`, `14 seater minibus auckland`.
5. **Moving Truck – Auckland** — `moving truck hire auckland`, `house moving truck auckland`. Est. 1,300/mo.
6. **Trailer Hire – Auckland** — `trailer hire auckland`, `box trailer hire auckland`, `car trailer hire auckland`. Est. 720/mo.
7. **West Auckland Van Hire** — `van hire west auckland`, `van hire henderson`. Small volume, zero competition, dedicated LP.

---

## 3. Match-type & keyword actions (still open from v1)

All actions in v1 §2 are still valid — nothing has been done at the account level yet.
Do these in the same pass as the LP repointing:

- Pause broad `+van`, `+moving +trailer +rental`, `+hireace +near +me`, `+handy +rentals`, `+car +rental +cost`
- Convert `+moving +truck +hire` → phrase `"moving truck hire"` → `/moving-truck-hire-auckland` (**LP now exists**)
- Convert `+truck +hire +wellington` / `+truck +rental +wellington` → phrase → `/truck-hire-wellington`
- Convert `12 seater van hire near me` (broad) → exact `[12 seater van hire]` → geo-split to the 3 new dedicated 12-seater LPs

---

## 4. Negatives — additions since v1

Added to `negative-keywords.csv` in this same commit:

- `caravan`, `caravan hire`, `motorhome`, `motorhome hire`, `campervan`, `campervan hire` — wrong vehicle class
- `rental agreement template`, `rental agreement form`, `tenancy` — wrong intent (paperwork lookups)
- `driving school`, `driving lessons`, `learner licence` — wrong intent
- `used van`, `van for sale nz`, `truck for sale` — buying not hiring
- `youtube`, `video`, `review video` — research intent
- `wof`, `warrant of fitness`, `rego`, `registration` — service lookups
- `airbnb`, `booking.com` — accommodation confusion

---

## 5. Budget reallocation (updated)

| Ad group | Change vs v1 | Why |
|---|---|---|
| Truck Hire (master) | Keep +30% | Still the best CPA in the account |
| Furniture Truck – Hamilton (new) | Seed $15/day | Untapped 880/mo, dedicated LP, KD 20 |
| Moving Truck – Auckland (new) | Seed $25/day | 1,300/mo, direct match to owned box trucks |
| Minibus 12/14-seater (Auck/Wgtn/Chch) (new) | Seed $8/day each | Recover CPA from generic Minibus hire group |
| Minibus hire (old catch-all) | −50% | Redistribute to the 4 geo-specific minibus groups |
| Van Hire #2 (old duplicate) | Pause | Merge into geo-split groups from v1 §1 |
| Trailer Hire – Auckland (new) | Seed $10/day | 720/mo, dedicated LP, low competition |

---

## 6. Implementation order

1. Upload the refreshed `negative-keywords.csv` (5 min)
2. Repoint existing ad groups to the new Final URLs from §1 (Final URL field per keyword — no ad-copy change needed for this pass)
3. Build the 7 new ad groups from §2 using the RSA copy blocks in `rsa-ad-copy.md` (copy Van Hire – Wellington as a template for the minibus geo-splits and Hamilton furniture truck)
4. Apply the match-type / pause actions from §3
5. Shift budget per §5
6. Wait 14 days, re-pull the search-terms report, then decide on further pruning

---

## 7. What v1 asked for that is now DONE on-site

You do **not** need to build any more landing pages before running this plan. All Final
URLs above resolve to a real page. The only outstanding site work is:

- A **thank-you / booking-confirmation** page with a distinct URL (needed for the
  `booking_complete` conversion event in v1 §6 to fire reliably against a URL trigger
  rather than a JS event)
- A **`tel:` click event** wired to Google Ads via GTM if not already firing (v1 §6 item 2)

Everything else in v1 §7 (Implementation order) is unchanged.
