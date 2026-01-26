import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Building2,
  Plane,
  Anchor,
  HardHat,
  Shield,
  Video,
  Newspaper,
  TrendingUp,
  Circle,
  Play,
  CheckCircle2,
  Archive,
  ArrowLeft,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  RoadmapHeader,
  RoadmapViewToggle,
  RoadmapTimeline,
  RoadmapKanban,
  RoadmapMatrix,
  RoadmapDashboard,
  TimelinePhase,
  KanbanColumn,
  MatrixData,
} from '@/components/roadmap';

// Timeline Phases
// Timeline Phases - Updated with RR3 Ship/Defer/Descope decisions
const B2B_PHASES: TimelinePhase[] = [
  {
    id: 'mvp',
    label: 'MVP Complete',
    description: 'Aviation beachhead established with METAR integration and role-based dashboards',
    status: 'completed',
  },
  {
    id: 'expansion',
    label: 'Q1 2026 — Ship Sprint',
    description: 'Aviation Command 100%, Compliance OCR, Briefing Cards. Marine DEFERRED.',
    status: 'active',
  },
  {
    id: 'integration',
    label: 'Q2 2026 — Enterprise Integration',
    description: 'SSO/SAML, Odoo sync, API marketplace, Marine Command',
    status: 'planned',
  },
  {
    id: 'ai-ops',
    label: 'Q3 2026 — AI Operations',
    description: 'Predictive analytics, automated compliance, multi-model AI gateway',
    status: 'planned',
  },
];

// Kanban Data - Updated Jan 26 Sprint Status
const B2B_KANBAN: KanbanColumn[] = [
  {
    id: 'planned',
    label: 'Next Sprint (Jan 31+)',
    icon: Circle,
    items: [
      { id: 'compliance-audit', title: 'Compliance Audit Logs', description: 'Activity tracking for shipments', priority: 'medium', tags: ['security'] },
    ],
  },
  {
    id: 'in-progress',
    label: 'In Progress',
    icon: Play,
    items: [],
  },
  {
    id: 'shipped',
    label: 'Shipped ✓',
    icon: CheckCircle2,
    items: [
      { id: 'compliance-ocr', title: 'Compliance OCR', description: 'AI document scanning for permits', priority: 'high', tags: ['shipped', 'ai'] },
      { id: 'briefing-tts', title: 'Briefing Cards TTS', description: 'Voice briefing with auto-advance', priority: 'medium', tags: ['shipped', 'ai'] },
      { id: 'sso-saml', title: 'SSO/SAML Integration', description: 'Enterprise authentication protocols', priority: 'medium', tags: ['shipped', 'security'] },
      { id: 'aviation-100', title: 'Aviation Command 100%', description: 'Real-time METAR, multi-airport, TTS briefing', priority: 'high', tags: ['shipped', 'beachhead'] },
      { id: 'gates-removed', title: 'Gates Removed', description: 'All access gates removed for testing', priority: 'high', tags: ['shipped'] },
      { id: 'compliance-hub', title: 'Compliance Hub', description: 'Cross-border regulatory workflow', priority: 'high', tags: ['vertical'] },
      { id: 'meetingflow', title: 'MeetingFlow', description: 'Meeting recording and prompt generation', priority: 'medium', tags: ['productivity'] },
      { id: 'briefing-cards', title: 'Briefing Cards', description: 'AI-synthesized executive intelligence', priority: 'medium', tags: ['ai', 'analytics'] },
      { id: 'rbac', title: '3-Tier RBAC', description: 'Operator/Technical/Executive role system', priority: 'high', tags: ['security'] },
    ],
  },
  {
    id: 'archived',
    label: 'Deferred to Q2',
    icon: Archive,
    items: [
      { id: 'marine-command', title: 'Marine Command', description: 'Coastal weather ops — after Aviation', priority: 'medium', tags: ['deferred'] },
      { id: 'meetingflow-ai', title: 'MeetingFlow AI', description: 'Action item extraction — internal tool', priority: 'low', tags: ['deferred'] },
      { id: 'api-marketplace', title: 'API Marketplace', description: 'Partner integrations — Q2+', priority: 'medium', tags: ['deferred'] },
    ],
  },
];

