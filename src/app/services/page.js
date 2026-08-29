import Image from "next/image";
import Link from "next/link";
import Icon from "../../components/Icons";
import Reveal from "../../components/Reveal";
import SectionHead from "../../components/SectionHead";
import Faq from "../../components/Faq";
import { BookButton } from "../../components/BookingProvider";
import { services } from "../../lib/services";
import { site, faqs } from "../../lib/site";

export const metadata = {
  title: "Our cleaning services",
  description:
    "Residential, commercial, end of lease, regular, window, oven, chimney and general hygiene cleaning. See exactly what each service includes, then book the ones you need.",
};

const tileClass = {
  teal: "tile",
  gold: "tile tile-gold",
  navy: "tile tile-navy",
  leaf: "tile tile-leaf",
  sky: "tile tile-sky",
};

export default function ServicesPage() {
  return (
    <>
      <section className="section" style={{ paddingBottom: "2rem" }}>
        <div className="wrap">
          <SectionHead
            center
            eyebrow="Services"
            title="Pick what you need — we'll bring the rest"
            lead="Every service below can go on a single booking — tick as many as you need. Equipment and eco-friendly products are always included in the quote."
          />

          <div className="areas" style={{ justifyContent: "center" }}>
            {services.map((s) => (
              <Link className="area" href={`#${s.id}`} key={s.id}>
                {s.title}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: "1rem" }}>
        <div className="wrap">
          {services.map((s) => (
            <Reveal as="article" className="detail" id={s.id} key={s.id}>
              <div className="detail-media">
                <Image
                  src={s.image}
                  alt={`${s.title} — ${s.short}`}
                  fill
                  sizes="(max-width: 860px) 92vw, 44vw"
                  style={{ objectFit: "cover" }}
                />
              </div>

              <div className="detail-body">
                <span className={tileClass[s.accent] || "tile"}>
                  <Icon name={s.icon} />
                </span>
                <h3>{s.title}</h3>
                <p className="eyebrow" style={{ marginBottom: "0.6rem" }}>
                  {s.short}
                </p>
                <p style={{ color: "var(--ink-2)" }}>{s.blurb}</p>

                <ul className="ticks">
                  {s.inclusions.map((inc) => (
                    <li key={inc}>
                      <Icon name="check" />
                      <span>{inc}</span>
                    </li>
                  ))}
                </ul>

                <div className="row gap-3">
                  <BookButton service={s.id} className="btn btn-primary">
                    Book {s.title.toLowerCase()}
                  </BookButton>
                  <a href={site.phoneHref} className="btn btn-ghost">
                    <Icon name="phone" />
                    Ask about pricing
                  </a>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section section-warm">
        <div className="wrap">
          <Reveal>
            <SectionHead
              center
              eyebrow="Good to know"
              title="Before you book"
            />
          </Reveal>
          <Reveal delay={80}>
            <Faq items={faqs} />
          </Reveal>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <Reveal className="cta">
            <div className="cta-inner">
              <div>
                <h2>Not sure which service you need?</h2>
                <p>
                  Send us a quick message describing the place and what&apos;s
                  bothering you. We&apos;ll tell you what we&apos;d recommend and
                  what it costs.
                </p>
              </div>
              <div className="cta-actions">
                <BookButton className="btn btn-gold btn-lg btn-block">
                  Start a booking
                </BookButton>
                <Link href="/contact" className="btn btn-soft btn-lg btn-block">
                  <Icon name="mail" />
                  Send an enquiry
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
