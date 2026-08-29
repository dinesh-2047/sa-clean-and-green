import Link from "next/link";
import Icon from "../../components/Icons";
import Reveal from "../../components/Reveal";
import SectionHead from "../../components/SectionHead";
import BookingForm from "../../components/BookingForm";
import { site, steps } from "../../lib/site";

export const metadata = {
  title: "Book a clean",
  description:
    "Request a cleaning booking with SA Clean & Green. Choose your services, suggest a date and time, and we'll confirm with a fixed quote. No payment on booking.",
};

export default function BookPage() {
  return (
    <section className="section">
      <div className="wrap">
        <SectionHead
          center
          eyebrow="Booking request"
          title="Tell us what you need cleaned"
          lead="Takes about a minute. Nothing is charged now — we confirm your time and send a fixed quote first."
        />

        <div className="contact-grid">
          <Reveal>
            <div className="clay clay-pad">
              <h3 className="h-card" style={{ marginBottom: "1.2rem" }}>
                What happens next
              </h3>

              <div className="value-list" style={{ marginTop: 0 }}>
                {steps.map((s, i) => (
                  <div className="value" key={s.n}>
                    <span
                      className={`tile tile-sm ${
                        i % 2 ? "tile-gold" : ""
                      }`.trim()}
                    >
                      <Icon
                        name={
                          ["send", "calendar", "spray", "check"][i] || "sparkle"
                        }
                      />
                    </span>
                    <div>
                      <h4>{s.title}</h4>
                      <p>{s.body}</p>
                    </div>
                  </div>
                ))}
              </div>

              <p className="form-note" style={{ marginTop: "1.6rem" }}>
                <Icon name="info" />
                <span>
                  Rather talk it through? Call{" "}
                  <a
                    href={site.phoneHref}
                    style={{ fontWeight: 800, color: "var(--teal-700)" }}
                  >
                    {site.phone}
                  </a>{" "}
                  or{" "}
                  <Link
                    href="/contact"
                    style={{
                      fontWeight: 800,
                      color: "var(--teal-700)",
                      textDecoration: "underline",
                    }}
                  >
                    send an enquiry
                  </Link>
                  .
                </span>
              </p>
            </div>
          </Reveal>

          <Reveal delay={110}>
            <div className="clay clay-solid clay-pad">
              <BookingForm />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
