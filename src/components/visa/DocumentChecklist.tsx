import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { 
  FileText, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Upload,
  ChevronDown,
  ChevronUp,
  Calendar,
  Eye
} from "lucide-react";
import { format, differenceInDays } from "date-fns";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { DocumentViewer } from "./DocumentViewer";
import { getDocumentContent } from "./documentContents";

interface VisaDocument {
  id: string;
  document_type: string;
  document_name: string;
  status: string;
  due_date: string | null;
  submitted_date: string | null;
  notes: string | null;
  file_url: string | null;
}

interface DocumentChecklistProps {
  documents: VisaDocument[];
  onUpdateDocument?: (id: string, updates: Partial<VisaDocument>) => void;
}

const documentCategories = [
  {
    id: 'core',
    title: 'Core Application Documents',
    description: 'Essential forms for visa application',
    documents: [
      { type: 'application_confirmation', name: 'Application for Confirmation of Business Activities' },
      { type: 'startup_confirmation', name: 'Business Startup Activities Confirmation Application' },
      { type: 'schedule', name: 'Schedule of Business Activity' },
    ]
  },
  {
    id: 'business',
    title: 'Business Plan Documents',
    description: 'Business strategy and financial projections',
    documents: [
      { type: 'executive_summary', name: 'Executive Summary' },
      { type: 'business_plan', name: 'Detailed Business Plan' },
      { type: 'financial_projections', name: 'Financial Projections (2 Years)' },
    ]
  },
  {
    id: 'identity',
    title: 'Identity & Background',
    description: 'Personal identification documents',
    documents: [
      { type: 'resume', name: 'Resume of Applicants' },
      { type: 'passport', name: 'Passport Copy' },
      { type: 'photo', name: 'Passport-style Photo' },
    ]
  },
  {
    id: 'legal',
    title: 'Legal & Compliance',
    description: 'Legal declarations and supporting documents',
    documents: [
      { type: 'pledge', name: 'Pledge Document' },
      { type: 'residence_proof', name: 'Proof of Residence in Japan' },
      { type: 'office_lease', name: 'Office Lease Agreement (if applicable)' },
    ]
  },
];

const statusConfig = {
  pending: { 
    icon: Clock, 
    color: 'bg-muted text-muted-foreground border-muted',
    label: 'Pending'
  },
  in_progress: { 
    icon: AlertCircle, 
    color: 'bg-strata-orange/20 text-strata-orange border-strata-orange/30',
    label: 'In Progress'
  },
  submitted: { 
    icon: Upload, 
    color: 'bg-lavender/20 text-lavender border-lavender/30',
    label: 'Submitted'
  },
  approved: { 
    icon: CheckCircle2, 
    color: 'bg-strata-lume/20 text-strata-lume border-strata-lume/30',
    label: 'Approved'
  },
};

