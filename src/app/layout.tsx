import type { Metadata } from "next";
import { DM_Sans, Inter, Noto_Sans_Ethiopic } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CartProvider } from "@/context/CartContext";
import { CartDrawer } from "@/components/CartDrawer";
import { EVENT } from "@/lib/event";
import { siteUrl } from "@/lib/site";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["400", "500", "600", "700", "800", "900"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700", "800", "900"],
});

// Amharic names on the guest pages. Inter and DM Sans have no Ethiopic glyphs,
// so without this the browser falls back to whatever system font it has.
const ethiopic = Noto_Sans_Ethiopic({
  subsets: ["ethiopic"],
  variable: "--font-ethiopic",
  weight: ["500", "700"],
});

const SITE = siteUrl();

const SHARE_DESCRIPTION =
  `${EVENT.summary} ${EVENT.date}, ${EVENT.location}, Washington DC. ` +
  `Kids 1K ${EVENT.kidsStartTime}, 5K ${EVENT.startTime}.`;

// Share surfaces get their own title, deliberately WITHOUT the pipe.
// Several of them split a title on "|" and render only one side: the old card
// went out as "Irrecha Celebration Run - October 3, 2026" from a title that
// actually read "Gada Global 5K | Irrecha Celebration Run - October 3, 2026",
// dropping the brand half entirely. The lockup stays on the browser tab, where
// nothing chops it up.
const SHARE_TITLE = `${EVENT.name} — ${EVENT.date}`;

export const metadata: Metadata = {
  // Without this, relative image paths in metadata never become the absolute
  // URLs that scrapers require, and the card falls back to a bare icon.
  metadataBase: new URL(SITE),
  title: `${EVENT.lockup} — Washington DC, October 3, 2026`,
  description: SHARE_DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: EVENT.brand,
    title: SHARE_TITLE,
    description: SHARE_DESCRIPTION,
    url: SITE,
    locale: "en_US",
    images: [
      {
        // Bump ?v= whenever the card changes: platforms cache images by URL.
        url: "/og.png?v=3",
        width: 1200,
        height: 630,
        alt: `${EVENT.name} — ${EVENT.date}, ${EVENT.location}, Washington DC`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SHARE_TITLE,
    description: SHARE_DESCRIPTION,
    images: ["/og.png?v=3"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${dmSans.variable} ${inter.variable} ${ethiopic.variable} antialiased`}>
      <body className="font-[family-name:var(--font-body)] bg-charcoal text-charcoal">
        <CartProvider>
          <Navbar />
          {children}
          <Footer />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
