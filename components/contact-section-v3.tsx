"use client";

import { useState, useEffect, useRef } from "react";
import { Send, Building2, Truck, Ship, Package, RotateCcw } from "lucide-react";
import { gsap } from "gsap";

function Building2Icon(props: { className?: string }) {
  return (
    <svg
      className={props.className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="#EB993C"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M9 21V9h6v12" />
      <path d="M9 3v6h6V3" />
    </svg>
  );
}

// Simple replacements for shadcn/ui components
function SimpleButton(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`bg-[#EB993C] hover:bg-[#d97706] text-white font-semibold rounded-md shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 px-8 lg:px-12 py-4 lg:py-5 text-lg lg:text-xl ${
        props.className ?? ""
      }`}
    >
      {props.children}
    </button>
  );
}

function SimpleInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`bg-white border border-gray-300 focus:border-[#EB993C] focus:ring-[#EB993C] rounded-md text-base lg:text-lg py-3 lg:py-4 px-4 w-full text-[#324A6D] ${
        props.className ?? ""
      }`}
    />
  );
}

function SimpleTextarea(
  props: React.TextareaHTMLAttributes<HTMLTextAreaElement>
) {
  return (
    <textarea
      {...props}
      className={`bg-white border border-gray-300 focus:border-[#EB993C] focus:ring-[#EB993C] rounded-md resize-none text-base lg:text-lg py-3 lg:py-4 px-4 w-full text-[#324A6D] ${
        props.className ?? ""
      }`}
    />
  );
}

function SimpleLabel(props: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      {...props}
      className={`block font-medium mb-1 ${props.className ?? ""}`}
    >
      {props.children}
    </label>
  );
}

function SimpleCheckbox({
  checked,
  onChange,
  id,
  className,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  id: string;
  className?: string;
}) {
  return (
    <input
      type="checkbox"
      id={id}
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      className={`w-5 h-5 mr-2 rounded cursor-pointer ${className ?? ""}`}
      style={{
        accentColor: "#EB993C",
        border: "2px solid #EB993C",
        outline: "2px solid #EB993C",
        outlineOffset: "-2px"
      }}
    />
  );
}

const brands = [
  {
    id: "shipitsmart",
    name: "ShipItSmart",
    description: "Global Shipping Simplified",
    icon: <Ship className="h-4 w-4" />,
  },
  {
    id: "freightitsmart",
    name: "FreightItSmart",
    description: "Freight Management Reinvented",
    icon: <Truck className="h-4 w-4" />,
  },
  {
    id: "returnitsmart",
    name: "ReturnItSmart",
    description: "Reverse Logistics Perfected",
    icon: <RotateCcw className="h-4 w-4" />,
  },
  {
    id: "fulfillitsmart",
    name: "FulfillItSmart",
    description: "End-to-End Fulfillment Excellence",
    icon: <Package className="h-4 w-4" />,
  },
];

