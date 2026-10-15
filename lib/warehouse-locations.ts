// Single source of truth for our facilities. Used by the Locations section
// and by the 3D globe (About page + Locations panel).

export type WarehouseLocation = {
  id: string;
  city: string;
  /** Short name shown on the globe */
  label: string;
  country: string;
  countryCode: string;
  lat: number;
  lng: number;
  address: string;
  /** The address broken into display lines for the location cards */
  addressLines: string[];
  /** Local contact number, shown with the address when present */
  phone?: string;
  image: string;
  description: string;
  features: string[];
};

export const warehouseLocations: WarehouseLocation[] = [
  {
    id: "new-york",
    city: "Englewood, NJ",
    label: "New Jersey",
    country: "United States",
    countryCode: "US",
    lat: 40.8929,
    lng: -73.9726,
    address: "40 North Van Brunt Street Ste 23, Englewood, NJ 07631, USA",
    addressLines: ["40 North Van Brunt Street, Ste 23", "Englewood, NJ 07631"],
    image: "/warehouses/new-york.jpg",
    description:
      "Our flagship North American distribution hub strategically positioned to serve the entire East Coast with advanced logistics capabilities and multimodal transport connections.",
    features: ["Primary Hub", "East Coast Gateway", "Multimodal Transport"],
  },
  {
    id: "belfast",
    city: "Strabane",
    label: "Strabane",
    country: "Northern Ireland",
    countryCode: "GB",
    lat: 54.8275,
    lng: -7.4642,
    address:
      "ShipItSmart Consulting Unit 1 Mahon Building, 39/49 Dock St, Strabane BT82 8EE, United Kingdom",
    addressLines: ["Unit 1 Mahon Building, 39/49 Dock St", "Strabane BT82 8EE"],
    image: "/warehouses/belfast.jpg",
    description:
      "Northern Ireland operations center providing comprehensive logistics solutions with direct access to UK and EU markets through strategic port connections.",
    features: ["UK-EU Gateway", "Port Access", "Cross-Border Logistics"],
  },
  {
    id: "dublin",
    city: "Convoy, Donegal",
    label: "Donegal",
    country: "Republic of Ireland",
    countryCode: "IE",
    lat: 54.8656,
    lng: -7.6644,
    address:
      "Unit 4 Lower, Convoy Enterprise Centre, Convoy, Donegal, F93 H5F9, Ireland",
    addressLines: ["Unit 4 Lower, Convoy Enterprise Centre", "Convoy, Co. Donegal F93 H5F9"],
    image: "/warehouses/dublin.jpg",
    description:
      "European Union distribution hub with advanced automation systems, strategic location for EU market access, and comprehensive logistics capabilities.",
    features: ["EU Distribution Hub", "Automated Systems", "Cold Chain"],
  },
  {
    id: "manchester",
    city: "Heywood, Manchester",
    label: "Manchester",
    country: "United Kingdom",
    countryCode: "GB",
    lat: 53.595,
    lng: -2.215,
    address:
      "Unit A, Birch Business Park, Heywood Manchester OL10 2SX, United Kingdom",
    addressLines: ["Unit A, Birch Business Park", "Heywood, Manchester OL10 2SX"],
    image: "/warehouses/manchester.jpg",
    description:
      "UK headquarters facility with comprehensive e-commerce fulfillment capabilities and direct connections to major UK transport networks.",
    features: ["UK Headquarters", "E-commerce Hub", "Transport Networks"],
  },
  {
    id: "xiamen",
    city: "Xiamen, China",
    label: "Xiamen",
    country: "China",
    countryCode: "CN",
    lat: 24.51,
    lng: 118.12,
    address:
      "ITD Global Logistics (Xiamen) Ltd, Room 301, Building 31, Nanshan Road, Huli District, Xiamen City, Fujian, China",
    addressLines: ["Room 301, Building 31, Nanshan Road", "Huli District, Xiamen, Fujian"],
    image: "/warehouses/xiamen.jpg",
    description:
      "Our China operations base in Xiamen's Huli District, close to the port and airport, giving direct access to Chinese manufacturing hubs and Asia-Pacific sea and air freight routes.",
    features: ["Asia-Pacific Gateway", "Sea & Air Freight", "China Sourcing Support"],
  },
];

/** Hub shape consumed by the globe component */
export const globeHubs = warehouseLocations.map((l) => ({
  id: l.id,
  label: l.label,
  lat: l.lat,
  lng: l.lng,
}));

/** Google Maps link that searches by the facility's street address */
export const mapsSearchUrl = (address: string) =>
  `https://maps.google.com/maps?q=${encodeURIComponent(address)}`;

/** Embeddable Google Maps view pinned to the facility's street address */
export const mapsEmbedUrl = (address: string, zoom = 16) =>
  `https://maps.google.com/maps?q=${encodeURIComponent(address)}&hl=en&z=${zoom}&output=embed&iwloc=near`;
