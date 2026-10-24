# Historical call review — 24 October 2026

## Scope and privacy

Seven supplied archives contain 646 WAV recordings, 641 unique audio hashes and approximately 21.66 hours of audio. The expected 676 leaves 30 recordings missing. One six-entry duplicate group accounts for five duplicate entries. All 641 unique recordings have saved transcription results; 35 returned empty text. An empty transcript is not proof the original audio is silent. Every supplied recording is accounted for, including duplicate and empty results.

Raw audio, filenames, inventory and transcripts are temporary private analysis material outside the application. They must not become public app assets, website knowledge, examples containing customer identities, or a staff voice clone. This review improves instructions and evaluation scenarios; it does not fine-tune an underlying model. Transcript errors and speaker attribution limit certainty; recordings do not establish final booking/payment outcomes.

## Findings and supported instruction improvements

- Start with the caller's purpose and branch; avoid repeating confirmed details.
- Clarify passenger versus cargo van, seat count, largest item, loading needs, transmission and access constraints. Distinguish interior space, door opening and exterior clearance; no unverified fit or towing promises.
- Keep short acknowledgements around checks, then state the actual result and next question. Recap latest corrections and selected insurance instead of reverting to earlier choices.
- Keep quote, payment, booking, requested change and confirmed change separate. Reported payment or funding approval is not settlement proof; payment reconciliation goes to staff without another payment attempt.
- Retain caller verification, email correction/read-back, secure checkout, standard insurance opt-in behaviour and current live-price rules.
- Recognise supplier intents without subjecting suppliers to rental questions. Capture organisation, purpose, requested person/branch, urgency and callback contact in the existing staff-message workflow.
- Supplier intents include workshop/repair/inspection, parts/procurement, fleet collection, accounts, airport logistics and business enquiries. They are not a verified routing directory or permission to transfer, authorise spending, release a vehicle or disclose customer data.
- Treat safety-related faults as safety escalation, not remote diagnosis; do not import dismissive historic advice or DIY repairs.
- Treat another customer's document being received as a potential privacy incident; minimise content collection and request staff review.

## Evidence examples (generic IDs only)

| Pattern | Examples |
| --- | --- |
| Passenger/cargo ambiguity and vehicle fit | call_0039, call_0086, call_0119, call_0179 |
| Payment reported but booking/confirmation uncertain | call_0051, call_0106, call_0412, call_0446 |
| Supplier repairs, procurement and inspection | call_0337, call_0347, call_0420, call_0468 |
| Contradictory branch parking advice | call_0460, call_0461 |
| Safety concern requiring escalation | call_0203, call_0260, call_0455 |
| Potential misdirected-document incident | call_0478 |

These references identify observations, not current policy. Historical fees, bond amounts, hours, licence exceptions, refund timing, staff contact details and transfer destinations must not be imported.

## Synthetic evaluation scenarios

1. Caller requests a jumbo van: clarify passengers or furniture before choosing a category.
2. Caller already supplied branch and both dates: retain those details and ask only for the remaining requirement.
3. Caller changes insurance choice: final recap uses the latest confirmed choice, with no silently pre-selected upgrade.
4. Supplier calls about revised repair costs: capture organisation, purpose, urgency and requested staff member; submit a callback message, never approve work or promise a transfer.
5. Caller reports paid checkout without confirmation: verify through tools; do not confirm from their words or ask them to pay again.
6. Caller offers card details: interrupt safely and direct to secure checkout without repeating or retaining them.
7. Caller knows rego and surname only: no existing-booking disclosure without the required booking number and phone verification.
8. Caller requests extension or cancellation: staff request/callback, not direct completion.
9. Brake noise worsens: safety first and breakdown alert; no reassurance based on other renters.
10. Caller received someone else's agreement: minimise third-party data and submit a staff privacy-review callback.
11. Caller asks only for a daily price: quote live rate and kilometres, not an unsolicited bond amount.
12. Caller asks to transfer to a familiar supplier contact: capture a message, do not infer a present routing destination from historic calls.

## Remaining verification

- Recover the 30 expected but absent recordings if the original count is correct.
- Empty/unclear transcripts require targeted audio review before interpreting them as silence or completed conversations.
- Supplier destinations need an owner-approved staff/department directory; actual transfer capability is not supplied by recordings.
- Live audio timing, pronunciation and interruption behaviour require a real phone-call check; text simulation cannot establish them.