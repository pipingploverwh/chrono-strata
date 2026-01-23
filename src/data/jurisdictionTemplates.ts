// Jurisdiction-specific compliance templates for medical cannabis cross-border transport

export interface JurisdictionPair {
  originState: string;
  destinationCountry: string;
  route: string;
  difficulty: 'low' | 'medium' | 'high' | 'very_high';
  legalStatus: 'permitted' | 'conditional' | 'restricted' | 'prohibited';
  requiredPermits: PermitTemplate[];
  keyStakeholders: StakeholderTemplate[];
  estimatedTimeline: string;
  notes: string[];
}

export interface PermitTemplate {
  name: string;
  type: string;
  jurisdiction: 'us_federal' | 'us_state' | 'destination_country' | 'international';
  issuingAuthority: string;
  estimatedDays: number;
  required: boolean;
  notes?: string;
}

export interface StakeholderTemplate {
  type: 'regulator' | 'legal_counsel' | 'logistics' | 'clinical' | 'customs' | 'lab';
  role: string;
  jurisdiction: string;
  recommended?: string;
}

// Massachusetts → Israel (Clinical Research Focus)
export const MA_TO_ISRAEL: JurisdictionPair = {
  originState: 'Massachusetts',
  destinationCountry: 'Israel',
  route: 'MA → IL',
  difficulty: 'medium',
  legalStatus: 'conditional',
  estimatedTimeline: '90-180 days',
  notes: [
    'Israel has a mature medical cannabis regulatory framework',
    'Research exemption pathway available via clinical trial protocols',
    'Strong bilateral research cooperation history',
    'Sheba Medical Center and Tikun Olam are established partners'
  ],
  requiredPermits: [
    {
      name: 'DEA Controlled Substance Export Authorization',
      type: 'dea_export',
      jurisdiction: 'us_federal',
      issuingAuthority: 'Drug Enforcement Administration',
      estimatedDays: 60,
      required: true,
      notes: 'Form 161 required; coordinate with Registration Section'
    },
    {
      name: 'MA Cannabis Control Commission Export Approval',
      type: 'state_export',
      jurisdiction: 'us_state',
      issuingAuthority: 'Massachusetts Cannabis Control Commission',
      estimatedDays: 45,
      required: true,
      notes: 'Requires federal alignment documentation'
    },
    {
      name: 'Israel Ministry of Health Import License',
      type: 'import_license',
      jurisdiction: 'destination_country',
      issuingAuthority: 'Israeli Ministry of Health - Medical Cannabis Unit (MCU)',
      estimatedDays: 30,
      required: true,
      notes: 'MCU has streamlined process for clinical research'
    },
    {
      name: 'IRB Protocol Approval',
      type: 'irb_approval',
      jurisdiction: 'international',
      issuingAuthority: 'Institutional Review Board (Both Countries)',
      estimatedDays: 45,
      required: true,
      notes: 'Full committee review required for controlled substances'
    },
    {
      name: 'FDA IND Application',
      type: 'fda_ind',
      jurisdiction: 'us_federal',
      issuingAuthority: 'Food and Drug Administration',
      estimatedDays: 90,
      required: false,
      notes: 'May not be required for pure export; consult counsel'
    }
  ],
  keyStakeholders: [
    { type: 'regulator', role: 'Federal export authorization', jurisdiction: 'USA', recommended: 'DEA Diversion Control Division' },
    { type: 'regulator', role: 'State cannabis regulatory compliance', jurisdiction: 'USA', recommended: 'MA CCC' },
    { type: 'regulator', role: 'Import licensing', jurisdiction: 'Israel', recommended: 'MOH Medical Cannabis Unit' },
    { type: 'legal_counsel', role: 'U.S. federal controlled substance law', jurisdiction: 'USA', recommended: 'Ropes & Gray LLP' },
    { type: 'legal_counsel', role: 'Israeli pharmaceutical law', jurisdiction: 'Israel' },
    { type: 'clinical', role: 'Principal Investigator', jurisdiction: 'Israel', recommended: 'Sheba Medical Center' },
    { type: 'logistics', role: 'Controlled substance cold-chain transport', jurisdiction: 'International', recommended: 'World Courier' },
    { type: 'lab', role: 'Pre-shipment COA testing', jurisdiction: 'USA', recommended: 'ProVerde Laboratories' },
    { type: 'customs', role: 'Export clearance', jurisdiction: 'USA' }
  ]
};

