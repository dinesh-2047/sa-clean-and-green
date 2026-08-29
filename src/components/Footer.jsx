import Link from "next/link";
import Icon from "./Icons";
import { site } from "../lib/site";
import { services } from "../lib/services";

const companyLinks = [
  { href: "/", label: "Home" },
  { href: "/services", label: "All services" },
  { href: "/about", label: "About us" },
  { href: "/book", label: "Book a clean" },
  { href: "/contact", label: "Contact" },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer-grid">
          <div className="footer-about">
            <Link href="/" className="brand" aria-label={`${site.name} — home`}>
              <span className="brand-mark">
                <Icon name="leaf" />
              </span>
              <span>
                <span className="brand-name">
                  SA Clean <em>&amp;</em> Green
                </span>
                <span className="brand-sub">{site.legalName}</span>
              </span>
            </Link>
            <p>
              Residential and commercial cleaning using low-tox products, with
              fixed quotes confirmed in writing before we start.
            </p>
            <p className="footer-abn">{site.address}</p>
            <div className="socials">
              {site.socials.map((s) => (
                <a
                  key={s.label}
                  className="social"
                  href={s.href}
                  aria-label={s.label}
                  target={s.href.startsWith("http") ? "_blank" : undefined}
                  rel={s.href.startsWith("http") ? "noreferrer" : undefined}
                >
                  <Icon name={s.icon} />
                </a>
              ))}
              <a
                className="social"
                href={site.whatsappHref}
                aria-label="WhatsApp"
                target="_blank"
                rel="noreferrer"
              >
                <Icon name="whatsapp" />
              </a>
            </div>
          </div>

          <div>
            <h4>Company</h4>
            <ul className="footer-links">
              {companyLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4>Services</h4>
            <ul className="footer-links">
              {services.map((s) => (
                <li key={s.id}>
                  <Link href={`/services#${s.id}`}>{s.title}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4>Get in touch</h4>
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
          </div>
        </div>
      </div>

      <div className="footer-bar">
        <div className="wrap">
          <span>
            © {year} {site.legalName}. All rights reserved.
          </span>
          <span>{site.tagline}</span>
        </div>
      </div>
    </footer>
  );
}
