import { useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Download, 
  Printer, 
  QrCode, 
  Layers,
  Box,
  Ruler,
  CheckCircle2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { usePrintExport } from '@/hooks/usePrintExport';
import { STRATA_PATTERN_PIECES, STRATA_COLORWAYS, STRATA_MATERIALS, STRATA_SIZES } from './data/strataShellPatterns';
import { format } from 'date-fns';

interface TechnicalBlueprintExportProps {
  terrain?: 'standard' | 'marine' | 'polar' | 'desert' | 'urban';
  selectedSize?: string;
  includePatterns?: boolean;
  includeMaterials?: boolean;
  includeSpecs?: boolean;
  className?: string;
}

export function TechnicalBlueprintExport({
  terrain = 'standard',
  selectedSize = 'M',
  includePatterns = true,
  includeMaterials = true,
  includeSpecs = true,
  className = ''
}: TechnicalBlueprintExportProps) {
  const { 
    createDocument, 
    addHeader, 
    addFooter, 
    addInfoBox, 
    addTable, 
    addSectionTitle,
    checkPageBreak,
    saveDocument,
    colors 
  } = usePrintExport();

  const colorway = STRATA_COLORWAYS[terrain];
  const sizeSpec = STRATA_SIZES.find(s => s.code === selectedSize) || STRATA_SIZES[2];

  const generateBlueprintPDF = useCallback(() => {
    const doc = createDocument({
      documentTitle: 'STRATA Shell Technical Blueprint',
      orientation: 'portrait',
    });

    let yPos = addHeader(doc, `STRATA Shell — ${colorway.name}`, 'Technical Manufacturing Blueprint');

    // QR Code placeholder (would integrate with actual QR library)
    doc.setFillColor(colors.LAVENDER_100[0], colors.LAVENDER_100[1], colors.LAVENDER_100[2]);
    doc.roundedRect(doc.internal.pageSize.getWidth() - 40, 20, 26, 26, 2, 2, 'F');
    doc.setFontSize(6);
    doc.setTextColor(colors.ZINC_500[0], colors.ZINC_500[1], colors.ZINC_500[2]);
    doc.text('SCAN FOR', doc.internal.pageSize.getWidth() - 27, 35, { align: 'center' });
    doc.text('DIGITAL', doc.internal.pageSize.getWidth() - 27, 40, { align: 'center' });

    // Product identification
    yPos = addInfoBox(doc, yPos, [
      { label: 'Product ID:', value: `STRATA-SHELL-${terrain.toUpperCase()}` },
      { label: 'Colorway:', value: colorway.name },
      { label: 'Size:', value: `${sizeSpec.code} (${sizeSpec.label})` },
      { label: 'Generated:', value: format(new Date(), "yyyy-MM-dd HH:mm 'JST'") },
    ], 2);

    // Size specifications
    if (includeSpecs) {
      yPos = checkPageBreak(doc, yPos, 60);
      yPos = addSectionTitle(doc, yPos, 'SIZE SPECIFICATIONS');
      
      yPos = addTable(doc, yPos, {
        head: [['Measurement', 'Value (inches)', 'Value (cm)']],
        body: [
          ['Chest', sizeSpec.chest.toString(), (sizeSpec.chest * 2.54).toFixed(1)],
          ['Waist', sizeSpec.waist.toString(), (sizeSpec.waist * 2.54).toFixed(1)],
          ['Body Length', sizeSpec.length.toString(), (sizeSpec.length * 2.54).toFixed(1)],
          ['Sleeve Length', sizeSpec.sleeve.toString(), (sizeSpec.sleeve * 2.54).toFixed(1)],
        ],
      });
    }

    // Pattern pieces
    if (includePatterns) {
      yPos = checkPageBreak(doc, yPos, 80);
      yPos = addSectionTitle(doc, yPos, 'PATTERN PIECES');

      const patternData = STRATA_PATTERN_PIECES.map(piece => [
        piece.name,
        piece.fabricType.charAt(0).toUpperCase() + piece.fabricType.slice(1),
        `${piece.area} sq in`,
        `${piece.seamAllowance}"`,
      ]);

      yPos = addTable(doc, yPos, {
        head: [['Piece Name', 'Fabric Type', 'Area', 'Seam Allowance']],
        body: patternData,
      });

      // Total fabric summary
      const totalArea = STRATA_PATTERN_PIECES.reduce((sum, p) => sum + p.area, 0);
      const shellArea = STRATA_PATTERN_PIECES.filter(p => p.fabricType === 'shell').reduce((sum, p) => sum + p.area, 0);
      const liningArea = STRATA_PATTERN_PIECES.filter(p => p.fabricType === 'lining').reduce((sum, p) => sum + p.area, 0);

      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(colors.ZINC_900[0], colors.ZINC_900[1], colors.ZINC_900[2]);
      doc.text(`Total Fabric Required: ${totalArea.toLocaleString()} sq in (${(totalArea / 144).toFixed(2)} sq ft)`, 14, yPos);
      yPos += 5;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(colors.ZINC_500[0], colors.ZINC_500[1], colors.ZINC_500[2]);
      doc.text(`Shell: ${shellArea} sq in | Lining: ${liningArea} sq in | Hardware: ${totalArea - shellArea - liningArea} sq in`, 14, yPos);
      yPos += 10;
    }

    // Materials specification
    if (includeMaterials) {
      yPos = checkPageBreak(doc, yPos, 60);
      yPos = addSectionTitle(doc, yPos, 'MATERIALS SPECIFICATION');

      const materialData = STRATA_MATERIALS.map(mat => [
        mat.name,
        mat.type.charAt(0).toUpperCase() + mat.type.slice(1),
        `${mat.weight} gsm`,
        mat.waterproof > 0 ? `${mat.waterproof.toLocaleString()} mm` : '—',
        mat.breathability > 0 ? `${mat.breathability.toLocaleString()} g/m²/24h` : '—',
      ]);

      yPos = addTable(doc, yPos, {
        head: [['Material', 'Type', 'Weight', 'Waterproof', 'Breathability']],
        body: materialData,
        columnStyles: {
          0: { cellWidth: 60 },
        },
      });
    }

    // Technical features
    yPos = checkPageBreak(doc, yPos, 50);
    yPos = addSectionTitle(doc, yPos, 'TECHNICAL FEATURES');

    doc.setFontSize(8);
    doc.setTextColor(colors.ZINC_900[0], colors.ZINC_900[1], colors.ZINC_900[2]);
    
    const features = [
      '• Vulcanized hydrophobic membrane with 20,000mm waterproof rating',
      '• Integrated HUD display bezel with terrain-mapped chronometer',
      '• Reinforced seam construction with sonic welding',
      '• Adjustable hood with storm-lock system',
      '• Dual cargo pockets with waterproof zippers',
      '• Reflective safety elements for low-light conditions',
    ];

    features.forEach((feature, i) => {
      doc.text(feature, 14, yPos + i * 5);
    });

    yPos += features.length * 5 + 10;

    // Manufacturing notes
    yPos = checkPageBreak(doc, yPos, 40);
    yPos = addSectionTitle(doc, yPos, 'MANUFACTURING NOTES');

    doc.setFillColor(colors.LAVENDER_100[0], colors.LAVENDER_100[1], colors.LAVENDER_100[2]);
    doc.roundedRect(14, yPos, doc.internal.pageSize.getWidth() - 28, 30, 2, 2, 'F');
    
    doc.setFontSize(8);
    doc.setTextColor(colors.ZINC_500[0], colors.ZINC_500[1], colors.ZINC_500[2]);
    doc.text('All seam allowances are included in pattern pieces. Use 0.5" seam allowance', 18, yPos + 8);
    doc.text('for shell construction, 0.375" for lining. Hardware mounting points are', 18, yPos + 14);
    doc.text('indicated with ⊕ markers. Follow grain line direction for all fabric cuts.', 18, yPos + 20);

    // Add footer to all pages
    addFooter(doc);

    // Save the document
    saveDocument(doc, {
      documentTitle: 'STRATA Shell Technical Blueprint',
      filename: `strata-shell-${terrain}-blueprint-${format(new Date(), 'yyyy-MM-dd')}.pdf`,
    });
  }, [terrain, selectedSize, includePatterns, includeMaterials, includeSpecs, colorway, sizeSpec, createDocument, addHeader, addFooter, addInfoBox, addTable, addSectionTitle, checkPageBreak, saveDocument, colors]);

  return (
    <div className={`bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-zinc-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-lavender-600/20 rounded-lg">
              <FileText className="w-5 h-5 text-lavender-400" />
            </div>
            <div>
              <h3 className="text-white font-semibold">Technical Blueprint Export</h3>
              <p className="text-zinc-500 text-sm">Generate PDF documentation for manufacturing</p>
            </div>
          </div>
          <Badge className="bg-zinc-800 text-zinc-300 font-mono">
            {colorway.name}
          </Badge>
        </div>
      </div>

      {/* Export options */}
      <div className="p-4 space-y-4">
        {/* Preview cards */}
        <div className="grid grid-cols-3 gap-3">
          <motion.div
            className={`p-4 rounded-xl border ${includePatterns ? 'bg-lavender-600/10 border-lavender-500/30' : 'bg-zinc-800/50 border-zinc-700'} cursor-pointer transition-colors`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Layers className={`w-6 h-6 mb-2 ${includePatterns ? 'text-lavender-400' : 'text-zinc-500'}`} />
            <h4 className="text-white text-sm font-medium">Pattern Pieces</h4>
            <p className="text-zinc-500 text-xs mt-1">{STRATA_PATTERN_PIECES.length} pieces</p>
          </motion.div>

          <motion.div
            className={`p-4 rounded-xl border ${includeMaterials ? 'bg-lavender-600/10 border-lavender-500/30' : 'bg-zinc-800/50 border-zinc-700'} cursor-pointer transition-colors`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Box className={`w-6 h-6 mb-2 ${includeMaterials ? 'text-lavender-400' : 'text-zinc-500'}`} />
            <h4 className="text-white text-sm font-medium">Materials</h4>
            <p className="text-zinc-500 text-xs mt-1">{STRATA_MATERIALS.length} specifications</p>
          </motion.div>

          <motion.div
            className={`p-4 rounded-xl border ${includeSpecs ? 'bg-lavender-600/10 border-lavender-500/30' : 'bg-zinc-800/50 border-zinc-700'} cursor-pointer transition-colors`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Ruler className={`w-6 h-6 mb-2 ${includeSpecs ? 'text-lavender-400' : 'text-zinc-500'}`} />
            <h4 className="text-white text-sm font-medium">Size Specs</h4>
            <p className="text-zinc-500 text-xs mt-1">Size {selectedSize}</p>
          </motion.div>
        </div>

        {/* Export summary */}
        <div className="p-4 bg-zinc-800/50 rounded-xl">
          <div className="flex items-center justify-between mb-3">
            <span className="text-zinc-400 text-sm">Document Preview</span>
            <div className="flex items-center gap-2 text-xs text-zinc-500">
              <QrCode className="w-3 h-3" />
              Includes digital QR link
            </div>
          </div>
          
          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2 text-zinc-300">
              <CheckCircle2 className="w-3 h-3 text-green-500" />
              LAVANDAR branded header with JST timestamp
            </div>
            <div className="flex items-center gap-2 text-zinc-300">
              <CheckCircle2 className="w-3 h-3 text-green-500" />
              Pattern piece inventory with fabric requirements
            </div>
            <div className="flex items-center gap-2 text-zinc-300">
              <CheckCircle2 className="w-3 h-3 text-green-500" />
              Materials specification with technical ratings
            </div>
            <div className="flex items-center gap-2 text-zinc-300">
              <CheckCircle2 className="w-3 h-3 text-green-500" />
              Manufacturing notes and seam allowances
            </div>
          </div>
        </div>

        {/* Export buttons */}
        <div className="flex gap-3">
          <Button
            onClick={generateBlueprintPDF}
            className="flex-1 bg-lavender-600 hover:bg-lavender-700 text-white font-medium"
          >
            <Download className="w-4 h-4 mr-2" />
            Export Blueprint PDF
          </Button>
          
          <Button
            variant="outline"
            className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
            onClick={() => window.print()}
          >
            <Printer className="w-4 h-4 mr-2" />
            Print
          </Button>
        </div>
      </div>
    </div>
  );
}

export default TechnicalBlueprintExport;
