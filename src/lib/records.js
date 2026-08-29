/**
 * Status vocabulary for bookings and enquiries.
 *
 * Kept apart from `db.js` so the admin dashboard (a client component) can use
 * the labels without dragging the MongoDB driver into the browser bundle.
 */

/** Statuses a booking moves through, in the order the admin sees them. */
export const bookingStatuses = [
  { id: "pending", label: "Pending confirmation" },
  { id: "confirmed", label: "Confirmed" },
  { id: "completed", label: "Completed" },
  { id: "cancelled", label: "Cancelled" },
];

/** Statuses for a contact-form enquiry. */
export const enquiryStatuses = [
  { id: "new", label: "New" },
  { id: "replied", label: "Replied" },
  { id: "closed", label: "Closed" },
];

export const statusLabel = (list, id) =>
  list.find((s) => s.id === id)?.label || id || "—";
