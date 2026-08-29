import Link from "next/link";
import Icon from "../../components/Icons";
import Reveal from "../../components/Reveal";
import SectionHead from "../../components/SectionHead";
import ContactForm from "../../components/ContactForm";
import { BookButton } from "../../components/BookingProvider";
import { site } from "../../lib/site";

export const metadata = {
  title: "Contact us",
  description:
    "Call, email or send an enquiry to SA Clean & Green. No login needed — ask about a service you don't see listed, or get a quote.",
};

export default function ContactPage() {
  return (
    <>
      <section className="section">
        <div className="wrap">
          <SectionHead
            center
            eyebrow="Contact"
            title="Ask us anything"
            lead="Chasing a quote, a service that isn't listed, or a time we don't show online? Send it through — no account needed. We usually reply the same business day."
          />

          <div className="contact-grid">
            <Reveal>
              <div className="clay clay-pad">
                <h3 className="h-card" style={{ marginBottom: "1.3rem" }}>
                  Talk to us directly
                </h3>

                <div className="contact-card">
                  <div className="contact-row">
                    <span className="tile tile-sm">
                      <Icon name="phone" />
                    </span>
                    <div>
                      <span>Phone</span>
                      <a href={site.phoneHref}>{site.phone}</a>
                    </div>
                  </div>

                  <div className="contact-row">
                    <span className="tile tile-sm tile-leaf">
                      <Icon name="whatsapp" />
                    </span>
                    <div>
                      <span>WhatsApp</span>
                      <a
                        href={site.whatsappHref}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Message us
                      </a>
                    </div>
                  </div>

                  <div className="contact-row">
                    <span className="tile tile-sm tile-gold">
                      <Icon name="mail" />
                    </span>
                    <div>
                      <span>Email</span>
                      <a href={site.emailHref}>{site.email}</a>
                    </div>
                  </div>

                  <div className="contact-row">
                    <span className="tile tile-sm tile-navy">
                      <Icon name="pin" />
                    </span>
                    <div>
                      <span>Address</span>
                      <strong>{site.address}</strong>
                    </div>
                  </div>
                </div>

                <h4
                  style={{
                    marginTop: "1.8rem",
                    marginBottom: "0.9rem",
                    fontSize: "0.82rem",
                    letterSpacing: "0.13em",
                    textTransform: "uppercase",
                    color: "var(--teal-700)",
                  }}
                >
                  Office hours
                </h4>
                <ul className="hours">
                  {site.hours.map((h) => (
                    <li key={h.days}>
                      <b>{h.days}</b>
                      <span>{h.time}</span>
                    </li>
                  ))}
                </ul>

                <p className="form-note" style={{ marginTop: "1.5rem" }}>
                  <Icon name="info" />
                  <span>
                    Want a clean booked in rather than a question answered?{" "}
                    <Link
                      href="/book"
                      style={{
                        color: "var(--teal-700)",
                        fontWeight: 800,
                        textDecoration: "underline",
                      }}
                    >
                      Use the booking form
                    </Link>{" "}
                    so we get the address, date and services in one go.
                  </span>
                </p>

                <div className="mt-6">
                  <BookButton className="btn btn-primary btn-block">
                    Book a clean instead
                  </BookButton>
                </div>
              </div>
            </Reveal>

            <Reveal delay={110}>
              <div className="clay clay-solid clay-pad">
                <h3 className="h-card">Send an enquiry</h3>
                <p
                  style={{
                    color: "var(--ink-2)",
                    margin: "0.5rem 0 1.6rem",
                    fontSize: "0.97rem",
                  }}
                >
                  Fill in the five fields below and we&apos;ll get straight back
                  to you.
                </p>
                <ContactForm />
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
