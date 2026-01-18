import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Shield, 
  Navigation2, 
  AlertTriangle, 
  Waves, 
  Wind, 
  Radio,
  Compass,
  Activity,
  Globe,
  Building2,
  ChevronRight,
  ExternalLink,
  MapPin,
  Zap,
  CheckCircle2,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import LanguageToggle from "@/components/LanguageToggle";
import { useLanguageState } from "@/hooks/useLanguage";

type Language = 'en' | 'ja';

const content: Record<Language, {
  hero: {
    badge: string;
    title: string;
    subtitle: string;
    description: string;
    cta1: string;
    cta2: string;
  };
  capabilities: {
    title: string;
    subtitle: string;
    items: Array<{
      icon: string;
      title: string;
      description: string;
      features: string[];
    }>;
  };
  useCases: {
    title: string;
    items: Array<{
      title: string;
      description: string;
    }>;
  };
  shibuya: {
    title: string;
    description: string;
    benefits: string[];
  };
  cta: {
    title: string;
    description: string;
    button: string;
  };
  footer: {
    contact: string;
    platform: string;
  };
}> = {
  en: {
    hero: {
      badge: "Shibuya Startup Welcome Service",
      title: "Weather Intelligence for Global Resilience",
      subtitle: "Emergency Response • Autonomous Navigation • Deep-Tech Innovation",
      description: "Lavandar provides AI-powered atmospheric intelligence that enables safer operations across aviation, maritime, construction, and emergency response sectors. Our predictive models achieve 94% accuracy in weather pattern forecasting.",
      cta1: "Explore Platform",
      cta2: "Contact Us"
    },
    capabilities: {
      title: "Core Capabilities",
      subtitle: "Deep-tech solutions for mission-critical weather intelligence",
      items: [
        {
          icon: "shield",
          title: "Emergency Response Intelligence",
          description: "Real-time weather monitoring and predictive alerts for emergency management operations. Enable faster response times and safer evacuation routes.",
          features: [
            "72-hour predictive forecasting",
            "Multi-agency coordination dashboard",
            "Automated alert distribution",
            "Risk zone mapping"
          ]
        },
        {
          icon: "navigation",
          title: "Autonomous Navigation Systems",
          description: "Weather-aware routing algorithms for autonomous vehicles, drones, and maritime vessels. Optimize paths based on atmospheric conditions.",
          features: [
            "Real-time route optimization",
            "Wind shear detection",
            "Visibility predictions",
            "Collision avoidance integration"
          ]
        },
        {
          icon: "waves",
          title: "Maritime Operations",
          description: "Comprehensive marine weather intelligence for shipping, port operations, and offshore activities. Reduce downtime and enhance safety.",
          features: [
            "Wave height predictions",
            "Port weather monitoring",
            "Offshore platform support",
            "NOAA data integration"
          ]
        },
        {
          icon: "wind",
          title: "Aviation Weather Services",
          description: "Pilot-focused weather briefings and airport condition monitoring. Support safe flight operations with accurate atmospheric data.",
          features: [
            "Flight path analysis",
            "Turbulence forecasting",
            "Airport condition alerts",
            "Cross-wind calculations"
          ]
        }
      ]
    },
    useCases: {
      title: "Target Applications",
      items: [
        {
          title: "Disaster Preparedness",
          description: "Enable government agencies and emergency services to prepare for extreme weather events with 72-hour advance predictions."
        },
        {
          title: "Smart City Integration",
          description: "Connect with urban infrastructure systems to optimize traffic, public transit, and city services based on weather conditions."
        },
        {
          title: "Autonomous Vehicle Operations",
          description: "Provide weather intelligence APIs for self-driving vehicles, delivery drones, and robotic systems."
        },
        {
          title: "Critical Infrastructure Protection",
          description: "Monitor weather impacts on power grids, telecommunications, and transportation networks."
        }
      ]
    },
    shibuya: {
      title: "Why Shibuya?",
      description: "Shibuya City's commitment to innovation and deep-tech startups aligns perfectly with Lavandar's mission to build scalable, globally-impactful weather intelligence technology.",
      benefits: [
        "Access to Japan's technology ecosystem",
        "Partnership opportunities with enterprise clients",
        "Strategic location for Asia-Pacific expansion",
        "Support from Shibuya's startup programs"
      ]
    },
    cta: {
      title: "Ready to Transform Weather Intelligence?",
      description: "Join the next generation of atmospheric data analysis. Contact us to discuss how Lavandar can support your operations.",
      button: "Schedule a Demo"
    },
    footer: {
      contact: "Contact: admin@lavandar.ai",
      platform: "View Full Platform"
    }
  },
  ja: {
    hero: {
      badge: "渋谷スタートアップ・ウェルカム・サービス",
      title: "グローバルレジリエンスのための気象インテリジェンス",
      subtitle: "緊急対応 • 自律航法 • ディープテック・イノベーション",
      description: "Lavandarは、航空、海事、建設、緊急対応セクター全体でより安全な運用を可能にするAI駆動の大気インテリジェンスを提供します。当社の予測モデルは、気象パターン予測で94%の精度を達成しています。",
      cta1: "プラットフォームを探索",
      cta2: "お問い合わせ"
    },
    capabilities: {
      title: "コア機能",
      subtitle: "ミッションクリティカルな気象インテリジェンスのためのディープテックソリューション",
      items: [
        {
          icon: "shield",
          title: "緊急対応インテリジェンス",
          description: "緊急管理運用のためのリアルタイム気象監視と予測アラート。より迅速な対応時間と安全な避難経路を実現します。",
          features: [
            "72時間予測予報",
            "多機関連携ダッシュボード",
            "自動アラート配信",
            "リスクゾーンマッピング"
          ]
        },
        {
          icon: "navigation",
          title: "自律航法システム",
          description: "自律走行車、ドローン、海上船舶のための気象対応ルーティングアルゴリズム。大気条件に基づいて経路を最適化します。",
          features: [
            "リアルタイム経路最適化",
            "ウィンドシア検出",
            "視程予測",
            "衝突回避統合"
          ]
        },
        {
          icon: "waves",
          title: "海上運用",
          description: "海運、港湾運営、沖合活動のための包括的な海洋気象インテリジェンス。ダウンタイムを削減し、安全性を向上させます。",
          features: [
            "波高予測",
            "港湾気象監視",
            "洋上プラットフォームサポート",
            "NOAAデータ統合"
          ]
        },
        {
          icon: "wind",
          title: "航空気象サービス",
          description: "パイロット向け気象ブリーフィングと空港状況監視。正確な大気データで安全な飛行運用をサポートします。",
          features: [
            "飛行経路分析",
            "乱気流予報",
            "空港状況アラート",
            "横風計算"
          ]
        }
      ]
    },
    useCases: {
      title: "ターゲットアプリケーション",
      items: [
        {
          title: "災害対策",
          description: "政府機関と緊急サービスが72時間前の予測で極端な気象イベントに備えることを可能にします。"
        },
        {
          title: "スマートシティ統合",
          description: "都市インフラシステムと連携し、気象条件に基づいて交通、公共交通機関、都市サービスを最適化します。"
        },
        {
          title: "自律走行車運用",
          description: "自動運転車、配送ドローン、ロボットシステムに気象インテリジェンスAPIを提供します。"
        },
        {
          title: "重要インフラ保護",
          description: "電力網、通信、輸送ネットワークへの気象影響を監視します。"
        }
      ]
    },
    shibuya: {
      title: "なぜ渋谷なのか？",
      description: "渋谷区のイノベーションとディープテック・スタートアップへのコミットメントは、スケーラブルでグローバルにインパクトのある気象インテリジェンス技術を構築するというLavandarのミッションと完全に一致しています。",
      benefits: [
        "日本のテクノロジーエコシステムへのアクセス",
        "エンタープライズクライアントとのパートナーシップ機会",
        "アジア太平洋拡大のための戦略的位置",
        "渋谷のスタートアッププログラムからのサポート"
      ]
    },
    cta: {
      title: "気象インテリジェンスを変革する準備はできていますか？",
      description: "次世代の大気データ分析に参加してください。Lavandarがお客様の運用をどのようにサポートできるか、ぜひご相談ください。",
      button: "デモをスケジュール"
    },
    footer: {
      contact: "連絡先: admin@lavandar.ai",
      platform: "フルプラットフォームを表示"
    }
  }
};

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  shield: Shield,
  navigation: Navigation2,
  waves: Waves,
  wind: Wind
};