// California → UAE (Named Patient Program)
export const CA_TO_UAE: JurisdictionPair = {
  originState: 'California',
  destinationCountry: 'UAE',
  route: 'CA → AE',
  difficulty: 'high',
  legalStatus: 'restricted',
  estimatedTimeline: '120-240 days',
  notes: [
    'UAE has strict narcotics laws but emerging medical cannabis exemptions',
    'Named Patient Program (NPP) pathway through Ministry of Health',
    'Dubai Healthcare City has special regulatory zone',
    'Diplomatic sensitivity requires careful stakeholder management',
    'Abraham Accords provide new bilateral cooperation framework'
  ],
  requiredPermits: [
    {
      name: 'DEA Controlled Substance Export Authorization',
      type: 'dea_export',
      jurisdiction: 'us_federal',
      issuingAuthority: 'Drug Enforcement Administration',
      estimatedDays: 60,
      required: true
    },
    {
      name: 'California DCC Export License',
      type: 'state_export',
      jurisdiction: 'us_state',
      issuingAuthority: 'California Department of Cannabis Control',
      estimatedDays: 60,
      required: true,
      notes: 'New export framework as of 2025'
    },
    {
      name: 'UAE MOH Named Patient Authorization',
      type: 'import_license',
      jurisdiction: 'destination_country',
      issuingAuthority: 'UAE Ministry of Health & Prevention - Narcotics Control',
      estimatedDays: 90,
      required: true,
      notes: 'Per-patient authorization required'
    },
    {
      name: 'Dubai Healthcare City Authority Clearance',
      type: 'clinical_clearance',
      jurisdiction: 'destination_country',
      issuingAuthority: 'DHCA Regulatory',
      estimatedDays: 30,
      required: true,
      notes: 'Only for facilities within DHCC free zone'
    },
    {
      name: 'UAE Customs Pre-Clearance',
      type: 'customs_clearance',
      jurisdiction: 'destination_country',
      issuingAuthority: 'Federal Customs Authority',
      estimatedDays: 14,
      required: true
    }
  ],
  keyStakeholders: [
    { type: 'regulator', role: 'Federal export authorization', jurisdiction: 'USA', recommended: 'DEA' },
    { type: 'regulator', role: 'State export licensing', jurisdiction: 'USA', recommended: 'CA DCC' },
    { type: 'regulator', role: 'Narcotics import control', jurisdiction: 'UAE', recommended: 'MOH Narcotics Division' },
    { type: 'legal_counsel', role: 'U.S. federal export law', jurisdiction: 'USA' },
    { type: 'legal_counsel', role: 'UAE pharmaceutical & narcotics law', jurisdiction: 'UAE' },
    { type: 'clinical', role: 'Prescribing physician / hospital', jurisdiction: 'UAE', recommended: 'American Hospital Dubai' },
    { type: 'logistics', role: 'Controlled substance international courier', jurisdiction: 'International' },
    { type: 'customs', role: 'UAE customs clearance broker', jurisdiction: 'UAE' }
  ]
};

