"use client";

import { useRef, useState } from "react";
import Icon from "./Icons";
import {
  services,
  frequencies,
  propertyTypes,
  timeSlots,
} from "../lib/services";
import { validateBooking, todayISO } from "../lib/validate";

const blank = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  suburb: "",
  address: "",
  propertyType: "",
  size: "",
  date: "",
  timeSlot: "",
  frequency: "one-off",
  services: [],
  notes: "",
};

const sizes = [
  "Studio / 1 bedroom",
  "2 bedrooms",
  "3 bedrooms",
  "4 bedrooms",
  "5+ bedrooms",
  "Commercial space",
];

function Field({ id, label, error, hint, required, children }) {
  return (
    <div className="field">
      <label htmlFor={id}>
        {label} {required ? <span className="req">*</span> : null}
      </label>
      {children}
      {hint && !error ? <p className="hint">{hint}</p> : null}
      {error ? (
        <p className="err" id={`${id}-error`}>
          <Icon name="alert" />
          {error}
        </p>
      ) : null}
    </div>
  );
}

export default function BookingForm({ preselect = [] }) {
  const [form, setForm] = useState({ ...blank, services: preselect });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle");
  const [reference, setReference] = useState("");
  const [failMessage, setFailMessage] = useState("");
  const topRef = useRef(null);

  const set = (key) => (e) => {
    const value = e.target.value;
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((x) => ({ ...x, [key]: undefined }));
  };

  const toggleService = (id) => {
    setForm((f) => ({
      ...f,
      services: f.services.includes(id)
        ? f.services.filter((s) => s !== id)
        : [...f.services, id],
    }));
    if (errors.services) setErrors((x) => ({ ...x, services: undefined }));
  };

  const submit = async (e) => {
    e.preventDefault();
    const { errors: found, ok } = validateBooking(form);
    setErrors(found);

    if (!ok) {
      // Put the first problem in view instead of leaving people hunting.
      const first = document.getElementById(Object.keys(found)[0]);
      first?.scrollIntoView({ block: "center", behavior: "smooth" });
      first?.focus({ preventScroll: true });
      return;
    }

    setStatus("sending");
    setFailMessage("");

    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.ok) {
        if (data.errors) setErrors(data.errors);
        throw new Error(data.message || "We couldn't send that through.");
      }

      setReference(data.reference || "");
      setStatus("done");
      topRef.current?.scrollIntoView({ block: "nearest" });
    } catch (err) {
      setStatus("error");
      setFailMessage(
        err.message ||
          "Something went wrong on our end. Please call us and we'll take the details over the phone."
      );
    }
  };

  if (status === "done") {
    return (
      <div className="done" ref={topRef}>
        <div className="done-mark">
          <Icon name="check" />
        </div>
        <h3 className="h-card">Request received — thank you!</h3>
        <p className="t-muted" style={{ maxWidth: "44ch" }}>
          Our team will review your preferred time and get back to you with a
          confirmed slot and a fixed quote. If the date you picked is already
          booked out, we&apos;ll suggest the closest one we have.
        </p>
        {reference ? (
          <p className="done-ref">Reference {reference}</p>
        ) : null}
        <p className="hint">
          Nothing has been charged. We will contact you through the information
          you provided as soon as possible — keep an eye on your phone and your
          inbox, junk folder included.
        </p>
      </div>
    );
  }

  return (
    <form className="form" onSubmit={submit} noValidate ref={topRef}>
      <fieldset className="fieldset" id="services" tabIndex={-1}>
        <legend>1. Which services do you need?</legend>
        <div className="pick-grid">
          {services.map((s) => (
            <label className="pick" key={s.id}>
              <input
                type="checkbox"
                name="services"
                value={s.id}
                checked={form.services.includes(s.id)}
                onChange={() => toggleService(s.id)}
              />
              <span className="pick-box">
                <Icon name="check" />
              </span>
              <span className="pick-text">
                {s.title}
                <small>{s.short}</small>
              </span>
            </label>
          ))}
        </div>
        {errors.services ? (
          <p className="err" id="services-error">
            <Icon name="alert" />
            {errors.services}
          </p>
        ) : null}
      </fieldset>

      <fieldset className="fieldset">
        <legend>2. Your details</legend>
        <div className="form-grid-2">
          <Field id="firstName" label="First name" required error={errors.firstName}>
            <input
              id="firstName"
              name="firstName"
              className="input"
              autoComplete="given-name"
              value={form.firstName}
              onChange={set("firstName")}
              aria-invalid={Boolean(errors.firstName)}
            />
          </Field>
          <Field id="lastName" label="Last name" required error={errors.lastName}>
            <input
              id="lastName"
              name="lastName"
              className="input"
              autoComplete="family-name"
              value={form.lastName}
              onChange={set("lastName")}
              aria-invalid={Boolean(errors.lastName)}
            />
          </Field>
        </div>
        <div className="form-grid-2">
          <Field id="email" label="Email" required error={errors.email}>
            <input
              id="email"
              name="email"
              type="email"
              className="input"
              autoComplete="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={set("email")}
              aria-invalid={Boolean(errors.email)}
            />
          </Field>
          <Field
            id="phone"
            label="Contact number"
            required
            error={errors.phone}
          >
            <input
              id="phone"
              name="phone"
              type="tel"
              className="input"
              autoComplete="tel"
              placeholder="+61 4XX XXX XXX"
              value={form.phone}
              onChange={set("phone")}
              aria-invalid={Boolean(errors.phone)}
            />
          </Field>
        </div>
      </fieldset>

      <fieldset className="fieldset">
        <legend>3. Where are we cleaning?</legend>
        <div className="form-grid-2">
          <Field
            id="suburb"
            label="Suburb / area"
            required
            error={errors.suburb}
          >
            <input
              id="suburb"
              name="suburb"
              className="input"
              placeholder="e.g. Plympton"
              value={form.suburb}
              onChange={set("suburb")}
              aria-invalid={Boolean(errors.suburb)}
            />
          </Field>
          <Field
            id="propertyType"
            label="Property type"
            required
            error={errors.propertyType}
          >
            <select
              id="propertyType"
              name="propertyType"
              className="select"
              value={form.propertyType}
              onChange={set("propertyType")}
              aria-invalid={Boolean(errors.propertyType)}
            >
              <option value="">Choose one…</option>
              {propertyTypes.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label}
                </option>
              ))}
            </select>
          </Field>
        </div>
        <Field
          id="address"
          label="Full street address"
          required
          error={errors.address}
          hint="Unit or level number, street, and postcode."
        >
          <input
            id="address"
            name="address"
            className="input"
            autoComplete="street-address"
            placeholder="12 Example Street, Plympton SA 5038"
            value={form.address}
            onChange={set("address")}
            aria-invalid={Boolean(errors.address)}
          />
        </Field>
        <Field id="size" label="Property size" hint="Optional — helps us quote accurately.">
          <select
            id="size"
            name="size"
            className="select"
            value={form.size}
            onChange={set("size")}
          >
            <option value="">Prefer not to say</option>
            {sizes.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </Field>
      </fieldset>

      <fieldset className="fieldset">
        <legend>4. When suits you?</legend>
        <div className="form-grid-2">
          <Field
            id="date"
            label="Preferred date"
            required
            error={errors.date}
          >
            <input
              id="date"
              name="date"
              type="date"
              className="input"
              min={todayISO()}
              value={form.date}
              onChange={set("date")}
              aria-invalid={Boolean(errors.date)}
            />
          </Field>
          <Field
            id="timeSlot"
            label="Preferred time"
            required
            error={errors.timeSlot}
          >
            <select
              id="timeSlot"
              name="timeSlot"
              className="select"
              value={form.timeSlot}
              onChange={set("timeSlot")}
              aria-invalid={Boolean(errors.timeSlot)}
            >
              <option value="">Choose a window…</option>
              {timeSlots.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.label}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <div className="field">
          <label id="frequency-label">How often?</label>
          <div className="pill-group" role="radiogroup" aria-labelledby="frequency-label">
            {frequencies.map((f) => (
              <label className="pill" key={f.id}>
                <input
                  type="radio"
                  name="frequency"
                  value={f.id}
                  checked={form.frequency === f.id}
                  onChange={set("frequency")}
                />
                <span>{f.label}</span>
              </label>
            ))}
          </div>
        </div>

        <p className="form-note">
          <Icon name="info" />
          <span>
            Your date and time are a request, not a locked booking. We will
            contact you through the information you provide as soon as possible
            to confirm it — or to offer you the nearest slot we have.
          </span>
        </p>
      </fieldset>

      <Field
        id="notes"
        label="Anything else we should know?"
        hint="Parking, pets, access or key details, stubborn spots, an agent's exit checklist — all useful."
      >
        <textarea
          id="notes"
          name="notes"
          className="textarea"
          rows={4}
          value={form.notes}
          onChange={set("notes")}
        />
      </Field>

      {status === "error" ? (
        <p className="form-alert" role="alert">
          <Icon name="alert" />
          <span>{failMessage}</span>
        </p>
      ) : null}

      <button
        type="submit"
        className="btn btn-primary btn-lg btn-block"
        disabled={status === "sending"}
      >
        <Icon name={status === "sending" ? "clock" : "send"} />
        {status === "sending" ? "Sending your request…" : "Send booking request"}
      </button>
    </form>
  );
}
