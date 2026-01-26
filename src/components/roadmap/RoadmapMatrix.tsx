import { motion } from 'framer-motion';
import { LucideIcon, CheckCircle2, Circle, Clock, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface MatrixProduct {
  id: string;
  name: string;
  icon: LucideIcon;
  path?: string;
}

export interface MatrixFeature {
  id: string;
  name: string;
  category: string;
}

export type FeatureStatus = 'available' | 'planned' | 'in-progress' | 'not-applicable';

export interface MatrixData {
  products: MatrixProduct[];
  features: MatrixFeature[];
  status: Record<string, Record<string, FeatureStatus>>; // product.id -> feature.id -> status
}

interface RoadmapMatrixProps {
  data: MatrixData;
}

const statusConfig: Record<FeatureStatus, { icon: LucideIcon; className: string; label: string }> = {
  available: { icon: CheckCircle2, className: 'text-emerald-500', label: 'Available' },
  planned: { icon: Circle, className: 'text-muted-foreground', label: 'Planned' },
  'in-progress': { icon: Clock, className: 'text-strata-orange animate-pulse', label: 'In Progress' },
  'not-applicable': { icon: Minus, className: 'text-zinc-700', label: 'N/A' },
};

export function RoadmapMatrix({ data }: RoadmapMatrixProps) {
  const categories = [...new Set(data.features.map((f) => f.category))];

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="sticky left-0 z-10 bg-background p-3 text-left font-mono text-xs uppercase tracking-wider text-muted-foreground border-b border-border">
              Feature
            </th>
            {data.products.map((product, index) => (
              <motion.th
                key={product.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-3 text-center border-b border-border min-w-[100px]"
              >
                <div className="flex flex-col items-center gap-1">
                  <product.icon className="w-5 h-5 text-primary" />
                  <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                    {product.name}
                  </span>
                </div>
              </motion.th>
            ))}
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <>
              <tr key={`category-${category}`}>
                <td
                  colSpan={data.products.length + 1}
                  className="bg-muted/30 px-3 py-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground border-b border-border"
                >
                  {category}
                </td>
              </tr>
              {data.features
                .filter((f) => f.category === category)
                .map((feature, featureIndex) => (
                  <motion.tr
                    key={feature.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: featureIndex * 0.02 }}
                    className="hover:bg-muted/20 transition-colors"
                  >
                    <td className="sticky left-0 z-10 bg-background p-3 text-sm border-b border-border/50">
                      {feature.name}
                    </td>
                    {data.products.map((product) => {
                      const status = data.status[product.id]?.[feature.id] || 'not-applicable';
                      const config = statusConfig[status];
                      const StatusIcon = config.icon;

                      return (
                        <td
                          key={`${product.id}-${feature.id}`}
                          className="p-3 text-center border-b border-border/50"
                        >
                          <div className="flex justify-center" title={config.label}>
                            <StatusIcon className={cn('w-4 h-4', config.className)} />
                          </div>
                        </td>
                      );
                    })}
                  </motion.tr>
                ))}
            </>
          ))}
        </tbody>
      </table>
    </div>
  );
}
