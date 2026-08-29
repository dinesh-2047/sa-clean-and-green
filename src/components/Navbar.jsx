"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Icon from "./Icons";
import { BookButton } from "./BookingProvider";
import { site } from "../lib/site";

const links = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [openMenu, setOpenMenu] = useState(false);
  const [stuck, setStuck] = useState(false);

  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile sheet whenever the route changes. Adjusting during render
  // (rather than in an effect) avoids a flash of the open sheet on the new page.
  const [menuPath, setMenuPath] = useState(pathname);
  if (menuPath !== pathname) {
    setMenuPath(pathname);
    setOpenMenu(false);
  }

  const isActive = (href) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className={`nav-outer ${stuck ? "is-stuck" : ""}`}>
      <div className="wrap">
        <nav className="nav" aria-label="Main">
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

          <div className="nav-links">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`nav-link ${isActive(l.href) ? "is-active" : ""}`}
                aria-current={isActive(l.href) ? "page" : undefined}
              >
                {l.label}
              </Link>
            ))}
          </div>

          <div className="nav-cta">
            <a
              href={site.phoneHref}
              className="btn btn-soft btn-sm btn-desktop"
              aria-label={`Call ${site.phone}`}
            >
              <Icon name="phone" />
              {site.phone}
            </a>
            <BookButton className="btn btn-primary btn-sm btn-desktop">
              Book a clean
            </BookButton>

            <button
              type="button"
              className="nav-burger"
              aria-expanded={openMenu}
              aria-controls="nav-sheet"
              aria-label={openMenu ? "Close menu" : "Open menu"}
              onClick={() => setOpenMenu((v) => !v)}
            >
              <Icon name={openMenu ? "x" : "menu"} />
            </button>
          </div>
        </nav>

        {openMenu ? (
          <div className="nav-sheet" id="nav-sheet">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`nav-link ${isActive(l.href) ? "is-active" : ""}`}
              >
                {l.label}
              </Link>
            ))}
            <div className="nav-sheet-foot">
              <BookButton className="btn btn-primary btn-block">
                Book a clean
              </BookButton>
              <a href={site.phoneHref} className="btn btn-soft btn-block">
                <Icon name="phone" />
                {site.phone}
              </a>
            </div>
          </div>
        ) : null}
      </div>
    </header>
  );
}
