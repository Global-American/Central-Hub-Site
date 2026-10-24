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
    address: "Strabane, Co. Tyrone, Northern Ireland",
    addressLines: ["Strabane, Co. Tyrone"],
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
    address: "Convoy, Co. Donegal, Ireland",
    addressLines: ["Convoy, Co. Donegal"],
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
    id: "quanzhou",
    city: "Quanzhou, China",
    label: "Quanzhou",
    country: "China",
    countryCode: "CN",
    lat: 24.91,
    lng: 118.6,
    address:
      "Room 701, Building 3B, No. 20 Fengze Street, ShengshiTianjiao, Quanzhou City 362000, China",
    addressLines: [
      "Room 701, Building 3B, No. 20 Fengze Street",
      "ShengshiTianjiao, Quanzhou City 362000",
    ],
    image: "/warehouses/quanzhou.jpg",
    description:
      "Our China office in Quanzhou, Fujian, coordinating sourcing, supplier relationships and freight bookings across China and the Asia-Pacific.",
    features: ["China Office", "Supplier Coordination", "Asia-Pacific Freight"],
  },
  {
    id: "shenzhen",
    city: "Shenzhen, China",
    label: "Shenzhen",
    country: "China",
    countryCode: "CN",
    lat: 22.69,
    lng: 114.12,
    address:
      "No. 2, 1st Floor, Building 2#, No. 2 Hehualing Road, Pinghu Street, Longgang District, Shenzhen 518111, China",
    addressLines: [
      "No. 2, 1st Floor, Building 2#, No. 2 Hehualing Rd",
      "Pinghu Street, Longgang District, Shenzhen 518111",
    ],
    image: "/warehouses/shenzhen.jpg",
    description:
      "Our Shenzhen warehouse in Longgang District, handling consolidation and dispatch for goods leaving South China by sea and air.",
    features: ["South China Warehouse", "Consolidation", "Sea & Air Export"],
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
