import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Sparkles, CheckCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface MagicLinkFormProps {
  isLoading: boolean;
  onSubmit: (email: string) => Promise<void>;
}

export function MagicLinkForm({ isLoading, onSubmit }: MagicLinkFormProps) {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(email);
    setSent(true);
  };

  if (sent) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-8 space-y-4"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', bounce: 0.5, delay: 0.2 }}
          className="w-16 h-16 mx-auto rounded-full bg-strata-emerald/10 border border-strata-emerald/30 flex items-center justify-center"
        >
          <Sparkles className="w-8 h-8 text-strata-emerald" />
        </motion.div>
        
        <div className="space-y-2">
          <h3 className="text-lg font-medium text-white">Check Your Email</h3>
          <p className="text-sm text-zinc-400 max-w-xs mx-auto">
            We sent a magic link to <span className="text-strata-emerald font-mono">{email}</span>
          </p>
        </div>

        <div className="pt-4 space-y-3">
          <div className="flex items-center justify-center gap-2 text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
            <CheckCircle className="w-3 h-3 text-strata-emerald" />
            <span>Link expires in 60 minutes</span>
          </div>
          
          <button
            type="button"
            onClick={() => setSent(false)}
            className="text-sm text-zinc-500 hover:text-strata-emerald transition-colors underline underline-offset-2"
          >
            Use a different email
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      onSubmit={handleSubmit}
      className="space-y-5"
    >
      <div className="text-center space-y-2 pb-2">
        <Sparkles className="w-6 h-6 text-amber-500 mx-auto" />
        <p className="text-sm text-zinc-400">
          No password required. We'll send you a secure login link.
        </p>
      </div>

      {/* Email Field */}
      <div className="space-y-2">
        <Label htmlFor="magic-email" className="text-xs font-mono uppercase tracking-wider text-zinc-400">
          Email Address
        </Label>
        <div className="relative group">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 transition-colors group-focus-within:text-amber-500" />
          <Input
            id="magic-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="operator@enterprise.com"
            required
            autoComplete="email"
            className={cn(
              'pl-10 h-12 bg-zinc-900/80 border-zinc-800 text-white placeholder:text-zinc-600',
              'focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20',
              'transition-all duration-300'
            )}
          />
          <div className="absolute top-0 right-0 w-2 h-2 border-r border-t border-zinc-700 group-focus-within:border-amber-500/50 transition-colors" />
        </div>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isLoading}
        className={cn(
          'w-full h-12 font-mono uppercase tracking-wider text-sm',
          'bg-amber-500 hover:bg-amber-500/90 text-zinc-950',
          'transition-all duration-300',
          'disabled:opacity-50 disabled:cursor-not-allowed'
        )}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="w-4 h-4 border-2 border-zinc-950/20 border-t-zinc-950 rounded-full"
            />
            Sending...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            Send Magic Link
          </span>
        )}
      </Button>

      {/* Security indicator */}
      <div className="flex items-center justify-center gap-2 pt-2 text-[10px] font-mono text-zinc-600 uppercase tracking-wider">
        <CheckCircle className="w-3 h-3" />
        <span>Passwordless • Secure • Instant</span>
      </div>
    </motion.form>
  );
}
