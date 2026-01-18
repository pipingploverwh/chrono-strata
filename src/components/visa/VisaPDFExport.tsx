import { Button } from "@/components/ui/button";
import { FileDown, Printer } from "lucide-react";
import { format } from "date-fns";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { VisaApplication, VisaDocument, VisaInterview, VisaMilestone } from "@/hooks/useVisaApplication";

interface VisaPDFExportProps {
  application: VisaApplication | null;
  documents: VisaDocument[];
  interviews: VisaInterview[];
  milestones: VisaMilestone[];
}

const statusLabels: Record<string, string> = {
  pending: 'Pending',
  in_progress: 'In Progress',
  submitted: 'Submitted',
  approved: 'Approved',
  active: 'Active',
  completed: 'Completed',
  scheduled: 'Scheduled',
};

const phaseLabels: Record<string, string> = {
  preparation: 'Preparation',
  submitted: 'Application Submitted',
  initial_review: 'Initial 4-Month Review',
  extension: '6-Month Extension',
  residence: 'Status of Residence',
  confirmed: 'Visa Confirmed',
};

export function VisaPDFExport({ application, documents, interviews, milestones }: VisaPDFExportProps) {
  const generatePDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    let yPos = 20;

    // Header
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("Shibuya Ward Startup Visa", pageWidth / 2, yPos, { align: "center" });
    yPos += 8;
    
    doc.setFontSize(14);
    doc.setFont("helvetica", "normal");
    doc.text("Application Status Report", pageWidth / 2, yPos, { align: "center" });
    yPos += 12;

    // Applicant Info Box
    doc.setFillColor(245, 245, 250);
    doc.roundedRect(14, yPos, pageWidth - 28, 35, 3, 3, "F");
    yPos += 8;

    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("APPLICANT INFORMATION", 20, yPos);
    yPos += 7;

    doc.setFont("helvetica", "normal");
    doc.text(`Business: LAVANDAR Intelligence Platform`, 20, yPos);
    doc.text(`Field: Information Technologies`, pageWidth / 2, yPos);
    yPos += 6;
    
    doc.text(`Application Date: ${application?.application_date ? format(new Date(application.application_date), 'MMMM d, yyyy') : 'Not set'}`, 20, yPos);
    doc.text(`Current Phase: ${phaseLabels[application?.current_phase || 'preparation'] || application?.current_phase}`, pageWidth / 2, yPos);
    yPos += 6;
    
    doc.text(`Status: ${statusLabels[application?.status || 'active'] || application?.status}`, 20, yPos);
    doc.text(`Report Generated: ${format(new Date(), 'MMMM d, yyyy')}`, pageWidth / 2, yPos);
    yPos += 15;

    // Document Checklist Section
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("DOCUMENT CHECKLIST", 14, yPos);
    yPos += 5;

    const documentData = documents.map((doc, idx) => [
      (idx + 1).toString(),
      doc.document_name,
      statusLabels[doc.status] || doc.status,
      doc.due_date ? format(new Date(doc.due_date), 'MMM d, yyyy') : '-',
      doc.submitted_date ? format(new Date(doc.submitted_date), 'MMM d, yyyy') : '-',
    ]);

    autoTable(doc, {
      startY: yPos,
      head: [['#', 'Document Name', 'Status', 'Due Date', 'Submitted']],
      body: documentData,
      theme: 'striped',
      headStyles: { 
        fillColor: [139, 92, 246], // Lavender color
        fontSize: 9,
        fontStyle: 'bold',
      },
      bodyStyles: { 
        fontSize: 8,
      },
      columnStyles: {
        0: { cellWidth: 10 },
        1: { cellWidth: 70 },
        2: { cellWidth: 25 },
        3: { cellWidth: 30 },
        4: { cellWidth: 30 },
      },
      margin: { left: 14, right: 14 },
    });

    yPos = (doc as any).lastAutoTable.finalY + 15;

    // Document Summary
    const pendingCount = documents.filter(d => d.status === 'pending').length;
    const inProgressCount = documents.filter(d => d.status === 'in_progress').length;
    const submittedCount = documents.filter(d => d.status === 'submitted').length;
    const approvedCount = documents.filter(d => d.status === 'approved').length;

    doc.setFillColor(250, 250, 255);
    doc.roundedRect(14, yPos, pageWidth - 28, 20, 3, 3, "F");
    yPos += 8;

    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text("Document Summary:", 20, yPos);
    
    doc.setFont("helvetica", "normal");
    const summaryX = 60;
    doc.text(`Pending: ${pendingCount}`, summaryX, yPos);
    doc.text(`In Progress: ${inProgressCount}`, summaryX + 35, yPos);
    doc.text(`Submitted: ${submittedCount}`, summaryX + 75, yPos);
    doc.text(`Approved: ${approvedCount}`, summaryX + 115, yPos);
    yPos += 20;

    // Scheduled Interviews Section
    const upcomingInterviews = interviews.filter(i => 
      i.scheduled_date && new Date(i.scheduled_date) >= new Date()
    );

    if (upcomingInterviews.length > 0) {
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("SCHEDULED INTERVIEWS", 14, yPos);
      yPos += 5;

      const interviewData = upcomingInterviews.map((interview, idx) => [
        (idx + 1).toString(),
        interview.interview_type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
        interview.scheduled_date ? format(new Date(interview.scheduled_date), 'MMM d, yyyy h:mm a') : '-',
        interview.location || 'Shibuya Ward Office',
        statusLabels[interview.status] || interview.status,
      ]);

      autoTable(doc, {
        startY: yPos,
        head: [['#', 'Type', 'Date & Time', 'Location', 'Status']],
        body: interviewData,
        theme: 'striped',
        headStyles: { 
          fillColor: [139, 92, 246],
          fontSize: 9,
          fontStyle: 'bold',
        },
        bodyStyles: { 
          fontSize: 8,
        },
        margin: { left: 14, right: 14 },
      });

      yPos = (doc as any).lastAutoTable.finalY + 15;
    }

    // Check if we need a new page
    if (yPos > 250) {
      doc.addPage();
      yPos = 20;
    }

    // Footer
    doc.setFontSize(8);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(128, 128, 128);
    doc.text(
      "This document was generated for submission to Shibuya Ward Office, Business Support Division.",
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 20,
      { align: "center" }
    );
    doc.text(
      `Generated by LAVANDAR Intelligence Platform • ${format(new Date(), 'yyyy-MM-dd HH:mm')}`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 14,
      { align: "center" }
    );

    // Save the PDF
    const fileName = `shibuya-visa-status-${format(new Date(), 'yyyy-MM-dd')}.pdf`;
    doc.save(fileName);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex gap-2">
      <Button 
        onClick={generatePDF} 
        variant="outline" 
        className="flex items-center gap-2"
      >
        <FileDown className="w-4 h-4" />
        Export PDF
      </Button>
      <Button 
        onClick={handlePrint} 
        variant="ghost" 
        className="flex items-center gap-2"
      >
        <Printer className="w-4 h-4" />
        Print
      </Button>
    </div>
  );
}
