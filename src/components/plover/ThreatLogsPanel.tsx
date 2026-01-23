import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  AlertTriangle, 
  Bell, 
  CheckCircle2, 
  Clock, 
  MapPin,
  ExternalLink,
  Loader2,
  RefreshCw
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useThreatLogs, ThreatLog } from "@/hooks/useThreatLogs";
import { formatDistanceToNow } from "date-fns";

export function ThreatLogsPanel() {
  const { logs, loading, refetch } = useThreatLogs();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (loading) {
    return (
      <Card className="bg-neutral-900/50 border-neutral-800 p-8 flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-cyan-400 animate-spin" />
      </Card>
    );
  }

  return (
    <Card className="bg-neutral-900/50 border-neutral-800">
      <div className="p-4 border-b border-neutral-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded bg-red-500/10">
            <Bell className="w-4 h-4 text-red-400" />
          </div>
          <div>
            <h3 className="font-mono text-sm uppercase tracking-wider text-white">
              Threat Alert Log
            </h3>
            <p className="text-[10px] text-neutral-500">
              {logs.length} alerts recorded
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => refetch()}
          className="text-cyan-400 hover:text-cyan-300"
        >
          <RefreshCw className="w-4 h-4" />
        </Button>
      </div>

      <ScrollArea className="h-[400px]">
        {logs.length === 0 ? (
          <div className="p-8 text-center">
            <CheckCircle2 className="w-12 h-12 text-emerald-500/30 mx-auto mb-3" />
            <p className="text-neutral-500 text-sm">No threat alerts recorded</p>
            <p className="text-neutral-600 text-xs mt-1">
              Alerts will appear here when high-threat conditions are detected
            </p>
          </div>
        ) : (
          <div className="divide-y divide-neutral-800">
            {logs.map((log) => (
              <ThreatLogItem
                key={log.id}
                log={log}
                expanded={expandedId === log.id}
                onToggle={() => setExpandedId(expandedId === log.id ? null : log.id)}
              />
            ))}
          </div>
        )}
      </ScrollArea>
    </Card>
  );
}

function ThreatLogItem({
  log,
  expanded,
  onToggle,
}: {
  log: ThreatLog;
  expanded: boolean;
  onToggle: () => void;
}) {
  const timeAgo = formatDistanceToNow(new Date(log.created_at), { addSuffix: true });
  const googleMapsLink = `https://www.google.com/maps?q=${log.latitude},${log.longitude}`;

  return (
    <div
      className="p-4 hover:bg-neutral-800/30 transition-colors cursor-pointer"
      onClick={onToggle}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded bg-red-500/20 mt-0.5">
            <AlertTriangle className="w-4 h-4 text-red-400" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-white font-medium">{log.site_name}</span>
              <Badge variant="outline" className="text-[10px] border-red-500/50 text-red-400">
                HIGH THREAT
              </Badge>
              {log.alert_sent && (
                <Badge variant="outline" className="text-[10px] border-emerald-500/50 text-emerald-400">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  Notified
                </Badge>
              )}
            </div>
            <p className="text-xs font-mono text-neutral-500">{log.site_id}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-mono text-neutral-500 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {timeAgo}
          </p>
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 pl-11 space-y-3"
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-neutral-800/50 p-3 rounded">
                <p className="text-[10px] font-mono uppercase text-neutral-500 mb-1">
                  Eggs at Risk
                </p>
                <p className="text-lg text-white">{log.eggs || 0}</p>
              </div>
              <div className="bg-neutral-800/50 p-3 rounded">
                <p className="text-[10px] font-mono uppercase text-neutral-500 mb-1">
                  Chicks at Risk
                </p>
                <p className="text-lg text-white">{log.chicks || 0}</p>
              </div>
            </div>

            <div className="bg-neutral-800/50 p-3 rounded">
              <p className="text-[10px] font-mono uppercase text-neutral-500 mb-1 flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                Coordinates
              </p>
              <p className="font-mono text-cyan-400 text-sm">
                {log.latitude.toFixed(6)}°N, {Math.abs(log.longitude).toFixed(6)}°W
              </p>
            </div>

            {log.observer_notes && (
              <div className="bg-neutral-800/50 p-3 rounded">
                <p className="text-[10px] font-mono uppercase text-neutral-500 mb-1">
                  Observer Notes
                </p>
                <p className="text-neutral-300 text-sm">{log.observer_notes}</p>
              </div>
            )}

            <div className="flex items-center gap-2">
              <a
                href={googleMapsLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                <ExternalLink className="w-3 h-3" />
                View on Map
              </a>
              {log.alert_sent_at && (
                <span className="text-[10px] text-neutral-500">
                  Alert sent:{" "}
                  {new Date(log.alert_sent_at).toLocaleString("en-US", {
                    dateStyle: "short",
                    timeStyle: "short",
                  })}
                </span>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default ThreatLogsPanel;