const ShibuyaStartup = () => {
  const { language } = useLanguageState();
  const [currentLang, setCurrentLang] = useState<Language>('en');
  
  useEffect(() => {
    setCurrentLang(language as Language);
    
    const handleLanguageChange = (e: CustomEvent) => {
      setCurrentLang(e.detail as Language);
    };
    
    window.addEventListener('language-change', handleLanguageChange as EventListener);
    return () => window.removeEventListener('language-change', handleLanguageChange as EventListener);
  }, [language]);

  const t = content[currentLang];

  return (
    <div className="min-h-screen bg-gradient-to-b from-strata-black via-strata-charcoal to-strata-black">
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-strata-black/80 backdrop-blur-md border-b border-strata-steel/20">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-strata-orange to-amber-500 flex items-center justify-center">
              <Compass className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="font-instrument text-xl text-strata-white tracking-wide">Lavandar</div>
              <div className="text-[10px] font-mono text-strata-silver/60 uppercase tracking-widest">Weather Intelligence</div>
            </div>
          </Link>
          
          <div className="flex items-center gap-4">
            <LanguageToggle />
            <Link to="/">
              <Button variant="outline" size="sm" className="border-strata-steel/30 text-strata-silver hover:text-strata-white hover:bg-strata-steel/30">
                <Globe className="w-4 h-4 mr-2" />
                {t.footer.platform}
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <Badge className="mb-6 bg-gradient-to-r from-red-500/20 to-strata-orange/20 border-red-500/30 text-red-400 px-4 py-2">
            <MapPin className="w-4 h-4 mr-2" />
            {t.hero.badge}
          </Badge>
          
          <h1 className="font-instrument text-5xl md:text-6xl lg:text-7xl text-strata-white mb-6 leading-tight">
            {t.hero.title}
          </h1>
          
          <p className="text-xl md:text-2xl text-strata-orange font-medium mb-6">
            {t.hero.subtitle}
          </p>
          
          <p className="text-lg text-strata-silver max-w-3xl mx-auto mb-10 leading-relaxed">
            {t.hero.description}
          </p>
          
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link to="/strata">
              <Button size="lg" className="bg-gradient-to-r from-strata-orange to-amber-500 hover:from-strata-orange/90 hover:to-amber-500/90 text-white gap-2">
                {t.hero.cta1}
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <a href="mailto:admin@lavandar.ai">
              <Button size="lg" variant="outline" className="border-strata-steel/50 text-strata-silver hover:text-strata-white hover:bg-strata-steel/30 gap-2">
                {t.hero.cta2}
                <ExternalLink className="w-4 h-4" />
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Capabilities Section */}
      <section className="py-20 px-6 bg-strata-charcoal/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-instrument text-4xl text-strata-white mb-4">{t.capabilities.title}</h2>
            <p className="text-strata-silver text-lg">{t.capabilities.subtitle}</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {t.capabilities.items.map((item, index) => {
              const IconComponent = iconMap[item.icon];
              return (
                <Card key={index} className="bg-strata-black/50 border-strata-steel/30 hover:border-strata-orange/30 transition-all">
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-strata-orange/20 to-amber-500/10 flex items-center justify-center">
                        <IconComponent className="w-7 h-7 text-strata-orange" />
                      </div>
                      <div>
                        <CardTitle className="text-xl text-strata-white mb-2">{item.title}</CardTitle>
                        <p className="text-strata-silver text-sm">{item.description}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {item.features.map((feature, fIndex) => (
                        <li key={fIndex} className="flex items-center gap-2 text-sm text-strata-silver/80">
                          <CheckCircle2 className="w-4 h-4 text-strata-cyan" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-instrument text-4xl text-strata-white mb-12 text-center">{t.useCases.title}</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {t.useCases.items.map((item, index) => (
              <div key={index} className="p-6 rounded-xl bg-gradient-to-br from-strata-steel/20 to-transparent border border-strata-steel/20 hover:border-strata-cyan/30 transition-all">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-strata-cyan/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <Zap className="w-4 h-4 text-strata-cyan" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-strata-white mb-2">{item.title}</h3>
                    <p className="text-sm text-strata-silver/80">{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Shibuya Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-red-500/10 via-strata-charcoal/50 to-strata-orange/10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-white/5 border border-white/10">
            <Building2 className="w-5 h-5 text-red-400" />
            <span className="text-sm font-medium text-strata-silver">渋谷区 Shibuya City</span>
          </div>
          
          <h2 className="font-instrument text-4xl text-strata-white mb-6">{t.shibuya.title}</h2>
          <p className="text-lg text-strata-silver mb-10 max-w-2xl mx-auto">{t.shibuya.description}</p>
          
          <div className="grid sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
            {t.shibuya.benefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-3 p-4 rounded-lg bg-white/5 text-left">
                <CheckCircle2 className="w-5 h-5 text-strata-orange flex-shrink-0" />
                <span className="text-sm text-strata-silver">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-instrument text-4xl text-strata-white mb-4">{t.cta.title}</h2>
          <p className="text-lg text-strata-silver mb-8">{t.cta.description}</p>
          
          <a href="mailto:admin@lavandar.ai?subject=Shibuya%20Startup%20-%20Demo%20Request">
            <Button size="lg" className="bg-gradient-to-r from-strata-orange to-amber-500 hover:from-strata-orange/90 hover:to-amber-500/90 text-white gap-2">
              {t.cta.button}
              <ChevronRight className="w-5 h-5" />
            </Button>
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-strata-steel/20">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <p className="text-sm text-strata-silver">{t.footer.contact}</p>
            <Link to="/" className="text-sm text-strata-orange hover:text-amber-400 transition-colors flex items-center gap-1">
              {t.footer.platform}
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-xs text-strata-silver/50">© 2026 Lavandar AI</span>
            <LanguageToggle variant="compact" />
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ShibuyaStartup;
