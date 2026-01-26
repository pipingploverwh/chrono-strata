import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Download, 
  Lock, 
  Unlock, 
  ExternalLink, 
  Shield, 
  TrendingUp, 
  Globe, 
  Loader2,
  FileText,
  Target,
  Zap,
  CheckCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { INVESTOR_DOCUMENTS, RUBIN_PATENTS } from '@/data/investorDocuments';
import { useDocumentDownload } from '@/hooks/useDocumentDownload';
import { InvestorContactForm } from '@/components/investor/InvestorContactForm';
import { SidebarAd, AD_SLOTS } from '@/components/ads';

const content = {
  en: {
    nav: {
      brand: 'LAVANDAR',
      portal: 'Investor Portal',
      contact: 'Contact'
    },
    hero: {
      status: 'Series A',
      title: 'Investor Hub',
      subtitle: 'Access confidential materials, patent documentation, and platform analytics for qualified investors.'
    },
    metrics: [
      { icon: Target, value: '$100M', label: 'Target Valuation' },
      { icon: TrendingUp, value: '84.7%', label: 'Algorithm Accuracy' },
      { icon: Shield, value: '3', label: 'Patent Portfolio' },
      { icon: Zap, value: '$4.2M', label: 'FY26 Revenue Target' }
    ],
    livePlatform: {
      title: 'Live Platform Access',
      subtitle: 'Explore the operational STRATA dashboards',
      links: [
        { name: 'STRATA Command', href: '/strata', icon: Globe },
        { name: 'Weather Intelligence', href: '/weather-intelligence', icon: Zap },
        { name: 'Kraft Case Study', href: '/kraft-case-study', icon: Target },
        { name: 'Executive Summary', href: '/vc-summary', icon: FileText }
      ]
    },
    documents: {
      title: 'Investor Documents',
      subtitle: 'Download confidential materials',
      secureNote: 'Secure Documents',
      secureDesc: 'Some documents require NDA verification for access.',
      requestAccess: 'Request Access'
    },
    footer: {
      rights: '© 2026 LAVANDAR TECH. All rights reserved.',
      confidential: 'Materials are confidential and for qualified investors only.'
    }
  },
  jp: {
    nav: {
      brand: 'LAVANDAR',
      portal: '投資家ポータル',
      contact: 'お問い合わせ'
    },
    hero: {
      status: 'シリーズA',
      title: '投資家ハブ',
      subtitle: '適格投資家向けの機密資料、特許文書、プラットフォーム分析にアクセスできます。'
    },
    metrics: [
      { icon: Target, value: '$100M', label: '目標評価額' },
      { icon: TrendingUp, value: '84.7%', label: 'アルゴリズム精度' },
      { icon: Shield, value: '3', label: '特許ポートフォリオ' },
      { icon: Zap, value: '$4.2M', label: 'FY26収益目標' }
    ],
    livePlatform: {
      title: 'ライブプラットフォーム',
      subtitle: '運用中のSTRATAダッシュボードを探索',
      links: [
        { name: 'STRATAコマンド', href: '/strata', icon: Globe },
        { name: '気象インテリジェンス', href: '/weather-intelligence', icon: Zap },
        { name: 'Kraft事例研究', href: '/kraft-case-study', icon: Target },
        { name: 'エグゼクティブサマリー', href: '/vc-summary', icon: FileText }
      ]
    },
    documents: {
      title: '投資家向け資料',
      subtitle: '機密資料をダウンロード',
      secureNote: '機密文書',
      secureDesc: '一部の文書にはNDA確認が必要です。',
      requestAccess: 'アクセスをリクエスト'
    },
    footer: {
      rights: '© 2026 LAVANDAR TECH. All rights reserved.',
      confidential: '資料は機密であり、適格投資家のみを対象としています。'
    }
  }
};

