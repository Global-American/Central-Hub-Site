// Shared by the homepage brand carousel and the /services page.

// Every brand currently points at the Ship itSmart site; swap in the real
// URLs as the other brand sites go live.
const SHIP_IT_SMART_URL = "https://ship-it-smart.vercel.app/";

export const brands = [
  {
    id: 1,
    name: "Ship itSmart",
    // White logo for the coloured carousel cards
    logo: "/logos/ship-itsmart-card.png",
    // Full-colour logo for light backgrounds
    logoColor: "/logos/ship-itsmart.png",
    tagline: "Be Smart, Ship itSmart",
    summary:
      "Parcel shipping with discounted rates from global carriers, optimized routes and real-time tracking.",
    description:
      "The world's leading brands trust ShipItSmart to streamline their shipping operations with unparalleled speed and precision. Our platform connects you to global carriers, optimizes routes, and provides real-time tracking—making international shipping smarter and more efficient.",
    color: "bg-gradient-to-br from-[#EB993C] to-[#d88730]",
    textColor: "text-white",
    image: "/card-thumbnails/ship-itsmart.png",
    // Detail copy for the /services page
    label: "Shipping",
    headline: "Parcel shipping, compared and booked in one place",
    features: [
      "Discounted express and economy rates with FedEx, DHL and UPS",
      "Domestic and international parcels",
      "Compare rates, book and track in one place",
      "Optimized routes with real-time tracking",
    ],
    bestFor: "Parcels, cartons and express shipments",
    url: SHIP_IT_SMART_URL,
  },
  {
    id: 2,
    name: "Freight itSmart",
    logo: "/logos/freight-itsmart-card.png",
    logoColor: "/logos/freight-itsmart.png",
    tagline: "Be Smart, Freight itSmart",
    summary:
      "Air, ocean and heavy freight through a single integration, with smart routing and end-to-end visibility.",
    description:
      "FreightItSmart is revolutionizing freight logistics, connecting businesses to top freight carriers and services with a single integration. Smart routing algorithms, advanced optimization, and comprehensive tracking make heavy cargo transportation faster, leaner, and more cost-effective.",
    color: "bg-gradient-to-br from-[#14529f] to-[#0f3c75]",
    textColor: "text-white",
    image: "/card-thumbnails/freight-itsmart.png",
    label: "Freight",
    headline: "Air, ocean and road freight through one integration",
    features: [
      "LTL, FTL, air and ocean freight",
      "Full (FCL) and shared (LCL) container loads",
      "Export and import customs clearance",
      "Instant quotes and end-to-end visibility",
    ],
    bestFor: "Larger commercial shipments, pallets and containers",
    url: SHIP_IT_SMART_URL,
  },
  {
    id: 3,
    name: "Return itSmart",
    logo: "/logos/return-itsmart-card.png",
    logoColor: "/logos/return-itsmart.png",
    tagline: "Be Smart, Return itSmart",
    summary:
      "Reverse logistics that streamlines return authorization and routing and maximizes recovery value.",
    description:
      "ReturnItSmart transforms the returns process into a competitive advantage. Our intelligent reverse logistics platform streamlines return authorization, optimizes return routing, and maximizes recovery value—turning returns from a cost center into a customer satisfaction driver.",
    color: "bg-gradient-to-br from-[#EB993C] to-[#d88730]",
    textColor: "text-white",
    image: "/card-thumbnails/return-itsmart.png",
    label: "Returns",
    headline: "Returns that keep customers coming back",
    features: [
      "Prepaid return labels",
      "Simple return authorization",
      "Smart routing for every return",
      "Status updates that keep customers informed",
    ],
    bestFor: "Online retailers handling customer returns",
    url: SHIP_IT_SMART_URL,
  },
  {
    id: 4,
    name: "Fulfill itSmart",
    logo: "/logos/fulfill-itsmart-card.png",
    logoColor: "/logos/fulfill-itsmart.png",
    tagline: "Be Smart, Fulfill itSmart",
    summary:
      "Order processing, inventory management and distribution in one fulfillment platform that scales with you.",
    description:
      "FulfillItSmart is the ultimate fulfillment solution, seamlessly integrating order processing, inventory management, and distribution. From order to delivery, our platform ensures accurate, fast, and cost-effective fulfillment that scales with your business growth.",
    color: "bg-gradient-to-br from-[#14529f] to-[#0f3c75]",
    textColor: "text-white",
    image: "/card-thumbnails/fulfill-itsmart.png",
    label: "Fulfillment",
    headline: "Orders stored, packed and shipped for you",
    features: [
      "Pick, pack and ship from one platform",
      "Inventory sync across your sales channels",
      "Automation rules and real-time rates",
      "Integrations with the channels you sell on",
    ],
    bestFor: "Growing brands selling across multiple channels",
    url: SHIP_IT_SMART_URL,
  },
];
