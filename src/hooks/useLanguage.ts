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

  // Shop - Equipment Lab
  'shop.labHeader': {
    en: 'Equipment Lab / Store Protocol',
    ja: '装備ラボ / ストアプロトコル',
    it: 'Laboratorio Equipaggiamento / Protocollo Negozio',
    fr: 'Laboratoire Équipement / Protocole Boutique',
    ar: 'مختبر المعدات / بروتوكول المتجر'
  },
  'shop.terrainMapped': {
    en: 'Terrain-Mapped Protocol',
    ja: '地形マッピングプロトコル',
    it: 'Protocollo Mappatura Terreno',
    fr: 'Protocole Cartographie Terrain',
    ar: 'بروتوكول الخرائط الطبوغرافية'
  },
  'shop.ownership': {
    en: 'STRATA OWNERSHIP',
    ja: 'STRATA オーナーシップ',
    it: 'PROPRIETÀ STRATA',
    fr: 'PROPRIÉTÉ STRATA',
    ar: 'ملكية STRATA'
  },
  'shop.centuryProtocol': {
    en: 'Century Protocol — 100 Years of Ownership',
    ja: 'センチュリープロトコル — 100年の所有権',
    it: 'Protocollo Centenario — 100 Anni di Proprietà',
    fr: 'Protocole Centenaire — 100 Ans de Propriété',
    ar: 'بروتوكول القرن — 100 عام من الملكية'
  },
  'shop.centuryHeader': {
    en: 'Century Protocol',
    ja: 'センチュリープロトコル',
    it: 'Protocollo Centenario',
    fr: 'Protocole Centenaire',
    ar: 'بروتوكول القرن'
  },
  'shop.notLimitedRun': {
    en: 'This is not a limited run. This is the start of',
    ja: 'これは限定版ではありません。これは',
    it: 'Questa non è un\'edizione limitata. È l\'inizio di',
    fr: 'Ce n\'est pas une édition limitée. C\'est le début de',
    ar: 'هذا ليس إصداراً محدوداً. هذه بداية'
  },
  'shop.yearsOwnership': {
    en: '100 years',
    ja: '100年間',
    it: '100 anni',
    fr: '100 ans',
    ar: '100 عام'
  },
  'shop.ofOwnership': {
    en: 'of ownership.',
    ja: 'の所有権の始まりです。',
    it: 'di proprietà.',
    fr: 'de propriété.',
    ar: 'من الملكية.'
  },
  'shop.selectOwnershipMode': {
    en: 'Select Ownership Mode',
    ja: '所有モードを選択',
    it: 'Seleziona Modalità Proprietà',
    fr: 'Sélectionner Mode de Propriété',
    ar: 'اختر وضع الملكية'
  },
  'shop.annual': {
    en: 'Annual',
    ja: '年間',
    it: 'Annuale',
    fr: 'Annuel',
    ar: 'سنوي'
  },
  'shop.perYear': {
    en: '/year',
    ja: '/年',
    it: '/anno',
    fr: '/an',
    ar: '/سنة'
  },
  'shop.postFirstYear': {
    en: 'Post-first-year billing',
    ja: '初年度以降の請求',
    it: 'Fatturazione post-primo anno',
    fr: 'Facturation après première année',
    ar: 'الفوترة بعد السنة الأولى'
  },
  'shop.strataBond': {
    en: 'STRATA Bond',
    ja: 'STRATAボンド',
    it: 'Obbligazione STRATA',
    fr: 'Obligation STRATA',
    ar: 'سند STRATA'
  },
  'shop.legacy': {
    en: 'LEGACY',
    ja: 'レガシー',
    it: 'EREDITÀ',
    fr: 'HÉRITAGE',
    ar: 'إرث'
  },
  'shop.oneTime': {
    en: 'one-time',
    ja: '一括払い',
    it: 'una tantum',
    fr: 'unique',
    ar: 'دفعة واحدة'
  },
  'shop.savingsVsAnnual': {
    en: 'Save $5,100 vs annual • 100 years prepaid',
    ja: '年間比$5,100節約 • 100年分前払い',
    it: 'Risparmia $5.100 vs annuale • 100 anni prepagati',
    fr: 'Économisez $5 100 vs annuel • 100 ans prépayés',
    ar: 'وفر 5,100$ مقارنة بالسنوي • 100 عام مدفوعة مسبقاً'
  },
  'shop.transferable': {
    en: 'Transferable to children & heirs',
    ja: '子供や相続人に譲渡可能',
    it: 'Trasferibile a figli ed eredi',
    fr: 'Transférable aux enfants et héritiers',
    ar: 'قابل للتحويل للأطفال والورثة'
  },
  'shop.selectTerrain': {
    en: 'Select Strata Terrain',
    ja: 'Strataテレインを選択',
    it: 'Seleziona Terreno Strata',
    fr: 'Sélectionner Terrain Strata',
    ar: 'اختر تضاريس Strata'
  },
  'shop.selectedTerrainMap': {
    en: 'Selected Terrain Map',
    ja: '選択されたテレインマップ',
    it: 'Mappa Terreno Selezionata',
    fr: 'Carte Terrain Sélectionnée',
    ar: 'خريطة التضاريس المختارة'
  },
  'shop.techSpecs': {
    en: 'Technical Specifications',
    ja: '技術仕様',
    it: 'Specifiche Tecniche',
    fr: 'Spécifications Techniques',
    ar: 'المواصفات التقنية'
  },
  'shop.activateTerrain': {
    en: 'Activate',
    ja: 'アクティベート',
    it: 'Attiva',
    fr: 'Activer',
    ar: 'تفعيل'
  },
  'shop.secureBond': {
    en: 'Secure STRATA Bond',
    ja: 'STRATAボンドを確保',
    it: 'Assicura Obbligazione STRATA',
    fr: 'Sécuriser Obligation STRATA',
    ar: 'تأمين سند STRATA'
  },
  'shop.initiating': {
    en: 'Initiating Protocol...',
    ja: 'プロトコル開始中...',
    it: 'Inizializzazione Protocollo...',
    fr: 'Initialisation Protocole...',
    ar: 'بدء البروتوكول...'
  },
  'shop.secure': {
    en: 'Secure',
    ja: 'セキュア',
    it: 'Sicuro',
    fr: 'Sécurisé',
    ar: 'آمن'
  },
  'shop.100YearLegacy': {
    en: '100-Year Legacy',
    ja: '100年のレガシー',
    it: 'Eredità 100 Anni',
    fr: 'Héritage 100 Ans',
    ar: 'إرث 100 عام'
  },
  'shop.generational': {
    en: 'Generational',
    ja: '世代間',
    it: 'Generazionale',
    fr: 'Générationnel',
    ar: 'جيلي'
  },
  'shop.equipmentLab': {
    en: 'Equipment Lab',
    ja: '装備ラボ',
    it: 'Laboratorio Equipaggiamento',
    fr: 'Laboratoire Équipement',
    ar: 'مختبر المعدات'
  },
  'shop.protocolVersion': {
    en: 'Protocol v2.1',
    ja: 'プロトコル v2.1',
    it: 'Protocollo v2.1',
    fr: 'Protocole v2.1',
    ar: 'البروتوكول v2.1'
  },
  'shop.tagline': {
    en: 'A Century of Ownership. Generational Access.',
    ja: '100年の所有権。世代を超えたアクセス。',
    it: 'Un Secolo di Proprietà. Accesso Generazionale.',
    fr: 'Un Siècle de Propriété. Accès Générationnel.',
    ar: 'قرن من الملكية. وصول جيلي.'
  },
  'shop.description': {
    en: 'Vulcanized hydrophobic shell with embedded chronometer display and terrain-mapped HUD. This is not a limited run — it is the beginning of a 100-year ownership lineage.',
    ja: '埋め込みクロノメーターディスプレイと地形マッピングHUDを備えた加硫疎水性シェル。これは限定版ではありません — 100年間の所有権系譜の始まりです。',
    it: 'Guscio idrofobico vulcanizzato con display cronometro integrato e HUD mappato sul terreno. Non è un\'edizione limitata — è l\'inizio di 100 anni di proprietà.',
    fr: 'Coque hydrophobe vulcanisée avec affichage chronomètre intégré et HUD cartographié. Ce n\'est pas une édition limitée — c\'est le début de 100 ans de propriété.',
    ar: 'غلاف مقاوم للماء مع شاشة كرونومتر مدمجة وواجهة HUD خرائطية. هذا ليس إصداراً محدوداً — إنه بداية 100 عام من الملكية.'
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
