import { motion } from 'framer-motion';
import { User, Code, Briefcase } from 'lucide-react';
import { useUserRole, UserRole, ROLE_CONFIGS } from '@/hooks/useUserRole';
import { cn } from '@/lib/utils';

interface RoleSelectorProps {
  variant?: 'compact' | 'full';
  className?: string;
}

const ROLE_ICONS: Record<UserRole, React.ComponentType<{ className?: string }>> = {
  operator: User,
  technical: Code,
  executive: Briefcase,
};

export function RoleSelector({ variant = 'compact', className }: RoleSelectorProps) {
  const { role, setRole } = useUserRole();

  if (variant === 'compact') {
    return (
      <div className={cn('flex items-center gap-1 p-1 rounded-lg bg-strata-steel/10 border border-strata-steel/20', className)}>
        {(Object.keys(ROLE_CONFIGS) as UserRole[]).map((r) => {
          const Icon = ROLE_ICONS[r];
          const isActive = role === r;
          return (
            <button
              key={r}
              onClick={() => setRole(r)}
              className={cn(
                'relative px-3 py-1.5 rounded-md text-xs font-mono uppercase tracking-wider transition-all',
                isActive 
                  ? 'text-strata-white' 
                  : 'text-strata-silver/60 hover:text-strata-silver'
              )}
              aria-pressed={isActive}
              aria-label={`Switch to ${ROLE_CONFIGS[r].label} view`}
            >
              {isActive && (
                <motion.div
                  layoutId="role-indicator"
                  className="absolute inset-0 bg-strata-cyan/20 border border-strata-cyan/40 rounded-md"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                />
              )}
              <span className="relative flex items-center gap-1.5">
                <Icon className="w-3 h-3" />
                {ROLE_CONFIGS[r].label.slice(0, 4)}
              </span>
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className={cn('space-y-2', className)}>
      <div className="text-[9px] font-mono text-strata-silver/40 uppercase tracking-widest">
        View Mode
      </div>
      <div className="grid grid-cols-3 gap-2">
        {(Object.keys(ROLE_CONFIGS) as UserRole[]).map((r) => {
          const Icon = ROLE_ICONS[r];
          const config = ROLE_CONFIGS[r];
          const isActive = role === r;
          return (
            <button
              key={r}
              onClick={() => setRole(r)}
              className={cn(
                'relative p-3 rounded-lg border transition-all text-left',
                isActive 
                  ? 'bg-strata-cyan/10 border-strata-cyan/40' 
                  : 'bg-strata-steel/5 border-strata-steel/20 hover:border-strata-steel/40'
              )}
              aria-pressed={isActive}
            >
              <Icon className={cn('w-5 h-5 mb-2', isActive ? 'text-strata-cyan' : 'text-strata-silver/60')} />
              <div className={cn('text-sm font-semibold', isActive ? 'text-strata-cyan' : 'text-strata-white')}>
                {config.label}
              </div>
              <div className="text-[10px] text-strata-silver/50 font-mono mt-0.5">
                {config.description}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default RoleSelector;
