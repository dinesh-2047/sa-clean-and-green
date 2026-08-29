import Image from "next/image";
import Link from "next/link";
import Icon from "./Icons";
import { BookButton } from "./BookingProvider";

const tileClass = {
  teal: "tile",
  gold: "tile tile-gold",
  navy: "tile tile-navy",
  leaf: "tile tile-leaf",
  sky: "tile tile-sky",
};

export default function ServiceCard({ service, priority = false }) {
  return (
    <article className="svc" id={`card-${service.id}`}>
      <div className="svc-media">
        {/* The photo gets its own clipping layer so the icon tile below can
            overhang the image without being cut off. */}
        <div className="svc-shot">
          <Image
            src={service.image}
            alt={`${service.title} in progress`}
            fill
            sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 33vw"
            style={{ objectFit: "cover" }}
            priority={priority}
          />
        </div>
        <span className={`${tileClass[service.accent] || "tile"} svc-tile`}>
          <Icon name={service.icon} />
        </span>
      </div>

      <div className="svc-body">
        <p className="svc-kicker">{service.short}</p>
        <h3 className="h-card">{service.title}</h3>
        <p>{service.blurb}</p>
        <div className="svc-foot">
          <BookButton
            service={service.id}
            className="btn btn-primary btn-sm"
            icon="calendar"
          >
            Book this
          </BookButton>
          <Link className="svc-more" href={`/services#${service.id}`}>
            What&apos;s included <Icon name="arrow" />
          </Link>
        </div>
      </div>
    </article>
  );
}