// California → Israel (Commercial)
export const CA_TO_ISRAEL: JurisdictionPair = {
  originState: 'California',
  destinationCountry: 'Israel',
  route: 'CA → IL',
  difficulty: 'medium',
  legalStatus: 'conditional',
  estimatedTimeline: '90-150 days',
  notes: [
    'Established commercial pathway for licensed importers',
    'Tikun Olam and similar companies have import infrastructure',
    'Higher volume requires robust QA and supply chain controls'
  ],
  requiredPermits: [
    {
      name: 'DEA Controlled Substance Export Authorization',
      type: 'dea_export',
      jurisdiction: 'us_federal',
      issuingAuthority: 'Drug Enforcement Administration',
      estimatedDays: 60,
      required: true
    },
    {
      name: 'California DCC Export License',
      type: 'state_export',
      jurisdiction: 'us_state',
      issuingAuthority: 'California Department of Cannabis Control',
      estimatedDays: 45,
      required: true
    },
    {
      name: 'Israel MOH Commercial Import License',
      type: 'import_license',
      jurisdiction: 'destination_country',
      issuingAuthority: 'Israeli Ministry of Health - MCU',
      estimatedDays: 45,
      required: true
    },
    {
      name: 'GMP Certification',
      type: 'quality_cert',
      jurisdiction: 'international',
      issuingAuthority: 'Accredited GMP Auditor',
      estimatedDays: 30,
      required: true,
      notes: 'May require facility audit'
    }
  ],
  keyStakeholders: [
    { type: 'regulator', role: 'Federal export', jurisdiction: 'USA' },
    { type: 'regulator', role: 'State export', jurisdiction: 'USA' },
    { type: 'regulator', role: 'Import licensing', jurisdiction: 'Israel' },
    { type: 'legal_counsel', role: 'Commercial contracts & export law', jurisdiction: 'USA' },
    { type: 'logistics', role: 'Commercial pharmaceutical logistics', jurisdiction: 'International' },
    { type: 'lab', role: 'GMP compliance & COA', jurisdiction: 'Both' }
  ]
};

// Massachusetts → UAE (Research/Hemp)
export const MA_TO_UAE: JurisdictionPair = {
  originState: 'Massachusetts',
  destinationCountry: 'UAE',
  route: 'MA → AE',
  difficulty: 'medium',
  legalStatus: 'conditional',
  estimatedTimeline: '60-120 days',
  notes: [
    'Hemp-derived CBD (<0.3% THC) has different regulatory pathway',
    'Academic research collaboration may have simplified channels',
    'Khalifa University has established research partnerships'
  ],
  requiredPermits: [
    {
      name: 'USDA Hemp Export Certificate',
      type: 'hemp_export',
      jurisdiction: 'us_federal',
      issuingAuthority: 'USDA Agricultural Marketing Service',
      estimatedDays: 30,
      required: true,
      notes: 'Only for products with <0.3% THC'
    },
    {
      name: 'MA Hemp Program Export Notification',
      type: 'state_export',
      jurisdiction: 'us_state',
      issuingAuthority: 'MA Department of Agricultural Resources',
      estimatedDays: 14,
      required: true
    },
    {
      name: 'UAE Research Material Import Permit',
      type: 'import_license',
      jurisdiction: 'destination_country',
      issuingAuthority: 'UAE Ministry of Education / Research Institution',
      estimatedDays: 45,
      required: true
    }
  ],
  keyStakeholders: [
    { type: 'regulator', role: 'Hemp export certification', jurisdiction: 'USA' },
    { type: 'clinical', role: 'Research institution sponsor', jurisdiction: 'UAE', recommended: 'Khalifa University' },
    { type: 'logistics', role: 'Research material courier', jurisdiction: 'International' }
  ]
};

export const ALL_JURISDICTION_PAIRS: JurisdictionPair[] = [
  MA_TO_ISRAEL,
  CA_TO_UAE,
  CA_TO_ISRAEL,
  MA_TO_UAE
];

export function getJurisdictionPair(originState: string, destinationCountry: string): JurisdictionPair | undefined {
  return ALL_JURISDICTION_PAIRS.find(
    jp => jp.originState === originState && jp.destinationCountry === destinationCountry
  );
}

// Document checklist templates
export interface DocumentTemplate {
  name: string;
  type: string;
  category: 'export' | 'import' | 'clinical' | 'logistics' | 'quality';
  required: boolean;
  description: string;
}

