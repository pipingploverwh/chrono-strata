import { useState, useEffect, createContext, useContext } from 'react';

type Language = 'en' | 'ja';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<string, Record<Language, string>> = {
  // Navigation
  'nav.operationsConsole': { en: 'Operations Console', ja: 'オペレーションコンソール' },
  'nav.investorSummary': { en: 'Investor Summary', ja: '投資家サマリー' },
  'nav.strataInstrument': { en: 'STRATA Instrument', ja: 'STRATA計器' },
  'nav.locationSelect': { en: 'Location Select', ja: '観測地点選択' },
  'nav.aviation': { en: 'Aviation', ja: '航空' },
  'nav.marine': { en: 'Marine', ja: '海洋' },
  'nav.construction': { en: 'Construction', ja: '建設' },
  'nav.events': { en: 'Events', ja: 'イベント' },
  'nav.siteMap': { en: 'Site Map', ja: 'サイトマップ' },
  'nav.navigate': { en: 'Navigate', ja: 'ナビゲート' },
  'nav.commandCenters': { en: 'Command Centers', ja: 'コマンドセンター' },
  'nav.industryVerticals': { en: 'Industry Verticals', ja: '産業分野' },
  'nav.system': { en: 'System', ja: 'システム' },
  'nav.currentPage': { en: 'Current Page', ja: '現在のページ' },
  'nav.shibuya': { en: 'Shibuya Startup', ja: '渋谷スタートアップ' },
  
  // Common
  'common.learnMore': { en: 'Learn More', ja: '詳細を見る' },
  'common.contactUs': { en: 'Contact Us', ja: 'お問い合わせ' },
  'common.startNow': { en: 'Start Now', ja: '今すぐ開始' },

  // Piping Plover Dispensary
  'plover.storeName': { en: 'The Piping Plover', ja: 'パイピングプローバー' },
  'plover.tagline': { en: 'Where Cape Cod Meets Cannabis', ja: 'ケープコッドとカンナビスの出会い' },
  'plover.chatWithPiper': { en: 'Chat with Piper', ja: 'パイパーとチャット' },
  'plover.ourProducts': { en: 'Our Products', ja: '商品一覧' },
  'plover.pipersPicks': { en: "Piper's Picks", ja: 'パイパーのおすすめ' },
  'plover.pipersPicksDesc': { en: 'Our feathered friend\'s favorite strains', ja: '私たちの羽毛の友人のお気に入り' },
  'plover.readyToExplore': { en: 'Ready to explore?', ja: '探検の準備はできましたか？' },
  'plover.readyToExploreDesc': { en: 'Chat with Piper for personalized recommendations, or visit us in Wellfleet for the full experience.', ja: 'パーソナライズされたおすすめについてはパイパーとチャットするか、完全な体験のためにウェルフリートにお越しください。' },
  'plover.getDirections': { en: 'Get Directions', ja: 'アクセス' },
  'plover.viewFullMenu': { en: 'View Full Menu', ja: 'フルメニューを見る' },
  'plover.price': { en: 'Price', ja: '価格' },
  'plover.potency': { en: 'Potency', ja: '効能' },
  'plover.hours': { en: 'Open Daily 10am - 9pm', ja: '毎日営業 10時〜21時' },
  'plover.ageRequirement': { en: '21+ with valid ID', ja: '21歳以上・身分証明書必須' },
  
  // Age Gate
  'plover.ageGate.welcome': { en: 'Welcome to The Piping Plover', ja: 'パイピングプローバーへようこそ' },
  'plover.ageGate.description': { en: 'You must be 21 years of age or older to enter this site.', ja: 'このサイトに入るには21歳以上である必要があります。' },
  'plover.ageGate.confirm': { en: 'I am 21 or older', ja: '21歳以上です' },
  'plover.ageGate.exit': { en: 'Exit', ja: '退出' },
  'plover.ageGate.legal': { en: 'By entering this site, you confirm that you are of legal age to consume cannabis products in Massachusetts and agree to our terms of service.', ja: 'このサイトに入ることで、マサチューセッツ州でカンナビス製品を消費する法定年齢であることを確認し、利用規約に同意したことになります。' },

  // Chat
  'plover.chat.yourGuide': { en: 'Your Piping Plover Guide', ja: 'あなたのプローバーガイド' },
  'plover.chat.welcomeFlock': { en: 'Welcome to the flock!', ja: 'フロックへようこそ！' },
  'plover.chat.intro': { en: "I'm Piper, your friendly guide to The Piping Plover Dispensary. How can I help you today?", ja: '私はパイパーです。パイピングプローバー・ディスペンサリーのフレンドリーなガイドです。今日はどのようにお手伝いしましょうか？' },
  'plover.chat.placeholder': { en: 'Ask Piper anything...', ja: 'パイパーに何でも聞いてください...' },
  'plover.chat.thinking': { en: 'Piper is thinking...', ja: 'パイパーが考え中...' },
  'plover.chat.browseMenu': { en: 'Browse Menu', ja: 'メニューを見る' },
  'plover.chat.beginnerTips': { en: 'Beginner Tips', ja: '初心者向けヒント' },
  'plover.chat.bestValue': { en: 'Best Value', ja: 'ベストバリュー' },
  'plover.chat.storeHours': { en: 'Store Hours', ja: '営業時間' },

  // Product Categories
  'plover.product.prerolls': { en: 'Pre-Rolls', ja: 'プレロール' },
  'plover.product.prerollsDesc': { en: 'Premium singles to multi-packs, from classic flower to hash-infused', ja: 'クラシックフラワーからハッシュ入りまで、プレミアムシングルからマルチパックまで' },
  'plover.product.flower': { en: 'Flower', ja: 'フラワー' },
  'plover.product.flowerDesc': { en: "Premium buds, smalls, and shake from Cape Cod's finest cultivators", ja: 'ケープコッド最高の栽培者からのプレミアムバッズ、スモール、シェイク' },
  'plover.product.infused': { en: 'Infused', ja: 'インフューズド' },
  'plover.product.infusedDesc': { en: 'Hash and rosin-infused pre-rolls for elevated potency and flavor', ja: '高められた効能とフレーバーのためのハッシュとロジン入りプレロール' },
  'plover.product.valuePacks': { en: 'Value Packs', ja: 'バリューパック' },
  'plover.product.valuePacksDesc': { en: 'Multi-packs and shake options for the savvy shopper', ja: '賢い買い物客のためのマルチパックとシェイクオプション' },

  // Strain Types
  'plover.strain.hybrid': { en: 'Hybrid', ja: 'ハイブリッド' },
  'plover.strain.indica': { en: 'Indica', ja: 'インディカ' },
  'plover.strain.sativa': { en: 'Sativa', ja: 'サティバ' },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    // Fallback for components not wrapped in provider
    const [language, setLanguageState] = useState<Language>(() => {
      if (typeof window !== 'undefined') {
        return (localStorage.getItem('lavandar-language') as Language) || 'en';
      }
      return 'en';
    });

    const setLanguage = (lang: Language) => {
      setLanguageState(lang);
      localStorage.setItem('lavandar-language', lang);
    };

    const t = (key: string): string => {
      return translations[key]?.[language] || key;
    };

    return { language, setLanguage, t };
  }
  return context;
};

export const useLanguageState = () => {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('lavandar-language') as Language) || 'en';
    }
    return 'en';
  });

  useEffect(() => {
    const stored = localStorage.getItem('lavandar-language') as Language;
    if (stored && stored !== language) {
      setLanguageState(stored);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('lavandar-language', lang);
    // Dispatch custom event for other components to react
    window.dispatchEvent(new CustomEvent('language-change', { detail: lang }));
  };

  const t = (key: string): string => {
    return translations[key]?.[language] || key;
  };

  return { language, setLanguage, t };
};

export { LanguageContext, translations };
export type { Language, LanguageContextType };
