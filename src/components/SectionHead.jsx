export default function SectionHead({
  eyebrow,
  title,
  lead,
  center = false,
  children,
}) {
  return (
    <div className={`sect-head ${center ? "is-center" : ""}`}>
      {eyebrow ? (
        <p className={`eyebrow ${center ? "eyebrow-center" : ""}`}>{eyebrow}</p>
      ) : null}
      <h2 className="h-sect">{title}</h2>
      {lead ? <p className="lead">{lead}</p> : null}
      {children}
    </div>
  );
}
