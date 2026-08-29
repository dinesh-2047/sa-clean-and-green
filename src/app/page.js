import Image from "next/image";
import Link from "next/link";
import Icon from "../components/Icons";
import Reveal from "../components/Reveal";
import Marquee from "../components/Marquee";
import SectionHead from "../components/SectionHead";
import ServiceCard from "../components/ServiceCard";
import Faq from "../components/Faq";
import { BookButton } from "../components/BookingProvider";
import { services } from "../lib/services";
import { site, steps, trustPoints, faqs } from "../lib/site";

export const metadata = {
  title: "Home & commercial cleaning services",
  description:
    "SA Clean & Green provides residential, commercial, end of lease, window, oven and chimney cleaning. Choose your services online and we come back with a confirmed time and a fixed quote.",
};

export default function Home() {
  return (
    <>
      {/* ------------------------------------------------------------ hero -- */}
      <section className="hero">
        <div className="wrap">
          <div className="hero-grid">
            <div className="hero-copy">
              <h1 className="h-hero">
                A <span className="mark">spotless</span> place,
                <br />
                without lifting a finger.
              </h1>

              <p className="lead">
                {site.name} handles the cleaning for homes and workplaces. Tell
                us what needs doing and when suits you — we come back with a
                confirmed time and a fixed price. No deposits, no lock-in.
              </p>

              <div className="hero-actions">
                <BookButton className="btn btn-primary btn-lg">
                  Book a clean
                </BookButton>
                <a href={site.phoneHref} className="btn btn-soft btn-lg">
                  <Icon name="phone" />
                  {site.phone}
                </a>
              </div>

              <div className="hero-points">
                {trustPoints.map((t) => (
                  <span className="chip" key={t.label}>
                    <Icon name="check" />
                    {t.label}
                  </span>
                ))}
              </div>
            </div>

            <div className="hero-art">
              <div className="hero-platter" aria-hidden="true" />
              <Image
                className="hero-photo"
                src="/hero_img.png"
                alt="SA Clean & Green cleaner with a spray bottle and cleaning caddy"
                width={1280}
                height={1024}
                priority
                sizes="(max-width: 900px) 92vw, 46vw"
              />
            </div>
          </div>
        </div>
      </section>

      <Marquee
        items={[
          "Residential cleaning",
          "End of lease",
          "Commercial & strata",
          "Window cleaning",
          "Oven cleaning",
          "Chimney sweeping",
          "Regular cleans",
          "Deep sanitising",
        ]}
      />

      {/* -------------------------------------------------------- services -- */}
      <section className="section" id="services">
        <div className="wrap">
          <Reveal>
            <SectionHead
              center
              eyebrow="What we do"
              title="Every service, one team"
              lead="Pick as many as you need — they can all go on the one booking. Tap a service to see exactly what's included."
            />
          </Reveal>

          <div className="svc-grid">
            {services.map((service, i) => (
              <Reveal key={service.id} delay={(i % 3) * 90}>
                <ServiceCard service={service} priority={i < 3} />
              </Reveal>
            ))}
          </div>

          <Reveal
            className="row gap-4 mt-8"
            style={{ justifyContent: "center" }}
          >
            <Link href="/services" className="btn btn-soft">
              Full service details
              <Icon name="arrow" />
            </Link>
            <BookButton className="btn btn-gold">Book a clean</BookButton>
          </Reveal>
        </div>
      </section>

      {/* ----------------------------------------------------------- about -- */}
      <section className="section section-warm">
        <div className="wrap">
          <div className="split">
            <Reveal>
              <div className="photo-stack">
                <div className="photo-main">
                  <Image
                    src="/images/gallery/team.jpg"
                    alt="Cleaner working through a bright living room"
                    fill
                    sizes="(max-width: 900px) 90vw, 42vw"
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <div className="photo-sub">
                  <Image
                    src="/images/gallery/detail.jpg"
                    alt="Close detail work on a kitchen surface"
                    fill
                    sizes="(max-width: 900px) 48vw, 22vw"
                    style={{ objectFit: "cover" }}
                  />
                </div>
              </div>
            </Reveal>

            <Reveal delay={120}>
              <SectionHead
                eyebrow="Why choose us"
                title="Careful work, honest quotes, no runaround"
                lead={`${site.name} is run by ${site.legalName}, a small Australian business. That means the person who quotes your job is the person who stands behind it.`}
              />

              <div className="value-list">
                {trustPoints.map((t, i) => (
                  <div className="value" key={t.label}>
                    <span
                      className={`tile tile-sm ${
                        i % 2 ? "tile-gold" : ""
                      }`.trim()}
                    >
                      <Icon
                        name={["leaf", "shield", "clock", "star"][i] || "sparkle"}
                      />
                    </span>
                    <div>
                      <h4>{t.label}</h4>
                      <p>{t.detail}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="row gap-4 mt-6">
                <Link href="/about" className="btn btn-primary">
                  More about us
                  <Icon name="arrow" />
                </Link>
                <Link href="/contact" className="btn btn-ghost">
                  Ask a question
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------- steps -- */}
      <section className="section">
        <div className="wrap">
          <Reveal>
            <SectionHead
              center
              eyebrow="How it works"
              title="Four steps, about a minute of your time"
              lead="Nothing is charged when you book. The date and time you pick is a request — we confirm it (or offer the closest slot) before anything is locked in."
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

      {/* ------------------------------------------------------------- faq -- */}
      <section className="section section-warm" id="faq">
        <div className="wrap">
          <Reveal>
            <SectionHead
              center
              eyebrow="Good to know"
              title="Questions we get asked a lot"
            />
          </Reveal>
          <Reveal delay={80}>
            <Faq items={faqs} />
          </Reveal>
        </div>
      </section>

      {/* ------------------------------------------------------------- cta -- */}
      <section className="section">
        <div className="wrap">
          <Reveal className="cta">
            <div className="cta-inner">
              <div>
                <h2>Ready for a place that feels looked after?</h2>
                <p>
                  Send through what you need and a time that suits. We&apos;ll
                  come back with a fixed quote — no payment, no obligation.
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
