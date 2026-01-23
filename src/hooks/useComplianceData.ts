import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

// Type definitions based on database schema
export type ShipmentPhase = 'legal_clearance' | 'regulatory_approvals' | 'contracts_compliance' | 'logistics_engagement' | 'cross_border_transport' | 'post_delivery';
export type PermitStatus = 'not_started' | 'in_progress' | 'submitted' | 'approved' | 'denied' | 'expired';
export type JurisdictionType = 'us_federal' | 'us_state' | 'destination_country' | 'international';
export type StakeholderType = 'regulator' | 'legal_counsel' | 'logistics' | 'clinical' | 'customs' | 'lab';

export interface ComplianceShipment {
  id: string;
  created_at: string;
  updated_at: string;
  shipment_reference: string;
  description: string | null;
  product_type: string;
  thc_concentration: number | null;
  quantity: string | null;
  batch_id: string | null;
  origin_state: string;
  origin_country: string;
  destination_country: string;
  destination_entity: string | null;
  use_case: string;
  current_phase: ShipmentPhase;
  phase_started_at: string | null;
  status: string;
  target_ship_date: string | null;
  actual_ship_date: string | null;
  linked_transaction_id: string | null;
  estimated_value: number | null;
  metadata: Record<string, unknown>;
}

export interface CompliancePermit {
  id: string;
  created_at: string;
  updated_at: string;
  shipment_id: string;
  permit_name: string;
  permit_type: string;
  jurisdiction: JurisdictionType;
  issuing_authority: string;
  status: PermitStatus;
  application_date: string | null;
  approval_date: string | null;
  expiration_date: string | null;
  document_url: string | null;
  reference_number: string | null;
  notes: string | null;
  is_required: boolean;
  metadata: Record<string, unknown>;
}

export interface ComplianceStakeholder {
  id: string;
  created_at: string;
  shipment_id: string;
  stakeholder_type: StakeholderType;
  organization_name: string;
  contact_name: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  role_description: string | null;
  jurisdiction: string | null;
  status: string;
  metadata: Record<string, unknown>;
}

export interface ComplianceDocument {
  id: string;
  created_at: string;
  updated_at: string;
  shipment_id: string;
  document_name: string;
  document_type: string;
  category: string | null;
  status: string;
  file_url: string | null;
  due_date: string | null;
  completed_date: string | null;
  notes: string | null;
  metadata: Record<string, unknown>;
}

export interface ComplianceRisk {
  id: string;
  created_at: string;
  updated_at: string;
  shipment_id: string;
  risk_category: string;
  risk_description: string;
  likelihood: string;
  impact: string;
  mitigation_strategy: string | null;
  mitigation_status: string;
  owner: string | null;
  metadata: Record<string, unknown>;
}

export interface CompliancePhaseLog {
  id: string;
  created_at: string;
  shipment_id: string;
  phase: ShipmentPhase;
  action: string;
  notes: string | null;
  performed_by: string | null;
  metadata: Record<string, unknown>;
}

// Fetch all shipments with optional filters
export function useComplianceShipments(filters?: {
  status?: string;
  origin_state?: string;
  destination_country?: string;
  use_case?: string;
}) {
  return useQuery({
    queryKey: ['compliance-shipments', filters],
    queryFn: async () => {
      let query = supabase
        .from('compliance_shipments')
        .select('*')
        .order('created_at', { ascending: false });

      if (filters?.status) {
        query = query.eq('status', filters.status);
      }
      if (filters?.origin_state) {
        query = query.eq('origin_state', filters.origin_state);
      }
      if (filters?.destination_country) {
        query = query.eq('destination_country', filters.destination_country);
      }
      if (filters?.use_case) {
        query = query.eq('use_case', filters.use_case);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as ComplianceShipment[];
    }
  });
}

// Fetch single shipment with all related data
export function useComplianceShipmentDetails(shipmentId: string | null) {
  return useQuery({
    queryKey: ['compliance-shipment-details', shipmentId],
    queryFn: async () => {
      if (!shipmentId) return null;

      const [shipment, permits, stakeholders, documents, risks, phaseLogs] = await Promise.all([
        supabase.from('compliance_shipments').select('*').eq('id', shipmentId).single(),
        supabase.from('compliance_permits').select('*').eq('shipment_id', shipmentId).order('is_required', { ascending: false }),
        supabase.from('compliance_stakeholders').select('*').eq('shipment_id', shipmentId),
        supabase.from('compliance_documents').select('*').eq('shipment_id', shipmentId).order('due_date', { ascending: true }),
        supabase.from('compliance_risks').select('*').eq('shipment_id', shipmentId),
        supabase.from('compliance_phase_logs').select('*').eq('shipment_id', shipmentId).order('created_at', { ascending: false })
      ]);

      if (shipment.error) throw shipment.error;

      return {
        shipment: shipment.data as ComplianceShipment,
        permits: permits.data as CompliancePermit[],
        stakeholders: stakeholders.data as ComplianceStakeholder[],
        documents: documents.data as ComplianceDocument[],
        risks: risks.data as ComplianceRisk[],
        phaseLogs: phaseLogs.data as CompliancePhaseLog[]
      };
    },
    enabled: !!shipmentId
  });
}

// Get compliance statistics
export function useComplianceStats() {
  return useQuery({
    queryKey: ['compliance-stats'],
    queryFn: async () => {
      const [shipments, permits] = await Promise.all([
        supabase.from('compliance_shipments').select('id, status, current_phase, estimated_value'),
        supabase.from('compliance_permits').select('id, status, is_required')
      ]);

      if (shipments.error) throw shipments.error;
      if (permits.error) throw permits.error;

      const activeShipments = shipments.data?.filter(s => s.status === 'active').length || 0;
      const totalValue = shipments.data?.reduce((sum, s) => sum + (s.estimated_value || 0), 0) || 0;
      const pendingPermits = permits.data?.filter(p => p.is_required && !['approved', 'denied'].includes(p.status)).length || 0;
      const approvedPermits = permits.data?.filter(p => p.status === 'approved').length || 0;

      return {
        activeShipments,
        totalValue,
        pendingPermits,
        approvedPermits,
        permitApprovalRate: permits.data?.length ? Math.round((approvedPermits / permits.data.length) * 100) : 0
      };
    }
  });
}

// Phase display helpers
export const PHASE_LABELS: Record<ShipmentPhase, string> = {
  legal_clearance: 'Legal Clearance',
  regulatory_approvals: 'Regulatory Approvals',
  contracts_compliance: 'Contracts & Compliance',
  logistics_engagement: 'Logistics Engagement',
  cross_border_transport: 'Cross-Border Transport',
  post_delivery: 'Post-Delivery'
};

export const PHASE_ORDER: ShipmentPhase[] = [
  'legal_clearance',
  'regulatory_approvals',
  'contracts_compliance',
  'logistics_engagement',
  'cross_border_transport',
  'post_delivery'
];

export const PERMIT_STATUS_COLORS: Record<PermitStatus, string> = {
  not_started: 'bg-neutral-500/20 text-neutral-400',
  in_progress: 'bg-amber-500/20 text-amber-400',
  submitted: 'bg-cyan-500/20 text-cyan-400',
  approved: 'bg-emerald-500/20 text-emerald-400',
  denied: 'bg-red-500/20 text-red-400',
  expired: 'bg-red-500/20 text-red-400'
};

export const JURISDICTION_LABELS: Record<JurisdictionType, string> = {
  us_federal: 'U.S. Federal',
  us_state: 'U.S. State',
  destination_country: 'Destination Country',
  international: 'International'
};
