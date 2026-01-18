import { Shield, TrendingUp, FileText, Award } from 'lucide-react';

export interface RubinPatent {
  flag: string;
  patentNumber: string;
  title: string;
  inventor: string;
  status: 'granted' | 'pending';
  filingDate: string;
  grantDate?: string;
  application: string;
}

export const RUBIN_PATENTS: RubinPatent[] = [
  {
    flag: '🇺🇸',
    patentNumber: 'US 10,082,945',
    title: 'Systems and Methods for Dynamically Providing Information Upon Detection of Exit Intent',
    inventor: 'Benzion Rubin',
    status: 'granted',
    filingDate: 'September 2015',
    grantDate: 'September 2018',
    application: 'Exit-intent detection for donor retention and stakeholder engagement'
  },
  {
    flag: '🇮🇱',
    patentNumber: 'IL Pending',
    title: 'System and Method for Algorithmic Refereeing in Sports',
    inventor: 'Benzion Rubin',
    status: 'pending',
    filingDate: 'March 2024',
    application: 'AI-powered sports officiating and decision validation'
  },
  {
    flag: '🌐',
    patentNumber: 'PCT/IL2024/050892',
    title: 'AI-Based Motion Analysis for Athletic Performance',
    inventor: 'Benzion Rubin',
    status: 'pending',
    filingDate: 'August 2024',
    application: 'Real-time biomechanical analysis and injury prevention'
  }
];

export interface DocumentSection {
  title: string;
  content: string[];
}

export interface InvestorDocument {
  id: string;
  title: string;
  type: string;
  size: string;
  secure: boolean;
  icon: typeof FileText;
  sections: DocumentSection[];
}

