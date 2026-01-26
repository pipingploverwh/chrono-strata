import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ShoppingBag,
  Shirt,
  Baby,
  Music2,
  Thermometer,
  Package,
  Circle,
  Play,
  CheckCircle2,
  Archive,
  ArrowLeft,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
const B2C_PHASES: TimelinePhase[] = [
  {
    id: 'foundation',
    label: 'Foundation',
    description: 'Core product catalog, checkout flow, and brand identity established',
    status: 'completed',
  },
  {
    id: 'expansion',
    label: 'Q1 2026 — Expansion',
    description: 'Kids collection launch, thermal visualizer integration, enhanced configurators',
    status: 'active',
  },
  {
    id: 'personalization',
    label: 'Q2 2026 — Personalization',
    description: 'AI-driven recommendations, custom sizing, and AR try-on features',
    status: 'planned',
  },
  {
    id: 'ecosystem',
    label: 'Q3 2026 — Ecosystem',
    description: 'Membership tiers, loyalty program, and cross-product bundles',
    status: 'planned',
  },
];

// Kanban Data
const B2C_KANBAN: KanbanColumn[] = [
  {
    id: 'planned',
    label: 'Planned',
    icon: Circle,
    items: [
      { id: 'ar-tryon', title: 'AR Try-On', description: 'Virtual fitting room with body scanning', priority: 'high', tags: ['mobile', 'ai'] },
      { id: 'loyalty', title: 'Loyalty Program', description: 'Points-based rewards and exclusive access', priority: 'medium', tags: ['retention'] },
      { id: 'gift-cards', title: 'Digital Gift Cards', description: 'Customizable gift card system', priority: 'low', tags: ['commerce'] },
    ],
  },
  {
    id: 'in-progress',
    label: 'In Progress',
    icon: Play,
    items: [
      { id: 'kids-expansion', title: 'Kids Line Expansion', description: 'Additional sizes and seasonal variants', priority: 'high', tags: ['product'] },
      { id: 'thermal-mobile', title: 'Thermal Mobile App', description: 'Standalone visualizer for iOS/Android', priority: 'medium', tags: ['mobile'] },
      { id: 'custom-sizing', title: 'Custom Sizing Tool', description: 'AI-powered measurement recommendations', priority: 'high', tags: ['ai', 'ux'] },
    ],
  },
  {
    id: 'shipped',
    label: 'Shipped',
    icon: CheckCircle2,
    items: [
      { id: 'strata-shell', title: 'STRATA Shell Collection', description: 'Premium technical apparel line', priority: 'high', tags: ['flagship'] },
      { id: 'kids-initial', title: 'Kids Explorer Kit', description: 'Junior equipment bundle at $399/yr', priority: 'high', tags: ['product'] },
      { id: 'apex1', title: 'APEX-1 Configurator', description: 'Custom DJ console builder', priority: 'medium', tags: ['product'] },
      { id: 'thermal-viz', title: 'Thermal Visualizer', description: 'Music-reactive visual experience', priority: 'medium', tags: ['brand'] },
      { id: 'shop-checkout', title: 'Shop & Checkout', description: 'Stripe-powered acquisition flow', priority: 'high', tags: ['commerce'] },
    ],
  },
  {
    id: 'archived',
    label: 'Archived',
    icon: Archive,
    items: [
      { id: 'print-catalog', title: 'Print Catalog', description: 'Physical lookbook — deprioritized', priority: 'low', tags: ['marketing'] },
    ],
  },
];

