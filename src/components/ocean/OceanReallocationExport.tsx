import { useState, useCallback } from "react";
import { FileDown, Printer, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePrintExport } from "@/hooks/usePrintExport";
import { toast } from "sonner";

interface OceanReallocationExportProps {
  policyPosition: number;
}

const OceanReallocationExport = ({ policyPosition }: OceanReallocationExportProps) => {
  const [isExporting, setIsExporting] = useState(false);
  const {
    createDocument,
    addHeader,
    addFooter,
    addInfoBox,
    addTable,
    addSectionTitle,
    checkPageBreak,
    saveDocument,
    browserPrint,
    colors,
  } = usePrintExport();

  // Calculate TCE values
  const trustworthy = Math.max(0, 100 - policyPosition * 1.2);
  const compelling = Math.min(100, policyPosition * 1.1);
  const effortless = Math.max(0, 100 - Math.abs(50 - policyPosition) * 1.5);

  const generatePDF = useCallback(async () => {
    setIsExporting(true);
    
    try {
      const doc = createDocument({
        documentTitle: "Ocean Asset Reallocation 2026",
        orientation: "portrait",
      });

      let yPos = addHeader(
        doc,
        "Ocean Asset Reallocation 2026",
        "NOAA Strategic Pivot Analysis • Scenario Planning Report"
      );

      // Executive Summary Box
      yPos = addInfoBox(doc, yPos, [
        { label: "Report Date:", value: "January 23, 2026" },
        { label: "Classification:", value: "SCENARIO PLANNING" },
        { label: "Tiger Team Lead:", value: "Bentzi" },
        { label: "Policy Position:", value: `${policyPosition}% Extraction` },
      ]);

      // TCE Framework Analysis
      yPos = addSectionTitle(doc, yPos, "TCE FRAMEWORK ANALYSIS");
      yPos = addTable(doc, yPos, {
        head: [["Metric", "Score", "Status", "Interpretation"]],
        body: [
          [
            "Trustworthy",
            `${trustworthy.toFixed(0)}%`,
            trustworthy > 60 ? "HEALTHY" : trustworthy > 30 ? "AT RISK" : "CRITICAL",
            trustworthy > 60 ? "Public trust maintained" : "Environmental safety concerns",
          ],
          [
            "Compelling",
            `${compelling.toFixed(0)}%`,
            compelling > 70 ? "HIGH" : compelling > 40 ? "MODERATE" : "LOW",
            compelling > 70 ? "Strong revenue narrative" : "Economic case developing",
          ],
          [
            "Effortless",
            `${effortless.toFixed(0)}%`,
            effortless > 60 ? "SMOOTH" : effortless > 30 ? "FRICTION" : "BLOCKED",
            effortless > 60 ? "Policy aligned" : "Implementation challenges",
          ],
        ],
        columnStyles: {
          0: { cellWidth: 30 },
          1: { cellWidth: 20 },
          2: { cellWidth: 25 },
          3: { cellWidth: 'auto' },
        },
      });

      // Biological Stewardship (TERMINATED)
      yPos = checkPageBreak(doc, yPos, 60);
      yPos = addSectionTitle(doc, yPos, "LEGACY PROGRAM: BIOLOGICAL STEWARDSHIP");
      
      doc.setFontSize(9);
      doc.setFont("helvetica", "italic");
      doc.setTextColor(colors.ZINC_500[0], colors.ZINC_500[1], colors.ZINC_500[2]);
      doc.text("Status: TERMINATED • Shark Autonomy Network • Defunded January 2026", 14, yPos);
      yPos += 8;

      yPos = addTable(doc, yPos, {
        head: [["Metric", "Historical Value", "Change", "Data Status"]],
        body: [
          ["Species Tracked", "347", "-100%", "FROZEN"],
          ["Safety Alerts Issued", "12,847", "Historical", "ARCHIVED"],
          ["International Partners", "23", "-100%", "TERMINATED"],
          ["Research Publications", "89", "Frozen", "ARCHIVED"],
          ["Migration Data (Years)", "15", "At Risk", "NO PRESERVATION"],
        ],
      });

      // Strategic Extraction (ACCELERATING)
      yPos = checkPageBreak(doc, yPos, 70);
      yPos = addSectionTitle(doc, yPos, "NEW DIRECTION: STRATEGIC EXTRACTION");
      
      doc.setFontSize(9);
      doc.setFont("helvetica", "italic");
      doc.setTextColor(colors.ZINC_500[0], colors.ZINC_500[1], colors.ZINC_500[2]);
      doc.text("Status: ACCELERATING • Deep Sea Mining Initiative • EO-13817 Mandate", 14, yPos);
      yPos += 8;

      yPos = addTable(doc, yPos, {
        head: [["Critical Mineral", "Mapped %", "Strategic Application", "Zone Status"]],
        body: [
          ["Cobalt", "78%", "EV Batteries", "Active"],
          ["Manganese", "92%", "Steel/Defense", "Active"],
          ["Nickel", "65%", "Energy Storage", "Surveying"],
          ["Rare Earths", "41%", "Electronics", "Assessment"],
        ],
      });

      // Active Extraction Zones
      yPos = checkPageBreak(doc, yPos, 50);
      yPos = addSectionTitle(doc, yPos, "ACTIVE EXTRACTION ZONES");
      yPos = addTable(doc, yPos, {
        head: [["Zone", "Status", "Vessels", "Est. Value"]],
        body: [
          ["Pacific EEZ Alpha", "Surveying", "3", "$420B"],
          ["Gulf Stream Beta", "Mapping", "2", "$280B"],
          ["Atlantic Ridge Gamma", "Assessment", "1", "$150B"],
        ],
      });

      // Federal Research Context
      yPos = checkPageBreak(doc, yPos, 80);
      yPos = addSectionTitle(doc, yPos, "FEDERAL RESEARCH & POLICY CONTEXT");
      
      yPos = addTable(doc, yPos, {
        head: [["Source", "Reference", "Relevance"]],
        body: [
          ["Executive Order 13817", "Federal Register 2017-28156", "Critical Minerals Independence"],
          ["Project 2025 Mandate", "Heritage Foundation", "NOAA Restructuring Framework"],
          ["USGS Mineral Assessment", "Critical Minerals List 2022", "50 minerals designated critical"],
          ["DOE Supply Chain Review", "IEA Critical Minerals 2023", "Battery supply dependencies"],
          ["NOAA Budget FY2026", "Congressional Appropriations", "Shark program defunding"],
          ["ISA Deep Sea Mining", "Intl Seabed Authority", "International treaty obligations"],
        ],
      });

      // Risk Assessment
      yPos = checkPageBreak(doc, yPos, 50);
      yPos = addSectionTitle(doc, yPos, "RISK ASSESSMENT MATRIX");
      
      const ecosystemRisk = policyPosition > 80 ? "CRITICAL" : policyPosition > 60 ? "HIGH" : policyPosition > 40 ? "MEDIUM" : "LOW";
      const allyRisk = policyPosition > 80 ? "HIGH" : policyPosition > 50 ? "MEDIUM" : "LOW";
      const revenueRisk = policyPosition > 70 ? "HIGH" : policyPosition > 40 ? "MEDIUM" : "LOW";
      
      yPos = addTable(doc, yPos, {
        head: [["Risk Factor", "Level", "Impact", "Mitigation"]],
        body: [
          ["Ecosystem Collapse", ecosystemRisk, "Long-term biodiversity loss", "None proposed"],
          ["Allied Isolation", allyRisk, "NATO/EU treaty friction", "Bilateral negotiations"],
          ["Revenue Potential", revenueRisk, "Trillion-dollar industry", "Active exploitation"],
          ["Data Loss", "CRITICAL", "15 years migration patterns", "No preservation mandate"],
        ],
      });

      // Revenue Projections
      yPos = checkPageBreak(doc, yPos, 40);
      yPos = addSectionTitle(doc, yPos, "10-YEAR REVENUE PROJECTIONS");
      yPos = addTable(doc, yPos, {
        head: [["Year", "Cobalt", "Manganese", "Nickel", "Total"]],
        body: [
          ["2026", "$12B", "$18B", "$8B", "$38B"],
          ["2028", "$45B", "$62B", "$28B", "$135B"],
          ["2030", "$89B", "$124B", "$56B", "$269B"],
          ["2032", "$142B", "$198B", "$89B", "$429B"],
          ["2036", "$280B", "$390B", "$175B", "$1.2T"],
        ],
      });

      // Add footer to all pages
      addFooter(doc);

      // Save the document
      saveDocument(doc, {
        documentTitle: "Ocean Asset Reallocation 2026",
        filename: `ocean-reallocation-report-${new Date().toISOString().split('T')[0]}.pdf`,
      });

      toast.success("Stakeholder report exported successfully");
    } catch (error) {
      console.error("PDF generation error:", error);
      toast.error("Failed to generate PDF report");
    } finally {
      setIsExporting(false);
    }
  }, [policyPosition, createDocument, addHeader, addFooter, addInfoBox, addTable, addSectionTitle, checkPageBreak, saveDocument, colors, trustworthy, compelling, effortless]);

  return (
    <div className="flex items-center gap-2">
      <Button
        onClick={generatePDF}
        disabled={isExporting}
        size="sm"
        className="text-[10px] font-mono gap-1.5"
      >
        {isExporting ? (
          <Loader2 className="w-3 h-3 animate-spin" />
        ) : (
          <FileDown className="w-3 h-3" />
        )}
        Export Report
      </Button>
      <Button
        onClick={browserPrint}
        variant="ghost"
        size="sm"
        className="text-[10px] font-mono gap-1.5"
      >
        <Printer className="w-3 h-3" />
        Print
      </Button>
    </div>
  );
};

export default OceanReallocationExport;
