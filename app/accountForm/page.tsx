"use client";

import { useEffect, useRef, useState } from "react";
import HeaderNav from "@/components/header-nav";

interface Contact {
  id: string;
  name: string;
  contactType: string;
  email: string;
  phone: string;
}

const EORI_COUNTRIES = new Set([
  "United Kingdom",
  "Austria",
  "Belgium",
  "Bulgaria",
  "Croatia",
  "Cyprus",
  "Czech Republic",
  "Denmark",
  "Estonia",
  "Finland",
  "France",
  "Germany",
  "Greece",
  "Hungary",
  "Ireland",
  "Italy",
  "Latvia",
  "Lithuania",
  "Luxembourg",
  "Malta",
  "Netherlands",
  "Poland",
  "Portugal",
  "Romania",
  "Slovakia",
  "Slovenia",
  "Spain",
  "Sweden",
]);

const EU_COUNTRIES = new Set([
  "Austria",
  "Belgium",
  "Bulgaria",
  "Croatia",
  "Cyprus",
  "Czech Republic",
  "Denmark",
  "Estonia",
  "Finland",
  "France",
  "Germany",
  "Greece",
  "Hungary",
  "Ireland",
  "Italy",
  "Latvia",
  "Lithuania",
  "Luxembourg",
  "Malta",
  "Netherlands",
  "Poland",
  "Portugal",
  "Romania",
  "Slovakia",
  "Slovenia",
  "Spain",
  "Sweden",
]);

const ALL_COUNTRIES = [
  "Afghanistan",
  "Albania",
  "Algeria",
  "Andorra",
  "Angola",
  "Antigua and Barbuda",
  "Argentina",
  "Armenia",
  "Australia",
  "Austria",
  "Azerbaijan",
  "Bahamas",
  "Bahrain",
  "Bangladesh",
  "Barbados",
  "Belarus",
  "Belgium",
  "Belize",
  "Benin",
  "Bhutan",
  "Bolivia",
  "Bosnia and Herzegovina",
  "Botswana",
  "Brazil",
  "Brunei",
  "Bulgaria",
  "Burkina Faso",
  "Burundi",
  "Cabo Verde",
  "Cambodia",
  "Cameroon",
  "Canada",
  "Central African Republic",
  "Chad",
  "Chile",
  "China",
  "Colombia",
  "Comoros",
  "Congo",
  "Costa Rica",
  "Cote d'Ivoire",
  "Croatia",
  "Cuba",
  "Cyprus",
  "Czech Republic",
  "Democratic Republic of the Congo",
  "Denmark",
  "Djibouti",
  "Dominica",
  "Dominican Republic",
  "Ecuador",
  "Egypt",
  "El Salvador",
  "Equatorial Guinea",
  "Eritrea",
  "Estonia",
  "Eswatini",
  "Ethiopia",
  "Fiji",
  "Finland",
  "France",
  "Gabon",
  "Gambia",
  "Georgia",
  "Germany",
  "Ghana",
  "Greece",
  "Grenada",
  "Guatemala",
  "Guinea",
  "Guinea-Bissau",
  "Guyana",
  "Haiti",
  "Honduras",
  "Hungary",
  "Iceland",
  "India",
  "Indonesia",
  "Iran",
  "Iraq",
  "Ireland",
  "Israel",
  "Italy",
  "Jamaica",
  "Japan",
  "Jordan",
  "Kazakhstan",
  "Kenya",
  "Kiribati",
  "Kuwait",
  "Kyrgyzstan",
  "Laos",
  "Latvia",
  "Lebanon",
  "Lesotho",
  "Liberia",
  "Libya",
  "Liechtenstein",
  "Lithuania",
  "Luxembourg",
  "Madagascar",
  "Malawi",
  "Malaysia",
  "Maldives",
  "Mali",
  "Malta",
  "Marshall Islands",
  "Mauritania",
  "Mauritius",
  "Mexico",
  "Micronesia",
  "Moldova",
  "Monaco",
  "Mongolia",
  "Montenegro",
  "Morocco",
  "Mozambique",
  "Myanmar",
  "Namibia",
  "Nauru",
  "Nepal",
  "Netherlands",
  "New Zealand",
  "Nicaragua",
  "Niger",
  "Nigeria",
  "North Korea",
  "North Macedonia",
  "Norway",
  "Oman",
  "Pakistan",
  "Palau",
  "Palestine",
  "Panama",
  "Papua New Guinea",
  "Paraguay",
  "Peru",
  "Philippines",
  "Poland",
  "Portugal",
  "Qatar",
  "Romania",
  "Russia",
  "Rwanda",
  "Saint Kitts and Nevis",
  "Saint Lucia",
  "Saint Vincent and the Grenadines",
  "Samoa",
  "San Marino",
  "Sao Tome and Principe",
  "Saudi Arabia",
  "Senegal",
  "Serbia",
  "Seychelles",
  "Sierra Leone",
  "Singapore",
  "Slovakia",
  "Slovenia",
  "Solomon Islands",
  "Somalia",
  "South Africa",
  "South Korea",
  "South Sudan",
  "Spain",
  "Sri Lanka",
  "Sudan",
  "Suriname",
  "Sweden",
  "Switzerland",
  "Syria",
  "Taiwan",
  "Tajikistan",
  "Tanzania",
  "Thailand",
  "Timor-Leste",
  "Togo",
  "Tonga",
  "Trinidad and Tobago",
  "Tunisia",
  "Turkey",
  "Turkmenistan",
  "Tuvalu",
  "Uganda",
  "Ukraine",
  "United Arab Emirates",
  "United Kingdom",
  "United States",
  "Uruguay",
  "Uzbekistan",
  "Vanuatu",
  "Vatican City",
  "Venezuela",
  "Vietnam",
  "Yemen",
  "Zambia",
  "Zimbabwe",
];

