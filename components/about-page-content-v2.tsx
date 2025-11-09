"use client";

import { useState, useEffect, useRef } from "react";
import WarehouseLocationsSection from "@/components/warehouse-locations-section";
import { Package, Plane } from "lucide-react";
import CargoShipIcon from "@/components/icons/cargo-ship";

// Flipped Plane icon (horizontal mirror)
const FlippedPlane = (props: any) => (
  <Plane {...props} className={`${props?.className ?? ""} scale-x-[-1]`} />
);

// Flipped Cargo Ship icon
const FlippedCargoShip = (props: any) => (
  <CargoShipIcon
    {...props}
    className={`${props?.className ?? ""} scale-x-[-1]`}
  />
);

// Horizontal Icon Divider Component with Infinite Animation
function HorizontalDivider({
  Icon,
  className = "",
}: {
  Icon: React.ComponentType<any>;
  className?: string;
}) {
  return (
    <div
      className={`bg-white from-[#f6fdfe] via-[#ffffff] to-[#f6fdfe] border-t border-b border-muted/20 overflow-hidden transition-all duration-300 ${className}`}
    >
      <div className="relative w-full">
        {/* Single line of infinitely repeating icons */}
        <div className="flex items-center animate-scroll-infinite opacity-60">
          {/* First set of icons */}
          {Array.from({ length: 50 }).map((_, i) => (
            <div key={`icon-${i}`} className="flex-shrink-0 mx-12">
              <Icon size={24} className="text-accent" />
            </div>
          ))}
          {/* Duplicate set for seamless loop */}
          {Array.from({ length: 50 }).map((_, i) => (
            <div key={`icon-duplicate-${i}`} className="flex-shrink-0 mx-12">
              <Icon size={24} className="text-accent" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function AboutPageContentV2() {
  const [isAboutVisible, setIsAboutVisible] = useState(false);
  const [isTeamVisible, setIsTeamVisible] = useState(false);
  const aboutRef = useRef<HTMLDivElement>(null);
  const teamRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.target === aboutRef.current && entry.isIntersecting) {
            setIsAboutVisible(true);
          }
          if (entry.target === teamRef.current && entry.isIntersecting) {
            setIsTeamVisible(true);
          }
        });
      },
      { threshold: 0.3 }
    );

    if (aboutRef.current) observer.observe(aboutRef.current);
    if (teamRef.current) observer.observe(teamRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <div style={{ backgroundColor: "#f6fdfe" }}>
      {/* Divider right below header */}
      <div className="pt-[72px]">
        <HorizontalDivider Icon={Package} className="py-4 md:py-5" />
      </div>
      
      <section id="about" className="pt-8 md:pt-12 lg:pt-16 pb-8 md:pb-12 lg:pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div
          ref={aboutRef}
          className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16 lg:mb-20 transition-all duration-700 ${
            isAboutVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4"
          }`}
        >
          
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-[#1F447B] mb-6">
              About <span className="text-[#EB993C]">Us</span>
            </h2>
            <p className="text-lg text-[#324A6D] mb-6">
              Ship It Smart is revolutionizing the shipping industry by
              providing intelligent, cost-effective solutions for businesses of
              all sizes. Our platform leverages cutting-edge technology to offer
              exclusive discounts and streamlined logistics.
            </p>
            <p className="text-lg text-[#324A6D] mb-6">
              With partnerships with major carriers like FedEx, DHL, and UPS, we
              ensure your packages reach their destination safely, quickly, and
              affordably.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-[#EB993C]">10K+</div>
                <div className="text-[#324A6D]">Happy Customers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#EB993C]">50+</div>
                <div className="text-[#324A6D]">Countries Served</div>
              </div>
            </div>
          </div>
          <div className="flex justify-center">
            <div className="relative w-full max-w-md h-96">
              <img
                src="/images/globe-jig.png"
                alt="Global Logistics Solutions"
                className="w-full h-full object-contain drop-shadow-2xl"
              />
            </div>
          </div>
        </div>
        </div>
      </section>

      {/* Our Team Section */}
      <section className="py-8 md:py-12 lg:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div
            ref={teamRef}
            className={`text-center pb-8 md:pb-12 lg:pb-16 transition-all duration-700 ${
              isTeamVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
            style={{ transitionDelay: "100ms" }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-[#1F447B] mb-4">
              Our <span className="text-[#EB993C]">Team</span>
            </h2>
            <p className="text-lg text-[#324A6D] mb-12 max-w-4xl mx-auto">
              A short introduction to your team members and why their background
              should inspire potential clients' confidence.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Avi Mechlowitz */}
              <div
                className={`text-center transition-all duration-700 ${
                  isTeamVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4"
                }`}
                style={{ transitionDelay: "200ms" }}
              >
                <div
                  className="w-64 h-64 rounded-lg mb-6 mx-auto flex items-center justify-center transition-transform duration-300 hover:scale-105 cursor-pointer bg-white border-2 border-[#1F447B]"
                >
                  <svg
                    className="w-20 h-20 text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L12 2L3 7V9H21ZM12 17.5C9.5 17.5 7.59 16.04 6.9 14H17.1C16.41 16.04 14.5 17.5 12 17.5ZM12 7.5C14 7.5 15.5 9 15.5 11H8.5C8.5 9 10 7.5 12 7.5Z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-[#1F447B] mb-2">
                  Avi Mechlowitz
                </h3>
                <p className="text-[#324A6D]">Founder</p>
              </div>

              {/* Andy Ebert */}
              <div
                className={`text-center transition-all duration-700 ${
                  isTeamVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4"
                }`}
                style={{ transitionDelay: "300ms" }}
              >
                <div
                  className="w-64 h-64 rounded-lg mb-6 mx-auto flex items-center justify-center transition-transform duration-300 hover:scale-105 cursor-pointer bg-white border-2 border-[#1F447B]"
                >
                  <svg
                    className="w-20 h-20 text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L12 2L3 7V9H21ZM12 17.5C9.5 17.5 7.59 16.04 6.9 14H17.1C16.41 16.04 14.5 17.5 12 17.5ZM12 7.5C14 7.5 15.5 9 15.5 11H8.5C8.5 9 10 7.5 12 7.5Z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-[#1F447B] mb-2">
                  Andy Ebert
                </h3>
                <p className="text-[#324A6D]">Managing Director</p>
              </div>

              {/* Michael Gastwirth */}
              <div
                className={`text-center transition-all duration-700 ${
                  isTeamVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4"
                }`}
                style={{ transitionDelay: "400ms" }}
              >
                <div
                  className="w-64 h-64 rounded-lg mb-6 mx-auto flex items-center justify-center transition-transform duration-300 hover:scale-105 cursor-pointer bg-white border-2 border-[#1F447B]"
                >
                  <svg
                    className="w-20 h-20 text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L12 2L3 7V9H21ZM12 17.5C9.5 17.5 7.59 16.04 6.9 14H17.1C16.41 16.04 14.5 17.5 12 17.5ZM12 7.5C14 7.5 15.5 9 15.5 11H8.5C8.5 9 10 7.5 12 7.5Z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-[#1F447B] mb-2">
                  Michael Gastwirth
                </h3>
                <p className="text-[#324A6D]">Sales & Operations Director</p>
              </div>

              {/* Jake Geller */}
              <div
                className={`text-center transition-all duration-700 ${
                  isTeamVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4"
                }`}
                style={{ transitionDelay: "500ms" }}
              >
                <div
                  className="w-64 h-64 rounded-lg mb-6 mx-auto flex items-center justify-center transition-transform duration-300 hover:scale-105 cursor-pointer bg-white border-2 border-[#1F447B]"
                >
                  <svg
                    className="w-20 h-20 text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L12 2L3 7V9H21ZM12 17.5C9.5 17.5 7.59 16.04 6.9 14H17.1C16.41 16.04 14.5 17.5 12 17.5ZM12 7.5C14 7.5 15.5 9 15.5 11H8.5C8.5 9 10 7.5 12 7.5Z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-[#1F447B] mb-2">
                  Jake Geller
                </h3>
                <p className="text-[#324A6D]">Onboarding & I.T Support Manager</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <HorizontalDivider Icon={FlippedPlane} className="py-3" />

      {/* Warehouse Locations Section */}
      <WarehouseLocationsSection />

      {/* Divider above footer */}
      <HorizontalDivider Icon={FlippedCargoShip} className="py-3" />
    </div>
  );
}

