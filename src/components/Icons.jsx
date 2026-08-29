/**
 * Inline icon set — no icon library needed, so nothing extra ships to the
 * browser. Stroke icons inherit `currentColor`; brand marks are filled.
 */

const strokes = {
  home: (
    <>
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5 9.5V20a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9.5" />
      <path d="M9.5 21v-6h5v6" />
    </>
  ),
  building: (
    <>
      <rect x="4" y="3" width="16" height="18" rx="2" />
      <path d="M8.5 7.5h1.5M14 7.5h1.5M8.5 12h1.5M14 12h1.5" />
      <path d="M10 21v-4h4v4" />
    </>
  ),
  key: (
    <>
      <circle cx="8" cy="15" r="4" />
      <path d="m10.8 12.2 8-8" />
      <path d="m16.5 6.5 2.5 2.5" />
      <path d="m19.5 3.5 2 2" />
    </>
  ),
  calendar: (
    <>
      <rect x="3" y="5" width="18" height="16" rx="2.5" />
      <path d="M3 10h18M8 3v4M16 3v4" />
      <path d="M8 14.5h2M14 14.5h2M8 18h2" />
    </>
  ),
  window: (
    <>
      <rect x="3.5" y="3.5" width="17" height="17" rx="2.5" />
      <path d="M12 3.5v17M3.5 12h17" />
    </>
  ),
  oven: (
    <>
      <rect x="3.5" y="3.5" width="17" height="17" rx="2.5" />
      <path d="M3.5 9h17" />
      <path d="M7 6.2h.01M10.5 6.2h.01" />
      <rect x="7" y="12" width="10" height="6" rx="1.5" />
    </>
  ),
  flame: (
    <>
      <path d="M12 3s5 4.2 5 9a5 5 0 0 1-10 0c0-2 1-3.4 2-4.5" />
      <path d="M12 20.5a2.6 2.6 0 0 0 2.6-2.6c0-1.7-2.6-4-2.6-4s-2.6 2.3-2.6 4A2.6 2.6 0 0 0 12 20.5Z" />
    </>
  ),
  sparkle: (
    <>
      <path d="M12 3l1.7 4.6L18.3 9.3 13.7 11 12 15.6 10.3 11 5.7 9.3l4.6-1.7L12 3Z" />
      <path d="M18.5 15.5l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7.7-1.8Z" />
      <path d="M5 14l.5 1.3L6.8 16l-1.3.5L5 17.8 4.5 16.5 3.2 16l1.3-.5L5 14Z" />
    </>
  ),
  leaf: (
    <>
      <path d="M4 20c0-8 5-14 16-15 1 11-5 16-13 16H4Z" />
      <path d="M4.5 19.5C8 16 11.5 13 16 11" />
    </>
  ),
  droplet: <path d="M12 3s6 6.2 6 10.4A6 6 0 0 1 6 13.4C6 9.2 12 3 12 3Z" />,
  spray: (
    <>
      <path d="M9 9h5.5a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-3.5a2 2 0 0 1-2-2V9Z" />
      <path d="M10.5 9V5.5h3V9" />
      <path d="M16.8 6.5h3M18 4.2l2 1M18 8.8l2-1" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3l7.5 2.8v5.4c0 4.4-3 8-7.5 9.8-4.5-1.8-7.5-5.4-7.5-9.8V5.8L12 3Z" />
      <path d="m9 12 2.2 2.2L15.2 10" />
    </>
  ),
  check: <path d="m5 12.8 4.4 4.4L19 7.6" />,
  arrow: (
    <>
      <path d="M4 12h15" />
      <path d="m13 6 6 6-6 6" />
    </>
  ),
  phone: (
    <path d="M6.2 3.5h2.6l1.5 4-2 1.4a11.5 11.5 0 0 0 5.3 5.3l1.4-2 4 1.5v2.6a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4.2 5.7a2 2 0 0 1 2-2.2Z" />
  ),
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2.5" />
      <path d="m3.8 7 7.2 5.4a1.7 1.7 0 0 0 2 0L20.2 7" />
    </>
  ),
  pin: (
    <>
      <path d="M12 21s7-6 7-11a7 7 0 0 0-14 0c0 5 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.6" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3.2 2" />
    </>
  ),
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  x: <path d="M6 6l12 12M18 6 6 18" />,
  plus: <path d="M12 5v14M5 12h14" />,
  alert: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 8v5M12 16h.01" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 11v5M12 8h.01" />
    </>
  ),
  star: (
    <path d="m12 4 2.4 5 5.5.8-4 3.9 1 5.4-4.9-2.6-4.9 2.6 1-5.4-4-3.9 5.5-.8L12 4Z" />
  ),
  send: (
    <>
      <path d="M20.5 3.5 3.8 9.9c-.9.3-.9 1.5 0 1.9l6 2.4 2.4 6c.4.9 1.6.9 1.9 0l6.4-16.7Z" />
      <path d="M20.5 3.5 10 14" />
    </>
  ),
  whatsapp: (
    <>
      <path d="M4 20l1.3-4a8 8 0 1 1 3 2.8L4 20Z" />
      <path d="M9.2 9c.2 1.3 1.2 3.3 3.2 4.4.9.5 1.6.6 2.1.5.4-.1.6-.5.7-.9l-1.6-.9-.7.7c-1-.5-1.8-1.3-2.2-2.2l.8-.7-.9-1.5c-.5.1-.9.3-1.1.7-.1.3-.2.6-.3.9Z" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4.5 4.5" />
    </>
  ),
  lock: (
    <>
      <rect x="4.5" y="10.5" width="15" height="10.5" rx="2.5" />
      <path d="M8.5 10.5V7.8a3.5 3.5 0 0 1 7 0v2.7" />
      <path d="M12 14.5v2.5" />
    </>
  ),
  logout: (
    <>
      <path d="M15 4.5h3.5a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H15" />
      <path d="M11 8l-4 4 4 4" />
      <path d="M16 12H7" />
    </>
  ),
  refresh: (
    <>
      <path d="M20 12a8 8 0 1 1-2.6-5.9" />
      <path d="M20 4v4h-4" />
    </>
  ),
  inbox: (
    <>
      <rect x="3.5" y="4.5" width="17" height="15" rx="2.5" />
      <path d="M3.5 13h4l1.5 2.5h6L16.5 13h4" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8.5" r="3.8" />
      <path d="M4.8 20.5a7.2 7.2 0 0 1 14.4 0" />
    </>
  ),
};

