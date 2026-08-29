/**
 * Infinite scrolling strip. The item list is rendered twice so the CSS
 * animation can loop at -50% without a visible jump.
 */
export default function Marquee({ items }) {
  const run = (
    <div className="marquee-item">
      {items.map((item) => (
        <span key={item}>
          {item}
          <i>✦</i>
        </span>
      ))}
    </div>
  );

  return (
    <div className="marquee" role="presentation">
      <div className="marquee-track" aria-hidden="true">
        {run}
        {run}
      </div>
    </div>
  );
}
