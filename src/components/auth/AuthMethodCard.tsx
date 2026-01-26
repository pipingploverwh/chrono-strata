import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface AuthMethodCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  isActive?: boolean;
  onClick: () => void;
  accentColor?: 'emerald' | 'amber' | 'blue' | 'purple';
  badge?: string;
}

const accentColors = {
  emerald: {
    border: 'border-strata-emerald/40',
    bg: 'bg-strata-emerald/5',
    icon: 'text-strata-emerald',
    glow: 'shadow-strata-emerald/10',
  },
  amber: {
    border: 'border-amber-500/40',
    bg: 'bg-amber-500/5',
    icon: 'text-amber-500',
    glow: 'shadow-amber-500/10',
  },
  blue: {
    border: 'border-blue-500/40',
    bg: 'bg-blue-500/5',
    icon: 'text-blue-500',
    glow: 'shadow-blue-500/10',
  },
  purple: {
    border: 'border-purple-500/40',
    bg: 'bg-purple-500/5',
    icon: 'text-purple-500',
    glow: 'shadow-purple-500/10',
  },
};

export function AuthMethodCard({
  icon: Icon,
  title,
  description,
  isActive,
  onClick,
  accentColor = 'emerald',
  badge,
}: AuthMethodCardProps) {
  const colors = accentColors[accentColor];

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        'relative w-full p-4 rounded-lg border transition-all duration-300 text-left group',
        'bg-zinc-900/50 backdrop-blur-sm',
        isActive 
          ? `${colors.border} ${colors.bg} shadow-lg ${colors.glow}` 
          : 'border-zinc-800/50 hover:border-zinc-700'
      )}
    >
      {/* Geometric corner accent */}
      <div className={cn(
        'absolute top-0 left-0 w-3 h-3 border-l-2 border-t-2 transition-colors duration-300',
        isActive ? colors.border.replace('/40', '') : 'border-zinc-700'
      )} />
      <div className={cn(
        'absolute bottom-0 right-0 w-3 h-3 border-r-2 border-b-2 transition-colors duration-300',
        isActive ? colors.border.replace('/40', '') : 'border-zinc-700'
      )} />

      <div className="flex items-start gap-3">
        <div className={cn(
          'p-2 rounded-md transition-colors duration-300',
          isActive ? colors.bg : 'bg-zinc-800/50'
        )}>
          <Icon className={cn(
            'w-5 h-5 transition-colors duration-300',
            isActive ? colors.icon : 'text-zinc-500'
          )} />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className={cn(
              'font-medium text-sm transition-colors duration-300',
              isActive ? 'text-white' : 'text-zinc-300'
            )}>
              {title}
            </h3>
            {badge && (
              <span className="px-1.5 py-0.5 text-[9px] font-mono uppercase tracking-wider rounded bg-zinc-800 text-zinc-500">
                {badge}
              </span>
            )}
          </div>
          <p className="text-xs text-zinc-500 mt-0.5 truncate">
            {description}
          </p>
        </div>

        {/* Active indicator */}
        {isActive && (
          <motion.div
            layoutId="auth-method-indicator"
            className={cn('w-1.5 h-1.5 rounded-full', colors.icon.replace('text-', 'bg-'))}
          />
        )}
      </div>
    </motion.button>
  );
}
