import { validateBooking, makeReference } from "../../../lib/validate";
import {
  services,
  serviceTitles,
  frequencies,
  propertyTypes,
  timeSlots,
} from "../../../lib/services";
import { sendAdminMail, rowsToHtml, rowsToText } from "../../../lib/mailer";
import { saveDoc, BOOKINGS } from "../../../lib/db";

const labelOf = (list, id) => list.find((x) => x.id === id)?.label || id || "—";

const clean = (v, max = 2000) =>
  typeof v === "string" ? v.trim().slice(0, max) : "";

const AU_TIME = { timeZone: "Australia/Melbourne" };

export async function POST(request) {
  let payload;
  try {
    payload = await request.json();
  } catch {
    return Response.json(
      { ok: false, message: "That request couldn't be read." },
      { status: 400 }
    );
  }

  const { errors, ok } = validateBooking(payload);
  if (!ok) {
    return Response.json(
      { ok: false, errors, message: "Please check the highlighted fields." },
      { status: 422 }
    );
  }

  const reference = makeReference("SCG");
  const firstName = clean(payload.firstName, 80);
  const lastName = clean(payload.lastName, 80);
  const name = `${firstName} ${lastName}`.trim();
  const suburb = clean(payload.suburb, 120);

  const chosen = (Array.isArray(payload.services) ? payload.services : []).filter(
    (id) => services.some((s) => s.id === id)
  );
  const picked = serviceTitles(chosen).join(", ");
  const now = new Date();

  // The dashboard is the record of truth, so this goes in before the email:
  // a bounced notification shouldn't lose a customer's request.
  const doc = {
    reference,
    status: "pending",
    firstName,
    lastName,
    name,
    email: clean(payload.email, 160),
    phone: clean(payload.phone, 40),
    services: chosen,
    serviceLabels: picked,
    frequency: clean(payload.frequency, 40),
    frequencyLabel: labelOf(frequencies, payload.frequency),
    propertyType: clean(payload.propertyType, 40),
    propertyTypeLabel: labelOf(propertyTypes, payload.propertyType),
    size: clean(payload.size, 80),
    suburb,
    address: clean(payload.address, 300),
    // What the customer asked for. The admin can set `confirmedDate` to
    // something else when they confirm; the request itself is never overwritten.
    requestedDate: clean(payload.date, 20),
    requestedTimeSlot: clean(payload.timeSlot, 40),
    requestedTimeLabel: labelOf(timeSlots, payload.timeSlot),
    confirmedDate: "",
    confirmedTimeSlot: "",
    notes: clean(payload.notes, 2000),
    adminNotes: "",
    createdAt: now,
    updatedAt: now,
  };

  const stored = await saveDoc(BOOKINGS, doc);

  const rows = [
    ["Reference", reference],
    ["Status", "Pending confirmation"],
    ["Name", name],
    ["Email", doc.email],
    ["Phone", doc.phone],
    ["Services", picked],
    ["Frequency", doc.frequencyLabel],
    ["Preferred date", `${doc.requestedDate} (requested — needs confirming)`],
    ["Preferred time", doc.requestedTimeLabel],
    ["Suburb / area", suburb],
    ["Full address", doc.address],
    ["Property type", doc.propertyTypeLabel],
    ["Property size", doc.size],
    ["Notes", doc.notes],
    ["Submitted", now.toLocaleString("en-AU", AU_TIME)],
  ];

  // Normally the dashboard holds the record and this email is only the alert.
  // When the database write fails the email *is* the record, so say so.
  if (!stored.saved) {
    rows.push([
      "Warning",
      "NOT saved to the dashboard — this email is the only copy of this request",
    ]);
  }

  const mail = await sendAdminMail({
    subject: `New booking request ${reference} — ${name} (${suburb})`,
    replyTo: doc.email,
    text: `New booking request from the website.\n\n${rowsToText(rows)}\n`,
    html: `<div style="font-family:Arial,Helvetica,sans-serif;color:#0e2e43">
             <h2 style="color:#06544c;margin:0 0 4px">New booking request</h2>
             <p style="margin:0 0 18px;color:#4a6a7c">Reply to this email to reach the customer directly.</p>
             ${rowsToHtml(rows)}
           </div>`,
  });

  if (!mail.configured) {
    // No SMTP in this environment — keep the details where a dev can see them.
    console.warn(
      `[booking ${reference}] email not configured, logging instead:\n${rowsToText(
        rows
      )}`
    );
  } else if (!mail.sent) {
    console.error(`[booking ${reference}] send failed: ${mail.error}`);
  }

  // Only a total loss — no database row and no email — counts as a failure.
  if (!stored.saved && !mail.sent) {
    console.error(
      `[booking ${reference}] nothing recorded:\n${rowsToText(rows)}`
    );
    return Response.json(
      {
        ok: false,
        message:
          "We couldn't get that through to our team. Please call us on +61 415 121 566 and we'll take the details.",
      },
      { status: 502 }
    );
  }

  return Response.json({ ok: true, reference, delivered: mail.sent });
}
