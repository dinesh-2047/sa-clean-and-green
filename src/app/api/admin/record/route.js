import { requireSession } from "../../../../lib/adminAuth";
import {
  BOOKINGS,
  ENQUIRIES,
  getDb,
  isValidId,
  toObjectId,
  toPlain,
} from "../../../../lib/db";
import { bookingStatuses, enquiryStatuses } from "../../../../lib/records";
import { timeSlots } from "../../../../lib/services";

/**
 * One endpoint for both record types rather than two nearly identical dynamic
 * routes. Only the fields listed here can be written — the customer's own
 * details and their original requested date are never editable from the
 * dashboard, so there's always a record of what was actually asked for.
 */
const KINDS = {
  bookings: { collection: BOOKINGS, statuses: bookingStatuses },
  enquiries: { collection: ENQUIRIES, statuses: enquiryStatuses },
};

const DATE = /^\d{4}-\d{2}-\d{2}$/;

const bad = (message, status = 400) =>
  Response.json({ ok: false, message }, { status });

export async function PATCH(request) {
  const unauthorised = await requireSession();
  if (unauthorised) return unauthorised;

  let body;
  try {
    body = await request.json();
  } catch {
    return bad("That request couldn't be read.");
  }

  const kind = KINDS[body?.kind];
  if (!kind) return bad("Unknown record type.");
  if (!isValidId(body?.id)) return bad("That record id isn't valid.");

  const updates = {};

  if (body.status !== undefined) {
    if (!kind.statuses.some((s) => s.id === body.status)) {
      return bad("That status isn't one we recognise.");
    }
    updates.status = body.status;
  }

  if (body.confirmedDate !== undefined) {
    const date = String(body.confirmedDate || "").trim();
    if (date && !DATE.test(date)) return bad("Use a date in YYYY-MM-DD form.");
    updates.confirmedDate = date;
  }

  if (body.confirmedTimeSlot !== undefined) {
    const slot = String(body.confirmedTimeSlot || "").trim();
    if (slot && !timeSlots.some((t) => t.id === slot)) {
      return bad("That time slot isn't one we offer.");
    }
    updates.confirmedTimeSlot = slot;
  }

  if (body.adminNotes !== undefined) {
    updates.adminNotes = String(body.adminNotes || "").slice(0, 2000);
  }

  if (Object.keys(updates).length === 0) return bad("Nothing to update.");

  const db = await getDb();
  if (!db) {
    return Response.json(
      {
        ok: false,
        message:
          "The database isn't reachable right now, so that change wasn't saved.",
      },
      { status: 503 }
    );
  }

  const collection = db.collection(kind.collection);
  const _id = toObjectId(body.id);

  let existing;
  try {
    existing = await collection.findOne({ _id });
  } catch (err) {
    console.error(`[admin] read failed: ${err?.message || err}`);
    return bad("Couldn't load that record.", 500);
  }

  if (!existing) return bad("That record no longer exists.", 404);

  // Confirming without naming a date means "the date they asked for is fine".
  if (
    updates.status === "confirmed" &&
    updates.confirmedDate === undefined &&
    !existing.confirmedDate
  ) {
    updates.confirmedDate = existing.requestedDate || "";
    updates.confirmedTimeSlot =
      existing.confirmedTimeSlot || existing.requestedTimeSlot || "";
  }

  updates.updatedAt = new Date();

  try {
    await collection.updateOne({ _id }, { $set: updates });
  } catch (err) {
    console.error(`[admin] update failed: ${err?.message || err}`);
    return bad("Couldn't save that change.", 500);
  }

  return Response.json({ ok: true, record: toPlain({ ...existing, ...updates }) });
}