export const INVESTOR_DOCUMENTS: InvestorDocument[] = [
  {
    id: 'pitch-deck',
    title: 'Investor Pitch Deck',
    type: 'PDF',
    size: '2.4 MB',
    secure: true,
    icon: TrendingUp,
    sections: [
      {
        title: 'LAVANDAR™ Investor Presentation',
        content: [
          'Sovereign Weather Intelligence Platform',
          'Series A Funding Round',
          'January 2026'
        ]
      },
      {
        title: 'The Problem',
        content: [
          'Weather-critical industries lose $2.1B annually to poor forecasting decisions.',
          'Current solutions lack real-time predictive intelligence.',
          'No unified platform for cross-sector weather operations.',
          'Defense and aerospace sectors require sovereign, secure solutions.'
        ]
      },
      {
        title: 'The Solution',
        content: [
          'LAVANDAR™: AI-powered weather intelligence platform.',
          'STRATA command architecture for multi-sector operations.',
          'Patent-protected behavioral detection technology.',
          'Real-time predictive analytics with 84.7%+ accuracy.'
        ]
      },
      {
        title: 'Patent Portfolio',
        content: RUBIN_PATENTS.map(p =>
          `${p.flag} ${p.patentNumber} - ${p.title} (${p.status.toUpperCase()})`
        )
      },
      {
        title: 'Market Opportunity',
        content: [
          'Total Addressable Market: $47B (Defense Intelligence)',
          'Serviceable Market: $8.2B (Predictive Analytics for Defense)',
          'Initial Target: $500M (Weather-Critical Operations)',
          'STRATA verticals: Aviation, Marine, Construction, Events, Defense'
        ]
      },
      {
        title: 'Business Model',
        content: [
          'SaaS Subscription Tiers:',
          '• Observer: $0/mo - Basic weather intelligence',
          '• Operator: $29/mo - Full STRATA dashboard access',
          '• Commander: $99/mo - AI predictions, API access, priority support',
          'Enterprise & Government Contracts: Custom pricing'
        ]
      },
      {
        title: 'Traction',
        content: [
          'Algorithm Confidence: 84.7%+ accuracy',
          'Kraft Group Partnership: NFL weather intelligence validation',
          'Active Platform: Live STRATA command dashboards',
          'Patent Portfolio: 3 patents (1 granted, 2 pending)'
        ]
      },
      {
        title: 'The Team',
        content: [
          'Benzion Rubin - Exit Intent Technology Inventor (US 10,082,945)',
          'Lavandar.ai Research Division - AI/ML & Defense Systems',
          'Advisory: Kraft Group validation partnership'
        ]
      },
      {
        title: 'Use of Funds',
        content: [
          '40% - Engineering & AI Development',
          '25% - Sales & Enterprise GTM',
          '20% - Defense Certifications & Compliance',
          '15% - Operations & Infrastructure'
        ]
      },
      {
        title: 'Investment Terms',
        content: [
          'Raising: Series A',
          'Target: $100M valuation',
          'Structure: Preferred equity with standard protections',
          'Contact: investors@lavandar.ai'
        ]
      }
    ]
  },
  {
    id: 'whitepaper',
    title: 'Technical Whitepaper (Rubin Patents)',
    type: 'PDF',
    size: '12.8 MB',
    secure: true,
    icon: FileText,
    sections: [
      {
        title: 'LAVANDAR™ Technical Architecture',
        content: [
          'Proprietary Intelligence Platform',
          'Patent-Protected Technology Stack',
          'Version 2.0 - January 2026'
        ]
      },
      {
        title: 'Executive Summary',
        content: [
          'LAVANDAR™ is a sovereign AI platform designed for high-stakes aerospace and defense applications.',
          'The platform integrates patented behavioral detection systems with real-time predictive intelligence.',
          'Core innovations are protected by the Rubin patent portfolio spanning exit-intent detection,',
          'algorithmic refereeing, and AI-based motion analysis technologies.'
        ]
      },
      {
        title: 'Patent Portfolio Analysis',
        content: [
          '═══════════════════════════════════════════════════════════',
          '',
          ...RUBIN_PATENTS.flatMap(p => [
            `${p.flag} ${p.patentNumber}`,
            `Title: ${p.title}`,
            `Inventor: ${p.inventor}`,
            `Status: ${p.status.toUpperCase()}`,
            `Filed: ${p.filingDate}${p.grantDate ? ` | Granted: ${p.grantDate}` : ''}`,
            `Application: ${p.application}`,
            ''
          ])
        ]
      },
      {
        title: 'Core Technology: Exit Intent Detection (US 10,082,945)',
        content: [
          'The foundational patent covers systems and methods for dynamically providing information',
          'upon detection of user exit intent. Key innovations include:',
          '',
          '• Real-time mouse movement and scroll behavior analysis',
          '• Predictive modeling of user abandonment patterns',
          '• Dynamic content delivery based on behavioral triggers',
          '• Integration with retention and conversion optimization systems',
          '',
          'LAVANDAR Application: Donor retention, funding continuity, and stakeholder engagement',
          'optimization for defense and enterprise clients.'
        ]
      },
      {
        title: 'STRATA Architecture',
        content: [
          'STRATA (Strategic Threat Response and Tactical Analytics) provides unified intelligence across:',
          '',
          '• Aviation Operations - Flight safety and GPS integrity monitoring',
          '• Marine Logistics - Weather-critical shipping and port operations',
          '• Construction Planning - Project timeline optimization',
          '• Event Management - Large-scale venue weather intelligence',
          '• Defense Systems - IRON LOGIX electronic warfare detection'
        ]
      },
      {
        title: 'AI/ML Pipeline',
        content: [
          'Model Architecture:',
          '• Ensemble learning with temporal attention mechanisms',
          '• Real-time inference with <100ms latency targets',
          '• Confidence scoring with 84.7%+ validated accuracy',
          '',
          'Training Data:',
          '• 10+ years historical weather data',
          '• GPS integrity incident databases',
          '• Proprietary behavioral datasets (exit-intent patterns)'
        ]
      },
      {
        title: 'Security & Compliance',
        content: [
          '• SOC 2 Type II certification pathway',
          '• FedRAMP authorization planning',
          '• ITAR compliance for defense applications',
          '• End-to-end encryption with AES-256',
          '• Zero-trust architecture implementation'
        ]
      },
      {
        title: 'Integration APIs',
        content: [
          'RESTful and GraphQL APIs available for:',
          '• Weather intelligence feeds',
          '• Predictive analytics endpoints',
          '• Alert and notification systems',
          '• Custom dashboard embedding',
          '',
          'Rate Limits: 10K-1M requests/month by tier'
        ]
      }
    ]
  },
  {
    id: 'financials',
    title: 'Financial Projections FY26-28',
    type: 'PDF',
    size: '1.5 MB',
    secure: true,
    icon: TrendingUp,
    sections: [
      {
        title: 'LAVANDAR™ Financial Projections',
        content: [
          'Fiscal Years 2026-2028',
          'Confidential - For Qualified Investors Only'
        ]
      },
      {
        title: 'Revenue Projections',
        content: [
          'FY2026:',
          '• SaaS Revenue: $2.4M',
          '• Enterprise Contracts: $1.8M',
          '• Total Revenue: $4.2M',
          '',
          'FY2027:',
          '• SaaS Revenue: $8.1M',
          '• Enterprise Contracts: $6.2M',
          '• Government Contracts: $3.5M',
          '• Total Revenue: $17.8M',
          '',
          'FY2028:',
          '• SaaS Revenue: $22.4M',
          '• Enterprise Contracts: $18.6M',
          '• Government Contracts: $12.8M',
          '• Total Revenue: $53.8M'
        ]
      },
      {
        title: 'Key Metrics',
        content: [
          'Customer Acquisition Cost (CAC): $2,400 (blended)',
          'Lifetime Value (LTV): $28,800',
          'LTV:CAC Ratio: 12:1',
          'Gross Margin: 78%',
          'Net Revenue Retention: 125%'
        ]
      },
      {
        title: 'Unit Economics by Tier',
        content: [
          'Observer (Free):',
          '• Conversion to paid: 8.2%',
          '• Average time to upgrade: 45 days',
          '',
          'Operator ($29/mo):',
          '• Churn rate: 4.2%/month',
          '• Expansion revenue: 22%',
          '',
          'Commander ($99/mo):',
          '• Churn rate: 1.8%/month',
          '• Expansion revenue: 35%'
        ]
      },
      {
        title: 'Path to Profitability',
        content: [
          'Break-even: Q3 FY2027',
          'Cash runway post-Series A: 24 months',
          'Target EBITDA margin by FY2028: 18%'
        ]
      }
    ]
  },
  {
    id: 'kraft-validation',
    title: 'Kraft Group Validation Report',
    type: 'PDF',
    size: '3.1 MB',
    secure: false,
    icon: Award,
    sections: [
      {
        title: 'Kraft Group Partnership Validation',
        content: [
          'LAVANDAR™ Weather Intelligence Case Study',
          'NFL Stadium Operations - Gillette Stadium'
        ]
      },
      {
        title: 'Engagement Overview',
        content: [
          'Partner: The Kraft Group (New England Patriots, Gillette Stadium)',
          'Duration: 2024-2025 NFL Season',
          'Scope: Weather intelligence for game-day operations',
          'Status: Active partnership'
        ]
      },
      {
        title: 'Challenge',
        content: [
          'NFL game operations require precise weather forecasting for:',
          '• Player safety decisions',
          '• Fan experience optimization',
          '• Broadcast and media planning',
          '• Concession and merchandise operations',
          '• Parking and traffic management'
        ]
      },
      {
        title: 'LAVANDAR Solution',
        content: [
          'Deployed STRATA Events module with:',
          '• 72-hour predictive weather modeling',
          '• Real-time condition monitoring',
          '• Automated alert systems for operations teams',
          '• Integration with venue management systems'
        ]
      },
      {
        title: 'Results',
        content: [
          '• Prediction Accuracy: 87.3% for game-day conditions',
          '• Alert Response Time: <5 minutes to operations',
          '• Operational Efficiency: 23% improvement in weather-related decisions',
          '• Zero weather-related safety incidents during trial period'
        ]
      },
      {
        title: 'Testimonial',
        content: [
          '"LAVANDAR\'s weather intelligence platform has transformed how we approach',
          'game-day operations. The predictive capabilities allow us to make proactive',
          'decisions that improve both safety and fan experience."',
          '',
          '- Stadium Operations, Gillette Stadium'
        ]
      },
      {
        title: 'IP Integration',
        content: [
          'This validation demonstrates practical application of:',
          '',
          `${RUBIN_PATENTS[0].flag} ${RUBIN_PATENTS[0].patentNumber}`,
          'Exit-intent technology adapted for operational decision triggers,',
          'predicting when weather conditions will cause fan departure patterns',
          'and enabling proactive venue management responses.'
        ]
      }
    ]
  }
];

