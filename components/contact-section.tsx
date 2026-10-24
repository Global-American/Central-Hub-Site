// "use client";

// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Label } from "@/components/ui/label";
// import { Checkbox } from "@/components/ui/checkbox";
// import { useState, useEffect, useRef } from "react";
// import { Send, Building2, Truck, Ship, Package, RotateCcw } from "lucide-react";

// const brands = [
//   {
//     id: "shipitsmart",
//     name: "ShipItSmart",
//     description: "Global Shipping Simplified",
//     icon: <Ship className="h-4 w-4" />,
//   },
//   {
//     id: "freightitsmart",
//     name: "FreightItSmart",
//     description: "Freight Management Reinvented",
//     icon: <Truck className="h-4 w-4" />,
//   },
//   {
//     id: "returnitsmart",
//     name: "ReturnItSmart",
//     description: "Reverse Logistics Perfected",
//     icon: <RotateCcw className="h-4 w-4" />,
//   },
//   {
//     id: "fulfillitsmart",
//     name: "FulfillItSmart",
//     description: "End-to-End Fulfillment Excellence",
//     icon: <Package className="h-4 w-4" />,
//   },
// ];

// export default function ContactSection() {
//   const [isVisible, setIsVisible] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   //just making a comment so i can deploy lmao
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     company: "",
//     message: "",
//     selectedBrands: [] as string[],
//   });
//   const sectionRef = useRef<HTMLElement>(null);

//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       ([entry]) => {
//         if (entry.isIntersecting) {
//           setIsVisible(true);
//         }
//       },
//       { threshold: 0.3 }
//     );

//     if (sectionRef.current) {
//       observer.observe(sectionRef.current);
//     }

//     return () => observer.disconnect();
//   }, []);

//   const handleInputChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
//   ) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleBrandSelection = (brandId: string, checked: boolean) => {
//     setFormData((prev) => ({
//       ...prev,
//       selectedBrands: checked
//         ? [...prev.selectedBrands, brandId]
//         : prev.selectedBrands.filter((id) => id !== brandId),
//     }));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsSubmitting(true);

//     // Simulate form submission
//     await new Promise((resolve) => setTimeout(resolve, 1000));

//     // Reset form
//     setFormData({
//       name: "",
//       email: "",
//       phone: "",
//       company: "",
//       message: "",
//       selectedBrands: [],
//     });
//     setIsSubmitting(false);

//     // Here you would typically send the data to your backend
//     console.log("Form submitted:", formData);
//   };

//   return (
//     <section
//       ref={sectionRef}
//       id="contact"
//       className="py-20 md:py-28 lg:py-36 bg-background"
//     >
//       <div className="container mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Header Section */}
//         <div
//           className={`text-center mb-12 lg:mb-20 transition-all duration-700 ${
//             isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
//           }`}
//         >
//           <Badge
//             variant="outline"
//             className="text-xs border-accent text-accent bg-accent/10 mb-4"
//           >
//             Get Started
//           </Badge>
//           <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
//             Let's <span className="text-accent">connect</span>
//           </h2>
//           <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
//             Tell us about your logistics needs and we'll get back to you within
//             2 hours.
//           </p>
//         </div>

//         {/* Contact Form Section */}
//         <div
//           className={`max-w-5xl lg:max-w-6xl mx-auto transition-all duration-700 ${
//             isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
//           }`}
//           style={{ transitionDelay: "100ms" }}
//         >
//           <div className="bg-[#f6fdfe] rounded-2xl p-6 sm:p-8 lg:p-12 xl:p-16">
//             <form onSubmit={handleSubmit} className="space-y-8 lg:space-y-10">
//               {/* Name and Company Row */}
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10">
//                 <div className="space-y-3">
//                   <Label
//                     htmlFor="name"
//                     className="text-base lg:text-lg font-medium text-foreground"
//                   >
//                     Full Name *
//                   </Label>
//                   <Input
//                     id="name"
//                     name="name"
//                     type="text"
//                     required
//                     value={formData.name}
//                     onChange={handleInputChange}
//                     className="bg-white border-gray-200 focus:border-accent focus:ring-accent/20 rounded-md text-base lg:text-lg py-3 lg:py-4"
//                     placeholder="Enter your full name"
//                   />
//                 </div>

