import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Beaker, 
  Music, 
  Disc, 
  Shirt, 
  Sparkles, 
  ArrowLeft, 
  AlertTriangle,
  ExternalLink,
  ShoppingBag,
  Building2,
  Map,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface LabProject {
  id: string;
  name: string;
  description: string;
  classification: 'brand-signal' | 'r-and-d' | 'deprecated' | 'roadmap';
  icon: React.ComponentType<{ className?: string }>;
  path: string;
  status: 'active' | 'experimental' | 'archived';
}

const LAB_PROJECTS: LabProject[] = [
  {
    id: 'roadmap-b2c',
    name: 'Consumer Roadmap (B2C)',
    description: 'Product roadmap for STRATA Shell, Kids Kit, APEX-1, Thermal, and Shop',
    classification: 'roadmap',
    icon: ShoppingBag,
    path: '/roadmap/b2c',
    status: 'active',
  },
  {
    id: 'roadmap-b2b',
    name: 'Enterprise Roadmap (B2B)',
    description: 'Product roadmap for Aviation, Marine, Compliance, MeetingFlow, and Briefing',
    classification: 'roadmap',
    icon: Building2,
    path: '/roadmap/b2b',
    status: 'active',
  },
  {
    id: 'aal-auth',
    name: 'AAL Geometric Authentication',
    description: 'Multi-method auth system with Email, Magic Link, Google OAuth, and Enterprise SSO',
    classification: 'r-and-d',
    icon: Sparkles,
    path: '/auth',
    status: 'archived',
  },
  {
    id: 'thermal-visualizer',
    name: 'Thermal Music Visualizer',
    description: 'Audio-reactive temperature visualization with psychoacoustic mapping',
    classification: 'brand-signal',
    icon: Music,
    path: '/thermal-viz',
    status: 'active',
  },
  {
    id: 'dj-table',
    name: 'DJ Table Configurator',
    description: 'Custom DJ equipment configuration with LED and finish options',
    classification: 'r-and-d',
    icon: Disc,
    path: '/dj-table',
    status: 'experimental',
  },
  {
    id: 'apparel-blueprint',
    name: 'Apparel Blueprint',
    description: '3D pattern visualization for STRATA Shell technical garments',
    classification: 'r-and-d',
    icon: Shirt,
    path: '/apparel-blueprint',
    status: 'experimental',
  },
  {
    id: 'psychoacoustic',
    name: 'Psychoacoustic Presets',
    description: 'Audio processing preset system with thermal mapping',
    classification: 'brand-signal',
    icon: Sparkles,
    path: '/thermal-viz',
    status: 'active',
  },
];

const CLASSIFICATION_STYLES = {
  'brand-signal': {
    bg: 'bg-lavender/10',
    border: 'border-lavender/30',
    text: 'text-lavender',
    label: 'Brand Signal',
  },
  'r-and-d': {
    bg: 'bg-strata-cyan/10',
    border: 'border-strata-cyan/30',
    text: 'text-strata-cyan',
    label: 'R&D',
  },
  'deprecated': {
    bg: 'bg-strata-steel/10',
    border: 'border-strata-steel/30',
    text: 'text-strata-silver',
    label: 'Deprecated',
  },
  'roadmap': {
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/30',
    text: 'text-emerald-500',
    label: 'Roadmap',
  },
};

const STATUS_STYLES = {
  active: 'bg-strata-lume/20 text-strata-lume',
  experimental: 'bg-strata-orange/20 text-strata-orange',
  archived: 'bg-strata-steel/20 text-strata-silver',
};

export default function Labs() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-strata-charcoal to-strata-black">
      {/* Header */}
      <header className="border-b border-strata-steel/20 bg-strata-charcoal/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="text-strata-silver hover:text-strata-white text-sm font-mono flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Exit Labs
            </Link>
            <div className="flex items-center gap-2">
              <Beaker className="w-5 h-5 text-lavender" />
              <h1 className="font-instrument text-2xl tracking-wider text-white">LABS</h1>
              <Badge className="bg-strata-orange/20 text-strata-orange text-[10px] border-0">
                SANDBOX
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Warning Banner */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 p-4 rounded-lg bg-strata-orange/5 border border-strata-orange/20 flex items-start gap-3"
        >
          <AlertTriangle className="w-5 h-5 text-strata-orange flex-shrink-0 mt-0.5" />
          <div>
            <div className="text-sm font-semibold text-strata-orange">Experimental Features</div>
            <p className="text-xs text-strata-silver/70 mt-1">
              These projects are isolated from core enterprise workflows. They represent brand exploration, 
              R&D initiatives, or deprecated features. Not intended for production use.
            </p>
          </div>
        </motion.div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 gap-4">
          {LAB_PROJECTS.map((project, index) => {
            const classificationStyle = CLASSIFICATION_STYLES[project.classification];
            const Icon = project.icon;
            
            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  to={project.path}
                  className={`block p-5 rounded-xl border ${classificationStyle.border} ${classificationStyle.bg} hover:bg-opacity-20 transition-all group`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className={`w-10 h-10 rounded-lg ${classificationStyle.bg} flex items-center justify-center`}>
                      <Icon className={`w-5 h-5 ${classificationStyle.text}`} />
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={`${STATUS_STYLES[project.status]} text-[9px] border-0`}>
                        {project.status.toUpperCase()}
                      </Badge>
                      <Badge className={`${classificationStyle.bg} ${classificationStyle.text} text-[9px] border-0`}>
                        {classificationStyle.label}
                      </Badge>
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-strata-white group-hover:text-lavender transition-colors">
                    {project.name}
                  </h3>
                  <p className="text-sm text-strata-silver/60 mt-1 mb-3">
                    {project.description}
                  </p>
                  
                  <div className="flex items-center gap-2 text-xs font-mono text-strata-silver/40">
                    <span>Open Project</span>
                    <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Footer */}
        <footer className="mt-12 pt-6 border-t border-strata-steel/20 text-center">
          <p className="text-[10px] font-mono text-strata-silver/40 uppercase tracking-widest">
            LAVANDAR Labs • Experimental R&D Sandbox
          </p>
        </footer>
      </main>
    </div>
  );
}
