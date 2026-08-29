import Image from "next/image";
import Link from "next/link";
import Icon from "../../components/Icons";
import Reveal from "../../components/Reveal";
import SectionHead from "../../components/SectionHead";
import { BookButton } from "../../components/BookingProvider";
import { site, steps, trustPoints } from "../../lib/site";

export const metadata = {
  title: "About us",
  description:
    "SA Clean & Green is the trading name of PA Cleaning Pty Ltd, an active Australian private company cleaning homes and workplaces.",
};

const promises = [
  {
    icon: "leaf",
    title: "Low-tox by default",
    body: "Biodegradable products across every service. If a job genuinely needs something stronger, we tell you first and keep it to that one area.",
  },
  {
    icon: "shield",
    title: "The quote is the price",
    body: "You get a fixed price in writing before we start. If the job turns out bigger than described, we talk to you rather than adding it to an invoice.",
  },
  {
    icon: "clock",
    title: "We turn up when we said",
    body: "Early, late and weekend slots are available. If something goes wrong on the road, you hear about it from us before you have to ask.",
  },
  {
    icon: "sparkle",
    title: "Finished means finished",
    body: "Walk through with us at the end. Anything missed gets fixed on the spot — no forms, no waiting on a callback.",
  },
];

export default function AboutPage() {
  return (
    <>
      <section className="section" style={{ paddingBottom: "2rem" }}>
        <div className="wrap">
          <div className="split">
            <div>
              <SectionHead
                eyebrow="About us"
                title={
                  <>
                    A small <span className="mark mark-teal">local</span> team
                    that does the job properly
                  </>
                }
                lead={`${site.name} is the trading name of ${site.legalName}, an active Australian private company. We clean homes and workplaces — and because we're small, the person who quotes your job is the person accountable for it.`}
              />

              <p style={{ color: "var(--ink-2)" }}>
                We started this business because too many cleaning quotes come
                with an asterisk — a surcharge here, an exclusion there, a
                cleaner who never saw the original brief. So we do it the other
                way round: one clear scope, one fixed price, one team that knows
                your place.
              </p>

              <div className="hero-points">
                {trustPoints.map((t) => (
                  <span className="chip" key={t.label}>
                    <Icon name="check" />
                    {t.label}
                  </span>
                ))}
              </div>

              <div className="row gap-4 mt-8">
                <BookButton className="btn btn-primary btn-lg">
                  Book a clean
                </BookButton>
                <Link href="/contact" className="btn btn-soft btn-lg">
                  <Icon name="mail" />
                  Contact us
                </Link>
              </div>
            </div>

            <Reveal delay={100}>
              <div className="photo-stack">
                <div className="photo-main">
                  <Image
                    src="/images/gallery/squeegee.jpg"
                    alt="Cleaner squeegeeing a large window"
                    fill
                    sizes="(max-width: 900px) 90vw, 42vw"
                    style={{ objectFit: "cover" }}
                    priority
                  />
                </div>
                <div className="photo-sub">
                  <Image
                    src="/images/gallery/kitchen.jpg"
                    alt="Detailed kitchen cleaning in progress"
                    fill
                    sizes="(max-width: 900px) 48vw, 22vw"
                    style={{ objectFit: "cover" }}
                  />
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section section-warm">
        <div className="wrap">
          <Reveal>
            <SectionHead
              center
              eyebrow="What you can count on"
              title="Four things we don't compromise on"
            />
          </Reveal>

          <div className="grid-3">
            {promises.map((p, i) => (
              <Reveal className="clay clay-pad" key={p.title} delay={i * 80}>
                <span
                  className={`tile ${i % 2 ? "tile-gold" : ""}`.trim()}
                  style={{ marginBottom: "1.1rem" }}
                >
                  <Icon name={p.icon} />
                </span>
                <h3 className="h-card">{p.title}</h3>
                <p style={{ color: "var(--ink-2)", marginTop: "0.5rem" }}>
                  {p.body}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <Reveal>
            <SectionHead
              center
              eyebrow="How it works"
              title="From enquiry to finished clean"
            />
          </Reveal>
          <div className="steps">
            {steps.map((s, i) => (
              <Reveal className="step" key={s.n} delay={i * 90}>
                <span className="step-n">{s.n}</span>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-warm">
        <div className="wrap">
          <Reveal>
            <SectionHead
              center
              eyebrow="Where to find us"
              title="Get in touch directly"
              lead="Tell us your address in the booking form and we'll confirm whether we can get to you — usually the same business day."
            />
          </Reveal>
          <Reveal delay={100}>
            <div className="grid-3">
              <div className="clay clay-pad">
                <div className="contact-row">
                  <span className="tile tile-sm">
                    <Icon name="phone" />
                  </span>
                  <div>
                    <span>Phone</span>
                    <a href={site.phoneHref}>{site.phone}</a>
                  </div>
                </div>
              </div>
              <div className="clay clay-pad">
                <div className="contact-row">
                  <span className="tile tile-sm tile-gold">
                    <Icon name="mail" />
                  </span>
                  <div>
                    <span>Email</span>
                    <a href={site.emailHref}>{site.email}</a>
                  </div>
                </div>
              </div>
              <div className="clay clay-pad">
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
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <Reveal className="cta">
            <div className="cta-inner">
              <div>
                <h2>Let&apos;s get your place sorted</h2>
                <p>
                  Choose your services and a time that suits. We&apos;ll confirm
                  the slot and send a fixed quote — nothing is charged up front.
                </p>
              </div>
              <div className="cta-actions">
                <BookButton className="btn btn-gold btn-lg btn-block">
                  Book a clean
                </BookButton>
                <a
                  href={site.phoneHref}
                  className="btn btn-soft btn-lg btn-block"
                >
                  <Icon name="phone" />
                  Call {site.phone}
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
