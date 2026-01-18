import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, Download, Copy, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { getDocumentContent, type DocumentContent } from "./documentContents";

interface DocumentViewerProps {
  documentType: string;
  documentName: string;
  isOpen: boolean;
  onClose: () => void;
}

export function DocumentViewer({ documentType, documentName, isOpen, onClose }: DocumentViewerProps) {
  const [copied, setCopied] = useState(false);
  const content = getDocumentContent(documentType);

  const handleCopy = async () => {
    if (content?.content) {
      await navigator.clipboard.writeText(content.content);
      setCopied(true);
      toast.success("Content copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    if (content?.content) {
      const blob = new Blob([content.content], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${documentType}.md`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("Document downloaded");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ready':
        return <Badge className="bg-strata-lume/20 text-strata-lume border-strata-lume/30">Ready</Badge>;
      case 'draft':
        return <Badge className="bg-strata-orange/20 text-strata-orange border-strata-orange/30">Draft</Badge>;
      case 'template':
        return <Badge variant="outline">Template</Badge>;
      default:
        return null;
    }
  };

  // Simple markdown renderer
  const renderMarkdown = (text: string) => {
    const lines = text.split('\n');
    
    return lines.map((line, index) => {
      // Headers
      if (line.startsWith('# ')) {
        return <h1 key={index} className="text-xl font-bold text-foreground mt-4 mb-2">{line.slice(2)}</h1>;
      }
      if (line.startsWith('## ')) {
        return <h2 key={index} className="text-lg font-semibold text-foreground mt-4 mb-2">{line.slice(3)}</h2>;
      }
      if (line.startsWith('### ')) {
        return <h3 key={index} className="text-base font-semibold text-foreground mt-3 mb-1">{line.slice(4)}</h3>;
      }
      
      // Horizontal rule
      if (line.startsWith('---')) {
        return <hr key={index} className="my-4 border-border" />;
      }
      
      // Bold text
      if (line.includes('**')) {
        const parts = line.split(/\*\*(.*?)\*\*/g);
        return (
          <p key={index} className="text-sm text-foreground my-1">
            {parts.map((part, i) => 
              i % 2 === 1 ? <strong key={i}>{part}</strong> : part
            )}
          </p>
        );
      }
      
      // List items
      if (line.startsWith('- ')) {
        return <li key={index} className="text-sm text-foreground ml-4">{line.slice(2)}</li>;
      }
      if (line.match(/^\d+\. /)) {
        return <li key={index} className="text-sm text-foreground ml-4 list-decimal">{line.replace(/^\d+\. /, '')}</li>;
      }
      
      // Checkbox
      if (line.includes('☐') || line.includes('☑')) {
        return <p key={index} className="text-sm text-foreground my-1 font-mono">{line}</p>;
      }
      
      // Table detection
      if (line.startsWith('|')) {
        const cells = line.split('|').filter(c => c.trim());
        if (line.includes('---')) {
          return null; // Skip separator row
        }
        const isHeader = index > 0 && lines[index + 1]?.includes('---');
        return (
          <div key={index} className={`grid gap-2 text-sm py-1 ${isHeader ? 'font-semibold bg-muted/50' : ''}`} style={{ gridTemplateColumns: `repeat(${cells.length}, 1fr)` }}>
            {cells.map((cell, i) => (
              <span key={i} className="px-2 truncate">{cell.trim()}</span>
            ))}
          </div>
        );
      }
      
      // Regular paragraph
      if (line.trim()) {
        return <p key={index} className="text-sm text-muted-foreground my-1">{line}</p>;
      }
      
      return <br key={index} />;
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-lavender" />
              {documentName}
            </DialogTitle>
            {content && getStatusBadge(content.status)}
          </div>
          {content?.formNumber && (
            <p className="text-sm text-muted-foreground">{content.formNumber}</p>
          )}
        </DialogHeader>
        
        {content ? (
          <>
            <ScrollArea className="flex-1 max-h-[60vh] pr-4">
              <div className="prose prose-sm max-w-none dark:prose-invert">
                {renderMarkdown(content.content)}
              </div>
            </ScrollArea>
            
            <div className="flex gap-2 pt-4 border-t">
              <Button onClick={handleCopy} variant="outline" className="flex-1">
                {copied ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 mr-2 text-strata-lume" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Content
                  </>
                )}
              </Button>
              <Button onClick={handleDownload} variant="outline" className="flex-1">
                <Download className="w-4 h-4 mr-2" />
                Download Markdown
              </Button>
            </div>
          </>
        ) : (
          <div className="py-12 text-center text-muted-foreground">
            <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No pre-filled content available for this document.</p>
            <p className="text-sm mt-2">This document requires manual preparation.</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
