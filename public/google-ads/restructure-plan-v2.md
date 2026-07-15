# James Blond — Google Ads Restructure Plan v2 (2026-07 refresh)

Refresh of `restructure-plan.md` against the current live site. Since v1 (Jun 2026) the
following new landing pages have shipped and are indexable — every ad group below now
points to a dedicated LP instead of the homepage, which is the single biggest Quality
Score lever left on the account.

**New / newly-mapped landing pages since v1**

- `/12-seater-van-hire-wellington`
- `/12-seater-van-hire-christchurch`
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
4. **Moving Truck – Auckland** — `moving truck hire auckland`, `house moving truck auckland`. Est. 1,300/mo.
5. **Trailer Hire – Auckland** — `trailer hire auckland`, `box trailer hire auckland`, `car trailer hire auckland`. Est. 720/mo.
6. **West Auckland Van Hire** — `van hire west auckland`, `van hire henderson`. Small volume, zero competition, dedicated LP.

> Note: we do **not** run a 14-seater — largest passenger van in the fleet is a 12-seater. The `/14-seater-van-hire-auckland` page exists purely as an SEO redirect that explains this and pushes users to the 12-seater. Do **not** build a paid ad group for 14-seaters.

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
| Minibus 12-seater (Auck/Wgtn/Chch) (new) | Seed $8/day each | Recover CPA from generic Minibus hire group |
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

---

## 8. NEW: Trans-Tasman campaign — target Australians planning NZ trips

Aussies searching from AU IPs are ~40% of NZ inbound tourism car-hire demand and the
global brands (Hertz/Budget/Sixt) don't geo-target them hard. Two dedicated AU landing
pages now exist:

- `/car-hire-auckland-airport-from-australia`
- `/car-hire-christchurch-airport-from-australia`

### Semrush AU-market sizing (database: `au`)

| Keyword | Volume (AU) | CPC (AUD) | KDI |
|---|---|---|---|
| car rental auckland airport | 3,600/mo | $3.51 | 39 (possible) |
| car rental christchurch airport | 1,000/mo | $3.61 | 43 (possible) |
| rental car new zealand | 390/mo | $1.79 | 46 |
| cheap car hire nz | 390/mo | $2.45 | 56 |

Aussies searching from AU don't append "from australia" to the query — they use the
same terms as Kiwis. Ad targeting does the segmentation (geo = Australia); the
landing pages then reassure with AUD pricing, AU licence acceptance and no overseas
card surcharge.

### 8a. New campaign

**Campaign name:** `Search - AU - Car Hire NZ`

| Setting | Value |
|---|---|
| Network | Google Search only (no Search Partners, no Display) |
| Location targeting | Australia — "People in or regularly in" (NOT "interested in") |
| Language | English |
| Bid strategy | Manual CPC → switch to Maximise Conversions after 30 conversions |
| Daily budget | AUD $30/day to start (~NZD $33) |
| Ad schedule | 24/7 first 14 days, then dayparted to AU business hours |
| Currency | Account stays NZD; ad copy shows "from AUD $45/day" |

### 8b. Ad groups

| Ad group | Final URL | Match type | Core keywords |
|---|---|---|---|
| AU → Auckland Airport | `/car-hire-auckland-airport-from-australia` | Phrase + Exact | `"car rental auckland airport"`, `"car hire auckland airport"`, `"auckland airport car hire"`, `[car rental auckland new zealand]` |
| AU → Christchurch Airport | `/car-hire-christchurch-airport-from-australia` | Phrase + Exact | `"car rental christchurch airport"`, `"car hire christchurch"`, `[christchurch airport car hire]`, `"south island car hire"` |
| AU → NZ Road Trip / One-Way | `/one-way-car-hire` | Phrase | `"new zealand road trip car"`, `"one way car hire nz"`, `"auckland to queenstown car hire"`, `"christchurch to queenstown car"` |
| AU → General NZ Car Hire | `/fleet/cars` | Phrase | `"rental car new zealand"`, `"nz car rental"`, `"cheap car hire nz"`, `"car hire new zealand"` |

### 8c. Negative keywords (campaign-level)

Add a new shared list `JB AU Negatives 2026-07`, applied only to this campaign:

```
campervan
camper van
motorhome
rv
jucy
britz
maui
apollo
wicked
spaceships
relocation
relocations
ute
truck
van hire
moving truck
long term lease
lease
```

Rationale: AU searchers looking for campervans/motorhomes have very different intent
and much higher CPC — you don't want to compete there. Also strip out van/truck/ute
queries because those pages don't exist in AU-friendly form yet.

### 8d. RSA copy — AU → Auckland Airport

