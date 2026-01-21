import { format } from 'date-fns';
import type { UsePrintExportReturn } from '@/hooks/usePrintExport';

export interface OrderReceiptData {
  orderId: string;
  orderDate: Date;
  customerName?: string;
  customerEmail: string;
  
  // Product details
  productName: string;
  productVariant?: string;
  paymentMode: 'annual' | 'bond' | 'tactical';
  
  // Pricing
  basePrice: number;
  depositAmount?: number;
  totalPaid: number;
  currency?: string;
  
  // Additional items
  accessories?: { name: string; price: number }[];
  
  // Status
  status: 'pending' | 'processing' | 'completed' | 'shipped';
}

/**
 * Generates a branded order receipt PDF using the LAVANDAR print system
 */
export function generateOrderReceipt(
  printExport: UsePrintExportReturn,
  data: OrderReceiptData
) {
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
  } = printExport;

  const config = {
    documentTitle: 'Order Receipt',
    filename: `lavandar-receipt-${data.orderId}.pdf`,
  };

  const doc = createDocument(config);
  let yPos = addHeader(doc, 'Acquisition Receipt', `Order #${data.orderId}`);

  // Order info box
  yPos = addInfoBox(doc, yPos, [
    { label: 'Order ID', value: data.orderId },
    { label: 'Date', value: format(data.orderDate, "yyyy-MM-dd HH:mm 'JST'") },
    { label: 'Customer', value: data.customerName || data.customerEmail },
    { label: 'Email', value: data.customerEmail },
    { label: 'Status', value: data.status.toUpperCase() },
    { label: 'Payment Mode', value: formatPaymentMode(data.paymentMode) },
  ]);

  // Product details section
  yPos = checkPageBreak(doc, yPos, 60);
  yPos = addSectionTitle(doc, yPos, 'ACQUISITION DETAILS');

  const productRows: (string | number)[][] = [
    [data.productName, data.productVariant || '-', 1, formatCurrency(data.basePrice, data.currency)],
  ];

  if (data.accessories && data.accessories.length > 0) {
    data.accessories.forEach(acc => {
      productRows.push([acc.name, 'Accessory', 1, formatCurrency(acc.price, data.currency)]);
    });
  }

  yPos = addTable(doc, yPos, {
    head: [['Item', 'Variant', 'Qty', 'Amount']],
    body: productRows,
    columnStyles: {
      0: { cellWidth: 70 },
      1: { cellWidth: 40 },
      2: { cellWidth: 20 },
      3: { cellWidth: 35 },
    },
  });

  // Payment summary
  yPos = checkPageBreak(doc, yPos, 50);
  yPos = addSectionTitle(doc, yPos, 'PAYMENT SUMMARY');

  const paymentRows: (string | number)[][] = [];
  
  if (data.paymentMode === 'tactical' && data.depositAmount) {
    paymentRows.push(['Deposit (10%)', formatCurrency(data.depositAmount, data.currency)]);
    paymentRows.push(['Balance Due', formatCurrency(data.basePrice - data.depositAmount, data.currency)]);
  }
  
  paymentRows.push(['TOTAL PAID', formatCurrency(data.totalPaid, data.currency)]);

  yPos = addTable(doc, yPos, {
    head: [['Description', 'Amount']],
    body: paymentRows,
    columnStyles: {
      0: { cellWidth: 120 },
      1: { cellWidth: 45 },
    },
  });

  // Terms notice
  yPos = checkPageBreak(doc, yPos, 30);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(colors.ZINC_500[0], colors.ZINC_500[1], colors.ZINC_500[2]);
  
  const terms = getPaymentTerms(data.paymentMode);
  const splitTerms = doc.splitTextToSize(terms, doc.internal.pageSize.getWidth() - 28);
  doc.text(splitTerms, 14, yPos);

  // Footer
  addFooter(doc);

  // Save
  saveDocument(doc, config);
}

function formatPaymentMode(mode: 'annual' | 'bond' | 'tactical'): string {
  const labels = {
    annual: 'Annual Access (Century Protocol)',
    bond: 'STRATA Bond (Legacy)',
    tactical: 'Tactical Provision (Pre-Order)',
  };
  return labels[mode];
}

function formatCurrency(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

function getPaymentTerms(mode: 'annual' | 'bond' | 'tactical'): string {
  const terms = {
    annual: 'Annual subscription renews automatically. Cancel anytime before renewal date.',
    bond: 'One-time legacy purchase. Lifetime access to STRATA network included.',
    tactical: 'Deposit secures manufacturing queue position. Balance due upon fabrication completion. Estimated delivery: 8-12 weeks.',
  };
  return `TERMS: ${terms[mode]}`;
}
