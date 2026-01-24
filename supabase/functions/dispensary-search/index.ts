import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Mock dispensary data - Replace with actual Dutchie/Weedmaps API when credentials available
const MOCK_DISPENSARIES = [
  {
    id: "disp-001",
    name: "Zen Leaf",
    type: "Medical & Recreational",
    address: "123 Main Street, Boston, MA 02101",
    phone: "(617) 555-0123",
    rating: 4.8,
    reviewCount: 342,
    distance: 0.8,
    hours: { open: "9:00 AM", close: "9:00 PM", isOpen: true },
    coordinates: { lat: 42.3601, lng: -71.0589 },
    features: ["Curbside Pickup", "Online Ordering", "Medical Consultation"],
    license: "MED-REC-2024-001",
    website: "https://zenleaf.com",
  },
  {
    id: "disp-002",
    name: "NETA",
    type: "Medical & Recreational",
    address: "225 Franklin Street, Boston, MA 02110",
    phone: "(617) 555-0456",
    rating: 4.6,
    reviewCount: 528,
    distance: 1.2,
    hours: { open: "10:00 AM", close: "8:00 PM", isOpen: true },
    coordinates: { lat: 42.3555, lng: -71.0486 },
    features: ["Express Pickup", "Delivery Available", "Veteran Discount"],
    license: "MED-REC-2024-002",
    website: "https://netacare.org",
  },
  {
    id: "disp-003",
    name: "Ascend Cannabis",
    type: "Recreational",
    address: "872 Commonwealth Ave, Boston, MA 02215",
    phone: "(617) 555-0789",
    rating: 4.5,
    reviewCount: 215,
    distance: 2.1,
    hours: { open: "9:00 AM", close: "10:00 PM", isOpen: true },
    coordinates: { lat: 42.3489, lng: -71.1097 },
    features: ["ATM On-Site", "Wheelchair Accessible", "First-Time Discount"],
    license: "REC-2024-003",
    website: "https://ascendwellness.com",
  },
  {
    id: "disp-004",
    name: "Revolutionary Clinics",
    type: "Medical",
    address: "67 Broadway, Somerville, MA 02145",
    phone: "(617) 555-0321",
    rating: 4.9,
    reviewCount: 189,
    distance: 2.8,
    hours: { open: "8:00 AM", close: "8:00 PM", isOpen: true },
    coordinates: { lat: 42.3876, lng: -71.0995 },
    features: ["Medical Only", "Patient Consultations", "Loyalty Program"],
    license: "MED-2024-004",
    website: "https://revclinics.org",
  },
  {
    id: "disp-005",
    name: "Garden Remedies",
    type: "Medical & Recreational",
    address: "697 Main Street, Newton, MA 02458",
    phone: "(617) 555-0654",
    rating: 4.7,
    reviewCount: 276,
    distance: 4.5,
    hours: { open: "10:00 AM", close: "7:00 PM", isOpen: true },
    coordinates: { lat: 42.3648, lng: -71.2058 },
    features: ["Organic Products", "Education Center", "Senior Discount"],
    license: "MED-REC-2024-005",
    website: "https://gardenremedies.com",
  },
];

// Mock products per dispensary
const MOCK_PRODUCTS = {
  "disp-001": [
    { id: "prod-001", name: "Blue Dream", type: "Flower", thc: 21, cbd: 0.5, price: 45, unit: "3.5g" },
    { id: "prod-002", name: "Granddaddy Purple", type: "Flower", thc: 23, cbd: 0.3, price: 50, unit: "3.5g" },
    { id: "prod-003", name: "1:1 Relief Tincture", type: "Tincture", thc: 10, cbd: 10, price: 65, unit: "30ml" },
  ],
  "disp-002": [
    { id: "prod-004", name: "Harlequin", type: "Flower", thc: 7, cbd: 15, price: 40, unit: "3.5g" },
    { id: "prod-005", name: "Pain Relief Cream", type: "Topical", thc: 0, cbd: 200, price: 55, unit: "2oz" },
  ],
  "disp-003": [
    { id: "prod-006", name: "OG Kush", type: "Flower", thc: 24, cbd: 0.2, price: 48, unit: "3.5g" },
    { id: "prod-007", name: "Sleep Gummies", type: "Edible", thc: 10, cbd: 5, price: 35, unit: "10pc" },
  ],
  "disp-004": [
    { id: "prod-008", name: "Charlotte's Web", type: "Flower", thc: 1, cbd: 17, price: 38, unit: "3.5g" },
    { id: "prod-009", name: "ACDC", type: "Flower", thc: 2, cbd: 20, price: 42, unit: "3.5g" },
  ],
  "disp-005": [
    { id: "prod-010", name: "Jack Herer", type: "Flower", thc: 19, cbd: 0.4, price: 44, unit: "3.5g" },
    { id: "prod-011", name: "Calm Capsules", type: "Capsule", thc: 5, cbd: 25, price: 60, unit: "30ct" },
  ],
};

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 3959; // Earth's radius in miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return Math.round(R * c * 10) / 10;
}

function getGoogleMapsDirectionsUrl(origin: { lat: number; lng: number }, destination: { lat: number; lng: number }): string {
  return `https://www.google.com/maps/dir/?api=1&origin=${origin.lat},${origin.lng}&destination=${destination.lat},${destination.lng}&travelmode=driving`;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { lat, lng, radius = 10, type = "all" } = await req.json();

    if (!lat || !lng) {
      return new Response(JSON.stringify({ error: "Location coordinates required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Filter and sort dispensaries by distance
    let dispensaries = MOCK_DISPENSARIES.map(disp => ({
      ...disp,
      distance: calculateDistance(lat, lng, disp.coordinates.lat, disp.coordinates.lng),
      directionsUrl: getGoogleMapsDirectionsUrl({ lat, lng }, disp.coordinates),
      products: MOCK_PRODUCTS[disp.id as keyof typeof MOCK_PRODUCTS] || [],
    }));

    // Filter by radius
    dispensaries = dispensaries.filter(d => d.distance <= radius);

    // Filter by type if specified
    if (type !== "all") {
      dispensaries = dispensaries.filter(d => 
        d.type.toLowerCase().includes(type.toLowerCase())
      );
    }

    // Sort by distance
    dispensaries.sort((a, b) => a.distance - b.distance);

    return new Response(JSON.stringify({
      userLocation: { lat, lng },
      radius,
      count: dispensaries.length,
      dispensaries,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Dispensary search error:", error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : "Search failed" 
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
