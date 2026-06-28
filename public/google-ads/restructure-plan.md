# James Blond — Google Ads Restructure Plan

Period analysed: 6 Feb – 2 Jun 2026 · Spend $14,611 · 3,255 clicks · 781 conv · avg CPA ~$18.70

## 1. Ad group restructure

| Action | From | To |
|---|---|---|
| **Pause / merge** | `Truck` (CPA $41.93) | Move converting keywords into `Truck Hire` (CPA $9.92) |
| **Pause / merge** | `Ad group 1` (generic catch-all) | Split into branded + product ad groups |
| **Split by geo** | `Van Hire` (CPA $22.90) | `Van Hire – Auckland`, `Van Hire – Wellington`, `Van Hire – Christchurch` |
| **Pause** | `Van Hire #2` (CPA $32.27, duplicate) | Migrate top performers into the new geo-split groups |
| **Keep & scale** | `Truck Hire` (CPA $9.92) ✅ | +30% budget |
| **Keep** | `Minibus hire` (CPA $18.59) | Audit landing page = `/auckland-airport-minibus-rentals-hire` |
| **Keep** | `Rebranding – Vancy to James Blond` (CPA $7.87) | Keep running as a defensive brand-rebrand campaign |

## 2. Match-type cleanup

Convert these broad-match keywords to **phrase** or **exact** (47 clicks, 0 conv each came from broad):

- `+rent +a +moving +van` → phrase: `"moving van hire"` → LP `/fleet/vans/jumbo-van`
- `+moving +truck +hire` → phrase: `"moving truck hire"` → LP `/truck-hire/moving-truck-hire`
- `+van +rental +near +me` → phrase: `"van rental near me"` + geo target NZ only
- `+van` (single word, broad) → **Pause**. Too generic.
- `+moving +trailer +rental` → **Pause**. Not a core product.
- `+truck +rental +wellington` → phrase: `"truck rental wellington"` → LP `/truck-hire-wellington`
- `+truck +hire +wellington` → phrase: `"truck hire wellington"` → LP `/truck-hire-wellington`
- `+hireace +near +me` → **Pause** (competitor brand)
- `+handy +rentals` → **Pause** (competitor brand)
- `+car +rental +cost` → **Pause** (research intent)
- `12 seater van hire near me` (broad) → exact: `[12 seater van hire]` → LP `/wellington-minibus-hire`

## 3. Negative keywords

Upload `negative-keywords.csv` to a new shared negative list called
**"JB Master Negatives 2026-06"** and apply it to every campaign.

## 4. Landing page mapping

Repoint these ad groups to dedicated LPs to lift Quality Score:

| Ad group / keyword theme | Current LP | New LP |
|---|---|---|
| Van Hire – Wellington | `/` (homepage) | `/van-hire-wellington` |
| Van Hire – Christchurch | `/` | `/van-hire-christchurch` |
| Van Hire – West Auckland | `/` | `/west-auckland-van-hire` (NEW — just built) |
| Cargo Van – Auckland | `/fleet/vans` | `/auckland-airport-cargo-van-rentals-hire` |
| Cargo Van – Wellington | `/fleet/vans` | `/cargo-van-hire-wellington` |
| Truck Hire – Wellington | `/` | `/truck-hire-wellington` |
| Truck Hire – Christchurch | `/` | `/truck-hire-christchurch` |
| Moving Truck – Auckland | `/` | `/moving-truck-hire-auckland` |
| Tipper | `/` | `/tipper-truck-hire` |
| Tail-lift / box truck | `/fleet/trucks` | `/fleet/trucks/2-tonne-box-12m3-tail` |
| Minibus / 12-seater | `/` | `/wellington-minibus-hire` |

## 5. Budget reallocation

| Ad group | Now | Change | Why |
|---|---|---|---|
| Truck Hire | $1,288 | **+30%** | Best CPA ($9.92), scale |
| Van Hire – Auckland (new) | – | Take 60% of old Van Hire #2 budget | Highest intent geo |
| Van Hire – Wellington (new) | – | Take 25% | Proven $16 CPA |
| Van Hire – Christchurch (new) | – | Take 15% | Building presence |
| Truck (old) | $618 | **Pause** | $41.93 CPA — merge into Truck Hire |
| Ad group 1 | $418 | **−50%** | Generic catch-all |
| Brand (James Blond) | n/a | **+ ringfence** | $5.14 CPA — defend against competitor bidding |

## 6. Conversion tracking checklist

Verify in Google Ads → Tools → Conversions that the following events fire and are set to **Primary**:

1. `booking_complete` (purchase confirmation page)
2. `phone_click` (tel: link click)
3. `form_submit` (contact / quote form)
4. `quote_started` (booking step 1)

If `booking_complete` shows ~780 conv in 4 months, that maps roughly to actual bookings — sanity-check against your Booking_Export CSVs. If counts diverge by >20%, the tag is double-firing or the conversion window is wrong.

## 7. Implementation order

1. Upload negative-keyword list (5 min, immediate impact)
2. Pause the 8 broad-match keywords listed above
3. Repoint landing pages (Final URL field per keyword)
4. Pause `Truck` ad group
5. Build new geo-split Van Hire ad groups
6. Rotate in new RSAs (see `rsa-ad-copy.md`)
7. Shift budget per section 5
8. Wait 14 days, re-pull search-terms report