import { useState } from 'react';
import { motion } from 'framer-motion';
import { Building2, Shield, CheckCircle, AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface SSOFormProps {
  isLoading: boolean;
  onSubmit: (domain: string) => Promise<void>;
}

export function SSOForm({ isLoading, onSubmit }: SSOFormProps) {
  const [domain, setDomain] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Basic domain validation
    if (!domain.includes('.')) {
      setError('Please enter a valid domain (e.g., company.com)');
      return;
    }
    
    await onSubmit(domain);
  };

  // Common enterprise domains for quick selection
  const quickDomains = [
    { name: 'Okta', icon: '🔐' },
    { name: 'Azure AD', icon: '☁️' },
    { name: 'OneLogin', icon: '🔑' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-5"
    >
      <div className="text-center space-y-2 pb-2">
        <Building2 className="w-6 h-6 text-purple-500 mx-auto" />
        <p className="text-sm text-zinc-400">
          Sign in using your organization's identity provider (SAML/OIDC).
        </p>
      </div>

      {/* Supported providers */}
      <div className="flex justify-center gap-3">
        {quickDomains.map((provider) => (
          <div
            key={provider.name}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-800/50 text-xs text-zinc-400"
          >
            <span>{provider.icon}</span>
            <span>{provider.name}</span>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Domain Field */}
        <div className="space-y-2">
          <Label htmlFor="sso-domain" className="text-xs font-mono uppercase tracking-wider text-zinc-400">
            Organization Domain
          </Label>
          <div className="relative group">
            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 transition-colors group-focus-within:text-purple-500" />
            <Input
              id="sso-domain"
              type="text"
              value={domain}
              onChange={(e) => {
                setDomain(e.target.value);
                setError(null);
              }}
              placeholder="company.com"
              required
              className={cn(
                'pl-10 h-12 bg-zinc-900/80 border-zinc-800 text-white placeholder:text-zinc-600',
                'focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20',
                'transition-all duration-300',
                error && 'border-red-500/50'
              )}
            />
            <div className="absolute top-0 right-0 w-2 h-2 border-r border-t border-zinc-700 group-focus-within:border-purple-500/50 transition-colors" />
          </div>
          
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 text-xs text-red-400"
            >
              <AlertCircle className="w-3 h-3" />
              {error}
            </motion.div>
          )}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isLoading}
          className={cn(
            'w-full h-12 font-mono uppercase tracking-wider text-sm',
            'bg-purple-500 hover:bg-purple-500/90 text-white',
            'transition-all duration-300',
            'disabled:opacity-50 disabled:cursor-not-allowed'
          )}
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full"
              />
              Connecting...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Continue with SSO
            </span>
          )}
        </Button>
      </form>

      {/* Enterprise note */}
      <div className="p-3 rounded-lg bg-purple-500/5 border border-purple-500/20">
        <div className="flex items-start gap-2">
          <Shield className="w-4 h-4 text-purple-400 mt-0.5 shrink-0" />
          <div className="text-xs text-zinc-400 space-y-1">
            <p className="font-medium text-purple-300">Enterprise Feature</p>
            <p>
              SSO requires configuration by your IT administrator. 
              Contact <span className="text-purple-400 font-mono">admin@lavandar.com</span> for setup.
            </p>
          </div>
        </div>
      </div>

      {/* Security indicator */}
      <div className="flex items-center justify-center gap-2 pt-2 text-[10px] font-mono text-zinc-600 uppercase tracking-wider">
        <CheckCircle className="w-3 h-3" />
        <span>SAML 2.0 • OIDC • Enterprise Grade</span>
      </div>
    </motion.div>
  );
}