const INDUSTRY_SECTORS = [
  "Apparell",
  "Automotive/Aerospace",
  "DIY",
  "Electronics",
  "Food and Drink",
  "Fulfillment",
  "Gardening and Outdoor Furniture",
  "General Retailers",
  "Health, Wellbeing & Beauty",
  "Lifestyle",
  "Pet Products",
  "Reseller & Forwarder",
  "Sport and Fitness",
  "Subscriptions",
  "Textiles",
  "Toys and Educational",
];

export default function AccountFormPage() {
  const [formData, setFormData] = useState({
    companyName: "",
    otherLegalName: "",
    industrySector: "",
    website: "",
    companyAddress: "",
    addressLine2: "",
    city: "",
    stateRegion: "",
    postalZipCode: "",
    country: "United States",
    billingAddressSameAsCompany: true,
    natureOfBusiness: "",
    billingCurrency: "USD",
    vatNumber: "",
    companyNumber: "",
    expectedMonthlySpend: "",
    expectedMonthlySpendCurrency: "USD",
    knownShipper: "",
    eori: "",
    ioss: "",
    pva: "",
    danDda: "",
    deferredPaymentSchemeNumber: "",
    customsBondedImportAccount: "",
    customsBondedTaxType: "None",
    tsaKtn: "",
    usFederalTaxClassification: "",
    usIncomeTaxReturnName: "",
    usBusinessDisregardedEntityName: "",
    termsAccepted: false,
    signature: "",
  });

  const [contacts, setContacts] = useState<Contact[]>([
    {
      id: "1",
      name: "",
      contactType: "",
      email: "",
      phone: "",
    },
  ]);

  const [isHeaderVisible, setIsHeaderVisible] = useState(false);
  const containerColor = "#dbeafe";
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.target === headerRef.current && entry.isIntersecting) {
            setIsHeaderVisible(true);
          }
        });
      },
      { threshold: 0.3 },
    );

    if (headerRef.current) {
      const rect = headerRef.current.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        setIsHeaderVisible(true);
      }
      observer.observe(headerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (formData.country !== "United States" && formData.knownShipper) {
      setFormData((prev) => ({ ...prev, knownShipper: "" }));
    }
  }, [formData.country, formData.knownShipper]);

  useEffect(() => {
    if (
      (formData.country !== "United States" ||
        formData.knownShipper !== "Yes") &&
      formData.tsaKtn
    ) {
      setFormData((prev) => ({ ...prev, tsaKtn: "" }));
    }
  }, [formData.country, formData.knownShipper, formData.tsaKtn]);

  useEffect(() => {
    if (!EORI_COUNTRIES.has(formData.country) && formData.eori) {
      setFormData((prev) => ({ ...prev, eori: "" }));
    }
  }, [formData.country, formData.eori]);

  useEffect(() => {
    if (!EORI_COUNTRIES.has(formData.country) && formData.ioss) {
      setFormData((prev) => ({ ...prev, ioss: "" }));
    }
  }, [formData.country, formData.ioss]);

  useEffect(() => {
    if (formData.country !== "United Kingdom" && formData.pva) {
      setFormData((prev) => ({ ...prev, pva: "" }));
    }
  }, [formData.country, formData.pva]);

  useEffect(() => {
    if (formData.country !== "United Kingdom" && formData.danDda) {
      setFormData((prev) => ({ ...prev, danDda: "" }));
    }
  }, [formData.country, formData.danDda]);

  useEffect(() => {
    if (
      !EU_COUNTRIES.has(formData.country) &&
      formData.deferredPaymentSchemeNumber
    ) {
      setFormData((prev) => ({ ...prev, deferredPaymentSchemeNumber: "" }));
    }
  }, [formData.country, formData.deferredPaymentSchemeNumber]);

  useEffect(() => {
    if (
      formData.country !== "United States" &&
      (formData.customsBondedImportAccount ||
        formData.customsBondedTaxType !== "None")
    ) {
      setFormData((prev) => ({
        ...prev,
        customsBondedImportAccount: "",
        customsBondedTaxType: "None",
      }));
    }
  }, [
    formData.country,
    formData.customsBondedImportAccount,
    formData.customsBondedTaxType,
  ]);

  useEffect(() => {
    if (
      formData.country === "United States" &&
      formData.customsBondedTaxType === "None" &&
      formData.customsBondedImportAccount
    ) {
      setFormData((prev) => ({ ...prev, customsBondedImportAccount: "" }));
    }
  }, [
    formData.country,
    formData.customsBondedTaxType,
    formData.customsBondedImportAccount,
  ]);

  useEffect(() => {
    if (
      formData.country !== "United States" &&
      (formData.usFederalTaxClassification ||
        formData.usIncomeTaxReturnName ||
        formData.usBusinessDisregardedEntityName)
    ) {
      setFormData((prev) => ({
        ...prev,
        usFederalTaxClassification: "",
        usIncomeTaxReturnName: "",
        usBusinessDisregardedEntityName: "",
      }));
    }
  }, [
    formData.country,
    formData.usFederalTaxClassification,
    formData.usIncomeTaxReturnName,
    formData.usBusinessDisregardedEntityName,
  ]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleTsaKtnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleaned = e.target.value.replace(/[^a-zA-Z0-9]/g, "").slice(0, 9);
    setFormData((prev) => ({ ...prev, tsaKtn: cleaned }));
  };

  const handleKnownShipperToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      knownShipper: e.target.checked ? "Yes" : "No",
    }));
  };

  const addContact = () => {
    const newContact: Contact = {
      id: Date.now().toString(),
      name: "",
      contactType: "",
      email: "",
      phone: "",
    };
    setContacts((prev) => [...prev, newContact]);
  };

  const removeContact = (id: string) => {
    if (contacts.length === 1) return;
    setContacts((prev) => prev.filter((contact) => contact.id !== id));
  };

  const updateContact = (id: string, field: keyof Contact, value: string) => {
    setContacts((prev) =>
      prev.map((contact) =>
        contact.id === id ? { ...contact, [field]: value } : contact,
      ),
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Account Form Submission:", {
      ...formData,
      contacts,
    });
  };

  return (
    <div className="flex flex-col min-h-screen text-foreground">
      <HeaderNav />
      <main className="relative flex-1">
        <section
          className="pt-24 pb-12 md:pb-16"
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div
              ref={headerRef}
              className={`text-center mb-6 transition-all duration-700 ${
                isHeaderVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
            >
              <h1 className="text-3xl md:text-4xl font-bold text-[#1F447B]">
                Setup Your <span className="text-[#EB993C]">Account</span>
              </h1>
            </div>

            <div
              className="max-w-5xl lg:max-w-6xl mx-auto transition-all duration-700 opacity-100 translate-y-0"
              style={{ transitionDelay: "200ms" }}
            >
              <div
                className="rounded-2xl shadow-lg p-6 sm:p-8 lg:p-12 xl:p-16 border-2 border-[#1F447B]"
                style={{ backgroundColor: containerColor }}
              >
                <form
                  onSubmit={handleSubmit}
                  className="space-y-8 lg:space-y-10"
                >
                  <div className="bg-white/50 rounded-xl p-6 border border-[#1F447B]/20">
                    <h4 className="text-xl font-semibold text-[#1F447B] mb-6">
                      Company Information
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label
                          htmlFor="companyName"
                          className="block text-sm font-medium text-[#324A6D] mb-2"
                        >
                          Company Name <span className="text-red-600">*</span>
                        </label>
                        <input
                          id="companyName"
                          name="companyName"
                          type="text"
                          required
                          value={formData.companyName}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-white border-2 border-[#1F447B] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EB993C] focus:bg-white transition-all text-[#324A6D]"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="otherLegalName"
                          className="block text-sm font-medium text-[#324A6D] mb-2"
                        >
                          Other Legal Name
                        </label>
                        <input
                          id="otherLegalName"
                          name="otherLegalName"
                          type="text"
                          value={formData.otherLegalName}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-white border-2 border-[#1F447B] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EB993C] focus:bg-white transition-all text-[#324A6D]"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[#324A6D] mb-2">
                          Nature of business
                        </label>
                        <input
                          name="natureOfBusiness"
                          type="text"
                          value={formData.natureOfBusiness}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-white border-2 border-[#1F447B] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EB993C] focus:bg-white transition-all text-[#324A6D]"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[#324A6D] mb-2">
                          Expected monthly spend
                        </label>
                        <div className="flex w-full">
                          <select
                            name="expectedMonthlySpendCurrency"
                            value={formData.expectedMonthlySpendCurrency}
                            onChange={handleInputChange}
                            className="h-12 w-28 sm:w-32 px-3 pr-8 bg-white border-2 border-[#1F447B] rounded-l-lg focus:outline-none focus:ring-2 focus:ring-[#EB993C] text-[#324A6D]"
                          >
                            <option value="USD">USD</option>
                            <option value="GBP">GBP</option>
                            <option value="EUR">EUR</option>
                            <option value="CAD">CAD</option>
                            <option value="AUD">AUD</option>
                            <option value="AED">AED</option>
                          </select>
                          <input
                            name="expectedMonthlySpend"
                            type="text"
                            placeholder="e.g. 1234 5678"
                            value={formData.expectedMonthlySpend}
                            onChange={handleInputChange}
                            className="h-12 flex-1 px-4 bg-white border-2 border-l-0 border-[#1F447B] rounded-r-lg focus:outline-none focus:ring-2 focus:ring-[#EB993C] focus:bg-white transition-all text-[#324A6D]"
                          />
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="industrySector"
                          className="block text-sm font-medium text-[#324A6D] mb-2"
                        >
                          Industry Sector
                        </label>
                        <select
                          id="industrySector"
                          name="industrySector"
                          value={formData.industrySector}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 pr-12 bg-white border-2 border-[#1F447B] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EB993C] focus:bg-white transition-all text-[#324A6D]"
                        >
                          <option value="">Select an industry</option>
                          {INDUSTRY_SECTORS.map((sector) => (
                            <option key={sector} value={sector}>
                              {sector}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label
                          htmlFor="website"
                          className="block text-sm font-medium text-[#324A6D] mb-2"
                        >
                          Website
                        </label>
                        <input
                          id="website"
                          name="website"
                          type="url"
                          value={formData.website}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-white border-2 border-[#1F447B] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EB993C] focus:bg-white transition-all text-[#324A6D]"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/50 rounded-xl p-6 border border-[#1F447B]/20">
                    <h4 className="text-xl font-semibold text-[#1F447B] mb-6">
                      Company Address
                    </h4>
                    <div className="space-y-6">
                      <div>
                        <label
                          htmlFor="companyAddress"
                          className="block text-sm font-medium text-[#324A6D] mb-2"
                        >
                          Company Address{" "}
                          <span className="text-red-600">*</span>
                        </label>
                        <input
                          id="companyAddress"
                          name="companyAddress"
                          type="text"
                          required
                          value={formData.companyAddress}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-white border-2 border-[#1F447B] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EB993C] focus:bg-white transition-all text-[#324A6D]"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="addressLine2"
                          className="block text-sm font-medium text-[#324A6D] mb-2"
                        >
                          Address Line 2
                        </label>
                        <input
                          id="addressLine2"
                          name="addressLine2"
                          type="text"
                          value={formData.addressLine2}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-white border-2 border-[#1F447B] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EB993C] focus:bg-white transition-all text-[#324A6D]"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-[#324A6D] mb-2">
                            Postal / Zip Code
                          </label>
                          <input
                            name="postalZipCode"
                            type="text"
                            value={formData.postalZipCode}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 bg-white border-2 border-[#1F447B] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EB993C] focus:bg-white transition-all text-[#324A6D]"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-[#324A6D] mb-2">
                            Country
                          </label>
                          <select
                            name="country"
                            value={formData.country}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 pr-12 bg-white border-2 border-[#1F447B] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EB993C] focus:bg-white transition-all text-[#324A6D]"
                          >
                            {ALL_COUNTRIES.map((country) => (
                              <option key={country} value={country}>
                                {country}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-[#324A6D] mb-2">
                            City
                          </label>
                          <input
                            name="city"
                            type="text"
                            value={formData.city}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 bg-white border-2 border-[#1F447B] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EB993C] focus:bg-white transition-all text-[#324A6D]"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-[#324A6D] mb-2">
                            State/Region/Province
                          </label>
                          <input
                            name="stateRegion"
                            type="text"
                            value={formData.stateRegion}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 bg-white border-2 border-[#1F447B] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EB993C] focus:bg-white transition-all text-[#324A6D]"
                          />
                        </div>
                      </div>

                      <label className="inline-flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          name="billingAddressSameAsCompany"
                          checked={formData.billingAddressSameAsCompany}
                          onChange={handleInputChange}
                          className="w-5 h-5 accent-[#EB993C]"
                        />
                        <span className="text-sm font-medium text-[#324A6D]">
                          Billing address is same as company address
                        </span>
                      </label>
                    </div>
                  </div>

                  <div className="bg-white/50 rounded-xl p-6 border border-[#1F447B]/20">
                    <h4 className="text-xl font-semibold text-[#1F447B] mb-6">
                      Business and Billing
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-[#324A6D] mb-2">
                          Company/Charter Number
                        </label>
                        <input
                          name="companyNumber"
                          type="text"
                          value={formData.companyNumber}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-white border-2 border-[#1F447B] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EB993C] focus:bg-white transition-all text-[#324A6D]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#324A6D] mb-2">
                          What currency would you like to be billed in
                        </label>
                        <select
                          name="billingCurrency"
                          value={formData.billingCurrency}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 pr-12 bg-white border-2 border-[#1F447B] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EB993C] focus:bg-white transition-all text-[#324A6D]"
                        >
                          <option value="USD">USD</option>
                          <option value="GBP">GBP</option>
                          <option value="EUR">EUR</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#324A6D] mb-2">
                          VAT Number / Tax ID
                        </label>
                        <input
                          name="vatNumber"
                          type="text"
                          value={formData.vatNumber}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-white border-2 border-[#1F447B] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EB993C] focus:bg-white transition-all text-[#324A6D]"
                        />
                      </div>
                      {EORI_COUNTRIES.has(formData.country) && (
                        <div>
                          <label className="block text-sm font-medium text-[#324A6D] mb-2">
                            EORI Number
                          </label>
                          <input
                            name="eori"
                            type="text"
                            value={formData.eori}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 bg-white border-2 border-[#1F447B] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EB993C] focus:bg-white transition-all text-[#324A6D]"
                          />
                        </div>
                      )}
                      {formData.country === "United States" && (
                        <div>
                          <label className="block text-sm font-medium text-[#324A6D] mb-2">
                            Federal tax classification
                          </label>
                          <select
                            name="usFederalTaxClassification"
                            value={formData.usFederalTaxClassification}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 pr-12 bg-white border-2 border-[#1F447B] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EB993C] focus:bg-white transition-all text-[#324A6D]"
                          >
                            <option value="">Select a classification</option>
                            <option value="Sole proprietor or Single-member LLC">
                              Sole proprietor or Single-member LLC
                            </option>
                            <option value="Partnership or LLC taxed as a Partnership">
                              Partnership or LLC taxed as a Partnership
                            </option>
                            <option value="Trust/Estate">Trust/Estate</option>
                            <option value="Non-profit organization">
                              Non-profit organization
                            </option>
                            <option value="C-Corporation or LLC taxed as a C-Corp">
                              C-Corporation or LLC taxed as a C-Corp
                            </option>
                            <option value="S-Corporation or LLC taxed as an S-Corp">
                              S-Corporation or LLC taxed as an S-Corp
                            </option>
                            <option value="Other/Not specified">
                              Other/Not specified
                            </option>
                          </select>
                        </div>
                      )}
                      {EORI_COUNTRIES.has(formData.country) && (
                        <div>
                          <label className="block text-sm font-medium text-[#324A6D] mb-2">
                            IOSS Number
                          </label>
                          <input
                            name="ioss"
                            type="text"
                            value={formData.ioss}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 bg-white border-2 border-[#1F447B] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EB993C] focus:bg-white transition-all text-[#324A6D]"
                          />
                        </div>
                      )}
                      {formData.country === "United Kingdom" && (
                        <div>
                          <label className="block text-sm font-medium text-[#324A6D] mb-2">
                            PVA Number
                          </label>
                          <input
                            name="pva"
                            type="text"
                            value={formData.pva}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 bg-white border-2 border-[#1F447B] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EB993C] focus:bg-white transition-all text-[#324A6D]"
                          />
                        </div>
                      )}
                      {formData.country === "United Kingdom" && (
                        <div>
                          <label className="block text-sm font-medium text-[#324A6D] mb-2">
                            DAN/DDA
                          </label>
                          <input
                            name="danDda"
                            type="text"
                            value={formData.danDda}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 bg-white border-2 border-[#1F447B] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EB993C] focus:bg-white transition-all text-[#324A6D]"
                          />
                        </div>
                      )}
                      {EU_COUNTRIES.has(formData.country) && (
                        <div>
                          <label className="block text-sm font-medium text-[#324A6D] mb-2">
                            Deferred Payment Scheme Number
                          </label>
                          <input
                            name="deferredPaymentSchemeNumber"
                            type="text"
                            value={formData.deferredPaymentSchemeNumber}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 bg-white border-2 border-[#1F447B] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EB993C] focus:bg-white transition-all text-[#324A6D]"
                          />
                        </div>
                      )}
                      {formData.country === "United States" && (
                        <div>
                          <label className="block text-sm font-medium text-[#324A6D] mb-2">
                            Name on the income tax return
                          </label>
                          <input
                            name="usIncomeTaxReturnName"
                            type="text"
                            value={formData.usIncomeTaxReturnName}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 bg-white border-2 border-[#1F447B] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EB993C] focus:bg-white transition-all text-[#324A6D]"
                          />
                          <p className="text-xs text-[#324A6D] mt-2">
                            The legal name your contact has registered with the
                            IRS
                          </p>
                        </div>
                      )}
                      {formData.country === "United States" && (
                        <div>
                          <label className="block text-sm font-medium text-[#324A6D] mb-2">
                            Business or disregarded entity name
                          </label>
                          <input
                            name="usBusinessDisregardedEntityName"
                            type="text"
                            value={formData.usBusinessDisregardedEntityName}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 bg-white border-2 border-[#1F447B] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EB993C] focus:bg-white transition-all text-[#324A6D]"
                          />
                          <p className="text-xs text-[#324A6D] mt-2">
                            Enter if the legal name is different from the
                            business or disregarded entity name
                          </p>
                        </div>
                      )}
                      {formData.country === "United States" && (
                        <div>
                          <label className="block text-sm font-medium text-[#324A6D] mb-2">
                            Customs Bonded Import Account
                          </label>
                          <div className="flex w-full">
                            <select
                              name="customsBondedTaxType"
                              value={formData.customsBondedTaxType}
                              onChange={handleInputChange}
                              className="h-12 w-28 sm:w-32 px-3 pr-8 bg-white border-2 border-[#1F447B] rounded-l-lg focus:outline-none focus:ring-2 focus:ring-[#EB993C] text-[#324A6D]"
                            >
                              <option value="None">None</option>
                              <option value="SSN">SSN</option>
                              <option value="EIN">EIN</option>
                              <option value="ITIN">ITIN</option>
                              <option value="ATIN">ATIN</option>
                            </select>
                            <input
                              name="customsBondedImportAccount"
                              type="text"
                              value={formData.customsBondedImportAccount}
                              onChange={handleInputChange}
                              placeholder="Tax number"
                              disabled={
                                formData.customsBondedTaxType === "None"
                              }
                              className="h-12 flex-1 px-4 bg-white border-2 border-l-0 border-[#1F447B] rounded-r-lg focus:outline-none focus:ring-2 focus:ring-[#EB993C] focus:bg-white transition-all text-[#324A6D] disabled:text-[#9aa5b1] disabled:cursor-not-allowed disabled:bg-[#f3f4f6]"
                            />
                          </div>
                        </div>
                      )}
                      {formData.country === "United States" && (
                        <div>
                          <label className="block text-sm font-medium text-[#324A6D] mb-2">
                            Are you a registered "Known Shipper" with TSA?
                          </label>
                          <div className="flex w-full">
                            <div className="h-12 px-4 bg-white border-2 border-[#1F447B] rounded-l-lg flex items-center">
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                  type="checkbox"
                                  className="sr-only peer"
                                  checked={formData.knownShipper === "Yes"}
                                  onChange={handleKnownShipperToggle}
                                />
                                <div className="w-11 h-6 bg-[#1F447B] peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#EB993C]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#EB993C]"></div>
                              </label>
                            </div>
                            <input
                              name="tsaKtn"
                              type="text"
                              value={formData.tsaKtn}
                              onChange={handleTsaKtnChange}
                              maxLength={9}
                              pattern="[A-Za-z0-9]{9}"
                              title="TSA Number (KTN) must be exactly 9 alphanumeric characters."
                              placeholder="TSA Number (KTN)"
                              disabled={formData.knownShipper !== "Yes"}
                              className="h-12 flex-1 px-4 bg-white border-2 border-l-0 border-[#1F447B] rounded-r-lg focus:outline-none focus:ring-2 focus:ring-[#EB993C] focus:bg-white transition-all text-[#324A6D] disabled:text-[#9aa5b1] disabled:cursor-not-allowed disabled:bg-[#f3f4f6]"
                            />
                          </div>
                          <p className="text-xs text-[#324A6D] mt-2">
                            TSA Number (KTN) must be 9-digit alpha-numeric.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-white/50 rounded-xl p-6 border border-[#1F447B]/20">
                    <h4 className="text-xl font-semibold text-[#1F447B] mb-6">
                      Contacts
                    </h4>
                    <div className="space-y-6">
                      {contacts.map((contact, index) => (
                        <div
                          key={contact.id}
                          className="rounded-lg border border-[#1F447B]/20 p-5 bg-white"
                        >
                          <div className="flex items-center justify-between mb-4">
                            <p className="text-sm font-semibold text-[#1F447B]">
                              Contact {index + 1}
                            </p>
                            <button
                              type="button"
                              onClick={() => removeContact(contact.id)}
                              className="text-sm text-[#1F447B] underline"
                            >
                              Remove
                            </button>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input
                              type="text"
                              placeholder="Name"
                              value={contact.name}
                              onChange={(e) =>
                                updateContact(
                                  contact.id,
                                  "name",
                                  e.target.value,
                                )
                              }
                              className="w-full px-4 py-3 bg-white border-2 border-[#1F447B] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EB993C] text-[#324A6D]"
                            />
                            <select
                              value={contact.contactType}
                              onChange={(e) =>
                                updateContact(
                                  contact.id,
                                  "contactType",
                                  e.target.value,
                                )
                              }
                              className="w-full px-4 py-3 pr-12 bg-white border-2 border-[#1F447B] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EB993C] text-[#324A6D]"
                            >
                              <option value="">Select a contact type</option>
                              <option value="ACCOUNTS">ACCOUNTS</option>
                              <option value="SHIPPING">SHIPPING</option>
                              <option value="SHIPPING/ACCOUNTS">
                                SHIPPING/ACCOUNTS
                              </option>
                              <option value="WAREHOUSE">WAREHOUSE</option>
                              <option value="OPERATIONS">OPERATIONS</option>
                              <option value="OTHER">OTHER</option>
                            </select>
                            <input
                              type="email"
                              placeholder="Email"
                              value={contact.email}
                              onChange={(e) =>
                                updateContact(
                                  contact.id,
                                  "email",
                                  e.target.value,
                                )
                              }
                              className="w-full px-4 py-3 bg-white border-2 border-[#1F447B] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EB993C] text-[#324A6D]"
                            />
                            <input
                              type="tel"
                              placeholder="Phone"
                              value={contact.phone}
                              onChange={(e) =>
                                updateContact(
                                  contact.id,
                                  "phone",
                                  e.target.value,
                                )
                              }
                              className="w-full px-4 py-3 bg-white border-2 border-[#1F447B] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EB993C] text-[#324A6D]"
                            />
                          </div>
                        </div>
                      ))}

                      <button
                        type="button"
                        onClick={addContact}
                        className="bg-[#EB993C] hover:bg-[#d97706] text-white font-semibold rounded-md transition-all duration-300 px-6 py-3 border-2 border-[#1F447B]"
                      >
                        Add Contact
                      </button>
                    </div>
                  </div>

                  <div className="bg-white/50 rounded-xl p-6 border border-[#1F447B]/20 space-y-6">
                    <h4 className="text-xl font-semibold text-[#1F447B]">
                      Terms and Conditions
                    </h4>
                    <p className="text-sm text-[#324A6D] leading-6">
                      I wish to open a credit account with GlobalAmerican LLC. I
                      confirm that I have read and understand your terms and
                      conditions and accept the terms and conditions.
                    </p>
                    <label className="inline-flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        name="termsAccepted"
                        checked={formData.termsAccepted}
                        onChange={handleInputChange}
                        required
                        className="w-5 h-5 accent-[#EB993C]"
                      />
                      <span className="text-sm font-medium text-[#324A6D]">
                        I accept the Terms and Conditions
                      </span>
                    </label>

                    <div>
                      <label className="block text-sm font-medium text-[#324A6D] mb-2">
                        Signature <span className="text-red-600">*</span>
                      </label>
                      <input
                        name="signature"
                        type="text"
                        placeholder="Type full legal name"
                        required
                        value={formData.signature}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-white border-2 border-[#1F447B] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EB993C] focus:bg-white transition-all text-[#324A6D]"
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="bg-[#EB993C] hover:bg-[#d97706] text-white font-semibold rounded-md shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 px-8 py-4 border-2 border-[#1F447B]"
                    >
                      Submit Account Request
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
