import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguageState, type Language } from "@/hooks/useLanguage";

const languages: { code: Language; label: string; flag: string }[] = [
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'ja', label: '日本語', flag: '🇯🇵' },
];

interface LanguageToggleProps {
  variant?: 'default' | 'compact';
  className?: string;
}

export const LanguageToggle = ({ variant = 'default', className = '' }: LanguageToggleProps) => {
  const { language, setLanguage } = useLanguageState();

  const currentLang = languages.find(l => l.code === language) || languages[0];

  if (variant === 'compact') {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setLanguage(language === 'en' ? 'ja' : 'en')}
        className={`gap-1.5 text-strata-silver hover:text-strata-white hover:bg-strata-steel/30 ${className}`}
        aria-label={`Switch to ${language === 'en' ? 'Japanese' : 'English'}`}
      >
        <Globe className="w-4 h-4" />
        <span className="font-mono text-xs">{currentLang.flag}</span>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={`gap-2 text-strata-silver hover:text-strata-white hover:bg-strata-steel/30 ${className}`}
          aria-label="Select language"
        >
          <Globe className="w-4 h-4" />
          <span className="font-mono text-xs">{currentLang.flag} {currentLang.label}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="bg-strata-charcoal border-strata-steel/30 min-w-[140px]"
      >
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className={`gap-2 cursor-pointer ${
              language === lang.code 
                ? 'bg-strata-orange/20 text-strata-orange' 
                : 'text-strata-silver hover:text-strata-white hover:bg-strata-steel/30'
            }`}
          >
            <span>{lang.flag}</span>
            <span className="font-mono text-sm">{lang.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageToggle;
