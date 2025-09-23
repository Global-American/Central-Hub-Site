"use client";

import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin, Info } from "lucide-react";
import { useState, useEffect } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Global locations with full addresses
const globalLocations = [
  {
    flag: "🇺🇸",
    city: "New York, USA",
    fullAddress:
      "123 Business Plaza, Suite 500\nNew York, NY 10001\nUnited States",
  },
  {
    flag: "🇬🇧",
    city: "Belfast, Northern Ireland",
    fullAddress: "45 Innovation Drive\nBelfast BT1 2AB\nNorthern Ireland, UK",
  },
  {
    flag: "🇮🇪",
    city: "Dublin, Republic of Ireland",
    fullAddress: "78 Enterprise Center\nDublin D02 XY12\nRepublic of Ireland",
  },
  {
    flag: "🇬🇧",
    city: "Manchester, United Kingdom",
    fullAddress: "92 Commerce Street\nManchester M1 4BT\nUnited Kingdom",
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

// Global locations with full addresses
const globalLocations = [
  {
    flag: "🇺🇸",
    city: "New York, USA",
    fullAddress: "123 Business Plaza, Suite 500\nNew York, NY 10001\nUnited States"
  },
  {
    flag: "🇬🇧",
    city: "Belfast, Northern Ireland",
    fullAddress: "45 Innovation Drive\nBelfast BT1 2AB\nNorthern Ireland, UK"
  },
  {
    flag: "🇮🇪",
    city: "Dublin, Republic of Ireland",
    fullAddress: "78 Enterprise Center\nDublin D02 XY12\nRepublic of Ireland"
  },
  {
    flag: "🇬🇧",
    city: "Manchester, United Kingdom",
    fullAddress: "92 Commerce Street\nManchester M1 4BT\nUnited Kingdom"
  }
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
    <TooltipProvider delayDuration={300}>
      <footer id="footer" className="bg-white border-t border-gray-200 pt-8">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            {/* Logo and Partnership Section */}
            <div
              className={`col-span-1 transition-all duration-700 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-3"
              }`}
            >
              {/* Logo */}
              <div className="mb-4 text-left">
                <Image
                  src="/images/logo.png"
                  alt="Global American LLC"
                  width={200}
                  height={60}
                  className="h-12 w-auto hover:scale-105 transition-transform duration-300"
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

              <p className="text-[#324A6D] text-sm leading-relaxed mb-6">
                {getCurrentSolution().description}
              </p>
            </div>

            {/* Quick Links */}
            <div
              className={`col-span-1 flex flex-col items-start transition-all duration-700 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-3"
              }`}
              style={{ transitionDelay: "100ms" }}
            >
              <h3 className="font-semibold text-lg mb-4">
                <span className="text-[#1F447B]">Quick</span>{" "}
                <span className="text-[#EB993C]">Links</span>
              </h3>
              <div className="space-y-2">
                {[
                  { label: "Home", href: "/" },
                  { label: "Services", href: "/#services" },
                  { label: "Integrations", href: "/#integrations" },
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
                      className="text-[#1F447B] hover:text-[#0f2a52] transition-colors text-sm"
                    >
                      {link.label}
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            {/* Our Brands */}
            <div
              className={`col-span-1 flex flex-col items-start text-start transition-all duration-700 ${
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
                        className="text-[#1F447B] hover:text-[#0f2a52] transition-colors text-sm"
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
              className={`col-span-1 flex flex-col items-start text-start transition-all duration-700 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-3"
              }`}
              style={{ transitionDelay: "300ms" }}
            >
              {/* Global Locations */}
              <div>
                <h3 className="font-semibold text-lg mb-4 text-start">
                  <span className="text-[#1F447B]">Global</span>{" "}
                  <span className="text-[#EB993C]">Locations</span>
                </h3>
                <div className="space-y-2">
                  <div className="flex items-start justify-start space-x-2">
                    <div className="text-sm leading-relaxed text-start text-[#1F447B]">
                      {globalLocations.map((location, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 mb-1"
                        >
                          <p className="font-medium text-foreground">
                            {location.flag} {location.city}
                          </p>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button className="focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 rounded">
                                <Info className="h-4 w-4 text-accent hover:text-accent/80 cursor-pointer transition-colors duration-200" />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent side="top" className="max-w-xs">
                              <div className="text-sm whitespace-pre-line">
                                {location.fullAddress}
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      ))}
                      {/* <div className="flex items-start">
                      <MapPin
                        className="h-4 w-4 mt-0.5 flex-shrink-0 text-[#EB993C] mr-2"
                        aria-hidden="true"
                      />
                      <p className="font-medium text-[#1F447B]">
                        🇺🇸 New York, USA
                      </p>
                    </div>
                    <div className="flex items-start">
                      <MapPin
                        className="h-4 w-4 mt-0.5 flex-shrink-0 text-[#EB993C] mr-2"
                        aria-hidden="true"
                      />
                      <p className="font-medium text-[#1F447B]">
                        🇬🇧 Belfast, Northern Ireland
                      </p>
                    </div>
                    <div className="flex items-start">
                      <MapPin
                        className="h-4 w-4 mt-0.5 flex-shrink-0 text-[#EB993C] mr-2"
                        aria-hidden="true"
                      />
                      <p className="font-medium text-[#1F447B]">
                        🇮🇪 Dublin, Republic of Ireland
                      </p>
                    </div>
                    <div className="flex items-start">
                      <MapPin
                        className="h-4 w-4 mt-0.5 flex-shrink-0 text-[#EB993C] mr-2"
                        aria-hidden="true"
                      />
                      <p className="font-medium text-[#1F447B]">
                        🇬🇧 Manchester, United Kingdom
                      </p>
                    </div> */}
                    </div>
                  </div>
                </div>
              </div>

              {/* Get In Touch */}
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
                    {/* Facebook */}
                    <a
                      href="#"
                      className="text-[#EB993C] hover:text-[#d97706] transition-colors"
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
                    {/* X (Twitter) */}
                    <a
                      href="#"
                      className="text-[#EB993C] hover:text-[#d97706] transition-colors"
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
                    {/* LinkedIn */}
                    <a
                      href="#"
                      className="text-[#EB993C] hover:text-[#d97706] transition-colors"
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
                    {/* Instagram */}
                    <a
                      href="#"
                      className="text-[#EB993C] hover:text-[#d97706] transition-colors"
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
                    {/* YouTube */}
                    <a
                      href="#"
                      className="text-[#EB993C] hover:text-[#d97706] transition-colors"
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
                    {/* TikTok */}
                    <a
                      href="#"
                      className="text-[#EB993C] hover:text-[#d97706] transition-colors"
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
              {/* spacer to balance height if needed */}
              <div className="grow" />
              {/* Company Icon/Logo on far right */}
            </div>
            <div className="col-span-1 flex items-start justify-center">
              <Image
                src="/images/shipItSmartIcon.png"
                alt="ShipItSmart Icon"
                width={195}
                height={195}
                className="w-auto object-contain"
                priority={false}
              />
            </div>
          </div>

          {/* Bottom Bar */}
          <div
            className={`border-t border-gray-200 py-6 transition-all duration-700 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
            style={{ transitionDelay: "500ms" }}
          >
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <p className="text-sm text-gray-600">
                &copy; {new Date().getFullYear()} Global American LLC. All
                rights reserved.
              </p>

              {/* Additional Links */}
              <div className="flex space-x-6">
                <Link
                  href="/privacy"
                  className="text-sm text-gray-600 hover:text-[#EB993C] transition-colors"
                >
                  Privacy Policy
                </Link>
                <Link
                  href="/terms"
                  className="text-sm text-gray-600 hover:text-[#EB993C] transition-colors"
                >
                  Terms of Service
                </Link>
                <Link
                  href="/cookies"
                  className="text-sm text-gray-600 hover:text-[#EB993C] transition-colors"
                >
                  Cookie Policy
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </TooltipProvider>
  );
}
