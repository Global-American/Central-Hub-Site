"use client";

import { useState, useEffect, useRef } from "react";
import { Package } from "lucide-react";
import { gsap } from "gsap";
import WarehouseLocationsSection from "@/components/warehouse-locations-section";

export default function AboutPageContent() {
  const [isAboutVisible, setIsAboutVisible] = useState(false);
  const [isTeamVisible, setIsTeamVisible] = useState(false);
  const aboutRef = useRef<HTMLDivElement>(null);
  const teamRef = useRef<HTMLDivElement>(null);
  const borderContainerRef = useRef<HTMLDivElement>(null);

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

  // GSAP animation for parcels moving clockwise around the border
  useEffect(() => {
    if (!borderContainerRef.current) return;

    const container = borderContainerRef.current;
    const contentElement = container.querySelector('.about-content-wrapper') as HTMLElement;
    const parcels = Array.from(container.querySelectorAll('.parcel-icon')) as HTMLElement[];
    
    if (!contentElement || parcels.length === 0) {
      console.log('Missing elements:', { contentElement: !!contentElement, parcelsCount: parcels.length });
      return;
    }

    const animateParcels = () => {
      const width = contentElement.offsetWidth;
      const height = contentElement.offsetHeight;
      
      console.log('Animating parcels - dimensions:', { width, height });
      
      if (width === 0 || height === 0) {
        console.log('Invalid dimensions, skipping animation');
        return;
      }
      
      const offset = 40; // Offset distance from border
      const iconSize = parcels[0]?.querySelector('svg')?.getBoundingClientRect().width || 28;
      const halfIcon = iconSize / 2;
      
      // Calculate perimeter for even spacing
      const perimeter = (width + height) * 2;
      const totalDuration = 120; // Total time for one complete loop
      
      parcels.forEach((parcel, index) => {
        // Calculate starting position based on perimeter distribution
        const startDistance = (index / parcels.length) * perimeter;
        let startLeft = 0;
        let startTop = 0;
        
        // Determine which edge the parcel starts on
        if (startDistance < width) {
          // Top edge
          startLeft = startDistance - halfIcon;
          startTop = -offset - halfIcon;
        } else if (startDistance < width + height) {
          // Right edge
          startLeft = width + offset - halfIcon;
          startTop = (startDistance - width) - halfIcon;
        } else if (startDistance < width * 2 + height) {
          // Bottom edge
          startLeft = (width - (startDistance - width - height)) - halfIcon;
          startTop = height + offset - halfIcon;
        } else {
          // Left edge
          startLeft = -offset - halfIcon;
          startTop = (height - (startDistance - width * 2 - height)) - halfIcon;
        }
        
        const tl = gsap.timeline({
          repeat: -1
        });

        // Calculate duration for each side based on its length relative to perimeter
        const topDuration = (width / perimeter) * totalDuration;
        const rightDuration = (height / perimeter) * totalDuration;
        const bottomDuration = (width / perimeter) * totalDuration;
        const leftDuration = (height / perimeter) * totalDuration;

        // Set starting position
        tl.set(parcel, {
          left: startLeft,
          top: startTop
        });

        // Animate from current position around the border (clockwise)
        if (startDistance < width) {
          // Starting on top edge
          tl.to(parcel, { left: width + offset - halfIcon, top: -offset - halfIcon, duration: topDuration * ((width - startDistance) / width), ease: "none" });
          tl.to(parcel, { left: width + offset - halfIcon, top: height + offset - halfIcon, duration: rightDuration, ease: "none" });
          tl.to(parcel, { left: -offset - halfIcon, top: height + offset - halfIcon, duration: bottomDuration, ease: "none" });
          tl.to(parcel, { left: -offset - halfIcon, top: -offset - halfIcon, duration: leftDuration, ease: "none" });
          tl.to(parcel, { left: startLeft, top: -offset - halfIcon, duration: topDuration * (startDistance / width), ease: "none" });
        } else if (startDistance < width + height) {
          // Starting on right edge
          const rightProgress = (startDistance - width) / height;
          tl.to(parcel, { left: width + offset - halfIcon, top: height + offset - halfIcon, duration: rightDuration * (1 - rightProgress), ease: "none" });
          tl.to(parcel, { left: -offset - halfIcon, top: height + offset - halfIcon, duration: bottomDuration, ease: "none" });
          tl.to(parcel, { left: -offset - halfIcon, top: -offset - halfIcon, duration: leftDuration, ease: "none" });
          tl.to(parcel, { left: width + offset - halfIcon, top: -offset - halfIcon, duration: topDuration, ease: "none" });
          tl.to(parcel, { left: width + offset - halfIcon, top: startTop, duration: rightDuration * rightProgress, ease: "none" });
        } else if (startDistance < width * 2 + height) {
          // Starting on bottom edge
          const bottomProgress = (startDistance - width - height) / width;
          tl.to(parcel, { left: -offset - halfIcon, top: height + offset - halfIcon, duration: bottomDuration * (1 - bottomProgress), ease: "none" });
          tl.to(parcel, { left: -offset - halfIcon, top: -offset - halfIcon, duration: leftDuration, ease: "none" });
          tl.to(parcel, { left: width + offset - halfIcon, top: -offset - halfIcon, duration: topDuration, ease: "none" });
          tl.to(parcel, { left: width + offset - halfIcon, top: height + offset - halfIcon, duration: rightDuration, ease: "none" });
          tl.to(parcel, { left: startLeft, top: height + offset - halfIcon, duration: bottomDuration * bottomProgress, ease: "none" });
        } else {
          // Left edge
          const leftProgress = (startDistance - width * 2 - height) / height;
          tl.to(parcel, { left: -offset - halfIcon, top: -offset - halfIcon, duration: leftDuration * (1 - leftProgress), ease: "none" });
          tl.to(parcel, { left: width + offset - halfIcon, top: -offset - halfIcon, duration: topDuration, ease: "none" });
          tl.to(parcel, { left: width + offset - halfIcon, top: height + offset - halfIcon, duration: rightDuration, ease: "none" });
          tl.to(parcel, { left: -offset - halfIcon, top: height + offset - halfIcon, duration: bottomDuration, ease: "none" });
          tl.to(parcel, { left: -offset - halfIcon, top: startTop, duration: leftDuration * leftProgress, ease: "none" });
        }
      });
    };

    // Give more time for DOM to be ready and properly sized
    const timeoutId = setTimeout(animateParcels, 500);

    const handleResize = () => {
      const resizeParcels = Array.from(container.querySelectorAll('.parcel-icon')) as HTMLElement[];
      gsap.killTweensOf(resizeParcels);
      setTimeout(animateParcels, 500);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      clearTimeout(timeoutId);
      const cleanupParcels = Array.from(container.querySelectorAll('.parcel-icon')) as HTMLElement[];
      gsap.killTweensOf(cleanupParcels);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <>
    <div style={{ backgroundColor: "#f6fdfe" }}>
      {/* Border Container with Animated Parcels wrapping both sections */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-20 md:pt-28 lg:pt-36 pb-8 md:pb-12 lg:pb-16">
        <div ref={borderContainerRef} className="relative">
          {/* Animated parcels moving clockwise around the border */}
          {[...Array(60)].map((_, i) => (
            <div
              key={`parcel-${i}`}
              className="parcel-icon absolute pointer-events-none"
              style={{
                opacity: 0.3,
                zIndex: 10
              }}
            >
              <Package className="h-6 w-6 md:h-7 md:w-7 text-[#EB993C]" />
            </div>
          ))}

          {/* Content Wrapper */}
          <div className="about-content-wrapper">
    <section
      id="about"
    >
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

        {/* Our Team Section */}
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
    </section>

    {/* Warehouse Locations Section */}
    <WarehouseLocationsSection />
          </div>
        </div>
      </div>
    </div>
  </>
  );
}
