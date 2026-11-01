"use client";

import { useEffect, useRef, useState } from "react";
import HeaderNav from "@/components/header-nav";
import CaptchaGate, { CaptchaLocked } from "@/components/captcha-gate";
import { ArrowRight, Plus, X } from "lucide-react";
import {
  FormSection,
  JoinedSelect,
  Required,
  SelectField,
  addButtonClass,
  checkboxClass,
  fieldClass,
  hintClass,
  joinedFieldClass,
  joinedInputClass,
  labelClass,
  removeButtonClass,
  submitButtonClass,
  switchTrackClass,
  unitCardClass,
} from "@/components/form-fields";

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
  // The form stays locked until the visitor passes the captcha
  const [isHuman, setIsHuman] = useState(false);
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

  const isUS = formData.country === "United States";
  const isUK = formData.country === "United Kingdom";
  const needsEori = EORI_COUNTRIES.has(formData.country);

  return (
    <div className="flex flex-col min-h-screen text-foreground">
      <HeaderNav />
      <main className="relative flex-1">
        <section className="pt-28 pb-16 md:pt-32 md:pb-20">
          <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div
              ref={headerRef}
              className={`mb-10 max-w-2xl transition-all duration-700 md:mb-14 ${
                isHeaderVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
            >
              <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                <span className="text-[#1F447B]">Setup Your</span>{" "}
                <span className="text-[#EB993C]">Account</span>
              </h1>
              <p className="mt-4 text-lg leading-relaxed text-[#324A6D]/70">
                Tell us about your business and we&apos;ll get your Global
                American credit account set up.
              </p>
            </div>

            {!isHuman && (
              <CaptchaGate
                description="Complete this quick check to unlock the account form."
                onVerified={() => setIsHuman(true)}
                className="mb-10 md:mb-12"
              />
            )}

            {/* No panel behind the form: the steps sit on the page
                background, split by navy rules like the contact page. */}
            <CaptchaLocked unlocked={isHuman}>
              <form onSubmit={handleSubmit} className="space-y-10 md:space-y-12">
                <FormSection
                  step={1}
                  title="Company Information"
                  description="The basics about your business."
                >
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div>
                      <label htmlFor="companyName" className={labelClass}>
                        Company Name <Required />
                      </label>
                      <input
                        id="companyName"
                        name="companyName"
                        type="text"
                        required
                        value={formData.companyName}
                        onChange={handleInputChange}
                        className={fieldClass}
                      />
                    </div>

                    <div>
                      <label htmlFor="otherLegalName" className={labelClass}>
                        Other Legal Name
                      </label>
                      <input
                        id="otherLegalName"
                        name="otherLegalName"
                        type="text"
                        value={formData.otherLegalName}
                        onChange={handleInputChange}
                        className={fieldClass}
                      />
                    </div>

                    <div>
                      <label htmlFor="natureOfBusiness" className={labelClass}>
                        Nature of business
                      </label>
                      <input
                        id="natureOfBusiness"
                        name="natureOfBusiness"
                        type="text"
                        value={formData.natureOfBusiness}
                        onChange={handleInputChange}
                        className={fieldClass}
                      />
                    </div>

                    <div>
                      <label htmlFor="expectedMonthlySpend" className={labelClass}>
                        Expected monthly spend
                      </label>
                      <div className={joinedFieldClass}>
                        <JoinedSelect
                          name="expectedMonthlySpendCurrency"
                          aria-label="Expected monthly spend currency"
                          value={formData.expectedMonthlySpendCurrency}
                          onChange={handleInputChange}
                        >
                          <option value="USD">USD</option>
                          <option value="GBP">GBP</option>
                          <option value="EUR">EUR</option>
                          <option value="CAD">CAD</option>
                          <option value="AUD">AUD</option>
                          <option value="AED">AED</option>
                        </JoinedSelect>
                        <input
                          id="expectedMonthlySpend"
                          name="expectedMonthlySpend"
                          type="text"
                          placeholder="e.g. 1234 5678"
                          value={formData.expectedMonthlySpend}
                          onChange={handleInputChange}
                          className={joinedInputClass}
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="industrySector" className={labelClass}>
                        Industry Sector
                      </label>
                      <SelectField
                        id="industrySector"
                        name="industrySector"
                        value={formData.industrySector}
                        onChange={handleInputChange}
                      >
                        <option value="">Select an industry</option>
                        {INDUSTRY_SECTORS.map((sector) => (
                          <option key={sector} value={sector}>
                            {sector}
                          </option>
                        ))}
                      </SelectField>
                    </div>

                    <div>
                      <label htmlFor="website" className={labelClass}>
                        Website
                      </label>
                      <input
                        id="website"
                        name="website"
                        type="url"
                        value={formData.website}
                        onChange={handleInputChange}
                        className={fieldClass}
                      />
                    </div>
                  </div>
                </FormSection>

                <FormSection
                  step={2}
                  title="Company Address"
                  description="Where your business is registered."
                >
                  <div className="space-y-5">
                    <div>
                      <label htmlFor="companyAddress" className={labelClass}>
                        Company Address <Required />
                      </label>
                      <input
                        id="companyAddress"
                        name="companyAddress"
                        type="text"
                        required
                        value={formData.companyAddress}
                        onChange={handleInputChange}
                        className={fieldClass}
                      />
                    </div>

                    <div>
                      <label htmlFor="addressLine2" className={labelClass}>
                        Address Line 2
                      </label>
                      <input
                        id="addressLine2"
                        name="addressLine2"
                        type="text"
                        value={formData.addressLine2}
                        onChange={handleInputChange}
                        className={fieldClass}
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                      <div>
                        <label htmlFor="postalZipCode" className={labelClass}>
                          Postal / Zip Code
                        </label>
                        <input
                          id="postalZipCode"
                          name="postalZipCode"
                          type="text"
                          value={formData.postalZipCode}
                          onChange={handleInputChange}
                          className={fieldClass}
                        />
                      </div>
                      <div>
                        <label htmlFor="country" className={labelClass}>
                          Country
                        </label>
                        <SelectField
                          id="country"
                          name="country"
                          value={formData.country}
                          onChange={handleInputChange}
                        >
                          {ALL_COUNTRIES.map((country) => (
                            <option key={country} value={country}>
                              {country}
                            </option>
                          ))}
                        </SelectField>
                      </div>
                      <div>
                        <label htmlFor="city" className={labelClass}>
                          City
                        </label>
                        <input
                          id="city"
                          name="city"
                          type="text"
                          value={formData.city}
                          onChange={handleInputChange}
                          className={fieldClass}
                        />
                      </div>
                      <div>
                        <label htmlFor="stateRegion" className={labelClass}>
                          State/Region/Province
                        </label>
                        <input
                          id="stateRegion"
                          name="stateRegion"
                          type="text"
                          value={formData.stateRegion}
                          onChange={handleInputChange}
                          className={fieldClass}
                        />
                      </div>
                    </div>
                  </div>

                  <label className="flex cursor-pointer items-center gap-3">
                    <input
                      type="checkbox"
                      name="billingAddressSameAsCompany"
                      checked={formData.billingAddressSameAsCompany}
                      onChange={handleInputChange}
                      className={checkboxClass}
                    />
                    <span className="text-sm font-medium text-[#324A6D]">
                      Billing address is same as company address
                    </span>
                  </label>
                </FormSection>

                <FormSection
                  step={3}
                  title="Business and Billing"
                  description="Billing, tax and customs details. The fields shown depend on your country."
                >
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div>
                      <label htmlFor="companyNumber" className={labelClass}>
                        Company/Charter Number
                      </label>
                      <input
                        id="companyNumber"
                        name="companyNumber"
                        type="text"
                        value={formData.companyNumber}
                        onChange={handleInputChange}
                        className={fieldClass}
                      />
                    </div>
                    <div>
                      <label htmlFor="billingCurrency" className={labelClass}>
                        What currency would you like to be billed in
                      </label>
                      <SelectField
                        id="billingCurrency"
                        name="billingCurrency"
                        value={formData.billingCurrency}
                        onChange={handleInputChange}
                      >
                        <option value="USD">USD</option>
                        <option value="GBP">GBP</option>
                        <option value="EUR">EUR</option>
                      </SelectField>
                    </div>
                    <div>
                      <label htmlFor="vatNumber" className={labelClass}>
                        VAT Number / Tax ID
                      </label>
                      <input
                        id="vatNumber"
                        name="vatNumber"
                        type="text"
                        value={formData.vatNumber}
                        onChange={handleInputChange}
                        className={fieldClass}
                      />
                    </div>
                    {needsEori && (
                      <div>
                        <label htmlFor="eori" className={labelClass}>
                          EORI Number
                        </label>
                        <input
                          id="eori"
                          name="eori"
                          type="text"
                          value={formData.eori}
                          onChange={handleInputChange}
                          className={fieldClass}
                        />
                      </div>
                    )}
                    {isUS && (
                      <div>
                        <label
                          htmlFor="usFederalTaxClassification"
                          className={labelClass}
                        >
                          Federal tax classification
                        </label>
                        <SelectField
                          id="usFederalTaxClassification"
                          name="usFederalTaxClassification"
                          value={formData.usFederalTaxClassification}
                          onChange={handleInputChange}
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
                        </SelectField>
                      </div>
                    )}
                    {needsEori && (
                      <div>
                        <label htmlFor="ioss" className={labelClass}>
                          IOSS Number
                        </label>
                        <input
                          id="ioss"
                          name="ioss"
                          type="text"
                          value={formData.ioss}
                          onChange={handleInputChange}
                          className={fieldClass}
                        />
                      </div>
                    )}
                    {isUK && (
                      <div>
                        <label htmlFor="pva" className={labelClass}>
                          PVA Number
                        </label>
                        <input
                          id="pva"
                          name="pva"
                          type="text"
                          value={formData.pva}
                          onChange={handleInputChange}
                          className={fieldClass}
                        />
                      </div>
                    )}
                    {isUK && (
                      <div>
                        <label htmlFor="danDda" className={labelClass}>
                          DAN/DDA
                        </label>
                        <input
                          id="danDda"
                          name="danDda"
                          type="text"
                          value={formData.danDda}
                          onChange={handleInputChange}
                          className={fieldClass}
                        />
                      </div>
                    )}
                    {EU_COUNTRIES.has(formData.country) && (
                      <div>
                        <label
                          htmlFor="deferredPaymentSchemeNumber"
                          className={labelClass}
                        >
                          Deferred Payment Scheme Number
                        </label>
                        <input
                          id="deferredPaymentSchemeNumber"
                          name="deferredPaymentSchemeNumber"
                          type="text"
                          value={formData.deferredPaymentSchemeNumber}
                          onChange={handleInputChange}
                          className={fieldClass}
                        />
                      </div>
                    )}
                    {isUS && (
                      <div>
                        <label
                          htmlFor="usIncomeTaxReturnName"
                          className={labelClass}
                        >
                          Name on the income tax return
                        </label>
                        <input
                          id="usIncomeTaxReturnName"
                          name="usIncomeTaxReturnName"
                          type="text"
                          value={formData.usIncomeTaxReturnName}
                          onChange={handleInputChange}
                          className={fieldClass}
                        />
                        <p className={hintClass}>
                          The legal name your contact has registered with the IRS
                        </p>
                      </div>
                    )}
                    {isUS && (
                      <div>
                        <label
                          htmlFor="usBusinessDisregardedEntityName"
                          className={labelClass}
                        >
                          Business or disregarded entity name
                        </label>
                        <input
                          id="usBusinessDisregardedEntityName"
                          name="usBusinessDisregardedEntityName"
                          type="text"
                          value={formData.usBusinessDisregardedEntityName}
                          onChange={handleInputChange}
                          className={fieldClass}
                        />
                        <p className={hintClass}>
                          Enter if the legal name is different from the business
                          or disregarded entity name
                        </p>
                      </div>
                    )}
                    {isUS && (
                      <div>
                        <label
                          htmlFor="customsBondedImportAccount"
                          className={labelClass}
                        >
                          Customs Bonded Import Account
                        </label>
                        <div className={joinedFieldClass}>
                          <JoinedSelect
                            name="customsBondedTaxType"
                            aria-label="Customs bonded tax number type"
                            value={formData.customsBondedTaxType}
                            onChange={handleInputChange}
                          >
                            <option value="None">None</option>
                            <option value="SSN">SSN</option>
                            <option value="EIN">EIN</option>
                            <option value="ITIN">ITIN</option>
                            <option value="ATIN">ATIN</option>
                          </JoinedSelect>
                          <input
                            id="customsBondedImportAccount"
                            name="customsBondedImportAccount"
                            type="text"
                            value={formData.customsBondedImportAccount}
                            onChange={handleInputChange}
                            placeholder="Tax number"
                            disabled={formData.customsBondedTaxType === "None"}
                            className={joinedInputClass}
                          />
                        </div>
                      </div>
                    )}
                    {isUS && (
                      <div>
                        <label htmlFor="knownShipper" className={labelClass}>
                          Are you a registered &quot;Known Shipper&quot; with
                          TSA?
                        </label>
                        <div className={joinedFieldClass}>
                          <span className="relative flex shrink-0 items-center border-r-2 border-[#1F447B] px-4">
                            <input
                              id="knownShipper"
                              type="checkbox"
                              className="peer sr-only"
                              checked={formData.knownShipper === "Yes"}
                              onChange={handleKnownShipperToggle}
                            />
                            <label
                              htmlFor="knownShipper"
                              aria-hidden
                              className={`cursor-pointer ${switchTrackClass}`}
                            />
                          </span>
                          <input
                            name="tsaKtn"
                            type="text"
                            aria-label="TSA Number (KTN)"
                            value={formData.tsaKtn}
                            onChange={handleTsaKtnChange}
                            maxLength={9}
                            pattern="[A-Za-z0-9]{9}"
                            title="TSA Number (KTN) must be exactly 9 alphanumeric characters."
                            placeholder="TSA Number (KTN)"
                            disabled={formData.knownShipper !== "Yes"}
                            className={joinedInputClass}
                          />
                        </div>
                        <p className={hintClass}>
                          TSA Number (KTN) must be 9-digit alpha-numeric.
                        </p>
                      </div>
                    )}
                  </div>
                </FormSection>

                <FormSection
                  step={4}
                  title="Contacts"
                  description="Who we should speak to about shipping, billing and operations."
                >
                  <div className="space-y-4">
                    {contacts.map((contact, index) => (
                      <div key={contact.id} className={unitCardClass}>
                        <div className="mb-4 flex items-center justify-between gap-4">
                          <h3 className="text-base font-semibold text-[#1F447B]">
                            Contact {index + 1}
                          </h3>
                          {contacts.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeContact(contact.id)}
                              className={removeButtonClass}
                            >
                              <X className="h-4 w-4" aria-hidden />
                              Remove
                            </button>
                          )}
                        </div>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          <div>
                            <label
                              htmlFor={`contact-${contact.id}-name`}
                              className={labelClass}
                            >
                              Name
                            </label>
                            <input
                              id={`contact-${contact.id}-name`}
                              type="text"
                              value={contact.name}
                              onChange={(e) =>
                                updateContact(contact.id, "name", e.target.value)
                              }
                              className={fieldClass}
                            />
                          </div>
                          <div>
                            <label
                              htmlFor={`contact-${contact.id}-type`}
                              className={labelClass}
                            >
                              Contact Type
                            </label>
                            <SelectField
                              id={`contact-${contact.id}-type`}
                              value={contact.contactType}
                              onChange={(e) =>
                                updateContact(
                                  contact.id,
                                  "contactType",
                                  e.target.value,
                                )
                              }
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
                            </SelectField>
                          </div>
                          <div>
                            <label
                              htmlFor={`contact-${contact.id}-email`}
                              className={labelClass}
                            >
                              Email
                            </label>
                            <input
                              id={`contact-${contact.id}-email`}
                              type="email"
                              value={contact.email}
                              onChange={(e) =>
                                updateContact(contact.id, "email", e.target.value)
                              }
                              className={fieldClass}
                            />
                          </div>
                          <div>
                            <label
                              htmlFor={`contact-${contact.id}-phone`}
                              className={labelClass}
                            >
                              Phone
                            </label>
                            <input
                              id={`contact-${contact.id}-phone`}
                              type="tel"
                              value={contact.phone}
                              onChange={(e) =>
                                updateContact(contact.id, "phone", e.target.value)
                              }
                              className={fieldClass}
                            />
                          </div>
                        </div>
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={addContact}
                      className={addButtonClass}
                    >
                      <Plus className="h-4 w-4" aria-hidden />
                      Add Contact
                    </button>
                  </div>
                </FormSection>

                <FormSection
                  step={5}
                  title="Terms and Conditions"
                  description="Review and sign to send your account request."
                >
                  <div className="space-y-4">
                    <p className="border-l-4 border-[#EB993C] pl-4 text-sm leading-relaxed text-[#324A6D]">
                      I wish to open a credit account with GlobalAmerican LLC. I
                      confirm that I have read and understand your terms and
                      conditions and accept the terms and conditions.
                    </p>
                    <label className="flex cursor-pointer items-center gap-3">
                      <input
                        type="checkbox"
                        name="termsAccepted"
                        checked={formData.termsAccepted}
                        onChange={handleInputChange}
                        required
                        className={checkboxClass}
                      />
                      <span className="text-sm font-medium text-[#324A6D]">
                        I accept the Terms and Conditions <Required />
                      </span>
                    </label>
                  </div>

                  <div className="sm:max-w-[calc(50%-0.625rem)]">
                    <label htmlFor="signature" className={labelClass}>
                      Signature <Required />
                    </label>
                    <input
                      id="signature"
                      name="signature"
                      type="text"
                      placeholder="Type full legal name"
                      required
                      value={formData.signature}
                      onChange={handleInputChange}
                      className={fieldClass}
                    />
                  </div>
                </FormSection>

                <div className="flex border-t border-[#1F447B] pt-8 sm:justify-end">
                  <button type="submit" className={submitButtonClass}>
                    Submit Account Request
                    <ArrowRight className="h-5 w-5" aria-hidden />
                  </button>
                </div>
              </form>
            </CaptchaLocked>
          </div>
        </section>
      </main>
    </div>
  );
}
