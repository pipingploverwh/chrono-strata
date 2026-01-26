import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
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
  Eye,
  FolderUp,
  FileSpreadsheet,
  AlertCircle
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
  
  // Bulk import state
  const [bulkImportMode, setBulkImportMode] = useState<'files' | 'csv' | null>(null);
  const [bulkFiles, setBulkFiles] = useState<File[]>([]);
  const [bulkProgress, setBulkProgress] = useState({ current: 0, total: 0, status: '' });
  const [isBulkProcessing, setIsBulkProcessing] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const bulkFileInputRef = useRef<HTMLInputElement>(null);
  const csvInputRef = useRef<HTMLInputElement>(null);

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

  // Bulk file selection handler
  const handleBulkFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(f => 
      f.type.includes('text') || f.name.endsWith('.md') || f.name.endsWith('.txt')
    );
    
    if (validFiles.length !== files.length) {
      toast.warning(`${files.length - validFiles.length} non-text files were skipped`);
    }
    
    if (validFiles.length > 0) {
      setBulkFiles(validFiles);
      setBulkImportMode('files');
      toast.success(`${validFiles.length} files ready for import`);
    }
  };

  // CSV import handler
  const handleCSVImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const csvText = await file.text();
      const lines = csvText.split('\n').filter(line => line.trim());
      
      if (lines.length < 2) {
        toast.error('CSV must have a header row and at least one data row');
        return;
      }

      const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
      const requiredHeaders = ['title', 'content'];
      const hasRequired = requiredHeaders.every(h => headers.includes(h));
      
      if (!hasRequired) {
        toast.error('CSV must have "title" and "content" columns');
        return;
      }

      // Parse CSV rows into document objects
      const documents: Array<{
        title: string;
        content: string;
        contentType: string;
        entity: string;
        authority: string;
        sourceName: string;
        sourceUrl: string;
      }> = [];

      for (let i = 1; i < lines.length; i++) {
        const values = parseCSVLine(lines[i]);
        if (values.length < headers.length) continue;

        const row: Record<string, string> = {};
        headers.forEach((h, idx) => {
          row[h] = values[idx]?.trim() || '';
        });

        if (row.title && row.content) {
          documents.push({
            title: row.title,
            content: row.content,
            contentType: row.content_type || row.contenttype || 'briefing',
            entity: row.entity || 'general',
            authority: row.authority || 'informational',
            sourceName: row.source_name || row.sourcename || '',
            sourceUrl: row.source_url || row.sourceurl || '',
          });
        }
      }

      if (documents.length === 0) {
        toast.error('No valid documents found in CSV');
        return;
      }

      setBulkImportMode('csv');
      // Store parsed documents for processing
      await processBulkDocuments(documents);
      
    } catch (error) {
      console.error('CSV parse error:', error);
      toast.error('Failed to parse CSV file');
    }
  };

  // Helper to parse CSV line (handles quoted values)
  const parseCSVLine = (line: string): string[] => {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    result.push(current);
    return result;
  };

  // Process bulk file uploads
  const processBulkFiles = async () => {
    if (bulkFiles.length === 0) return;
    
    setIsBulkProcessing(true);
    setBulkProgress({ current: 0, total: bulkFiles.length, status: 'Reading files...' });
    
    const documents: Array<{
      title: string;
      content: string;
      contentType: string;
      entity: string;
      authority: string;
      sourceName: string;
      sourceUrl: string;
    }> = [];

    // Read all files
    for (let i = 0; i < bulkFiles.length; i++) {
      const file = bulkFiles[i];
      setBulkProgress({ 
        current: i + 1, 
        total: bulkFiles.length, 
        status: `Reading: ${file.name}` 
      });
      
      try {
        const content = await file.text();
        documents.push({
          title: file.name.replace(/\.[^/.]+$/, ''),
          content,
          contentType: uploadForm.contentType,
          entity: uploadForm.entity,
          authority: uploadForm.authority,
          sourceName: '',
          sourceUrl: '',
        });
      } catch (err) {
        console.error(`Failed to read ${file.name}:`, err);
      }
    }

    await processBulkDocuments(documents);
  };

  // Core bulk processing logic
  const processBulkDocuments = async (documents: Array<{
    title: string;
    content: string;
    contentType: string;
    entity: string;
    authority: string;
    sourceName: string;
    sourceUrl: string;
  }>) => {
    setIsBulkProcessing(true);
    const total = documents.length;
    let successCount = 0;
    let failCount = 0;

    for (let i = 0; i < documents.length; i++) {
      const doc = documents[i];
      setBulkProgress({ 
        current: i + 1, 
        total, 
        status: `Uploading: ${doc.title}` 
      });

      try {
        // Insert document
        const { data: docData, error: insertError } = await supabase
          .from('intelligence_documents')
          .insert({
            title: doc.title,
            processed_text: doc.content,
            raw_content: doc.content,
            content_type: doc.contentType,
            entity: doc.entity,
            authority: doc.authority,
            source_name: doc.sourceName || null,
            source_url: doc.sourceUrl || null,
            document_date: new Date().toISOString().split('T')[0],
          })
          .select()
          .single();

        if (insertError) throw insertError;

        // Generate embedding
        setBulkProgress({ 
          current: i + 1, 
          total, 
          status: `Indexing: ${doc.title}` 
        });

        const { error: embedError } = await supabase.functions.invoke('generate-embeddings', {
          body: {
            documentId: docData.id,
            text: doc.content.slice(0, 30000),
            storeInDb: true,
          },
        });

        if (embedError) {
          console.warn(`Embedding failed for ${doc.title}:`, embedError);
        }

        successCount++;
      } catch (err) {
        console.error(`Failed to process ${doc.title}:`, err);
        failCount++;
      }
    }

    setIsBulkProcessing(false);
    setBulkFiles([]);
    setBulkImportMode(null);
    setBulkProgress({ current: 0, total: 0, status: '' });
    
    if (successCount > 0) {
      toast.success(`Successfully imported ${successCount} documents`);
    }
    if (failCount > 0) {
      toast.error(`Failed to import ${failCount} documents`);
    }
    
    fetchDocuments();
  };

  const cancelBulkImport = () => {
    setBulkFiles([]);
    setBulkImportMode(null);
    setBulkProgress({ current: 0, total: 0, status: '' });
    if (bulkFileInputRef.current) bulkFileInputRef.current.value = '';
    if (csvInputRef.current) csvInputRef.current.value = '';
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

      {/* Bulk Import Section */}
      <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-6">
        <h2 className="text-lg font-medium mb-4 flex items-center gap-2">
          <FolderUp className="w-5 h-5 text-blue-400" />
          Bulk Import
        </h2>
        
        {isBulkProcessing ? (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />
              <span className="text-sm text-neutral-300">{bulkProgress.status}</span>
            </div>
            <Progress 
              value={(bulkProgress.current / bulkProgress.total) * 100} 
              className="h-2"
            />
            <p className="text-xs text-neutral-500">
              {bulkProgress.current} of {bulkProgress.total} documents
            </p>
          </div>
        ) : bulkFiles.length > 0 ? (
          <div className="space-y-4">
            <div className="bg-neutral-800 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-4 h-4 text-blue-400" />
                <span className="text-sm font-medium">{bulkFiles.length} files selected</span>
              </div>
              <div className="max-h-32 overflow-y-auto space-y-1">
                {bulkFiles.slice(0, 10).map((f, i) => (
                  <p key={i} className="text-xs text-neutral-400 truncate">{f.name}</p>
                ))}
                {bulkFiles.length > 10 && (
                  <p className="text-xs text-neutral-500">...and {bulkFiles.length - 10} more</p>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={processBulkFiles}
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                <Upload className="w-4 h-4 mr-2" />
                Import All
              </Button>
              <Button
                onClick={cancelBulkImport}
                variant="outline"
                className="border-neutral-700 text-neutral-300"
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Multiple Files Upload */}
            <div className="border-2 border-dashed border-neutral-700 rounded-lg p-6 text-center hover:border-blue-500/50 transition-colors">
              <input
                ref={bulkFileInputRef}
                type="file"
                accept=".txt,.md"
                multiple
                onChange={handleBulkFileSelect}
                className="hidden"
              />
              <FolderUp className="w-8 h-8 text-neutral-500 mx-auto mb-2" />
              <p className="text-sm text-neutral-400 mb-2">Upload multiple files</p>
              <Button
                onClick={() => bulkFileInputRef.current?.click()}
                variant="outline"
                size="sm"
                className="border-neutral-700 text-neutral-300"
              >
                Select Files
              </Button>
            </div>
            
            {/* CSV Import */}
            <div className="border-2 border-dashed border-neutral-700 rounded-lg p-6 text-center hover:border-amber-500/50 transition-colors">
              <input
                ref={csvInputRef}
                type="file"
                accept=".csv"
                onChange={handleCSVImport}
                className="hidden"
              />
              <FileSpreadsheet className="w-8 h-8 text-neutral-500 mx-auto mb-2" />
              <p className="text-sm text-neutral-400 mb-2">Import from CSV</p>
              <Button
                onClick={() => csvInputRef.current?.click()}
                variant="outline"
                size="sm"
                className="border-neutral-700 text-neutral-300"
              >
                Upload CSV
              </Button>
              <p className="text-xs text-neutral-500 mt-2">
                Required: title, content columns
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Upload Form */}
      <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-6">
        <h2 className="text-lg font-medium mb-4 flex items-center gap-2">
          <Upload className="w-5 h-5 text-emerald-400" />
          Upload Single Document
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
