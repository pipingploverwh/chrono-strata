import { useState, useEffect, createContext, useContext } from 'react';

type Language = 'en' | 'ja' | 'it' | 'fr' | 'ar';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<string, Record<Language, string>> = {
  // Navigation
  'nav.operationsConsole': { 
    en: 'Operations Console', 
    ja: 'オペレーションコンソール',
    it: 'Console Operazioni',
    fr: 'Console Opérations',
    ar: 'وحدة التحكم'
  },
  'nav.investorSummary': { 
    en: 'Investor Summary', 
    ja: '投資家サマリー',
    it: 'Riepilogo Investitori',
    fr: 'Résumé Investisseurs',
    ar: 'ملخص المستثمر'
  },
  'nav.strataInstrument': { 
    en: 'STRATA Instrument', 
    ja: 'STRATA計器',
    it: 'Strumento STRATA',
    fr: 'Instrument STRATA',
    ar: 'أداة STRATA'
  },
  'nav.locationSelect': { 
    en: 'Location Select', 
    ja: '観測地点選択',
    it: 'Seleziona Posizione',
    fr: 'Sélection Lieu',
    ar: 'اختيار الموقع'
  },
  'nav.aviation': { 
    en: 'Aviation', 
    ja: '航空',
    it: 'Aviazione',
    fr: 'Aviation',
    ar: 'الطيران'
  },
  'nav.marine': { 
    en: 'Marine', 
    ja: '海洋',
    it: 'Marittimo',
    fr: 'Maritime',
    ar: 'البحرية'
  },
  'nav.construction': { 
    en: 'Construction', 
    ja: '建設',
    it: 'Costruzione',
    fr: 'Construction',
    ar: 'البناء'
  },
  'nav.events': { 
    en: 'Events', 
    ja: 'イベント',
    it: 'Eventi',
    fr: 'Événements',
    ar: 'الفعاليات'
  },
  'nav.siteMap': { 
    en: 'Site Map', 
    ja: 'サイトマップ',
    it: 'Mappa del Sito',
    fr: 'Plan du Site',
    ar: 'خريطة الموقع'
  },
  'nav.navigate': { 
    en: 'Navigate', 
    ja: 'ナビゲート',
    it: 'Naviga',
    fr: 'Naviguer',
    ar: 'التنقل'
  },
  'nav.commandCenters': { 
    en: 'Command Centers', 
    ja: 'コマンドセンター',
    it: 'Centri di Comando',
    fr: 'Centres de Commande',
    ar: 'مراكز القيادة'
  },
  'nav.industryVerticals': { 
    en: 'Industry Verticals', 
    ja: '産業分野',
    it: 'Settori Industriali',
    fr: 'Secteurs Industriels',
    ar: 'القطاعات الصناعية'
  },
  'nav.system': { 
    en: 'System', 
    ja: 'システム',
    it: 'Sistema',
    fr: 'Système',
    ar: 'النظام'
  },
  'nav.currentPage': { 
    en: 'Current Page', 
    ja: '現在のページ',
    it: 'Pagina Corrente',
    fr: 'Page Actuelle',
    ar: 'الصفحة الحالية'
  },
  'nav.shibuya': { 
    en: 'Shibuya Startup', 
    ja: '渋谷スタートアップ',
    it: 'Startup Shibuya',
    fr: 'Startup Shibuya',
    ar: 'شركة شيبويا الناشئة'
  },
  
  // Common
  'common.learnMore': { 
    en: 'Learn More', 
    ja: '詳細を見る',
    it: 'Scopri di Più',
    fr: 'En Savoir Plus',
    ar: 'اعرف المزيد'
  },
  'common.contactUs': { 
    en: 'Contact Us', 
    ja: 'お問い合わせ',
    it: 'Contattaci',
    fr: 'Contactez-nous',
    ar: 'اتصل بنا'
  },
  'common.startNow': { 
    en: 'Start Now', 
    ja: '今すぐ開始',
    it: 'Inizia Ora',
    fr: 'Commencer',
    ar: 'ابدأ الآن'
  },

  // Shop
  'shop.title': {
    en: 'STRATA Collection',
    ja: 'STRATAコレクション',
    it: 'Collezione STRATA',
    fr: 'Collection STRATA',
    ar: 'مجموعة STRATA'
  },
  'shop.subtitle': {
    en: 'Premium Weather Gear',
    ja: 'プレミアムウェザーギア',
    it: 'Attrezzatura Meteo Premium',
    fr: 'Équipement Météo Premium',
    ar: 'معدات الطقس الفاخرة'
  },
  'shop.preOrder': {
    en: 'Pre-Order',
    ja: '予約注文',
    it: 'Pre-Ordine',
    fr: 'Pré-commander',
    ar: 'الطلب المسبق'
  },
  'shop.limitedEdition': {
    en: 'Limited Edition',
    ja: '限定版',
    it: 'Edizione Limitata',
    fr: 'Édition Limitée',
    ar: 'إصدار محدود'
  },
  'shop.selectDesign': {
    en: 'Select Design',
    ja: 'デザインを選択',
    it: 'Seleziona Design',
    fr: 'Sélectionner le Design',
    ar: 'اختر التصميم'
  },

  // Piping Plover Dispensary
  'plover.storeName': { 
    en: 'The Piping Plover', 
    ja: 'パイピングプローバー',
    it: 'The Piping Plover',
    fr: 'The Piping Plover',
    ar: 'The Piping Plover'
  },
  'plover.tagline': { 
    en: 'Where Cape Cod Meets Cannabis', 
    ja: 'ケープコッドとカンナビスの出会い',
    it: 'Dove Cape Cod Incontra Cannabis',
    fr: 'Où Cape Cod Rencontre Cannabis',
    ar: 'حيث يلتقي كيب كود بالقنب'
  },
  'plover.chatWithPiper': { 
    en: 'Chat with Piper', 
    ja: 'パイパーとチャット',
    it: 'Chatta con Piper',
    fr: 'Discuter avec Piper',
    ar: 'تحدث مع بايبر'
  },
  'plover.ourProducts': { 
    en: 'Our Products', 
    ja: '商品一覧',
    it: 'I Nostri Prodotti',
    fr: 'Nos Produits',
    ar: 'منتجاتنا'
  },
  'plover.pipersPicks': { 
    en: "Piper's Picks", 
    ja: 'パイパーのおすすめ',
    it: 'Le Scelte di Piper',
    fr: 'Les Choix de Piper',
    ar: 'اختيارات بايبر'
  },
  'plover.pipersPicksDesc': { 
    en: 'Our feathered friend\'s favorite strains', 
    ja: '私たちの羽毛の友人のお気に入り',
    it: 'Le varietà preferite del nostro amico piumato',
    fr: 'Les variétés préférées de notre ami à plumes',
    ar: 'السلالات المفضلة لصديقنا ذو الريش'
  },
  'plover.readyToExplore': { 
    en: 'Ready to explore?', 
    ja: '探検の準備はできましたか？',
    it: 'Pronto per esplorare?',
    fr: 'Prêt à explorer?',
    ar: 'مستعد للاستكشاف؟'
  },
  'plover.readyToExploreDesc': { 
    en: 'Chat with Piper for personalized recommendations, or visit us in Wellfleet for the full experience.', 
    ja: 'パーソナライズされたおすすめについてはパイパーとチャットするか、完全な体験のためにウェルフリートにお越しください。',
    it: 'Chatta con Piper per consigli personalizzati, o visitaci a Wellfleet per l\'esperienza completa.',
    fr: 'Discutez avec Piper pour des recommandations personnalisées, ou visitez-nous à Wellfleet.',
    ar: 'تحدث مع بايبر للحصول على توصيات مخصصة، أو قم بزيارتنا في ويلفليت.'
  },
  'plover.getDirections': { 
    en: 'Get Directions', 
    ja: 'アクセス',
    it: 'Indicazioni',
    fr: 'Itinéraire',
    ar: 'الحصول على الاتجاهات'
  },
  'plover.viewFullMenu': { 
    en: 'View Full Menu', 
    ja: 'フルメニューを見る',
    it: 'Menu Completo',
    fr: 'Menu Complet',
    ar: 'عرض القائمة الكاملة'
  },
  'plover.price': { 
    en: 'Price', 
    ja: '価格',
    it: 'Prezzo',
    fr: 'Prix',
    ar: 'السعر'
  },
  'plover.potency': { 
    en: 'Potency', 
    ja: '効能',
    it: 'Potenza',
    fr: 'Puissance',
    ar: 'الفعالية'
  },
  'plover.hours': { 
    en: 'Open Daily 10am - 9pm', 
    ja: '毎日営業 10時〜21時',
    it: 'Aperto Tutti i Giorni 10-21',
    fr: 'Ouvert Tous les Jours 10h-21h',
    ar: 'مفتوح يومياً 10 صباحاً - 9 مساءً'
  },
  'plover.ageRequirement': { 
    en: '21+ with valid ID', 
    ja: '21歳以上・身分証明書必須',
    it: '21+ con documento valido',
    fr: '21+ avec pièce d\'identité',
    ar: '21+ مع هوية صالحة'
  },
  
  // Age Gate
  'plover.ageGate.welcome': { 
    en: 'Welcome to The Piping Plover', 
    ja: 'パイピングプローバーへようこそ',
    it: 'Benvenuto a The Piping Plover',
    fr: 'Bienvenue à The Piping Plover',
    ar: 'مرحباً بك في The Piping Plover'
  },
  'plover.ageGate.description': { 
    en: 'You must be 21 years of age or older to enter this site.', 
    ja: 'このサイトに入るには21歳以上である必要があります。',
    it: 'Devi avere 21 anni o più per entrare.',
    fr: 'Vous devez avoir 21 ans ou plus pour entrer.',
    ar: 'يجب أن يكون عمرك 21 عاماً أو أكثر للدخول.'
  },
  'plover.ageGate.confirm': { 
    en: 'I am 21 or older', 
    ja: '21歳以上です',
    it: 'Ho 21 anni o più',
    fr: 'J\'ai 21 ans ou plus',
    ar: 'أنا 21 سنة أو أكثر'
  },
  'plover.ageGate.exit': { 
    en: 'Exit', 
    ja: '退出',
    it: 'Esci',
    fr: 'Quitter',
    ar: 'خروج'
  },
  'plover.ageGate.legal': { 
    en: 'By entering this site, you confirm that you are of legal age to consume cannabis products in Massachusetts and agree to our terms of service.', 
    ja: 'このサイトに入ることで、マサチューセッツ州でカンナビス製品を消費する法定年齢であることを確認し、利用規約に同意したことになります。',
    it: 'Entrando in questo sito, confermi di avere l\'età legale per consumare prodotti cannabis in Massachusetts.',
    fr: 'En entrant sur ce site, vous confirmez avoir l\'âge légal pour consommer des produits cannabis au Massachusetts.',
    ar: 'بدخولك هذا الموقع، تؤكد أنك في السن القانوني لاستهلاك منتجات القنب في ماساتشوستس.'
  },

  // Chat
  'plover.chat.yourGuide': { 
    en: 'Your Piping Plover Guide', 
    ja: 'あなたのプローバーガイド',
    it: 'La Tua Guida Piping Plover',
    fr: 'Votre Guide Piping Plover',
    ar: 'دليلك Piping Plover'
  },
  'plover.chat.welcomeFlock': { 
    en: 'Welcome to the flock!', 
    ja: 'フロックへようこそ！',
    it: 'Benvenuto nel gruppo!',
    fr: 'Bienvenue dans le groupe!',
    ar: 'مرحباً بك في المجموعة!'
  },
  'plover.chat.intro': { 
    en: "I'm Piper, your friendly guide to The Piping Plover Dispensary. How can I help you today?", 
    ja: '私はパイパーです。パイピングプローバー・ディスペンサリーのフレンドリーなガイドです。今日はどのようにお手伝いしましょうか？',
    it: 'Sono Piper, la tua guida amichevole. Come posso aiutarti oggi?',
    fr: 'Je suis Piper, votre guide amical. Comment puis-je vous aider?',
    ar: 'أنا بايبر، دليلك الودود. كيف يمكنني مساعدتك اليوم؟'
  },
  'plover.chat.placeholder': { 
    en: 'Ask Piper anything...', 
    ja: 'パイパーに何でも聞いてください...',
    it: 'Chiedi a Piper...',
    fr: 'Demandez à Piper...',
    ar: 'اسأل بايبر أي شيء...'
  },
  'plover.chat.thinking': { 
    en: 'Piper is thinking...', 
    ja: 'パイパーが考え中...',
    it: 'Piper sta pensando...',
    fr: 'Piper réfléchit...',
    ar: 'بايبر يفكر...'
  },
  'plover.chat.browseMenu': { 
    en: 'Browse Menu', 
    ja: 'メニューを見る',
    it: 'Sfoglia Menu',
    fr: 'Parcourir le Menu',
    ar: 'تصفح القائمة'
  },
  'plover.chat.beginnerTips': { 
    en: 'Beginner Tips', 
    ja: '初心者向けヒント',
    it: 'Consigli per Principianti',
    fr: 'Conseils Débutants',
    ar: 'نصائح للمبتدئين'
  },
  'plover.chat.bestValue': { 
    en: 'Best Value', 
    ja: 'ベストバリュー',
    it: 'Miglior Rapporto Qualità-Prezzo',
    fr: 'Meilleur Rapport Qualité-Prix',
    ar: 'أفضل قيمة'
  },
  'plover.chat.storeHours': { 
    en: 'Store Hours', 
    ja: '営業時間',
    it: 'Orari del Negozio',
    fr: 'Heures d\'Ouverture',
    ar: 'ساعات العمل'
  },

  // Product Categories
  'plover.product.prerolls': { 
    en: 'Pre-Rolls', 
    ja: 'プレロール',
    it: 'Pre-Rollati',
    fr: 'Pré-Roulés',
    ar: 'ملفوفات جاهزة'
  },
  'plover.product.prerollsDesc': { 
    en: 'Premium singles to multi-packs, from classic flower to hash-infused', 
    ja: 'クラシックフラワーからハッシュ入りまで、プレミアムシングルからマルチパックまで',
    it: 'Da singoli premium a multipacchi, dal fiore classico all\'hash',
    fr: 'Des singles premium aux multipacks, de la fleur classique au hasch',
    ar: 'من القطع الفردية الممتازة إلى العبوات المتعددة'
  },
  'plover.product.flower': { 
    en: 'Flower', 
    ja: 'フラワー',
    it: 'Fiore',
    fr: 'Fleur',
    ar: 'زهرة'
  },
  'plover.product.flowerDesc': { 
    en: "Premium buds, smalls, and shake from Cape Cod's finest cultivators", 
    ja: 'ケープコッド最高の栽培者からのプレミアムバッズ、スモール、シェイク',
    it: 'Boccioli premium dai migliori coltivatori di Cape Cod',
    fr: 'Bourgeons premium des meilleurs cultivateurs de Cape Cod',
    ar: 'براعم ممتازة من أفضل مزارعي كيب كود'
  },
  'plover.product.infused': { 
    en: 'Infused', 
    ja: 'インフューズド',
    it: 'Infusi',
    fr: 'Infusés',
    ar: 'مشبع'
  },
  'plover.product.infusedDesc': { 
    en: 'Hash and rosin-infused pre-rolls for elevated potency and flavor', 
    ja: '高められた効能とフレーバーのためのハッシュとロジン入りプレロール',
    it: 'Pre-rollati infusi con hash e rosin per potenza elevata',
    fr: 'Pré-roulés infusés au hasch et rosin pour une puissance élevée',
    ar: 'ملفوفات مشبعة بالحشيش للفعالية المرتفعة'
  },
  'plover.product.valuePacks': { 
    en: 'Value Packs', 
    ja: 'バリューパック',
    it: 'Pacchetti Valore',
    fr: 'Packs Valeur',
    ar: 'عبوات القيمة'
  },
  'plover.product.valuePacksDesc': { 
    en: 'Multi-packs and shake options for the savvy shopper', 
    ja: '賢い買い物客のためのマルチパックとシェイクオプション',
    it: 'Multipacchi e opzioni shake per acquirenti intelligenti',
    fr: 'Multipacks et options shake pour acheteurs avisés',
    ar: 'عبوات متعددة وخيارات للمتسوق الذكي'
  },

  // Strain Types
  'plover.strain.hybrid': { 
    en: 'Hybrid', 
    ja: 'ハイブリッド',
    it: 'Ibrido',
    fr: 'Hybride',
    ar: 'هجين'
  },
  'plover.strain.indica': { 
    en: 'Indica', 
    ja: 'インディカ',
    it: 'Indica',
    fr: 'Indica',
    ar: 'إنديكا'
  },
  'plover.strain.sativa': { 
    en: 'Sativa', 
    ja: 'サティバ',
    it: 'Sativa',
    fr: 'Sativa',
    ar: 'ساتيفا'
  },
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