//                 <div className="space-y-3">
//                   <Label
//                     htmlFor="company"
//                     className="text-base lg:text-lg font-medium text-foreground"
//                   >
//                     Company Name
//                   </Label>
//                   <Input
//                     id="company"
//                     name="company"
//                     type="text"
//                     value={formData.company}
//                     onChange={handleInputChange}
//                     className="bg-white border-gray-200 focus:border-accent focus:ring-accent/20 rounded-md text-base lg:text-lg py-3 lg:py-4"
//                     placeholder="Enter your company name"
//                   />
//                 </div>
//               </div>

//               {/* Phone and Email Row */}
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10">
//                 <div className="space-y-3">
//                   <Label
//                     htmlFor="phone"
//                     className="text-base lg:text-lg font-medium text-foreground"
//                   >
//                     Phone Number
//                   </Label>
//                   <Input
//                     id="phone"
//                     name="phone"
//                     type="tel"
//                     value={formData.phone}
//                     onChange={handleInputChange}
//                     className="bg-white border-gray-200 focus:border-accent focus:ring-accent/20 rounded-md text-base lg:text-lg py-3 lg:py-4"
//                     placeholder="Enter your phone number"
//                   />
//                 </div>

//                 <div className="space-y-3">
//                   <Label
//                     htmlFor="email"
//                     className="text-base lg:text-lg font-medium text-foreground"
//                   >
//                     Email Address *
//                   </Label>
//                   <Input
//                     id="email"
//                     name="email"
//                     type="email"
//                     required
//                     value={formData.email}
//                     onChange={handleInputChange}
//                     className="bg-white border-gray-200 focus:border-accent focus:ring-accent/20 rounded-md text-base lg:text-lg py-3 lg:py-4"
//                     placeholder="Enter your email address"
//                   />
//                 </div>
//               </div>

//               {/* Services of Interest Section */}
//               <div className="space-y-4">
//                 <div className="flex items-center gap-2 mb-3">
//                   <Building2 className="h-5 w-5 text-accent" />
//                   <Label className="text-base lg:text-lg font-medium text-foreground">
//                     Services of Interest
//                   </Label>
//                 </div>
//                 <p className="text-sm text-muted-foreground mb-4">
//                   Select the services you'd like to learn more about (optional)
//                 </p>

//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                   {brands.map((brand) => (
//                     <div
//                       key={brand.id}
//                       className="group relative bg-white rounded-xl border border-gray-200 p-4 hover:border-accent/30 hover:shadow-sm transition-all duration-200"
//                     >
//                       <div className="flex items-start space-x-3">
//                         <Checkbox
//                           id={brand.id}
//                           checked={formData.selectedBrands.includes(brand.id)}
//                           onCheckedChange={(checked) =>
//                             handleBrandSelection(brand.id, checked as boolean)
//                           }
//                           className="mt-0.5 data-[state=checked]:bg-accent data-[state=checked]:border-accent"
//                         />
//                         <div className="flex-1 min-w-0">
//                           <label
//                             htmlFor={brand.id}
//                             className="cursor-pointer block"
//                           >
//                             <div className="flex items-center gap-2 mb-1">
//                               <div className="text-accent">{brand.icon}</div>
//                               <span className="font-medium text-foreground text-sm lg:text-base group-hover:text-accent transition-colors">
//                                 {brand.name}
//                               </span>
//                             </div>
//                             <p className="text-xs lg:text-sm text-muted-foreground leading-relaxed">
//                               {brand.description}
//                             </p>
//                           </label>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               {/* Message Field */}
//               <div className="space-y-3">
//                 <Label
//                   htmlFor="message"
//                   className="text-base lg:text-lg font-medium text-foreground"
//                 >
//                   Message *
//                 </Label>
//                 <Textarea
//                   id="message"
//                   name="message"
//                   required
//                   rows={5}
//                   value={formData.message}
//                   onChange={handleInputChange}
//                   className="bg-white border-gray-200 focus:border-accent focus:ring-accent/20 rounded-md resize-none text-base lg:text-lg py-3 lg:py-4"
//                   placeholder="Tell us about your logistics needs, shipping volume, or any specific requirements..."
//                 />
//               </div>

