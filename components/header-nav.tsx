"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";
import {
  Menu,
  X,
  ChevronDown,
  Ship,
  Truck,
  Package,
  RotateCcw,
  ArrowRight,
} from "lucide-react";

const solutions = [
  {
    name: "ShipItSmart",
    title: "Global Shipping Simplified",
    description:
      "Smart shipping solutions with global carrier connections and real-time tracking.",
    icon: <Ship className="h-6 w-6" />,
    color: "from-orange-600 to-orange-800",
    bgColor: "bg-gradient-to-br from-orange-600 to-orange-800",
    textColor: "text-white",
    href: "/#brands",
  },
  {
    name: "FreightItSmart",
    title: "Smarter Freight Solutions",
    description:
      "AI-driven freight optimization with comprehensive carrier network access.",
    icon: <Truck className="h-6 w-6" />,
    color: "from-blue-600 to-blue-800",
    bgColor: "bg-gradient-to-br from-blue-600 to-blue-800",
    textColor: "text-white",
    href: "/#brands",
  },
  {
    name: "ReturnItSmart",
    title: "Seamless Returns Process",
    description:
      "Intelligent reverse logistics that transforms returns into customer satisfaction.",
    icon: <RotateCcw className="h-6 w-6" />,
    color: "from-orange-600 to-orange-800",
    bgColor: "bg-gradient-to-br from-orange-600 to-orange-800",
    textColor: "text-white",
    href: "/#brands",
  },
  {
    name: "FulfillItSmart",
    title: "End-to-End Fulfillment",
    description:
      "Complete fulfillment solutions that scale with your business growth.",
    icon: <Package className="h-6 w-6" />,
    color: "from-blue-600 to-blue-800",
    bgColor: "bg-gradient-to-br from-blue-600 to-blue-800",
    textColor: "text-white",
    href: "/#brands",
  },
];

