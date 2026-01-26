import { MapPin, Clock, Phone, Shield, Globe, Leaf, Flower2, Sparkles, Package, Bird } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguageState } from "@/hooks/useLanguage";

// Product data with translations
const getProductCategories = (t: (key: string) => string) => [
  {
    name: t('plover.product.prerolls'),
    description: t('plover.product.prerollsDesc'),
    priceRange: "From $8",
    potencyRange: "20-50%+ TAC",
    Icon: Leaf
  },
  {
    name: t('plover.product.flower'),
    description: t('plover.product.flowerDesc'),
    priceRange: "$25 - $130+",
    potencyRange: "22-40%+ TAC",
    Icon: Flower2
  },
  {
    name: t('plover.product.infused'),
    description: t('plover.product.infusedDesc'),
    priceRange: "Premium",
    potencyRange: "40-50%+ TAC",
    Icon: Sparkles
  },
  {
    name: t('plover.product.valuePacks'),
    description: t('plover.product.valuePacksDesc'),
    priceRange: "Best Value",
    potencyRange: "Varies",
    Icon: Package
  }
];

const getFeaturedStrains = (t: (key: string) => string) => [
  {
    name: "Blue Dream",
    type: t('plover.strain.hybrid'),
    typeKey: "hybrid",
    effects: ["Uplifting", "Creative", "Relaxed"],
    description: "A beloved classic, perfect for beginners and veterans alike"
  },
  {
    name: "Granddaddy Purple",
    type: t('plover.strain.indica'),
    typeKey: "indica",
    effects: ["Relaxed", "Sleepy", "Happy"],
    description: "Deep relaxation after a long beach day"
  },
  {
    name: "Sour Diesel",
    type: t('plover.strain.sativa'),
    typeKey: "sativa",
    effects: ["Energizing", "Creative", "Focused"],
    description: "Citrus-forward fuel for your Cape Cod adventures"
  }
];

