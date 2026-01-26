import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { CheckCircle } from 'lucide-react';

interface GoogleAuthButtonProps {
  isLoading: boolean;
  onSubmit: () => Promise<void>;
}

export function GoogleAuthButton({ isLoading, onSubmit }: GoogleAuthButtonProps) {
  const handleClick = async () => {
    await onSubmit();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-5"
    >
      <div className="text-center space-y-2 pb-2">
        <svg className="w-8 h-8 mx-auto" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        <p className="text-sm text-zinc-400">
          Continue with your Google Workspace account for instant access.
        </p>
      </div>

      {/* Google Sign In Button */}
      <button
        type="button"
        onClick={handleClick}
        disabled={isLoading}
        className={cn(
          'w-full h-12 flex items-center justify-center gap-3 rounded-lg',
          'bg-white hover:bg-zinc-100 text-zinc-800 font-medium',
          'transition-all duration-300',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'border border-zinc-200'
        )}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="w-4 h-4 border-2 border-zinc-300 border-t-zinc-600 rounded-full"
            />
            Redirecting...
          </span>
        ) : (
          <>
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span>Continue with Google</span>
          </>
        )}
      </button>

      {/* Divider */}
      <div className="relative py-2">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-zinc-800" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-zinc-900 px-3 text-zinc-500 font-mono uppercase tracking-wider">
            Supported Domains
          </span>
        </div>
      </div>

      {/* Supported domains hint */}
      <div className="grid grid-cols-2 gap-2 text-center">
        {['@gmail.com', '@company.com', '@workspace.io', '@enterprise.org'].map((domain) => (
          <div
            key={domain}
            className="px-2 py-1.5 rounded bg-zinc-800/50 text-[10px] font-mono text-zinc-500"
          >
            {domain}
          </div>
        ))}
      </div>

      {/* Security indicator */}
      <div className="flex items-center justify-center gap-2 pt-2 text-[10px] font-mono text-zinc-600 uppercase tracking-wider">
        <CheckCircle className="w-3 h-3" />
        <span>OAuth 2.0 • Industry Standard</span>
      </div>
    </motion.div>
  );
}
