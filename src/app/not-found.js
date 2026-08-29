import Link from "next/link";
import Icon from "../components/Icons";
import { site } from "../lib/site";

export const metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <section className="section">
      <div className="wrap center">
        <span
          className="tile"
          style={{ marginInline: "auto", marginBottom: "1.5rem" }}
        >
          <Icon name="spray" />
        </span>
        <h1 className="h-sect">We&apos;ve cleaned this page away</h1>
        <p className="lead" style={{ marginInline: "auto" }}>
          That link doesn&apos;t exist any more. Head back home, or take a look
          at what we do.
        </p>
        <div
          className="row gap-4 mt-8"
          style={{ justifyContent: "center" }}
        >
          <Link href="/" className="btn btn-primary">
            Back home
          </Link>
          <Link href="/services" className="btn btn-soft">
            Our services
          </Link>
          <a href={site.phoneHref} className="btn btn-ghost">
            <Icon name="phone" />
            {site.phone}
          </a>
        </div>
      </div>
    </section>
  );
}
