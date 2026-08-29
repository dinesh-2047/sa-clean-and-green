/**
 * Outbound mail. Deliberately fail-soft in two ways:
 *
 *  - If the EMAIL_* env vars aren't set (a fresh clone, or local dev), nothing
 *    is sent and `configured: false` comes back so the route can log instead of
 *    pretending a message went out.
 *  - nodemailer is imported lazily so a missing/broken SMTP setup can never
 *    break a page render.
 *
 * Bookings and enquiries are also written to MongoDB for the admin dashboard,
 * so a send failure alone doesn't lose a submission — see the route handlers.
 */

let cached = null;

function readConfig() {
  const host = process.env.EMAIL_HOST;
  const port = Number(process.env.EMAIL_PORT || 587);
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;

  if (!host || !user || !pass) return null;

  return {
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  };
}

async function getTransport() {
  if (cached) return cached;

  const config = readConfig();
  if (!config) return null;

  const { createTransport } = await import("nodemailer");
  cached = createTransport(config);
  return cached;
}

/** Where admin notifications land. Falls back to the sending account. */
export function adminAddress() {
  return process.env.ADMIN_EMAIL || process.env.EMAIL_USER || "";
}

/**
 * @returns {Promise<{ configured: boolean, sent: boolean, error?: string }>}
 */
export async function sendAdminMail({ subject, text, html, replyTo }) {
  const transport = await getTransport();
  if (!transport) return { configured: false, sent: false };

  const to = adminAddress();
  if (!to) return { configured: false, sent: false };

  try {
    await transport.sendMail({
      from: `"SA Clean & Green website" <${process.env.EMAIL_USER}>`,
      to,
      replyTo: replyTo || undefined,
      subject,
      text,
      html,
    });
    return { configured: true, sent: true };
  } catch (err) {
    return { configured: true, sent: false, error: err?.message || "send failed" };
  }
}

/** Tiny helper so the HTML emails stay readable without a template engine. */
export function escapeHtml(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function rowsToHtml(rows) {
  const body = rows
    .filter(([, value]) => value !== undefined && value !== null && value !== "")
    .map(
      ([label, value]) =>
        `<tr>
           <td style="padding:8px 14px;background:#f2f8f6;font-weight:700;color:#06544c;border-bottom:1px solid #dceee9;white-space:nowrap;vertical-align:top">${escapeHtml(
             label
           )}</td>
           <td style="padding:8px 14px;border-bottom:1px solid #dceee9;color:#0e2e43">${escapeHtml(
             value
           ).replace(/\n/g, "<br>")}</td>
         </tr>`
    )
    .join("");

  return `<table role="presentation" cellpadding="0" cellspacing="0" style="border-collapse:collapse;width:100%;max-width:640px;font-family:Arial,Helvetica,sans-serif;font-size:14px">${body}</table>`;
}

export function rowsToText(rows) {
  return rows
    .filter(([, value]) => value !== undefined && value !== null && value !== "")
    .map(([label, value]) => `${label}: ${value}`)
    .join("\n");
}
