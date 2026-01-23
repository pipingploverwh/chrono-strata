import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Shield, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { NestingSiteDisplay } from "@/hooks/useNestingSites";

interface ThreatLevelSelectorProps {
  site: NestingSiteDisplay;
  onUpdateThreat: (
    siteId: string,
    threatLevel: "low" | "medium" | "high",
    notes?: string
  ) => Promise<void>;
  onClose: () => void;
}

export function ThreatLevelSelector({
  site,
  onUpdateThreat,
  onClose,
}: ThreatLevelSelectorProps) {
  const [selectedLevel, setSelectedLevel] = useState<"low" | "medium" | "high">(
    site.threatLevel
  );
  const [notes, setNotes] = useState(site.observerNotes || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await onUpdateThreat(site.id, selectedLevel, notes);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const threatColors = {
    low: "border-emerald-500/50 text-emerald-400 bg-emerald-500/10",
    medium: "border-amber-500/50 text-amber-400 bg-amber-500/10",
    high: "border-red-500/50 text-red-400 bg-red-500/10",
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="absolute inset-0 z-50 bg-neutral-950/95 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        className="bg-neutral-900 border border-neutral-800 rounded-lg w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
        initial={{ y: 20 }}
        animate={{ y: 0 }}
      >
        {/* Header */}
        <div className="p-4 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded bg-amber-500/10">
              <Shield className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <h3 className="text-white font-medium">Update Threat Level</h3>
              <p className="text-xs text-neutral-500">{site.zone}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Body */}
        <div className="p-4 space-y-4">
          {/* Current Status */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-neutral-500">Current Level:</span>
            <Badge
              variant="outline"
              className={`${threatColors[site.threatLevel]}`}
            >
              {site.threatLevel.toUpperCase()}
            </Badge>
          </div>

          {/* Threat Level Selector */}
          <div className="space-y-2">
            <label className="text-[10px] font-mono uppercase tracking-wider text-neutral-500">
              New Threat Level
            </label>
            <Select
              value={selectedLevel}
              onValueChange={(v) =>
                setSelectedLevel(v as "low" | "medium" | "high")
              }
            >
              <SelectTrigger className="bg-neutral-800 border-neutral-700">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    Low - Normal monitoring
                  </span>
                </SelectItem>
                <SelectItem value="medium">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    Medium - Increased vigilance
                  </span>
                </SelectItem>
                <SelectItem value="high">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-500" />
                    High - Immediate action required
                  </span>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* High Threat Warning */}
          <AnimatePresence>
            {selectedLevel === "high" && site.threatLevel !== "high" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-red-500/10 border border-red-500/30 rounded-lg p-3"
              >
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5" />
                  <div className="text-xs text-red-300">
                    <p className="font-medium">Alert Notification</p>
                    <p className="text-red-400/80 mt-1">
                      Setting threat level to HIGH will trigger an automated
                      email alert to conservation team members.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Notes */}
          <div className="space-y-2">
            <label className="text-[10px] font-mono uppercase tracking-wider text-neutral-500">
              Observer Notes
            </label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Describe the threat conditions..."
              className="bg-neutral-800 border-neutral-700 resize-none h-24"
            />
          </div>

          {/* Site Info */}
          <div className="bg-neutral-800/50 rounded p-3 grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-neutral-500">Eggs:</span>
              <span className="text-white ml-2">{site.eggs}</span>
            </div>
            <div>
              <span className="text-neutral-500">Chicks:</span>
              <span className="text-white ml-2">{site.chicks}</span>
            </div>
            <div className="col-span-2">
              <span className="text-neutral-500">Coordinates:</span>
              <span className="font-mono text-cyan-400 ml-2">
                {site.coordinates.lat.toFixed(4)}°N,{" "}
                {Math.abs(site.coordinates.lon).toFixed(4)}°W
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-neutral-800 flex items-center justify-end gap-2">
          <Button variant="ghost" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={
              selectedLevel === "high"
                ? "bg-red-600 hover:bg-red-700"
                : selectedLevel === "medium"
                ? "bg-amber-600 hover:bg-amber-700"
                : "bg-emerald-600 hover:bg-emerald-700"
            }
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Shield className="w-4 h-4 mr-2" />
            )}
            Update Threat Level
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default ThreatLevelSelector;
