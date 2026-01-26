import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { 
  Loader2, 
  RefreshCw, 
  Upload, 
  FileText, 
  Trash2, 
  Search,
  Database,
  Zap,
  CheckCircle,
  XCircle,
  Clock,
  Eye
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface IntelligenceDocument {
  id: string;
  title: string;
  content_type: string;
  entity: string | null;
  authority: string | null;
  source_name: string | null;
  source_url: string | null;
  document_date: string | null;
  processed_text: string | null;
  embedding: string | null;
  created_at: string;
}

const contentTypes = ['briefing', 'policy', 'report', 'news', 'analysis', 'regulatory'];
const entities = ['general', 'SHHA', 'SHBT', 'market', 'regulatory', 'tech'];
const authorities = ['informational', 'official', 'binding', 'advisory'];

const RAGDocumentsTab = () => {
  const [documents, setDocuments] = useState<IntelligenceDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [entityFilter, setEntityFilter] = useState<string>('all');
  
  // Upload form state
  const [isUploading, setIsUploading] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    title: '',
    content: '',
    contentType: 'briefing',
    entity: 'general',
    authority: 'informational',
    sourceName: '',
    sourceUrl: '',
  });
  
  // Processing state
  const [processingId, setProcessingId] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('intelligence_documents')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) {
      console.error('Error fetching documents:', error);
      toast.error('Failed to fetch documents');
    } else {
      setDocuments(data || []);
    }
    setIsLoading(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Only accept text files for now
    if (!file.type.includes('text') && !file.name.endsWith('.md') && !file.name.endsWith('.txt')) {
      toast.error('Only text files (.txt, .md) are supported');
      return;
    }

    try {
      const content = await file.text();
      setUploadForm(prev => ({
        ...prev,
        title: file.name.replace(/\.[^/.]+$/, ''),
        content,
      }));
      toast.success(`Loaded: ${file.name}`);
    } catch (error) {
      toast.error('Failed to read file');
    }
  };

  const handleSubmitDocument = async () => {
    if (!uploadForm.title.trim() || !uploadForm.content.trim()) {
      toast.error('Title and content are required');
      return;
    }

    setIsUploading(true);
    try {
      // Insert the document first
      const { data: docData, error: insertError } = await supabase
        .from('intelligence_documents')
        .insert({
          title: uploadForm.title,
          processed_text: uploadForm.content,
          raw_content: uploadForm.content,
          content_type: uploadForm.contentType,
          entity: uploadForm.entity,
          authority: uploadForm.authority,
          source_name: uploadForm.sourceName || null,
          source_url: uploadForm.sourceUrl || null,
          document_date: new Date().toISOString().split('T')[0],
        })
        .select()
        .single();

      if (insertError) throw insertError;

      toast.success('Document uploaded successfully');
      
      // Reset form
      setUploadForm({
        title: '',
        content: '',
        contentType: 'briefing',
        entity: 'general',
        authority: 'informational',
        sourceName: '',
        sourceUrl: '',
      });
      
      // Refresh list
      fetchDocuments();
      
      // Auto-generate embeddings
      if (docData?.id) {
        await generateEmbeddingForDocument(docData.id, uploadForm.content);
      }
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error(error.message || 'Failed to upload document');
    } finally {
      setIsUploading(false);
    }
  };

  const generateEmbeddingForDocument = async (docId: string, text: string) => {
    setProcessingId(docId);
    try {
      const { data, error } = await supabase.functions.invoke('generate-embeddings', {
        body: {
          documentId: docId,
          text: text.slice(0, 30000), // Truncate for token limits
          storeInDb: true,
        },
      });

      if (error) throw error;

      if (data?.success) {
        toast.success('Embeddings generated successfully');
        fetchDocuments();
      } else {
        throw new Error(data?.error || 'Embedding generation failed');
      }
    } catch (error: any) {
      console.error('Embedding error:', error);
      toast.error(`Embedding failed: ${error.message}`);
    } finally {
      setProcessingId(null);
    }
  };

  const handleDeleteDocument = async (id: string) => {
    if (!confirm('Are you sure you want to delete this document?')) return;

    const { error } = await supabase
      .from('intelligence_documents')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('Failed to delete document');
    } else {
      toast.success('Document deleted');
      setDocuments(prev => prev.filter(d => d.id !== id));
    }
  };

  const filteredDocs = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.processed_text?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || doc.content_type === typeFilter;
    const matchesEntity = entityFilter === 'all' || doc.entity === entityFilter;
    return matchesSearch && matchesType && matchesEntity;
  });

  const stats = {
    total: documents.length,
    withEmbeddings: documents.filter(d => d.embedding).length,
    withoutEmbeddings: documents.filter(d => !d.embedding).length,
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-4">
          <div className="flex items-center gap-3">
            <Database className="w-8 h-8 text-blue-400" />
            <div>
              <p className="text-sm text-neutral-400">Total Documents</p>
              <p className="text-2xl font-semibold text-white">{stats.total}</p>
            </div>
          </div>
        </div>
        <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-4">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-8 h-8 text-emerald-400" />
            <div>
              <p className="text-sm text-neutral-400">Indexed (with embeddings)</p>
              <p className="text-2xl font-semibold text-white">{stats.withEmbeddings}</p>
            </div>
          </div>
        </div>
        <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-4">
          <div className="flex items-center gap-3">
            <Clock className="w-8 h-8 text-amber-400" />
            <div>
              <p className="text-sm text-neutral-400">Pending Indexing</p>
              <p className="text-2xl font-semibold text-white">{stats.withoutEmbeddings}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Upload Form */}
      <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-6">
        <h2 className="text-lg font-medium mb-4 flex items-center gap-2">
          <Upload className="w-5 h-5 text-emerald-400" />
          Upload New Document
        </h2>
        
        <div className="space-y-4">
          {/* File Upload */}
          <div className="border-2 border-dashed border-neutral-700 rounded-lg p-6 text-center hover:border-emerald-500/50 transition-colors">
            <input
              ref={fileInputRef}
              type="file"
              accept=".txt,.md"
              onChange={handleFileUpload}
              className="hidden"
            />
            <FileText className="w-10 h-10 text-neutral-500 mx-auto mb-2" />
            <p className="text-sm text-neutral-400 mb-2">Drop a .txt or .md file, or</p>
            <Button
              onClick={() => fileInputRef.current?.click()}
              variant="outline"
              size="sm"
              className="border-neutral-700 text-neutral-300"
            >
              Choose File
            </Button>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              placeholder="Document Title *"
              value={uploadForm.title}
              onChange={(e) => setUploadForm(prev => ({ ...prev, title: e.target.value }))}
              className="bg-neutral-800 border-neutral-700 text-white"
            />
            <Input
              placeholder="Source Name (optional)"
              value={uploadForm.sourceName}
              onChange={(e) => setUploadForm(prev => ({ ...prev, sourceName: e.target.value }))}
              className="bg-neutral-800 border-neutral-700 text-white"
            />
          </div>

          <Input
            placeholder="Source URL (optional)"
            value={uploadForm.sourceUrl}
            onChange={(e) => setUploadForm(prev => ({ ...prev, sourceUrl: e.target.value }))}
            className="bg-neutral-800 border-neutral-700 text-white"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select
              value={uploadForm.contentType}
              onValueChange={(v) => setUploadForm(prev => ({ ...prev, contentType: v }))}
            >
              <SelectTrigger className="bg-neutral-800 border-neutral-700 text-white">
                <SelectValue placeholder="Content Type" />
              </SelectTrigger>
              <SelectContent className="bg-neutral-800 border-neutral-700">
                {contentTypes.map(t => (
                  <SelectItem key={t} value={t} className="text-white hover:bg-neutral-700">
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={uploadForm.entity}
              onValueChange={(v) => setUploadForm(prev => ({ ...prev, entity: v }))}
            >
              <SelectTrigger className="bg-neutral-800 border-neutral-700 text-white">
                <SelectValue placeholder="Entity" />
              </SelectTrigger>
              <SelectContent className="bg-neutral-800 border-neutral-700">
                {entities.map(e => (
                  <SelectItem key={e} value={e} className="text-white hover:bg-neutral-700">
                    {e.toUpperCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={uploadForm.authority}
              onValueChange={(v) => setUploadForm(prev => ({ ...prev, authority: v }))}
            >
              <SelectTrigger className="bg-neutral-800 border-neutral-700 text-white">
                <SelectValue placeholder="Authority Level" />
              </SelectTrigger>
              <SelectContent className="bg-neutral-800 border-neutral-700">
                {authorities.map(a => (
                  <SelectItem key={a} value={a} className="text-white hover:bg-neutral-700">
                    {a.charAt(0).toUpperCase() + a.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Textarea
            placeholder="Document content (paste or load from file) *"
            value={uploadForm.content}
            onChange={(e) => setUploadForm(prev => ({ ...prev, content: e.target.value }))}
            className="bg-neutral-800 border-neutral-700 text-white min-h-[150px]"
          />

          <Button
            onClick={handleSubmitDocument}
            disabled={isUploading || !uploadForm.title || !uploadForm.content}
            className="bg-emerald-500 hover:bg-emerald-600 text-black"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Upload & Index Document
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Documents Table */}
      <div className="bg-neutral-900 rounded-xl border border-neutral-800 overflow-hidden">
        {/* Filters */}
        <div className="p-4 border-b border-neutral-800 flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 flex-1 min-w-[200px]">
            <Search className="w-4 h-4 text-neutral-500" />
            <Input
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-neutral-800 border-neutral-700 text-white"
            />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[150px] bg-neutral-800 border-neutral-700 text-white">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent className="bg-neutral-800 border-neutral-700">
              <SelectItem value="all" className="text-white hover:bg-neutral-700">All Types</SelectItem>
              {contentTypes.map(t => (
                <SelectItem key={t} value={t} className="text-white hover:bg-neutral-700">
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={entityFilter} onValueChange={setEntityFilter}>
            <SelectTrigger className="w-[150px] bg-neutral-800 border-neutral-700 text-white">
              <SelectValue placeholder="Entity" />
            </SelectTrigger>
            <SelectContent className="bg-neutral-800 border-neutral-700">
              <SelectItem value="all" className="text-white hover:bg-neutral-700">All Entities</SelectItem>
              {entities.map(e => (
                <SelectItem key={e} value={e} className="text-white hover:bg-neutral-700">
                  {e.toUpperCase()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            onClick={fetchDocuments}
            variant="outline"
            size="sm"
            className="border-neutral-700 text-neutral-300"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow className="border-neutral-800 hover:bg-transparent">
              <TableHead className="text-neutral-400">Title</TableHead>
              <TableHead className="text-neutral-400">Type</TableHead>
              <TableHead className="text-neutral-400">Entity</TableHead>
              <TableHead className="text-neutral-400">Status</TableHead>
              <TableHead className="text-neutral-400">Date</TableHead>
              <TableHead className="text-neutral-400">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <Loader2 className="w-6 h-6 text-neutral-500 animate-spin mx-auto" />
                </TableCell>
              </TableRow>
            ) : filteredDocs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-neutral-500">
                  No documents found
                </TableCell>
              </TableRow>
            ) : (
              filteredDocs.map((doc) => (
                <TableRow key={doc.id} className="border-neutral-800">
                  <TableCell className="font-medium max-w-[200px] truncate">
                    {doc.title}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="border-neutral-600 text-neutral-300">
                      {doc.content_type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="border-blue-500/30 text-blue-400">
                      {doc.entity || 'general'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {processingId === doc.id ? (
                      <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">
                        <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                        Processing
                      </Badge>
                    ) : doc.embedding ? (
                      <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Indexed
                      </Badge>
                    ) : (
                      <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                        <XCircle className="w-3 h-3 mr-1" />
                        Not Indexed
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-neutral-400 text-sm">
                    {doc.document_date ? new Date(doc.document_date).toLocaleDateString() : '-'}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {/* Preview Dialog */}
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm" className="text-neutral-400 hover:text-white">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto bg-neutral-900 border-neutral-800">
                          <DialogHeader>
                            <DialogTitle className="text-white">{doc.title}</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="flex gap-2 flex-wrap">
                              <Badge variant="outline">{doc.content_type}</Badge>
                              <Badge variant="outline">{doc.entity}</Badge>
                              <Badge variant="outline">{doc.authority}</Badge>
                            </div>
                            {doc.source_url && (
                              <a href={doc.source_url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-400 hover:underline">
                                {doc.source_name || doc.source_url}
                              </a>
                            )}
                            <div className="bg-neutral-800 rounded-lg p-4 text-sm text-neutral-300 whitespace-pre-wrap max-h-[400px] overflow-y-auto">
                              {doc.processed_text || 'No content available'}
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>

                      {/* Generate Embedding Button */}
                      {!doc.embedding && (
                        <Button
                          onClick={() => generateEmbeddingForDocument(doc.id, doc.processed_text || '')}
                          variant="ghost"
                          size="sm"
                          disabled={processingId === doc.id || !doc.processed_text}
                          className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10"
                        >
                          <Zap className="w-4 h-4" />
                        </Button>
                      )}

                      {/* Delete Button */}
                      <Button
                        onClick={() => handleDeleteDocument(doc.id)}
                        variant="ghost"
                        size="sm"
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default RAGDocumentsTab;
