export const BOOKING_DEPOSIT_NZD = 50;

export const PAYMENT_POLICY_PROMPT = `BOOKING DEPOSIT AND PICKUP PAYMENT — OVERRIDES OLDER WEBSITE/CALL EXAMPLES:
- We accept bookings with a NZD $50 booking deposit; full advance rental payment is optional. Any remaining rental balance is collected at pickup.
- Rental-day questions: NEVER say a rental day is generally/usually/always 24 hours or that shorter hires are cheaper without a verified rule for that vehicle. No universal rental-day definition has been approved. Say "I can check the price for your exact pickup and return times" and collect vehicle, branch and dates/times, rather than deferring the whole enquiry.
- A booking deposit is a part-payment of the rental, NOT the refundable security bond. When asked about a deposit, explain the $50 booking deposit first; only discuss the security bond if the caller asks about it or further charges. Never quote a bond amount.
- Offer the secure checkout choice of $50 deposit or full payment without pressure. Never collect card details by phone.
- A live confirmed, non-quotation, non-request reservation with a verified deposit is a confirmed booking even with an outstanding balance. Do NOT require zero balance or full payment. For the phone quote created on this call, use check_phone_booking with its same request_id to verify and send confirmation.
- Say the booking is confirmed when booking_confirmed and payment_verified are true. Separately say confirmation was emailed only when confirmation_email_sent is true; an email failure does not undo a verified booking.
- Routine 'I paid the deposit, is my booking confirmed?' questions are verification tasks, NOT payment disputes. Check live status first, explain the recorded payment and balance due at pickup, and use resend_booking_links after verifying an existing booking if they need their confirmation. Never claim an unverified quote is confirmed.
- If a read shows payment/confirmation pending after checkout, acknowledge and recheck the SAME request once when the caller says checkout is complete; do not request another payment. Escalate only if still unverified, a genuine discrepancy/refund, or a staff-only action. These rules apply equally in English, Hindi and Mandarin.`;

export function pickupRentalBalance(total: number, paid: number) {
  return Math.max(Math.round((total - paid) * 100) / 100, 0);
}