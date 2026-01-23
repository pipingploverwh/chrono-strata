import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Settings, X, Keyboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";

export interface PromptSettings {
  verbosity: "concise" | "detailed";
  style: "technical" | "conversational";
  focus: "feature" | "user-story";
}

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  settings: PromptSettings;
  onSettingsChange: (settings: PromptSettings) => void;
}

const KEYBOARD_SHORTCUTS = [
  { keys: "⌘ + R", description: "Start/Stop recording" },
  { keys: "⌘ + C", description: "Copy first prompt" },
  { keys: "⌘ + S", description: "Open settings" },
  { keys: "Esc", description: "Close panel / Go back" },
];

export function SettingsPanel({
  isOpen,
  onClose,
  settings,
  onSettingsChange,
}: SettingsPanelProps) {
  const updateSetting = <K extends keyof PromptSettings>(
    key: K,
    value: PromptSettings[K]
  ) => {
    onSettingsChange({ ...settings, [key]: value });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-background border-l z-50 overflow-y-auto"
          >
            <div className="p-6 space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Settings
                </h2>
                <Button variant="ghost" size="icon" onClick={onClose}>
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <Separator />

              {/* Prompt Generation Style */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Prompt Generation</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Verbosity */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Verbosity</Label>
                    <RadioGroup
                      value={settings.verbosity}
                      onValueChange={(v) =>
                        updateSetting("verbosity", v as "concise" | "detailed")
                      }
                      className="flex gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="concise" id="concise" />
                        <Label htmlFor="concise" className="font-normal cursor-pointer">
                          Concise
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="detailed" id="detailed" />
                        <Label htmlFor="detailed" className="font-normal cursor-pointer">
                          Detailed
                        </Label>
                      </div>
                    </RadioGroup>
                    <p className="text-xs text-muted-foreground">
                      {settings.verbosity === "concise"
                        ? "Brief, focused prompts under 100 words"
                        : "Comprehensive prompts with full context"}
                    </p>
                  </div>

                  {/* Style */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Tone</Label>
                    <RadioGroup
                      value={settings.style}
                      onValueChange={(v) =>
                        updateSetting("style", v as "technical" | "conversational")
                      }
                      className="flex gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="technical" id="technical" />
                        <Label htmlFor="technical" className="font-normal cursor-pointer">
                          Technical
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="conversational" id="conversational" />
                        <Label htmlFor="conversational" className="font-normal cursor-pointer">
                          Conversational
                        </Label>
                      </div>
                    </RadioGroup>
                    <p className="text-xs text-muted-foreground">
                      {settings.style === "technical"
                        ? "Code-focused with specific implementation details"
                        : "Natural language describing desired outcomes"}
                    </p>
                  </div>

                  {/* Focus */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Framing</Label>
                    <RadioGroup
                      value={settings.focus}
                      onValueChange={(v) =>
                        updateSetting("focus", v as "feature" | "user-story")
                      }
                      className="flex gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="feature" id="feature" />
                        <Label htmlFor="feature" className="font-normal cursor-pointer">
                          Feature-focused
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="user-story" id="user-story" />
                        <Label htmlFor="user-story" className="font-normal cursor-pointer">
                          User Story
                        </Label>
                      </div>
                    </RadioGroup>
                    <p className="text-xs text-muted-foreground">
                      {settings.focus === "feature"
                        ? '"Create a login page with email and password..."'
                        : '"As a user, I want to sign in so that..."'}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Keyboard Shortcuts */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Keyboard className="h-4 w-4" />
                    Keyboard Shortcuts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {KEYBOARD_SHORTCUTS.map((shortcut) => (
                      <div
                        key={shortcut.keys}
                        className="flex items-center justify-between"
                      >
                        <span className="text-sm text-muted-foreground">
                          {shortcut.description}
                        </span>
                        <kbd className="px-2 py-1 text-xs font-mono bg-muted rounded">
                          {shortcut.keys}
                        </kbd>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
