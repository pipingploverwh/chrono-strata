import { MapPin, Clock, Phone, Shield } from "lucide-react";
import AgeGate from "@/components/AgeGate";
import PloverGuide from "@/components/PloverGuide";
import { dispensaryProducts, storeInfo, featuredStrains } from "@/data/dispensaryProducts";

export default function WellfleetDispensary() {
  return (
    <AgeGate>
      <div className="min-h-screen bg-plover-dune">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%234A7C94' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }} />
          </div>
          
          <div className="relative max-w-6xl mx-auto px-6 py-20 text-center">
            {/* Plover Mascot */}
            <div className="text-8xl mb-6 animate-fade">🐦</div>
            
            <h1 className="text-4xl md:text-5xl font-medium text-plover-driftwood mb-4">
              {storeInfo.name}
            </h1>
            <p className="text-xl text-plover-ocean mb-8">
              {storeInfo.tagline}
            </p>
            
            {/* Quick Info Bar */}
            <div className="flex flex-wrap justify-center gap-6 text-sm text-plover-driftwood/70 mb-10">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-plover-ocean" />
                <span>{storeInfo.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-plover-ocean" />
                <span>{storeInfo.hours}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-plover-ocean" />
                <span>{storeInfo.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-plover-sunset" />
                <span>{storeInfo.ageRequirement}</span>
              </div>
            </div>
            
            {/* CTA */}
            <button
              onClick={() => {
                const chatBtn = document.querySelector('[data-chat-toggle]') as HTMLButtonElement;
                chatBtn?.click();
              }}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-plover-ocean text-white font-medium text-lg hover:bg-plover-ocean/90 transition-all hover:scale-105 shadow-lg"
            >
              <span className="text-2xl">🐦</span>
              Chat with Piper
            </button>
          </div>
        </section>

        {/* Product Categories */}
        <section className="max-w-6xl mx-auto px-6 py-16">
          <h2 className="text-2xl font-medium text-plover-driftwood text-center mb-10">
            Our Products
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {dispensaryProducts.map((category) => (
              <div
                key={category.name}
                className="bg-white rounded-xl p-6 shadow-sm border border-plover-ocean/10 hover:shadow-md transition-shadow"
              >
                <div className="text-4xl mb-4">{category.icon}</div>
                <h3 className="text-lg font-medium text-plover-driftwood mb-2">
                  {category.name}
                </h3>
                <p className="text-sm text-plover-driftwood/70 mb-4">
                  {category.description}
                </p>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-plover-driftwood/60">Price</span>
                    <span className="text-plover-ocean font-medium">{category.priceRange}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-plover-driftwood/60">Potency</span>
                    <span className="text-plover-sunset font-medium">{category.potencyRange}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Piper's Picks */}
        <section className="bg-plover-sand/50 py-16">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-10">
              <span className="text-4xl">🐦</span>
              <h2 className="text-2xl font-medium text-plover-driftwood mt-2">
                Piper's Picks
              </h2>
              <p className="text-plover-driftwood/70 mt-2">
                Our feathered friend's favorite strains
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              {featuredStrains.map((strain) => (
                <div
                  key={strain.name}
                  className="bg-white rounded-xl p-6 shadow-sm border border-plover-ocean/10"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-plover-driftwood">{strain.name}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      strain.type === "Sativa" ? "bg-plover-sunset/20 text-plover-sunset" :
                      strain.type === "Indica" ? "bg-plover-ocean/20 text-plover-ocean" :
                      "bg-plover-sand text-plover-driftwood"
                    }`}>
                      {strain.type}
                    </span>
                  </div>
                  <p className="text-sm text-plover-driftwood/70 mb-4">
                    {strain.description}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {strain.effects.map((effect) => (
                      <span
                        key={effect}
                        className="text-xs px-2 py-0.5 rounded-full bg-plover-dune text-plover-driftwood/70"
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
        <section className="max-w-6xl mx-auto px-6 py-16 text-center">
          <div className="bg-gradient-to-br from-plover-ocean to-plover-ocean/80 rounded-2xl p-10 text-white">
            <h2 className="text-2xl font-medium mb-4">
              Ready to explore?
            </h2>
            <p className="text-white/80 mb-6 max-w-md mx-auto">
              Chat with Piper for personalized recommendations, or visit us in Wellfleet for the full experience.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button className="px-6 py-3 rounded-full bg-white text-plover-ocean font-medium hover:bg-white/90 transition-colors">
                Get Directions
              </button>
              <button className="px-6 py-3 rounded-full bg-white/20 text-white font-medium hover:bg-white/30 transition-colors">
                View Full Menu
              </button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-plover-ocean/10 py-8">
          <div className="max-w-6xl mx-auto px-6 text-center text-sm text-plover-driftwood/60">
            <p className="mb-2">
              © 2025 The Piping Plover Dispensary • Wellfleet, Cape Cod, MA
            </p>
            <p>
              For use only by adults 21 years of age and older. Keep out of reach of children.
            </p>
          </div>
        </footer>

        {/* Piper Chat */}
        <PloverGuide />
      </div>
    </AgeGate>
  );
}
