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

// Kanban Data - Updated with RR3 decisions
const B2B_KANBAN: KanbanColumn[] = [
  {
    id: 'planned',
    label: 'Planned (Q2+)',
    icon: Circle,
    items: [
      { id: 'api-marketplace', title: 'API Marketplace', description: 'Self-service integration platform for partners', priority: 'high', tags: ['platform'] },
      { id: 'white-label', title: 'White-Label Licensing', description: 'Reseller and OEM partnership program', priority: 'medium', tags: ['revenue'] },
      { id: 'predictive-ai', title: 'Predictive Analytics', description: 'ML-powered forecasting for operations', priority: 'high', tags: ['ai'] },
      { id: 'marine-command', title: 'Marine Command', description: 'DEFERRED — Lower priority than Aviation', priority: 'medium', tags: ['deferred'] },
    ],
  },
  {
    id: 'in-progress',
    label: 'Ship Sprint (Jan 27-30)',
    icon: Play,
    items: [
      { id: 'aviation-100', title: 'Aviation Command 100%', description: 'Real-time weather briefing, multi-airport', priority: 'high', tags: ['critical', 'beachhead'] },
      { id: 'compliance-ocr', title: 'Compliance OCR', description: 'AI document processing for permits', priority: 'high', tags: ['critical'] },
      { id: 'briefing-cards', title: 'Briefing Cards TTS', description: 'Voice briefing for executives', priority: 'medium', tags: ['ai'] },
      { id: 'sso-saml', title: 'SSO/SAML Integration', description: 'Enterprise authentication protocols', priority: 'medium', tags: ['security'] },
    ],
  },
  {
    id: 'shipped',
    label: 'Shipped',
    icon: CheckCircle2,
    items: [
      { id: 'aviation-command', title: 'Aviation Command', description: 'METAR/weather ops with role-based views', priority: 'high', tags: ['beachhead'] },
      { id: 'compliance-hub', title: 'Compliance Hub', description: 'Cross-border regulatory workflow', priority: 'high', tags: ['vertical'] },
      { id: 'meetingflow', title: 'MeetingFlow', description: 'Meeting recording and prompt generation', priority: 'medium', tags: ['productivity'] },
      { id: 'briefing-cards', title: 'Briefing Cards', description: 'AI-synthesized executive intelligence', priority: 'medium', tags: ['ai', 'analytics'] },
      { id: 'rbac', title: '3-Tier RBAC', description: 'Operator/Technical/Executive role system', priority: 'high', tags: ['security'] },
    ],
  },
  {
    id: 'archived',
    label: 'Descoped/Deferred',
    icon: Archive,
    items: [
      { id: 'meetingflow-ai', title: 'MeetingFlow AI', description: 'DEFERRED — Internal tool, lower priority', priority: 'low', tags: ['deferred'] },
      { id: 'compliance-permits', title: 'Compliance Permits', description: 'DEFERRED — Complex, post-MVP', priority: 'low', tags: ['deferred'] },
      { id: 'sports-betting', title: 'Sports Predictions', description: 'DESCOPED — NFL module deprioritized', priority: 'low', tags: ['descoped'] },
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

// Dashboard Metrics - Updated post-RR3
const B2B_METRICS = [
  { label: 'Verticals', value: 4, change: 'Active focus', icon: Building2 },
  { label: 'Features Shipped', value: 20, change: '+6 this sprint', trend: 'up' as const, icon: CheckCircle2 },
  { label: 'Ship Sprint', value: 4, change: 'Jan 27-30', trend: 'up' as const, icon: Play },
  { label: 'Enterprise Pilots', value: 3, change: 'Aviation focus', trend: 'up' as const, icon: Building2 },
];

const B2B_MILESTONES = [
  { label: 'Aviation Command 100%', date: 'Jan 28' },
  { label: 'Compliance OCR Complete', date: 'Jan 29' },
  { label: 'Briefing TTS Launch', date: 'Jan 30' },
  { label: 'Marine Command Launch', date: 'Q2 2026' },
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
