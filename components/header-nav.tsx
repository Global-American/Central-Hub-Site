"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";
import ScrollProgress from "@/components/scroll-progress";
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
    name: "Connexx",
    title: "Label Generation Platform",
    href: "https://connexx.co.uk",
    enabled: true,
    ctaLabel: "Login",
  },
  {
    name: "Ship It Smart",
    title: "Providing you simple shipping solutions",
    href: "/#brands",
    enabled: true,
    ctaLabel: "Visit",
  },
  {
    name: "FreightItSmart",
    title: "Coming Soon",
    href: "",
    enabled: false,
    ctaLabel: "Coming Soon",
  },
  {
    name: "ReturnItSmart",
    title: "Coming Soon",
    href: "",
    enabled: false,
    ctaLabel: "Coming Soon",
  },
  {
    name: "FulfillItSmart",
    title: "Coming Soon",
    href: "",
    enabled: false,
    ctaLabel: "Coming Soon",
  },
];

// Desktop links; Log In is the orange button on the right
const navLinks = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About Us" },
  { href: "/quote", label: "Quote" },
  { href: "/contact", label: "Contact Us" },
];

export default function HeaderNav() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoginDropdownOpen, setIsLoginDropdownOpen] = useState(false);
  const [isMobileLoginOpen, setIsMobileLoginOpen] = useState(false);
  const [currentHash, setCurrentHash] = useState("");
  const loginDropdownRef = useRef<HTMLDivElement>(null);

  // Function to check if a navigation item is active
  const isActiveLink = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    if (href.startsWith("/#")) {
      return pathname === "/" && currentHash === href.substring(1);
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
      setCurrentHash(href);
    }
    if (callback) {
      callback();
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    // Handle hash changes for client-side navigation
    const handleHashChange = () => {
      setCurrentHash(window.location.hash);
    };

    // Initialize hash on mount
    setCurrentHash(window.location.hash);

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
    window.addEventListener("hashchange", handleHashChange);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("hashchange", handleHashChange);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    // Floating pill bar; the strip around it lets clicks through to the page
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 px-3 pt-4 sm:px-4">
      {/* Home page only; the strip above the bar stays everywhere so the nav doesn't shift */}
      {pathname === "/" && <ScrollProgress />}
      <div
        className={`pointer-events-auto mx-auto flex h-16 max-w-6xl items-center rounded-2xl border border-[#1F447B]/10 bg-white/95 px-4 backdrop-blur-md transition-shadow duration-300 sm:px-5 ${
          isScrolled
            ? "shadow-[0_12px_32px_-10px_rgba(31,68,123,0.3)]"
            : "shadow-[0_8px_24px_-12px_rgba(31,68,123,0.22)]"
        }`}
      >
        <Link href="/" className="flex shrink-0 items-center">
          <Image
            src="/gaLogo.svg"
            alt="Global American LLC"
            width={136}
            height={41}
            className="hover:scale-105 transition-transform duration-300"
          />
        </Link>

        <span className="mx-5 hidden h-6 w-px bg-[#1F447B]/15 lg:block" aria-hidden="true" />

        <nav className="hidden items-center gap-1 lg:flex">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`rounded-lg px-3 py-2 text-[15px] transition-colors duration-200 ${
                isActiveLink(href)
                  ? "bg-[#DBEAFE] font-semibold text-[#1F447B]"
                  : "font-medium text-[#1F447B]/75 hover:bg-[#DBEAFE] hover:text-[#1F447B]"
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto hidden items-center lg:flex">
          <span className="mr-3 h-6 w-px bg-[#1F447B]/15" aria-hidden="true" />

          {/* Log In with platform dropdown */}
          <div ref={loginDropdownRef} className="relative">
            <button
              type="button"
              aria-expanded={isLoginDropdownOpen}
              className="inline-flex h-10 items-center gap-2 rounded-full border-2 border-[#1F447B] bg-[#EB993C] px-6 text-[15px] font-semibold text-white shadow-[0_4px_10px_-4px_rgba(235,153,60,0.6)] transition-all duration-200 hover:bg-[#d88730] hover:shadow-[0_4px_10px_-3px_rgba(235,153,60,0.7)]"
              onClick={() => setIsLoginDropdownOpen(!isLoginDropdownOpen)}
            >
              Log In
              <ChevronDown
                className={`h-4 w-4 transition-transform duration-200 ${isLoginDropdownOpen ? "rotate-180" : ""}`}
              />
            </button>

            {/* Login Solutions Dropdown */}
            <div
              className={`absolute right-0 top-full mt-3 w-72 z-50 transition-all duration-200 ${isLoginDropdownOpen
                  ? "opacity-100 visible translate-y-0"
                  : "opacity-0 invisible translate-y-1"
                }`}
            >
              <div className="rounded-2xl border border-[#1F447B]/10 bg-white p-4 shadow-[0_16px_40px_-12px_rgba(31,68,123,0.3)]">
                <h3 className="text-lg font-bold text-foreground mb-4">
                  Choose Your Platform
                </h3>
                <div className="space-y-2">
                  {solutions.map((solution) => (
                    <div
                      key={solution.name}
                      className={`flex items-center justify-between p-3 rounded-md transition-all duration-200 ${
                        solution.enabled
                          ? "hover:bg-gray-50 cursor-pointer border border-accent/20"
                          : "opacity-40 blur-[1px] cursor-not-allowed"
                        }`}
                    >
                      <div className="flex-1">
                        <h4
                          className={`text-sm font-bold ${
                            solution.enabled
                              ? "text-foreground"
                              : "text-muted-foreground"
                            }`}
                        >
                          {solution.name}
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          {solution.title}
                        </p>
                      </div>
                      {solution.enabled && (
                        <Button
                          size="sm"
                          className="bg-accent hover:bg-accent/90 text-accent-foreground text-xs px-3 py-1 ml-3"
                          onClick={() => {
                            setIsLoginDropdownOpen(false);
                            window.open(solution.href, "_blank");
                          }}
                        >
                          {solution.ctaLabel}
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>

        <div className="ml-auto lg:hidden">
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#1F447B] bg-[#EB993C] text-white shadow-[0_4px_10px_-4px_rgba(235,153,60,0.6)] transition-colors duration-200 hover:bg-[#d88730]"
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
            <span className="sr-only">
              {isMobileMenuOpen ? "Close menu" : "Open menu"}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden mx-auto mt-2 max-w-6xl max-h-[calc(100vh-6rem)] overflow-y-auto rounded-2xl border border-[#1F447B]/10 bg-white shadow-[0_16px_40px_-12px_rgba(31,68,123,0.3)] transition-all duration-300 ${isMobileMenuOpen
            ? "opacity-100 visible translate-y-0 pointer-events-auto"
            : "opacity-0 invisible -translate-y-2 pointer-events-none"
          }`}
      >
        <div className="w-full px-5 py-5 space-y-6">
          {/* Navigation Links */}
          <div className="space-y-4">
            <Link
              href="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block text-lg font-medium transition-all duration-200 py-2 w-full text-left relative group ${isActiveLink("/")
                  ? "text-[#1F447B] font-semibold"
                  : "text-muted-foreground hover:text-[#EB993C]"
                }`}
            >
              Home
              {/* Active underline */}
              {isActiveLink("/") && (
                <div className="absolute bottom-0 left-0 w-8 h-0.5 bg-[#1F447B] rounded-full"></div>
              )}
              {/* Hover underline - only show when not active */}
              {!isActiveLink("/") && (
                <div className="absolute bottom-0 left-0 w-8 h-0.5 bg-[#EB993C] rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              )}
            </Link>

            <Link
              href="/services"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block text-lg font-medium transition-all duration-200 py-2 w-full text-left relative group ${isActiveLink("/services")
                  ? "text-[#1F447B] font-semibold"
                  : "text-muted-foreground hover:text-[#EB993C]"
                }`}
            >
              Services
              {/* Active underline */}
              {isActiveLink("/services") && (
                <div className="absolute bottom-0 left-0 w-8 h-0.5 bg-[#1F447B] rounded-full"></div>
              )}
              {/* Hover underline - only show when not active */}
              {!isActiveLink("/services") && (
                <div className="absolute bottom-0 left-0 w-8 h-0.5 bg-[#EB993C] rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              )}
            </Link>

            <Link
              href="/#integrations"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block text-lg font-medium transition-all duration-200 py-2 w-full text-left relative group ${
                isActiveLink("/#integrations")
                  ? "text-[#1F447B] font-semibold"
                  : "text-muted-foreground hover:text-[#EB993C]"
              }`}
            >
              Integrations
              {/* Active underline */}
              {isActiveLink("/#integrations") && (
                <div className="absolute bottom-0 left-0 w-8 h-0.5 bg-[#1F447B] rounded-full"></div>
              )}
              {/* Hover underline - only show when not active */}
              {!isActiveLink("/#integrations") && (
                <div className="absolute bottom-0 left-0 w-8 h-0.5 bg-[#EB993C] rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              )}
            </Link>

            <Link
              href="/quote"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block text-lg font-medium transition-all duration-200 py-2 w-full text-left relative ${
                isActiveLink("/quote")
                  ? "text-[#1F447B] font-semibold"
                  : "text-muted-foreground hover:text-[#EB993C]"
                }`}
            >
              Quote
              {isActiveLink("/quote") && (
                <div className="absolute bottom-0 left-0 w-8 h-0.5 bg-[#1F447B] rounded-full"></div>
              )}
            </Link>

            <Link
              href="/#demo"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block text-lg font-medium transition-all duration-200 py-2 w-full text-left relative ${isActiveLink("/#demo")
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
              className={`block text-lg font-medium transition-all duration-200 py-2 w-full text-left relative group ${isActiveLink("/about")
                  ? "text-[#1F447B] font-semibold"
                  : "text-muted-foreground hover:text-[#EB993C]"
                }`}
            >
              About Us
              {/* Active underline */}
              {isActiveLink("/about") && (
                <div className="absolute bottom-0 left-0 w-8 h-0.5 bg-[#1F447B] rounded-full"></div>
              )}
              {/* Hover underline - only show when not active */}
              {!isActiveLink("/about") && (
                <div className="absolute bottom-0 left-0 w-8 h-0.5 bg-[#EB993C] rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              )}
            </Link>

            <Link
              href="/contact"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block text-lg font-medium transition-all duration-200 py-2 w-full text-left relative group ${isActiveLink("/contact")
                  ? "text-[#1F447B] font-semibold"
                  : "text-muted-foreground hover:text-[#EB993C]"
                }`}
            >
              Contact Us
              {/* Active underline */}
              {isActiveLink("/contact") && (
                <div className="absolute bottom-0 left-0 w-8 h-0.5 bg-[#1F447B] rounded-full"></div>
              )}
              {/* Hover underline - only show when not active */}
              {!isActiveLink("/contact") && (
                <div className="absolute bottom-0 left-0 w-8 h-0.5 bg-[#EB993C] rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              )}
            </Link>

            {/* Mobile Login Button with Dropdown */}
            <div className="space-y-3">
              <Button
                className="bg-[#EB993C] hover:bg-[#d88730] text-white font-semibold w-full h-11 rounded-full border-2 border-[#1F447B] shadow-[0_4px_10px_-4px_rgba(235,153,60,0.6)] transition-all duration-200 flex items-center justify-center gap-2"
                onClick={() => setIsMobileLoginOpen(!isMobileLoginOpen)}
              >
                Log In
                <ChevronDown
                  className={`h-4 w-4 transition-transform duration-200 ${isMobileLoginOpen ? "rotate-180" : ""
                    }`}
                />
              </Button>

              <div
                className={`transition-all duration-300 ease-in-out overflow-hidden ${isMobileLoginOpen
                    ? "max-h-96 opacity-100"
                    : "max-h-0 opacity-0"
                  }`}
              >
                <div className="space-y-3 pt-2">
                  {solutions.map((solution) => (
                    <div
                      key={solution.name}
                      className={`flex items-center justify-between p-3 rounded-md transition-all duration-200 ${
                        solution.enabled
                          ? "bg-gray-50 cursor-pointer border border-accent/20"
                          : "opacity-40 blur-[1px] cursor-not-allowed"
                        }`}
                      onClick={() => {
                        if (solution.enabled) {
                          setIsMobileMenuOpen(false);
                          setIsMobileLoginOpen(false);
                          window.open(solution.href, "_blank");
                        }
                      }}
                    >
                      <div className="flex-1">
                        <h5
                          className={`text-base font-bold ${
                            solution.enabled
                              ? "text-foreground"
                              : "text-muted-foreground"
                            }`}
                        >
                          {solution.name}
                        </h5>
                        <p className="text-sm text-muted-foreground">
                          {solution.title}
                        </p>
                      </div>
                      {solution.enabled && (
                        <div className="text-xs bg-accent text-accent-foreground px-3 py-1 rounded ml-3">
                          {solution.ctaLabel}
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
