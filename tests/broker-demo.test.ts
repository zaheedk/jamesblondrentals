import { expect, test } from "bun:test";
import { createRehearsalApi, resultOf, rows } from "../src/lib/broker-demo";
import { validateDemoCall } from "../supabase/functions/broker-demo/policy";

test("live booking requires explicit production confirmation", () => {
  expect(validateDemoCall({ method: "booking", bookingtype: 2 }, false)).toBe("Confirm the production write before continuing.");
  expect(validateDemoCall({ method: "booking", bookingtype: 2 }, true)).toBeNull();
});
test("live updates cannot use the booking endpoint", () => {
  expect(validateDemoCall({ method: "editbooking" }, true)).toContain("separate approved access");
});
test("cancellation requires confirmation and returned reference/reason", () => {
  expect(validateDemoCall({ method: "cancelbooking", reservationref: "TEST", reasonid: "1" }, false)).toBe("Confirm the production write before continuing.");
  expect(validateDemoCall({ method: "cancelbooking" }, true)).toContain("reason ID");
});
test("rehearsal creates, reads, updates and cancels a booking without external calls", async () => {
  const api = createRehearsalApi();
  const setup = resultOf(await api({method:"step1"}));
  expect(rows(setup.locations)).toHaveLength(2);
  const itinerary = {pickupdate:"28/10/2026",dropoffdate:"04/11/2026",vehiclecategoryid:"demo-asx"};
  expect(rows(resultOf(await api({method:"step2",...itinerary})).availablecars)).toHaveLength(2);
  expect(rows(resultOf(await api({method:"step3",...itinerary})).insuranceoptions)).toHaveLength(2);
  const created = resultOf(await api({method:"booking",...itinerary,customer:{firstname:"Test"},insuranceid:"demo-basic"}));
  const reference = created.reservationref;
  const read = async () => rows(resultOf(await api({method:"bookinginfo",reservationref:reference})).bookinginfo)[0];
  expect((await read()).totalcost).toBe(665);
  await api({method:"editbooking",reservationref:reference,customer:{firstname:"Updated"}});
  expect((await read()).customer).toEqual({firstname:"Updated"});
  await api({method:"cancelbooking",reservationref:reference,reasonid:"demo-reason"});
  expect((await read()).bookingstatus).toBe("Cancelled");
  expect((await createRehearsalApi()({method:"bookinginfo",reservationref:reference})).status).toBe("ERR");
});