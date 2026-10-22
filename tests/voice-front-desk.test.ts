import { test, expect } from "bun:test";
import { reportBreakdown, requestBookingChange, resendBookingLinks, samePhone } from "../supabase/functions/voice-agent-tools/front-desk.ts";

const booking = { status: "OK", results: {
  bookinginfo: [{ reservationref: "ABC123", reservationstatus: "Reservation", isquotation: false, isclosed: false, totalcost: 300, payment: 100, balancedue: 200,
    vehiclecategory: "Toyota Hiace", vehiclecategoryid: 12, pickuplocationid: 1, dropofflocationid: 1, driverageid: 9,
    pickupdate: "01/Dec/2099", pickuptime: "10:00", dropoffdate: "03/Dec/2099", dropofftime: "10:00", pickuplocationname: "West Auckland" }],
  customerinfo: [{ firstname: "Sam", lastname: "Lee", email: "sam@example.com", mobile: "021 555 1234" }],
} };
const id = { reservation_number: "34000", last_name: "Lee", phone: "+64215551234" };

test("NZ phone formats match on the same number", () => {
  expect(samePhone("+64 21 555 1234", "0215551234")).toBe(true);
  expect(samePhone("0215551235", "0215551234")).toBe(false);
});

test("links are resent only to the email on the booking, with a payment link when a balance is owing", async () => {
  const sent: any[] = [];
  const r: any = await resendBookingLinks({ ...id, email: "attacker@example.com" }, async () => booking, async (to, _s, text) => { sent.push({ to, text }); return "1"; });
  expect(sent[0].to).toBe("sam@example.com");
  expect(sent[0].text).toContain("/complete-booking/ABC123");
  expect(r.included_payment_link).toBe(true);
});

test("unverified callers cannot resend links", async () => {
  let mailed = false;
  await resendBookingLinks({ ...id, phone: "0219999999" }, async () => booking, async () => { mailed = true; return "1"; });
  expect(mailed).toBe(false);
});

test("change requests go to staff and are never reported as made", async () => {
  const sent: any[] = [];
  const r: any = await requestBookingChange({ ...id, extras_or_insurance: "add child seat", details: "Add a child seat" }, async () => booking, async (to, s) => { sent.push({ to, s }); return "1"; });
  expect(sent[0].to).toBe("zaheed@jamesblond.co.nz");
  expect(r.change_made).toBe(false);
});

test("breakdowns alert staff by email and text", async () => {
  const texts: string[] = [];
  const r: any = await reportBreakdown({ name: "Sam", phone: "0215551234", location: "SH1 Bombay", description: "Flat tyre", is_safe: true },
    async () => "1", async (to) => { texts.push(to); return "m"; });
  expect(r.staff_emailed).toBe(true);
  expect(texts).toEqual(["+64275353037"]);
});
