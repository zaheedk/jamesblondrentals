// Look up any existing booking by its 5-digit reservation number, whatever
// channel it was made through (website, staff, phone quote). Only safe,
// non-personal fields are returned to the model — never names, contact
// details, licence data or card information.

type RcmCall = (method: string, payload: Record<string, unknown>) => Promise<any>;
const number = (value: unknown) => Number(value) || 0;

export async function checkBookingByNumber(p: Record<string, unknown>, rcm: RcmCall) {
  const reservationNo = String(p.reservation_number || "").trim();
  if (!/^\d{4,7}$/.test(reservationNo)) {
    return { error: "Ask the caller for the 5-digit booking number from their confirmation email, then retry." };
  }
  const lastName = String(p.last_name || "").trim();
  const response = await rcm("bookinginfo", { reservationno: reservationNo, ...(lastName ? { lastname: lastName } : {}) });
  if (response?.status !== "OK" || !response?.results?.bookinginfo?.length) {
    if (!lastName) {
      return { error: `Booking ${reservationNo} was not found on the number alone. Ask the caller for the last name on the booking, then retry with last_name.` };
    }
    return { error: `No booking found for number ${reservationNo} under that last name. Ask the caller to double-check both from their confirmation email; if it still fails, offer a callback.` };
  }
  const info = response.results.bookinginfo[0];
  const status = String(info.reservationstatus || "unknown");
  const paid = number(info.payment);
  const total = number(info.totalrateafterdiscount) || number(info.totalcost);
  const isQuote = info.isquotation === true || info.isonrequest === true;
  return {
    found: true,
    reservation_number: reservationNo,
    status,
    is_quote_only: isQuote,
    vehicle: info.vehiclecategory || "Vehicle",
    pickup: { date: info.pickupdate, time: info.pickuptime, branch: info.pickuplocationname },
    dropoff: { date: info.dropoffdate, time: info.dropofftime, branch: info.dropofflocationname },
    total_nzd: total > 0 ? total : null,
    amount_paid_nzd: paid > 0 ? paid : 0,
    balance_nzd: total > 0 ? Math.max(total - paid, 0) : null,
    note: "Share only these details with the caller: status, vehicle, pickup and return date/time/branch, and amounts. If the caller wants to change or cancel the booking, or asks about anything not listed here (names, contact details, licence, payment method), take a callback request — you cannot see or change those. If is_quote_only is true, it is an unpaid quote, not a confirmed booking.",
  };
}
