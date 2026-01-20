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

  // Strata Zone Names
  'zone.default': {
    en: 'Default',
    ja: 'デフォルト',
    it: 'Predefinito',
    fr: 'Par Défaut',
    ar: 'افتراضي'
  },
  'zone.pacificMarine': {
    en: 'Pacific Marine',
    ja: '太平洋海洋',
    it: 'Pacifico Marittimo',
    fr: 'Pacifique Maritime',
    ar: 'المحيط الهادئ البحري'
  },
  'zone.tromsoArctic': {
    en: 'Tromsø Arctic',
    ja: 'トロムソ北極圏',
    it: 'Tromsø Artico',
    fr: 'Tromsø Arctique',
    ar: 'ترومسو القطبية'
  },
  'zone.saharaInterior': {
    en: 'Sahara Interior',
    ja: 'サハラ内陸部',
    it: 'Sahara Interno',
    fr: 'Sahara Intérieur',
    ar: 'الصحراء الداخلية'
  },
  'zone.tokyoMetropolis': {
    en: 'Tokyo Metropolis',
    ja: '東京都心',
    it: 'Tokyo Metropoli',
    fr: 'Tokyo Métropole',
    ar: 'مدينة طوكيو'
  },

  // Technical Specifications
  'spec.membrane': {
    en: 'MEMBRANE',
    ja: 'メンブレン',
    it: 'MEMBRANA',
    fr: 'MEMBRANE',
    ar: 'غشاء'
  },
  'spec.membrane.value': {
    en: 'PU/TPU Hybrid',
    ja: 'PU/TPU ハイブリッド',
    it: 'Ibrido PU/TPU',
    fr: 'Hybride PU/TPU',
    ar: 'هجين PU/TPU'
  },
  'spec.membrane.desc': {
    en: 'Vulcanized barrier film',
    ja: '加硫バリアフィルム',
    it: 'Film barriera vulcanizzato',
    fr: 'Film barrière vulcanisé',
    ar: 'فيلم حاجز مبركن'
  },
  'spec.hydrostatic': {
    en: 'HYDROSTATIC',
    ja: '耐水圧',
    it: 'IDROSTATICO',
    fr: 'HYDROSTATIQUE',
    ar: 'هيدروستاتيكي'
  },
  'spec.hydrostatic.value': {
    en: '15,000mm',
    ja: '15,000mm',
    it: '15.000mm',
    fr: '15 000mm',
    ar: '15,000 مم'
  },
  'spec.hydrostatic.desc': {
    en: 'Heat-sealed seams',
    ja: '熱圧着シーム',
    it: 'Cuciture termosaldate',
    fr: 'Coutures thermosoudées',
    ar: 'طبقات ملحومة حرارياً'
  },
  'spec.hud': {
    en: 'HUD DISPLAY',
    ja: 'HUDディスプレイ',
    it: 'DISPLAY HUD',
    fr: 'AFFICHAGE HUD',
    ar: 'شاشة HUD'
  },
  'spec.hud.value': {
    en: 'Active',
    ja: 'アクティブ',
    it: 'Attivo',
    fr: 'Actif',
    ar: 'نشط'
  },
  'spec.hud.desc': {
    en: 'Chronometer + Terrain',
    ja: 'クロノメーター + テレイン',
    it: 'Cronometro + Terreno',
    fr: 'Chronomètre + Terrain',
    ar: 'كرونومتر + تضاريس'
  },
  'spec.weight': {
    en: 'UNIT WEIGHT',
    ja: '重量',
    it: 'PESO UNITÀ',
    fr: 'POIDS UNITÉ',
    ar: 'وزن الوحدة'
  },
  'spec.weight.value': {
    en: '420g',
    ja: '420g',
    it: '420g',
    fr: '420g',
    ar: '420 جرام'
  },
  'spec.weight.desc': {
    en: 'Mission-ready',
    ja: 'ミッション対応',
    it: 'Pronto per la missione',
    fr: 'Prêt pour la mission',
    ar: 'جاهز للمهمة'
  },

  // Acquisition Flow
  'acquisition.initiate': {
    en: 'INITIATE ACQUISITION',
    ja: '取得開始',
    it: 'AVVIA ACQUISIZIONE',
    fr: 'LANCER ACQUISITION',
    ar: 'بدء الاستحواذ'
  },
  'acquisition.step1': {
    en: 'CONFIRM TERRAIN SETUP',
    ja: 'テレイン設定確認',
    it: 'CONFERMA CONFIGURAZIONE TERRENO',
    fr: 'CONFIRMER CONFIGURATION TERRAIN',
    ar: 'تأكيد إعداد التضاريس'
  },
  'acquisition.step2': {
    en: 'VERIFY STRATA ID',
    ja: 'STRATA ID確認',
    it: 'VERIFICA ID STRATA',
    fr: 'VÉRIFIER ID STRATA',
    ar: 'التحقق من هوية STRATA'
  },
  'acquisition.step3': {
    en: 'EXECUTE PAYMENT',
    ja: '決済実行',
    it: 'ESEGUI PAGAMENTO',
    fr: 'EXÉCUTER PAIEMENT',
    ar: 'تنفيذ الدفع'
  },
  'acquisition.terrainLocked': {
    en: 'TERRAIN LOCKED',
    ja: 'テレイン確定',
    it: 'TERRENO BLOCCATO',
    fr: 'TERRAIN VERROUILLÉ',
    ar: 'التضاريس مؤمنة'
  },
  'acquisition.idVerified': {
    en: 'ID VERIFIED',
    ja: 'ID確認済',
    it: 'ID VERIFICATO',
    fr: 'ID VÉRIFIÉ',
    ar: 'الهوية موثقة'
  },
  'acquisition.launchSequence': {
    en: 'LAUNCH SEQUENCE',
    ja: 'ローンチシーケンス',
    it: 'SEQUENZA DI LANCIO',
    fr: 'SÉQUENCE DE LANCEMENT',
    ar: 'تسلسل الإطلاق'
  },
  'acquisition.systemArmed': {
    en: 'SYSTEM ARMED',
    ja: 'システム準備完了',
    it: 'SISTEMA ARMATO',
    fr: 'SYSTÈME ARMÉ',
    ar: 'النظام جاهز'
  },
  'acquisition.confirm': {
    en: 'CONFIRM',
    ja: '確認',
    it: 'CONFERMA',
    fr: 'CONFIRMER',
    ar: 'تأكيد'
  },
  'acquisition.proceed': {
    en: 'PROCEED',
    ja: '続行',
    it: 'PROCEDI',
    fr: 'CONTINUER',
    ar: 'متابعة'
  },
  'acquisition.execute': {
    en: 'EXECUTE',
    ja: '実行',
    it: 'ESEGUI',
    fr: 'EXÉCUTER',
    ar: 'تنفيذ'
  },
  'acquisition.abort': {
    en: 'ABORT',
    ja: '中止',
    it: 'ANNULLA',
    fr: 'ANNULER',
    ar: 'إلغاء'
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

  // Terrain Variants
  'terrain.chronoTopo.name': {
    en: 'CHRONO-TOPO',
    ja: 'クロノ・トポ',
    it: 'CRONO-TOPO',
    fr: 'CHRONO-TOPO',
    ar: 'كرونو-توبو'
  },
  'terrain.chronoTopo.description': {
    en: 'Standard chronometer + topographic HUD',
    ja: '標準クロノメーター + 地形HUD',
    it: 'Cronometro standard + HUD topografico',
    fr: 'Chronomètre standard + HUD topographique',
    ar: 'كرونومتر قياسي + شاشة طبوغرافية'
  },
  'terrain.bathymetric.name': {
    en: 'BATHYMETRIC',
    ja: 'バシメトリック',
    it: 'BATIMETRICO',
    fr: 'BATHYMÉTRIQUE',
    ar: 'باثيمتري'
  },
  'terrain.bathymetric.description': {
    en: 'Oceanic depth contours — Auckland Basin',
    ja: '海洋深度等高線 — オークランド海盆',
    it: 'Contorni di profondità oceanica — Bacino di Auckland',
    fr: 'Contours de profondeur océanique — Bassin d\'Auckland',
    ar: 'خطوط العمق المحيطي — حوض أوكلاند'
  },
  'terrain.glacial.name': {
    en: 'GLACIAL',
    ja: 'グレイシャル',
    it: 'GLACIALE',
    fr: 'GLACIAIRE',
    ar: 'جليدي'
  },
  'terrain.glacial.description': {
    en: 'Ice sheet elevation — Arctic Circle',
    ja: '氷床標高 — 北極圏',
    it: 'Elevazione della calotta glaciale — Circolo Artico',
    fr: 'Élévation de la calotte glaciaire — Cercle Arctique',
    ar: 'ارتفاع الصفيحة الجليدية — الدائرة القطبية'
  },
  'terrain.geological.name': {
    en: 'GEOLOGICAL',
    ja: 'ジオロジカル',
    it: 'GEOLOGICO',
    fr: 'GÉOLOGIQUE',
    ar: 'جيولوجي'
  },
  'terrain.geological.description': {
    en: 'Dune elevation patterns — Saharan terrain',
    ja: '砂丘標高パターン — サハラ地形',
    it: 'Modelli di elevazione delle dune — Terreno sahariano',
    fr: 'Motifs d\'élévation des dunes — Terrain saharien',
    ar: 'أنماط ارتفاع الكثبان — تضاريس صحراوية'
  },
  'terrain.metropolitan.name': {
    en: 'METROPOLITAN',
    ja: 'メトロポリタン',
    it: 'METROPOLITANO',
    fr: 'MÉTROPOLITAIN',
    ar: 'حضري'
  },
  'terrain.metropolitan.description': {
    en: 'Urban density grid — Tokyo infrastructure',
    ja: '都市密度グリッド — 東京インフラ',
    it: 'Griglia di densità urbana — Infrastruttura di Tokyo',
    fr: 'Grille de densité urbaine — Infrastructure de Tokyo',
    ar: 'شبكة الكثافة الحضرية — البنية التحتية لطوكيو'
  },

  // Weather Clothing Advice
  'weather.advice.snowLayers': {
    en: 'Layer up with the STRATA Shell — snow conditions ahead',
    ja: 'STRATAシェルでレイヤリング — 降雪予報',
    it: 'Stratifica con la STRATA Shell — neve in arrivo',
    fr: 'Superposez avec la STRATA Shell — neige prévue',
    ar: 'ارتدِ طبقات مع STRATA Shell — ثلوج متوقعة'
  },
  'weather.advice.coldFull': {
    en: 'Full thermal layers recommended under STRATA Shell',
    ja: 'STRATAシェルの下に完全サーマルレイヤー推奨',
    it: 'Strati termici completi consigliati sotto STRATA Shell',
    fr: 'Couches thermiques complètes recommandées sous STRATA Shell',
    ar: 'طبقات حرارية كاملة موصى بها تحت STRATA Shell'
  },
  'weather.advice.coldRain': {
    en: 'STRATA Shell essential — cold rain expected',
    ja: 'STRATAシェル必須 — 冷たい雨予報',
    it: 'STRATA Shell essenziale — pioggia fredda prevista',
    fr: 'STRATA Shell essentielle — pluie froide prévue',
    ar: 'STRATA Shell ضروري — مطر بارد متوقع'
  },
  'weather.advice.coldMidLayers': {
    en: 'STRATA Shell over mid-weight layers',
    ja: 'ミッドウェイトレイヤーの上にSTRATAシェル',
    it: 'STRATA Shell sopra strati di peso medio',
    fr: 'STRATA Shell sur couches intermédiaires',
    ar: 'STRATA Shell فوق طبقات متوسطة الوزن'
  },
  'weather.advice.perfectWeather': {
    en: 'Perfect STRATA Shell weather — stay dry',
    ja: '完璧なSTRATAシェル日和 — ドライに',
    it: 'Tempo perfetto per STRATA Shell — resta asciutto',
    fr: 'Temps parfait pour STRATA Shell — restez au sec',
    ar: 'طقس مثالي لـ STRATA Shell — ابقَ جافاً'
  },
  'weather.advice.lightWind': {
    en: 'Light STRATA Shell for wind protection',
    ja: '風よけにライトSTRATAシェル',
    it: 'STRATA Shell leggera per protezione dal vento',
    fr: 'STRATA Shell légère pour protection contre le vent',
    ar: 'STRATA Shell خفيف للحماية من الرياح'
  },
  'weather.advice.optional': {
    en: 'STRATA Shell optional — mild conditions',
    ja: 'STRATAシェルはオプション — 穏やかな天候',
    it: 'STRATA Shell opzionale — condizioni miti',
    fr: 'STRATA Shell optionnelle — conditions douces',
    ar: 'STRATA Shell اختياري — ظروف معتدلة'
  },
  'weather.advice.lightRain': {
    en: 'STRATA Shell for light rain coverage',
    ja: '小雨対策にSTRATAシェル',
    it: 'STRATA Shell per pioggia leggera',
    fr: 'STRATA Shell pour pluie légère',
    ar: 'STRATA Shell للمطر الخفيف'
  },
  'weather.advice.carryShell': {
    en: 'Carry STRATA Shell — conditions may shift',
    ja: 'STRATAシェルを携帯 — 天候変化の可能性',
    it: 'Porta STRATA Shell — le condizioni potrebbero cambiare',
    fr: 'Emportez STRATA Shell — les conditions peuvent changer',
    ar: 'احمل STRATA Shell — قد تتغير الظروف'
  },
  'weather.advice.suddenShowers': {
    en: 'STRATA Shell for sudden showers',
    ja: '突然の雨にSTRATAシェル',
    it: 'STRATA Shell per acquazzoni improvvisi',
    fr: 'STRATA Shell pour averses soudaines',
    ar: 'STRATA Shell للأمطار المفاجئة'
  },
  'weather.advice.stowed': {
    en: 'STRATA Shell stowed — warm conditions',
    ja: 'STRATAシェル収納 — 暖かい天候',
    it: 'STRATA Shell riposta — condizioni calde',
    fr: 'STRATA Shell rangée — conditions chaudes',
    ar: 'STRATA Shell مخزن — ظروف دافئة'
  },

  // Success Page - Post-Acquisition
  'success.paymentConfirmed': {
    en: 'PAYMENT CONFIRMED',
    ja: '支払い確認済み',
    it: 'PAGAMENTO CONFERMATO',
    fr: 'PAIEMENT CONFIRMÉ',
    ar: 'تم تأكيد الدفع'
  },
  'success.acquisitionComplete': {
    en: 'Acquisition Complete',
    ja: '取得完了',
    it: 'Acquisizione Completata',
    fr: 'Acquisition Terminée',
    ar: 'اكتمال الاستحواذ'
  },
  'success.bondSecured': {
    en: 'Your STRATA Bond has been secured. 100-year generational ownership activated.',
    ja: 'STRATAボンドが確保されました。100年の世代間所有権が有効化されました。',
    it: 'Il tuo STRATA Bond è stato assicurato. Proprietà generazionale di 100 anni attivata.',
    fr: 'Votre STRATA Bond a été sécurisé. Propriété générationnelle de 100 ans activée.',
    ar: 'تم تأمين سند STRATA الخاص بك. تم تفعيل ملكية الأجيال لمدة 100 عام.'
  },
  'success.ownershipSecured': {
    en: 'Your STRATA Ownership has been secured. Annual Century Protocol access granted.',
    ja: 'STRATA所有権が確保されました。年間センチュリープロトコルアクセスが付与されました。',
    it: 'La tua proprietà STRATA è stata assicurata. Accesso annuale al Protocollo Century concesso.',
    fr: 'Votre propriété STRATA a été sécurisée. Accès annuel au Protocole Century accordé.',
    ar: 'تم تأمين ملكية STRATA الخاصة بك. تم منح الوصول السنوي لبروتوكول Century.'
  },

  // Success Steps
  'success.step.certificate': {
    en: 'Certificate',
    ja: '証明書',
    it: 'Certificato',
    fr: 'Certificat',
    ar: 'الشهادة'
  },
  'success.step.activation': {
    en: 'Activation',
    ja: 'アクティベーション',
    it: 'Attivazione',
    fr: 'Activation',
    ar: 'التفعيل'
  },
  'success.step.calibration': {
    en: 'Calibration',
    ja: 'キャリブレーション',
    it: 'Calibrazione',
    fr: 'Calibration',
    ar: 'المعايرة'
  },
  'success.step.complete': {
    en: 'Complete',
    ja: '完了',
    it: 'Completato',
    fr: 'Terminé',
    ar: 'مكتمل'
  },

  // Certificate
  'success.certificate.title': {
    en: 'OWNERSHIP CERTIFICATE',
    ja: '所有証明書',
    it: 'CERTIFICATO DI PROPRIETÀ',
    fr: 'CERTIFICAT DE PROPRIÉTÉ',
    ar: 'شهادة الملكية'
  },
  'success.certificate.bondType': {
    en: 'STRATA BOND — 100 Year Legacy',
    ja: 'STRATAボンド — 100年レガシー',
    it: 'STRATA BOND — Eredità 100 Anni',
    fr: 'STRATA BOND — Héritage 100 Ans',
    ar: 'سند STRATA — إرث 100 عام'
  },
  'success.certificate.ownershipType': {
    en: 'STRATA OWNERSHIP — Century Protocol',
    ja: 'STRATA所有権 — センチュリープロトコル',
    it: 'PROPRIETÀ STRATA — Protocollo Century',
    fr: 'PROPRIÉTÉ STRATA — Protocole Century',
    ar: 'ملكية STRATA — بروتوكول Century'
  },
  'success.certificate.serial': {
    en: 'SERIAL',
    ja: 'シリアル',
    it: 'SERIALE',
    fr: 'SÉRIE',
    ar: 'الرقم التسلسلي'
  },
  'success.certificate.terrainConfig': {
    en: 'TERRAIN CONFIGURATION',
    ja: 'テレイン設定',
    it: 'CONFIGURAZIONE TERRENO',
    fr: 'CONFIGURATION TERRAIN',
    ar: 'تكوين التضاريس'
  },
  'success.certificate.ownership': {
    en: 'OWNERSHIP TERM',
    ja: '所有期間',
    it: 'TERMINE DI PROPRIETÀ',
    fr: 'DURÉE DE PROPRIÉTÉ',
    ar: 'مدة الملكية'
  },
  'success.certificate.years': {
    en: 'YEARS',
    ja: '年',
    it: 'ANNI',
    fr: 'ANS',
    ar: 'سنوات'
  },
  'success.certificate.bondLegacy': {
    en: 'Generational legacy — transferable to heirs',
    ja: '世代間レガシー — 相続人に譲渡可能',
    it: 'Eredità generazionale — trasferibile agli eredi',
    fr: 'Héritage générationnel — transférable aux héritiers',
    ar: 'إرث الأجيال — قابل للتحويل للورثة'
  },
  'success.certificate.annualRenewal': {
    en: 'Annual renewal — continuous access',
    ja: '年間更新 — 継続的なアクセス',
    it: 'Rinnovo annuale — accesso continuo',
    fr: 'Renouvellement annuel — accès continu',
    ar: 'تجديد سنوي — وصول مستمر'
  },
  'success.certificate.access': {
    en: 'ACCESS',
    ja: 'アクセス',
    it: 'ACCESSO',
    fr: 'ACCÈS',
    ar: 'الوصول'
  },
  'success.certificate.global': {
    en: 'Global',
    ja: 'グローバル',
    it: 'Globale',
    fr: 'Mondial',
    ar: 'عالمي'
  },
  'success.certificate.issued': {
    en: 'ISSUED',
    ja: '発行日',
    it: 'EMESSO',
    fr: 'ÉMIS',
    ar: 'صدر في'
  },
  'success.certificate.downloadPdf': {
    en: 'Download Certificate PDF',
    ja: '証明書PDFをダウンロード',
    it: 'Scarica PDF Certificato',
    fr: 'Télécharger le PDF du Certificat',
    ar: 'تحميل شهادة PDF'
  },
  'success.certificate.verified': {
    en: 'BLOCKCHAIN VERIFIED',
    ja: 'ブロックチェーン検証済み',
    it: 'VERIFICATO BLOCKCHAIN',
    fr: 'VÉRIFIÉ BLOCKCHAIN',
    ar: 'تم التحقق عبر البلوكتشين'
  },
  'success.certificate.valid': {
    en: 'VALID',
    ja: '有効',
    it: 'VALIDO',
    fr: 'VALIDE',
    ar: 'صالح'
  },

  // Activation
  'success.activation.title': {
    en: 'Ownership Activation',
    ja: '所有権アクティベーション',
    it: 'Attivazione Proprietà',
    fr: 'Activation de la Propriété',
    ar: 'تفعيل الملكية'
  },
  'success.activation.description': {
    en: 'Your unique activation code has been generated. This code links your ownership to the STRATA network.',
    ja: '固有のアクティベーションコードが生成されました。このコードはあなたの所有権をSTRATAネットワークにリンクします。',
    it: 'Il tuo codice di attivazione unico è stato generato. Questo codice collega la tua proprietà alla rete STRATA.',
    fr: 'Votre code d\'activation unique a été généré. Ce code lie votre propriété au réseau STRATA.',
    ar: 'تم إنشاء رمز التفعيل الفريد الخاص بك. هذا الرمز يربط ملكيتك بشبكة STRATA.'
  },
  'success.activation.code': {
    en: 'ACTIVATION CODE',
    ja: 'アクティベーションコード',
    it: 'CODICE DI ATTIVAZIONE',
    fr: 'CODE D\'ACTIVATION',
    ar: 'رمز التفعيل'
  },
  'success.activation.saveCode': {
    en: 'Save this code securely. It will be needed for physical shell registration.',
    ja: 'このコードを安全に保存してください。物理シェルの登録に必要です。',
    it: 'Salva questo codice in modo sicuro. Sarà necessario per la registrazione fisica della shell.',
    fr: 'Enregistrez ce code en lieu sûr. Il sera nécessaire pour l\'enregistrement physique de la coque.',
    ar: 'احفظ هذا الرمز بشكل آمن. سيكون مطلوباً لتسجيل الغلاف المادي.'
  },

  // Calibration
  'success.calibration.title': {
    en: 'System Calibration',
    ja: 'システムキャリブレーション',
    it: 'Calibrazione Sistema',
    fr: 'Calibration du Système',
    ar: 'معايرة النظام'
  },
  'success.calibration.subtitle': {
    en: 'Syncing ownership parameters',
    ja: '所有権パラメータを同期中',
    it: 'Sincronizzazione parametri di proprietà',
    fr: 'Synchronisation des paramètres de propriété',
    ar: 'مزامنة معلمات الملكية'
  },
  'success.calibration.terrainMapped': {
    en: 'Terrain variant mapped',
    ja: 'テレインバリアントがマッピングされました',
    it: 'Variante terreno mappata',
    fr: 'Variante de terrain mappée',
    ar: 'تم تعيين متغير التضاريس'
  },
  'success.calibration.hudSynced': {
    en: 'HUD display synced',
    ja: 'HUDディスプレイが同期されました',
    it: 'Display HUD sincronizzato',
    fr: 'Affichage HUD synchronisé',
    ar: 'تمت مزامنة شاشة HUD'
  },
  'success.calibration.chronoCalibrated': {
    en: 'Chronometer calibrated',
    ja: 'クロノメーターがキャリブレートされました',
    it: 'Cronometro calibrato',
    fr: 'Chronomètre calibré',
    ar: 'تمت معايرة الكرونومتر'
  },

  // Navigation buttons
  'success.proceedToActivation': {
    en: 'Proceed to Activation',
    ja: 'アクティベーションへ進む',
    it: 'Procedi all\'Attivazione',
    fr: 'Passer à l\'Activation',
    ar: 'المتابعة إلى التفعيل'
  },
  'success.back': {
    en: 'Back',
    ja: '戻る',
    it: 'Indietro',
    fr: 'Retour',
    ar: 'رجوع'
  },
  'success.continueCalibration': {
    en: 'Continue to Calibration',
    ja: 'キャリブレーションへ続く',
    it: 'Continua alla Calibrazione',
    fr: 'Continuer vers la Calibration',
    ar: 'المتابعة إلى المعايرة'
  },
  'success.finalizeSetup': {
    en: 'Finalize Setup',
    ja: 'セットアップを完了',
    it: 'Finalizza Configurazione',
    fr: 'Finaliser la Configuration',
    ar: 'إنهاء الإعداد'
  },

  // Complete step
  'success.complete.title': {
    en: 'Setup Complete',
    ja: 'セットアップ完了',
    it: 'Configurazione Completata',
    fr: 'Configuration Terminée',
    ar: 'اكتمل الإعداد'
  },
  'success.complete.description': {
    en: 'Your STRATA ownership is now fully activated. Welcome to the Century Protocol.',
    ja: 'あなたのSTRATA所有権が完全にアクティベートされました。センチュリープロトコルへようこそ。',
    it: 'La tua proprietà STRATA è ora completamente attivata. Benvenuto nel Protocollo Century.',
    fr: 'Votre propriété STRATA est maintenant entièrement activée. Bienvenue dans le Protocole Century.',
    ar: 'تم تفعيل ملكية STRATA الخاصة بك بالكامل. مرحباً بك في بروتوكول Century.'
  },
  'success.complete.status': {
    en: 'STATUS',
    ja: 'ステータス',
    it: 'STATO',
    fr: 'STATUT',
    ar: 'الحالة'
  },
  'success.complete.active': {
    en: 'ACTIVE',
    ja: 'アクティブ',
    it: 'ATTIVO',
    fr: 'ACTIF',
    ar: 'نشط'
  },
  'success.complete.coverage': {
    en: 'COVERAGE',
    ja: 'カバレッジ',
    it: 'COPERTURA',
    fr: 'COUVERTURE',
    ar: 'التغطية'
  },
  'success.complete.worldwide': {
    en: 'Worldwide',
    ja: 'ワールドワイド',
    it: 'Mondiale',
    fr: 'Mondial',
    ar: 'عالمي'
  },
  'success.complete.protocol': {
    en: 'PROTOCOL',
    ja: 'プロトコル',
    it: 'PROTOCOLLO',
    fr: 'PROTOCOLE',
    ar: 'البروتوكول'
  },
  'success.complete.returnToShop': {
    en: 'Return to Shop',
    ja: 'ショップに戻る',
    it: 'Torna al Negozio',
    fr: 'Retour à la Boutique',
    ar: 'العودة إلى المتجر'
  },
  'success.complete.accessStrata': {
    en: 'Access STRATA',
    ja: 'STRATAにアクセス',
    it: 'Accedi a STRATA',
    fr: 'Accéder à STRATA',
    ar: 'الوصول إلى STRATA'
  },

  // Acquisition Ritual
  'ritual.acquisitionSequence': {
    en: 'ACQUISITION SEQUENCE',
    ja: '取得シーケンス',
    it: 'SEQUENZA DI ACQUISIZIONE',
    fr: 'SÉQUENCE D\'ACQUISITION',
    ar: 'تسلسل الاستحواذ'
  },
  'ritual.biometric.title': {
    en: 'Biometric Authentication',
    ja: '生体認証',
    it: 'Autenticazione Biometrica',
    fr: 'Authentification Biométrique',
    ar: 'المصادقة البيومترية'
  },
  'ritual.biometric.description': {
    en: 'Verifying ownership eligibility. Hold steady.',
    ja: '所有資格を確認中。そのままお待ちください。',
    it: 'Verifica dell\'idoneità alla proprietà. Rimani fermo.',
    fr: 'Vérification de l\'éligibilité. Restez stable.',
    ar: 'جاري التحقق من أهلية الملكية. ابقَ ثابتاً.'
  },
  'ritual.biometric.proceed': {
    en: 'Proceed to Protocol',
    ja: 'プロトコルへ進む',
    it: 'Procedi al Protocollo',
    fr: 'Passer au Protocole',
    ar: 'المتابعة إلى البروتوكول'
  },
  'ritual.protocol.title': {
    en: 'Century Protocol Acceptance',
    ja: 'センチュリープロトコル承認',
    it: 'Accettazione Protocollo Century',
    fr: 'Acceptation du Protocole Century',
    ar: 'قبول بروتوكول Century'
  },
  'ritual.protocol.bondDescription': {
    en: 'You are entering a 100-year generational ownership covenant. This bond transfers to heirs.',
    ja: '100年の世代間所有権契約に参加します。このボンドは相続人に譲渡されます。',
    it: 'Stai entrando in un patto di proprietà generazionale di 100 anni. Questo bond si trasferisce agli eredi.',
    fr: 'Vous entrez dans un pacte de propriété générationnelle de 100 ans. Ce bond est transférable aux héritiers.',
    ar: 'أنت تدخل في عهد ملكية الأجيال لمدة 100 عام. ينتقل هذا السند إلى الورثة.'
  },
  'ritual.protocol.annualDescription': {
    en: 'You are entering the Century Protocol annual ownership program.',
    ja: 'センチュリープロトコル年間所有権プログラムに参加します。',
    it: 'Stai entrando nel programma di proprietà annuale del Protocollo Century.',
    fr: 'Vous entrez dans le programme de propriété annuelle du Protocole Century.',
    ar: 'أنت تدخل برنامج الملكية السنوي لبروتوكول Century.'
  },
  'ritual.protocol.agreement': {
    en: 'OWNERSHIP AGREEMENT',
    ja: '所有権契約',
    it: 'ACCORDO DI PROPRIETÀ',
    fr: 'ACCORD DE PROPRIÉTÉ',
    ar: 'اتفاقية الملكية'
  },
  'ritual.protocol.term1': {
    en: 'Access to all STRATA terrain variants and HUD updates',
    ja: 'すべてのSTRATAテレインバリアントとHUDアップデートへのアクセス',
    it: 'Accesso a tutte le varianti di terreno STRATA e aggiornamenti HUD',
    fr: 'Accès à toutes les variantes de terrain STRATA et mises à jour HUD',
    ar: 'الوصول إلى جميع متغيرات التضاريس STRATA وتحديثات HUD'
  },
  'ritual.protocol.term2': {
    en: 'Chronometer calibration and weather intelligence sync',
    ja: 'クロノメーターキャリブレーションと気象インテリジェンス同期',
    it: 'Calibrazione cronometro e sincronizzazione intelligence meteo',
    fr: 'Calibration du chronomètre et synchronisation de l\'intelligence météo',
    ar: 'معايرة الكرونومتر ومزامنة استخبارات الطقس'
  },
  'ritual.protocol.term3': {
    en: 'Priority access to future STRATA equipment releases',
    ja: '将来のSTRATA機器リリースへの優先アクセス',
    it: 'Accesso prioritario ai futuri rilasci di equipaggiamento STRATA',
    fr: 'Accès prioritaire aux futures versions d\'équipement STRATA',
    ar: 'الوصول ذو الأولوية إلى إصدارات معدات STRATA المستقبلية'
  },
  'ritual.protocol.amount': {
    en: 'TOTAL COMMITMENT',
    ja: '合計コミットメント',
    it: 'IMPEGNO TOTALE',
    fr: 'ENGAGEMENT TOTAL',
    ar: 'إجمالي الالتزام'
  },
  'ritual.protocol.signNow': {
    en: 'Sign Protocol Agreement',
    ja: 'プロトコル契約に署名',
    it: 'Firma Accordo Protocollo',
    fr: 'Signer l\'Accord du Protocole',
    ar: 'توقيع اتفاقية البروتوكول'
  },
  'ritual.protocol.signed': {
    en: 'Protocol Signed',
    ja: 'プロトコル署名済み',
    it: 'Protocollo Firmato',
    fr: 'Protocole Signé',
    ar: 'تم توقيع البروتوكول'
  },
  'ritual.fabrication.title': {
    en: 'Unit Fabrication',
    ja: 'ユニット製造',
    it: 'Fabbricazione Unità',
    fr: 'Fabrication de l\'Unité',
    ar: 'تصنيع الوحدة'
  },
  'ritual.fabrication.description': {
    en: 'Allocating your serialized STRATA unit with terrain configuration',
    ja: 'テレイン設定を含むシリアル化されたSTRATAユニットを割り当て中',
    it: 'Allocazione della tua unità STRATA serializzata con configurazione terreno',
    fr: 'Allocation de votre unité STRATA sérialisée avec configuration terrain',
    ar: 'تخصيص وحدة STRATA المتسلسلة الخاصة بك مع تكوين التضاريس'
  },
  'ritual.fabrication.execute': {
    en: 'Execute Acquisition',
    ja: '取得を実行',
    it: 'Esegui Acquisizione',
    fr: 'Exécuter l\'Acquisition',
    ar: 'تنفيذ الاستحواذ'
  },
  'ritual.executing.title': {
    en: 'Executing Transaction',
    ja: 'トランザクション実行中',
    it: 'Esecuzione Transazione',
    fr: 'Exécution de la Transaction',
    ar: 'جاري تنفيذ المعاملة'
  },
  'ritual.executing.description': {
    en: 'Redirecting to secure payment gateway...',
    ja: 'セキュア決済ゲートウェイにリダイレクト中...',
    it: 'Reindirizzamento al gateway di pagamento sicuro...',
    fr: 'Redirection vers la passerelle de paiement sécurisée...',
    ar: 'جاري إعادة التوجيه إلى بوابة الدفع الآمنة...'
  },
  'ritual.warning': {
    en: 'SECURE TRANSACTION — ALL DATA ENCRYPTED',
    ja: 'セキュアトランザクション — 全データ暗号化',
    it: 'TRANSAZIONE SICURA — TUTTI I DATI CRITTOGRAFATI',
    fr: 'TRANSACTION SÉCURISÉE — TOUTES LES DONNÉES CHIFFRÉES',
    ar: 'معاملة آمنة — جميع البيانات مشفرة'
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