export const generateDocumentHTML = (doc: InvestorDocument): string => {
  const sections = doc.sections.map(section => `
    <div style="margin-bottom: 32px;">
      <h2 style="font-size: 18px; font-weight: 600; color: #c9a227; margin-bottom: 16px; border-bottom: 1px solid #333; padding-bottom: 8px;">
        ${section.title}
      </h2>
      ${section.content.map(line => 
        line === '' 
          ? '<div style="height: 12px;"></div>' 
          : `<p style="font-size: 14px; color: #e5e5e5; margin-bottom: 8px; line-height: 1.6;">${line}</p>`
      ).join('')}
    </div>
  `).join('');

  return `
    <div id="document-content" style="background: #0f0d0c; color: #e5e5e5; font-family: 'Inter', sans-serif; padding: 48px; min-height: 100%;">
      <div style="text-align: center; margin-bottom: 48px; border-bottom: 2px solid #c9a227; padding-bottom: 32px;">
        <div style="font-size: 32px; font-weight: 700; color: #c9a227; letter-spacing: 4px; margin-bottom: 8px;">
          LAVANDAR™
        </div>
        <h1 style="font-size: 24px; font-weight: 600; color: #ffffff; margin-bottom: 8px;">${doc.title}</h1>
        <p style="font-size: 12px; color: #888;">
          Confidential Document • ${new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </p>
      </div>
      
      ${sections}
      
      <div style="margin-top: 64px; padding-top: 24px; border-top: 1px solid #333; text-align: center;">
        <p style="font-size: 10px; color: #666; margin-bottom: 4px;">
          © 2026 LAVANDAR TECH • Confidential & Proprietary
        </p>
        <p style="font-size: 10px; color: #666;">
          Patent Portfolio: US 10,082,945 • IL Pending • PCT/IL2024/050892
        </p>
      </div>
    </div>
  `;
};
