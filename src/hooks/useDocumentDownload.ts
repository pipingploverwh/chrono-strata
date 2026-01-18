import { useState } from 'react';
import html2pdf from 'html2pdf.js';
import { InvestorDocument, generateDocumentHTML } from '@/data/investorDocuments';

export const useDocumentDownload = () => {
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const downloadDocument = async (doc: InvestorDocument) => {
    setDownloadingId(doc.id);

    try {
      // Create temporary container
      const container = document.createElement('div');
      container.innerHTML = generateDocumentHTML(doc);
      container.style.position = 'absolute';
      container.style.left = '-9999px';
      container.style.top = '0';
      document.body.appendChild(container);

      const element = container.querySelector('#document-content');
      
      const options = {
        margin: [0.5, 0.5, 0.5, 0.5],
        filename: `LAVANDAR_${doc.id.replace(/-/g, '_')}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 2,
          useCORS: true,
          backgroundColor: '#0f0d0c'
        },
        jsPDF: { 
          unit: 'in', 
          format: 'letter', 
          orientation: 'portrait' 
        },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
      };

      await html2pdf().set(options).from(element).save();

      // Cleanup
      document.body.removeChild(container);
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setDownloadingId(null);
    }
  };

  return { downloadDocument, downloadingId };
};
