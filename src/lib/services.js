/**
 * Service catalogue. This is the single source of truth used by the services
 * grid, the services page, the booking form checkboxes and the footer.
 *
 * `id` values are what get submitted with a booking, so don't rename them
 * without updating anything already stored.
 */
export const services = [
  {
    id: "residential",
    title: "Residential Cleaning",
    short: "Homes, units and townhouses",
    blurb:
      "A top-to-bottom clean of the rooms you actually live in — floors, dusting, kitchen, bathrooms and everything that gets touched daily.",
    image: "/images/services/residential.jpg",
    icon: "home",
    accent: "teal",
    featured: true,
    inclusions: [
      "Vacuum and mop all floors",
      "Dust surfaces, sills, skirtings and fittings",
      "Kitchen benches, splashback and sink",
      "Bathrooms, showers and toilets sanitised",
      "Mirrors and glass wiped down",
      "Bins emptied and relined",
    ],
  },
  {
    id: "commercial",
    title: "Commercial Cleaning",
    short: "Offices, shops and strata",
    blurb:
      "Scheduled cleaning for offices, retail and common areas — done before you open or after you close, so nobody has to work around us.",
    image: "/images/services/commercial.jpg",
    icon: "building",
    accent: "navy",
    featured: true,
    inclusions: [
      "Desks, reception and shared surfaces",
      "Kitchenettes and staff amenities",
      "Washrooms restocked and sanitised",
      "Hard floors and carpeted areas",
      "Internal glass and entry doors",
      "Waste and recycling taken out",
    ],
  },
  {
    id: "end-of-lease",
    title: "End of Lease Cleaning",
    short: "Bond and exit cleans",
    blurb:
      "The detailed one. We work straight off your agent's exit condition report so the inspection is the easy part of moving out.",
    image: "/images/services/end-of-lease.jpg",
    icon: "key",
    accent: "gold",
    featured: true,
    inclusions: [
      "Oven, cooktop and range hood degreased",
      "Inside all cupboards and drawers",
      "Showers, grout and wet areas detailed",
      "Window tracks, sills and flyscreens",
      "Marks spot-cleaned from walls",
      "Cobwebs, light fittings and vents",
    ],
  },
  {
    id: "regular",
    title: "Regular Cleaning",
    short: "Weekly, fortnightly or monthly",
    blurb:
      "The same clean on repeat, at a time that suits you. Same team wherever we can manage it, so nobody needs re-briefing.",
    image: "/images/services/regular.jpg",
    icon: "calendar",
    accent: "leaf",
    inclusions: [
      "Your choice of weekly, fortnightly or monthly",
      "Consistent room-by-room checklist",
      "Same crew wherever rostering allows",
      "Easy to pause while you're away",
      "Priority on holiday-period slots",
      "Adjust the scope any time",
    ],
  },
  {
    id: "window",
    title: "Window Cleaning",
    short: "Inside, outside, tracks and screens",
    blurb:
      "Streak-free glass inside and out, plus the parts people forget — tracks, sills, frames and flyscreens.",
    image: "/images/services/window.jpg",
    icon: "window",
    accent: "sky",
    inclusions: [
      "Internal and external glass",
      "Frames, sills and tracks",
      "Flyscreens removed and washed",
      "Sliding and bi-fold doors",
      "Ground and first floor access",
      "Streak-free squeegee finish",
    ],
  },
  {
    id: "oven",
    title: "Oven Cleaning",
    short: "Ovens, cooktops and range hoods",
    blurb:
      "Racks, trays, glass and cavity taken back to usable. Baked-on carbon soaked and lifted rather than scratched off.",
    image: "/images/services/oven.jpg",
    icon: "oven",
    accent: "gold",
    inclusions: [
      "Racks and trays soaked and scrubbed",
      "Cavity, roof and element degreased",
      "Inner and outer door glass",
      "Cooktop, trivets and knobs",
      "Range hood and filter",
      "Non-caustic options on request",
    ],
  },
  {
    id: "chimney",
    title: "Chimney Cleaning",
    short: "Flues, fireboxes and hearths",
    blurb:
      "A sweep and check before the cold sets in, with dust kept where it belongs instead of across your living room.",
    image: "/images/services/chimney.jpg",
    icon: "flame",
    accent: "navy",
    inclusions: [
      "Flue swept end to end",
      "Firebox and grate cleared",
      "Soot contained and removed",
      "Hearth and surround wiped",
      "Visual check of the cap and seals",
      "Best done pre-winter",
    ],
  },
  {
    id: "hygiene",
    title: "General Cleaning & Hygiene",
    short: "Sanitising and one-off deep cleans",
    blurb:
      "Touchpoint sanitising, spring cleans and the jobs that don't fit a neat category. Tell us what's bothering you.",
    image: "/images/services/hygiene.jpg",
    icon: "sparkle",
    accent: "teal",
    inclusions: [
      "High-touch points sanitised",
      "One-off deep and spring cleans",
      "Post-renovation dust removal",
      "Rubbish removal and declutter help",
      "Balconies, patios and garages",
      "Pre-sale and inspection tidy-ups",
    ],
  },
];

export const serviceById = (id) => services.find((s) => s.id === id);

export const serviceTitles = (ids = []) =>
  ids.map((id) => serviceById(id)?.title || id);

export const frequencies = [
  { id: "one-off", label: "One-off clean" },
  { id: "weekly", label: "Weekly" },
  { id: "fortnightly", label: "Fortnightly" },
  { id: "monthly", label: "Monthly" },
];

export const propertyTypes = [
  { id: "house", label: "House" },
  { id: "apartment", label: "Apartment / unit" },
  { id: "townhouse", label: "Townhouse" },
  { id: "office", label: "Office / commercial" },
  { id: "other", label: "Something else" },
];

export const timeSlots = [
  { id: "early", label: "Early morning (7am – 9am)" },
  { id: "morning", label: "Morning (9am – 12pm)" },
  { id: "afternoon", label: "Afternoon (12pm – 4pm)" },
  { id: "evening", label: "Late afternoon (4pm – 7pm)" },
  { id: "flexible", label: "I'm flexible" },
];