export function DocumentChecklist({ documents, onUpdateDocument }: DocumentChecklistProps) {
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['core']);
  const [editingNotes, setEditingNotes] = useState<string | null>(null);
  const [viewingDocument, setViewingDocument] = useState<{ type: string; name: string } | null>(null);

  const getDocumentStatus = (type: string): VisaDocument | undefined => {
    return documents.find(d => d.document_type === type);
  };

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const getCategoryProgress = (category: typeof documentCategories[0]) => {
    const completed = category.documents.filter(doc => {
      const docStatus = getDocumentStatus(doc.type);
      return docStatus?.status === 'approved' || docStatus?.status === 'submitted';
    }).length;
    return (completed / category.documents.length) * 100;
  };

  const totalProgress = () => {
    const allDocs = documentCategories.flatMap(c => c.documents);
    const completed = allDocs.filter(doc => {
      const docStatus = getDocumentStatus(doc.type);
      return docStatus?.status === 'approved' || docStatus?.status === 'submitted';
    }).length;
    return Math.round((completed / allDocs.length) * 100);
  };

  const cycleStatus = (docType: string) => {
    const doc = getDocumentStatus(docType);
    if (!doc || !onUpdateDocument) return;
    
    const statuses = ['pending', 'in_progress', 'submitted', 'approved'];
    const currentIndex = statuses.indexOf(doc.status);
    const nextStatus = statuses[(currentIndex + 1) % statuses.length];
    onUpdateDocument(doc.id, { status: nextStatus });
  };

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-lavender" />
            Document Checklist
          </CardTitle>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">{totalProgress()}% complete</span>
            <Progress value={totalProgress()} className="w-32 h-2" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {documentCategories.map((category) => (
          <Collapsible 
            key={category.id}
            open={expandedCategories.includes(category.id)}
            onOpenChange={() => toggleCategory(category.id)}
          >
            <CollapsibleTrigger asChild>
              <div className="flex items-center justify-between p-4 rounded-lg bg-background/50 border border-border/50 cursor-pointer hover:border-border transition-colors">
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <h4 className="font-medium text-foreground">{category.title}</h4>
                    <p className="text-sm text-muted-foreground">{category.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Progress value={getCategoryProgress(category)} className="w-24 h-2" />
                  <span className="text-sm text-muted-foreground min-w-[3rem] text-right">
                    {Math.round(getCategoryProgress(category))}%
                  </span>
                  {expandedCategories.includes(category.id) 
                    ? <ChevronUp className="w-4 h-4 text-muted-foreground" />
                    : <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  }
                </div>
              </div>
            </CollapsibleTrigger>
            
            <CollapsibleContent>
              <div className="mt-2 space-y-2 pl-4">
                {category.documents.map((doc) => {
                  const docData = getDocumentStatus(doc.type);
                  const status = docData?.status || 'pending';
                  const StatusIcon = statusConfig[status as keyof typeof statusConfig]?.icon || Clock;
                  const statusStyle = statusConfig[status as keyof typeof statusConfig];
                  
                  const daysUntilDue = docData?.due_date 
                    ? differenceInDays(new Date(docData.due_date), new Date())
                    : null;

                  const hasContent = !!getDocumentContent(doc.type);

                  return (
                    <div 
                      key={doc.type}
                      className="flex items-center justify-between p-3 rounded-lg border border-border/30 bg-background/30 hover:bg-background/50 transition-colors"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <button
                          onClick={() => cycleStatus(doc.type)}
                          className="p-1 rounded hover:bg-muted/50 transition-colors"
                          title="Click to change status"
                        >
                          <StatusIcon className={`w-5 h-5 ${
                            status === 'approved' ? 'text-strata-lume' :
                            status === 'submitted' ? 'text-lavender' :
                            status === 'in_progress' ? 'text-strata-orange' :
                            'text-muted-foreground'
                          }`} />
                        </button>
                        <div className="flex-1">
                          <p className="font-medium text-sm text-foreground">{doc.name}</p>
                          {docData?.notes && (
                            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                              {docData.notes}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {hasContent && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 px-2 text-xs"
                            onClick={() => setViewingDocument({ type: doc.type, name: doc.name })}
                          >
                            <Eye className="w-3 h-3 mr-1" />
                            View
                          </Button>
                        )}
                        {daysUntilDue !== null && (
                          <div className={`flex items-center gap-1 text-xs ${
                            daysUntilDue < 0 ? 'text-destructive' :
                            daysUntilDue <= 7 ? 'text-strata-orange' :
                            'text-muted-foreground'
                          }`}>
                            <Calendar className="w-3 h-3" />
                            {daysUntilDue < 0 
                              ? `${Math.abs(daysUntilDue)}d overdue`
                              : `${daysUntilDue}d left`
                            }
                          </div>
                        )}
                        <Badge className={`${statusStyle?.color} text-xs`}>
                          {statusStyle?.label}
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CollapsibleContent>
          </Collapsible>
        ))}
      </CardContent>
      
      {/* Document Viewer Modal */}
      {viewingDocument && (
        <DocumentViewer
          documentType={viewingDocument.type}
          documentName={viewingDocument.name}
          isOpen={!!viewingDocument}
          onClose={() => setViewingDocument(null)}
        />
      )}
    </Card>
  );
}