export default function ContactSectionV3() {
  const [isVisible, setIsVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: "",
    selectedBrands: [] as string[],
  });
  const [bgColor, setBgColor] = useState("#F4FAFC");
  const sectionRef = useRef<HTMLElement>(null);
  const borderContainerRef = useRef<HTMLDivElement>(null);

  const API_BASE =
    process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4000/api/v1";

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // GSAP animation for parcels moving clockwise around border
  useEffect(() => {
    if (!borderContainerRef.current) return;

    const container = borderContainerRef.current;
    const formElement = container.querySelector('.contact-form-card') as HTMLElement;
    const parcels = Array.from(container.querySelectorAll('.parcel-icon')) as HTMLElement[];
    
    if (!formElement || parcels.length === 0) return;

    const animateParcels = () => {
      // Use offsetWidth/offsetHeight for accurate dimensions
      const width = formElement.offsetWidth;
      const height = formElement.offsetHeight;
      const offset = 30; // Offset distance from border - closer to form
      // Get actual icon size from the first parcel element
      const iconSize = parcels[0]?.querySelector('svg')?.getBoundingClientRect().width || 28;
      const halfIcon = iconSize / 2; // Center the icon on the path
      
      // Calculate perimeter for even spacing
      const perimeter = (width + height) * 2;
      const totalDuration = 120; // Total time for one complete loop - much slower for very subtle effect
      
      parcels.forEach((parcel, index) => {
        // Calculate starting position based on perimeter distribution
        const startDistance = (index / parcels.length) * perimeter;
        let startLeft = 0;
        let startTop = 0;
        
        // Determine which edge the parcel starts on (centered on icon)
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
        // Top-right corner, bottom-right corner, bottom-left corner, top-left corner
        if (startDistance < width) {
          // Starting on top edge - move to top-right corner, then continue clockwise
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

    // Small delay to ensure DOM is ready
    const timeoutId = setTimeout(animateParcels, 100);

    // Re-calculate on window resize
    const handleResize = () => {
      gsap.killTweensOf(parcels);
      setTimeout(animateParcels, 100);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      clearTimeout(timeoutId);
      gsap.killTweensOf(parcels);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleBrandSelection = (brandId: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      selectedBrands: checked
        ? [...prev.selectedBrands, brandId]
        : prev.selectedBrands.filter((id) => id !== brandId),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error || "Failed to send message");
      }
      setFormData({
        name: "",
        email: "",
        phone: "",
        company: "",
        message: "",
        selectedBrands: [],
      });
      alert("Message sent successfully.");
    } catch (err) {
      console.error(err);
      alert("There was an error sending your message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="py-20 md:py-28 lg:py-36"
      style={{ backgroundColor: bgColor }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div
          className={`text-center mb-16 lg:mb-24 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <h2 className="text-3xl md:text-4xl font-bold  mb-4">
            <span className="text-[#1F447B]">Contact</span>{" "}
            <span className="text-[#EB993C]">Us</span>
          </h2>
          <p className="text-lg text-[#324A6D] max-w-2xl mx-auto">
            Tell us about your logistics needs and we'll get back to you within
            2 hours.
          </p>
        </div>

        {/* Contact Form Section */}
        <div
          className={`max-w-4xl lg:max-w-5xl mx-auto transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
          style={{ transitionDelay: "100ms" }}
        >
          {/* Package Border Container */}
          <div ref={borderContainerRef} className="relative">
            {/* Animated parcels moving clockwise around the border */}
            {[...Array(32)].map((_, i) => (
              <div
                key={`parcel-${i}`}
                className="parcel-icon absolute pointer-events-none"
                style={{
                  opacity: 0.3
                }}
              >
                <Package className="h-6 w-6 md:h-7 md:w-7 text-[#EB993C]" />
              </div>
            ))}

            <div className="contact-form-card rounded-2xl p-6 sm:p-8 lg:p-12 xl:p-16 bg-gradient-to-br from-[#1F447B] via-[#3A6B9F] to-[#1F447B] relative overflow-hidden">
              {/* Lighter center overlay using multiple overlapping gradients */}
              <div className="absolute inset-0 rounded-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-[#5C8BC4]/20 to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-[#5C8BC4]/15 to-transparent"></div>
              </div>

            {/* Content wrapper with relative positioning */}
            <div className="relative z-10">
              <form onSubmit={handleSubmit} className="space-y-8 lg:space-y-10">
                {/* Name and Company Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10">
                  <div className="space-y-3">
                    <SimpleLabel
                      htmlFor="name"
                      className="text-base lg:text-lg text-white font-medium"
                    >
                      Full Name *
                    </SimpleLabel>
                    <SimpleInput
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div className="space-y-3">
                    <SimpleLabel
                      htmlFor="company"
                      className="text-base lg:text-lg text-white font-medium"
                    >
                      Company Name
                    </SimpleLabel>
                    <SimpleInput
                      id="company"
                      name="company"
                      type="text"
                      value={formData.company}
                      onChange={handleInputChange}
                      placeholder="Enter your company name"
                    />
                  </div>
                </div>

                {/* Phone and Email Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10">
                  <div className="space-y-3">
                    <SimpleLabel
                      htmlFor="phone"
                      className="text-base lg:text-lg text-white font-medium"
                    >
                      Phone Number
                    </SimpleLabel>
                    <SimpleInput
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Enter your phone number"
                    />
                  </div>

                  <div className="space-y-3">
                    <SimpleLabel
                      htmlFor="email"
                      className="text-base lg:text-lg text-white"
                    >
                      Email Address *
                    </SimpleLabel>
                    <SimpleInput
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter your email address"
                    />
                  </div>
                </div>

                {/* Services of Interest Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Building2Icon className="h-5 w-5" />
                    <SimpleLabel className="text-base lg:text-lg text-white font-medium">
                      Services of Interest
                    </SimpleLabel>
                  </div>
                  <p className="text-sm text-white/70 mb-4">
                    Select the services you'd like to learn more about
                    (optional)
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {brands.map((brand) => (
                      <div
                        key={brand.id}
                        className="group relative bg-white rounded-xl border border-gray-300 p-4 hover:border-[#EB993C]/30 hover:shadow-sm transition-all duration-200"
                      >
                        <div className="flex items-start space-x-3">
                          <SimpleCheckbox
                            id={brand.id}
                            checked={formData.selectedBrands.includes(brand.id)}
                            onChange={(checked) =>
                              handleBrandSelection(brand.id, checked)
                            }
                          />
                          <div className="flex-1 min-w-0">
                            <label
                              htmlFor={brand.id}
                              className="cursor-pointer block"
                            >
                              <div className="flex items-center gap-2 mb-1">
                                <div className="text-[#EB993C]">
                                  {brand.icon}
                                </div>
                                <span className="font-medium text-sm lg:text-base group-hover:text-[#EB993C] transition-colors" style={{ color: "#1F447B" }}>
                                  {brand.name}
                                </span>
                              </div>
                              <p className="text-xs lg:text-sm leading-relaxed" style={{ color: "#324A6D" }}>
                                {brand.description}
                              </p>
                            </label>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Message Field */}
                <div className="space-y-3">
                  <SimpleLabel
                    htmlFor="message"
                    className="text-base lg:text-lg text-white font-medium"
                  >
                    Message *
                  </SimpleLabel>
                  <SimpleTextarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Tell us about your logistics needs, shipping volume, or any specific requirements..."
                  />
                </div>

                {/* Submit Button */}
                <div className="text-center pt-6">
                  <SimpleButton type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2 inline-block"></span>
                        Sending...
                      </>
                    ) : (
                      <>Send Message</>
                    )}
                  </SimpleButton>
                </div>
              </form>
            </div>
          </div>
          </div>
        </div>
      </div>
    </section>
  );
}