export default function HeaderNav() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoginDropdownOpen, setIsLoginDropdownOpen] = useState(false);
  const [isMobileLoginOpen, setIsMobileLoginOpen] = useState(false);
  const loginDropdownRef = useRef<HTMLDivElement>(null);

  // Function to check if a navigation item is active
  const isActiveLink = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    if (href.startsWith("/#")) {
      return (
        pathname === "/" &&
        typeof window !== "undefined" &&
        window.location.hash === href.substring(1)
      );
    }
    return pathname === href;
  };

  // Smooth scroll function with better easing
  const smoothScrollTo = (elementId: string) => {
    const element = document.getElementById(elementId.replace("#", ""));
    if (element) {
      const headerOffset = 100; // Height of fixed header + some padding
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition =
        elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  // Enhanced navigation click handler
  const handleNavClick = (href: string, callback?: () => void) => {
    if (href.startsWith("#")) {
      smoothScrollTo(href);
    }
    if (callback) {
      callback();
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    // Close dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (
        loginDropdownRef.current &&
        !loginDropdownRef.current.contains(event.target as Node)
      ) {
        setIsLoginDropdownOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white shadow-lg border-b border-gray-100"
          : "bg-white shadow-sm"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center group">
            <Image
              src="/images/logo.png"
              alt="Global American LLC"
              width={180}
              height={54}
              className="h-10 w-auto hover:scale-105 transition-transform duration-300"
            />
          </Link>
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className={`text-base font-medium transition-all duration-200 py-2 relative ${
                isActiveLink("/")
                  ? "text-[#1F447B] font-semibold"
                  : "text-muted-foreground hover:text-[#EB993C]"
              }`}
            >
              Home
              {isActiveLink("/") && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1F447B] rounded-full"></div>
              )}
            </Link>

            <Link
              href="/#services"
              className={`text-base font-medium transition-all duration-200 py-2 relative ${
                isActiveLink("/#services")
                  ? "text-[#1F447B] font-semibold"
                  : "text-muted-foreground hover:text-[#EB993C]"
              }`}
            >
              Services
              {isActiveLink("/#services") && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1F447B] rounded-full"></div>
              )}
            </Link>

            <Link
              href="/#integrations"
              className={`text-base font-medium transition-all duration-200 py-2 relative ${
                isActiveLink("/#integrations")
                  ? "text-[#1F447B] font-semibold"
                  : "text-muted-foreground hover:text-[#EB993C]"
              }`}
            >
              Integrations
              {isActiveLink("/#integrations") && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1F447B] rounded-full"></div>
              )}
            </Link>

            <Link
              href="/about"
              className={`text-base font-medium transition-all duration-200 py-2 relative ${
                isActiveLink("/about")
                  ? "text-[#1F447B] font-semibold"
                  : "text-muted-foreground hover:text-[#EB993C]"
              }`}
            >
              About Us
              {isActiveLink("/about") && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1F447B] rounded-full"></div>
              )}
            </Link>

            <Link
              href="/contact"
              className={`text-base font-medium transition-all duration-200 py-2 relative ${
                isActiveLink("/contact")
                  ? "text-[#1F447B] font-semibold"
                  : "text-muted-foreground hover:text-[#EB993C]"
              }`}
            >
              Contact Us
              {isActiveLink("/contact") && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1F447B] rounded-full"></div>
              )}
            </Link>

            {/* Login Button with Dropdown */}
            <div ref={loginDropdownRef} className="relative">
              <Button
                className="bg-[#EB993C] hover:bg-[#EB993C]/90 text-white font-medium px-6 py-2 rounded-full border-2 border-[#1F447B] transition-all duration-200 flex items-center gap-2"
                onClick={() => setIsLoginDropdownOpen(!isLoginDropdownOpen)}
              >
                Login
                <ChevronDown
                  className={`h-4 w-4 transition-transform duration-200 ${
                    isLoginDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </Button>

              {/* Login Solutions Dropdown */}
              <div
                className={`absolute right-0 top-full mt-2 w-72 z-50 transition-all duration-200 ${
                  isLoginDropdownOpen
                    ? "opacity-100 visible translate-y-0"
                    : "opacity-0 invisible translate-y-1"
                }`}
              >
                <div className="bg-white shadow-lg border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-bold text-foreground mb-4">
                    Choose Your Platform
                  </h3>
                  <div className="space-y-2">
                    {solutions.map((solution) => (
                      <div
                        key={solution.name}
                        className={`flex items-center justify-between p-3 rounded-md transition-all duration-200 ${
                          solution.name === "ShipItSmart"
                            ? "hover:bg-gray-50 cursor-pointer border border-accent/20"
                            : "opacity-40 blur-[1px] cursor-not-allowed"
                        }`}
                      >
                        <div className="flex-1">
                          <h4
                            className={`text-sm font-bold ${
                              solution.name === "ShipItSmart"
                                ? "text-foreground"
                                : "text-muted-foreground"
                            }`}
                          >
                            {solution.name}
                          </h4>
                          <p className="text-xs text-muted-foreground">
                            {solution.name === "ShipItSmart"
                              ? solution.title
                              : "Coming Soon"}
                          </p>
                        </div>
                        {solution.name === "ShipItSmart" && (
                          <Button
                            size="sm"
                            className="bg-accent hover:bg-accent/90 text-accent-foreground text-xs px-3 py-1 ml-3"
                            onClick={() => {
                              setIsLoginDropdownOpen(false);
                              // Redirect to connexx.co.uk
                              window.open("https://connexx.co.uk", "_blank");
                            }}
                          >
                            Login
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </nav>
          <div className="md:hidden">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="bg-accent text-accent-foreground border-accent hover:bg-accent/90"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
              <span className="sr-only">
                {isMobileMenuOpen ? "Close menu" : "Open menu"}
              </span>
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden fixed inset-x-0 top-[80px] z-40 bg-white border-t border-gray-100 shadow-lg transition-all duration-300 ${
          isMobileMenuOpen
            ? "opacity-100 visible translate-y-0 pointer-events-auto"
            : "opacity-0 invisible -translate-y-2 pointer-events-none"
        }`}
      >
        <div className="container mx-auto px-4 py-6 space-y-6">
          {/* Navigation Links */}
          <div className="space-y-4">
            <Link
              href="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block text-lg font-medium transition-all duration-200 py-2 w-full text-left relative ${
                isActiveLink("/")
                  ? "text-[#1F447B] font-semibold"
                  : "text-muted-foreground hover:text-[#EB993C]"
              }`}
            >
              Home
              {isActiveLink("/") && (
                <div className="absolute bottom-0 left-0 w-8 h-0.5 bg-[#1F447B] rounded-full"></div>
              )}
            </Link>

            <Link
              href="/#services"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block text-lg font-medium transition-all duration-200 py-2 w-full text-left relative ${
                isActiveLink("/#services")
                  ? "text-[#1F447B] font-semibold"
                  : "text-muted-foreground hover:text-[#EB993C]"
              }`}
            >
              Services
              {isActiveLink("/#services") && (
                <div className="absolute bottom-0 left-0 w-8 h-0.5 bg-[#1F447B] rounded-full"></div>
              )}
            </Link>

            <Link
              href="/#integrations"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block text-lg font-medium transition-all duration-200 py-2 w-full text-left relative ${
                isActiveLink("/#integrations")
                  ? "text-[#1F447B] font-semibold"
                  : "text-muted-foreground hover:text-[#EB993C]"
              }`}
            >
              Integrations
              {isActiveLink("/#integrations") && (
                <div className="absolute bottom-0 left-0 w-8 h-0.5 bg-[#1F447B] rounded-full"></div>
              )}
            </Link>

            <Link
              href="/contact"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block text-lg font-medium transition-all duration-200 py-2 w-full text-left relative ${
                isActiveLink("/contact")
                  ? "text-[#1F447B] font-semibold"
                  : "text-muted-foreground hover:text-[#EB993C]"
              }`}
            >
              Quote
              {isActiveLink("/contact") && (
                <div className="absolute bottom-0 left-0 w-8 h-0.5 bg-[#1F447B] rounded-full"></div>
              )}
            </Link>

            <Link
              href="/#demo"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block text-lg font-medium transition-all duration-200 py-2 w-full text-left relative ${
                isActiveLink("/#demo")
                  ? "text-[#1F447B] font-semibold"
                  : "text-muted-foreground hover:text-[#EB993C]"
              }`}
            >
              Demo
              {isActiveLink("/#demo") && (
                <div className="absolute bottom-0 left-0 w-8 h-0.5 bg-[#1F447B] rounded-full"></div>
              )}
            </Link>

            <Link
              href="/about"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block text-lg font-medium transition-all duration-200 py-2 w-full text-left relative ${
                isActiveLink("/about")
                  ? "text-[#1F447B] font-semibold"
                  : "text-muted-foreground hover:text-[#EB993C]"
              }`}
            >
              About Us
              {isActiveLink("/about") && (
                <div className="absolute bottom-0 left-0 w-8 h-0.5 bg-[#1F447B] rounded-full"></div>
              )}
            </Link>

            <Link
              href="/contact"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block text-lg font-medium transition-all duration-200 py-2 w-full text-left relative ${
                isActiveLink("/contact")
                  ? "text-[#1F447B] font-semibold"
                  : "text-muted-foreground hover:text-[#EB993C]"
              }`}
            >
              Contact Us
              {isActiveLink("/contact") && (
                <div className="absolute bottom-0 left-0 w-8 h-0.5 bg-[#1F447B] rounded-full"></div>
              )}
            </Link>

            {/* Mobile Login Button with Dropdown */}
            <div className="space-y-3">
              <Button
                className="bg-[#EB993C] hover:bg-[#EB993C]/90 text-white font-medium w-full py-3 rounded-full border-2 border-[#1F447B] transition-all duration-200 flex items-center justify-center gap-2"
                onClick={() => setIsMobileLoginOpen(!isMobileLoginOpen)}
              >
                Login
                <ChevronDown
                  className={`h-4 w-4 transition-transform duration-200 ${
                    isMobileLoginOpen ? "rotate-180" : ""
                  }`}
                />
              </Button>

              <div
                className={`transition-all duration-300 ease-in-out overflow-hidden ${
                  isMobileLoginOpen
                    ? "max-h-96 opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                <div className="space-y-3 pt-2">
                  {solutions.map((solution) => (
                    <div
                      key={solution.name}
                      className={`flex items-center justify-between p-3 rounded-md transition-all duration-200 ${
                        solution.name === "ShipItSmart"
                          ? "bg-gray-50 cursor-pointer border border-accent/20"
                          : "opacity-40 blur-[1px] cursor-not-allowed"
                      }`}
                      onClick={() => {
                        if (solution.name === "ShipItSmart") {
                          setIsMobileMenuOpen(false);
                          setIsMobileLoginOpen(false);
                          // Redirect to connexx.co.uk
                          window.open("https://connexx.co.uk", "_blank");
                        }
                      }}
                    >
                      <div className="flex-1">
                        <h5
                          className={`text-base font-bold ${
                            solution.name === "ShipItSmart"
                              ? "text-foreground"
                              : "text-muted-foreground"
                          }`}
                        >
                          {solution.name}
                        </h5>
                        <p className="text-sm text-muted-foreground">
                          {solution.name === "ShipItSmart"
                            ? solution.title
                            : "Coming Soon"}
                        </p>
                      </div>
                      {solution.name === "ShipItSmart" && (
                        <div className="text-xs bg-accent text-accent-foreground px-3 py-1 rounded ml-3">
                          Login
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
