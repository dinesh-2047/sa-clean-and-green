"use client";

import { useState } from "react";
import Icon from "./Icons";
import { validateEnquiry } from "../lib/validate";

const blank = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  message: "",
};

export default function ContactForm() {
  const [form, setForm] = useState(blank);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle");
  const [reference, setReference] = useState("");
  const [failMessage, setFailMessage] = useState("");

  const set = (key) => (e) => {
    const value = e.target.value;
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((x) => ({ ...x, [key]: undefined }));
  };

  const submit = async (e) => {
    e.preventDefault();
    const { errors: found, ok } = validateEnquiry(form);
    setErrors(found);

    if (!ok) {
      const first = document.getElementById(`c-${Object.keys(found)[0]}`);
      first?.scrollIntoView({ block: "center", behavior: "smooth" });
      first?.focus({ preventScroll: true });
      return;
    }

    setStatus("sending");
    setFailMessage("");

    try {
      const res = await fetch("/api/contact", {
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
    } catch (err) {
      setStatus("error");
      setFailMessage(
        err.message ||
          "Something went wrong on our end. Please call us instead and we'll help straight away."
      );
    }
  };

  if (status === "done") {
    return (
      <div className="done">
        <div className="done-mark">
          <Icon name="check" />
        </div>
        <h3 className="h-card">Message sent — thanks!</h3>
        <p className="t-muted" style={{ maxWidth: "42ch" }}>
          Your enquiry has landed with our team. We usually reply the same
          business day.
        </p>
        {reference ? <p className="done-ref">Reference {reference}</p> : null}
        <button
          type="button"
          className="btn btn-soft btn-sm"
          onClick={() => {
            setForm(blank);
            setStatus("idle");
            setReference("");
          }}
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form className="form" onSubmit={submit} noValidate>
      <div className="form-grid-2">
        <div className="field">
          <label htmlFor="c-firstName">
            First name <span className="req">*</span>
          </label>
          <input
            id="c-firstName"
            className="input"
            autoComplete="given-name"
            value={form.firstName}
            onChange={set("firstName")}
            aria-invalid={Boolean(errors.firstName)}
          />
          {errors.firstName ? (
            <p className="err">
              <Icon name="alert" />
              {errors.firstName}
            </p>
          ) : null}
        </div>

        <div className="field">
          <label htmlFor="c-lastName">
            Last name <span className="req">*</span>
          </label>
          <input
            id="c-lastName"
            className="input"
            autoComplete="family-name"
            value={form.lastName}
            onChange={set("lastName")}
            aria-invalid={Boolean(errors.lastName)}
          />
          {errors.lastName ? (
            <p className="err">
              <Icon name="alert" />
              {errors.lastName}
            </p>
          ) : null}
        </div>
      </div>

      <div className="form-grid-2">
        <div className="field">
          <label htmlFor="c-email">
            Email <span className="req">*</span>
          </label>
          <input
            id="c-email"
            type="email"
            className="input"
            autoComplete="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={set("email")}
            aria-invalid={Boolean(errors.email)}
          />
          {errors.email ? (
            <p className="err">
              <Icon name="alert" />
              {errors.email}
            </p>
          ) : null}
        </div>

        <div className="field">
          <label htmlFor="c-phone">
            Contact number <span className="req">*</span>
          </label>
          <input
            id="c-phone"
            type="tel"
            className="input"
            autoComplete="tel"
            placeholder="+61 4XX XXX XXX"
            value={form.phone}
            onChange={set("phone")}
            aria-invalid={Boolean(errors.phone)}
          />
          {errors.phone ? (
            <p className="err">
              <Icon name="alert" />
              {errors.phone}
            </p>
          ) : null}
        </div>
      </div>

      <div className="field">
        <label htmlFor="c-message">
          Your message <span className="req">*</span>
        </label>
        <textarea
          id="c-message"
          className="textarea"
          rows={5}
          placeholder="Tell us what you'd like cleaned, or ask us anything — including services you don't see listed."
          value={form.message}
          onChange={set("message")}
          aria-invalid={Boolean(errors.message)}
        />
        {errors.message ? (
          <p className="err">
            <Icon name="alert" />
            {errors.message}
          </p>
        ) : null}
      </div>

      {status === "error" ? (
        <p className="form-alert" role="alert">
          <Icon name="alert" />
          <span>{failMessage}</span>
        </p>
      ) : null}

      <button
        type="submit"
        className="btn btn-gold btn-lg btn-block"
        disabled={status === "sending"}
      >
        <Icon name={status === "sending" ? "clock" : "send"} />
        {status === "sending" ? "Sending…" : "Send message"}
      </button>

      <p className="hint">
        No login needed — just send it through and we&apos;ll reply by email or
        phone.
      </p>
    </form>
  );
}
