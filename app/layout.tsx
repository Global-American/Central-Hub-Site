import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Footer from "../components/Footer";
import "./globals.css";
import "flag-icons/css/flag-icons.min.css";
import LegalBar from "@/components/LegalBar";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Global American LLC - Smart Logistics Solutions",
  description:
    "Smart logistics solutions powered by ShipItSmart, FreightItSmart, ReturnItSmart, and FulfillItSmart. Intelligent supply chain management that moves industries forward.",
  generator: "Next.js",
};

// export const viewport = {
//   width: "device-width",
//   initialScale: 1,
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased min-h-screen ${inter.className}`}>
        {/* Site-wide background fade, same values as the IT Smart billing
            platform: a sky-blue glow top-left, a faint orange glow bottom-right
            and a diagonal wash from the page colour to white. Fixed to the
            viewport so every screen gets the same treatment, and kept behind
            all content. Sections stay transparent so it shows through. */}
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(103,200,236,0.24),_transparent_36%),radial-gradient(circle_at_bottom_right,_rgba(247,159,49,0.12),_transparent_30%),linear-gradient(135deg,_#f6fdfe_0%,_#eefafe_58%,_#ffffff_100%)]"
        />
        {children}
        <Footer />
        <LegalBar />
      </body>
    </html>
  );
}
