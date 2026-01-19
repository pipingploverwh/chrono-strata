export interface ProductCategory {
  name: string;
  description: string;
  priceRange: string;
  formats: string[];
  brands: string[];
  potencyRange: string;
  icon: string;
}

export const dispensaryProducts: ProductCategory[] = [
  {
    name: "Pre-Rolls",
    description: "Premium singles to multi-packs, from classic flower to hash-infused",
    priceRange: "From $8",
    formats: ["1g singles", "Multi-packs (5-16)"],
    brands: ["HAVN", "Rhelm", "Nature's Heritage", "Happy Valley", "Valorem", "Root & Bloom", "NEA"],
    potencyRange: "20-50%+ TAC",
    icon: "🌿"
  },
  {
    name: "Flower",
    description: "Premium buds, smalls, and shake from Cape Cod's finest cultivators",
    priceRange: "$25 - $130+",
    formats: ["3.5g eighths", "7g quarters", "14g halves", "28g ounces"],
    brands: ["Root & Bloom", "Happy Valley", "Cape Cod Grow Labs", "Nostalgia", "M1", "Rhelm"],
    potencyRange: "22-40%+ TAC",
    icon: "🌸"
  },
  {
    name: "Infused",
    description: "Hash and rosin-infused pre-rolls for elevated potency and flavor",
    priceRange: "Premium tier",
    formats: ["Hash-infused", "Hash rosin-infused"],
    brands: ["Happy Valley", "Nature's Heritage", "Rhelm"],
    potencyRange: "40-50%+ TAC",
    icon: "✨"
  },
  {
    name: "Value Packs",
    description: "Multi-packs and shake options for the savvy shopper",
    priceRange: "Best value",
    formats: ["5-16 count packs", "Shake options"],
    brands: ["Various cultivators"],
    potencyRange: "Varies",
    icon: "📦"
  }
];

export const featuredStrains = [
  {
    name: "Blue Dream",
    type: "Hybrid",
    effects: ["Uplifting", "Creative", "Relaxed"],
    description: "A beloved classic, perfect for beginners and veterans alike"
  },
  {
    name: "Granddaddy Purple",
    type: "Indica",
    effects: ["Relaxed", "Sleepy", "Happy"],
    description: "Deep relaxation after a long beach day"
  },
  {
    name: "Sour Diesel",
    type: "Sativa",
    effects: ["Energizing", "Creative", "Focused"],
    description: "Citrus-forward fuel for your Cape Cod adventures"
  }
];

export const storeInfo = {
  name: "The Piping Plover Dispensary",
  tagline: "Where Cape Cod Meets Cannabis",
  address: "Wellfleet, Cape Cod, MA",
  hours: "Open Daily 10am - 9pm",
  phone: "(508) 555-PIPE",
  ageRequirement: "21+ with valid ID"
};
