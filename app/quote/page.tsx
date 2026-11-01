"use client";

import { useState, useEffect, useRef } from "react";
import HeaderNav from "@/components/header-nav";
import CaptchaGate, { CaptchaLocked } from "@/components/captcha-gate";
import Image from "next/image";
import {
  ArrowRight,
  Boxes,
  Container,
  Info,
  Layers,
  Package as PackageIcon,
  Plane,
  Plus,
  Ship,
  X,
  Zap,
} from "lucide-react";
import {
  ChoiceCard,
  FormSection,
  JoinedSelect,
  OptionToggle,
  SegmentedControl,
  SelectField,
  addButtonClass,
  fieldClass,
  joinedFieldClass,
  joinedInputClass,
  labelClass,
  questionClass,
  removeButtonClass,
  submitButtonClass,
  unitCardClass,
} from "@/components/form-fields";

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

const COUNTRY_OPTIONS = [
  { code: "GB", name: "United Kingdom" },
  { code: "US", name: "United States" },
  { code: "CA", name: "Canada" },
  { code: "AU", name: "Australia" },
  { code: "DE", name: "Germany" },
  { code: "FR", name: "France" },
  { code: "IT", name: "Italy" },
  { code: "ES", name: "Spain" },
  { code: "NL", name: "Netherlands" },
  { code: "BE", name: "Belgium" },
  { code: "CH", name: "Switzerland" },
  { code: "AT", name: "Austria" },
  { code: "IE", name: "Ireland" },
  { code: "DK", name: "Denmark" },
  { code: "SE", name: "Sweden" },
  { code: "NO", name: "Norway" },
  { code: "FI", name: "Finland" },
  { code: "PL", name: "Poland" },
  { code: "CZ", name: "Czech Republic" },
  { code: "HU", name: "Hungary" },
];

const PHONE_CODES = [
  { code: "+1", label: "US +1" },
  { code: "+44", label: "UK +44" },
  { code: "+61", label: "AU +61" },
  { code: "+49", label: "DE +49" },
  { code: "+33", label: "FR +33" },
  { code: "+39", label: "IT +39" },
  { code: "+34", label: "ES +34" },
];

const ADDRESS_SIDES = [
  {
    title: "From",
    country: "fromCountry",
    postcode: "fromPostcode",
    locationType: "fromLocationType",
  },
  {
    title: "To",
    country: "toCountry",
    postcode: "toPostcode",
    locationType: "toLocationType",
  },
] as const;

const MEASUREMENT_OPTIONS = [
  { value: "metric", label: "Metric (kg/cm)" },
  { value: "imperial", label: "Imperial (lbs/in)" },
];

const CALCULATION_OPTIONS = [
  { value: "unit_type", label: "Unit type" },
  { value: "total_shipment", label: "Total shipment" },
];

const benefitIconClass =
  "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border-2 border-[#1F447B] bg-white";