export default function InvestorHub() {
  const [lang, setLang] = useState<'en' | 'jp'>('en');
  const [unlockedDocs, setUnlockedDocs] = useState<Set<string>>(new Set());
  const t = content[lang];
  const { downloadDocument, downloadingId } = useDocumentDownload();

  const handleDownload = async (doc: typeof INVESTOR_DOCUMENTS[0]) => {
    if (doc.secure && !unlockedDocs.has(doc.id)) {
      toast.info(lang === 'en' 
        ? 'This document requires NDA verification. Click "Request Access" below.' 
        : 'この文書にはNDA確認が必要です。下の「アクセスをリクエスト」をクリックしてください。'
      );
      return;
    }
    
    await downloadDocument(doc);
    toast.success(lang === 'en' 
      ? `Downloaded: ${doc.title}` 
      : `ダウンロード完了: ${doc.title}`
    );
  };

  const handleRequestAccess = () => {
    const secureDocIds = INVESTOR_DOCUMENTS.filter(d => d.secure).map(d => d.id);
    setUnlockedDocs(new Set(secureDocIds));
    toast.success(lang === 'en' 
      ? 'Access granted. Secure documents are now available for download.' 
      : 'アクセスが許可されました。機密文書がダウンロード可能になりました。'
    );
  };

  const allSecureUnlocked = INVESTOR_DOCUMENTS.filter(d => d.secure).every(d => unlockedDocs.has(d.id));

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="border-b border-border/40 bg-background/95 backdrop-blur sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center text-primary font-bold text-lg">
              L
            </div>
            <div>
              <span className="font-semibold tracking-wide">{t.nav.brand}</span>
              <span className="text-xs text-muted-foreground ml-2">{t.nav.portal}</span>
            </div>
          </Link>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setLang(lang === 'en' ? 'jp' : 'en')}
              className="flex items-center space-x-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <Globe className="h-4 w-4" />
              <span>{lang === 'en' ? 'EN' : 'JP'}</span>
            </button>
            <Link 
              to="/recruiter-outreach" 
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {t.nav.contact}
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="max-w-6xl mx-auto px-6">
          {/* Decorative glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative text-center mb-16">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20 mb-4">
              <TrendingUp className="h-3 w-3 mr-1.5" />
              {t.hero.status}
            </span>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              {t.hero.title}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t.hero.subtitle}
            </p>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
            {t.metrics.map((metric, idx) => {
              const IconComponent = metric.icon;
              return (
                <div key={idx} className="glass-card p-6 rounded-xl text-center">
                  <div className="flex items-center justify-center space-x-2 text-muted-foreground mb-2">
                    <IconComponent className="h-4 w-4" />
                    <span className="text-xs uppercase tracking-wider">{metric.label}</span>
                  </div>
                  <div className="text-2xl font-bold text-primary">{metric.value}</div>
                </div>
              );
            })}
          </div>

          <div className="flex gap-8">
            <div className="flex-1 grid lg:grid-cols-2 gap-8">
            {/* Live Platform Links */}
            <div className="glass-card p-6 rounded-xl">
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-1">{t.livePlatform.title}</h2>
                <p className="text-sm text-muted-foreground">{t.livePlatform.subtitle}</p>
              </div>

              <div className="space-y-3">
                {t.livePlatform.links.map((link, idx) => {
                  const IconComponent = link.icon;
                  return (
                    <Link
                      key={idx}
                      to={link.href}
                      className="flex items-center justify-between p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors group"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                          <IconComponent className="h-4 w-4 text-primary" />
                        </div>
                        <span className="font-medium">{link.name}</span>
                      </div>
                      <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Documents Section */}
            <div className="glass-card p-6 rounded-xl">
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-1">{t.documents.title}</h2>
                <p className="text-sm text-muted-foreground">{t.documents.subtitle}</p>
              </div>

              <div className="space-y-3">
                {INVESTOR_DOCUMENTS.map((doc) => {
                  const isUnlocked = !doc.secure || unlockedDocs.has(doc.id);
                  const isDownloading = downloadingId === doc.id;
                  const IconComponent = doc.icon;
                  
                  return (
                    <button
                      key={doc.id}
                      onClick={() => handleDownload(doc)}
                      disabled={isDownloading}
                      className={`w-full p-4 rounded-lg flex items-center justify-between group transition-all text-left ${
                        isUnlocked 
                          ? 'bg-muted/30 hover:bg-muted/50 cursor-pointer' 
                          : 'bg-muted/20 opacity-75 cursor-pointer'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                          <IconComponent className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium text-sm">
                            {doc.title}
                          </div>
                          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                            <span>{doc.type}</span>
                            <span>•</span>
                            <span>{doc.size}</span>
                            {isUnlocked && doc.secure && (
                              <span className="flex items-center text-green-500">
                                <Unlock className="h-3 w-3 mr-0.5" />
                                Unlocked
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div>
                        {isDownloading ? (
                          <Loader2 className="h-5 w-5 text-primary animate-spin" />
                        ) : doc.secure && !isUnlocked ? (
                          <Lock className="h-5 w-5 text-muted-foreground" />
                        ) : (
                          <Download className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
              
              {!allSecureUnlocked && (
                <div className="mt-6 p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
                  <div className="flex items-start space-x-3">
                    <Shield className="h-5 w-5 text-amber-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-amber-500 text-sm">
                        {t.documents.secureNote}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        {t.documents.secureDesc}
                      </p>
                      <button
                        onClick={handleRequestAccess}
                        className="mt-3 inline-flex items-center text-sm font-medium text-primary hover:underline"
                      >
                        {t.documents.requestAccess}
                        <ExternalLink className="h-3 w-3 ml-1" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {allSecureUnlocked && (
                <div className="mt-6 p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-green-500 text-sm">
                        {lang === 'en' ? 'Full Access Granted' : '完全アクセス許可済み'}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        {lang === 'en' 
                          ? 'All documents are available for download.' 
                          : 'すべての文書がダウンロード可能です。'}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            </div>
            
            {/* Sidebar Ad - High CPM B2B Finance */}
            <SidebarAd adSlot={AD_SLOTS.INVESTOR_SIDEBAR} />
          </div>

          {/* Patent Portfolio Preview */}
          <div className="mt-12 glass-card p-6 rounded-xl">
            <h3 className="text-lg font-semibold mb-4">
              {lang === 'en' ? 'Rubin Patent Portfolio' : 'Rubin特許ポートフォリオ'}
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              {RUBIN_PATENTS.map((patent, idx) => (
                <div key={idx} className="p-4 rounded-lg bg-muted/30">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-lg">{patent.flag}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      patent.status === 'granted' 
                        ? 'bg-green-500/20 text-green-500' 
                        : 'bg-amber-500/20 text-amber-500'
                    }`}>
                      {patent.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="text-sm font-medium mb-1">{patent.patentNumber}</div>
                  <div className="text-xs text-muted-foreground line-clamp-2">{patent.title}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Investor Contact Form */}
          <div className="mt-12">
            <InvestorContactForm lang={lang} />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-8">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-sm text-muted-foreground mb-2">
            {t.footer.rights}
          </p>
          <p className="text-xs text-muted-foreground">
            {t.footer.confidential}
          </p>
        </div>
      </footer>
    </div>
  );
}
