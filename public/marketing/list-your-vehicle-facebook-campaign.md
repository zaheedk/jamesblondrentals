# Facebook Ad Campaign — List Your Vehicle

> **Objective:** Test market interest in listing private/commercial vehicles with James Blond Rentals (NZ).
> **Landing page:** `/list-your-vehicle`
> **Conversion:** "Register your interest" (mailto) / phone call

---

## Campaign Settings

| Field | Recommendation |
|-------|----------------|
| **Buying type** | Auction |
| **Campaign objective** | **Leads** (or **Traffic** if you want volume first) |
| **Advantage+ Campaign Budget** | Yes, start with $30–$50/day for 7–14 days |
| **Bid strategy** | Lowest cost (Advantage+) |
| **Attribution** | 7-day click, 1-day view |

### Why Leads objective?
A "Leads" campaign optimises delivery to people who historically click contact forms, email links, or phone numbers. The CTA on the ad points to `/list-your-vehicle`, which has mailto and tel links — so the conversion signal is a click-to-contact, not a purchase. This is exactly what a Leads objective is for.

---

## Audience targeting

### Core audience (no lookalike needed)

| Segment | Settings |
|---------|----------|
| **Locations** | New Zealand: Auckland, Wellington, Christchurch, Hamilton, Tauranga. Add rural regions (Waikato, Canterbury, Bay of Plenty) if you want utes/trucks from farms. |
| **Age** | 28–65 |
| **Gender** | All |
| **Languages** | English |
| **Detailed targeting** | Interests: Small business, Logistics, Transportation, Courier services, Construction, Self-employment, Fleet management, Business finance, Entrepreneurship, Real estate. Behaviours: Engaged shoppers, Small business owners. |
| **Placements** | Advantage+ Placements (Meta optimises automatically). The 1080x1080 square creative is used for Feed/Reels; the 1200x628 horizontal is used for Audience Network / Right Column. |

### Custom audiences (optional but recommended)
- Website visitors (past 30/90 days) who viewed `/list-your-vehicle`.
- People who clicked "mailto" or "tel" on that page (requires a pixel event, see below).
- Video viewers 50%+

---

## Creative

### Primary image (Feed / Audience Network)

- **File:** `public/marketing/list-your-vehicle-facebook-ad.png`
- **Size:** 1200 × 628 px
- **Text coverage:** Low (< 20% text area for best delivery)

### Square image (Instagram Feed / Reels / Facebook Feed)

- **File:** `public/marketing/list-your-vehicle-facebook-ad-square.png`
- **Size:** 1080 × 1080 px

### Headline options

Rotate 3–4 headlines per ad set to test hook strength:

1. **Earn 70% From Your Van or Truck**
2. **Turn Your Vehicle Into a Monthly Income**
3. **We Find Renters — You Keep 70%**
4. **List Your Van/Truck. No Joining Fee.**

### Primary text options

**Option A — Direct / benefit-led**
> Own a van, truck, ute, trailer or minibus? James Blond brings the customers, handles bookings and payments — and you keep 70% of the net rental revenue. No joining fee. Join the vehicle owner partnership today.

**Option B — Curiosity / problem-led**
> Is your work van sitting idle on weekends? Put it to work with James Blond Rentals. We list it, insure the demand, manage the paperwork and pay you 70% monthly.

**Option C — Local trust**
> Kiwis have trusted James Blond Rentals for cars, vans and trucks since 1995. Now we are looking for more commercial vehicle owners to partner with. Earn 70% net revenue — no joining fee.

### Description

> NZ-wide vehicle owner partnership. No joining fee. 70% revenue share.

### Call to action

**Learn More** (best for low-friction interest)  
**Sign Up** (if you later add a lead form)  
**Contact Us** (if phone is the main goal)

### Destination URL (with tracking)

```
https://jamesblond.co.nz/list-your-vehicle?utm_source=facebook&utm_medium=cpc&utm_campaign=list_your_vehicle&utm_content=feed_ad_70pct
```

---

## Lead form alternative (recommended)

If you want to measure interest directly, create an **Instant Form** in Ads Manager instead of sending traffic to the site. Ask for:

1. Name
2. Email
3. Phone
4. Vehicle type (multiple choice: Van, Truck, Ute, Trailer, Minibus, Other)
5. City/region
6. Approximate year/model

This gives you a clear lead count and lets you follow up quickly. You can still run the landing-page version as a second ad set to compare CPL.

---

## Meta Pixel events

The existing Meta Pixel is installed on the site. We have added the following events on the `/list-your-vehicle` landing page:

- `ViewContent` — fires when the page loads
- `Lead` — fires when the user clicks the "Register your interest" email button
- `Contact` — fires on any phone/email click

In Ads Manager, create a custom conversion for:
- `Contact` events on URL contains `/list-your-vehicle`
- Use this as the campaign optimisation event.

---

## Budget & success benchmarks

| Phase | Duration | Daily budget | Optimise for |
|-------|----------|--------------|--------------|
| **Test** | 7 days | $30–$50/day | Link clicks / Landing page views |
| **Validate** | 7 days | $50–$80/day | Lead / Contact events |
| **Scale** | Ongoing | $80–$150/day | Cost per lead (CPL) |

**Success signals:**
- CTR > 1% on feed
- CPC < $1.50 NZD
- CPL (contact click) < $15–$25 NZD
- 10+ contact clicks in first 7 days = viable interest

---

## A/B test plan

| Test | Variable | Hypothesis |
|------|----------|------------|
| 1 | Headline: "70%" vs "monthly income" | Percentage splits may outperform vague income claims |
| 2 | Creative: vehicle pair vs single van | Two vehicles may signal more categories |
| 3 | CTA: "Learn More" vs "Contact Us" | Learn More may lower friction |
| 4 | Audience: small business vs all vehicle owners | Interest layering may improve CPL |

---

## What to watch in the first 7 days

1. **Cost per link click** — if above $3, tighten audience or refresh creative.
2. **Frequency** — keep under 2.0 in the first week to avoid fatigue.
3. **Relevance score / Quality ranking** — aim for Above Average.
4. **Email volume** — track `info@jamesblond.co.nz` with subject "List my vehicle with James Blond".
5. **Phone calls** — ask "How did you hear about us?" and log "Facebook ad".

---

## Next steps

1. Upload both creative files to Ads Manager.
2. Create the campaign with the settings above.
3. Use the UTM-tagged URL as the destination.
4. Add a custom conversion for `Contact` events on `/list-your-vehicle`.
5. Run the test budget for 7 days, then review CPL and lead quality.
6. If CPL is acceptable, build a dedicated lead form (Instant Form) to reduce friction further.

