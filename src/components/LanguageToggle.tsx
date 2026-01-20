import { useLanguageState, type Language } from "@/hooks/useLanguage";
import { cn } from "@/lib/utils";

const languages: { code: Language; label: string; nativeLabel: string }[] = [
  { code: 'en', label: 'English', nativeLabel: 'EN' },
  { code: 'it', label: 'Italiano', nativeLabel: 'IT' },
  { code: 'fr', label: 'Français', nativeLabel: 'FR' },
  { code: 'ar', label: 'Arabic', nativeLabel: 'عربي' },
  { code: 'ja', label: 'Japanese', nativeLabel: '日本語' },
];

interface LanguageToggleProps {
  variant?: 'default' | 'compact' | 'inline';
  className?: string;
}

export const LanguageToggle = ({ variant = 'default', className = '' }: LanguageToggleProps) => {
  const { language, setLanguage } = useLanguageState();

  // Inline horizontal bar style (matches screenshot reference)
  if (variant === 'inline') {
    return (
      <div 
        className={cn(
          "flex items-center gap-0 font-mono text-sm",
          className
        )}
        role="group"
        aria-label="Select language"
      >
        {languages.map((lang, index) => (
          <button
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className={cn(
              "px-3 py-2 transition-all duration-200 relative",
              language === lang.code
                ? "text-strata-white bg-strata-steel/40 border border-strata-steel/60"
                : "text-strata-silver/70 hover:text-strata-white hover:bg-strata-steel/20 border border-transparent",
              // RTL support for Arabic
              lang.code === 'ar' && "font-sans"
            )}
            aria-label={`Switch to ${lang.label}`}
            aria-pressed={language === lang.code}
            dir={lang.code === 'ar' ? 'rtl' : 'ltr'}
          >
            {lang.nativeLabel}
          </button>
        ))}
      </div>
    );
  }

  // Compact toggle (cycles through languages)
  if (variant === 'compact') {
    const currentIndex = languages.findIndex(l => l.code === language);
    const nextIndex = (currentIndex + 1) % languages.length;
    const currentLang = languages[currentIndex] || languages[0];

    return (
      <button
        onClick={() => setLanguage(languages[nextIndex].code)}
        className={cn(
          "px-3 py-1.5 font-mono text-xs text-strata-silver hover:text-strata-white hover:bg-strata-steel/30 transition-all rounded border border-strata-steel/30",
          className
        )}
        aria-label={`Current language: ${currentLang.label}. Click to switch to ${languages[nextIndex].label}`}
      >
        {currentLang.nativeLabel}
      </button>
    );
  }

  // Default dropdown style
  return (
    <div 
      className={cn(
        "flex items-center gap-1 p-1 rounded-lg bg-strata-steel/10 border border-strata-steel/20",
        className
      )}
      role="group"
      aria-label="Select language"
    >
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => setLanguage(lang.code)}
          className={cn(
            "px-2 py-1 rounded text-xs font-mono transition-all",
            language === lang.code
              ? "bg-strata-orange/20 text-strata-orange"
              : "text-strata-silver hover:text-strata-white hover:bg-strata-steel/30",
            lang.code === 'ar' && "font-sans"
          )}
          aria-label={`Switch to ${lang.label}`}
          aria-pressed={language === lang.code}
          dir={lang.code === 'ar' ? 'rtl' : 'ltr'}
        >
          {lang.nativeLabel}
        </button>
      ))}
    </div>
  );
};

export default LanguageToggle;
