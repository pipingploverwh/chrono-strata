import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export type AuthMethod = 'email' | 'magic-link' | 'google' | 'sso';

interface AuthResult {
  success: boolean;
  error?: string;
  requiresConfirmation?: boolean;
}

export function useEnhancedAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const [currentMethod, setCurrentMethod] = useState<AuthMethod>('email');

  // Email + Password Sign In
  const signInWithEmail = async (email: string, password: string): Promise<AuthResult> => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  // Email + Password Sign Up
  const signUpWithEmail = async (email: string, password: string): Promise<AuthResult> => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
        },
      });
      if (error) throw error;
      return { success: true, requiresConfirmation: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  // Magic Link (Passwordless)
  const signInWithMagicLink = async (email: string): Promise<AuthResult> => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
        },
      });
      if (error) throw error;
      return { success: true, requiresConfirmation: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  // Google OAuth
  const signInWithGoogle = async (): Promise<AuthResult> => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`,
        },
      });
      if (error) throw error;
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  // Enterprise SSO (SAML)
  // Note: Requires Supabase Pro plan and SSO configuration
  const signInWithSSO = async (domain: string): Promise<AuthResult> => {
    setIsLoading(true);
    try {
      // First, try to find the SSO provider by domain
      const { error } = await supabase.auth.signInWithSSO({
        domain,
        options: {
          redirectTo: `${window.location.origin}/`,
        },
      });
      if (error) throw error;
      return { success: true };
    } catch (error: any) {
      // Provide helpful error for unconfigured SSO
      if (error.message?.includes('No SSO provider')) {
        return { 
          success: false, 
          error: 'SSO not configured for this domain. Contact your administrator.' 
        };
      }
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  // Sign Out
  const signOut = async (): Promise<AuthResult> => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    currentMethod,
    setCurrentMethod,
    signInWithEmail,
    signUpWithEmail,
    signInWithMagicLink,
    signInWithGoogle,
    signInWithSSO,
    signOut,
  };
}
