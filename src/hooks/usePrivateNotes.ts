import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface PrivateNote {
  id: string;
  user_id: string;
  page_path: string;
  content: string;
  feature_context: string | null;
  created_at: string;
  updated_at: string;
}

export function usePrivateNotes(pagePath?: string) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: notes = [], isLoading, error } = useQuery({
    queryKey: ['private-notes', pagePath, user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      let query = supabase
        .from('private_notes')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (pagePath) {
        query = query.eq('page_path', pagePath);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data as PrivateNote[];
    },
    enabled: !!user,
  });

  const addNote = useMutation({
    mutationFn: async ({ content, featureContext }: { content: string; featureContext?: string }) => {
      if (!user) throw new Error('Must be logged in');
      
      const { data, error } = await supabase
        .from('private_notes')
        .insert({
          user_id: user.id,
          page_path: pagePath || window.location.pathname,
          content,
          feature_context: featureContext || null,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['private-notes'] });
      toast.success('Note saved');
    },
    onError: (error) => {
      toast.error('Failed to save note');
      console.error(error);
    },
  });

  const updateNote = useMutation({
    mutationFn: async ({ id, content }: { id: string; content: string }) => {
      const { data, error } = await supabase
        .from('private_notes')
        .update({ content })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['private-notes'] });
      toast.success('Note updated');
    },
    onError: (error) => {
      toast.error('Failed to update note');
      console.error(error);
    },
  });

  const deleteNote = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('private_notes')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['private-notes'] });
      toast.success('Note deleted');
    },
    onError: (error) => {
      toast.error('Failed to delete note');
      console.error(error);
    },
  });

  return {
    notes,
    isLoading,
    error,
    addNote: addNote.mutate,
    updateNote: updateNote.mutate,
    deleteNote: deleteNote.mutate,
    isAddingNote: addNote.isPending,
  };
}
