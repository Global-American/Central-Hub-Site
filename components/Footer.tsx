"use client";

import Link from "next/link";
import Image from "next/image";
import { Phone, MapPin } from "lucide-react";
import AnimatedItBadge from "@/components/animated-it-badge";
import SocialLinks from "@/components/social-links";
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
    fullAddress: "Strabane, Co. Tyrone\nNorthern Ireland",
    locationId: "belfast",
  },
  {
    countryCode: "ie",
    city: "Convoy, Donegal",
    fullAddress: "Convoy, Co. Donegal\nIreland",
    locationId: "dublin",
  },
  {
    countryCode: "gb",
    city: "Heywood, Manchester",
    fullAddress:
      "Unit A, Birch Business Park\nHeywood Manchester OL10 2SX\nUnited Kingdom",
    locationId: "manchester",
  },
  {
    countryCode: "cn",
    city: "Quanzhou, China",
    fullAddress:
      "Room 701, Building 3B, No. 20 Fengze Street\nShengshiTianjiao, Quanzhou City\nPost code: 362000",
    locationId: "quanzhou",
  },
  {
    countryCode: "cn",
    city: "Shenzhen, China",
    fullAddress:
      "No. 2, 1st Floor, Building 2#, No. 2 Hehualing Rd\nPinghu Street, Longgang District, Shenzhen\nPost code: 518111",
    locationId: "shenzhen",
  },
];

// Main 4 solutions with taglines
const partnerSolutions = [
  {
    name: "ShipItSmart",
    tagline: "Playing it smart, Shipping solutions",
    description:
      "Discounted express and economy shipping with FedEx, DHL, and UPS for domestic and international parcels—rate compare, book, and track in one place.",
    logo: "/shipitsmart.svg",
  },
  {
    name: "FreightItSmart",
    tagline: "Playing it smart, Freight solutions",
    description:
      "LTL, FTL, air, and ocean freight made simple—instant quotes, multi‑carrier options, and end‑to‑end visibility for heavy and bulk shipments.",
    logo: "/frieghtit.svg",
  },
  {
    name: "ReturnItSmart",
    tagline: "Playing it smart, Returns solutions",
    description:
      "Hassle‑free returns with prepaid labels, smart routing, and status updates—improve CX while controlling costs and reverse‑logistics complexity.",
    logo: "/returnit.svg",
  },
  {
    name: "FulfillItSmart",
    tagline: "Playing it smart, Fulfillment solutions",
    description:
      "Omnichannel fulfillment and inventory sync—pick, pack, and ship with real‑time rates, automation rules, and integrations to your sales channels.",
    logo: "/fufillit.svg",
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
            className={`col-span-1 md:col-start-1 md:row-start-1 transition-all duration-700 ${isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-3"
              }`}
          >
            {/* Logo */}
            <div className="mb-4 text-left">
              <Image
                src="/gaLogo.svg"
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
                    className={`text-left transition-all duration-500 w-full ${isVisible
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-2"
                      }`}
                  >
                    <div className="mb-1">
                      <Image
                        src={getCurrentSolution().logo}
                        alt={getCurrentSolution().name}
                        width={140}
                        height={40}
                        className="h-8 w-auto object-contain object-left"
                      />
                    </div>
                    <p className="text-xs text-[#EB993C] font-medium">
                      {getCurrentSolution().tagline}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            className={`col-span-1 md:col-start-1 md:col-span-2 md:row-start-2 transition-all duration-700 ${isVisible
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
                { label: "Services", href: "/services" },
                { label: "Quote", href: "/quote" },
                { label: "About Us", href: "/about" },
                { label: "Contact Us", href: "/contact" },
                { label: "Account Form", href: "/accountForm" },
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
            className={`col-span-1 md:col-start-3 md:row-start-1 flex flex-col items-start text-start md:ml-8 lg:ml-12 transition-all duration-700 ${isVisible
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
            className={`col-span-1 md:col-start-4 md:row-start-1 md:row-span-2 flex flex-col items-start text-start transition-all duration-700 ${isVisible
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
                <SocialLinks className="justify-start pt-2" />
              </div>
            </div>
          </div>
          <div className="col-span-1 md:col-start-5 md:row-start-1 md:row-span-2 flex items-center justify-center">
            <AnimatedItBadge className="w-[183px] max-w-full" />
          </div>
        </div>
      </div>
    </footer>
  );
}
