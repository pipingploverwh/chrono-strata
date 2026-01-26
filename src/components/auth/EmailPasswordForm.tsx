import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface EmailPasswordFormProps {
  isLogin: boolean;
  isLoading: boolean;
  onSubmit: (email: string, password: string) => Promise<void>;
  onToggleMode: () => void;
}

export function EmailPasswordForm({
  isLogin,
  isLoading,
  onSubmit,
  onToggleMode,
}: EmailPasswordFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(email, password);
  };

  // Password strength indicator (for signup)
  const getPasswordStrength = () => {
    if (password.length === 0) return { label: '', color: '', width: '0%' };
    if (password.length < 6) return { label: 'Weak', color: 'bg-red-500', width: '25%' };
    if (password.length < 8) return { label: 'Fair', color: 'bg-amber-500', width: '50%' };
    if (password.length < 12) return { label: 'Good', color: 'bg-strata-emerald', width: '75%' };
    return { label: 'Strong', color: 'bg-strata-emerald', width: '100%' };
  };

  const strength = getPasswordStrength();

  return (
    <motion.form
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      onSubmit={handleSubmit}
      className="space-y-5"
    >
      {/* Email Field */}
      <div className="space-y-2">
        <Label htmlFor="email" className="text-xs font-mono uppercase tracking-wider text-zinc-400">
          Email Address
        </Label>
        <div className="relative group">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 transition-colors group-focus-within:text-strata-emerald" />
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="operator@enterprise.com"
            required
            autoComplete="email"
            className={cn(
              'pl-10 h-12 bg-zinc-900/80 border-zinc-800 text-white placeholder:text-zinc-600',
              'focus:border-strata-emerald/50 focus:ring-1 focus:ring-strata-emerald/20',
              'transition-all duration-300'
            )}
          />
          {/* Geometric corner accent */}
          <div className="absolute top-0 right-0 w-2 h-2 border-r border-t border-zinc-700 group-focus-within:border-strata-emerald/50 transition-colors" />
        </div>
      </div>

      {/* Password Field */}
      <div className="space-y-2">
        <Label htmlFor="password" className="text-xs font-mono uppercase tracking-wider text-zinc-400">
          Password
        </Label>
        <div className="relative group">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 transition-colors group-focus-within:text-strata-emerald" />
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••••••"
            required
            minLength={6}
            autoComplete={isLogin ? 'current-password' : 'new-password'}
            className={cn(
              'pl-10 pr-10 h-12 bg-zinc-900/80 border-zinc-800 text-white placeholder:text-zinc-600',
              'focus:border-strata-emerald/50 focus:ring-1 focus:ring-strata-emerald/20',
              'transition-all duration-300'
            )}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
          <div className="absolute top-0 right-0 w-2 h-2 border-r border-t border-zinc-700 group-focus-within:border-strata-emerald/50 transition-colors" />
        </div>

        {/* Password strength indicator (signup only) */}
        {!isLogin && password.length > 0 && (
          <div className="space-y-1.5">
            <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: strength.width }}
                className={cn('h-full transition-all duration-300', strength.color)}
              />
            </div>
            <div className="flex justify-between items-center text-[10px] font-mono">
              <span className="text-zinc-500 uppercase tracking-wider">Strength</span>
              <span className={cn(
                'uppercase tracking-wider',
                strength.label === 'Strong' ? 'text-strata-emerald' : 'text-zinc-400'
              )}>
                {strength.label}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isLoading}
        className={cn(
          'w-full h-12 font-mono uppercase tracking-wider text-sm',
          'bg-strata-emerald hover:bg-strata-emerald/90 text-zinc-950',
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
            Processing...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            {isLogin ? 'Authenticate' : 'Create Account'}
            <ArrowRight className="w-4 h-4" />
          </span>
        )}
      </Button>

      {/* Toggle Mode */}
      <div className="pt-2 text-center">
        <button
          type="button"
          onClick={onToggleMode}
          className="text-sm text-zinc-500 hover:text-strata-emerald transition-colors"
        >
          {isLogin ? "Don't have credentials? " : 'Already registered? '}
          <span className="underline underline-offset-2">
            {isLogin ? 'Request Access' : 'Sign In'}
          </span>
        </button>
      </div>

      {/* Security indicator */}
      <div className="flex items-center justify-center gap-2 pt-2 text-[10px] font-mono text-zinc-600 uppercase tracking-wider">
        <CheckCircle className="w-3 h-3" />
        <span>256-bit TLS Encrypted</span>
      </div>
    </motion.form>
  );
}
