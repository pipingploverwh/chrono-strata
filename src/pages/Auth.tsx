import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Sparkles, Shield, Building2, ArrowLeft, Command, Beaker, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useEnhancedAuth, AuthMethod } from '@/hooks/useEnhancedAuth';
import { useAuth } from '@/hooks/useAuth';
import { AALGeometricBackground } from '@/components/auth/AALGeometricBackground';
import { AuthMethodCard } from '@/components/auth/AuthMethodCard';
import { EmailPasswordForm } from '@/components/auth/EmailPasswordForm';
import { MagicLinkForm } from '@/components/auth/MagicLinkForm';
import { GoogleAuthButton } from '@/components/auth/GoogleAuthButton';
import { SSOForm } from '@/components/auth/SSOForm';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const AUTH_METHODS: Array<{
  id: AuthMethod;
  icon: typeof Mail;
  title: string;
  description: string;
  accentColor: 'emerald' | 'amber' | 'blue' | 'purple';
  badge?: string;
}> = [
  {
    id: 'email',
    icon: Mail,
    title: 'Email & Password',
    description: 'Traditional secure authentication',
    accentColor: 'emerald',
  },
  {
    id: 'magic-link',
    icon: Sparkles,
    title: 'Magic Link',
    description: 'Passwordless email authentication',
    accentColor: 'amber',
  },
  {
    id: 'google',
    icon: Shield,
    title: 'Google OAuth',
    description: 'Sign in with Google Workspace',
    accentColor: 'blue',
  },
  {
    id: 'sso',
    icon: Building2,
    title: 'Enterprise SSO',
    description: 'SAML/OIDC identity provider',
    accentColor: 'purple',
    badge: 'Enterprise',
  },
];

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { user } = useAuth();
  
  const {
    isLoading,
    currentMethod,
    setCurrentMethod,
    signInWithEmail,
    signUpWithEmail,
    signInWithMagicLink,
    signInWithGoogle,
    signInWithSSO,
  } = useEnhancedAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      const from = (location.state as any)?.from?.pathname || '/admin';
      navigate(from, { replace: true });
    }
  }, [user, navigate, location]);

  // Handle email/password submission
  const handleEmailSubmit = async (email: string, password: string) => {
    const result = isLogin 
      ? await signInWithEmail(email, password)
      : await signUpWithEmail(email, password);
    
    if (result.success) {
      if (result.requiresConfirmation) {
        toast({
          title: 'Check your email',
          description: 'We sent you a confirmation link.',
        });
        setIsLogin(true);
      } else {
        toast({ title: 'Welcome back!' });
        navigate('/admin');
      }
    } else {
      toast({
        variant: 'destructive',
        title: 'Authentication Error',
        description: result.error,
      });
    }
  };

  // Handle magic link submission
  const handleMagicLinkSubmit = async (email: string) => {
    const result = await signInWithMagicLink(email);
    
    if (!result.success) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.error,
      });
    }
  };

  // Handle Google OAuth
  const handleGoogleSubmit = async () => {
    const result = await signInWithGoogle();
    
    if (!result.success) {
      toast({
        variant: 'destructive',
        title: 'Google Sign-In Error',
        description: result.error || 'Google OAuth is not configured. Contact administrator.',
      });
    }
  };

  // Handle Enterprise SSO
  const handleSSOSubmit = async (domain: string) => {
    const result = await signInWithSSO(domain);
    
    if (!result.success) {
      toast({
        variant: 'destructive',
        title: 'SSO Error',
        description: result.error,
      });
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <AALGeometricBackground />
      
      {/* R&D Labs Banner */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 bg-strata-orange/10 border-b border-strata-orange/30 backdrop-blur-sm"
      >
        <div className="container mx-auto px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-4 h-4 text-strata-orange" />
            <span className="text-xs font-mono text-strata-orange uppercase tracking-wider">
              R&D Feature — Authentication is currently inactive
            </span>
          </div>
          <Link 
            to="/labs" 
            className="flex items-center gap-2 text-xs font-mono text-strata-silver hover:text-strata-orange transition-colors"
          >
            <Beaker className="w-3 h-3" />
            <span>View in Labs</span>
          </Link>
        </div>
      </motion.div>
      
      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col lg:flex-row pt-12">
        {/* Left Panel - Branding */}
        <div className="lg:w-1/2 p-8 lg:p-16 flex flex-col justify-between">
          <div>
            {/* Back navigation */}
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-zinc-500 hover:text-strata-emerald transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm font-mono uppercase tracking-wider">Back to Home</span>
            </button>

            {/* Logo & Title */}
            <div className="mt-12 lg:mt-24">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="space-y-4"
              >
                {/* Geometric logo mark */}
                <div className="flex items-center gap-3">
                  <div className="relative w-12 h-12">
                    <div className="absolute inset-0 border-2 border-strata-emerald rotate-45" />
                    <div className="absolute inset-2 border border-strata-emerald/50 rotate-45" />
                    <Command className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 text-strata-emerald" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-light tracking-wider text-white">LAVANDAR</h1>
                    <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-zinc-500">Operations Platform</p>
                  </div>
                </div>

                <div className="pt-8 space-y-3">
                  <h2 className="text-4xl lg:text-5xl font-light text-white leading-tight">
                    {isLogin ? 'Secure Access' : 'Request Access'}
                  </h2>
                  <p className="text-lg text-zinc-400 max-w-md">
                    Enterprise-grade authentication for mission-critical operations.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="hidden lg:flex items-center gap-6 text-xs font-mono text-zinc-600 uppercase tracking-wider"
          >
            <span>© 2024 Lavandar Inc.</span>
            <span>•</span>
            <a href="/security" className="hover:text-strata-emerald transition-colors">Security</a>
            <span>•</span>
            <a href="/privacy" className="hover:text-strata-emerald transition-colors">Privacy</a>
          </motion.div>
        </div>

        {/* Right Panel - Auth Form */}
        <div className="lg:w-1/2 p-8 lg:p-16 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="w-full max-w-md"
          >
            {/* Glass card container */}
            <div className="relative">
              {/* Geometric corner accents */}
              <div className="absolute -top-2 -left-2 w-8 h-8 border-l-2 border-t-2 border-strata-emerald/30" />
              <div className="absolute -bottom-2 -right-2 w-8 h-8 border-r-2 border-b-2 border-strata-emerald/30" />
              
              <div className={cn(
                'relative p-6 lg:p-8 rounded-xl',
                'bg-zinc-900/80 backdrop-blur-xl',
                'border border-zinc-800/80',
                'shadow-2xl shadow-black/50'
              )}>
                {/* Auth method selector */}
                <div className="space-y-3 mb-6">
                  <div className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 mb-3">
                    Authentication Method
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {AUTH_METHODS.map((method) => (
                      <AuthMethodCard
                        key={method.id}
                        icon={method.icon}
                        title={method.title}
                        description={method.description}
                        accentColor={method.accentColor}
                        badge={method.badge}
                        isActive={currentMethod === method.id}
                        onClick={() => setCurrentMethod(method.id)}
                      />
                    ))}
                  </div>
                </div>

                {/* Divider */}
                <div className="relative py-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-zinc-800" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-zinc-900 px-3 text-[10px] font-mono uppercase tracking-widest text-zinc-600">
                      {AUTH_METHODS.find(m => m.id === currentMethod)?.title}
                    </span>
                  </div>
                </div>

                {/* Auth forms */}
                <AnimatePresence mode="wait">
                  {currentMethod === 'email' && (
                    <EmailPasswordForm
                      key="email"
                      isLogin={isLogin}
                      isLoading={isLoading}
                      onSubmit={handleEmailSubmit}
                      onToggleMode={() => setIsLogin(!isLogin)}
                    />
                  )}
                  
                  {currentMethod === 'magic-link' && (
                    <MagicLinkForm
                      key="magic-link"
                      isLoading={isLoading}
                      onSubmit={handleMagicLinkSubmit}
                    />
                  )}
                  
                  {currentMethod === 'google' && (
                    <GoogleAuthButton
                      key="google"
                      isLoading={isLoading}
                      onSubmit={handleGoogleSubmit}
                    />
                  )}
                  
                  {currentMethod === 'sso' && (
                    <SSOForm
                      key="sso"
                      isLoading={isLoading}
                      onSubmit={handleSSOSubmit}
                    />
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Help text */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-6 text-center text-xs text-zinc-600"
            >
              Need help accessing your account?{' '}
              <a href="mailto:support@lavandar.com" className="text-strata-emerald hover:underline">
                Contact Support
              </a>
            </motion.p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
