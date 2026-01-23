import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquarePlus, Send, Trash2, Edit2, Check, X, 
  StickyNote, Lock, ChevronDown, ChevronUp 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { usePrivateNotes } from '@/hooks/usePrivateNotes';
import { useAuth } from '@/hooks/useAuth';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

interface PrivateNotesPanelProps {
  pagePath?: string;
  featureContext?: string;
  className?: string;
}

const PrivateNotesPanel = ({ pagePath, featureContext, className = '' }: PrivateNotesPanelProps) => {
  const { user } = useAuth();
  const { notes, isLoading, addNote, updateNote, deleteNote, isAddingNote } = usePrivateNotes(pagePath);
  const [newNote, setNewNote] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [isExpanded, setIsExpanded] = useState(true);

  const handleSubmit = () => {
    if (!newNote.trim()) return;
    addNote({ content: newNote, featureContext });
    setNewNote('');
  };

  const handleEdit = (id: string, content: string) => {
    setEditingId(id);
    setEditContent(content);
  };

  const handleSaveEdit = (id: string) => {
    if (!editContent.trim()) return;
    updateNote({ id, content: editContent });
    setEditingId(null);
    setEditContent('');
  };

  if (!user) {
    return (
      <Card className={`bg-card/50 border-amber-500/20 ${className}`}>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Lock className="w-5 h-5 text-amber-500" />
            Private Notes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Sign in to leave private notes and feedback on features.
          </p>
          <Link to="/auth">
            <Button variant="outline" size="sm" className="w-full">
              Sign In to Leave Notes
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`bg-card/50 border-primary/20 ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <StickyNote className="w-5 h-5 text-primary" />
            Private Notes
            <Badge variant="outline" className="text-[10px] font-mono">
              {notes.length}
            </Badge>
          </CardTitle>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-8 w-8 p-0"
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground flex items-center gap-1">
          <Lock className="w-3 h-3" />
          Only you can see these notes
        </p>
      </CardHeader>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <CardContent className="space-y-4">
              {/* New Note Input */}
              <div className="space-y-2">
                <Textarea
                  placeholder="Leave a note about this feature..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  className="min-h-[80px] text-sm resize-none"
                />
                <div className="flex items-center justify-between">
                  {featureContext && (
                    <span className="text-[10px] text-muted-foreground font-mono">
                      Context: {featureContext}
                    </span>
                  )}
                  <Button 
                    onClick={handleSubmit} 
                    disabled={!newNote.trim() || isAddingNote}
                    size="sm"
                    className="ml-auto gap-1"
                  >
                    <Send className="w-3 h-3" />
                    Save Note
                  </Button>
                </div>
              </div>

              {/* Notes List */}
              {isLoading ? (
                <div className="text-sm text-muted-foreground text-center py-4">
                  Loading notes...
                </div>
              ) : notes.length === 0 ? (
                <div className="text-sm text-muted-foreground text-center py-4">
                  No notes yet. Add your first note above!
                </div>
              ) : (
                <div className="space-y-3 max-h-[300px] overflow-y-auto">
                  {notes.map((note) => (
                    <motion.div
                      key={note.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 bg-muted/30 rounded-lg border border-border/50"
                    >
                      {editingId === note.id ? (
                        <div className="space-y-2">
                          <Textarea
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            className="min-h-[60px] text-sm resize-none"
                          />
                          <div className="flex gap-2 justify-end">
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={() => setEditingId(null)}
                            >
                              <X className="w-3 h-3" />
                            </Button>
                            <Button 
                              size="sm"
                              onClick={() => handleSaveEdit(note.id)}
                            >
                              <Check className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <p className="text-sm whitespace-pre-wrap">{note.content}</p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-[10px] text-muted-foreground">
                              {format(new Date(note.created_at), 'MMM d, yyyy h:mm a')}
                            </span>
                            <div className="flex gap-1">
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                className="h-6 w-6 p-0"
                                onClick={() => handleEdit(note.id, note.content)}
                              >
                                <Edit2 className="w-3 h-3" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                                onClick={() => deleteNote(note.id)}
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                          {note.feature_context && (
                            <Badge variant="outline" className="mt-2 text-[9px]">
                              {note.feature_context}
                            </Badge>
                          )}
                        </>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
};

export default PrivateNotesPanel;
