// Look up an existing booking by number once the caller is verified
// (booking number + surname + phone on the booking). Only safe fields are
// returned — never names, contact details, licence data or card information.
import { verifyCaller } from "./front-desk.ts";

type RcmCall = (method: string, payload: Record<string, unknown>) => Promise<any>;
const number = (value: unknown) => Number(value) || 0;

export async function checkBookingByNumber(p: Record<string, unknown>, rcm: RcmCall) {
  const v = await verifyCaller(p, rcm);
  if (!("ok" in v)) return v;
  const info = v.info;
  const paid = number(info.payment);
  const total = number(info.totalrateafterdiscount) || number(info.totalcost);
  const isQuote = info.isquotation === true || info.isonrequest === true;
  return {
    found: true,
    reservation_number: v.reservation_number,
    status: String(info.reservationstatus || "unknown"),
    is_quote_only: isQuote,
    vehicle: info.vehiclecategory || "Vehicle",
    registration: info.isvehicleallocated ? info.vehicle_registrationnumber || null : null,
    pickup: { date: info.pickupdate, time: info.pickuptime, branch: info.pickuplocationname },
    dropoff: { date: info.dropoffdate, time: info.dropofftime, branch: info.dropofflocationname },
    total_nzd: total > 0 ? total : null,
    amount_paid_nzd: paid > 0 ? paid : 0,
    balance_nzd: total > 0 ? Math.max(total - paid, 0) : null,
    note: "Caller verified. Share status, vehicle, registration, pickup/return details and amounts. Never read out the email, licence or payment card details. For changes use request_booking_change; to resend links use resend_booking_links; cancellations and refunds need a callback. If is_quote_only is true, it is an unpaid quote, not a confirmed booking.",
  };
}
