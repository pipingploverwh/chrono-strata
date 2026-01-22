import { useState, useEffect, useCallback } from 'react';

export type UserRole = 'operator' | 'technical' | 'executive';

interface RoleConfig {
  label: string;
  description: string;
  dataDepth: 'minimal' | 'standard' | 'full';
  showTechnicalMetrics: boolean;
  showRawData: boolean;
  showOutcomes: boolean;
}

export const ROLE_CONFIGS: Record<UserRole, RoleConfig> = {
  operator: {
    label: 'Operator',
    description: 'Tactical daily operations view',
    dataDepth: 'standard',
    showTechnicalMetrics: false,
    showRawData: false,
    showOutcomes: true,
  },
  technical: {
    label: 'Technical',
    description: 'Integration & system details',
    dataDepth: 'full',
    showTechnicalMetrics: true,
    showRawData: true,
    showOutcomes: true,
  },
  executive: {
    label: 'Executive',
    description: 'Outcomes & strategic metrics',
    dataDepth: 'minimal',
    showTechnicalMetrics: false,
    showRawData: false,
    showOutcomes: true,
  },
};

const STORAGE_KEY = 'lavandar_user_role';

export function useUserRole() {
  const [role, setRoleState] = useState<UserRole>(() => {
    if (typeof window === 'undefined') return 'operator';
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && (stored === 'operator' || stored === 'technical' || stored === 'executive')) {
      return stored as UserRole;
    }
    return 'operator';
  });

  const setRole = useCallback((newRole: UserRole) => {
    setRoleState(newRole);
    localStorage.setItem(STORAGE_KEY, newRole);
  }, []);

  const config = ROLE_CONFIGS[role];

  return {
    role,
    setRole,
    config,
    isOperator: role === 'operator',
    isTechnical: role === 'technical',
    isExecutive: role === 'executive',
  };
}

export default useUserRole;
