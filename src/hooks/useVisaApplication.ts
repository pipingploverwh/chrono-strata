import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface VisaApplication {
  id: string;
  user_id: string;
  application_date: string | null;
  current_phase: string;
  status: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface VisaDocument {
  id: string;
  application_id: string;
  document_type: string;
  document_name: string;
  status: string;
  due_date: string | null;
  submitted_date: string | null;
  notes: string | null;
  file_url: string | null;
  created_at: string;
}

export interface VisaInterview {
  id: string;
  application_id: string;
  scheduled_date: string | null;
  interview_type: string;
  location: string;
  status: string;
  agenda: string | null;
  notes: string | null;
  outcome: string | null;
  next_actions: string[] | null;
  created_at: string;
}

export interface VisaMilestone {
  id: string;
  application_id: string;
  milestone_type: string;
  title: string;
  target_date: string | null;
  completed_date: string | null;
  status: string;
  description: string | null;
  created_at: string;
}

const defaultDocuments = [
  { type: 'application_confirmation', name: 'Application for Confirmation of Business Activities' },
  { type: 'startup_confirmation', name: 'Business Startup Activities Confirmation Application' },
  { type: 'schedule', name: 'Schedule of Business Activity' },
  { type: 'executive_summary', name: 'Executive Summary' },
  { type: 'business_plan', name: 'Detailed Business Plan' },
  { type: 'financial_projections', name: 'Financial Projections (2 Years)' },
  { type: 'resume', name: 'Resume of Applicants' },
  { type: 'passport', name: 'Passport Copy' },
  { type: 'photo', name: 'Passport-style Photo' },
  { type: 'pledge', name: 'Pledge Document' },
  { type: 'residence_proof', name: 'Proof of Residence in Japan' },
  { type: 'office_lease', name: 'Office Lease Agreement (if applicable)' },
];

export function useVisaApplication() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch or create application
  const { data: application, isLoading: isLoadingApp } = useQuery({
    queryKey: ['visa-application', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      // Try to fetch existing application
      const { data, error } = await supabase
        .from('visa_applications')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (error) throw error;
      
      // Create new application if none exists
      if (!data) {
        const { data: newApp, error: createError } = await supabase
          .from('visa_applications')
          .insert({
            user_id: user.id,
            application_date: new Date().toISOString().split('T')[0],
            current_phase: 'preparation',
            status: 'active',
          })
          .select()
          .single();
        
        if (createError) throw createError;
        
        // Create default documents
        if (newApp) {
          const docs = defaultDocuments.map(doc => ({
            application_id: newApp.id,
            document_type: doc.type,
            document_name: doc.name,
            status: 'pending',
          }));
          
          await supabase.from('visa_documents').insert(docs);
        }
        
        return newApp as VisaApplication;
      }
      
      return data as VisaApplication;
    },
    enabled: !!user?.id,
  });

  // Fetch documents
  const { data: documents = [], isLoading: isLoadingDocs } = useQuery({
    queryKey: ['visa-documents', application?.id],
    queryFn: async () => {
      if (!application?.id) return [];
      
      const { data, error } = await supabase
        .from('visa_documents')
        .select('*')
        .eq('application_id', application.id)
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      return data as VisaDocument[];
    },
    enabled: !!application?.id,
  });

  // Fetch interviews
  const { data: interviews = [], isLoading: isLoadingInterviews } = useQuery({
    queryKey: ['visa-interviews', application?.id],
    queryFn: async () => {
      if (!application?.id) return [];
      
      const { data, error } = await supabase
        .from('visa_interviews')
        .select('*')
        .eq('application_id', application.id)
        .order('scheduled_date', { ascending: true });
      
      if (error) throw error;
      return data as VisaInterview[];
    },
    enabled: !!application?.id,
  });

  // Fetch milestones
  const { data: milestones = [], isLoading: isLoadingMilestones } = useQuery({
    queryKey: ['visa-milestones', application?.id],
    queryFn: async () => {
      if (!application?.id) return [];
      
      const { data, error } = await supabase
        .from('visa_milestones')
        .select('*')
        .eq('application_id', application.id)
        .order('target_date', { ascending: true });
      
      if (error) throw error;
      return data as VisaMilestone[];
    },
    enabled: !!application?.id,
  });

  // Update document mutation
  const updateDocument = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<VisaDocument> }) => {
      const { error } = await supabase
        .from('visa_documents')
        .update(updates)
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['visa-documents'] });
      toast.success('Document updated');
    },
    onError: (error) => {
      toast.error('Failed to update document');
      console.error(error);
    },
  });

  // Add interview mutation
  const addInterview = useMutation({
    mutationFn: async (interview: Partial<VisaInterview>) => {
      if (!application?.id) throw new Error('No application');
      
      const { error } = await supabase
        .from('visa_interviews')
        .insert({
          application_id: application.id,
          ...interview,
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['visa-interviews'] });
      toast.success('Interview scheduled');
    },
    onError: (error) => {
      toast.error('Failed to schedule interview');
      console.error(error);
    },
  });

  // Update interview mutation
  const updateInterview = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<VisaInterview> }) => {
      const { error } = await supabase
        .from('visa_interviews')
        .update(updates)
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['visa-interviews'] });
      toast.success('Interview updated');
    },
    onError: (error) => {
      toast.error('Failed to update interview');
      console.error(error);
    },
  });

  // Update application mutation
  const updateApplication = useMutation({
    mutationFn: async (updates: Partial<VisaApplication>) => {
      if (!application?.id) throw new Error('No application');
      
      const { error } = await supabase
        .from('visa_applications')
        .update(updates)
        .eq('id', application.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['visa-application'] });
      toast.success('Application updated');
    },
    onError: (error) => {
      toast.error('Failed to update application');
      console.error(error);
    },
  });

  const isLoading = isLoadingApp || isLoadingDocs || isLoadingInterviews || isLoadingMilestones;

  return {
    application,
    documents,
    interviews,
    milestones,
    isLoading,
    updateDocument: (id: string, updates: Partial<VisaDocument>) => updateDocument.mutate({ id, updates }),
    addInterview: (interview: Partial<VisaInterview>) => addInterview.mutate(interview),
    updateInterview: (id: string, updates: Partial<VisaInterview>) => updateInterview.mutate({ id, updates }),
    updateApplication: (updates: Partial<VisaApplication>) => updateApplication.mutate(updates),
  };
}
