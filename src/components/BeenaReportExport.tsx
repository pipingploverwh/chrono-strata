import React, { useState } from 'react';
import { Download, FileText, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import jsPDF from 'jspdf';

interface Analysis {
  verdict: string;
  sourceDocuments?: string[];
  teamAnalysis?: Array<{
    team: string;
    role: string;
    posture: string;
    signals: string[];
    operatingModel: Record<string, string>;
  }>;
  crossDocumentSynthesis?: Array<{
    title: string;
    observation: string;
    implication: string;
  }>;
  redTeamFindings?: Array<{
    id: string;
    title: string;
    category: string;
    finding: string;
    risk: string;
    severity: string;
  }>;
  counterfactuals?: Array<{
    scenario: string;
    description: string;
    expectedMetrics: string[];
    disprovingSignal: string;
    conclusion: string;
  }>;
  interventions?: Array<{
    step: number;
    title: string;
    description: string;
  }>;
  keyInsight?: string;
}

interface BeenaReportExportProps {
  analysis: Analysis;
}

const BeenaReportExport: React.FC<BeenaReportExportProps> = ({ analysis }) => {
  const [isExporting, setIsExporting] = useState(false);

  const wrapText = (doc: jsPDF, text: string, maxWidth: number): string[] => {
    const lines: string[] = [];
    const words = text.split(' ');
    let currentLine = '';

    words.forEach(word => {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const width = doc.getTextWidth(testLine);
      
      if (width > maxWidth) {
        if (currentLine) lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    });
    
    if (currentLine) lines.push(currentLine);
    return lines;
  };

  const exportToPDF = async () => {
    setIsExporting(true);
    
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 20;
      const contentWidth = pageWidth - (margin * 2);
      let yPosition = margin;

      const checkPageBreak = (neededHeight: number) => {
        if (yPosition + neededHeight > pageHeight - margin) {
          doc.addPage();
          yPosition = margin;
          return true;
        }
        return false;
      };

      // Header
      doc.setFillColor(88, 28, 135); // Purple
      doc.rect(0, 0, pageWidth, 45, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(24);
      doc.setFont('helvetica', 'bold');
      doc.text('BeenaAI Red Team Analysis', margin, 25);
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Generated: ${new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })}`, margin, 35);

      yPosition = 55;

      // Executive Summary Box
      doc.setFillColor(254, 226, 226); // Light red
      doc.setDrawColor(239, 68, 68); // Red border
      doc.roundedRect(margin, yPosition, contentWidth, 35, 3, 3, 'FD');
      
      doc.setTextColor(127, 29, 29); // Dark red
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text('RED TEAM VERDICT', margin + 8, yPosition + 12);
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      const verdictLines = wrapText(doc, analysis.verdict, contentWidth - 16);
      verdictLines.slice(0, 3).forEach((line, i) => {
        doc.text(line, margin + 8, yPosition + 22 + (i * 5));
      });

      yPosition += 45;

      // Source Documents
      if (analysis.sourceDocuments?.length) {
        doc.setTextColor(107, 114, 128);
        doc.setFontSize(9);
        doc.text(`Sources: ${analysis.sourceDocuments.join(', ')}`, margin, yPosition);
        yPosition += 10;
      }

      // Section: Key Insight
      if (analysis.keyInsight) {
        checkPageBreak(30);
        
        doc.setFillColor(236, 253, 245); // Light green
        doc.roundedRect(margin, yPosition, contentWidth, 25, 3, 3, 'F');
        
        doc.setTextColor(6, 95, 70); // Dark green
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text('KEY INSIGHT', margin + 8, yPosition + 10);
        
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        const insightLines = wrapText(doc, analysis.keyInsight, contentWidth - 16);
        insightLines.slice(0, 2).forEach((line, i) => {
          doc.text(line, margin + 8, yPosition + 18 + (i * 4));
        });
        
        yPosition += 35;
      }

      // Section: Team Analysis
      if (analysis.teamAnalysis?.length) {
        checkPageBreak(20);
        
        doc.setTextColor(88, 28, 135);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Team Analysis', margin, yPosition);
        yPosition += 10;

        analysis.teamAnalysis.forEach(team => {
          checkPageBreak(40);
          
          doc.setFillColor(249, 250, 251);
          doc.roundedRect(margin, yPosition, contentWidth, 35, 2, 2, 'F');
          
          doc.setTextColor(17, 24, 39);
          doc.setFontSize(11);
          doc.setFont('helvetica', 'bold');
          doc.text(team.team, margin + 5, yPosition + 10);
          
          // Role badge
          const roleColor = team.role === 'downstream' ? [59, 130, 246] : team.role === 'upstream' ? [249, 115, 22] : [34, 197, 94];
          doc.setFillColor(roleColor[0], roleColor[1], roleColor[2]);
          doc.setTextColor(255, 255, 255);
          doc.setFontSize(8);
          const roleX = margin + 5 + doc.getTextWidth(team.team) + 5;
          doc.roundedRect(roleX, yPosition + 5, 25, 8, 2, 2, 'F');
          doc.text(team.role.toUpperCase(), roleX + 3, yPosition + 10);
          
          doc.setTextColor(107, 114, 128);
          doc.setFontSize(9);
          doc.setFont('helvetica', 'normal');
          const postureLines = wrapText(doc, team.posture, contentWidth - 10);
          postureLines.slice(0, 2).forEach((line, i) => {
            doc.text(line, margin + 5, yPosition + 18 + (i * 4));
          });
          
          // Signals
          if (team.signals?.length) {
            doc.setTextColor(75, 85, 99);
            doc.setFontSize(8);
            team.signals.slice(0, 2).forEach((signal, i) => {
              doc.text(`• ${signal.substring(0, 60)}${signal.length > 60 ? '...' : ''}`, margin + 5, yPosition + 28 + (i * 4));
            });
          }
          
          yPosition += 42;
        });
      }

      // Section: Red Team Findings
      if (analysis.redTeamFindings?.length) {
        checkPageBreak(20);
        
        doc.setTextColor(88, 28, 135);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Red Team Findings', margin, yPosition);
        yPosition += 10;

        analysis.redTeamFindings.forEach((finding, index) => {
          checkPageBreak(45);
          
          // Severity color
          const severityColors: Record<string, number[]> = {
            critical: [254, 226, 226],
            high: [255, 237, 213],
            medium: [254, 249, 195],
            low: [220, 252, 231]
          };
          const bgColor = severityColors[finding.severity] || [243, 244, 246];
          
          doc.setFillColor(bgColor[0], bgColor[1], bgColor[2]);
          doc.roundedRect(margin, yPosition, contentWidth, 40, 2, 2, 'F');
          
          // Finding ID and Title
          doc.setTextColor(17, 24, 39);
          doc.setFontSize(10);
          doc.setFont('helvetica', 'bold');
          doc.text(`${finding.id}: ${finding.title}`, margin + 5, yPosition + 10);
          
          // Severity badge
          const severityTextColors: Record<string, number[]> = {
            critical: [127, 29, 29],
            high: [154, 52, 18],
            medium: [133, 77, 14],
            low: [22, 101, 52]
          };
          const textColor = severityTextColors[finding.severity] || [75, 85, 99];
          doc.setTextColor(textColor[0], textColor[1], textColor[2]);
          doc.setFontSize(8);
          const severityX = pageWidth - margin - 25;
          doc.text(finding.severity.toUpperCase(), severityX, yPosition + 10);
          
          // Category
          doc.setTextColor(139, 92, 246);
          doc.setFontSize(8);
          doc.setFont('helvetica', 'normal');
          doc.text(finding.category.replace(/-/g, ' ').toUpperCase(), margin + 5, yPosition + 17);
          
          // Finding text
          doc.setTextColor(75, 85, 99);
          doc.setFontSize(9);
          const findingLines = wrapText(doc, finding.finding, contentWidth - 10);
          findingLines.slice(0, 2).forEach((line, i) => {
            doc.text(line, margin + 5, yPosition + 24 + (i * 4));
          });
          
          // Risk
          doc.setTextColor(185, 28, 28);
          doc.setFontSize(8);
          doc.setFont('helvetica', 'italic');
          const riskLines = wrapText(doc, `Risk: ${finding.risk}`, contentWidth - 10);
          doc.text(riskLines[0], margin + 5, yPosition + 36);
          
          yPosition += 48;
        });
      }

      // Section: Minimum Viable Interventions
      if (analysis.interventions?.length) {
        checkPageBreak(40);
        
        doc.setTextColor(88, 28, 135);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Minimum Viable Interventions', margin, yPosition);
        yPosition += 10;

        analysis.interventions.forEach((intervention) => {
          checkPageBreak(25);
          
          doc.setFillColor(243, 232, 255); // Light purple
          doc.roundedRect(margin, yPosition, contentWidth, 20, 2, 2, 'F');
          
          // Step number
          doc.setTextColor(139, 92, 246);
          doc.setFontSize(16);
          doc.setFont('helvetica', 'bold');
          doc.text(String(intervention.step).padStart(2, '0'), margin + 5, yPosition + 14);
          
          // Title and description
          doc.setTextColor(17, 24, 39);
          doc.setFontSize(10);
          doc.setFont('helvetica', 'bold');
          doc.text(intervention.title, margin + 25, yPosition + 10);
          
          doc.setTextColor(107, 114, 128);
          doc.setFontSize(9);
          doc.setFont('helvetica', 'normal');
          doc.text(intervention.description.substring(0, 80), margin + 25, yPosition + 17);
          
          yPosition += 25;
        });
      }

      // Footer on last page
      doc.setTextColor(156, 163, 175);
      doc.setFontSize(8);
      doc.text('BeenaAI Sprint Analysis • Red Team Lens • Confidential', pageWidth / 2, pageHeight - 10, { align: 'center' });

      // Save
      const fileName = `beena-redteam-analysis-${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(fileName);
      
      toast.success('PDF exported successfully');
    } catch (error) {
      console.error('PDF export error:', error);
      toast.error('Failed to export PDF');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Button
      onClick={exportToPDF}
      disabled={isExporting}
      className="bg-purple-600 hover:bg-purple-700 text-white"
    >
      {isExporting ? (
        <span className="flex items-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin" />
          Generating PDF...
        </span>
      ) : (
        <span className="flex items-center gap-2">
          <Download className="w-4 h-4" />
          Export Executive Brief
        </span>
      )}
    </Button>
  );
};

export default BeenaReportExport;
