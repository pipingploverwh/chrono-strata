import React from 'react';
import { Button, type ButtonProps } from '@/components/ui/button';
import { FileDown, Printer, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PrintButtonProps extends Omit<ButtonProps, 'onClick'> {
  onPrint: () => void;
  label?: string;
  icon?: 'download' | 'printer' | 'document';
}

/**
 * PrintButton - Standardized print/export button with LAVANDAR styling
 */
export function PrintButton({
  onPrint,
  label = 'Export PDF',
  icon = 'download',
  variant = 'outline',
  size = 'default',
  className,
  ...props
}: PrintButtonProps) {
  const IconComponent = {
    download: FileDown,
    printer: Printer,
    document: FileText,
  }[icon];

  return (
    <Button
      onClick={onPrint}
      variant={variant}
      size={size}
      className={cn('gap-2', className)}
      {...props}
    >
      <IconComponent className="w-4 h-4" />
      {label}
    </Button>
  );
}

/**
 * PrintButtonGroup - Combined PDF export and browser print buttons
 */
export function PrintButtonGroup({
  onExportPDF,
  onBrowserPrint,
  pdfLabel = 'Export PDF',
  printLabel = 'Print',
  className,
}: {
  onExportPDF: () => void;
  onBrowserPrint?: () => void;
  pdfLabel?: string;
  printLabel?: string;
  className?: string;
}) {
  return (
    <div className={cn('flex gap-2', className)}>
      <PrintButton
        onPrint={onExportPDF}
        label={pdfLabel}
        icon="download"
        variant="outline"
      />
      {onBrowserPrint && (
        <PrintButton
          onPrint={onBrowserPrint}
          label={printLabel}
          icon="printer"
          variant="ghost"
        />
      )}
    </div>
  );
}

/**
 * InlinePrintButton - Minimal icon-only print button for tight spaces
 */
export function InlinePrintButton({
  onPrint,
  tooltip = 'Export PDF',
  className,
}: {
  onPrint: () => void;
  tooltip?: string;
  className?: string;
}) {
  return (
    <button
      onClick={onPrint}
      title={tooltip}
      className={cn(
        'p-2 rounded-md transition-colors',
        'text-muted-foreground hover:text-foreground hover:bg-muted',
        className
      )}
    >
      <FileDown className="w-4 h-4" />
    </button>
  );
}
