/**
 * Single source of truth for company details.
 *
 * Company identity verified against the Australian Business Register:
 * PA CLEANING PTY LTD, an active Australian private company, registered
 * address Adelaide CBD, South Australia 5000. (The ABN/ACN are deliberately
 * not published on the site — keep them out of components.)
 *
 * NOTE FOR CLIENT REVIEW: entries marked `// placeholder` are reasonable
 * defaults, not verified facts. Confirm with the business owner before launch.
 */
export const site = {
  name: "SA Clean & Green",
  legalName: "PA Cleaning Pty Ltd",
  tagline: "Clean space, happy place.",
  shortPitch:
    "Eco-conscious cleaning for homes and businesses, with fixed quotes confirmed before we start.",
  phone: "+61 415 121 566",
  phoneHref: "tel:+61415121566",
  whatsappHref: "https://wa.me/61415121566",
  email: "saclean.au@gmail.com",
  emailHref: "mailto:saclean.au@gmail.com",
  addressLine: "Adelaide CBD",
  addressSuburb: "South Australia 5000",
  address: "Adelaide CBD, South Australia 5000",
  hours: [
    { days: "Monday – Friday", time: "7:00am – 7:00pm" }, // placeholder
    { days: "Saturday", time: "8:00am – 5:00pm" }, // placeholder
    { days: "Sunday", time: "By appointment" }, // placeholder
  ],
  socials: [
    // Add real profile URLs when they exist.
    { label: "Facebook", href: "#", icon: "facebook" },
    { label: "Instagram", href: "#", icon: "instagram" },
  ],
};

/** Short trust signals used in the hero and about section. */
export const trustPoints = [
  { label: "Eco-friendly products", detail: "Low-tox, family and pet safe" },
  { label: "Fixed quotes", detail: "Confirmed in writing, no surprises" },
  { label: "Flexible times", detail: "Early, late and weekend slots" },
];

export const steps = [
  {
    n: "01",
    title: "Tell us what you need",
    body: "Pick your services, then type in your address and a preferred date and time. Takes about a minute.",
  },
  {
    n: "02",
    title: "We confirm your slot",
    body: "We check the run sheet and reply with a fixed quote plus a confirmed time — or the closest one we have.",
  },
  {
    n: "03",
    title: "Our team arrives kitted out",
    body: "Equipment, cloths and eco-friendly products all come with us. You don't need to supply a thing.",
  },
  {
    n: "04",
    title: "You check the finish",
    body: "Walk through with us before we leave. Anything missed gets fixed on the spot.",
  },
];

export const faqs = [
  {
    q: "Do I need to be home during the clean?",
    a: "Not at all. Plenty of clients leave a key, a lockbox code or building access instructions in the booking notes. If you'd rather be there to walk us through, that works too.",
  },
  {
    q: "Do you bring your own equipment and products?",
    a: "Yes. Our team arrives with vacuums, mops, cloths and eco-friendly cleaning products included in the quote. If you'd prefer we use your own products, just say so in the booking notes.",
  },
  {
    q: "Are your products safe around kids and pets?",
    a: "We use low-tox, biodegradable products as our default across every service. Where a job genuinely needs something stronger — heavy oven carbon or mould, for example — we'll tell you first and keep it contained to that area.",
  },
  {
    q: "How does an end of lease clean work?",
    a: "We clean against your agent's exit condition checklist: oven, range hood, wet areas, tracks, skirtings, marks on walls, inside cupboards, the lot. Send the checklist through with your booking and we'll work straight off it.",
  },
  {
    q: "How do I get a price?",
    a: "Send a booking request or a quick enquiry with your address, property size and the services you want. You'll get a fixed quote back before anything is locked in — nothing is charged at the time of booking.",
  },
  {
    q: "Can I change or cancel a booking?",
    a: "Yes. Give us a call or reply to your confirmation and we'll move it. As much notice as you can manage helps us reshuffle the day for everyone else.",
  },
  {
    q: "Do you travel to my area?",
    a: "Type your suburb and full address into the booking form and we'll confirm straight away whether we can get to you, and whether any travel applies. If we can't, we'll tell you honestly rather than string you along.",
  },
];
