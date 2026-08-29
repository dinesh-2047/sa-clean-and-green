import { Nunito, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import BookingProvider from "../components/BookingProvider";
import { site } from "../lib/site";

const display = Nunito({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const body = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata = {
  metadataBase: new URL("https://sacleanandgreen.com.au"),
  title: {
    default: `${site.name} — Home & commercial cleaning`,
    template: `%s | ${site.name}`,
  },
  description:
    "Residential and commercial cleaning — end of lease, regular, window, oven and chimney cleaning. Request a booking online and get a fixed quote back before anything is locked in.",
  keywords: [
    "cleaning services",
    "end of lease cleaning",
    "bond clean",
    "commercial cleaning",
    "window cleaning",
    "oven cleaning",
    "chimney cleaning",
    "SA Clean and Green",
  ],
  authors: [{ name: site.legalName }],
  openGraph: {
    type: "website",
    locale: "en_AU",
    siteName: site.name,
    title: `${site.name} — Home & commercial cleaning`,
    description:
      "Eco-conscious home and business cleaning. Pick your services, suggest a time, and we confirm with a fixed quote.",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport = {
  themeColor: "#0b7a6e",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en-AU" className={`${display.variable} ${body.variable}`}>
      <body>
        <a className="skip" href="#main">
          Skip to content
        </a>

        <div className="bg-blobs" aria-hidden="true">
          <span className="bg-blob bg-blob-1" />
          <span className="bg-blob bg-blob-2" />
          <span className="bg-blob bg-blob-3" />
        </div>

        <BookingProvider>
          <div className="page">
            <Navbar />
            <main id="main">{children}</main>
            <Footer />
          </div>
        </BookingProvider>
      </body>
    </html>
  );
}
