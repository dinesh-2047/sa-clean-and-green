import { validateEnquiry, makeReference } from "../../../lib/validate";
import { sendAdminMail, rowsToHtml, rowsToText } from "../../../lib/mailer";
import { saveDoc, ENQUIRIES } from "../../../lib/db";

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

  const { errors, ok } = validateEnquiry(payload);
  if (!ok) {
    return Response.json(
      { ok: false, errors, message: "Please check the highlighted fields." },
      { status: 422 }
    );
  }

  const reference = makeReference("SCQ");
  const firstName = clean(payload.firstName, 80);
  const lastName = clean(payload.lastName, 80);
  const name = `${firstName} ${lastName}`.trim();
  const now = new Date();

  const doc = {
    reference,
    status: "new",
    firstName,
    lastName,
    name,
    email: clean(payload.email, 160),
    phone: clean(payload.phone, 40),
    message: clean(payload.message, 4000),
    adminNotes: "",
    createdAt: now,
    updatedAt: now,
  };

  const stored = await saveDoc(ENQUIRIES, doc);

  const rows = [
    ["Reference", reference],
    ["Type", "Website enquiry"],
    ["Name", name],
    ["Email", doc.email],
    ["Phone", doc.phone],
    ["Message", doc.message],
    ["Submitted", now.toLocaleString("en-AU", AU_TIME)],
  ];

  // Same as bookings: only worth a row when the dashboard copy didn't happen.
  if (!stored.saved) {
    rows.push([
      "Warning",
      "NOT saved to the dashboard — this email is the only copy of this enquiry",
    ]);
  }

  const mail = await sendAdminMail({
    subject: `Website enquiry ${reference} — ${name}`,
    replyTo: doc.email,
    text: `New enquiry from the website contact form.\n\n${rowsToText(rows)}\n`,
    html: `<div style="font-family:Arial,Helvetica,sans-serif;color:#0e2e43">
             <h2 style="color:#06544c;margin:0 0 4px">New website enquiry</h2>
             <p style="margin:0 0 18px;color:#4a6a7c">Reply to this email to answer the customer directly.</p>
             ${rowsToHtml(rows)}
           </div>`,
  });

  if (!mail.configured) {
    console.warn(
      `[enquiry ${reference}] email not configured, logging instead:\n${rowsToText(
        rows
      )}`
    );
  } else if (!mail.sent) {
    console.error(`[enquiry ${reference}] send failed: ${mail.error}`);
  }

  if (!stored.saved && !mail.sent) {
    console.error(
      `[enquiry ${reference}] nothing recorded:\n${rowsToText(rows)}`
    );
    return Response.json(
      {
        ok: false,
        message:
          "We couldn't get that through to our team. Please call us on +61 415 121 566 and we'll help straight away.",
      },
      { status: 502 }
    );
  }

  return Response.json({ ok: true, reference, delivered: mail.sent });
}
