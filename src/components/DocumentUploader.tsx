import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, File, X, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface UploadedFile {
  name: string;
  type: string;
  content: string;
  size: number;
}

interface DocumentUploaderProps {
  onAnalysisComplete: (analysis: any) => void;
  onAnalysisStart: () => void;
}

const ACCEPTED_TYPES = {
  'application/pdf': '.pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
  'text/plain': '.txt',
  'text/markdown': '.md',
};

const DocumentUploader: React.FC<DocumentUploaderProps> = ({ onAnalysisComplete, onAnalysisStart }) => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const readFileContent = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const result = e.target?.result;
        if (typeof result === 'string') {
          resolve(result);
        } else if (result instanceof ArrayBuffer) {
          // For binary files, convert to base64 for now
          // In production, you'd use a proper parser
          const decoder = new TextDecoder('utf-8');
          resolve(decoder.decode(result));
        } else {
          reject(new Error('Failed to read file'));
        }
      };
      
      reader.onerror = () => reject(new Error('File read error'));
      
      if (file.type === 'text/plain' || file.type === 'text/markdown' || file.name.endsWith('.txt') || file.name.endsWith('.md')) {
        reader.readAsText(file);
      } else {
        // For PDF/DOCX, read as text (will need server-side parsing for real implementation)
        reader.readAsText(file);
      }
    });
  };

  const handleFiles = async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    
    for (const file of fileArray) {
      // Validate file type
      const isValidType = Object.keys(ACCEPTED_TYPES).includes(file.type) || 
        file.name.endsWith('.txt') || 
        file.name.endsWith('.md') ||
        file.name.endsWith('.pdf') ||
        file.name.endsWith('.docx');
      
      if (!isValidType) {
        toast.error(`Invalid file type: ${file.name}. Please upload PDF, DOCX, TXT, or MD files.`);
        continue;
      }
      
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast.error(`File too large: ${file.name}. Maximum size is 10MB.`);
        continue;
      }
      
      try {
        const content = await readFileContent(file);
        
        setUploadedFiles(prev => [...prev, {
          name: file.name,
          type: file.type || 'text/plain',
          content,
          size: file.size
        }]);
        
        toast.success(`Uploaded: ${file.name}`);
      } catch (error) {
        toast.error(`Failed to read: ${file.name}`);
      }
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const runAnalysis = async () => {
    if (uploadedFiles.length === 0) {
      toast.error('Please upload at least one document');
      return;
    }

    setIsAnalyzing(true);
    onAnalysisStart();
    setAnalysisProgress('Preparing documents...');

    try {
      // Combine all document contents
      const combinedContent = uploadedFiles.map(file => 
        `=== ${file.name} ===\n${file.content}`
      ).join('\n\n');

      const documentNames = uploadedFiles.map(f => f.name).join(', ');
      const documentTypes = [...new Set(uploadedFiles.map(f => {
        if (f.name.includes('sync') || f.name.includes('standup')) return 'Daily Sync';
        if (f.name.includes('retro')) return 'Retrospective';
        if (f.name.includes('sprint')) return 'Sprint Planning';
        return 'Transcript';
      }))].join(', ');

      setAnalysisProgress('Analyzing with BeenaAI...');

      const { data, error } = await supabase.functions.invoke('beena-analysis', {
        body: {
          documentContent: combinedContent,
          documentName: documentNames,
          documentType: documentTypes
        }
      });

      if (error) throw error;

      if (data.success && data.analysis) {
        setAnalysisProgress('Analysis complete!');
        toast.success('Red Team analysis generated successfully');
        onAnalysisComplete(data.analysis);
      } else {
        throw new Error(data.error || 'Analysis failed');
      }

    } catch (error: any) {
      console.error('Analysis error:', error);
      toast.error(error.message || 'Failed to analyze documents');
      setAnalysisProgress('');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getFileIcon = (name: string) => {
    if (name.endsWith('.pdf')) return <FileText className="w-5 h-5 text-red-400" />;
    if (name.endsWith('.docx')) return <FileText className="w-5 h-5 text-blue-400" />;
    return <File className="w-5 h-5 text-purple-400" />;
  };

  return (
    <div className="space-y-6">
      {/* Upload Zone */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`relative border-2 border-dashed rounded-xl p-8 transition-all duration-300 ${
          isDragging 
            ? 'border-purple-400 bg-purple-500/10' 
            : 'border-white/20 hover:border-purple-500/50 bg-white/5'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.docx,.txt,.md"
          multiple
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
          className="hidden"
        />
        
        <div className="text-center">
          <div className="inline-flex p-4 rounded-full bg-purple-500/20 mb-4">
            <Upload className={`w-8 h-8 ${isDragging ? 'text-purple-300' : 'text-purple-400'}`} />
          </div>
          
          <h3 className="text-lg font-medium text-white mb-2">
            Upload Sprint Transcripts
          </h3>
          <p className="text-sm text-white/60 mb-4">
            Drag & drop PDF, DOCX, or TXT files, or click to browse
          </p>
          
          <Button
            onClick={() => fileInputRef.current?.click()}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            Choose Files
          </Button>
          
          <p className="text-xs text-white/40 mt-4">
            Supports daily syncs, retrospectives, sprint planning notes • Max 10MB per file
          </p>
        </div>
      </motion.div>

      {/* Uploaded Files List */}
      <AnimatePresence mode="popLayout">
        {uploadedFiles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2"
          >
            <h4 className="text-sm font-medium text-white/80 mb-3">
              Uploaded Documents ({uploadedFiles.length})
            </h4>
            
            {uploadedFiles.map((file, index) => (
              <motion.div
                key={`${file.name}-${index}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10"
              >
                <div className="flex items-center gap-3">
                  {getFileIcon(file.name)}
                  <div>
                    <p className="text-sm text-white font-medium">{file.name}</p>
                    <p className="text-xs text-white/50">{formatFileSize(file.size)}</p>
                  </div>
                </div>
                
                <button
                  onClick={() => removeFile(index)}
                  className="p-1.5 rounded-full hover:bg-white/10 transition-colors"
                >
                  <X className="w-4 h-4 text-white/60 hover:text-white" />
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Analysis Button */}
      {uploadedFiles.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-3"
        >
          <Button
            onClick={runAnalysis}
            disabled={isAnalyzing}
            className="w-full py-6 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white font-medium"
          >
            {isAnalyzing ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                {analysisProgress}
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Generate Red Team Analysis
              </span>
            )}
          </Button>
          
          <p className="text-xs text-white/50 text-center">
            BeenaAI will analyze your documents for team dynamics, dependencies, and systemic issues
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default DocumentUploader;
