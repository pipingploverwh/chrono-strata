import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceLine,
  Legend,
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { BurndownPoint } from './types';

interface BurndownChartProps {
  data: BurndownPoint[];
  sprintName: string;
  startDate: string;
  endDate: string;
}

export function BurndownChart({ data, sprintName, startDate, endDate }: BurndownChartProps) {
  const today = '2026-01-26';
  const totalPoints = data[0]?.planned || 0;
  const currentActual = data.find(d => d.date === today)?.actual || 0;
  const plannedToday = data.find(d => d.date === today)?.planned || 0;
  const variance = currentActual - plannedToday;
  
  const chartData = data.map(d => ({
    ...d,
    date: d.date.split('-').slice(1).join('/'), // Format as MM/DD
  }));

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Sprint Burndown</CardTitle>
            <CardDescription>{sprintName}</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={variance <= 0 ? 'default' : 'destructive'} className="font-mono">
              {variance > 0 ? '+' : ''}{variance}pt variance
            </Badge>
            <Badge variant="outline" className="font-mono">
              {currentActual}pt remaining
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="h-[250px] mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="date" 
                className="text-xs fill-muted-foreground"
                tick={{ fontSize: 10 }}
              />
              <YAxis 
                className="text-xs fill-muted-foreground"
                tick={{ fontSize: 10 }}
                domain={[0, totalPoints]}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
              />
              <Legend />
              
              {/* Ideal burndown line */}
              <Line 
                type="linear" 
                dataKey="planned" 
                stroke="hsl(var(--muted-foreground))"
                strokeDasharray="5 5"
                strokeWidth={2}
                dot={false}
                name="Planned"
              />
              
              {/* Actual burndown line */}
              <Line 
                type="monotone" 
                dataKey="actual" 
                stroke="hsl(var(--primary))"
                strokeWidth={3}
                dot={{ fill: 'hsl(var(--primary))', strokeWidth: 0, r: 4 }}
                activeDot={{ r: 6 }}
                name="Actual"
                connectNulls={false}
              />
              
              {/* Today marker */}
              <ReferenceLine 
                x="01/26" 
                stroke="hsl(var(--destructive))" 
                strokeDasharray="3 3"
                label={{ 
                  value: 'Today', 
                  position: 'top',
                  fill: 'hsl(var(--destructive))',
                  fontSize: 10,
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        {/* Sprint Info */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t text-xs text-muted-foreground">
          <span>Start: {startDate}</span>
          <span className="font-semibold text-foreground">5 days remaining</span>
          <span>End: {endDate}</span>
        </div>
      </CardContent>
    </Card>
  );
}
