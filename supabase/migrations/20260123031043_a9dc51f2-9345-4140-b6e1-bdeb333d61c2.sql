-- Create enums for compliance tracking
CREATE TYPE public.shipment_phase AS ENUM ('legal_clearance', 'regulatory_approvals', 'contracts_compliance', 'logistics_engagement', 'cross_border_transport', 'post_delivery');
CREATE TYPE public.permit_status AS ENUM ('not_started', 'in_progress', 'submitted', 'approved', 'denied', 'expired');
CREATE TYPE public.jurisdiction_type AS ENUM ('us_federal', 'us_state', 'destination_country', 'international');
CREATE TYPE public.stakeholder_type AS ENUM ('regulator', 'legal_counsel', 'logistics', 'clinical', 'customs', 'lab');

-- Core shipments table for cross-border compliance tracking
CREATE TABLE public.compliance_shipments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Shipment identification
  shipment_reference TEXT NOT NULL,
  description TEXT,
  
  -- Product details
  product_type TEXT NOT NULL, -- e.g., 'flower', 'oil', 'isolate', 'hemp_cbd'
  thc_concentration NUMERIC, -- percentage
  quantity TEXT,
  batch_id TEXT,
  
  -- Jurisdictions
  origin_state TEXT NOT NULL,
  origin_country TEXT NOT NULL DEFAULT 'USA',
  destination_country TEXT NOT NULL,
  destination_entity TEXT, -- clinic/importer name
  
  -- Use case
  use_case TEXT NOT NULL, -- 'named_patient', 'clinical_trial', 'commercial'
  
  -- Phase tracking
  current_phase public.shipment_phase NOT NULL DEFAULT 'legal_clearance',
  phase_started_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  
  -- Status and timeline
  status TEXT NOT NULL DEFAULT 'planning',
  target_ship_date DATE,
  actual_ship_date DATE,
  
  -- Financial linkage
  linked_transaction_id UUID REFERENCES public.financial_transactions(id),
  estimated_value NUMERIC,
  
  -- Metadata for complex data
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Permits and authorizations tracking
CREATE TABLE public.compliance_permits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  shipment_id UUID NOT NULL REFERENCES public.compliance_shipments(id) ON DELETE CASCADE,
  
  -- Permit details
  permit_name TEXT NOT NULL,
  permit_type TEXT NOT NULL, -- e.g., 'dea_export', 'import_license', 'irb_approval'
  jurisdiction public.jurisdiction_type NOT NULL,
  issuing_authority TEXT NOT NULL,
  
  -- Status tracking
  status public.permit_status NOT NULL DEFAULT 'not_started',
  
  -- Dates
  application_date DATE,
  approval_date DATE,
  expiration_date DATE,
  
  -- Documentation
  document_url TEXT,
  reference_number TEXT,
  notes TEXT,
  
  -- Required vs optional
  is_required BOOLEAN DEFAULT true,
  
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Stakeholders and contacts per shipment
CREATE TABLE public.compliance_stakeholders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  shipment_id UUID NOT NULL REFERENCES public.compliance_shipments(id) ON DELETE CASCADE,
  
  stakeholder_type public.stakeholder_type NOT NULL,
  organization_name TEXT NOT NULL,
  contact_name TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  role_description TEXT,
  jurisdiction TEXT,
  
  status TEXT DEFAULT 'pending', -- 'engaged', 'confirmed', 'pending'
  
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Document checklist items
CREATE TABLE public.compliance_documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  shipment_id UUID NOT NULL REFERENCES public.compliance_shipments(id) ON DELETE CASCADE,
  
  document_name TEXT NOT NULL,
  document_type TEXT NOT NULL, -- 'coa', 'invoice', 'manifest', 'permit', 'contract'
  category TEXT, -- 'export', 'import', 'clinical', 'logistics'
  
  status TEXT NOT NULL DEFAULT 'missing', -- 'missing', 'draft', 'complete', 'verified'
  
  file_url TEXT,
  due_date DATE,
  completed_date DATE,
  
  notes TEXT,
  
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Risk register for each shipment
CREATE TABLE public.compliance_risks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  shipment_id UUID NOT NULL REFERENCES public.compliance_shipments(id) ON DELETE CASCADE,
  
  risk_category TEXT NOT NULL, -- 'regulatory', 'seizure', 'banking', 'quality', 'political'
  risk_description TEXT NOT NULL,
  
  likelihood TEXT NOT NULL DEFAULT 'medium', -- 'low', 'medium', 'high'
  impact TEXT NOT NULL DEFAULT 'medium',
  
  mitigation_strategy TEXT,
  mitigation_status TEXT DEFAULT 'planned', -- 'planned', 'in_progress', 'implemented'
  
  owner TEXT,
  
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Phase workflow timeline/log
CREATE TABLE public.compliance_phase_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  shipment_id UUID NOT NULL REFERENCES public.compliance_shipments(id) ON DELETE CASCADE,
  
  phase public.shipment_phase NOT NULL,
  action TEXT NOT NULL,
  notes TEXT,
  performed_by TEXT,
  
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Enable RLS on all tables
ALTER TABLE public.compliance_shipments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compliance_permits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compliance_stakeholders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compliance_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compliance_risks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compliance_phase_logs ENABLE ROW LEVEL SECURITY;

-- Admin-only RLS policies for all compliance tables
CREATE POLICY "Admins can manage shipments" ON public.compliance_shipments FOR ALL USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can manage permits" ON public.compliance_permits FOR ALL USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can manage stakeholders" ON public.compliance_stakeholders FOR ALL USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can manage documents" ON public.compliance_documents FOR ALL USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can manage risks" ON public.compliance_risks FOR ALL USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can manage phase logs" ON public.compliance_phase_logs FOR ALL USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Trigger for updated_at
CREATE TRIGGER update_compliance_shipments_updated_at BEFORE UPDATE ON public.compliance_shipments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_compliance_permits_updated_at BEFORE UPDATE ON public.compliance_permits FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_compliance_documents_updated_at BEFORE UPDATE ON public.compliance_documents FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_compliance_risks_updated_at BEFORE UPDATE ON public.compliance_risks FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();