export default function WellfleetDispensary() {
  const { t, language, setLanguage } = useLanguageState();
  const productCategories = getProductCategories(t);
  const featuredStrains = getFeaturedStrains(t);

  return (
    <div className="min-h-screen bg-plover-sand">
        {/* Language Toggle - Fixed Position */}
        <div className="fixed top-4 right-4 z-40">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setLanguage(language === 'en' ? 'ja' : 'en')}
            className="gap-2 bg-plover-cream/90 backdrop-blur-sm border-plover-dune/30 hover:bg-plover-cream text-plover-earth"
          >
            <Globe className="w-4 h-4" />
            <span className="font-mono text-xs uppercase tracking-wide">
              {language === 'en' ? 'JA' : 'EN'}
            </span>
          </Button>
        </div>

        {/* Hero Section */}
        <section className="relative overflow-hidden border-b border-plover-dune/20">
          {/* Subtle wave pattern overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-plover-sage/10 to-transparent" />
          
          <div className="relative max-w-5xl mx-auto px-6 py-24 text-center">
            {/* Plover Mascot */}
            <div className="mb-6 animate-fade">
              <Bird className="w-16 h-16 mx-auto text-plover-sage" strokeWidth={1.5} />
            </div>
            
            <h1 className="text-4xl md:text-5xl font-light text-plover-earth mb-4 tracking-tight">
              {t('plover.storeName')}
            </h1>
            <p className="text-lg text-plover-sage font-medium tracking-wide uppercase text-sm mb-10">
              {t('plover.tagline')}
            </p>
            
            {/* Quick Info Bar */}
            <div className="flex flex-wrap justify-center gap-6 text-sm text-plover-earth/70 mb-12">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-plover-sage" />
                <span>Wellfleet, Cape Cod, MA</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-plover-sage" />
                <span>{t('plover.hours')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-plover-sage" />
                <span>(508) 555-PIPE</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-plover-sage" />
                <span>{t('plover.ageRequirement')}</span>
              </div>
            </div>
            
            {/* CTA */}
            <Button className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-plover-sage text-plover-cream font-medium hover:bg-plover-sage/90 transition-all h-auto">
              <Bird className="w-5 h-5" />
              {t('plover.viewFullMenu')}
            </Button>
          </div>
        </section>

        {/* Product Categories */}
        <section className="max-w-5xl mx-auto px-6 py-20">
          <h2 className="text-2xl font-light text-plover-earth text-center mb-12 tracking-wide">
            {t('plover.ourProducts')}
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {productCategories.map((category) => (
              <div
                key={category.name}
                className="bg-plover-cream rounded-lg p-6 border border-plover-dune/20 hover:border-plover-sage/40 transition-colors"
              >
                <category.Icon className="w-8 h-8 text-plover-sage mb-4" strokeWidth={1.5} />
                <h3 className="text-base font-medium text-plover-earth mb-2">
                  {category.name}
                </h3>
                <p className="text-sm text-plover-earth/60 mb-4 leading-relaxed">
                  {category.description}
                </p>
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-plover-earth/50">{t('plover.price')}</span>
                    <span className="text-plover-sage font-medium">{category.priceRange}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-plover-earth/50">{t('plover.potency')}</span>
                    <span className="text-plover-earth font-medium">{category.potencyRange}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Piper's Picks */}
        <section className="border-y border-plover-dune/20 bg-plover-cream py-20">
          <div className="max-w-5xl mx-auto px-6">
            <div className="text-center mb-12">
              <Bird className="w-10 h-10 mx-auto text-plover-sage mb-3" strokeWidth={1.5} />
              <h2 className="text-2xl font-light text-plover-earth">
                {t('plover.pipersPicks')}
              </h2>
              <p className="text-plover-earth/60 mt-2 text-sm">
                {t('plover.pipersPicksDesc')}
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-4">
              {featuredStrains.map((strain) => (
                <div
                  key={strain.name}
                  className="bg-plover-sand rounded-lg p-6 border border-plover-dune/20"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-plover-earth">{strain.name}</h3>
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                      strain.typeKey === "sativa" ? "bg-plover-sage/20 text-plover-sage" :
                      strain.typeKey === "indica" ? "bg-plover-earth/10 text-plover-earth" :
                      "bg-plover-dune/30 text-plover-earth/70"
                    }`}>
                      {strain.type}
                    </span>
                  </div>
                  <p className="text-sm text-plover-earth/60 mb-4">
                    {strain.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {strain.effects.map((effect) => (
                      <span
                        key={effect}
                        className="text-xs px-2 py-0.5 rounded-full bg-plover-dune/20 text-plover-earth/70"
                      >
                        {effect}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="max-w-5xl mx-auto px-6 py-20">
          <div className="bg-plover-cream rounded-xl p-10 text-center border border-plover-dune/20 shadow-sm">
            <h2 className="text-2xl font-light text-plover-earth mb-4">
              {t('plover.readyToExplore')}
            </h2>
            <p className="text-plover-earth/60 mb-8 max-w-lg mx-auto text-sm">
              {t('plover.readyToExploreDesc')}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button className="bg-plover-sage hover:bg-plover-sage/90 text-plover-cream px-6 py-3 rounded-full">
                {t('plover.getDirections')}
              </Button>
              <Button variant="outline" className="border-plover-sage/30 text-plover-earth hover:bg-plover-sage/10 px-6 py-3 rounded-full">
                {t('plover.viewFullMenu')}
              </Button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-plover-dune/20 py-8 bg-plover-cream">
          <div className="max-w-5xl mx-auto px-6 text-center text-xs text-plover-earth/50">
            <p className="mb-2">
              © 2025 The Piping Plover Dispensary · Wellfleet, Cape Cod, MA
            </p>
            <p>
              {language === 'ja' 
                ? '21歳以上の成人のみ使用可。子供の手の届かない場所に保管してください。'
                : 'For use only by adults 21 years of age and older. Keep out of reach of children.'}
            </p>
          </div>
        </footer>
      </div>
  );
}