import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { 
  JurisdictionPair, 
  getJurisdictionPair, 
  REQUIRED_DOCUMENTS, 
  STANDARD_RISKS 
} from "@/data/jurisdictionTemplates";

export interface CreateShipmentInput {
  // Step 1: Route Selection
  originState: string;
  destinationCountry: string;
  
  // Step 2: Product Details
  productType: string;
  thcConcentration?: number;
  quantity?: string;
  batchId?: string;
  description?: string;
  
  // Step 3: Use Case & Entity
  useCase: 'named_patient' | 'clinical_trial' | 'commercial';
  destinationEntity?: string;
  
  // Step 4: Timeline & Value
  targetShipDate?: string;
  estimatedValue?: number;
}

interface CreateShipmentResult {
  shipmentId: string;
  reference: string;
  permitsCreated: number;
  stakeholdersCreated: number;
  documentsCreated: number;
  risksCreated: number;
}

function generateShipmentReference(origin: string, dest: string, useCase: string): string {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  const originCode = origin.substring(0, 2).toUpperCase();
  const destCode = dest.substring(0, 2).toUpperCase();
  const useCaseCode = useCase === 'clinical_trial' ? 'CT' : useCase === 'named_patient' ? 'NP' : 'CM';
  return `${useCaseCode}-${originCode}${destCode}-${year}${month}-${random}`;
}

async function createShipmentWithTemplate(
  input: CreateShipmentInput,
  template: JurisdictionPair | undefined
): Promise<CreateShipmentResult> {
  const reference = generateShipmentReference(
    input.originState,
    input.destinationCountry,
    input.useCase
  );

  // 1. Create the shipment record
  const { data: shipment, error: shipmentError } = await supabase
    .from('compliance_shipments')
    .insert({
      shipment_reference: reference,
      description: input.description || `${input.productType} shipment to ${input.destinationCountry}`,
      product_type: input.productType,
      thc_concentration: input.thcConcentration,
      quantity: input.quantity,
      batch_id: input.batchId,
      origin_state: input.originState,
      origin_country: 'USA',
      destination_country: input.destinationCountry,
      destination_entity: input.destinationEntity,
      use_case: input.useCase,
      current_phase: 'legal_clearance',
      status: 'planning',
      target_ship_date: input.targetShipDate,
      estimated_value: input.estimatedValue,
      metadata: {
        template_used: template?.route || 'custom',
        created_via: 'wizard'
      }
    })
    .select()
    .single();

  if (shipmentError) throw shipmentError;

  let permitsCreated = 0;
  let stakeholdersCreated = 0;
  let documentsCreated = 0;
  let risksCreated = 0;

  // 2. Auto-populate permits from template
  if (template) {
    const permits = template.requiredPermits.map(p => ({
      shipment_id: shipment.id,
      permit_name: p.name,
      permit_type: p.type,
      jurisdiction: p.jurisdiction,
      issuing_authority: p.issuingAuthority,
      is_required: p.required,
      status: 'not_started' as const,
      notes: p.notes,
      metadata: { estimated_days: p.estimatedDays }
    }));

    const { error: permitsError, data: permitsData } = await supabase
      .from('compliance_permits')
      .insert(permits)
      .select();

    if (permitsError) console.error('Permits insert error:', permitsError);
    permitsCreated = permitsData?.length || 0;

    // 3. Auto-populate stakeholders from template
    const stakeholders = template.keyStakeholders.map(s => ({
      shipment_id: shipment.id,
      stakeholder_type: s.type,
      organization_name: s.recommended || `${s.role} (TBD)`,
      role_description: s.role,
      jurisdiction: s.jurisdiction,
      status: 'pending'
    }));

    const { error: stakeholdersError, data: stakeholdersData } = await supabase
      .from('compliance_stakeholders')
      .insert(stakeholders)
      .select();

    if (stakeholdersError) console.error('Stakeholders insert error:', stakeholdersError);
    stakeholdersCreated = stakeholdersData?.length || 0;
  }

  // 4. Auto-populate required documents
  const documents = REQUIRED_DOCUMENTS
    .filter(d => d.required || input.useCase === 'clinical_trial')
    .map(d => ({
      shipment_id: shipment.id,
      document_name: d.name,
      document_type: d.type,
      category: d.category,
      status: 'missing',
      notes: d.description
    }));

  const { error: docsError, data: docsData } = await supabase
    .from('compliance_documents')
    .insert(documents)
    .select();

  if (docsError) console.error('Documents insert error:', docsError);
  documentsCreated = docsData?.length || 0;

  // 5. Auto-populate standard risks
  const risks = STANDARD_RISKS.map(r => ({
    shipment_id: shipment.id,
    risk_category: r.category,
    risk_description: r.description,
    likelihood: r.defaultLikelihood,
    impact: r.defaultImpact,
    mitigation_strategy: r.mitigationSuggestion,
    mitigation_status: 'planned'
  }));

  const { error: risksError, data: risksData } = await supabase
    .from('compliance_risks')
    .insert(risks)
    .select();

  if (risksError) console.error('Risks insert error:', risksError);
  risksCreated = risksData?.length || 0;

  // 6. Create initial phase log
  await supabase.from('compliance_phase_logs').insert({
    shipment_id: shipment.id,
    phase: 'legal_clearance',
    action: 'Shipment created via wizard',
    notes: `Route: ${input.originState} → ${input.destinationCountry}, Use case: ${input.useCase}`,
    performed_by: 'System'
  });

  return {
    shipmentId: shipment.id,
    reference,
    permitsCreated,
    stakeholdersCreated,
    documentsCreated,
    risksCreated
  };
}

export function useCreateShipment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateShipmentInput) => {
      const template = getJurisdictionPair(input.originState, input.destinationCountry);
      return createShipmentWithTemplate(input, template);
    },
    onSuccess: (result) => {
      toast.success(`Shipment ${result.reference} created`, {
        description: `${result.permitsCreated} permits, ${result.stakeholdersCreated} stakeholders, ${result.documentsCreated} documents auto-populated`
      });
      queryClient.invalidateQueries({ queryKey: ['compliance-shipments'] });
      queryClient.invalidateQueries({ queryKey: ['compliance-stats'] });
    },
    onError: (error) => {
      console.error('Create shipment error:', error);
      toast.error('Failed to create shipment', {
        description: error.message
      });
    }
  });
}
