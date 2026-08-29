"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import Icon from "./Icons";
import BookingForm from "./BookingForm";

const BookingContext = createContext(null);

export function useBooking() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error("useBooking must be used inside <BookingProvider>");
  return ctx;
}

/**
 * Holds the booking modal for the whole app so any button on any page can
 * open it — optionally with a service already ticked.
 */
export default function BookingProvider({ children }) {
  const [open, setOpen] = useState(false);
  const [preselect, setPreselect] = useState([]);
  const panelRef = useRef(null);
  const returnFocusTo = useRef(null);

  const openBooking = useCallback((serviceId) => {
    returnFocusTo.current =
      typeof document !== "undefined" ? document.activeElement : null;
    setPreselect(serviceId ? [serviceId] : []);
    setOpen(true);
  }, []);

  const closeBooking = useCallback(() => {
    setOpen(false);
    // Send focus back to whatever opened the modal.
    if (returnFocusTo.current?.focus) {
      requestAnimationFrame(() => returnFocusTo.current.focus());
    }
  }, []);

  // Lock the page behind the modal and wire up Escape.
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e) => {
      if (e.key === "Escape") closeBooking();
    };
    document.addEventListener("keydown", onKey);

    const first = panelRef.current?.querySelector(
      "input, select, textarea, button"
    );
    first?.focus({ preventScroll: true });

    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, closeBooking]);

  const value = useMemo(() => ({ openBooking, closeBooking }), [
    openBooking,
    closeBooking,
  ]);

  return (
    <BookingContext.Provider value={value}>
      {children}

      {/* `open` only ever becomes true from a click, so `document` is safe here. */}
      {open
        ? createPortal(
            <div
              className="modal-scrim"
              onMouseDown={(e) => {
                if (e.target === e.currentTarget) closeBooking();
              }}
            >
              <div
                className="modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="booking-title"
                ref={panelRef}
              >
                <div className="modal-head">
                  <div>
                    <h2 id="booking-title">Book your clean</h2>
                    <p>
                      No payment now — we confirm the time and a fixed price
                      first.
                    </p>
                  </div>
                  <button
                    type="button"
                    className="modal-x"
                    onClick={closeBooking}
                    aria-label="Close booking form"
                  >
                    <Icon name="x" />
                  </button>
                </div>
                <div className="modal-body">
                  <BookingForm preselect={preselect} />
                </div>
              </div>
            </div>,
            document.body
          )
        : null}
    </BookingContext.Provider>
  );
}

/** Any-page trigger. Pass `service` to have that service pre-ticked. */
export function BookButton({
  service,
  className = "btn btn-primary",
  children = "Book a service",
  icon = "calendar",
}) {
  const { openBooking } = useBooking();
  return (
    <button
      type="button"
      className={className}
      onClick={() => openBooking(service)}
    >
      {icon ? <Icon name={icon} /> : null}
      {children}
    </button>
  );
}