//               {/* Submit Button */}
//               <div className="text-center pt-6">
//                 <Button
//                   type="submit"
//                   disabled={isSubmitting}
//                   size="lg"
//                   className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold rounded-md shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 px-8 lg:px-12 py-4 lg:py-5 text-lg lg:text-xl"
//                 >
//                   {isSubmitting ? (
//                     <>
//                       <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-accent-foreground mr-2"></div>
//                       Sending...
//                     </>
//                   ) : (
//                     <>
//                       <Send className="h-4 w-4 mr-2" />
//                       Send Message
//                     </>
//                   )}
//                 </Button>
//               </div>
//             </form>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }
"use client";

import { useState, useEffect, useRef } from "react";
import {
  Send,
  Building2,
  Truck,
  Ship,
  Package,
  RotateCcw,
  ChevronDown,
  Phone,
  Mail,
} from "lucide-react";
import Link from "next/link";
import SocialLinks from "@/components/social-links";
import { COUNTRIES, findCountry } from "@/lib/countries";
import { warehouseLocations } from "@/lib/warehouse-locations";
// import ColorPicker from "../components/ColorPicker";

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
      className={`bg-[#EB993C] hover:bg-[#d97706] text-white font-semibold rounded-md shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 px-8 lg:px-10 py-2.5 text-base lg:text-lg border-2 border-[#1F447B] ${
        props.className ?? ""
      }`}
    >
      {props.children}
    </button>
  );
}

function SimpleBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block text-xs border border-[#EB993C] text-[#EB993C] bg-[#EB993C] bg-opacity-10 rounded px-2 py-1 mb-4">
      {children}
    </span>
  );
}

function SimpleInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`bg-white border-2 border-[#1F447B] focus:border-[#EB993C] focus:ring-[#EB993C] rounded-md text-base py-2.5 px-4 w-full text-[#324A6D] ${
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
      className={`bg-white border-2 border-[#1F447B] focus:border-[#EB993C] focus:ring-[#EB993C] rounded-md resize-none text-base py-2.5 px-4 w-full text-[#324A6D] ${
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
      className={`accent-[#EB993C] w-5 h-5 mr-2 ${className ?? ""}`}
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

const shipItSmartServices = [
  {
    id: "usDomestic",
    name: "US Domestic",
    icon: <Ship className="h-4 w-4" />,
  },
  {
    id: "usExports",
    name: "US Exports",
    icon: <Truck className="h-4 w-4" />,
  },
  {
    id: "usImports",
    name: "US Imports",
    icon: <RotateCcw className="h-4 w-4" />,
  },
  {
    id: "ukFinalMile",
    name: "UK Final Mile",
    icon: <Package className="h-4 w-4" />,
  },
  {
    id: "ukExports",
    name: "UK Exports",
    icon: <Package className="h-4 w-4" />,
  },
  {
    id: "chinaExports",
    name: "China Exports",
    icon: <Package className="h-4 w-4" />,
  },
  {
    id: "other",
    name: "Other",
    icon: <Package className="h-4 w-4" />,
  },
];

export default function ContactPage() {
  const [isVisible, setIsVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    phoneCountry: "",
    country: "",
    company: "",
    message: "",
    selectedBrands: [] as string[],
    selectedShipItSmartServices: [] as string[],
  });
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      // Low threshold: the section is much taller than a phone held sideways,
      // so a larger fraction might never be on screen at once
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Choosing a country also switches the phone prefix to that country.
  // Clearing the country clears the phone prefix as well.
  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const country = e.target.value;
    setFormData((prev) => ({
      ...prev,
      country,
      phoneCountry: country,
    }));
  };

  const handleBrandSelection = (brandId: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      selectedBrands: checked
        ? [...prev.selectedBrands, brandId]
        : prev.selectedBrands.filter((id) => id !== brandId),
      selectedShipItSmartServices:
        brandId === "shipitsmart" && !checked
          ? []
          : prev.selectedShipItSmartServices,
    }));
  };

  const handleShipItSmartServiceSelection = (
    serviceId: string,
    checked: boolean
  ) => {
    setFormData((prev) => ({
      ...prev,
      selectedShipItSmartServices: checked
        ? [...prev.selectedShipItSmartServices, serviceId]
        : prev.selectedShipItSmartServices.filter((id) => id !== serviceId),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const isShipItSmartSelected =
        formData.selectedBrands.includes("shipitsmart");
      const shipItSmartServiceDetails = isShipItSmartSelected
        ? shipItSmartServices
            .filter((service) =>
              formData.selectedShipItSmartServices.includes(service.id)
            )
            .map((service) => ({
              id: service.id,
              name: service.name,
            }))
        : [];
      const selectedBrands =
        isShipItSmartSelected && shipItSmartServiceDetails.length > 0
          ? [
              ...formData.selectedBrands.filter((id) => id !== "shipitsmart"),
              ...shipItSmartServiceDetails.map((service) => service.id),
            ]
          : formData.selectedBrands;
      const phoneCountry = findCountry(formData.phoneCountry);
      const country = findCountry(formData.country);
      const phoneNumber = formData.phone.trim();
      const payload = {
        ...formData,
        phone: phoneNumber
          ? `${phoneCountry?.dial ?? ""} ${phoneNumber}`.trim()
          : "",
        phoneCountryCode: phoneCountry?.dial ?? "",
        country: formData.country,
        countryName: country?.name ?? "",
        selectedBrands,
        selectedBrandGroups: formData.selectedBrands,
        shipItSmartServices: shipItSmartServiceDetails,
      };

      const res = await fetch("/api/contact-submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error || "Failed to send message");
      }
      setFormData({
        name: "",
        email: "",
        phone: "",
        phoneCountry: "",
        country: "",
        company: "",
        message: "",
        selectedBrands: [],
        selectedShipItSmartServices: [],
      });
      alert("Message sent successfully.");
    } catch (err) {
      console.error(err);
      alert("There was an error sending your message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const fade = isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4";

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="pt-28 pb-16 md:pt-32 md:pb-20"
    >
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Intro and contact details on the left, the form card on the right.
            On phones it stacks intro → form → details so the form stays near the top. */}
        <div className="grid gap-10 lg:grid-cols-[5fr_7fr] lg:grid-rows-[auto_1fr] lg:gap-x-14 lg:gap-y-10">
          <div
            className={`lg:col-start-1 lg:row-start-1 transition-all duration-700 ${fade}`}
          >
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              <span className="text-[#1F447B]">Get in</span>{" "}
              <span className="text-[#EB993C]">Touch</span>
            </h1>
            <p className="mt-4 max-w-md text-lg font-semibold leading-relaxed text-[#324A6D]/70">
              We would like to hear from you!
            </p>
            <p className="mt-2 max-w-md text-base leading-relaxed text-[#324A6D]/70">
              Let us know how we can best serve you. Use the contact form to
              select the services of interest that best suit your logistics
              needs. It would be a pleasure to support you towards smarter
              shipping solutions.
            </p>
          </div>

          {/* Contact Form. On desktop it drops below the heading so its first
              labels line up with "We would like to hear from you!" */}
          <div
            className={`lg:col-start-2 lg:row-start-1 lg:row-span-2 lg:pt-[4.875rem] transition-all duration-700 ${fade}`}
            style={{ transitionDelay: "100ms" }}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Your details: name, company, email, country, phone */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div className="space-y-1">
                  <SimpleLabel
                    htmlFor="name"
                    className="text-sm font-semibold text-[#1F447B]"
                  >
                    Full Name <span className="text-[#E53935]">*</span>
                  </SimpleLabel>
                  <SimpleInput
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    className="h-12"
                  />
                </div>

                <div className="space-y-1">
                  <SimpleLabel
                    htmlFor="company"
                    className="text-sm font-semibold text-[#1F447B]"
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
                    className="h-12"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <SimpleLabel
                    htmlFor="email"
                    className="text-sm font-semibold text-[#1F447B]"
                  >
                    Email Address <span className="text-[#E53935]">*</span>
                  </SimpleLabel>
                  <SimpleInput
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email address"
                    className="h-12"
                  />
                </div>

                {/* Phone gets the wider share: its prefix picker takes room */}
                <div className="grid grid-cols-1 gap-5 sm:col-span-2 sm:grid-cols-[minmax(0,9fr)_minmax(0,11fr)]">
                  <div className="space-y-1">
                    <SimpleLabel
                      htmlFor="country"
                      className="text-sm font-semibold text-[#1F447B]"
                    >
                      Country
                    </SimpleLabel>
                    <div className="relative">
                      {formData.country && (
                        <span
                          aria-hidden
                          className="pointer-events-none absolute left-3 top-1/2 flex -translate-y-1/2 items-center text-lg"
                        >
                          <span
                            className={`fi fi-${formData.country.toLowerCase()} rounded-sm`}
                          />
                        </span>
                      )}
                      <select
                        id="country"
                        name="country"
                        value={formData.country}
                        onChange={handleCountryChange}
                        className={`h-12 w-full appearance-none rounded-md border-2 border-[#1F447B] bg-white pr-10 text-base text-[#324A6D] focus:border-[#EB993C] focus:outline-none ${
                          formData.country ? "pl-11" : "pl-4"
                        }`}
                      >
                        <option value="">Select your country</option>
                        {COUNTRIES.map((c) => (
                          <option key={c.code} value={c.code}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#1F447B]" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <SimpleLabel
                      htmlFor="phone"
                      className="text-sm font-semibold text-[#1F447B]"
                    >
                      Phone Number
                    </SimpleLabel>
                    <div className="flex h-12 overflow-hidden rounded-md border-2 border-[#1F447B] bg-white focus-within:border-[#EB993C]">
                      <div className="relative shrink-0 border-r-2 border-[#1F447B]">
                        {formData.phoneCountry && (
                          <span
                            aria-hidden
                            className="pointer-events-none absolute left-3 top-1/2 flex -translate-y-1/2 items-center text-lg"
                          >
                            <span
                              className={`fi fi-${formData.phoneCountry.toLowerCase()} rounded-sm`}
                            />
                          </span>
                        )}
                        <select
                          id="phoneCountry"
                          name="phoneCountry"
                          aria-label="Phone country code"
                          value={formData.phoneCountry}
                          onChange={handleInputChange}
                          className={`h-full appearance-none bg-transparent pr-8 text-base text-[#324A6D] focus:outline-none ${
                            formData.phoneCountry ? "pl-11" : "pl-4"
                          }`}
                        >
                          <option value=""></option>
                          {COUNTRIES.map((c) => (
                            <option key={c.code} value={c.code}>
                              {c.code} {c.dial}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#1F447B]" />
                      </div>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="555 123 4567"
                        className="min-w-0 flex-1 bg-white px-4 text-base text-[#324A6D] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Services of Interest */}
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-semibold text-[#1F447B]">
                    Services of Interest{" "}
                    <span className="font-normal text-[#324A6D]/70">
                      (optional)
                    </span>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Select the services you&apos;d like to learn more about
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {brands.map((brand) => (
                    <div
                      key={brand.id}
                      className="group relative bg-white rounded-xl border-2 border-[#1F447B] p-3 hover:border-[#EB993C]/30 hover:shadow-sm transition-all duration-200"
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
                            <div className="flex items-center gap-2 mb-0.5">
                              <div className="text-[#EB993C]">{brand.icon}</div>
                              <span className="font-medium text-sm group-hover:text-[#EB993C] text-[#1F447B] transition-colors">
                                {brand.name}
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground leading-snug">
                              {brand.description}
                            </p>
                          </label>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {formData.selectedBrands.includes("shipitsmart") && (
                  <div className="relative rounded-xl border-2 border-dashed border-[#EB993C] bg-white/60 p-3">
                    <div className="mb-2 border-l-4 border-[#EB993C] pl-4">
                      <p className="text-sm font-semibold text-[#1F447B]">
                        Which ShipItSmart services are they interested in?
                      </p>
                      <p className="text-xs text-[#324A6D]">
                        These options only apply to the selected ShipItSmart
                        service above.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                      {shipItSmartServices.map((service) => (
                        <div
                          key={service.id}
                          className="group relative bg-white rounded-lg border-2 border-[#1F447B] p-2 hover:border-[#EB993C] hover:shadow-sm transition-all duration-200"
                        >
                          <div className="flex items-start space-x-3">
                            <SimpleCheckbox
                              id={`shipitsmart-${service.id}`}
                              checked={formData.selectedShipItSmartServices.includes(
                                service.id
                              )}
                              onChange={(checked) =>
                                handleShipItSmartServiceSelection(
                                  service.id,
                                  checked
                                )
                              }
                            />
                            <div className="flex-1 min-w-0">
                              <label
                                htmlFor={`shipitsmart-${service.id}`}
                                className="cursor-pointer block"
                              >
                                <div className="flex items-center gap-2">
                                  <div className="text-[#EB993C]">
                                    {service.icon}
                                  </div>
                                  <span className="font-medium text-sm group-hover:text-[#EB993C] text-[#1F447B] transition-colors">
                                    {service.name}
                                  </span>
                                </div>
                              </label>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Message */}
              <div className="space-y-1">
                <SimpleLabel
                  htmlFor="message"
                  className="text-sm font-semibold text-[#1F447B]"
                >
                  Message <span className="text-[#E53935]">*</span>
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

              <div className="flex sm:justify-end">
                <SimpleButton type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
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

          {/* Contact details, split by navy rules */}
          <div
            className={`lg:col-start-1 lg:row-start-2 transition-all duration-700 ${fade}`}
            style={{ transitionDelay: "200ms" }}
          >
            <div className="border-t border-[#1F447B] pt-6">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#EB993C]">
                Call us
              </p>
              <a
                href="tel:+15512059492"
                className="mt-2 inline-flex items-center gap-2 text-xl font-semibold text-[#1F447B] transition-colors hover:text-[#EB993C]"
              >
                <Phone className="h-5 w-5 text-[#EB993C]" aria-hidden="true" />
                +1 551-205-9492
              </a>
            </div>

            <div className="mt-6 border-t border-[#1F447B] pt-6">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#EB993C]">
                Email us
              </p>
              <a
                href="mailto:sales@globalamerican.us"
                className="mt-2 inline-flex items-center gap-2 text-xl font-semibold text-[#1F447B] transition-colors hover:text-[#EB993C]"
              >
                <Mail className="h-5 w-5 text-[#EB993C]" aria-hidden="true" />
                sales@globalamerican.us
              </a>
            </div>

            <div className="mt-6 border-t border-[#1F447B] pt-6">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#EB993C]">
                Follow us
              </p>
              <SocialLinks className="mt-3" />
            </div>

            <div className="mt-6 border-t border-[#1F447B] pt-6">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#EB993C]">
                Our locations
              </p>
              <ul className="mt-4 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
                {warehouseLocations.map((location) => (
                  <li key={location.id}>
                    <Link
                      href={`/about?location=${location.id}#warehouse-locations`}
                      className="group flex items-start gap-2.5"
                    >
                      <span
                        className={`fi fi-${location.countryCode.toLowerCase()} mt-1 shrink-0 rounded-sm shadow-sm`}
                        aria-hidden="true"
                      />
                      <span>
                        <span className="block text-sm font-semibold text-[#1F447B] transition-colors group-hover:text-[#EB993C]">
                          {location.city}
                        </span>
                        {!location.city.includes(location.country) && (
                          <span className="block text-xs text-[#324A6D]">
                            {location.country}
                          </span>
                        )}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
