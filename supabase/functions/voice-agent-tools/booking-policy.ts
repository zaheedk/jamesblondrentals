import { z } from "npm:zod@3.23.8";

export const callbackSchema = z.object({
  name: z.string().trim().min(1).max(120),
  phone: z.string().trim().regex(/^\+?[\d ()-]{7,25}$/),
  email: z.string().trim().email().max(320).optional(),
  topic: z.string().trim().max(2000).default("General enquiry"),
  preferred_time: z.string().trim().max(120).default("any time"),
});

export const quoteSchema = z.object({
  request_id: z.string().trim().min(8).max(120),
  first_name: z.string().trim().min(1).max(120),
  last_name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(320),
  phone: z.string().trim().regex(/^\+?[\d ()-]{7,25}$/),
  branch: z.string().trim().min(1).max(120),
  dropoff_branch: z.string().trim().min(1).max(120).optional(),
  pickup_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  dropoff_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  pickup_time: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/),
  dropoff_time: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/),
  vehicle_category_id: z.coerce.number().int().positive(),
  driver_age_id: z.coerce.number().int().positive(),
  confirmed_details: z.literal(true),
});

export function verifiedBooking(info: Record<string, unknown>, expectedAmount: number) {
  const status = String(info.reservationstatus ?? "").toLowerCase();
  const paid = Number(info.payment);
  return Number.isFinite(paid) && paid + 0.005 >= expectedAmount && expectedAmount > 0
    && info.isquotation === false && info.isonrequest === false
    && ["reservation", "confirmed", "hired", "booking"].includes(status);
}