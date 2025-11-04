"use client";

import Link from "next/link";
import Image from "next/image";
import { Phone, MapPin } from "lucide-react";
import { useState, useEffect } from "react";

// Global locations with full addresses
// Using CSS flag icons (flag-icons) for consistent cross-platform rendering
// countryCode uses ISO 3166-1 alpha-2 codes
const globalLocations = [
  {
    countryCode: "us",
    city: "Englewood, NJ",
    fullAddress: "40 North Van Brunt Street Ste 23\nEnglewood, NJ 07631\nUSA",
    locationId: "new-york",
  },
  {
    countryCode: "gb",
    city: "Strabane, Northern Ireland",
    fullAddress:
      "ShipItSmart Consulting Unit 1 Mahon Building\n39/49 Dock St, Strabane BT82 8EE\nUnited Kingdom",
    locationId: "belfast",
  },
  {
    countryCode: "ie",
    city: "Convoy, Donegal",
    fullAddress:
      "Unit 4 Lower, Convoy Enterprise Centre\nConvoy, Donegal, F93 H5F9\nIreland",
    locationId: "dublin",
  },
  {
    countryCode: "gb",
    city: "Heywood, Manchester",
    fullAddress:
      "Unit A, Birch Business Park\nHeywood Manchester OL10 2SX\nUnited Kingdom",
    locationId: "manchester",
  },
];

// Main 4 solutions with taglines
const partnerSolutions = [
  {
    name: "ShipItSmart",
    tagline: "Be Smart, Ship itSmart",
    description:
      "Discounted express and economy shipping with FedEx, DHL, and UPS for domestic and international parcels—rate compare, book, and track in one place.",
  },
  {
    name: "FreightItSmart",
    tagline: "Be Smart, Freight itSmart",
    description:
      "LTL, FTL, air, and ocean freight made simple—instant quotes, multi‑carrier options, and end‑to‑end visibility for heavy and bulk shipments.",
  },
  {
    name: "ReturnItSmart",
    tagline: "Be Smart, Return itSmart",
    description:
      "Hassle‑free returns with prepaid labels, smart routing, and status updates—improve CX while controlling costs and reverse‑logistics complexity.",
  },
  {
    name: "FulfillItSmart",
    tagline: "Be Smart, Fulfill itSmart",
    description:
      "Omnichannel fulfillment and inventory sync—pick, pack, and ship with real‑time rates, automation rules, and integrations to your sales channels.",
  },
];