// Matrix Data
const B2C_MATRIX: MatrixData = {
  products: [
    { id: 'strata-shell', name: 'STRATA Shell', icon: Shirt },
    { id: 'kids-kit', name: 'Kids Kit', icon: Baby },
    { id: 'apex1', name: 'APEX-1', icon: Music2 },
    { id: 'thermal', name: 'Thermal', icon: Thermometer },
    { id: 'shop', name: 'Shop', icon: Package },
  ],
  features: [
    { id: 'stripe-checkout', name: 'Stripe Checkout', category: 'Commerce' },
    { id: 'subscription', name: 'Subscription Billing', category: 'Commerce' },
    { id: 'one-time', name: 'One-Time Purchase', category: 'Commerce' },
    { id: '3d-config', name: '3D Configurator', category: 'Experience' },
    { id: 'ar-preview', name: 'AR Preview', category: 'Experience' },
    { id: 'mobile-optimized', name: 'Mobile Optimized', category: 'Experience' },
    { id: 'email-receipt', name: 'Email Receipts', category: 'Operations' },
    { id: 'inventory-sync', name: 'Inventory Sync', category: 'Operations' },
  ],
  status: {
    'strata-shell': {
      'stripe-checkout': 'available',
      subscription: 'available',
      'one-time': 'available',
      '3d-config': 'in-progress',
      'ar-preview': 'planned',
      'mobile-optimized': 'available',
      'email-receipt': 'available',
      'inventory-sync': 'planned',
    },
    'kids-kit': {
      'stripe-checkout': 'available',
      subscription: 'available',
      'one-time': 'not-applicable',
      '3d-config': 'not-applicable',
      'ar-preview': 'planned',
      'mobile-optimized': 'available',
      'email-receipt': 'available',
      'inventory-sync': 'planned',
    },
    apex1: {
      'stripe-checkout': 'available',
      subscription: 'not-applicable',
      'one-time': 'available',
      '3d-config': 'available',
      'ar-preview': 'planned',
      'mobile-optimized': 'in-progress',
      'email-receipt': 'available',
      'inventory-sync': 'not-applicable',
    },
    thermal: {
      'stripe-checkout': 'not-applicable',
      subscription: 'not-applicable',
      'one-time': 'not-applicable',
      '3d-config': 'not-applicable',
      'ar-preview': 'not-applicable',
      'mobile-optimized': 'available',
      'email-receipt': 'not-applicable',
      'inventory-sync': 'not-applicable',
    },
    shop: {
      'stripe-checkout': 'available',
      subscription: 'planned',
      'one-time': 'available',
      '3d-config': 'not-applicable',
      'ar-preview': 'planned',
      'mobile-optimized': 'available',
      'email-receipt': 'available',
      'inventory-sync': 'in-progress',
    },
  },
};

// Dashboard Metrics
const B2C_METRICS = [
  { label: 'Products', value: 5, icon: Package },
  { label: 'Features Shipped', value: 12, change: '+3 this quarter', trend: 'up' as const, icon: CheckCircle2 },
  { label: 'In Progress', value: 3, icon: Play },
  { label: 'Planned', value: 4, icon: Circle },
];

const B2C_MILESTONES = [
  { label: 'Kids Line V2 Launch', date: 'Feb 2026' },
  { label: 'AR Try-On Beta', date: 'Mar 2026' },
  { label: 'Mobile App Release', date: 'Q2 2026' },
];

type ViewType = 'timeline' | 'kanban' | 'matrix' | 'dashboard';

export default function RoadmapB2C() {
  const [activeView, setActiveView] = useState<ViewType>('dashboard');

  return (
    <div className="min-h-screen bg-background">
      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
          backgroundSize: '40px 40px',
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
          title="Consumer Products"
          subtitle="Direct-to-consumer roadmap for premium technical apparel, equipment configurators, and brand experiences."
          icon={ShoppingBag}
          badge="B2C"
          badgeVariant="default"
        />

        {/* View Toggle */}
        <div className="flex items-center justify-between mt-8 mb-6">
          <RoadmapViewToggle activeView={activeView} onViewChange={setActiveView} />
          <Link to="/roadmap/b2b">
            <Button variant="outline" size="sm" className="text-xs gap-1.5">
              View B2B Roadmap
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
          {activeView === 'timeline' && <RoadmapTimeline phases={B2C_PHASES} />}
          {activeView === 'kanban' && <RoadmapKanban columns={B2C_KANBAN} />}
          {activeView === 'matrix' && <RoadmapMatrix data={B2C_MATRIX} />}
          {activeView === 'dashboard' && (
            <RoadmapDashboard
              metrics={B2C_METRICS}
              completionPercentage={65}
              activeInitiatives={3}
              upcomingMilestones={B2C_MILESTONES}
            />
          )}
        </motion.div>
      </div>
    </div>
  );
}