**Path:** `/car-hire` `/auckland-airport`

Headlines (15):
1. NZ Car Hire From AUD $45
2. Auckland Airport Car Hire
3. Book NZ Car Hire in AUD
4. Aussie Licence Accepted
5. No Overseas Card Fees
6. Free Airport Shuttle
7. Kiwi-Owned – Not a Chain
8. Beat Hertz & Budget by 40%
9. Sydney to Auckland? Book Here
10. Melbourne to Auckland Car Hire
11. Brisbane to Auckland Car Hire
12. Unlimited KM on All Cars
13. Same-Day Airport Pickup
14. Trusted by 10,000+ Kiwis
15. Instant Free Quote

Descriptions (4):
1. Auckland Airport car hire from AUD $45/day. Aussie licences accepted, AU cards welcome.
2. Skip the big-brand queues — Kiwi-owned depot, free shuttle from International Terminal.
3. No overseas card surcharge. Unlimited km. Perfect for North Island road trips from AU.
4. Book online in 2 minutes or call NZ 0800 525 663. Trans-Tasman travellers save 40%.

### 8e. RSA copy — AU → Christchurch Airport

**Path:** `/car-hire` `/christchurch`

Headlines (15):
1. NZ Car Hire From AUD $45
2. Christchurch Airport Car Hire
3. South Island Road Trip Ready
4. Aussie Licence Accepted
5. No Overseas Card Fees
6. Free Airport Shuttle
7. Kiwi-Owned – Not a Chain
8. Beat Hertz & Budget by 40%
9. Christchurch to Queenstown
10. Tekapo & Mount Cook Ready
11. Ski Season Chch Car Hire
12. Unlimited KM on All Cars
13. Sydney to Chch? Book Direct
14. Melbourne to Chch Car Hire
15. Instant Free Quote

Descriptions (4):
1. Christchurch Airport car hire from AUD $45/day. Perfect for South Island road trips.
2. Aussie licences accepted, AU cards welcome, no overseas card surcharge. Unlimited km.
3. Chch → Tekapo → Queenstown or Milford — the classic Aussie loop starts here.
4. Kiwi-owned, 5-minute shuttle from the International Terminal. Book online in 2 min.

### 8f. Ad extensions (campaign-level)

**Sitelinks:**
- AUD Pricing Info → `/car-hire-auckland-airport-from-australia#pricing`
- One-Way NZ Rentals → `/one-way-car-hire`
- View Full Fleet → `/fleet/cars`
- 7-Seat SUVs & Minibuses → `/fleet/minibuses`

**Callouts:** `AUD pricing` · `AU licence OK` · `No overseas card fees` · `Free airport shuttle` · `Unlimited km` · `Kiwi-owned`

**Structured snippets — Destinations:** Auckland, Christchurch, Queenstown, Rotorua, Wellington, Tekapo

### 8g. Tracking additions

- Add `?utm_source=google&utm_medium=cpc&utm_campaign=au-trans-tasman&utm_content={adgroup}` to all Final URL suffixes
- In GA4, create an audience `AU visitors — car hire pages` (country = Australia, page path contains `/car-hire`) — feed to Google Ads for observation and later retargeting
- Add `en-AU` to the site's accepted languages so AU users don't get redirected/localised weirdly by any CDN in front

### 8h. Complementary on-site work (blocking for full ROI, not for launch)

In priority order — none of these are needed to run the campaign, but each lifts AU
conversion rate:

1. **Currency toggle NZD ↔ AUD** on booking pages (live FX rate, cached daily) — biggest single lift (est. +15–25% AU conversion)
2. **AU 1800 forwarding number** displayed on both AU landing pages (perceived-local, lifts AU calls 20–40%)
3. **Blog posts targeting AU-market long-tails** — pitched at Aussies, ranks in `google.com.au`:
   - "Driving in New Zealand: what Australians need to know"
   - "Sydney to Auckland — planning your NZ car hire"
   - "South Island road trip from Christchurch: 7-day Aussie itinerary"
   - "Do I need travel insurance if I hire a car in NZ?"

### 8i. Launch checklist

- [ ] Create shared negative list `JB AU Negatives 2026-07`
- [ ] Create campaign `Search - AU - Car Hire NZ` with settings from §8a
- [ ] Build the 4 ad groups from §8b
- [ ] Add 2 RSAs per ad group (§8d and §8e; mirror the pattern for road-trip and general NZ groups)
- [ ] Attach sitelinks, callouts and structured snippets from §8f
- [ ] Apply the campaign-level negatives list
- [ ] Enable UTM auto-tagging per §8g
- [ ] Run at AUD $30/day for 14 days, then review search-term report and scale winners
