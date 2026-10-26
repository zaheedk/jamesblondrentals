# Roadmap

## Checkout clarity
- [x] Replace competing payment tiles with a card/four-installments toggle and contextual amount choices
- [x] Clarify consent and separate the pickup bond from rental charges without changing payment processing
- [x] Verify card, deposit, Klarna and consent states on desktop and narrow screens using a simulated booking; no real charge made

## Broker booking demo
- [x] Build a shareable rehearsal flow and credential-protected live API test mode
- [x] Add request/response inspection, lookup and cancellation, with explicit live-write confirmation
- [x] Test the rehearsal end-to-end and validate API safeguards
- [ ] Verify live booking and cancellation — blocked: dedicated approved broker test credentials and test-booking authorization are needed; live updates need a separate approved maintenance endpoint

## Password activation journey
- [x] Keep customers signed in after password saving and open their profile directly
- [x] Replace hash-only link checks with user verification and test successful/failed completion
- [ ] Verify a real activation link end-to-end — blocked: external Supabase session unavailable to testing tools

## TNZ pickup reminders
- [x] Show paginated pickup email/text records and TNZ delivery checks in Admin Tools; build and sender tests passed, signed-in panel verification unavailable on external Supabase
- [x] Use secure activation links for unactivated customers and login links for activated customers with missing details; routing tests passed, real activation unverified on external Supabase
- [x] Securely store TNZ authentication
- [x] Replace Twilio for day-before pickup texts, preserving email and deduplication
- [x] Run eight phone/provider tests and deploy the TNZ reminder sender
- [x] Add a Send test text dialog to desktop and mobile Admin Tools using the existing admin session
- [x] Send sample and verify TNZ delivery — owner received the test text on their mobile (17 Oct)
- [x] Put the brand on its own first line and use "assistance" wording in the pick-up text
- [x] Turn day-before texts back on — owner confirmed paid TNZ account; PICKUP_SMS_ENABLED=true

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

- [x] Resume day-before pickup texts after paid TNZ account confirmation

## Voice agent (3CX / phone assistant)
- [x] Inventory seven uploaded recording archives: 646 audio files, 641 unique, approximately 21.7 hours; expected 676 leaves 30 missing
- [ ] Transcribe and analyse every unique supplied recording, with explicit coverage and privacy-safe customer/supplier separation
- [ ] Apply supported conversation improvements and test them; supplier transfers require a verified routing list and working transfer capability
- [x] Accept confirmed email-only corrections on the same saved phone quote without duplicate booking writes; live read-back explicitly instructs "at" and "dot"; real spoken pronunciation remains caller-tested
- [x] Resend quote 17422 to the owner's confirmed corrected address and verify live assistant settings; email provider accepted sending, inbox delivery unverified
- [x] Accept and correct callback email addresses; email field deployed and attached to ElevenLabs
- [x] Create phone quotes from confirmed customer and hire details and email existing branded checkout links, with durable duplicate prevention
- [x] Read live payment and non-quotation/non-request booking status before sending phone confirmation emails
- [x] Deploy phone quote/status tools and update live ElevenLabs while preserving six knowledge documents; validate input rejection, tracking access, and live Hamilton availability
- [ ] Verify a real phone quote through paid checkout and confirmation — blocked: confirmed test-customer surname/details and payment authorization needed; current checkout also depends on customer returning from payment
- [ ] Support payment completion without customer returning from checkout — blocked: documented Windcave/RCM notification or server transaction-query contract not available; no unsupported payment conversion or polling added
- [x] Scan 249 public URLs, generate dated knowledge base from 224 content pages, attach six indexed references to ElevenLabs and verify Wellington address/hours and Mt Wellington cars/vans-only answers; excludes errors, placeholders and duplicates
- [x] Correct rejected tool authentication and prevent invented branch/callback answers; live conversation asked for return date and successfully checked Wellington CBD trucks
- [x] Build voice-agent-tools edge function (business info, live availability, callback requests)
- [x] Build voice-agent-admin edge function (creates/updates ElevenLabs agent, wires tools)
- [x] Create the ElevenLabs agent (agent_7301m5gmedjzf31rgcecyx4cg0q0) and verify tools end-to-end
- [ ] Connect a phone number (3CX AI Edition upgrade vs separate number + overflow forwarding — user checking upgrade cost with Logical Solutions)
- [ ] Test a real phone call, then go live
- [x] Settle the go-live approach: 24/7 with staff as fallback, owner configures it in 3CX, number not advertised on the website
- [ ] Point 0800 282 629 at the phone assistant in 3CX (own outbound rule + Call Flow App + DID reassignment) and verify a real mobile call — blocked: owner's hands in the 3CX console
- [ ] Restrict ElevenLabs allowed addresses to the single address calls arrive from (currently accepts any address, no password)
