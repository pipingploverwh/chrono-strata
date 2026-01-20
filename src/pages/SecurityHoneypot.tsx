import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Json } from '@/integrations/supabase/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield, Lock, AlertTriangle, Eye, EyeOff } from 'lucide-react';

const getSessionId = (): string => {
  const key = 'honeypot_session';
  let id = sessionStorage.getItem(key);
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem(key, id);
  }
  return id;
};

const SecurityHoneypot = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(0);
  const interactionLogged = useRef(false);

  const logInteraction = async (type: string, metadata: Json = {}) => {
    try {
      await supabase.from('honeypot_logs').insert([{
        session_id: getSessionId(),
        interaction_type: type,
        attempted_username: username || null,
        attempted_password: password || null,
        user_agent: navigator.userAgent,
        referrer: document.referrer || null,
        page_path: window.location.pathname,
        metadata
      }]);
    } catch (err) {
      console.error('Logging failed:', err);
    }
  };

  useEffect(() => {
    if (!interactionLogged.current) {
      logInteraction('page_view');
      interactionLogged.current = true;
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    await logInteraction('login_attempt', {
      attempt_number: attempts + 1,
      username_length: username.length,
      password_length: password.length
    });

    // Simulate authentication delay
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));

    setAttempts(prev => prev + 1);
    setIsLoading(false);

    // Always fail with realistic error messages
    const errors = [
      'Invalid credentials. Please try again.',
      'Authentication failed. Account may be locked.',
      'Access denied. Contact system administrator.',
      'Session expired. Please refresh and try again.',
      'Too many attempts. Please wait before retrying.'
    ];
    setError(errors[Math.min(attempts, errors.length - 1)]);
  };

  const handleFieldFocus = (field: string) => {
    logInteraction('field_focus', { field });
  };

  const handlePasswordToggle = () => {
    setShowPassword(!showPassword);
    logInteraction('password_visibility_toggle', { revealed: !showPassword });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      {/* Subtle grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />
      
      <div className="relative w-full max-w-md">
        {/* Security badge */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex items-center gap-2 text-amber-500/80">
          <Shield className="w-5 h-5" />
          <span className="text-xs font-mono tracking-wider">SECURE ADMIN PORTAL</span>
        </div>

        {/* Login card */}
        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center border border-amber-500/30">
              <Lock className="w-8 h-8 text-amber-500" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-1">Admin Access</h1>
            <p className="text-slate-400 text-sm">Enterprise Control Panel</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-slate-300 text-sm">
                Username or Email
              </Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onFocus={() => handleFieldFocus('username')}
                placeholder="admin@company.com"
                className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-amber-500/50 focus:ring-amber-500/20"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-300 text-sm">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => handleFieldFocus('password')}
                  placeholder="••••••••••••"
                  className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-amber-500/50 focus:ring-amber-500/20 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={handlePasswordToggle}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-medium py-2.5"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Authenticating...
                </span>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          {/* Footer links */}
          <div className="mt-6 pt-6 border-t border-slate-700/50 flex justify-between text-xs text-slate-500">
            <button
              onClick={() => logInteraction('forgot_password_click')}
              className="hover:text-slate-400 transition-colors"
            >
              Forgot password?
            </button>
            <button
              onClick={() => logInteraction('help_click')}
              className="hover:text-slate-400 transition-colors"
            >
              Need help?
            </button>
          </div>
        </div>

        {/* Security notice */}
        <p className="text-center text-slate-600 text-xs mt-6 font-mono">
          All access attempts are monitored and logged
        </p>
      </div>
    </div>
  );
};

export default SecurityHoneypot;
