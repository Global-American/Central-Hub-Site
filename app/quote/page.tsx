"use client";

import { useState, useEffect, useRef } from "react";
import HeaderNav from "@/components/header-nav";

interface Package {
  id: string;
  quantity: string;
  packageType: string;
  palletType: string;
  weight: string;
  length: string;
  width: string;
  height: string;
}

interface SeaContainer {
  id: string;
  containerType: string;
  quantity: string;
  weightMt: string;
}

type ShipmentMode = "parcel" | "freight";
type FreightType = "sea" | "air";
type FreightCalculationMode = "unit_type" | "total_shipment";
type SeaFreightLoadType = "fcl" | "lcl";

export default function QuotePage() {
  const QUOTE_SOURCE = "Global American";
  const DEFAULT_BOOKINGS_API_BASE =
    process.env.NODE_ENV === "development"
      ? "http://localhost:3003"
      : "https://it-smart-admin-hub.onrender.com";
  const BOOKINGS_API_BASE =
    process.env.NEXT_PUBLIC_BOOKINGS_API_BASE || DEFAULT_BOOKINGS_API_BASE;

  const [formData, setFormData] = useState({
    contactName: "",
    contactEmail: "",
    contactPhoneCountryCode: "+1",
    contactPhoneNumber: "",
    fromPostcode: "",
    fromCountry: "US",
    fromLocationType: "",
    toPostcode: "",
    toCountry: "US",
    toLocationType: "",
    residentialAddress: false,
    requestPickup: false,
    dangerousGoods: false,
    dangerousGoodsCategory: "",
    requiresInsurance: false,
    exportCustomsClearance: false,
    importCustomsClearance: false,
    airFreightServiceType: "",
    seaFreightServiceType: "",
    cargoReadyDate: "",
    totalShipmentUnits: "",
    totalShipmentVolume: "",
    totalShipmentWeight: "",
    insuranceValue: "",
    insuranceCurrency: "USD",
    measurementUnit: "metric",
  });

  const [shipmentMode, setShipmentMode] = useState<ShipmentMode>("parcel");
  const [freightType, setFreightType] = useState<FreightType>("sea");
  const [seaFreightLoadType, setSeaFreightLoadType] =
    useState<SeaFreightLoadType>("lcl");
  const [freightCalculationMode, setFreightCalculationMode] =
    useState<FreightCalculationMode>("unit_type");
  const [packageShipmentType, setPackageShipmentType] =
    useState<string>("cartons");

  const [packages, setPackages] = useState<Package[]>([
    {
      id: "1",
      quantity: "1",
      packageType: "parcel",
      palletType: "",
      weight: "",
      length: "",
      width: "",
      height: "",
    },
  ]);
  const [seaContainers, setSeaContainers] = useState<SeaContainer[]>([
    {
      id: "1",
      containerType: "",
      quantity: "1",
      weightMt: "",
    },
  ]);

  const [isHeaderVisible, setIsHeaderVisible] = useState(false);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isBenefitsVisible, setIsBenefitsVisible] = useState(false);
  const [bgColor, setBgColor] = useState("#F4FAFC");
  const [containerColor, setContainerColor] = useState("#e6ecf7");
  const headerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const benefitsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.target === headerRef.current && entry.isIntersecting) {
            setIsHeaderVisible(true);
          }
          if (entry.target === formRef.current && entry.isIntersecting) {
            setIsFormVisible(true);
          }
          if (entry.target === benefitsRef.current && entry.isIntersecting) {
            setIsBenefitsVisible(true);
          }
        });
      },
      { threshold: 0.3 },
    );

    if (headerRef.current) observer.observe(headerRef.current);
    if (formRef.current) observer.observe(formRef.current);
    if (benefitsRef.current) observer.observe(benefitsRef.current);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const nextPackageType = "cartons";
    const nextDefaultUnit = "parcel";

    setPackageShipmentType(nextPackageType);
    setPackages((prev) =>
      prev.map((pkg) => ({
        ...pkg,
        packageType: nextDefaultUnit,
      })),
    );
  }, [shipmentMode]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handlePackageChange = (
    packageId: string,
    field: keyof Package,
    value: string,
  ) => {
    setPackages((prev) =>
      prev.map((pkg) =>
        pkg.id === packageId ? { ...pkg, [field]: value } : pkg,
      ),
    );
  };

  const addPackage = () => {
    const newPackage: Package = {
      id: Date.now().toString(),
      quantity: "1",
      packageType: packageShipmentType === "pallets" ? "pallet" : "parcel",
      palletType: "",
      weight: "",
      length: "",
      width: "",
      height: "",
    };
    setPackages((prev) => [...prev, newPackage]);
  };

  const removePackage = (packageId: string) => {
    if (packages.length > 1) {
      setPackages((prev) => prev.filter((pkg) => pkg.id !== packageId));
    }
  };

  const handleSeaContainerChange = (
    containerId: string,
    field: keyof SeaContainer,
    value: string,
  ) => {
    setSeaContainers((prev) =>
      prev.map((container) =>
        container.id === containerId
          ? { ...container, [field]: value }
          : container,
      ),
    );
  };

  const addSeaContainer = () => {
    setSeaContainers((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        containerType: "",
        quantity: "1",
        weightMt: "",
      },
    ]);
  };

  const removeSeaContainer = (containerId: string) => {
    if (seaContainers.length > 1) {
      setSeaContainers((prev) =>
        prev.filter((container) => container.id !== containerId),
      );
    }
  };

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minCargoReadyDate = tomorrow.toISOString().split("T")[0];
  const freightItemLabel =
    packageShipmentType === "pallets" ? "Pallet" : "Cargo";
  const isSeaLcl = freightType === "sea" && seaFreightLoadType === "lcl";
  const showsFreightDimensions =
    shipmentMode === "freight" &&
    (freightType === "air" || isSeaLcl);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const serviceLocation =
      shipmentMode === "freight" ? "Freight It Smart" : "Ship It Smart";

    // Create payload for quote request
    const payload = {
      shipmentMode,
      freightType: shipmentMode === "freight" ? freightType : null,
        seaFreightLoadType:
        shipmentMode === "freight" && freightType === "sea"
          ? seaFreightLoadType
          : null,
      contact: {
        name: formData.contactName,
        email: formData.contactEmail,
        phoneCountryCode: formData.contactPhoneCountryCode,
        phoneNumber: formData.contactPhoneNumber,
      },
      from: {
        country: formData.fromCountry,
        postcode: formData.fromPostcode,
        locationType:
          shipmentMode === "freight" ? formData.fromLocationType : undefined,
      },
      to: {
        country: formData.toCountry,
        postcode: formData.toPostcode,
        locationType:
          shipmentMode === "freight" ? formData.toLocationType : undefined,
      },
      options: {
        residentialAddress: formData.residentialAddress,
        requestPickup: formData.requestPickup,
        dangerousGoods: formData.dangerousGoods,
        dangerousGoodsCategory: formData.dangerousGoodsCategory,
        requiresInsurance: formData.requiresInsurance,
        exportCustomsClearance: formData.exportCustomsClearance,
        importCustomsClearance: formData.importCustomsClearance,
        airFreightServiceType:
          shipmentMode === "freight" && freightType === "air"
            ? formData.airFreightServiceType
            : "",
        seaFreightServiceType:
          shipmentMode === "freight" && freightType === "sea"
            ? formData.seaFreightServiceType
            : "",
        cargoReadyDate:
          shipmentMode === "freight"
            ? formData.cargoReadyDate
            : "",
        seaContainers:
          shipmentMode === "freight" &&
          freightType === "sea" &&
          seaFreightLoadType === "fcl"
            ? seaContainers
            : [],
        freightCalculationMode:
          shipmentMode === "freight"
            ? freightCalculationMode
            : "",
        totalShipmentUnits:
          shipmentMode === "freight" &&
          freightCalculationMode === "total_shipment"
            ? formData.totalShipmentUnits
            : "",
        totalShipmentVolume:
          shipmentMode === "freight" &&
          freightCalculationMode === "total_shipment"
            ? formData.totalShipmentVolume
            : "",
        totalShipmentWeight:
          shipmentMode === "freight" &&
          freightCalculationMode === "total_shipment"
            ? formData.totalShipmentWeight
            : "",
        insuranceValue: formData.insuranceValue,
        insuranceCurrency: formData.insuranceCurrency,
        measurementUnit: formData.measurementUnit,
      },
      packageShipmentType,
      packages,
      metadata: {
        source: QUOTE_SOURCE,
        serviceLocation,
      },
    };

    try {
      const response = await fetch(`${BOOKINGS_API_BASE}/api/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type_of_form: "quote",
          form_data: payload,
          location: "hub",
        }),
      });

      if (!response.ok) {
        throw new Error(
          `Failed to submit quote request: ${response.statusText}`,
        );
      }

      const result = await response.json();
      await fetch("/api/quote-notification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          form_data: payload,
          booking_id: result?.data?.id,
          location: QUOTE_SOURCE,
        }),
      }).catch((notifyError) => {
        console.error("Quote email notification failed:", notifyError);
      });

      console.log("Quote request submitted successfully:", result);
      alert("Quote request submitted successfully!");

      // Optionally reset form or redirect
      // window.location.href = '/quote/success';
    } catch (error) {
      console.error("Error submitting quote request:", error);
      alert("Failed to submit quote request. Please try again.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <HeaderNav />
      <main className="flex-1">
        <section
          className="py-20 md:py-28 lg:py-36"
          style={{ backgroundColor: bgColor }}
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div
              ref={headerRef}
              className={`text-center mb-12 lg:mb-20 transition-all duration-700 ${
                isHeaderVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
            >
              <h1 className="text-3xl md:text-4xl font-bold text-[#1F447B] mb-4">
                Get Your <span className="text-[#EB993C]">Shipping Quote</span>
              </h1>
              <p className="text-lg text-[#324A6D] max-w-2xl mx-auto">
                Compare shipping rates from multiple carriers and find the best
                option for your needs.
              </p>
            </div>

            {/* Quote Form */}
            <div
              className={`max-w-5xl lg:max-w-6xl mx-auto transition-all duration-700 ${
                isFormVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
              style={{ transitionDelay: "200ms" }}
            >
              <div
                ref={formRef}
                className="rounded-2xl shadow-lg p-6 sm:p-8 lg:p-12 xl:p-16 border-2 border-[#1F447B]"
                style={{
                  backgroundColor: containerColor,
                }}
              >
                <form
                  onSubmit={handleSubmit}
                  className="space-y-8 lg:space-y-10"
                >
                  <div>
                    <h3 className="text-xl font-semibold text-[#1F447B] mb-4">
                      Shipment Type
                    </h3>
                    <div className="rounded-lg border border-[#1F447B]/20 bg-white p-6">
                      <p className="text-lg font-semibold text-[#1F447B] mb-4">
                        How would you like to ship your parcels?
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <button
                          type="button"
                          onClick={() => setShipmentMode("parcel")}
                          className={`p-6 rounded-lg border-2 transition-all ${
                            shipmentMode === "parcel"
                              ? "border-[#EB993C] bg-[#EB993C]/10"
                              : "border-[#1F447B]/20 bg-white hover:border-[#1F447B]/40"
                          }`}
                        >
                          <div className="text-center">
                            <h5 className="text-lg font-semibold text-[#1F447B] mb-2">
                              Parcel
                            </h5>
                            <p className="text-sm text-[#324A6D]">
                              Small packages, cartons, and express shipments
                            </p>
                          </div>
                        </button>
                        <button
                          type="button"
                          onClick={() => setShipmentMode("freight")}
                          className={`p-6 rounded-lg border-2 transition-all ${
                            shipmentMode === "freight"
                              ? "border-[#EB993C] bg-[#EB993C]/10"
                              : "border-[#1F447B]/20 bg-white hover:border-[#1F447B]/40"
                          }`}
                        >
                          <div className="text-center">
                            <h5 className="text-lg font-semibold text-[#1F447B] mb-2">
                              Freight
                            </h5>
                            <p className="text-sm text-[#324A6D]">
                              Larger commercial shipments by air or sea
                            </p>
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-[#1F447B] mb-4">
                      Contact Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-[#324A6D] mb-2">
                          Name
                        </label>
                        <input
                          type="text"
                          name="contactName"
                          value={formData.contactName}
                          onChange={handleInputChange}
                          placeholder="Primary contact name"
                          className="w-full px-4 py-3 bg-white border-2 border-[#1F447B] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EB993C] focus:bg-white transition-all text-[#324A6D]"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#324A6D] mb-2">
                          Phone
                        </label>
                        <div className="grid grid-cols-[140px_1fr] overflow-hidden rounded-lg border-2 border-[#1F447B] bg-white focus-within:ring-2 focus-within:ring-[#EB993C]">
                          <select
                            name="contactPhoneCountryCode"
                            value={formData.contactPhoneCountryCode}
                            onChange={handleInputChange}
                            className="border-r-2 border-[#1F447B] bg-white px-4 py-3 text-[#324A6D] focus:outline-none"
                            required
                          >
                            <option value="+1">US +1</option>
                            <option value="+44">UK +44</option>
                            <option value="+61">AU +61</option>
                            <option value="+49">DE +49</option>
                            <option value="+33">FR +33</option>
                            <option value="+39">IT +39</option>
                            <option value="+34">ES +34</option>
                          </select>
                          <input
                            type="tel"
                            name="contactPhoneNumber"
                            value={formData.contactPhoneNumber}
                            onChange={handleInputChange}
                            placeholder="555 123 4567"
                            className="w-full px-4 py-3 text-[#324A6D] focus:outline-none"
                            required
                          />
                        </div>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-[#324A6D] mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          name="contactEmail"
                          value={formData.contactEmail}
                          onChange={handleInputChange}
                          placeholder="contact@example.com"
                          className="w-full md:max-w-[calc(50%-0.75rem)] px-4 py-3 bg-white border-2 border-[#1F447B] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EB993C] focus:bg-white transition-all text-[#324A6D]"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Addresses */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="text-lg font-medium text-[#1F447B]">
                        From
                      </h4>
                      <div>
                        <label className="block text-sm font-medium text-[#324A6D] mb-2">
                          Country
                        </label>
                        <select
                          name="fromCountry"
                          value={formData.fromCountry}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 pr-12 bg-white border-2 border-[#1F447B] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EB993C] focus:bg-white transition-all text-[#324A6D]"
                          required
                        >
                          <option value="GB">United Kingdom</option>
                          <option value="US">United States</option>
                          <option value="CA">Canada</option>
                          <option value="AU">Australia</option>
                          <option value="DE">Germany</option>
                          <option value="FR">France</option>
                          <option value="IT">Italy</option>
                          <option value="ES">Spain</option>
                          <option value="NL">Netherlands</option>
                          <option value="BE">Belgium</option>
                          <option value="CH">Switzerland</option>
                          <option value="AT">Austria</option>
                          <option value="IE">Ireland</option>
                          <option value="DK">Denmark</option>
                          <option value="SE">Sweden</option>
                          <option value="NO">Norway</option>
                          <option value="FI">Finland</option>
                          <option value="PL">Poland</option>
                          <option value="CZ">Czech Republic</option>
                          <option value="HU">Hungary</option>
                        </select>
                      </div>
                  <div>
                    <label className="block text-sm font-medium text-[#324A6D] mb-2">
                      Postcode
                    </label>
                        <input
                          type="text"
                          name="fromPostcode"
                          value={formData.fromPostcode}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-white border-2 border-[#1F447B] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EB993C] focus:bg-white transition-all text-[#324A6D]"
                      required
                    />
                  </div>
                  {shipmentMode === "freight" && (
                    <div>
                      <label className="block text-sm font-medium text-[#324A6D] mb-2">
                        Location Type
                      </label>
                      <select
                        name="fromLocationType"
                        value={formData.fromLocationType}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 pr-12 bg-white border-2 border-[#1F447B] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EB993C] focus:bg-white transition-all text-[#324A6D]"
                        required
                      >
                        <option value="">Select</option>
                        <option value="residential">Residential</option>
                        <option value="commercial">Commercial</option>
                        <option value="limited_access">Limited Access</option>
                      </select>
                    </div>
                  )}
                </div>
                <div className="space-y-4">
                      <h4 className="text-lg font-medium text-[#1F447B]">To</h4>
                      <div>
                        <label className="block text-sm font-medium text-[#324A6D] mb-2">
                          Country
                        </label>
                        <select
                          name="toCountry"
                          value={formData.toCountry}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 pr-12 bg-white border-2 border-[#1F447B] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EB993C] focus:bg-white transition-all text-[#324A6D]"
                          required
                        >
                          <option value="GB">United Kingdom</option>
                          <option value="US">United States</option>
                          <option value="CA">Canada</option>
                          <option value="AU">Australia</option>
                          <option value="DE">Germany</option>
                          <option value="FR">France</option>
                          <option value="IT">Italy</option>
                          <option value="ES">Spain</option>
                          <option value="NL">Netherlands</option>
                          <option value="BE">Belgium</option>
                          <option value="CH">Switzerland</option>
                          <option value="AT">Austria</option>
                          <option value="IE">Ireland</option>
                          <option value="DK">Denmark</option>
                          <option value="SE">Sweden</option>
                          <option value="NO">Norway</option>
                          <option value="FI">Finland</option>
                          <option value="PL">Poland</option>
                          <option value="CZ">Czech Republic</option>
                          <option value="HU">Hungary</option>
                        </select>
                      </div>
                  <div>
                    <label className="block text-sm font-medium text-[#324A6D] mb-2">
                      Postcode
                    </label>
                        <input
                          type="text"
                          name="toPostcode"
                          value={formData.toPostcode}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-white border-2 border-[#1F447B] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EB993C] focus:bg-white transition-all text-[#324A6D]"
                      required
                    />
                  </div>
                  {shipmentMode === "freight" && (
                    <div>
                      <label className="block text-sm font-medium text-[#324A6D] mb-2">
                        Location Type
                      </label>
                      <select
                        name="toLocationType"
                        value={formData.toLocationType}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 pr-12 bg-white border-2 border-[#1F447B] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EB993C] focus:bg-white transition-all text-[#324A6D]"
                        required
                      >
                        <option value="">Select</option>
                        <option value="residential">Residential</option>
                        <option value="commercial">Commercial</option>
                        <option value="limited_access">Limited Access</option>
                      </select>
                    </div>
                  )}
                </div>
              </div>

                  {/* Additional Options Toggles */}
                  <div>
                    <h3 className="text-xl font-semibold text-[#1F447B] mb-4">
                      Additional Options
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {shipmentMode !== "freight" && (
                    <div className="flex items-center justify-between p-4 bg-white rounded-lg border">
                      <div>
                        <label className="text-sm font-medium text-[#324A6D] cursor-pointer">
                          Residential Address
                        </label>
                        <p className="text-xs text-[#EB993C] mt-1">
                          Delivery to a residential location
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          name="residentialAddress"
                          checked={formData.residentialAddress}
                          onChange={handleInputChange}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-[#1F447B] peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#EB993C]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#EB993C]"></div>
                      </label>
                    </div>
                  )}

                  {shipmentMode !== "freight" && (
                    <div className="flex items-center justify-between p-4 bg-white rounded-lg border">
                      <div>
                        <label className="text-sm font-medium text-[#324A6D] cursor-pointer">
                          Request Pickup
                        </label>
                        <p className="text-xs text-[#EB993C] mt-1">
                          Schedule a pickup from your location
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          name="requestPickup"
                          checked={formData.requestPickup}
                          onChange={handleInputChange}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-[#1F447B] peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#EB993C]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#EB993C]"></div>
                      </label>
                    </div>
                  )}

                      <div className="flex items-center justify-between p-4 bg-white rounded-lg border">
                        <div>
                          <label className="text-sm font-medium text-[#324A6D] cursor-pointer">
                            Dangerous Goods
                          </label>
                          <p className="text-xs text-[#EB993C] mt-1">
                            Contains hazardous materials
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            name="dangerousGoods"
                            checked={formData.dangerousGoods}
                            onChange={handleInputChange}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-[#1F447B] peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#EB993C]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#EB993C]"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-white rounded-lg border">
                        <div>
                          <label className="text-sm font-medium text-[#324A6D] cursor-pointer">
                            Requires Insurance
                          </label>
                          <p className="text-xs text-[#EB993C] mt-1">
                            Add insurance coverage
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            name="requiresInsurance"
                            checked={formData.requiresInsurance}
                            onChange={handleInputChange}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-[#1F447B] peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#EB993C]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#EB993C]"></div>
                        </label>
                      </div>

                      {shipmentMode === "freight" && (
                        <>
                          <div className="flex items-center justify-between p-4 bg-white rounded-lg border">
                            <div>
                              <label className="text-sm font-medium text-[#324A6D] cursor-pointer">
                                Export Customs Clearance
                              </label>
                              <p className="text-xs text-[#EB993C] mt-1">
                                Arrange export customs documentation and
                                clearance
                              </p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                name="exportCustomsClearance"
                                checked={formData.exportCustomsClearance}
                                onChange={handleInputChange}
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-[#1F447B] peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#EB993C]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#EB993C]"></div>
                            </label>
                          </div>

                          <div className="flex items-center justify-between p-4 bg-white rounded-lg border">
                            <div>
                              <label className="text-sm font-medium text-[#324A6D] cursor-pointer">
                                Import Customs Clearance
                              </label>
                              <p className="text-xs text-[#EB993C] mt-1">
                                Arrange import customs handling at destination
                              </p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                name="importCustomsClearance"
                                checked={formData.importCustomsClearance}
                                onChange={handleInputChange}
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-[#1F447B] peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#EB993C]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#EB993C]"></div>
                            </label>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Dangerous Goods Category Dropdown */}
                  {formData.dangerousGoods && (
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-[#324A6D] mb-2">
                        Dangerous Goods Category
                      </label>
                      <select
                        name="dangerousGoodsCategory"
                        value={formData.dangerousGoodsCategory}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 pr-12 bg-white border-2 border-[#1F447B] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EB993C] focus:bg-white transition-all text-[#324A6D]"
                        required={formData.dangerousGoods}
                      >
                        <option value="">Select Category</option>
                        <option value="DGR">DGR | Dangerous Goods</option>
                        <option value="DRY_ICE">DRY_ICE | Dry Ice</option>
                        <option value="LITHIUM">
                          LITHIUM | Lithium Battery
                        </option>
                      </select>
                      <p className="text-xs text-[#EB993C] mt-2 italic">
                        Further documentation will be required prior to
                        completion of shipment.
                      </p>
                    </div>
                  )}

                  {/* Insurance Details */}
                  {formData.requiresInsurance && (
                    <div className="mt-4">
                      <h3 className="text-xl font-semibold text-[#1F447B] mb-4">
                        Insurance Details
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-[#324A6D] mb-2">
                            Insurance Value
                          </label>
                          <input
                            type="number"
                            name="insuranceValue"
                            value={formData.insuranceValue}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 bg-white border-2 border-[#1F447B] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EB993C] focus:bg-white transition-all text-[#324A6D]"
                            step="0.01"
                            required={formData.requiresInsurance}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-[#324A6D] mb-2">
                            Currency
                          </label>
                          <select
                            name="insuranceCurrency"
                            value={formData.insuranceCurrency}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 pr-12 bg-white border-2 border-[#1F447B] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EB993C] focus:bg-white transition-all text-[#324A6D]"
                            required={formData.requiresInsurance}
                          >
                            <option value="GBP">GBP - British Pound</option>
                            <option value="USD">USD - US Dollar</option>
                            <option value="EUR">EUR - Euro</option>
                            <option value="CAD">CAD - Canadian Dollar</option>
                            <option value="AUD">AUD - Australian Dollar</option>
                            <option value="CHF">CHF - Swiss Franc</option>
                            <option value="JPY">JPY - Japanese Yen</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}

              {/* Package Details */}
              <div>
                <div className="mb-4">
                  <h3 className="text-xl font-semibold text-[#1F447B]">
                    {shipmentMode === "freight"
                      ? "Freight Details"
                      : "Package Details"}
                  </h3>
                </div>

                {shipmentMode === "freight" && (
                  <div className="mb-6 bg-white rounded-lg p-6 border border-[#1F447B]/20">
                    <h4 className="text-lg font-semibold text-[#1F447B] mb-4">
                      What type of freight do you require?
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <button
                            type="button"
                            onClick={() => setFreightType("sea")}
                            className={`p-6 rounded-lg border-2 transition-all ${
                              freightType === "sea"
                                ? "border-[#EB993C] bg-[#EB993C]/10"
                                : "border-[#1F447B]/20 hover:border-[#1F447B]/40"
                            }`}
                          >
                            <div className="text-center">
                              <h5 className="text-lg font-semibold text-[#1F447B] mb-2">
                                Sea
                              </h5>
                              <p className="text-sm text-[#324A6D]">
                                Ocean freight for larger or lower-urgency
                                shipments
                              </p>
                            </div>
                          </button>
                          <button
                            type="button"
                            onClick={() => setFreightType("air")}
                            className={`p-6 rounded-lg border-2 transition-all ${
                              freightType === "air"
                                ? "border-[#EB993C] bg-[#EB993C]/10"
                                : "border-[#1F447B]/20 hover:border-[#1F447B]/40"
                            }`}
                          >
                            <div className="text-center">
                              <h5 className="text-lg font-semibold text-[#1F447B] mb-2">
                                Air
                              </h5>
                              <p className="text-sm text-[#324A6D]">
                                Faster freight movement for time-sensitive
                                shipments
                              </p>
                            </div>
                          </button>
                    </div>
                  </div>
                )}

                {shipmentMode === "freight" && freightType === "air" && (
                  <div className="mb-6 bg-white rounded-lg p-6 border border-[#1F447B]/20">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-lg font-semibold text-[#1F447B] mb-4">
                          Service Type
                        </label>
                        <select
                          name="airFreightServiceType"
                          value={formData.airFreightServiceType}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 pr-12 bg-white border-2 border-[#1F447B] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EB993C] focus:bg-white transition-all text-[#324A6D]"
                          required={shipmentMode === "freight" && freightType === "air"}
                        >
                          <option value="">Select service type</option>
                          <option value="door_to_door">Door to Door</option>
                          <option value="door_to_airport">Door to Airport</option>
                          <option value="airport_to_door">Airport to Door</option>
                          <option value="airport_to_airport">Airport to Airport</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-lg font-semibold text-[#1F447B] mb-4">
                          Cargo Ready Date
                        </label>
                        <input
                          type="date"
                          name="cargoReadyDate"
                          value={formData.cargoReadyDate}
                          onChange={handleInputChange}
                          min={minCargoReadyDate}
                          className="w-full px-4 py-3 bg-white border-2 border-[#1F447B] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EB993C] focus:bg-white transition-all text-[#324A6D]"
                          required={shipmentMode === "freight" && freightType === "air"}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {shipmentMode === "freight" && (
                  <div className="mb-6 bg-white rounded-lg p-6 border border-[#1F447B]/20">
                    <div className="flex flex-col gap-4 mb-6 md:flex-row md:items-center md:justify-between">
                      <h4 className="text-xl font-semibold text-[#1F447B]">
                        {freightType === "sea"
                          ? "What type of sea freight do you require?"
                          : "What are you shipping?"}
                      </h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {freightType === "sea" ? (
                        <>
                          <button
                            type="button"
                            onClick={() => setSeaFreightLoadType("fcl")}
                            className={`p-6 rounded-lg border-2 transition-all ${
                              seaFreightLoadType === "fcl"
                                ? "border-[#EB993C] bg-[#EB993C]/10"
                                : "border-[#1F447B]/20 hover:border-[#1F447B]/40"
                            }`}
                          >
                            <div className="text-center">
                              <h5 className="text-lg font-semibold text-[#1F447B] mb-2">
                                Full Container Load (FCL)
                              </h5>
                              <p className="text-sm text-[#324A6D]">
                                A dedicated full container for your shipment
                              </p>
                            </div>
                          </button>
                          <button
                            type="button"
                            onClick={() => setSeaFreightLoadType("lcl")}
                            className={`p-6 rounded-lg border-2 transition-all ${
                              seaFreightLoadType === "lcl"
                                ? "border-[#EB993C] bg-[#EB993C]/10"
                                : "border-[#1F447B]/20 hover:border-[#1F447B]/40"
                            }`}
                          >
                            <div className="text-center">
                              <h5 className="text-lg font-semibold text-[#1F447B] mb-2">
                                Less Container Load (LCL)
                              </h5>
                              <p className="text-sm text-[#324A6D]">
                                Shared container space for smaller shipments
                              </p>
                            </div>
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            type="button"
                            onClick={() => {
                              setPackageShipmentType("cartons");
                              setFreightCalculationMode("unit_type");
                              setPackages((prev) =>
                                prev.map((pkg) => ({
                                  ...pkg,
                                  packageType:
                                    pkg.packageType === "pallet"
                                      ? "parcel"
                                      : pkg.packageType,
                                })),
                              );
                            }}
                            className={`p-6 rounded-lg border-2 transition-all ${
                              packageShipmentType === "cartons"
                                ? "border-[#EB993C] bg-[#EB993C]/10"
                                : "border-[#1F447B]/20 hover:border-[#1F447B]/40"
                            }`}
                          >
                            <div className="text-center">
                              <h5 className="text-lg font-semibold text-[#1F447B] mb-2">
                                Loose Cargo
                              </h5>
                              <p className="text-sm text-[#324A6D]">
                                Individual cartons, boxes, or loose pieces
                              </p>
                            </div>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setPackageShipmentType("pallets");
                              setPackages((prev) =>
                                prev.map((pkg) => ({
                                  ...pkg,
                                  packageType: "pallet",
                                })),
                              );
                            }}
                            className={`p-6 rounded-lg border-2 transition-all ${
                              packageShipmentType === "pallets"
                                ? "border-[#EB993C] bg-[#EB993C]/10"
                                : "border-[#1F447B]/20 hover:border-[#1F447B]/40"
                            }`}
                          >
                            <div className="text-center">
                              <h5 className="text-lg font-semibold text-[#1F447B] mb-2">
                                Pallets / Skids
                              </h5>
                              <p className="text-sm text-[#324A6D]">
                                Palletized freight or skids
                              </p>
                            </div>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                )}

                {shipmentMode === "freight" &&
                  freightType === "sea" &&
                  seaFreightLoadType === "lcl" && (
                    <div className="mb-6 bg-white rounded-lg p-6 border border-[#1F447B]/20">
                      <div className="flex flex-col gap-4 mb-6 md:flex-row md:items-center md:justify-between">
                        <h4 className="text-xl font-semibold text-[#1F447B]">
                          What are you shipping?
                        </h4>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <button
                          type="button"
                          onClick={() => {
                            setPackageShipmentType("cartons");
                            setFreightCalculationMode("unit_type");
                            setPackages((prev) =>
                              prev.map((pkg) => ({
                                ...pkg,
                                packageType:
                                  pkg.packageType === "pallet"
                                    ? "parcel"
                                    : pkg.packageType,
                              })),
                            );
                          }}
                          className={`p-6 rounded-lg border-2 transition-all ${
                            packageShipmentType === "cartons"
                              ? "border-[#EB993C] bg-[#EB993C]/10"
                              : "border-[#1F447B]/20 hover:border-[#1F447B]/40"
                          }`}
                        >
                          <div className="text-center">
                            <h5 className="text-lg font-semibold text-[#1F447B] mb-2">
                              Loose Cargo
                            </h5>
                            <p className="text-sm text-[#324A6D]">
                              Individual cartons, boxes, or loose pieces
                            </p>
                          </div>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setPackageShipmentType("pallets");
                            setPackages((prev) =>
                              prev.map((pkg) => ({
                                ...pkg,
                                packageType: "pallet",
                              })),
                            );
                          }}
                          className={`p-6 rounded-lg border-2 transition-all ${
                            packageShipmentType === "pallets"
                              ? "border-[#EB993C] bg-[#EB993C]/10"
                              : "border-[#1F447B]/20 hover:border-[#1F447B]/40"
                          }`}
                        >
                          <div className="text-center">
                            <h5 className="text-lg font-semibold text-[#1F447B] mb-2">
                              Pallets / Skids
                            </h5>
                            <p className="text-sm text-[#324A6D]">
                              Palletized freight or skids
                            </p>
                          </div>
                        </button>
                      </div>
                    </div>
                  )}

                {shipmentMode === "freight" && freightType === "sea" && (
                  <div className="mb-6 bg-white rounded-lg p-6 border border-[#1F447B]/20">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-lg font-semibold text-[#1F447B] mb-4">
                          Service Type
                        </label>
                        <select
                          name="seaFreightServiceType"
                          value={formData.seaFreightServiceType}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 pr-12 bg-white border-2 border-[#1F447B] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EB993C] focus:bg-white transition-all text-[#324A6D]"
                          required
                        >
                          <option value="">Select service type</option>
                          <option value="door_to_door">Door to Door</option>
                          <option value="door_to_port">Door to Port</option>
                          <option value="port_to_door">Port to Door</option>
                          <option value="port_to_port">Port to Port</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-lg font-semibold text-[#1F447B] mb-4">
                          Cargo Ready Date
                        </label>
                        <input
                          type="date"
                          name="cargoReadyDate"
                          value={formData.cargoReadyDate}
                          onChange={handleInputChange}
                          min={minCargoReadyDate}
                          className="w-full px-4 py-3 bg-white border-2 border-[#1F447B] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EB993C] focus:bg-white transition-all text-[#324A6D]"
                          required
                        />
                      </div>
                    </div>
                  </div>
                )}

                {shipmentMode === "freight" &&
                  freightType === "sea" &&
                  seaFreightLoadType === "fcl" && (
                    <div className="mb-6 bg-white rounded-lg p-6 border border-[#1F447B]/20">
                      <div className="space-y-6">
                        {seaContainers.map((container, index) => (
                          <div
                            key={container.id}
                            className="rounded-xl border border-[#1F447B]/10 bg-[#F4FAFC] p-5"
                          >
                            <div className="mb-4 flex items-center justify-between">
                              <h4 className="text-lg font-semibold text-[#1F447B]">
                                Container {index + 1}
                              </h4>
                              {seaContainers.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => removeSeaContainer(container.id)}
                                  className="text-[#EB993C] hover:text-[#d4822a] px-3 py-1 text-sm border border-[#EB993C] rounded-md hover:bg-[#EB993C]/10 transition-colors"
                                >
                                  Remove
                                </button>
                              )}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                              <div>
                                <label className="block text-lg font-semibold text-[#1F447B] mb-4">
                                  Container Type
                                </label>
                                <select
                                  value={container.containerType}
                                  onChange={(e) =>
                                    handleSeaContainerChange(
                                      container.id,
                                      "containerType",
                                      e.target.value,
                                    )
                                  }
                                  className="w-full px-4 py-3 pr-12 bg-white border-2 border-[#1F447B] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EB993C] focus:bg-white transition-all text-[#324A6D]"
                                  required
                                >
                                  <option value="">Select container type</option>
                                  <option value="20_standard">20 Standard</option>
                                  <option value="40_standard">40 Standard</option>
                                  <option value="20_high_cube">20 High Cube</option>
                                  <option value="40_high_cube">40 High Cube</option>
                                </select>
                              </div>
                              <div>
                                <label className="block text-lg font-semibold text-[#1F447B] mb-4">
                                  Container Quantity
                                </label>
                                <input
                                  type="number"
                                  value={container.quantity}
                                  onChange={(e) =>
                                    handleSeaContainerChange(
                                      container.id,
                                      "quantity",
                                      e.target.value,
                                    )
                                  }
                                  className="w-full px-4 py-3 bg-white border-2 border-[#1F447B] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EB993C] focus:bg-white transition-all text-[#324A6D]"
                                  min="1"
                                  required
                                />
                              </div>
                              <div>
                                <label className="block text-lg font-semibold text-[#1F447B] mb-4">
                                  Weight (MT)
                                </label>
                                <input
                                  type="number"
                                  value={container.weightMt}
                                  onChange={(e) =>
                                    handleSeaContainerChange(
                                      container.id,
                                      "weightMt",
                                      e.target.value,
                                    )
                                  }
                                  className="w-full px-4 py-3 bg-white border-2 border-[#1F447B] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EB993C] focus:bg-white transition-all text-[#324A6D]"
                                  min="0"
                                  step="0.01"
                                  required
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={addSeaContainer}
                          className="bg-[#1F447B] hover:bg-[#1a3a6b] text-white px-6 py-3 rounded-lg transition-colors duration-200 flex items-center gap-2 border-2 border-[#EB993C]"
                        >
                          <span className="text-lg">+</span>
                          Add Another Container
                        </button>
                      </div>
                    </div>
                  )}

                {showsFreightDimensions && (
                  <div className="mb-6 bg-white rounded-lg p-6 border border-[#1F447B]/20">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                      <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-8">
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="radio"
                            name="freightCalculationMode"
                            value="unit_type"
                            checked={freightCalculationMode === "unit_type"}
                            onChange={() =>
                              setFreightCalculationMode("unit_type")
                            }
                            className="w-4 h-4 text-[#EB993C] bg-gray-100 border-gray-300 focus:ring-0 focus:ring-offset-0"
                          />
                          <span className="ml-2 text-sm text-[#324A6D]">
                            Calculate by unit type
                          </span>
                        </label>
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="radio"
                            name="freightCalculationMode"
                            value="total_shipment"
                            checked={freightCalculationMode === "total_shipment"}
                            onChange={() =>
                              setFreightCalculationMode("total_shipment")
                            }
                            className="w-4 h-4 text-[#EB993C] bg-gray-100 border-gray-300 focus:ring-0 focus:ring-offset-0"
                          />
                          <span className="ml-2 text-sm text-[#324A6D]">
                            Calculate by total shipment
                          </span>
                        </label>
                      </div>
                      <div className="flex items-center gap-6 flex-wrap lg:justify-end">
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="radio"
                            name="measurementUnit"
                            value="metric"
                            checked={formData.measurementUnit === "metric"}
                            onChange={handleInputChange}
                            className="w-4 h-4 text-[#EB993C] bg-gray-100 border-gray-300 focus:ring-0 focus:ring-offset-0"
                          />
                          <span className="ml-2 text-sm text-[#324A6D]">
                            Metric (kg/cm)
                          </span>
                        </label>
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="radio"
                            name="measurementUnit"
                            value="imperial"
                            checked={formData.measurementUnit === "imperial"}
                            onChange={handleInputChange}
                            className="w-4 h-4 text-[#EB993C] bg-gray-100 border-gray-300 focus:ring-0 focus:ring-offset-0"
                          />
                          <span className="ml-2 text-sm text-[#324A6D]">
                            Imperial (lbs/in)
                          </span>
                        </label>
                      </div>
                    </div>

                    {freightCalculationMode === "total_shipment" && (
                      <div className="mt-4 rounded-lg border border-[#1F447B]/10 bg-[#F4FAFC] p-4">
                        <p className="text-sm text-[#324A6D] mb-4">
                          Calculating by total shipment is less accurate and may
                          lead to additional charges if dimensions are
                          inaccurate or oversized.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-[#324A6D] mb-2">
                              # of units
                            </label>
                            <input
                              type="number"
                              name="totalShipmentUnits"
                              value={formData.totalShipmentUnits}
                              onChange={handleInputChange}
                              className="w-full px-4 py-3 bg-white border-2 border-[#1F447B] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EB993C] focus:bg-white transition-all text-[#324A6D]"
                              min="1"
                              required={freightCalculationMode === "total_shipment"}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-[#324A6D] mb-2">
                              Total volume ({formData.measurementUnit === "metric" ? "CBM" : "CFT"})
                            </label>
                            <input
                              type="number"
                              name="totalShipmentVolume"
                              value={formData.totalShipmentVolume}
                              onChange={handleInputChange}
                              className="w-full px-4 py-3 bg-white border-2 border-[#1F447B] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EB993C] focus:bg-white transition-all text-[#324A6D]"
                              step="0.01"
                              min="0"
                              required={freightCalculationMode === "total_shipment"}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-[#324A6D] mb-2">
                              Total weight ({formData.measurementUnit === "metric" ? "kg" : "lbs"})
                            </label>
                            <input
                              type="number"
                              name="totalShipmentWeight"
                              value={formData.totalShipmentWeight}
                              onChange={handleInputChange}
                              className="w-full px-4 py-3 bg-white border-2 border-[#1F447B] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EB993C] focus:bg-white transition-all text-[#324A6D]"
                              step="0.01"
                              min="0"
                              required={freightCalculationMode === "total_shipment"}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {shipmentMode === "parcel" && (
                  <div className="mb-6 bg-white rounded-lg p-6 border border-[#1F447B]/20">
                    <div className="flex flex-col gap-4 mb-4 md:flex-row md:items-center md:justify-between">
                      <h4 className="text-lg font-semibold text-[#1F447B]">
                        What are you shipping?
                      </h4>
                      <div className="flex items-center gap-6 flex-wrap">
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="radio"
                            name="measurementUnit"
                            value="metric"
                            checked={formData.measurementUnit === "metric"}
                            onChange={handleInputChange}
                            className="w-4 h-4 text-[#EB993C] bg-gray-100 border-gray-300 focus:ring-0 focus:ring-offset-0"
                          />
                          <span className="ml-2 text-sm text-[#324A6D]">
                            Metric (kg/cm)
                          </span>
                        </label>
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="radio"
                            name="measurementUnit"
                            value="imperial"
                            checked={formData.measurementUnit === "imperial"}
                            onChange={handleInputChange}
                            className="w-4 h-4 text-[#EB993C] bg-gray-100 border-gray-300 focus:ring-0 focus:ring-offset-0"
                          />
                          <span className="ml-2 text-sm text-[#324A6D]">
                            Imperial (lbs/in)
                          </span>
                        </label>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <button
                            type="button"
                            onClick={() => {
                              setPackageShipmentType("cartons");
                              setPackages((prev) =>
                                prev.map((pkg) => ({
                                  ...pkg,
                                  packageType:
                                    pkg.packageType === "pallet"
                                      ? "parcel"
                                      : pkg.packageType,
                                })),
                              );
                            }}
                            className={`p-6 rounded-lg border-2 transition-all ${
                              packageShipmentType === "cartons"
                                ? "border-[#EB993C] bg-[#EB993C]/10"
                                : "border-[#1F447B]/20 hover:border-[#1F447B]/40"
                            }`}
                          >
                            <div className="text-center">
                              <h5 className="text-lg font-semibold text-[#1F447B] mb-2">
                                Cartons / Packages
                              </h5>
                              <p className="text-sm text-[#324A6D]">
                                Individual parcels, boxes, or envelopes
                              </p>
                            </div>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setPackageShipmentType("pallets");
                              setPackages((prev) =>
                                prev.map((pkg) => ({
                                  ...pkg,
                                  packageType: "pallet",
                                })),
                              );
                            }}
                            className={`p-6 rounded-lg border-2 transition-all ${
                              packageShipmentType === "pallets"
                                ? "border-[#EB993C] bg-[#EB993C]/10"
                                : "border-[#1F447B]/20 hover:border-[#1F447B]/40"
                            }`}
                          >
                            <div className="text-center">
                              <h5 className="text-lg font-semibold text-[#1F447B] mb-2">
                                Pallets / Skids
                              </h5>
                              <p className="text-sm text-[#324A6D]">
                                Palletized freight or skids
                              </p>
                            </div>
                          </button>
                        </div>
                      </div>
                    )}

                    {(shipmentMode === "parcel" || showsFreightDimensions) && (
                      <div className="space-y-6">
                        {!(showsFreightDimensions &&
                          freightCalculationMode === "total_shipment") &&
                        packages.map((pkg, index) => (
                          <div
                            key={pkg.id}
                            className="bg-white rounded-xl p-6 border border-[#1F447B]/10 shadow-sm"
                          >
                            <div className="flex flex-col gap-4 mb-6 lg:flex-row lg:items-end lg:justify-between">
                              <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:gap-6">
                                <div className="min-w-fit">
                                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#324A6D]/70 mb-2">
                                    Shipment Unit
                                  </p>
                                  <h4 className="text-2xl font-semibold text-[#1F447B] leading-none">
                                    {shipmentMode === "freight"
                                      ? `${freightItemLabel} ${index + 1}`
                                      : `Package ${index + 1}`}
                                  </h4>
                                </div>
                              </div>
                              {packages.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => removePackage(pkg.id)}
                                  className="text-[#EB993C] hover:text-[#d4822a] px-3 py-1 text-sm border border-[#EB993C] rounded-md hover:bg-[#EB993C]/10 transition-colors self-start lg:self-auto"
                                >
                                  Remove
                                </button>
                              )}
                            </div>
                            <div
                              className={`grid grid-cols-1 md:grid-cols-3 ${
                                shipmentMode === "parcel"
                                  ? "lg:grid-cols-6"
                                  : packageShipmentType === "pallets"
                                    ? "lg:grid-cols-4"
                                    : "lg:grid-cols-5"
                              } gap-4`}
                            >
                              <div>
                                <label className="block text-sm font-medium text-[#324A6D] mb-2">
                                  Quantity
                                </label>
                                <input
                                  type="number"
                                  value={pkg.quantity}
                                  onChange={(e) =>
                                    handlePackageChange(
                                      pkg.id,
                                      "quantity",
                                      e.target.value,
                                    )
                                  }
                                  className="w-full px-4 py-3 bg-[#F4FAFC] border-2 border-[#1F447B] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EB993C] focus:bg-white transition-all text-[#324A6D]"
                                  placeholder="1"
                                  min="1"
                                  required
                                />
                              </div>
                              {shipmentMode === "parcel" && (
                                <div>
                                  <label className="block text-sm font-medium text-[#324A6D] mb-2">
                                    Package Type
                                  </label>
                                  <select
                                    value={pkg.packageType}
                                    onChange={(e) =>
                                      handlePackageChange(
                                        pkg.id,
                                        "packageType",
                                        e.target.value,
                                      )
                                    }
                                    className="w-full px-4 py-3 pr-12 bg-[#F4FAFC] border-2 border-[#1F447B] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EB993C] focus:bg-white transition-all text-[#324A6D]"
                                  >
                                    <option value="envelope">Envelope</option>
                                    <option value="packet">Packet</option>
                                    <option value="parcel">Parcel</option>
                                  </select>
                                </div>
                              )}
                              {shipmentMode === "freight" &&
                                packageShipmentType === "pallets" && (
                                  <div className="lg:col-span-2 xl:col-span-1">
                                    <label className="block text-sm font-medium text-[#324A6D] mb-2">
                                      Pallet Type
                                    </label>
                                    <select
                                      value={pkg.palletType}
                                      onChange={(e) =>
                                        handlePackageChange(
                                          pkg.id,
                                          "palletType",
                                          e.target.value,
                                        )
                                      }
                                      className="w-full px-4 py-3 pr-12 bg-[#F4FAFC] border-2 border-[#1F447B] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EB993C] focus:bg-white transition-all text-[#324A6D]"
                                      required
                                    >
                                      <option value="">Select pallet type</option>
                                      <option value="48_x_40_inches">
                                        48 x 40 inches
                                      </option>
                                      <option value="120_x_80_cm_eur1">
                                        120 x 80 cm (EUR1)
                                      </option>
                                      <option value="120_x_100_cm_eur2">
                                        120 x 100 cm (EUR2)
                                      </option>
                                      <option value="non_specified">
                                        Pallets (Non specified size)
                                      </option>
                                    </select>
                                  </div>
                                )}
                              <div>
                                <label className="block text-sm font-medium text-[#324A6D] mb-2">
                                  {shipmentMode === "freight"
                                    ? freightItemLabel
                                    : "Package"}{" "}
                                  Weight (
                                  {formData.measurementUnit === "metric"
                                    ? "kg"
                                    : "lbs"}
                                  )
                                </label>
                                <input
                                  type="number"
                                  value={pkg.weight}
                                  onChange={(e) =>
                                    handlePackageChange(
                                      pkg.id,
                                      "weight",
                                      e.target.value,
                                    )
                                  }
                                  className="w-full px-4 py-3 bg-[#F4FAFC] border-2 border-[#1F447B] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EB993C] focus:bg-white transition-all text-[#324A6D]"
                                  step="0.1"
                                  required
                                />
                              </div>
                              {!(shipmentMode === "freight" &&
                                packageShipmentType === "pallets") && (
                                <>
                                  <div>
                                    <label className="block text-sm font-medium text-[#324A6D] mb-2">
                                      {shipmentMode === "freight"
                                        ? freightItemLabel
                                        : "Package"}{" "}
                                      Length (
                                      {formData.measurementUnit === "metric"
                                        ? "cm"
                                        : "in"}
                                      )
                                    </label>
                                    <input
                                      type="number"
                                      value={pkg.length}
                                      onChange={(e) =>
                                        handlePackageChange(
                                          pkg.id,
                                          "length",
                                          e.target.value,
                                        )
                                      }
                                      className="w-full px-4 py-3 bg-[#F4FAFC] border-2 border-[#1F447B] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EB993C] focus:bg-white transition-all text-[#324A6D]"
                                      required
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-[#324A6D] mb-2">
                                      {shipmentMode === "freight"
                                        ? freightItemLabel
                                        : "Package"}{" "}
                                      Width (
                                      {formData.measurementUnit === "metric"
                                        ? "cm"
                                        : "in"}
                                      )
                                    </label>
                                    <input
                                      type="number"
                                      value={pkg.width}
                                      onChange={(e) =>
                                        handlePackageChange(
                                          pkg.id,
                                          "width",
                                          e.target.value,
                                        )
                                      }
                                      className="w-full px-4 py-3 bg-[#F4FAFC] border-2 border-[#1F447B] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EB993C] focus:bg-white transition-all text-[#324A6D]"
                                      required
                                    />
                                  </div>
                                </>
                              )}
                              <div>
                                <label className="block text-sm font-medium text-[#324A6D] mb-2">
                                  {shipmentMode === "freight"
                                    ? freightItemLabel
                                    : "Package"}{" "}
                                  Height (
                                  {formData.measurementUnit === "metric"
                                    ? "cm"
                                    : "in"}
                                  )
                                </label>
                                <input
                                  type="number"
                                  value={pkg.height}
                                  onChange={(e) =>
                                    handlePackageChange(
                                      pkg.id,
                                      "height",
                                      e.target.value,
                                    )
                                  }
                                  className="w-full px-4 py-3 bg-[#F4FAFC] border-2 border-[#1F447B] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EB993C] focus:bg-white transition-all text-[#324A6D]"
                                  required
                                />
                              </div>
                            </div>
                          </div>
                        ))}

                        {!(showsFreightDimensions &&
                          freightCalculationMode === "total_shipment") && (
                          <div className="mt-4">
                            <button
                              type="button"
                              onClick={addPackage}
                              className="bg-[#1F447B] hover:bg-[#1a3a6b] text-white px-6 py-3 rounded-lg transition-colors duration-200 flex items-center gap-2 border-2 border-[#EB993C]"
                            >
                              <span className="text-lg">+</span>
                              Add Another{" "}
                              {shipmentMode === "freight"
                                ? freightItemLabel
                                : "Package"}
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Submit Button */}
                  <div className="text-center">
                    <button
                      type="submit"
                      className="bg-[#EB993C] hover:bg-[#d4822a] text-white font-semibold px-12 py-4 rounded-lg text-lg transition-colors duration-200 border-2 border-[#1F447B]"
                    >
                      Get Quote
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Benefits */}
            <div
              ref={benefitsRef}
              className={`mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 transition-all duration-700 ${
                isBenefitsVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
              style={{ transitionDelay: "400ms" }}
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-[#e6ecf7] rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-[#1F447B]">
                  <span className="text-[#1F447B] text-2xl font-bold">$</span>
                </div>
                <h3 className="text-xl font-semibold text-[#1F447B] mb-2">
                  Best Rates
                </h3>
                <p className="text-[#324A6D]">
                  Compare prices from multiple carriers to find the most
                  competitive shipping rates.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-[#e6ecf7] rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-[#1F447B]">
                  <span className="text-[#1F447B] text-2xl font-bold">⚡</span>
                </div>
                <h3 className="text-xl font-semibold text-[#1F447B] mb-2">
                  Instant Quotes
                </h3>
                <p className="text-[#324A6D]">
                  Get real-time shipping quotes in seconds with our advanced
                  pricing engine.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-[#e6ecf7] rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-[#1F447B]">
                  <span className="text-[#1F447B] text-2xl font-bold">📦</span>
                </div>
                <h3 className="text-xl font-semibold text-[#1F447B] mb-2">
                  Multiple Carriers
                </h3>
                <p className="text-[#324A6D]">
                  Choose from Royal Mail, DPD, UPS, FedEx, DHL and many more
                  carriers.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
