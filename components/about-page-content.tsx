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

  // GSAP animation for parcels moving clockwise around edges
  useEffect(() => {
    if (!borderContainerRef.current) return;

    const container = borderContainerRef.current;
    const parcels = Array.from(container.querySelectorAll('.parcel-icon')) as HTMLElement[];
    
    if (parcels.length === 0) return;

    const animateParcels = () => {
      // Get dimensions
      const viewportWidth = window.innerWidth;
      const parentElement = container.parentElement;
      if (!parentElement) return;
      
      // Get footer position
      const footer = document.querySelector('footer');
      if (!footer) return;
      
      // Calculate the content height (from top of page to top of footer)
      const contentHeight = footer.offsetTop;
      
      // Define margins and icon size
      const uniformMargin = 20;
      const headerHeight = 72; // Height of the fixed header
      const iconSize = 28; // Approximate size of the parcel icon (h-7 w-7)
      
      // Define the rectangular boundary - accounting for icon size
      // Icons are positioned by their top-left corner, so we need to offset by icon dimensions
      const left = uniformMargin;
      const right = viewportWidth - uniformMargin - iconSize;
      const top = headerHeight + uniformMargin; // Start below the header with margin
      const bottom = contentHeight - uniformMargin - iconSize;
      
      // Calculate dimensions
      const width = right - left;
      const height = bottom - top;
      const perimeter = (width * 2) + (height * 2);
      
      // Animation settings
      const duration = 100;
      const spacing = perimeter / parcels.length;
      
      parcels.forEach((parcel, index) => {
        const distance = (index * spacing) % perimeter;
        let x = 0;
        let y = 0;
        
        // Calculate starting position on perimeter
        if (distance < width) {
          // Top edge
          x = left + distance;
          y = top;
        } else if (distance < width + height) {
          // Right edge
          x = right;
          y = top + (distance - width);
        } else if (distance < (width * 2) + height) {
          // Bottom edge
          x = right - (distance - width - height);
          y = bottom;
        } else {
          // Left edge
          x = left;
          y = bottom - (distance - (width * 2) - height);
        }
        
        // Create animation timeline
        const tl = gsap.timeline({ repeat: -1, ease: "none" });
        tl.set(parcel, { left: x, top: y });
        
        // Calculate segment durations
        const topTime = (width / perimeter) * duration;
        const rightTime = (height / perimeter) * duration;
        const bottomTime = (width / perimeter) * duration;
        const leftTime = (height / perimeter) * duration;
        
        // Animate clockwise from starting position
        if (distance < width) {
          const remaining = width - distance;
          tl.to(parcel, { left: right, top: top, duration: (remaining / width) * topTime, ease: "none" });
          tl.to(parcel, { left: right, top: bottom, duration: rightTime, ease: "none" });
          tl.to(parcel, { left: left, top: bottom, duration: bottomTime, ease: "none" });
          tl.to(parcel, { left: left, top: top, duration: leftTime, ease: "none" });
          tl.to(parcel, { left: x, top: top, duration: (distance / width) * topTime, ease: "none" });
        } else if (distance < width + height) {
          const onRight = distance - width;
          const remaining = height - onRight;
          tl.to(parcel, { left: right, top: bottom, duration: (remaining / height) * rightTime, ease: "none" });
          tl.to(parcel, { left: left, top: bottom, duration: bottomTime, ease: "none" });
          tl.to(parcel, { left: left, top: top, duration: leftTime, ease: "none" });
          tl.to(parcel, { left: right, top: top, duration: topTime, ease: "none" });
          tl.to(parcel, { left: right, top: y, duration: (onRight / height) * rightTime, ease: "none" });
        } else if (distance < (width * 2) + height) {
          const onBottom = distance - width - height;
          const remaining = width - onBottom;
          tl.to(parcel, { left: left, top: bottom, duration: (remaining / width) * bottomTime, ease: "none" });
          tl.to(parcel, { left: left, top: top, duration: leftTime, ease: "none" });
          tl.to(parcel, { left: right, top: top, duration: topTime, ease: "none" });
          tl.to(parcel, { left: right, top: bottom, duration: rightTime, ease: "none" });
          tl.to(parcel, { left: x, top: bottom, duration: (onBottom / width) * bottomTime, ease: "none" });
        } else {
          const onLeft = distance - (width * 2) - height;
          const remaining = height - onLeft;
          tl.to(parcel, { left: left, top: top, duration: (remaining / height) * leftTime, ease: "none" });
          tl.to(parcel, { left: right, top: top, duration: topTime, ease: "none" });
          tl.to(parcel, { left: right, top: bottom, duration: rightTime, ease: "none" });
          tl.to(parcel, { left: left, top: bottom, duration: bottomTime, ease: "none" });
          tl.to(parcel, { left: left, top: y, duration: (onLeft / height) * leftTime, ease: "none" });
        }
      });
    };

    const timeoutId = setTimeout(animateParcels, 100);

    const handleResize = () => {
      gsap.killTweensOf(Array.from(container.querySelectorAll('.parcel-icon')));
      setTimeout(animateParcels, 100);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      clearTimeout(timeoutId);
      gsap.killTweensOf(Array.from(container.querySelectorAll('.parcel-icon')));
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div style={{ backgroundColor: "#f6fdfe" }} className="relative">
      {/* Parcel border around full viewport edges (scrolls with page) */}
      <div 
        ref={borderContainerRef} 
        className="absolute pointer-events-none z-10" 
        style={{ 
          left: '0',
          right: '0', 
          top: 0,
          bottom: 0,
          width: '100vw',
          marginLeft: 'calc(-50vw + 50%)'
        }}
      >
        {[...Array(60)].map((_, i) => (
          <div
            key={`parcel-${i}`}
            className="parcel-icon absolute"
            style={{ opacity: 0.3 }}
          >
            <Package className="h-6 w-6 md:h-7 md:w-7 text-[#EB993C]" />
          </div>
        ))}
      </div>

      {/* Content */}
      <section id="about" className="pt-20 md:pt-28 lg:pt-36 pb-8 md:pb-12 lg:pb-16">
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

        {/* Our Team Section */}
        <div
          ref={teamRef}
          className={`text-center pb-4 md:pb-6 lg:pb-8 transition-all duration-700 ${
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

      {/* Warehouse Locations Section */}
      <WarehouseLocationsSection />
    </div>
  );
}