const filled = {
  facebook: (
    <path d="M13.5 21v-7.4h2.6l.4-3h-3V8.7c0-.9.3-1.5 1.6-1.5H17V4.5c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.4-4 4.1v2.1H8v3h2.6V21h2.9Z" />
  ),
  instagram: (
    <path d="M12 2.8c-2.5 0-2.8 0-3.8.1-1 0-1.6.2-2.2.4-.6.3-1.1.6-1.6 1.1S3.5 5.4 3.3 6c-.2.6-.4 1.2-.4 2.2-.1 1-.1 1.3-.1 3.8s0 2.8.1 3.8c0 1 .2 1.6.4 2.2.3.6.6 1.1 1.1 1.6s1 .8 1.6 1.1c.6.2 1.2.4 2.2.4 1 .1 1.3.1 3.8.1s2.8 0 3.8-.1c1 0 1.6-.2 2.2-.4a4.4 4.4 0 0 0 1.6-1.1c.5-.5.8-1 1.1-1.6.2-.6.4-1.2.4-2.2.1-1 .1-1.3.1-3.8s0-2.8-.1-3.8c0-1-.2-1.6-.4-2.2a4.4 4.4 0 0 0-1.1-1.6 4.4 4.4 0 0 0-1.6-1.1c-.6-.2-1.2-.4-2.2-.4-1-.1-1.3-.1-3.8-.1Zm0 1.9c2.4 0 2.7 0 3.7.1.9 0 1.3.2 1.6.3.4.2.7.4 1 .7.3.3.5.6.7 1 .1.3.3.7.3 1.6.1 1 .1 1.3.1 3.7s0 2.7-.1 3.7c0 .9-.2 1.3-.3 1.6-.2.4-.4.7-.7 1-.3.3-.6.5-1 .7-.3.1-.7.3-1.6.3-1 .1-1.3.1-3.7.1s-2.7 0-3.7-.1c-.9 0-1.3-.2-1.6-.3a2.7 2.7 0 0 1-1-.7 2.7 2.7 0 0 1-.7-1c-.1-.3-.3-.7-.3-1.6-.1-1-.1-1.3-.1-3.7s0-2.7.1-3.7c0-.9.2-1.3.3-1.6.2-.4.4-.7.7-1 .3-.3.6-.5 1-.7.3-.1.7-.3 1.6-.3 1-.1 1.3-.1 3.7-.1Zm0 3.2a4.1 4.1 0 1 0 0 8.2 4.1 4.1 0 0 0 0-8.2Zm0 6.8a2.7 2.7 0 1 1 0-5.4 2.7 2.7 0 0 1 0 5.4Zm5.2-7a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z" />
  ),
};

export default function Icon({ name, size, className, ...rest }) {
  const isFilled = Boolean(filled[name]);
  const body = isFilled ? filled[name] : strokes[name];
  if (!body) return null;

  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={className}
      fill={isFilled ? "currentColor" : "none"}
      stroke={isFilled ? "none" : "currentColor"}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {body}
    </svg>
  );
}
