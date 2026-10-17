# Roadmap

## TNZ pickup reminders
- [x] Use secure activation links for unactivated customers and login links for activated customers with missing details; routing tests passed, real activation unverified on external Supabase
- [x] Securely store TNZ authentication
- [x] Replace Twilio for day-before pickup texts, preserving email and deduplication
- [x] Run eight phone/provider tests and deploy the TNZ reminder sender
- [x] Add a Send test text dialog to desktop and mobile Admin Tools using the existing admin session
- [x] Send sample and verify TNZ delivery — owner received the test text on their mobile (17 Oct)
- [x] Put the brand on its own first line and use "assistance" wording in the pick-up text
- [ ] Turn day-before texts back on — blocked: TNZ account is trial only; user will confirm when it is live

## Truck hire nearby and city search
- [x] Strengthen the existing national and moving-truck pages for broad and nearby searches
- [x] Add accurate collection addresses and related-city links to existing truck pages
- [x] Align city and national search descriptions and verify the pages

## Truck licence consistency
- [x] Replace blanket 3-tonne licence claims across pages, FAQs and search descriptions with vehicle-specific guidance
- [x] Verify Auckland and 3-tonne detail pages show consistent guidance

## Caprice broker integration
- [x] Review Caprice's published API contract and existing RCM broker architecture
- [x] Record contract, endpoint requirements and onboarding checklist
- [ ] Verify Caprice-specific RCM operation mappings — blocked by missing Caprice RCM agency credentials
- [ ] Implement and test the supported integration — blocked by declined secure setup form (appId, shared password, vendor code, RCM credentials)
- [ ] Configure broker credentials and verify the connection with Caprice — blocked by missing credentials, agreed commercial terms and test contact; hosted management read also returned an authorization error

## Hamilton hire page
- [x] Add a car, van and truck hire hub with Hamilton booking search and search-focused FAQs
- [x] Add navigation, page metadata and sitemap entry
- [x] Verify the page and Hamilton search flow

## Wellington search improvements
- [x] Prioritise available vans for Wellington van-page searches without hiding other categories
- [x] Hide unavailable vehicle prices and discount badges; use the 0800 contact number
- [x] Verify ordering and the booking selection flow

## In progress
- Customer portal additional drivers
  - [x] Move driver management from the profile navigation into individual bookings
  - [x] Let customers reuse drivers retained from earlier bookings
  - [x] Sync add, edit, and removal only to the selected open RCM booking
  - [x] Distinguish duplicate names and allow saved past drivers to be deleted
- Earn-from-your-van prospectus (PDF artifact)
  - [x] Remove utes, tipper trucks and trailers from all data, charts and copy
  - [ ] Put the real James Blond logo on the cover
  - [ ] Upgrade typography/spacing to a corporate look; vertical image panels on some pages, horizontal panels on others

## Waiting on user
- Profit & cost work plan — user to share updated Freedom 2 Drive numbers later today
  - [ ] Re-run booking analysis once numbers arrive: F2D recovery trajectory vs 2024 baseline ($204k/yr West Auckland)
  - [ ] Cost-reduction review (rent 34% + wages 44% of income were the two big items flagged)
  - [ ] Profit-growth opportunities: F2D re-marketing scale-up, Wellington growth, repeat-customer win-back (excluding F2D from "lost" business)

## In progress (new)
- [x] Simplify Midweek popup: photo + overlay text only, heading in white box, remove buttons/condition
- [ ] Search Console: publish www sitemap, submit to www property, confirm data flowing

- [ ] Resume day-before pickup texts (paused: TNZ trial account; finalise message wording, make TNZ live, then set PICKUP_SMS_ENABLED=true)