export default function Footer() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const footer = document.querySelector("#footer");
    if (footer) {
      observer.observe(footer);
    }

    return () => observer.disconnect();
  }, []);

  // Auto-advance carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % partnerSolutions.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getCurrentSolution = () => {
    return partnerSolutions[currentIndex];
  };

  return (
    <footer id="footer" className="bg-white py-8">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* Logo and Partnership Section */}
          <div
            className={`col-span-1 md:col-start-1 md:row-start-1 transition-all duration-700 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-3"
            }`}
          >
            {/* Logo */}
            <div className="mb-4 text-left">
              <Image
                src="/gaLogo.png"
                alt="Global American LLC"
                width={200}
                height={60}
                className="hover:scale-105 transition-transform duration-300"
              />
            </div>

            {/* In Partnership with Section */}
            <div className="mb-4 text-left">
              <h4 className="text-base font-semibold mb-3 text-[#1F447B]">
                In <span className="text-[#EB993C]">Partnership</span> with
              </h4>
              <div className="relative">
                <div className="min-h-[60px] flex items-center">
                  <div
                    key={`${getCurrentSolution().name}-${currentIndex}`}
                    className={`text-left transition-all duration-500 w-full ${
                      isVisible
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-2"
                    }`}
                  >
                    <p className="text-sm font-semibold text-[#1F447B] leading-tight mb-1">
                      {getCurrentSolution().name}
                    </p>
                    <p className="text-xs text-[#EB993C] font-medium">
                      {getCurrentSolution().tagline}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            className={`col-span-1 md:col-start-1 md:col-span-2 md:row-start-2 transition-all duration-700 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-3"
            }`}
            style={{ transitionDelay: "120ms" }}
          >
            <p className="text-[#1F447B] text-sm font-medium leading-relaxed mb-6">
              {getCurrentSolution().description}
            </p>
          </div>

          {/* Quick Links */}
          <div className="col-span-1 md:col-start-2 md:row-start-1 flex flex-col items-start">
            <h3 className="font-semibold text-lg mb-4">
              <span className="text-[#1F447B]">Quick</span>{" "}
              <span className="text-[#EB993C]">Links</span>
            </h3>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              {[
                { label: "Home", href: "/" },
                { label: "Services", href: "/#services" },
                { label: "About Us", href: "/about" },
                { label: "Contact Us", href: "/contact" },
                { label: "Contact Us v2", href: "/contact-v2" },
                { label: "Contact Us v3", href: "/contact-v3" },
              ].map((link) => (
                <div
                  key={link.label}
                  className="flex items-center justify-start gap-2"
                >
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#EB993C] flex-shrink-0 self-center"></span>
                  <Link
                    href={link.href}
                    className="text-[#1F447B] hover:text-[#EB993C] transition-colors text-sm font-medium"
                  >
                    {link.label}
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Our Brands */}
          <div
            className={`col-span-1 md:col-start-3 md:row-start-1 flex flex-col items-start text-start md:ml-8 lg:ml-12 transition-all duration-700 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-3"
            }`}
            style={{ transitionDelay: "200ms" }}
          >
            <h3 className="font-semibold text-lg mb-4 text-start">
              <span className="text-[#1F447B]">Our</span>{" "}
              <span className="text-[#EB993C]">Brands</span>
            </h3>
            <div className="space-y-2">
              <ul className="space-y-2">
                {[
                  { label: "ShipItSmart", href: "/#brands" },
                  { label: "FreightItSmart", href: "/#brands" },
                  { label: "ReturnItSmart", href: "/#brands" },
                  { label: "FulfillItSmart", href: "/#brands" },
                ].map((link) => (
                  <li
                    key={link.label}
                    className="flex items-start justify-start gap-2"
                  >
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#EB993C] flex-shrink-0 self-center"></span>
                    <Link
                      href={link.href}
                      className="text-[#1F447B] hover:text-[#EB993C] transition-colors text-sm font-medium"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Global Locations and Get In Touch */}
          <div
            className={`col-span-1 md:col-start-4 md:row-start-1 md:row-span-2 flex flex-col items-start text-start transition-all duration-700 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-3"
            }`}
            style={{ transitionDelay: "300ms" }}
          >
            <h3 className="font-semibold text-lg mb-4 text-start">
              <span className="text-[#1F447B]">Global</span>{" "}
              <span className="text-[#EB993C]">Locations</span>
            </h3>
            <div className="space-y-2">
              <div className="flex items-start justify-start space-x-2">
                <div className="text-sm leading-relaxed text-start text-[#1F447B]">
                  {globalLocations.map((location, index) => (
                    <div key={index} className="flex items-center gap-2 mb-1">
                      <Link
                        href={`/about?location=${location.locationId}#warehouse-locations`}
                        className="font-medium text-foreground hover:text-[#EB993C] transition-colors duration-200 flex items-center gap-1 group"
                      >
                        <span
                          className={`fi fi-${location.countryCode} rounded-sm shadow-sm`}
                          aria-hidden="true"
                          style={{ width: 16, height: 12 }}
                        />
                        <span>{location.city}</span>
                        <MapPin className="h-3 w-3 text-accent group-hover:text-[#EB993C] transition-colors" />
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Contact Us merged below Locations */}
            <div className="mt-6">
              <h3 className="font-semibold text-lg mb-4 text-start">
                <span className="text-[#1F447B]">Get In</span>{" "}
                <span className="text-[#EB993C]">Touch</span>
              </h3>
              <div className="space-y-3">
                <div className="flex items-start justify-start space-x-2">
                  <Phone
                    className="h-4 w-4 flex-shrink-0 text-[#EB993C]"
                    aria-hidden="true"
                  />
                  <span className="text-sm text-[#1F447B]">
                    +1 551-205-9492
                  </span>
                </div>
                <div className="flex justify-start space-x-4 pt-2">
                  <a
                    href="#"
                    className="text-[#EB993C] hover:text-[#1F447B] transition-colors"
                    aria-label="Facebook"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </a>
                  <a
                    href="#"
                    className="text-[#EB993C] hover:text-[#1F447B] transition-colors"
                    aria-label="X"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </a>
                  <a
                    href="#"
                    className="text-[#EB993C] hover:text-[#1F447B] transition-colors"
                    aria-label="LinkedIn"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  </a>
                  <a
                    href="#"
                    className="text-[#EB993C] hover:text-[#1F447B] transition-colors"
                    aria-label="Instagram"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  </a>
                  <a
                    href="#"
                    className="text-[#EB993C] hover:text-[#1F447B] transition-colors"
                    aria-label="YouTube"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                    </svg>
                  </a>
                  <a
                    href="#"
                    className="text-[#EB993C] hover:text-[#1F447B] transition-colors"
                    aria-label="TikTok"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="col-span-1 md:col-start-5 md:row-start-1 md:row-span-2 flex items-start justify-center">
            <Image
              src="/shipItSmartIcon.png"
              alt="ShipItSmart Icon"
              width={195}
              height={195}
              className="w-auto object-contain"
              priority={false}
            />
          </div>
        </div>
      </div>
    </footer>
  );
}