// Matrix Data
const B2B_MATRIX: MatrixData = {
  products: [
    { id: 'aviation', name: 'Aviation', icon: Plane },
    { id: 'marine', name: 'Marine', icon: Anchor },
    { id: 'compliance', name: 'Compliance', icon: Shield },
    { id: 'meetingflow', name: 'MeetingFlow', icon: Video },
    { id: 'briefing', name: 'Briefing', icon: Newspaper },
    { id: 'forecast', name: 'Forecast', icon: TrendingUp },
  ],
  features: [
    { id: 'rbac', name: 'Role-Based Access', category: 'Security' },
    { id: 'sso', name: 'SSO/SAML', category: 'Security' },
    { id: 'audit-log', name: 'Audit Logging', category: 'Security' },
    { id: 'ai-insights', name: 'AI Insights', category: 'Intelligence' },
    { id: 'realtime', name: 'Real-time Data', category: 'Intelligence' },
    { id: 'export-pdf', name: 'PDF Export', category: 'Intelligence' },
    { id: 'api-access', name: 'API Access', category: 'Integration' },
    { id: 'webhooks', name: 'Webhooks', category: 'Integration' },
    { id: 'erp-sync', name: 'ERP Sync', category: 'Integration' },
  ],
  status: {
    aviation: {
      rbac: 'available',
      sso: 'in-progress',
      'audit-log': 'planned',
      'ai-insights': 'available',
      realtime: 'available',
      'export-pdf': 'available',
      'api-access': 'planned',
      webhooks: 'planned',
      'erp-sync': 'not-applicable',
    },
    marine: {
      rbac: 'available',
      sso: 'in-progress',
      'audit-log': 'planned',
      'ai-insights': 'planned',
      realtime: 'available',
      'export-pdf': 'available',
      'api-access': 'planned',
      webhooks: 'planned',
      'erp-sync': 'not-applicable',
    },
    compliance: {
      rbac: 'available',
      sso: 'in-progress',
      'audit-log': 'in-progress',
      'ai-insights': 'planned',
      realtime: 'available',
      'export-pdf': 'available',
      'api-access': 'planned',
      webhooks: 'available',
      'erp-sync': 'in-progress',
    },
    meetingflow: {
      rbac: 'available',
      sso: 'in-progress',
      'audit-log': 'not-applicable',
      'ai-insights': 'available',
      realtime: 'available',
      'export-pdf': 'planned',
      'api-access': 'planned',
      webhooks: 'not-applicable',
      'erp-sync': 'not-applicable',
    },
    briefing: {
      rbac: 'available',
      sso: 'in-progress',
      'audit-log': 'not-applicable',
      'ai-insights': 'available',
      realtime: 'available',
      'export-pdf': 'available',
      'api-access': 'planned',
      webhooks: 'planned',
      'erp-sync': 'not-applicable',
    },
    forecast: {
      rbac: 'available',
      sso: 'in-progress',
      'audit-log': 'not-applicable',
      'ai-insights': 'available',
      realtime: 'in-progress',
      'export-pdf': 'available',
      'api-access': 'planned',
      webhooks: 'planned',
      'erp-sync': 'not-applicable',
    },
  },
};

// Dashboard Metrics - Updated Jan 26 Sprint
const B2B_METRICS = [
  { label: 'Verticals', value: 4, change: 'Active focus', icon: Building2 },
  { label: 'Features Shipped', value: 22, change: '+2 today', trend: 'up' as const, icon: CheckCircle2 },
  { label: 'Next Sprint', value: 3, change: 'Jan 27-30', trend: 'up' as const, icon: Play },
  { label: 'Enterprise Pilots', value: 3, change: 'Aviation 100%', trend: 'up' as const, icon: Building2 },
];

const B2B_MILESTONES = [
  { label: 'Aviation Command 100%', date: '✓ Jan 26' },
  { label: 'Gates Removed', date: '✓ Jan 26' },
  { label: 'Compliance OCR Complete', date: 'Jan 27' },
  { label: 'Briefing TTS Polish', date: 'Jan 28' },
];

type ViewType = 'timeline' | 'kanban' | 'matrix' | 'dashboard';

export default function RoadmapB2B() {
  const [activeView, setActiveView] = useState<ViewType>('dashboard');

  return (
    <div className="min-h-screen bg-background">
      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(90deg, currentColor 1px, transparent 1px), linear-gradient(currentColor 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }} />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-7xl">
        {/* Back Link */}
        <Link to="/labs" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Labs</span>
        </Link>

        {/* Header */}
        <RoadmapHeader
          title="Enterprise SaaS"
          subtitle="B2B roadmap for aviation operations, compliance workflows, and AI-powered decision intelligence."
          icon={Building2}
          badge="B2B"
          badgeVariant="secondary"
        />

        {/* View Toggle */}
        <div className="flex items-center justify-between mt-8 mb-6">
          <RoadmapViewToggle activeView={activeView} onViewChange={setActiveView} />
          <Link to="/roadmap/b2c">
            <Button variant="outline" size="sm" className="text-xs gap-1.5">
              View B2C Roadmap
            </Button>
          </Link>
        </div>

        {/* Content */}
        <motion.div
          key={activeView}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {activeView === 'timeline' && <RoadmapTimeline phases={B2B_PHASES} />}
          {activeView === 'kanban' && <RoadmapKanban columns={B2B_KANBAN} />}
          {activeView === 'matrix' && <RoadmapMatrix data={B2B_MATRIX} />}
          {activeView === 'dashboard' && (
            <RoadmapDashboard
              metrics={B2B_METRICS}
              completionPercentage={55}
              activeInitiatives={4}
              upcomingMilestones={B2B_MILESTONES}
            />
          )}
        </motion.div>
      </div>
    </div>
  );
}
