import { MapPin, Clock, Phone, Shield, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import AgeGate from "@/components/AgeGate";
import PloverGuide from "@/components/PloverGuide";
import { useLanguageState } from "@/hooks/useLanguage";

// Product data with translations
const getProductCategories = (t: (key: string) => string) => [
  {
    name: t('plover.product.prerolls'),
    description: t('plover.product.prerollsDesc'),
    priceRange: "From $8",
    potencyRange: "20-50%+ TAC",
    icon: "🌿"
  },
  {
    name: t('plover.product.flower'),
    description: t('plover.product.flowerDesc'),
    priceRange: "$25 - $130+",
    potencyRange: "22-40%+ TAC",
    icon: "🌸"
  },
  {
    name: t('plover.product.infused'),
    description: t('plover.product.infusedDesc'),
    priceRange: "Premium",
    potencyRange: "40-50%+ TAC",
    icon: "✨"
  },
  {
    name: t('plover.product.valuePacks'),
    description: t('plover.product.valuePacksDesc'),
    priceRange: "Best Value",
    potencyRange: "Varies",
    icon: "📦"
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
    <AgeGate>
      <div className="min-h-screen bg-background">
        {/* Language Toggle - Fixed Position */}
        <div className="fixed top-4 right-4 z-40">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setLanguage(language === 'en' ? 'ja' : 'en')}
            className="gap-2 bg-card/80 backdrop-blur-sm border-border hover:bg-muted"
          >
            <Globe className="w-4 h-4" />
            <span className="font-mono text-xs">
              {language === 'en' ? '🇯🇵 日本語' : '🇺🇸 English'}
            </span>
          </Button>
        </div>

        {/* Hero Section */}
        <section className="relative overflow-hidden border-b border-border">
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
          
          <div className="relative max-w-5xl mx-auto px-6 py-24 text-center">
            {/* Plover Mascot */}
            <div className="text-7xl mb-6 animate-fade">🐦</div>
            
            <h1 className="text-4xl md:text-5xl font-medium text-foreground mb-4 tracking-tight">
              {t('plover.storeName')}
            </h1>
            <p className="text-lg text-primary mb-10">
              {t('plover.tagline')}
            </p>
            
            {/* Quick Info Bar */}
            <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground mb-12">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                <span>Wellfleet, Cape Cod, MA</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                <span>{t('plover.hours')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary" />
                <span>(508) 555-PIPE</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-lavender" />
                <span>{t('plover.ageRequirement')}</span>
              </div>
            </div>
            
            {/* CTA */}
            <button
              onClick={() => {
                const chatBtn = document.querySelector('[data-chat-toggle]') as HTMLButtonElement;
                chatBtn?.click();
              }}
              className="inline-flex items-center gap-3 px-8 py-4 rounded-md bg-primary text-primary-foreground font-medium text-lg hover:bg-primary/90 transition-all"
            >
              <span className="text-2xl">🐦</span>
              {t('plover.chatWithPiper')}
            </button>
          </div>
        </section>

        {/* Product Categories */}
        <section className="max-w-5xl mx-auto px-6 py-20">
          <h2 className="text-2xl font-medium text-foreground text-center mb-12">
            {t('plover.ourProducts')}
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {productCategories.map((category) => (
              <div
                key={category.name}
                className="lavender-card p-6 hover:bg-surface-2 transition-colors"
              >
                <div className="text-3xl mb-4">{category.icon}</div>
                <h3 className="text-base font-medium text-foreground mb-2">
                  {category.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                  {category.description}
                </p>
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('plover.price')}</span>
                    <span className="text-primary font-medium">{category.priceRange}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('plover.potency')}</span>
                    <span className="text-lavender font-medium">{category.potencyRange}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Piper's Picks */}
        <section className="border-y border-border bg-surface-1 py-20">
          <div className="max-w-5xl mx-auto px-6">
            <div className="text-center mb-12">
              <span className="text-4xl">🐦</span>
              <h2 className="text-2xl font-medium text-foreground mt-3">
                {t('plover.pipersPicks')}
              </h2>
              <p className="text-muted-foreground mt-2 text-sm">
                {t('plover.pipersPicksDesc')}
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-4">
              {featuredStrains.map((strain) => (
                <div
                  key={strain.name}
                  className="lavender-card p-6"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-foreground">{strain.name}</h3>
                    <span className={`text-xs px-2 py-1 rounded ${
                      strain.typeKey === "sativa" ? "badge-margin-medium" :
                      strain.typeKey === "indica" ? "badge-category" :
                      "bg-muted text-muted-foreground"
                    }`}>
                      {strain.type}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    {strain.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {strain.effects.map((effect) => (
                      <span
                        key={effect}
                        className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground"
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
          <div className="lavender-card-elevated p-10 text-center">
            <h2 className="text-2xl font-medium text-foreground mb-4">
              {t('plover.readyToExplore')}
            </h2>
            <p className="text-muted-foreground mb-8 max-w-lg mx-auto text-sm">
              {t('plover.readyToExploreDesc')}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button className="btn-primary px-6 py-3">
                {t('plover.getDirections')}
              </Button>
              <Button variant="outline" className="btn-secondary px-6 py-3">
                {t('plover.viewFullMenu')}
              </Button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border py-8">
          <div className="max-w-5xl mx-auto px-6 text-center text-xs text-muted-foreground">
            <p className="mb-2">
              © 2025 The Piping Plover Dispensary • Wellfleet, Cape Cod, MA
            </p>
            <p>
              {language === 'ja' 
                ? '21歳以上の成人のみ使用可。子供の手の届かない場所に保管してください。'
                : 'For use only by adults 21 years of age and older. Keep out of reach of children.'}
            </p>
          </div>
        </footer>

        {/* Piper Chat */}
        <PloverGuide />
      </div>
    </AgeGate>
  );
}