export default function QuotePage() {
  const QUOTE_SOURCE = "Global American";

  // The form stays locked until the visitor passes the captcha
  const [isHuman, setIsHuman] = useState(false);

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
    palletStackable: false,
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
  const headerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const benefitsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reveal = (target: Element) => {
      if (target === headerRef.current) setIsHeaderVisible(true);
      if (target === formRef.current) setIsFormVisible(true);
      if (target === benefitsRef.current) setIsBenefitsVisible(true);
    };

    // Reveal anything already on screen at load so the page doesn't sit
    // invisible until the user scrolls (the form is much taller than the
    // viewport, so a percentage threshold never triggers on its own).
    const isInViewport = (el: Element) => {
      const rect = el.getBoundingClientRect();
      return rect.top < window.innerHeight && rect.bottom > 0;
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) reveal(entry.target);
        });
      },
      { threshold: 0.05 },
    );

    [headerRef, formRef, benefitsRef].forEach((ref) => {
      const el = ref.current;
      if (!el) return;
      if (isInViewport(el)) reveal(el);
      observer.observe(el);
    });

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

  useEffect(() => {
    if (packageShipmentType !== "pallets") {
      setFormData((prev) => ({ ...prev, palletStackable: false }));
    }
  }, [packageShipmentType]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const setMeasurementUnit = (measurementUnit: string) =>
    setFormData((prev) => ({ ...prev, measurementUnit }));

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

  const selectCartons = () => {
    setPackageShipmentType("cartons");
    setPackages((prev) =>
      prev.map((pkg) => ({
        ...pkg,
        packageType:
          pkg.packageType === "pallet" ? "parcel" : pkg.packageType,
      })),
    );
  };

  const selectPallets = () => {
    setPackageShipmentType("pallets");
    setPackages((prev) =>
      prev.map((pkg) => ({
        ...pkg,
        packageType: "pallet",
      })),
    );
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
  const showsPackageList =
    (shipmentMode === "parcel" || showsFreightDimensions) &&
    !(showsFreightDimensions && freightCalculationMode === "total_shipment");
  const itemPrefix = shipmentMode === "freight" ? `${freightItemLabel} ` : "";
  const weightUnit = formData.measurementUnit === "metric" ? "kg" : "lbs";
  const lengthUnit = formData.measurementUnit === "metric" ? "cm" : "in";

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
        palletStackable: formData.palletStackable,
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
      const response = await fetch("/api/quote-submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          payload,
        }),
      });

      if (!response.ok) {
        const detail = await response
          .json()
          .then((data: { message?: string }) => data?.message)
          .catch(() => undefined);
        throw new Error(
          `Failed to submit quote request: ${detail || response.statusText}`,
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
          location: serviceLocation,
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
      const reason = error instanceof Error ? error.message : "";
      alert(
        reason
          ? `${reason}\n\nPlease try again.`
          : "Failed to submit quote request. Please try again.",
      );
    }
  };

  // Loose cargo / pallets picker, shown for air freight and for sea LCL
  const freightCargoChoices = (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <ChoiceCard
        icon={PackageIcon}
        title="Loose Cargo"
        description="Individual cartons, boxes, or loose pieces"
        selected={packageShipmentType === "cartons"}
        onSelect={() => {
          selectCartons();
          setFreightCalculationMode("unit_type");
        }}
      />
      <ChoiceCard
        icon={Layers}
        title="Pallets / Skids"
        description="Palletized freight or skids"
        selected={packageShipmentType === "pallets"}
        onSelect={selectPallets}
      />
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen text-foreground">
      <HeaderNav />
      <main className="relative flex-1">
        <section className="pt-28 pb-16 md:pt-32 md:pb-20">
          <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div
              ref={headerRef}
              className={`mb-10 max-w-2xl transition-all duration-700 md:mb-14 ${
                isHeaderVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
            >
              <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                <span className="text-[#1F447B]">Get Your</span>{" "}
                <span className="text-[#EB993C]">Shipping Quote</span>
              </h1>
              <p className="mt-4 text-lg leading-relaxed text-[#324A6D]/70">
                Tell us what you&apos;re sending and where it&apos;s going, and
                we&apos;ll find you the best rate across our carrier network.
              </p>
            </div>

            {/* Quote Form. No panel behind it: the steps sit on the page
                background, split by navy rules like the contact page. */}
            <div
              ref={formRef}
              className={`transition-all duration-700 ${
                isFormVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
              style={{ transitionDelay: "200ms" }}
            >
              {!isHuman && (
                <CaptchaGate
                  description="Complete this quick check to unlock the quote form."
                  onVerified={() => setIsHuman(true)}
                  className="mb-10 md:mb-12"
                />
              )}

              <CaptchaLocked unlocked={isHuman}>
                <form onSubmit={handleSubmit} className="space-y-10 md:space-y-12">
                  <FormSection
                    step={1}
                    title="Shipment Type"
                    description="How would you like to ship your parcels?"
                  >
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <ChoiceCard
                        icon={PackageIcon}
                        title="Parcel"
                        description="Small packages, cartons, and express shipments"
                        selected={shipmentMode === "parcel"}
                        onSelect={() => setShipmentMode("parcel")}
                      />
                      <ChoiceCard
                        icon={Container}
                        title="Freight"
                        description="Larger commercial shipments by air or sea"
                        selected={shipmentMode === "freight"}
                        onSelect={() => setShipmentMode("freight")}
                      />
                    </div>
                  </FormSection>

                  <FormSection
                    step={2}
                    title="Contact Details"
                    description="Who should we send the quote to?"
                  >
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                      <div>
                        <label htmlFor="contactName" className={labelClass}>
                          Name
                        </label>
                        <input
                          id="contactName"
                          type="text"
                          name="contactName"
                          value={formData.contactName}
                          onChange={handleInputChange}
                          placeholder="Primary contact name"
                          className={fieldClass}
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="contactPhoneNumber" className={labelClass}>
                          Phone
                        </label>
                        <div className={joinedFieldClass}>
                          <JoinedSelect
                            name="contactPhoneCountryCode"
                            aria-label="Phone country code"
                            value={formData.contactPhoneCountryCode}
                            onChange={handleInputChange}
                            required
                          >
                            {PHONE_CODES.map((phone) => (
                              <option key={phone.code} value={phone.code}>
                                {phone.label}
                              </option>
                            ))}
                          </JoinedSelect>
                          <input
                            id="contactPhoneNumber"
                            type="tel"
                            name="contactPhoneNumber"
                            value={formData.contactPhoneNumber}
                            onChange={handleInputChange}
                            placeholder="555 123 4567"
                            className={joinedInputClass}
                            required
                          />
                        </div>
                      </div>
                      <div className="sm:col-span-2">
                        <label htmlFor="contactEmail" className={labelClass}>
                          Email
                        </label>
                        <input
                          id="contactEmail"
                          type="email"
                          name="contactEmail"
                          value={formData.contactEmail}
                          onChange={handleInputChange}
                          placeholder="contact@example.com"
                          className={`${fieldClass} sm:max-w-[calc(50%-0.625rem)]`}
                          required
                        />
                      </div>
                    </div>
                  </FormSection>

                  <FormSection
                    step={3}
                    title="Addresses"
                    description="Where the shipment is collected from and delivered to."
                  >
                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-5">
                      {ADDRESS_SIDES.map((side) => (
                        <div key={side.title} className="space-y-4">
                          <h3 className="text-base font-semibold text-[#1F447B]">
                            {side.title}
                          </h3>
                          <div>
                            <label htmlFor={side.country} className={labelClass}>
                              Country
                            </label>
                            <SelectField
                              id={side.country}
                              name={side.country}
                              value={formData[side.country]}
                              onChange={handleInputChange}
                              required
                            >
                              {COUNTRY_OPTIONS.map((country) => (
                                <option key={country.code} value={country.code}>
                                  {country.name}
                                </option>
                              ))}
                            </SelectField>
                          </div>
                          <div>
                            <label htmlFor={side.postcode} className={labelClass}>
                              Postcode
                            </label>
                            <input
                              id={side.postcode}
                              type="text"
                              name={side.postcode}
                              value={formData[side.postcode]}
                              onChange={handleInputChange}
                              className={fieldClass}
                              required
                            />
                          </div>
                          {shipmentMode === "freight" && (
                            <div>
                              <label
                                htmlFor={side.locationType}
                                className={labelClass}
                              >
                                Location Type
                              </label>
                              <SelectField
                                id={side.locationType}
                                name={side.locationType}
                                value={formData[side.locationType]}
                                onChange={handleInputChange}
                                required
                              >
                                <option value="">Select</option>
                                <option value="residential">Residential</option>
                                <option value="commercial">Commercial</option>
                                <option value="limited_access">
                                  Limited Access
                                </option>
                              </SelectField>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </FormSection>

                  <FormSection
                    step={4}
                    title="Additional Options"
                    description="Extra services and handling requirements for this shipment."
                  >
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      {shipmentMode !== "freight" && (
                        <>
                          <OptionToggle
                            name="residentialAddress"
                            checked={formData.residentialAddress}
                            onChange={handleInputChange}
                            title="Residential Address"
                            description="Delivery to a residential location"
                          />
                          <OptionToggle
                            name="requestPickup"
                            checked={formData.requestPickup}
                            onChange={handleInputChange}
                            title="Request Pickup"
                            description="Schedule a pickup from your location"
                          />
                        </>
                      )}
                      <OptionToggle
                        name="palletStackable"
                        checked={formData.palletStackable}
                        onChange={handleInputChange}
                        title="Pallet Stackable"
                        description="Pallets can be safely stacked"
                        note="Carrier reserves the right to charge a non stack fee if they deem the pallet to be non stackable."
                      />
                      <OptionToggle
                        name="dangerousGoods"
                        checked={formData.dangerousGoods}
                        onChange={handleInputChange}
                        title="Dangerous Goods"
                        description="Contains hazardous materials"
                      />
                      <OptionToggle
                        name="requiresInsurance"
                        checked={formData.requiresInsurance}
                        onChange={handleInputChange}
                        title="Requires Insurance"
                        description="Add insurance coverage"
                      />
                      {shipmentMode === "freight" && (
                        <>
                          <OptionToggle
                            name="exportCustomsClearance"
                            checked={formData.exportCustomsClearance}
                            onChange={handleInputChange}
                            title="Export Customs Clearance"
                            description="Arrange export customs documentation and clearance"
                          />
                          <OptionToggle
                            name="importCustomsClearance"
                            checked={formData.importCustomsClearance}
                            onChange={handleInputChange}
                            title="Import Customs Clearance"
                            description="Arrange import customs handling at destination"
                          />
                        </>
                      )}
                    </div>

                    {/* Dangerous Goods Category Dropdown */}
                    {formData.dangerousGoods && (
                      <div>
                        <label
                          htmlFor="dangerousGoodsCategory"
                          className={labelClass}
                        >
                          Dangerous Goods Category
                        </label>
                        <SelectField
                          id="dangerousGoodsCategory"
                          name="dangerousGoodsCategory"
                          value={formData.dangerousGoodsCategory}
                          onChange={handleInputChange}
                          required={formData.dangerousGoods}
                        >
                          <option value="">Select Category</option>
                          <option value="DGR">DGR | Dangerous Goods</option>
                          <option value="DRY_ICE">DRY_ICE | Dry Ice</option>
                          <option value="LITHIUM">
                            LITHIUM | Lithium Battery
                          </option>
                        </SelectField>
                        <p className="mt-2 flex items-start gap-1.5 text-xs text-[#324A6D]/80">
                          <Info
                            className="mt-px h-3.5 w-3.5 shrink-0 text-[#EB993C]"
                            aria-hidden
                          />
                          Further documentation will be required prior to
                          completion of shipment.
                        </p>
                      </div>
                    )}

                    {/* Insurance Details */}
                    {formData.requiresInsurance && (
                      <div>
                        <h3 className={questionClass}>Insurance Details</h3>
                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                          <div>
                            <label htmlFor="insuranceValue" className={labelClass}>
                              Insurance Value
                            </label>
                            <input
                              id="insuranceValue"
                              type="number"
                              name="insuranceValue"
                              value={formData.insuranceValue}
                              onChange={handleInputChange}
                              className={fieldClass}
                              step="0.01"
                              required={formData.requiresInsurance}
                            />
                          </div>
                          <div>
                            <label
                              htmlFor="insuranceCurrency"
                              className={labelClass}
                            >
                              Currency
                            </label>
                            <SelectField
                              id="insuranceCurrency"
                              name="insuranceCurrency"
                              value={formData.insuranceCurrency}
                              onChange={handleInputChange}
                              required={formData.requiresInsurance}
                            >
                              <option value="GBP">GBP - British Pound</option>
                              <option value="USD">USD - US Dollar</option>
                              <option value="EUR">EUR - Euro</option>
                              <option value="CAD">CAD - Canadian Dollar</option>
                              <option value="AUD">AUD - Australian Dollar</option>
                              <option value="CHF">CHF - Swiss Franc</option>
                              <option value="JPY">JPY - Japanese Yen</option>
                            </SelectField>
                          </div>
                        </div>
                      </div>
                    )}
                  </FormSection>

                  <FormSection
                    step={5}
                    title={
                      shipmentMode === "freight"
                        ? "Freight Details"
                        : "Package Details"
                    }
                    description={
                      shipmentMode === "freight"
                        ? "How your freight should move and what it is."
                        : "Weights and dimensions for each package."
                    }
                  >
                    {shipmentMode === "freight" && (
                      <div>
                        <h3 className={questionClass}>
                          What type of freight do you require?
                        </h3>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          <ChoiceCard
                            icon={Ship}
                            title="Sea"
                            description="Ocean freight for larger or lower-urgency shipments"
                            selected={freightType === "sea"}
                            onSelect={() => setFreightType("sea")}
                          />
                          <ChoiceCard
                            icon={Plane}
                            title="Air"
                            description="Faster freight movement for time-sensitive shipments"
                            selected={freightType === "air"}
                            onSelect={() => setFreightType("air")}
                          />
                        </div>
                      </div>
                    )}

                    {shipmentMode === "freight" && freightType === "air" && (
                      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                        <div>
                          <label
                            htmlFor="airFreightServiceType"
                            className={labelClass}
                          >
                            Service Type
                          </label>
                          <SelectField
                            id="airFreightServiceType"
                            name="airFreightServiceType"
                            value={formData.airFreightServiceType}
                            onChange={handleInputChange}
                            required={shipmentMode === "freight" && freightType === "air"}
                          >
                            <option value="">Select service type</option>
                            <option value="door_to_door">Door to Door</option>
                            <option value="door_to_airport">Door to Airport</option>
                            <option value="airport_to_door">Airport to Door</option>
                            <option value="airport_to_airport">Airport to Airport</option>
                          </SelectField>
                        </div>
                        <div>
                          <label htmlFor="cargoReadyDate" className={labelClass}>
                            Cargo Ready Date
                          </label>
                          <input
                            id="cargoReadyDate"
                            type="date"
                            name="cargoReadyDate"
                            value={formData.cargoReadyDate}
                            onChange={handleInputChange}
                            min={minCargoReadyDate}
                            className={fieldClass}
                            required={shipmentMode === "freight" && freightType === "air"}
                          />
                        </div>
                      </div>
                    )}

                    {shipmentMode === "freight" && (
                      <div>
                        <h3 className={questionClass}>
                          {freightType === "sea"
                            ? "What type of sea freight do you require?"
                            : "What are you shipping?"}
                        </h3>
                        {freightType === "sea" ? (
                          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <ChoiceCard
                              icon={Container}
                              title="Full Container Load (FCL)"
                              description="A dedicated full container for your shipment"
                              selected={seaFreightLoadType === "fcl"}
                              onSelect={() => setSeaFreightLoadType("fcl")}
                            />
                            <ChoiceCard
                              icon={Boxes}
                              title="Less Container Load (LCL)"
                              description="Shared container space for smaller shipments"
                              selected={seaFreightLoadType === "lcl"}
                              onSelect={() => setSeaFreightLoadType("lcl")}
                            />
                          </div>
                        ) : (
                          freightCargoChoices
                        )}
                      </div>
                    )}

                    {shipmentMode === "freight" &&
                      freightType === "sea" &&
                      seaFreightLoadType === "lcl" && (
                        <div>
                          <h3 className={questionClass}>What are you shipping?</h3>
                          {freightCargoChoices}
                        </div>
                      )}

                    {shipmentMode === "freight" && freightType === "sea" && (
                      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                        <div>
                          <label
                            htmlFor="seaFreightServiceType"
                            className={labelClass}
                          >
                            Service Type
                          </label>
                          <SelectField
                            id="seaFreightServiceType"
                            name="seaFreightServiceType"
                            value={formData.seaFreightServiceType}
                            onChange={handleInputChange}
                            required
                          >
                            <option value="">Select service type</option>
                            <option value="door_to_door">Door to Door</option>
                            <option value="door_to_port">Door to Port</option>
                            <option value="port_to_door">Port to Door</option>
                            <option value="port_to_port">Port to Port</option>
                          </SelectField>
                        </div>
                        <div>
                          <label htmlFor="cargoReadyDate" className={labelClass}>
                            Cargo Ready Date
                          </label>
                          <input
                            id="cargoReadyDate"
                            type="date"
                            name="cargoReadyDate"
                            value={formData.cargoReadyDate}
                            onChange={handleInputChange}
                            min={minCargoReadyDate}
                            className={fieldClass}
                            required
                          />
                        </div>
                      </div>
                    )}

                    {shipmentMode === "freight" &&
                      freightType === "sea" &&
                      seaFreightLoadType === "fcl" && (
                        <div className="space-y-4">
                          {seaContainers.map((container, index) => (
                            <div key={container.id} className={unitCardClass}>
                              <div className="mb-4 flex items-center justify-between gap-4">
                                <h4 className="text-base font-semibold text-[#1F447B]">
                                  Container {index + 1}
                                </h4>
                                {seaContainers.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => removeSeaContainer(container.id)}
                                    className={removeButtonClass}
                                  >
                                    <X className="h-4 w-4" aria-hidden />
                                    Remove
                                  </button>
                                )}
                              </div>
                              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                                <div>
                                  <label
                                    htmlFor={`container-${container.id}-type`}
                                    className={labelClass}
                                  >
                                    Container Type
                                  </label>
                                  <SelectField
                                    id={`container-${container.id}-type`}
                                    value={container.containerType}
                                    onChange={(e) =>
                                      handleSeaContainerChange(
                                        container.id,
                                        "containerType",
                                        e.target.value,
                                      )
                                    }
                                    required
                                  >
                                    <option value="">Select container type</option>
                                    <option value="20_standard">20 Standard</option>
                                    <option value="40_standard">40 Standard</option>
                                    <option value="20_high_cube">20 High Cube</option>
                                    <option value="40_high_cube">40 High Cube</option>
                                  </SelectField>
                                </div>
                                <div>
                                  <label
                                    htmlFor={`container-${container.id}-quantity`}
                                    className={labelClass}
                                  >
                                    Container Quantity
                                  </label>
                                  <input
                                    id={`container-${container.id}-quantity`}
                                    type="number"
                                    value={container.quantity}
                                    onChange={(e) =>
                                      handleSeaContainerChange(
                                        container.id,
                                        "quantity",
                                        e.target.value,
                                      )
                                    }
                                    className={fieldClass}
                                    min="1"
                                    required
                                  />
                                </div>
                                <div>
                                  <label
                                    htmlFor={`container-${container.id}-weight`}
                                    className={labelClass}
                                  >
                                    Weight (MT)
                                  </label>
                                  <input
                                    id={`container-${container.id}-weight`}
                                    type="number"
                                    value={container.weightMt}
                                    onChange={(e) =>
                                      handleSeaContainerChange(
                                        container.id,
                                        "weightMt",
                                        e.target.value,
                                      )
                                    }
                                    className={fieldClass}
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
                            className={addButtonClass}
                          >
                            <Plus className="h-4 w-4" aria-hidden />
                            Add Another Container
                          </button>
                        </div>
                      )}

                    {showsFreightDimensions && (
                      <div>
                        <div className="flex flex-wrap items-end gap-x-8 gap-y-4">
                          <SegmentedControl
                            label="Calculate by"
                            name="freightCalculationMode"
                            value={freightCalculationMode}
                            options={CALCULATION_OPTIONS}
                            onChange={(value) =>
                              setFreightCalculationMode(
                                value as FreightCalculationMode,
                              )
                            }
                          />
                          <SegmentedControl
                            label="Units"
                            name="measurementUnit"
                            value={formData.measurementUnit}
                            options={MEASUREMENT_OPTIONS}
                            onChange={setMeasurementUnit}
                          />
                        </div>

                        {freightCalculationMode === "total_shipment" && (
                          <div className="mt-6 space-y-4">
                            <p className="border-l-4 border-[#EB993C] pl-4 text-sm leading-relaxed text-[#324A6D]">
                              Calculating by total shipment is less accurate and
                              may lead to additional charges if dimensions are
                              inaccurate or oversized.
                            </p>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                              <div>
                                <label
                                  htmlFor="totalShipmentUnits"
                                  className={labelClass}
                                >
                                  # of units
                                </label>
                                <input
                                  id="totalShipmentUnits"
                                  type="number"
                                  name="totalShipmentUnits"
                                  value={formData.totalShipmentUnits}
                                  onChange={handleInputChange}
                                  className={fieldClass}
                                  min="1"
                                  required={freightCalculationMode === "total_shipment"}
                                />
                              </div>
                              <div>
                                <label
                                  htmlFor="totalShipmentVolume"
                                  className={labelClass}
                                >
                                  Total volume ({formData.measurementUnit === "metric" ? "CBM" : "CFT"})
                                </label>
                                <input
                                  id="totalShipmentVolume"
                                  type="number"
                                  name="totalShipmentVolume"
                                  value={formData.totalShipmentVolume}
                                  onChange={handleInputChange}
                                  className={fieldClass}
                                  step="0.01"
                                  min="0"
                                  required={freightCalculationMode === "total_shipment"}
                                />
                              </div>
                              <div>
                                <label
                                  htmlFor="totalShipmentWeight"
                                  className={labelClass}
                                >
                                  Total weight ({weightUnit})
                                </label>
                                <input
                                  id="totalShipmentWeight"
                                  type="number"
                                  name="totalShipmentWeight"
                                  value={formData.totalShipmentWeight}
                                  onChange={handleInputChange}
                                  className={fieldClass}
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
                      <div className="space-y-6">
                        <div>
                          <h3 className={questionClass}>What are you shipping?</h3>
                          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <ChoiceCard
                              icon={PackageIcon}
                              title="Cartons / Packages"
                              description="Individual parcels, boxes, or envelopes"
                              selected={packageShipmentType === "cartons"}
                              onSelect={selectCartons}
                            />
                            <ChoiceCard
                              icon={Layers}
                              title="Pallets / Skids"
                              description="Palletized freight or skids"
                              selected={packageShipmentType === "pallets"}
                              onSelect={selectPallets}
                            />
                          </div>
                        </div>
                        <SegmentedControl
                          label="Units"
                          name="measurementUnit"
                          value={formData.measurementUnit}
                          options={MEASUREMENT_OPTIONS}
                          onChange={setMeasurementUnit}
                        />
                      </div>
                    )}

                    {showsPackageList && (
                      <div className="space-y-4">
                        {packages.map((pkg, index) => (
                          <div key={pkg.id} className={unitCardClass}>
                            <div className="mb-4 flex items-center justify-between gap-4">
                              <h4 className="text-base font-semibold text-[#1F447B]">
                                {shipmentMode === "freight"
                                  ? `${freightItemLabel} ${index + 1}`
                                  : `Package ${index + 1}`}
                              </h4>
                              {packages.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => removePackage(pkg.id)}
                                  className={removeButtonClass}
                                >
                                  <X className="h-4 w-4" aria-hidden />
                                  Remove
                                </button>
                              )}
                            </div>
                            <div
                              className={`grid grid-cols-2 items-end gap-4 md:grid-cols-3 ${
                                shipmentMode === "parcel"
                                  ? "xl:grid-cols-6"
                                  : packageShipmentType === "pallets"
                                    ? "xl:grid-cols-4"
                                    : "xl:grid-cols-5"
                              }`}
                            >
                              <div>
                                <label
                                  htmlFor={`package-${pkg.id}-quantity`}
                                  className={labelClass}
                                >
                                  Quantity
                                </label>
                                <input
                                  id={`package-${pkg.id}-quantity`}
                                  type="number"
                                  value={pkg.quantity}
                                  onChange={(e) =>
                                    handlePackageChange(
                                      pkg.id,
                                      "quantity",
                                      e.target.value,
                                    )
                                  }
                                  className={fieldClass}
                                  placeholder="1"
                                  min="1"
                                  required
                                />
                              </div>
                              {shipmentMode === "parcel" && (
                                <div>
                                  <label
                                    htmlFor={`package-${pkg.id}-type`}
                                    className={labelClass}
                                  >
                                    Type
                                  </label>
                                  <SelectField
                                    id={`package-${pkg.id}-type`}
                                    value={pkg.packageType}
                                    onChange={(e) =>
                                      handlePackageChange(
                                        pkg.id,
                                        "packageType",
                                        e.target.value,
                                      )
                                    }
                                  >
                                    <option value="envelope">Envelope</option>
                                    <option value="packet">Packet</option>
                                    <option value="parcel">Parcel</option>
                                  </SelectField>
                                </div>
                              )}
                              {shipmentMode === "freight" &&
                                packageShipmentType === "pallets" && (
                                  <div className="col-span-2 md:col-span-1">
                                    <label
                                      htmlFor={`package-${pkg.id}-pallet`}
                                      className={labelClass}
                                    >
                                      Pallet Type
                                    </label>
                                    <SelectField
                                      id={`package-${pkg.id}-pallet`}
                                      value={pkg.palletType}
                                      onChange={(e) =>
                                        handlePackageChange(
                                          pkg.id,
                                          "palletType",
                                          e.target.value,
                                        )
                                      }
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
                                    </SelectField>
                                  </div>
                                )}
                              <div>
                                <label
                                  htmlFor={`package-${pkg.id}-weight`}
                                  className={labelClass}
                                >
                                  {itemPrefix}Weight ({weightUnit})
                                </label>
                                <input
                                  id={`package-${pkg.id}-weight`}
                                  type="number"
                                  value={pkg.weight}
                                  onChange={(e) =>
                                    handlePackageChange(
                                      pkg.id,
                                      "weight",
                                      e.target.value,
                                    )
                                  }
                                  className={fieldClass}
                                  step="0.1"
                                  required
                                />
                              </div>
                              {!(shipmentMode === "freight" &&
                                packageShipmentType === "pallets") && (
                                <>
                                  <div>
                                    <label
                                      htmlFor={`package-${pkg.id}-length`}
                                      className={labelClass}
                                    >
                                      {itemPrefix}Length ({lengthUnit})
                                    </label>
                                    <input
                                      id={`package-${pkg.id}-length`}
                                      type="number"
                                      value={pkg.length}
                                      onChange={(e) =>
                                        handlePackageChange(
                                          pkg.id,
                                          "length",
                                          e.target.value,
                                        )
                                      }
                                      className={fieldClass}
                                      required
                                    />
                                  </div>
                                  <div>
                                    <label
                                      htmlFor={`package-${pkg.id}-width`}
                                      className={labelClass}
                                    >
                                      {itemPrefix}Width ({lengthUnit})
                                    </label>
                                    <input
                                      id={`package-${pkg.id}-width`}
                                      type="number"
                                      value={pkg.width}
                                      onChange={(e) =>
                                        handlePackageChange(
                                          pkg.id,
                                          "width",
                                          e.target.value,
                                        )
                                      }
                                      className={fieldClass}
                                      required
                                    />
                                  </div>
                                </>
                              )}
                              <div>
                                <label
                                  htmlFor={`package-${pkg.id}-height`}
                                  className={labelClass}
                                >
                                  {itemPrefix}Height ({lengthUnit})
                                </label>
                                <input
                                  id={`package-${pkg.id}-height`}
                                  type="number"
                                  value={pkg.height}
                                  onChange={(e) =>
                                    handlePackageChange(
                                      pkg.id,
                                      "height",
                                      e.target.value,
                                    )
                                  }
                                  className={fieldClass}
                                  required
                                />
                              </div>
                            </div>
                          </div>
                        ))}

                        <button
                          type="button"
                          onClick={addPackage}
                          className={addButtonClass}
                        >
                          <Plus className="h-4 w-4" aria-hidden />
                          Add Another{" "}
                          {shipmentMode === "freight"
                            ? freightItemLabel
                            : "Package"}
                        </button>
                      </div>
                    )}
                  </FormSection>

                  {/* Submit Button */}
                  <div className="flex border-t border-[#1F447B] pt-8 sm:justify-end">
                    <button type="submit" className={submitButtonClass}>
                      Get Quote
                      <ArrowRight className="h-5 w-5" aria-hidden />
                    </button>
                  </div>
                </form>
              </CaptchaLocked>
            </div>

            {/* Benefits */}
            <div
              ref={benefitsRef}
              className={`mt-16 grid grid-cols-1 gap-8 md:mt-20 md:grid-cols-3 transition-all duration-700 ${
                isBenefitsVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
              style={{ transitionDelay: "400ms" }}
            >
              <div className="flex gap-4">
                <span className={benefitIconClass}>
                  <Zap
                    className="h-6 w-6 text-[#EB993C]"
                    fill="currentColor"
                    strokeWidth={1.5}
                    aria-hidden
                  />
                </span>
                <div>
                  <h3 className="text-lg font-semibold text-[#1F447B]">
                    Instant Quotes
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-[#324A6D]/80">
                    View real-time pricing in seconds with our advanced quoting
                    engine.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <span className={benefitIconClass}>
                  <span className="text-2xl font-bold leading-none text-[#EB993C]">
                    $
                  </span>
                </span>
                <div>
                  <h3 className="text-lg font-semibold text-[#1F447B]">
                    Best Rates
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-[#324A6D]/80">
                    Compare prices from multiple carriers to find the most
                    competitive shipping rates.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <span className={benefitIconClass}>
                  <Image
                    src="/images/parcel1.png"
                    alt=""
                    width={32}
                    height={32}
                    className="h-8 w-8 object-contain"
                  />
                </span>
                <div>
                  <h3 className="text-lg font-semibold text-[#1F447B]">
                    Multiple Carriers
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-[#324A6D]/80">
                    Choose from UPS, FedEx, DHL and many more carriers.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
