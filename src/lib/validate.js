/**
 * Shared validation used by the forms in the browser and by the route
 * handlers on the server, so the rules can't drift apart.
 */
import { services, frequencies, propertyTypes, timeSlots } from "./services";

const EMAIL = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;

const str = (v) => (typeof v === "string" ? v.trim() : "");
const digits = (v) => str(v).replace(/[^\d]/g, "");

export const isEmail = (v) => EMAIL.test(str(v));

/** Australian numbers land between 8 and 12 digits once formatting is gone. */
export const isPhone = (v) => {
  const d = digits(v);
  return d.length >= 8 && d.length <= 12;
};

/** Today in the browser's local time, as YYYY-MM-DD — used for `min` on date inputs. */
export const todayISO = () => {
  const d = new Date();
  const off = d.getTimezoneOffset();
  return new Date(d.getTime() - off * 60_000).toISOString().slice(0, 10);
};

export function validateBooking(data = {}) {
  const e = {};

  if (!str(data.firstName)) e.firstName = "First name is required";
  if (!str(data.lastName)) e.lastName = "Last name is required";
  if (!str(data.email)) e.email = "Email is required";
  else if (!isEmail(data.email)) e.email = "That email doesn't look right";
  if (!str(data.phone)) e.phone = "Contact number is required";
  else if (!isPhone(data.phone)) e.phone = "Enter a valid contact number";
  if (!str(data.suburb)) e.suburb = "Suburb or area is required";
  if (!str(data.address)) e.address = "Street address is required";
  if (!str(data.propertyType)) e.propertyType = "Pick a property type";
  else if (!propertyTypes.some((p) => p.id === data.propertyType))
    e.propertyType = "Pick a property type from the list";

  if (!str(data.date)) e.date = "Choose a preferred date";
  else if (str(data.date) < todayISO()) e.date = "Pick today or a later date";

  if (!str(data.timeSlot)) e.timeSlot = "Choose a preferred time";
  else if (!timeSlots.some((t) => t.id === data.timeSlot))
    e.timeSlot = "Choose a time from the list";

  if (!frequencies.some((f) => f.id === data.frequency))
    e.frequency = "Choose how often you need us";

  const picked = Array.isArray(data.services) ? data.services : [];
  const valid = picked.filter((id) => services.some((s) => s.id === id));
  if (valid.length === 0) e.services = "Select at least one service";

  return { errors: e, ok: Object.keys(e).length === 0 };
}

export function validateEnquiry(data = {}) {
  const e = {};
  if (!str(data.firstName)) e.firstName = "First name is required";
  if (!str(data.lastName)) e.lastName = "Last name is required";
  if (!str(data.email)) e.email = "Email is required";
  else if (!isEmail(data.email)) e.email = "That email doesn't look right";
  if (!str(data.phone)) e.phone = "Contact number is required";
  else if (!isPhone(data.phone)) e.phone = "Enter a valid contact number";
  if (!str(data.message)) e.message = "Tell us what you need";
  else if (str(data.message).length < 10)
    e.message = "A little more detail helps us quote accurately";

  return { errors: e, ok: Object.keys(e).length === 0 };
}

/** Human-friendly reference shown to the customer and used in the email subject. */
export function makeReference(prefix = "SCG") {
  const now = new Date();
  const stamp = [
    String(now.getFullYear()).slice(2),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
  ].join("");
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `${prefix}-${stamp}-${rand}`;
}
