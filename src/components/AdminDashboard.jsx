"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Icon from "./Icons";
import { timeSlots } from "../lib/services";
import {
  bookingStatuses,
  enquiryStatuses,
  statusLabel,
} from "../lib/records";

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

/** YYYY-MM-DD → "3 Sep 2026". Formatted by hand so the server and the browser
 *  can't disagree about time zones and trip a hydration mismatch. */
function fmtDate(value) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(value || ""));
  if (!m) return "";
  return `${Number(m[3])} ${MONTHS[Number(m[2]) - 1]} ${m[1]}`;
}

/** Submission timestamps are always shown in the business's own time zone. */
function fmtStamp(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("en-AU", {
    timeZone: "Australia/Melbourne",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

const slotLabel = (id) => timeSlots.find((t) => t.id === id)?.label || "";

/** Everything a search box should look through, lower-cased once per record. */
function haystack(record) {
  return [
    record.reference,
    record.name,
    record.email,
    record.phone,
    record.suburb,
    record.address,
    record.serviceLabels,
    record.propertyTypeLabel,
    record.message,
    record.notes,
    record.adminNotes,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

export default function AdminDashboard({
  adminEmail,
  bookings,
  enquiries,
  dbReady,
}) {
  const router = useRouter();
  const [tab, setTab] = useState("bookings");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");

  // Successful edits are held as per-record overlays rather than a copy of the
  // whole list, so a `router.refresh()` still brings in new submissions.
  const [patched, setPatched] = useState({});
  const [drafts, setDrafts] = useState({});
  const [busyId, setBusyId] = useState("");
  const [alert, setAlert] = useState("");

  const isBookings = tab === "bookings";
  const statuses = isBookings ? bookingStatuses : enquiryStatuses;

  // Cheap enough to derive on every render (the dashboard lists hundreds of
  // records at most), which keeps the filters honest with no cache to stale.
  const merge = (list) =>
    list.map((r) => (patched[r.id] ? { ...r, ...patched[r.id] } : r));

  const allBookings = merge(bookings);
  const allEnquiries = merge(enquiries);

  const source = isBookings ? allBookings : allEnquiries;

  const needle = query.trim().toLowerCase();
  const visible = source.filter((r) => {
    if (status !== "all" && r.status !== status) return false;
    if (!needle) return true;
    return haystack(r).includes(needle);
  });

  const pendingCount = allBookings.filter((b) => b.status === "pending").length;
  const newCount = allEnquiries.filter((e) => e.status === "new").length;

  const draftFor = (record) =>
    drafts[record.id] || {
      confirmedDate: record.confirmedDate || record.requestedDate || "",
      confirmedTimeSlot:
        record.confirmedTimeSlot || record.requestedTimeSlot || "",
      adminNotes: record.adminNotes || "",
    };

  const setDraft = (id, key, value) =>
    setDrafts((d) => ({
      ...d,
      [id]: { ...(d[id] || {}), [key]: value },
    }));

  /** Send a patch and fold the saved record back into the view. */
  const save = async (record, updates) => {
    setBusyId(record.id);
    setAlert("");

    try {
      const res = await fetch("/api/admin/record", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind: isBookings ? "bookings" : "enquiries",
          id: record.id,
          ...updates,
        }),
      });

      if (res.status === 401) {
        router.replace("/admin/login");
        return;
      }

      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) {
        throw new Error(data.message || "That change didn't save.");
      }

      setPatched((p) => ({ ...p, [record.id]: data.record }));
      setDrafts((d) => {
        const next = { ...d };
        delete next[record.id];
        return next;
      });
    } catch (err) {
      setAlert(err.message);
    } finally {
      setBusyId("");
    }
  };

  const signOut = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  };

  const switchTab = (next) => {
    setTab(next);
    setStatus("all");
    setAlert("");
  };

  return (
    <section className="section admin">
      <div className="wrap">
        <header className="admin-top">
          <div>
            <p className="eyebrow">Admin</p>
            <h1>Bookings &amp; enquiries</h1>
            <p className="admin-who">
              <Icon name="user" />
              Signed in as {adminEmail}
            </p>
          </div>

          <div className="admin-top-actions">
            <button
              type="button"
              className="btn btn-soft btn-sm"
              onClick={() => router.refresh()}
            >
              <Icon name="refresh" />
              Refresh
            </button>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={signOut}
            >
              <Icon name="logout" />
              Sign out
            </button>
          </div>
        </header>

        {!dbReady ? (
          <p className="form-alert" role="alert">
            <Icon name="alert" />
            <span>
              No database is configured, so nothing can be listed here. Set{" "}
              <code>MONGODB_URI</code> in the environment file and restart —
              until then, submissions only arrive by email.
            </span>
          </p>
        ) : null}

        <div className="admin-stats">
          <div className="admin-stat">
            <strong>{allBookings.length}</strong>
            <span>Bookings</span>
          </div>
          <div className="admin-stat admin-stat-warn">
            <strong>{pendingCount}</strong>
            <span>Awaiting confirmation</span>
          </div>
          <div className="admin-stat">
            <strong>
              {allBookings.filter((b) => b.status === "completed").length}
            </strong>
            <span>Completed</span>
          </div>
          <div className="admin-stat admin-stat-warn">
            <strong>{newCount}</strong>
            <span>New queries</span>
          </div>
        </div>

        <div className="admin-tabs" role="tablist" aria-label="Dashboard tabs">
          <button
            type="button"
            role="tab"
            aria-selected={isBookings}
            className={`admin-tab${isBookings ? " is-on" : ""}`}
            onClick={() => switchTab("bookings")}
          >
            <Icon name="calendar" />
            Bookings
            <em>{allBookings.length}</em>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={!isBookings}
            className={`admin-tab${!isBookings ? " is-on" : ""}`}
            onClick={() => switchTab("enquiries")}
          >
            <Icon name="inbox" />
            Queries
            <em>{allEnquiries.length}</em>
          </button>
        </div>

        <div className="admin-filters">
          <div className="admin-search">
            <Icon name="search" />
            <input
              className="input"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={
                isBookings
                  ? "Search name, suburb, address, phone or reference…"
                  : "Search name, email, phone, message or reference…"
              }
              aria-label="Search records"
            />
          </div>

          <div className="field admin-status-filter">
            <label htmlFor="admin-status">Status</label>
            <select
              id="admin-status"
              className="select"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="all">All statuses</option>
              {statuses.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {alert ? (
          <p className="form-alert" role="alert">
            <Icon name="alert" />
            <span>{alert}</span>
          </p>
        ) : null}

        <p className="admin-count">
          Showing {visible.length} of {source.length}{" "}
          {isBookings ? "bookings" : "queries"}
          {query.trim() ? ` matching “${query.trim()}”` : ""}.
        </p>

        {visible.length === 0 ? (
          <div className="clay clay-pad admin-empty">
            <span className="tile">
              <Icon name={isBookings ? "calendar" : "inbox"} />
            </span>
            <h3 className="h-card">Nothing to show</h3>
            <p style={{ color: "var(--ink-2)" }}>
              {source.length === 0
                ? `No ${
                    isBookings ? "bookings" : "queries"
                  } have come through yet.`
                : "No records match that search or filter."}
            </p>
          </div>
        ) : (
          <div className="admin-list">
            {visible.map((record) =>
              isBookings ? (
                <BookingCard
                  key={record.id}
                  record={record}
                  draft={draftFor(record)}
                  busy={busyId === record.id}
                  onDraft={setDraft}
                  onSave={save}
                />
              ) : (
                <EnquiryCard
                  key={record.id}
                  record={record}
                  draft={draftFor(record)}
                  busy={busyId === record.id}
                  onDraft={setDraft}
                  onSave={save}
                />
              )
            )}
          </div>
        )}
      </div>
    </section>
  );
}

function StatusPill({ list, value }) {
  return (
    <span className={`admin-pill admin-pill-${value}`}>
      {statusLabel(list, value)}
    </span>
  );
}

function StatusButtons({ list, record, busy, onSave }) {
  return (
    <div className="admin-status-row">
      {list.map((s) => (
        <button
          type="button"
          key={s.id}
          className={`admin-status-btn${
            record.status === s.id ? " is-on" : ""
          }`}
          disabled={busy || record.status === s.id}
          onClick={() => onSave(record, { status: s.id })}
        >
          {s.label}
        </button>
      ))}
    </div>
  );
}

function Detail({ label, children }) {
  if (!children) return null;
  return (
    <div className="admin-detail">
      <span>{label}</span>
      <strong>{children}</strong>
    </div>
  );
}

function BookingCard({ record, draft, busy, onDraft, onSave }) {
  const confirmed = record.confirmedDate;
  const moved = confirmed && confirmed !== record.requestedDate;

  return (
    <article className="clay clay-pad admin-card">
      <header className="admin-card-head">
        <div>
          <p className="admin-ref">{record.reference}</p>
          <h3>{record.name}</h3>
          <p className="admin-when">
            <Icon name="clock" />
            Submitted {fmtStamp(record.createdAt)}
          </p>
        </div>
        <StatusPill list={bookingStatuses} value={record.status} />
      </header>

      <div className="admin-grid">
        <Detail label="Phone">
          {record.phone ? (
            <a href={`tel:${record.phone.replace(/\s+/g, "")}`}>
              {record.phone}
            </a>
          ) : null}
        </Detail>
        <Detail label="Email">
          {record.email ? (
            <a
              href={`mailto:${record.email}?subject=Your booking ${record.reference}`}
            >
              {record.email}
            </a>
          ) : null}
        </Detail>
        <Detail label="Services">{record.serviceLabels}</Detail>
        <Detail label="How often">{record.frequencyLabel}</Detail>
        <Detail label="Property">
          {[record.propertyTypeLabel, record.size].filter(Boolean).join(" · ")}
        </Detail>
        <Detail label="Suburb / area">{record.suburb}</Detail>
        <Detail label="Address">{record.address}</Detail>
        <Detail label="Requested">
          {`${fmtDate(record.requestedDate)} · ${
            record.requestedTimeLabel || slotLabel(record.requestedTimeSlot)
          }`}
        </Detail>
        <Detail label="Confirmed for">
          {confirmed
            ? `${fmtDate(confirmed)}${
                record.confirmedTimeSlot
                  ? ` · ${slotLabel(record.confirmedTimeSlot)}`
                  : ""
              }${moved ? " (moved)" : ""}`
            : "Not confirmed yet"}
        </Detail>
      </div>

      {record.notes ? (
        <p className="admin-note">
          <span>Customer notes</span>
          {record.notes}
        </p>
      ) : null}

      <StatusButtons
        list={bookingStatuses}
        record={record}
        busy={busy}
        onSave={onSave}
      />

      <div className="admin-edit">
        <div className="field">
          <label htmlFor={`date-${record.id}`}>Confirmed date</label>
          <input
            id={`date-${record.id}`}
            type="date"
            className="input"
            value={draft.confirmedDate}
            onChange={(e) => onDraft(record.id, "confirmedDate", e.target.value)}
          />
        </div>

        <div className="field">
          <label htmlFor={`slot-${record.id}`}>Confirmed time</label>
          <select
            id={`slot-${record.id}`}
            className="select"
            value={draft.confirmedTimeSlot}
            onChange={(e) =>
              onDraft(record.id, "confirmedTimeSlot", e.target.value)
            }
          >
            <option value="">Not set</option>
            {timeSlots.map((t) => (
              <option key={t.id} value={t.id}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        <div className="field admin-edit-notes">
          <label htmlFor={`notes-${record.id}`}>Internal notes</label>
          <textarea
            id={`notes-${record.id}`}
            className="textarea"
            rows={2}
            value={draft.adminNotes}
            placeholder="Quoted price, access instructions, who's assigned…"
            onChange={(e) => onDraft(record.id, "adminNotes", e.target.value)}
          />
        </div>

        <button
          type="button"
          className="btn btn-primary btn-sm"
          disabled={busy}
          onClick={() =>
            onSave(record, {
              confirmedDate: draft.confirmedDate,
              confirmedTimeSlot: draft.confirmedTimeSlot,
              adminNotes: draft.adminNotes,
              // Saving a date is how a booking gets confirmed, so do both.
              ...(record.status === "pending" && draft.confirmedDate
                ? { status: "confirmed" }
                : {}),
            })
          }
        >
          <Icon name={busy ? "clock" : "check"} />
          {busy ? "Saving…" : "Save date & notes"}
        </button>
      </div>
    </article>
  );
}

function EnquiryCard({ record, draft, busy, onDraft, onSave }) {
  return (
    <article className="clay clay-pad admin-card">
      <header className="admin-card-head">
        <div>
          <p className="admin-ref">{record.reference}</p>
          <h3>{record.name}</h3>
          <p className="admin-when">
            <Icon name="clock" />
            Submitted {fmtStamp(record.createdAt)}
          </p>
        </div>
        <StatusPill list={enquiryStatuses} value={record.status} />
      </header>

      <div className="admin-grid">
        <Detail label="Phone">
          {record.phone ? (
            <a href={`tel:${record.phone.replace(/\s+/g, "")}`}>
              {record.phone}
            </a>
          ) : null}
        </Detail>
        <Detail label="Email">
          {record.email ? (
            <a
              href={`mailto:${record.email}?subject=Re: your enquiry ${record.reference}`}
            >
              {record.email}
            </a>
          ) : null}
        </Detail>
      </div>

      <p className="admin-note">
        <span>Message</span>
        {record.message}
      </p>

      <StatusButtons
        list={enquiryStatuses}
        record={record}
        busy={busy}
        onSave={onSave}
      />

      <div className="admin-edit">
        <div className="field admin-edit-notes admin-edit-wide">
          <label htmlFor={`qnotes-${record.id}`}>Internal notes</label>
          <textarea
            id={`qnotes-${record.id}`}
            className="textarea"
            rows={2}
            value={draft.adminNotes}
            placeholder="What you told them, what to follow up…"
            onChange={(e) => onDraft(record.id, "adminNotes", e.target.value)}
          />
        </div>

        <button
          type="button"
          className="btn btn-primary btn-sm"
          disabled={busy}
          onClick={() => onSave(record, { adminNotes: draft.adminNotes })}
        >
          <Icon name={busy ? "clock" : "check"} />
          {busy ? "Saving…" : "Save notes"}
        </button>
      </div>
    </article>
  );
}
