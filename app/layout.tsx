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
        {children}
        <Footer />
        <LegalBar />
      </body>
    </html>
  );
}
