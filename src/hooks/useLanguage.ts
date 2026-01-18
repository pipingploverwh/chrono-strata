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
