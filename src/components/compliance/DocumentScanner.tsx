import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Camera, 
  Upload, 
  FileText, 
  Loader2, 
  Check, 
  AlertCircle,
  X,
  Scan,
  Copy
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface DocumentScannerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onExtractedText?: (text: string) => void;
}

export function DocumentScanner({ open, onOpenChange, onExtractedText }: DocumentScannerProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedText, setExtractedText] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/') && file.type !== 'application/pdf') {
      setError('Please upload an image or PDF file');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB');
      return;
    }

    setError(null);
    setIsProcessing(true);
    setExtractedText(null);

    try {
      // Convert to base64
      const reader = new FileReader();
      reader.onload = async (event) => {
        const base64 = event.target?.result as string;
        setPreviewImage(base64);

        // Call OCR edge function
        const { data, error: ocrError } = await supabase.functions.invoke('ai-ocr', {
          body: { imageBase64: base64 }
        });

        if (ocrError) throw ocrError;

        if (data?.text) {
          setExtractedText(data.text);
          toast.success('Document scanned successfully');
        } else if (data?.error) {
          throw new Error(data.error);
        }
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error('OCR error:', err);
      setError(err instanceof Error ? err.message : 'Failed to process document');
      toast.error('Failed to scan document');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopyText = () => {
    if (extractedText) {
      navigator.clipboard.writeText(extractedText);
      toast.success('Text copied to clipboard');
    }
  };

  const handleUseText = () => {
    if (extractedText && onExtractedText) {
      onExtractedText(extractedText);
      onOpenChange(false);
      resetState();
    }
  };

  const resetState = () => {
    setExtractedText(null);
    setPreviewImage(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { onOpenChange(v); if (!v) resetState(); }}>
      <DialogContent className="sm:max-w-2xl bg-neutral-900 border-neutral-800 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            <Scan className="w-5 h-5 text-cyan-400" />
            Document Scanner (OCR)
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Upload Area */}
          {!previewImage && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="border-2 border-dashed border-neutral-700 rounded-xl p-8 text-center hover:border-cyan-500/50 transition-colors cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,application/pdf"
                onChange={handleFileSelect}
                className="hidden"
              />
              <Upload className="w-10 h-10 text-neutral-500 mx-auto mb-3" />
              <p className="text-neutral-400 mb-1">
                Drop a document or click to upload
              </p>
              <p className="text-xs text-neutral-600">
                Supports images and PDFs up to 10MB
              </p>
            </motion.div>
          )}

          {/* Preview & Results */}
          {previewImage && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Image Preview */}
              <div className="relative">
                <img
                  src={previewImage}
                  alt="Document preview"
                  className="w-full h-64 object-contain rounded-lg bg-neutral-950"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 bg-neutral-900/80"
                  onClick={resetState}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Extracted Text */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-400 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Extracted Text
                  </span>
                  {extractedText && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleCopyText}
                      className="text-xs"
                    >
                      <Copy className="w-3 h-3 mr-1" />
                      Copy
                    </Button>
                  )}
                </div>

                {isProcessing ? (
                  <div className="h-48 flex items-center justify-center bg-neutral-950 rounded-lg">
                    <div className="text-center">
                      <Loader2 className="w-6 h-6 animate-spin text-cyan-400 mx-auto mb-2" />
                      <p className="text-sm text-neutral-500">Processing document...</p>
                    </div>
                  </div>
                ) : extractedText ? (
                  <Textarea
                    value={extractedText}
                    onChange={(e) => setExtractedText(e.target.value)}
                    className="h-48 bg-neutral-950 border-neutral-800 text-sm font-mono resize-none"
                    placeholder="Extracted text will appear here..."
                  />
                ) : error ? (
                  <div className="h-48 flex items-center justify-center bg-red-950/20 rounded-lg border border-red-900/50">
                    <div className="text-center">
                      <AlertCircle className="w-6 h-6 text-red-400 mx-auto mb-2" />
                      <p className="text-sm text-red-400">{error}</p>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          )}

          {/* Actions */}
          <AnimatePresence>
            {extractedText && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center justify-end gap-3 pt-2"
              >
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="border-neutral-700"
                >
                  <Camera className="w-4 h-4 mr-2" />
                  Scan Another
                </Button>
                {onExtractedText && (
                  <Button
                    onClick={handleUseText}
                    className="bg-cyan-600 hover:bg-cyan-700"
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Use This Text
                  </Button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
}
