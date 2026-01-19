import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Volume2, Disc3, Gauge, Zap, Shield, Award, X, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

// Import gallery images
import heroImage from "@/assets/dj-table-hero.jpg";
import turntableImage from "@/assets/dj-table-turntable.jpg";
import mixerImage from "@/assets/dj-table-mixer.jpg";
import topImage from "@/assets/dj-table-top.jpg";
import frameImage from "@/assets/dj-table-frame.jpg";
import lifestyleImage from "@/assets/dj-table-lifestyle.jpg";

const DJTableShowcase = () => {
  const [activeView, setActiveView] = useState<'front' | 'top' | 'side'>('front');
  const [isHovered, setIsHovered] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const galleryImages = [
    { src: heroImage, title: "APEX-1 Overview", description: "3/4 angle showcasing the complete console" },
    { src: topImage, title: "Top View", description: "Dual turntable layout with central mixer" },
    { src: turntableImage, title: "Turntable Mount", description: "Precision-machined vibration isolation system" },
    { src: mixerImage, title: "Mixer Detail", description: "LED-illuminated control surface" },
    { src: frameImage, title: "Frame Construction", description: "Aircraft-grade aluminum framework" },
    { src: lifestyleImage, title: "In Performance", description: "Professional venue deployment" },
  ];

  const specs = [
    { label: "Dimensions", value: '72" × 36" × 34"' },
    { label: "Weight", value: "185 lbs" },
    { label: "Surface", value: "Carbon Fiber Composite" },
    { label: "Frame", value: "Aircraft-Grade Aluminum" },
    { label: "Finish", value: "Matte Obsidian" },
    { label: "LED System", value: "Programmable RGB Matrix" },
  ];

  const features = [
    {
      icon: Disc3,
      title: "Dual Turntable Integration",
      description: "Precision-engineered mounting system for industry-standard turntables with vibration isolation.",
    },
    {
      icon: Volume2,
      title: "Acoustic Engineering",
      description: "Integrated bass isolation chambers eliminate feedback and resonance interference.",
    },
    {
      icon: Gauge,
      title: "Climate Control",
      description: "Active thermal management maintains optimal equipment temperature during extended sets.",
    },
    {
      icon: Zap,
      title: "Power Distribution",
      description: "Clean power delivery with surge protection and cable management throughout.",
    },
    {
      icon: Shield,
      title: "Road-Ready Construction",
      description: "Military-spec durability rated for touring. Modular assembly in under 15 minutes.",
    },
    {
      icon: Award,
      title: "Limited Production",
      description: "Each unit is numbered and registered. Only 50 units manufactured annually.",
    },
  ];

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const navigateLightbox = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      setLightboxIndex((prev) => (prev === 0 ? galleryImages.length - 1 : prev - 1));
    } else {
      setLightboxIndex((prev) => (prev === galleryImages.length - 1 ? 0 : prev + 1));
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/30">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm tracking-wider uppercase">Back</span>
          </Link>
          <div className="text-center">
            <span className="text-xs tracking-[0.3em] text-muted-foreground uppercase">LAVANDAR Tech</span>
          </div>
          <div className="w-20" />
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Product Visual */}
            <div 
              className="relative aspect-[4/3] bg-gradient-to-br from-muted/50 to-muted/20 rounded-sm overflow-hidden border border-border/30"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              {/* Simulated 3D View */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div 
                  className={`relative transition-all duration-700 ${isHovered ? 'scale-105' : 'scale-100'}`}
                  style={{
                    perspective: '1000px',
                  }}
                >
                  {/* DJ Table Visualization */}
                  <div 
                    className="relative"
                    style={{
                      transform: activeView === 'front' 
                        ? 'rotateX(15deg) rotateY(-15deg)' 
                        : activeView === 'top' 
                        ? 'rotateX(60deg) rotateY(0deg)' 
                        : 'rotateX(15deg) rotateY(-45deg)',
                      transformStyle: 'preserve-3d',
                      transition: 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                  >
                    {/* Table Top */}
                    <div className="w-80 h-48 bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 rounded-sm shadow-2xl border border-zinc-700/50 relative">
                      {/* LED Strips */}
                      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-purple-500/60 via-cyan-400/60 to-purple-500/60 animate-pulse" />
                      <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-cyan-400/60 via-purple-500/60 to-cyan-400/60 animate-pulse" />
                      
                      {/* Turntable Mounts */}
                      <div className="absolute top-6 left-6 w-20 h-20 rounded-full bg-zinc-950 border border-zinc-600 flex items-center justify-center">
                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-800 flex items-center justify-center">
                          <div className="w-3 h-3 rounded-full bg-zinc-500" />
                        </div>
                      </div>
                      <div className="absolute top-6 right-6 w-20 h-20 rounded-full bg-zinc-950 border border-zinc-600 flex items-center justify-center">
                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-800 flex items-center justify-center">
                          <div className="w-3 h-3 rounded-full bg-zinc-500" />
                        </div>
                      </div>
                      
                      {/* Mixer Section */}
                      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-32 h-16 bg-zinc-950 rounded-sm border border-zinc-600 flex items-center justify-center gap-2 px-3">
                        <div className="w-2 h-8 bg-gradient-to-t from-cyan-500 to-cyan-500/20 rounded-full" />
                        <div className="w-2 h-10 bg-gradient-to-t from-purple-500 to-purple-500/20 rounded-full" />
                        <div className="w-2 h-6 bg-gradient-to-t from-cyan-500 to-cyan-500/20 rounded-full" />
                        <div className="w-2 h-12 bg-gradient-to-t from-purple-500 to-purple-500/20 rounded-full" />
                        <div className="w-2 h-7 bg-gradient-to-t from-cyan-500 to-cyan-500/20 rounded-full" />
                      </div>
                    </div>
                    
                    {/* Legs */}
                    <div className="absolute -bottom-20 left-4 w-3 h-20 bg-gradient-to-b from-zinc-700 to-zinc-900 rounded-sm" style={{ transform: 'translateZ(-10px)' }} />
                    <div className="absolute -bottom-20 right-4 w-3 h-20 bg-gradient-to-b from-zinc-700 to-zinc-900 rounded-sm" style={{ transform: 'translateZ(-10px)' }} />
                  </div>
                </div>
              </div>
              
              {/* View Controls */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                {(['front', 'top', 'side'] as const).map((view) => (
                  <button
                    key={view}
                    onClick={() => setActiveView(view)}
                    className={`px-4 py-2 text-xs tracking-wider uppercase transition-all ${
                      activeView === view 
                        ? 'bg-foreground text-background' 
                        : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                    }`}
                  >
                    {view}
                  </button>
                ))}
              </div>
              
              {/* Corner Accent */}
              <div className="absolute top-4 right-4 text-xs tracking-widest text-muted-foreground/60">
                ROTATE TO VIEW
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-8">
              <div className="space-y-4">
                <p className="text-xs tracking-[0.3em] text-muted-foreground uppercase">Performance Series</p>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extralight tracking-tight">
                  APEX<span className="text-muted-foreground">-1</span>
                </h1>
                <p className="text-lg text-muted-foreground font-light leading-relaxed max-w-md">
                  The definitive professional DJ console. Engineered for precision. Built for permanence.
                </p>
              </div>

              <div className="flex items-baseline gap-4">
                <span className="text-3xl font-light">$47,500</span>
                <span className="text-sm text-muted-foreground">USD</span>
              </div>

              <div className="space-y-4">
                <Button 
                  className="w-full py-6 text-sm tracking-widest uppercase bg-foreground text-background hover:bg-foreground/90"
                  onClick={() => window.location.href = '/allocation-checkout'}
                >
                  Request Allocation
                </Button>
                <p className="text-xs text-center text-muted-foreground">
                  12-16 week lead time • Invitation required
                </p>
              </div>

              {/* Quick Specs */}
              <div className="pt-8 border-t border-border/30">
                <div className="grid grid-cols-2 gap-4">
                  {specs.slice(0, 4).map((spec) => (
                    <div key={spec.label}>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">{spec.label}</p>
                      <p className="text-sm font-light mt-1">{spec.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Image Gallery */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs tracking-[0.3em] text-muted-foreground uppercase mb-4">Product Gallery</p>
            <h2 className="text-3xl md:text-4xl font-extralight tracking-tight">Every Angle, Every Detail</h2>
          </div>

          {/* Gallery Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {galleryImages.map((image, index) => (
              <button
                key={index}
                onClick={() => openLightbox(index)}
                className={`relative overflow-hidden group cursor-pointer ${
                  index === 0 ? 'col-span-2 row-span-2' : ''
                }`}
              >
                <div className={`relative ${index === 0 ? 'aspect-[4/3]' : 'aspect-square'}`}>
                  <img 
                    src={image.src} 
                    alt={image.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
                      <p className="text-xs tracking-[0.2em] text-muted-foreground uppercase mb-1">{image.title}</p>
                      <p className="text-sm text-foreground/80">{image.description}</p>
                    </div>
                  </div>
                  {/* Border */}
                  <div className="absolute inset-0 border border-border/30 group-hover:border-border/60 transition-colors" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <div 
          className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-xl flex items-center justify-center"
          onClick={() => setLightboxOpen(false)}
        >
          {/* Close Button */}
          <button 
            className="absolute top-6 right-6 p-3 text-muted-foreground hover:text-foreground transition-colors z-10"
            onClick={() => setLightboxOpen(false)}
          >
            <X className="w-6 h-6" />
          </button>

          {/* Navigation */}
          <button 
            className="absolute left-4 md:left-8 p-3 text-muted-foreground hover:text-foreground transition-colors z-10"
            onClick={(e) => { e.stopPropagation(); navigateLightbox('prev'); }}
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
          <button 
            className="absolute right-4 md:right-8 p-3 text-muted-foreground hover:text-foreground transition-colors z-10"
            onClick={(e) => { e.stopPropagation(); navigateLightbox('next'); }}
          >
            <ChevronRight className="w-8 h-8" />
          </button>

          {/* Image */}
          <div 
            className="max-w-5xl max-h-[80vh] mx-4 md:mx-16"
            onClick={(e) => e.stopPropagation()}
          >
            <img 
              src={galleryImages[lightboxIndex].src} 
              alt={galleryImages[lightboxIndex].title}
              className="max-w-full max-h-[70vh] object-contain mx-auto"
            />
            <div className="text-center mt-6">
              <p className="text-xs tracking-[0.3em] text-muted-foreground uppercase mb-2">
                {galleryImages[lightboxIndex].title}
              </p>
              <p className="text-sm text-muted-foreground">
                {galleryImages[lightboxIndex].description}
              </p>
              <p className="text-xs text-muted-foreground/60 mt-4">
                {lightboxIndex + 1} / {galleryImages.length}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Features Grid */}
      <section className="py-24 px-6 bg-muted/20 border-y border-border/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs tracking-[0.3em] text-muted-foreground uppercase mb-4">Engineering Excellence</p>
            <h2 className="text-3xl md:text-4xl font-extralight tracking-tight">Built Without Compromise</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="p-8 bg-background/50 border border-border/30 hover:border-border/60 transition-colors group"
              >
                <feature.icon className="w-8 h-8 text-muted-foreground group-hover:text-foreground transition-colors mb-6" />
                <h3 className="text-lg font-light mb-3">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Full Specifications */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs tracking-[0.3em] text-muted-foreground uppercase mb-4">Technical Data</p>
            <h2 className="text-3xl md:text-4xl font-extralight tracking-tight">Specifications</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-x-16 gap-y-6">
            {specs.map((spec) => (
              <div key={spec.label} className="flex justify-between items-center py-4 border-b border-border/30">
                <span className="text-sm text-muted-foreground">{spec.label}</span>
                <span className="text-sm font-light">{spec.value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 bg-gradient-to-b from-muted/30 to-background border-t border-border/30">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs tracking-[0.3em] text-muted-foreground uppercase mb-6">Limited Availability</p>
          <h2 className="text-3xl md:text-4xl font-extralight tracking-tight mb-6">
            Join the Waitlist
          </h2>
          <p className="text-muted-foreground mb-10 max-w-xl mx-auto">
            Production is limited to 50 units per year. Request an allocation to secure your position.
          </p>
          <Button 
            className="px-12 py-6 text-sm tracking-widest uppercase bg-foreground text-background hover:bg-foreground/90"
            onClick={() => window.location.href = '/allocation-checkout'}
          >
            Request Allocation
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-border/30">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-xs tracking-[0.2em] text-muted-foreground uppercase">
            LAVANDAR Tech • Performance Division
          </p>
          <p className="text-xs text-muted-foreground">
            © 2026 All Rights Reserved
          </p>
        </div>
      </footer>
    </div>
  );
};

export default DJTableShowcase;