export const REQUIRED_DOCUMENTS: DocumentTemplate[] = [
  { name: 'Certificate of Analysis (Full Panel)', type: 'coa', category: 'quality', required: true, description: 'Cannabinoid profile, contaminants, residual solvents, heavy metals, microbial' },
  { name: 'DEA Form 161 - Export Declaration', type: 'permit', category: 'export', required: true, description: 'Federal controlled substance export authorization form' },
  { name: 'Commercial Invoice', type: 'invoice', category: 'logistics', required: true, description: 'Detailed pricing, quantity, HS codes for customs' },
  { name: 'Packing List & Manifest', type: 'manifest', category: 'logistics', required: true, description: 'Complete shipment contents with batch IDs' },
  { name: 'Chain of Custody Documentation', type: 'manifest', category: 'logistics', required: true, description: 'Temperature logs, handling records, custody transfers' },
  { name: 'Import Permit Copy', type: 'permit', category: 'import', required: true, description: 'Destination country import authorization' },
  { name: 'Supply Agreement (Executed)', type: 'contract', category: 'export', required: true, description: 'Includes indemnity, recall, acceptance testing provisions' },
  { name: 'Insurance Certificate', type: 'insurance', category: 'logistics', required: true, description: 'Controlled substance transit coverage' },
  { name: 'MSDS / Safety Data Sheet', type: 'safety', category: 'quality', required: false, description: 'Material safety information for handlers' },
  { name: 'IRB Approval Letter', type: 'permit', category: 'clinical', required: false, description: 'Required for clinical trial shipments' },
  { name: 'Patient Authorization List', type: 'clinical', category: 'clinical', required: false, description: 'Required for named patient programs' }
];

// Risk templates
export interface RiskTemplate {
  category: string;
  description: string;
  defaultLikelihood: 'low' | 'medium' | 'high';
  defaultImpact: 'low' | 'medium' | 'high';
  mitigationSuggestion: string;
}

export const STANDARD_RISKS: RiskTemplate[] = [
  {
    category: 'regulatory',
    description: 'Federal export authorization denial or significant delay',
    defaultLikelihood: 'medium',
    defaultImpact: 'high',
    mitigationSuggestion: 'Early DEA engagement, complete documentation, legal counsel review, timeline buffer'
  },
  {
    category: 'regulatory',
    description: 'State export permit denied or requirements change',
    defaultLikelihood: 'low',
    defaultImpact: 'high',
    mitigationSuggestion: 'Monitor regulatory updates, maintain state agency relationships'
  },
  {
    category: 'seizure',
    description: 'Customs seizure at port of exit or entry',
    defaultLikelihood: 'low',
    defaultImpact: 'high',
    mitigationSuggestion: 'Pre-clearance coordination, authorized broker, complete permits on shipment'
  },
  {
    category: 'quality',
    description: 'Product fails destination country testing requirements',
    defaultLikelihood: 'low',
    defaultImpact: 'medium',
    mitigationSuggestion: 'Dual COA testing, clear acceptance criteria, pre-qualify testing labs'
  },
  {
    category: 'banking',
    description: 'Wire transfer rejected by intermediary bank',
    defaultLikelihood: 'medium',
    defaultImpact: 'medium',
    mitigationSuggestion: 'Escrow with cannabis-compliant bank, AML documentation, alternative rails'
  },
  {
    category: 'political',
    description: 'Destination country policy change on medical cannabis',
    defaultLikelihood: 'low',
    defaultImpact: 'high',
    mitigationSuggestion: 'Monitor regulatory signals, embassy contacts, force majeure clause'
  },
  {
    category: 'logistics',
    description: 'Cold-chain failure or product degradation in transit',
    defaultLikelihood: 'low',
    defaultImpact: 'medium',
    mitigationSuggestion: 'Specialized pharmaceutical courier, temperature monitoring, insurance'
  }
];
