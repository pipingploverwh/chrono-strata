import { useState, useEffect } from "react";
import { 
  History, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  RefreshCw,
  Trash2,
  Filter
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface SyncLog {
  id: string;
  timestamp: Date;
  type: 'export' | 'webhook' | 'api' | 'scheduled';
  modules: string[];
  recordCount: number;
  status: 'success' | 'error' | 'pending';
  message: string;
  duration?: number;
}

interface OdooSyncDashboardProps {
  logs: SyncLog[];
  onClearLogs: () => void;
  onRefresh: () => void;
}

export const OdooSyncDashboard = ({ logs, onClearLogs, onRefresh }: OdooSyncDashboardProps) => {
  const [filter, setFilter] = useState<'all' | 'success' | 'error'>('all');
  
  const filteredLogs = logs.filter(log => {
    if (filter === 'all') return true;
    return log.status === filter;
  });

  const stats = {
    total: logs.length,
    success: logs.filter(l => l.status === 'success').length,
    error: logs.filter(l => l.status === 'error').length,
    totalRecords: logs.reduce((sum, l) => sum + l.recordCount, 0),
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'export': return 'File Export';
      case 'webhook': return 'Webhook';
      case 'api': return 'API Sync';
      case 'scheduled': return 'Scheduled';
      default: return type;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'export': return 'bg-blue-100 text-blue-700';
      case 'webhook': return 'bg-purple-100 text-purple-700';
      case 'api': return 'bg-cyan-100 text-cyan-700';
      case 'scheduled': return 'bg-amber-100 text-amber-700';
      default: return 'bg-neutral-100 text-neutral-700';
    }
  };

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <History className="w-5 h-5" />
            Sync History & Status
          </CardTitle>
          <div className="flex items-center gap-2">
            <Select value={filter} onValueChange={(v: any) => setFilter(v)}>
              <SelectTrigger className="w-32">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="success">Success</SelectItem>
                <SelectItem value="error">Errors</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" onClick={onRefresh}>
              <RefreshCw className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={onClearLogs}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Stats Row */}
        <div className="grid grid-cols-4 gap-3">
          <div className="bg-neutral-50 rounded-lg p-3 text-center">
            <div className="text-2xl font-semibold text-neutral-900">{stats.total}</div>
            <div className="text-xs text-neutral-500">Total Syncs</div>
          </div>
          <div className="bg-green-50 rounded-lg p-3 text-center">
            <div className="text-2xl font-semibold text-green-600">{stats.success}</div>
            <div className="text-xs text-green-600">Successful</div>
          </div>
          <div className="bg-red-50 rounded-lg p-3 text-center">
            <div className="text-2xl font-semibold text-red-600">{stats.error}</div>
            <div className="text-xs text-red-600">Errors</div>
          </div>
          <div className="bg-blue-50 rounded-lg p-3 text-center">
            <div className="text-2xl font-semibold text-blue-600">{stats.totalRecords}</div>
            <div className="text-xs text-blue-600">Records Synced</div>
          </div>
        </div>

        {/* Log List */}
        <ScrollArea className="h-64">
          <div className="space-y-2">
            {filteredLogs.length === 0 ? (
              <div className="text-center py-8 text-neutral-400">
                <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No sync history yet</p>
              </div>
            ) : (
              filteredLogs.map((log) => (
                <div
                  key={log.id}
                  className="flex items-start gap-3 p-3 rounded-lg border bg-white hover:bg-neutral-50 transition-colors"
                >
                  {log.status === 'success' && <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />}
                  {log.status === 'error' && <XCircle className="w-5 h-5 text-red-500 mt-0.5" />}
                  {log.status === 'pending' && <Clock className="w-5 h-5 text-amber-500 mt-0.5 animate-pulse" />}
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className={getTypeColor(log.type)} variant="secondary">
                        {getTypeLabel(log.type)}
                      </Badge>
                      <span className="text-xs text-neutral-400">
                        {log.timestamp.toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm text-neutral-700 truncate">{log.message}</p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-neutral-500">
                      <span>{log.recordCount} records</span>
                      <span>•</span>
                      <span>{log.modules.join(', ')}</span>
                      {log.duration && (
                        <>
                          <span>•</span>
                          <span>{log.duration}ms</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
