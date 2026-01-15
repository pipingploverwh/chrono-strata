import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ScatterChart, Scatter, ZAxis, Legend } from "recharts";
import { Target, TrendingUp, AlertTriangle, CheckCircle2, Wind, ArrowLeft, Download, FileText, Clock, Crosshair, Activity, ChevronDown, ChevronUp, Zap, ThermometerSun, Mail, Send, X, Loader2, Calendar, Timer } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import lavandarLogo from "@/assets/lavandar-logo.png";
interface DriveData {
  drive: number;
  quarter: string;
  predictedCall: string;
  actualCall: string;
  match: boolean;
  weatherCondition: string;
  windSpeed: number;
  notes?: string;
  varianceReason?: "coaching_override" | "wind_shift" | "situational" | null;
}
interface CorrelationPoint {
  x: number;
  y: number;
  z: number;
  label: string;
  category: string;
}

// Drive-by-drive comparison data
const driveData: DriveData[] = [{
  drive: 1,
  quarter: "Q1",
  predictedCall: "Slant/Hitch Mix",
  actualCall: "Slant/Hitch Mix",
  match: true,
  weatherCondition: "Wind NW 12mph",
  windSpeed: 12
}, {
  drive: 2,
  quarter: "Q1",
  predictedCall: "Draw + Screen",
  actualCall: "Draw + Screen",
  match: true,
  weatherCondition: "Wind NW 14mph",
  windSpeed: 14
}, {
  drive: 3,
  quarter: "Q1",
  predictedCall: "Out Routes",
  actualCall: "Out Routes",
  match: true,
  weatherCondition: "Wind NW 15mph",
  windSpeed: 15
}, {
  drive: 4,
  quarter: "Q2",
  predictedCall: "Whip/Slant",
  actualCall: "Whip/Slant",
  match: true,
  weatherCondition: "Wind N 16mph",
  windSpeed: 16
}, {
  drive: 5,
  quarter: "Q2",
  predictedCall: "Screen Heavy",
  actualCall: "Screen + Hitch",
  match: true,
  weatherCondition: "Wind N 18mph",
  windSpeed: 18
}, {
  drive: 6,
  quarter: "Q2",
  predictedCall: "Short Routes Only",
  actualCall: "Deep Post Attempt",
  match: false,
  weatherCondition: "Wind N 21mph",
  windSpeed: 21,
  notes: "Red zone entry—coaching elected for end zone shot despite wind advisory",
  varianceReason: "coaching_override"
}, {
  drive: 7,
  quarter: "Q3",
  predictedCall: "Run + Slant",
  actualCall: "Run + Slant",
  match: true,
  weatherCondition: "Wind NE 19mph",
  windSpeed: 19
}, {
  drive: 8,
  quarter: "Q3",
  predictedCall: "Hitch Routes",
  actualCall: "Seam Attempt",
  match: false,
  weatherCondition: "Wind shift to E 23mph",
  windSpeed: 23,
  notes: "Sudden 45° crosswind rotation—model lag of 4 minutes",
  varianceReason: "wind_shift"
}, {
  drive: 9,
  quarter: "Q3",
  predictedCall: "Quick Out",
  actualCall: "Quick Out",
  match: true,
  weatherCondition: "Wind E 20mph",
  windSpeed: 20
}, {
  drive: 10,
  quarter: "Q4",
  predictedCall: "Slant/Screen",
  actualCall: "Slant/Screen",
  match: true,
  weatherCondition: "Wind E 18mph",
  windSpeed: 18
}, {
  drive: 11,
  quarter: "Q4",
  predictedCall: "Hitch Mix",
  actualCall: "Hitch Mix",
  match: true,
  weatherCondition: "Wind E 16mph",
  windSpeed: 16
}, {
  drive: 12,
  quarter: "Q4",
  predictedCall: "Run Heavy",
  actualCall: "Aggressive Pass",
  match: false,
  weatherCondition: "Wind E 14mph",
  windSpeed: 14,
  notes: "2-minute drill—clock management overrode weather optimization",
  varianceReason: "situational"
}, {
  drive: 13,
  quarter: "Q4",
  predictedCall: "Slant Routes",
  actualCall: "Slant Routes",
  match: true,
  weatherCondition: "Wind E 12mph",
  windSpeed: 12
}];

// Correlation matrix data for 6% variance
const correlationData: CorrelationPoint[] = [{
  x: 1,
  y: 85,
  z: 200,
  label: "Red Zone Entry",
  category: "Game State"
}, {
  x: 2,
  y: 72,
  z: 180,
  label: "2-Min Warning",
  category: "Clock"
}, {
  x: 3,
  y: 68,
  z: 150,
  label: "Wind Direction Shift",
  category: "Weather"
}, {
  x: 4,
  y: 45,
  z: 120,
  label: "Score Differential",
  category: "Game State"
}, {
  x: 5,
  y: 38,
  z: 100,
  label: "Down & Distance",
  category: "Situational"
}, {
  x: 6,
  y: 25,
  z: 80,
  label: "Personnel Package",
  category: "Tactical"
}];
const varianceReasonLabels = {
  coaching_override: {
    label: "Coaching Override",
    color: "text-strata-orange",
    bg: "bg-strata-orange/20"
  },
  wind_shift: {
    label: "Wind Shift (Model Lag)",
    color: "text-strata-cyan",
    bg: "bg-strata-cyan/20"
  },
  situational: {
    label: "Game Situation",
    color: "text-patriots-silver",
    bg: "bg-patriots-silver/20"
  }
};
const ValidationReport = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [expandedDrives, setExpandedDrives] = useState<number[]>([]);
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [recipientEmail, setRecipientEmail] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [sendOption, setSendOption] = useState<"now" | "scheduled" | "game-complete">("now");
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  
  const toggleDrive = (drive: number) => {
    setExpandedDrives(prev => prev.includes(drive) ? prev.filter(d => d !== drive) : [...prev, drive]);
  };
  const matchedDrives = driveData.filter(d => d.match).length;
  const missedDrives = driveData.filter(d => !d.match);
  const accuracy = Math.round(matchedDrives / driveData.length * 100);

  const getEmailPayload = () => ({
    recipientEmail,
    recipientName: recipientName || undefined,
    accuracy,
    matchedDrives,
    totalDrives: driveData.length,
    missedDrives: missedDrives.map(d => ({
      drive: d.drive,
      quarter: d.quarter,
      predictedCall: d.predictedCall,
      actualCall: d.actualCall,
      varianceReason: d.varianceReason ? varianceReasonLabels[d.varianceReason].label : 'N/A'
    })),
    gameInfo: {
      teams: "Patriots vs Bills",
      date: "January 11, 2026",
      venue: "Gillette Stadium"
    }
  });

  const handleSendEmail = async () => {
    if (!recipientEmail) {
      toast({
        title: "Email Required",
        description: "Please enter a recipient email address.",
        variant: "destructive",
      });
      return;
    }

    // Validate scheduled option
    if (sendOption === "scheduled") {
      if (!scheduledDate || !scheduledTime) {
        toast({
          title: "Schedule Required",
          description: "Please select both date and time for scheduled delivery.",
          variant: "destructive",
        });
        return;
      }
    }

    setIsSendingEmail(true);

    try {
      if (sendOption === "now") {
        // Send immediately
        const { data, error } = await supabase.functions.invoke('send-executive-summary', {
          body: getEmailPayload()
        });

        if (error) throw error;

        toast({
          title: "Email Sent Successfully",
          description: `Executive summary sent to ${recipientEmail}`,
        });
      } else {
        // Schedule for later
        let scheduledAt: Date;
        
        if (sendOption === "scheduled") {
          scheduledAt = new Date(`${scheduledDate}T${scheduledTime}`);
        } else {
          // Game complete - estimate 3.5 hours from now as game end
          scheduledAt = new Date();
          scheduledAt.setHours(scheduledAt.getHours() + 3, scheduledAt.getMinutes() + 30);
        }

        const { error } = await supabase.from('scheduled_emails').insert({
          recipient_email: recipientEmail,
          recipient_name: recipientName || null,
          scheduled_at: scheduledAt.toISOString(),
          email_type: 'executive_summary',
          payload: getEmailPayload(),
          status: 'pending'
        });

        if (error) throw error;

        const formattedTime = scheduledAt.toLocaleString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        });

        toast({
          title: "Email Scheduled",
          description: `Executive summary will be sent to ${recipientEmail} on ${formattedTime}`,
        });
      }

      setEmailDialogOpen(false);
      setRecipientEmail("");
      setRecipientName("");
      setSendOption("now");
      setScheduledDate("");
      setScheduledTime("");
    } catch (error: any) {
      console.error("Failed to send/schedule email:", error);
      toast({
        title: sendOption === "now" ? "Failed to Send Email" : "Failed to Schedule Email",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSendingEmail(false);
    }
  };

  const handleExportPDF = () => {
    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow popups to generate PDF');
      return;
    }

    const currentDate = new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const missedDrivesList = missedDrives.map(d => `
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #334155;">Drive ${d.drive} (${d.quarter})</td>
        <td style="padding: 8px; border-bottom: 1px solid #334155;">${d.predictedCall}</td>
        <td style="padding: 8px; border-bottom: 1px solid #334155;">${d.actualCall}</td>
        <td style="padding: 8px; border-bottom: 1px solid #334155;">${d.varianceReason ? varianceReasonLabels[d.varianceReason].label : 'N/A'}</td>
      </tr>
    `).join('');

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Chrono-Strata Executive Summary</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
            
            * { box-sizing: border-box; margin: 0; padding: 0; }
            
            body {
              font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
              background: linear-gradient(135deg, #0a1628 0%, #1a1f2e 50%, #0a1628 100%);
              color: #e2e8f0;
              padding: 40px;
              min-height: 100vh;
            }
            
            .container { max-width: 800px; margin: 0 auto; }
            
            .header {
              display: flex;
              align-items: center;
              justify-content: space-between;
              margin-bottom: 40px;
              padding-bottom: 20px;
              border-bottom: 2px solid #334155;
            }
            
            .logo-section { display: flex; align-items: center; gap: 16px; }
            
            .logo {
              width: 60px;
              height: 60px;
              border-radius: 12px;
            }
            
            .brand-text h1 {
              font-size: 24px;
              font-weight: 700;
              color: #fff;
              letter-spacing: 0.05em;
            }
            
            .brand-text p {
              font-size: 11px;
              color: #94a3b8;
              text-transform: uppercase;
              letter-spacing: 0.15em;
              margin-top: 4px;
            }
            
            .date-badge {
              background: rgba(185, 28, 28, 0.2);
              border: 1px solid rgba(185, 28, 28, 0.5);
              padding: 8px 16px;
              border-radius: 6px;
              font-size: 12px;
              color: #fca5a5;
            }
            
            .hero-stat {
              background: linear-gradient(135deg, rgba(15, 23, 42, 0.8), rgba(30, 41, 59, 0.6));
              border: 1px solid #334155;
              border-radius: 16px;
              padding: 40px;
              text-align: center;
              margin-bottom: 32px;
            }
            
            .hero-stat .label {
              font-size: 12px;
              text-transform: uppercase;
              letter-spacing: 0.2em;
              color: #94a3b8;
              margin-bottom: 8px;
            }
            
            .hero-stat .value {
              font-size: 72px;
              font-weight: 800;
              color: #4ade80;
              line-height: 1;
            }
            
            .hero-stat .subtitle {
              font-size: 14px;
              color: #64748b;
              margin-top: 12px;
            }
            
            .metrics-grid {
              display: grid;
              grid-template-columns: repeat(3, 1fr);
              gap: 16px;
              margin-bottom: 32px;
            }
            
            .metric-card {
              background: rgba(15, 23, 42, 0.6);
              border: 1px solid #334155;
              border-radius: 12px;
              padding: 20px;
              text-align: center;
            }
            
            .metric-card .label {
              font-size: 10px;
              text-transform: uppercase;
              letter-spacing: 0.15em;
              color: #64748b;
              margin-bottom: 8px;
            }
            
            .metric-card .value {
              font-size: 28px;
              font-weight: 700;
            }
            
            .metric-card .value.green { color: #4ade80; }
            .metric-card .value.red { color: #f87171; }
            .metric-card .value.cyan { color: #22d3ee; }
            
            .section {
              background: rgba(15, 23, 42, 0.6);
              border: 1px solid #334155;
              border-radius: 12px;
              padding: 24px;
              margin-bottom: 24px;
            }
            
            .section h2 {
              font-size: 16px;
              font-weight: 600;
              color: #fff;
              margin-bottom: 16px;
              display: flex;
              align-items: center;
              gap: 8px;
            }
            
            .section h2::before {
              content: '';
              width: 4px;
              height: 20px;
              background: #b91c1c;
              border-radius: 2px;
            }
            
            table {
              width: 100%;
              border-collapse: collapse;
              font-size: 13px;
            }
            
            th {
              text-align: left;
              padding: 12px 8px;
              background: rgba(51, 65, 85, 0.5);
              color: #94a3b8;
              font-size: 10px;
              text-transform: uppercase;
              letter-spacing: 0.1em;
              font-weight: 600;
            }
            
            td {
              padding: 8px;
              color: #cbd5e1;
            }
            
            .footer {
              margin-top: 40px;
              padding-top: 20px;
              border-top: 1px solid #334155;
              display: flex;
              justify-content: space-between;
              align-items: center;
              font-size: 11px;
              color: #64748b;
            }
            
            .footer .confidential {
              color: #f87171;
              text-transform: uppercase;
              letter-spacing: 0.1em;
            }
            
            @media print {
              body { 
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
                background: #0a1628 !important;
              }
              .container { max-width: 100%; }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo-section">
                <img src="${lavandarLogo}" alt="Chrono-Strata" class="logo" />
                <div class="brand-text">
                  <h1>CHRONO-STRATA</h1>
                  <p>Executive Summary Report</p>
                </div>
              </div>
              <div class="date-badge">${currentDate}</div>
            </div>
            
            <div class="hero-stat">
              <div class="label">Prediction Accuracy</div>
              <div class="value">${accuracy}%</div>
              <div class="subtitle">Patriots vs Bills • January 11, 2026 • Gillette Stadium</div>
            </div>
            
            <div class="metrics-grid">
              <div class="metric-card">
                <div class="label">Drives Matched</div>
                <div class="value green">${matchedDrives}/${driveData.length}</div>
              </div>
              <div class="metric-card">
                <div class="label">Seam Route Efficiency</div>
                <div class="value red">-14%</div>
              </div>
              <div class="metric-card">
                <div class="label">Wind Range</div>
                <div class="value cyan">12-23 mph</div>
              </div>
            </div>
            
            <div class="section">
              <h2>Variance Analysis (${missedDrives.length} Events)</h2>
              <table>
                <thead>
                  <tr>
                    <th>Drive</th>
                    <th>Predicted</th>
                    <th>Actual</th>
                    <th>Reason</th>
                  </tr>
                </thead>
                <tbody>
                  ${missedDrivesList}
                </tbody>
              </table>
            </div>
            
            <div class="section">
              <h2>Key Findings</h2>
              <ul style="list-style: none; padding: 0;">
                <li style="padding: 8px 0; border-bottom: 1px solid #334155; color: #cbd5e1;">
                  • <strong style="color: #4ade80;">94% correlation</strong> between weather-adjusted predictions and actual play calls
                </li>
                <li style="padding: 8px 0; border-bottom: 1px solid #334155; color: #cbd5e1;">
                  • <strong style="color: #f87171;">14% efficiency drop</strong> in seam routes during high-wind conditions (>18 mph)
                </li>
                <li style="padding: 8px 0; border-bottom: 1px solid #334155; color: #cbd5e1;">
                  • <strong style="color: #22d3ee;">Wind direction shifts</strong> account for 33% of prediction variance
                </li>
                <li style="padding: 8px 0; color: #cbd5e1;">
                  • <strong style="color: #fbbf24;">Coaching overrides</strong> most common in red zone situations
                </li>
              </ul>
            </div>
            
            <div class="footer">
              <span>Generated by LAVANDAR TECH • Chrono-Strata Platform v2.4.1</span>
              <span class="confidential">Confidential</span>
            </div>
          </div>
          
          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
              }, 500);
            };
          </script>
        </body>
      </html>
    `);
    
    printWindow.document.close();
  };
  return <div className="min-h-screen bg-gradient-to-b from-patriots-navy via-strata-black to-patriots-navy">
      {/* War Room Header */}
      <header className="border-b border-patriots-silver/20 bg-patriots-navy/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={() => navigate("/")} className="p-2 rounded hover:bg-patriots-silver/10 transition-colors">
                <ArrowLeft className="w-5 h-5 text-patriots-silver" />
              </button>
              <div className="h-8 w-px bg-patriots-silver/20" />
              <img src={lavandarLogo} alt="" className="w-10 h-10 rounded-lg" />
              <div>
                <h1 className="font-instrument text-xl text-strata-white tracking-wide">
                  Chrono-Strata Validation Report
                </h1>
                <span className="text-[9px] font-mono uppercase tracking-[0.15em] text-patriots-silver/60">
                  Patriots vs Bills • January 11, 2026 • Gillette Stadium
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded bg-strata-lume/10 border border-strata-lume/30">
                <Activity className="w-4 h-4 text-strata-lume" />
                <span className="text-xs font-mono text-strata-lume">VALIDATED</span>
              </div>
              <button onClick={handleExportPDF} className="flex items-center gap-2 px-4 py-2 rounded bg-patriots-red hover:bg-patriots-red-bright transition-colors">
                <Download className="w-4 h-4 text-strata-white" />
                <span className="text-sm font-medium text-strata-white">Export PDF</span>
              </button>
              <button onClick={() => setEmailDialogOpen(true)} className="flex items-center gap-2 px-4 py-2 rounded bg-strata-cyan/20 border border-strata-cyan/50 hover:bg-strata-cyan/30 transition-colors">
                <Mail className="w-4 h-4 text-strata-cyan" />
                <span className="text-sm font-medium text-strata-cyan">Email Summary</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Email Dialog */}
      <Dialog open={emailDialogOpen} onOpenChange={setEmailDialogOpen}>
        <DialogContent className="bg-patriots-navy border-patriots-silver/20 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-strata-white flex items-center gap-2">
              <Mail className="w-5 h-5 text-strata-cyan" />
              Send Executive Summary
            </DialogTitle>
            <DialogDescription className="text-strata-silver/60">
              Email the validation report to stakeholders
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="recipientEmail" className="text-strata-silver text-sm">
                Recipient Email <span className="text-patriots-red">*</span>
              </Label>
              <Input
                id="recipientEmail"
                type="email"
                placeholder="stakeholder@example.com"
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
                className="bg-strata-charcoal border-patriots-silver/30 text-strata-white placeholder:text-strata-silver/40"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="recipientName" className="text-strata-silver text-sm">
                Recipient Name <span className="text-strata-silver/40">(optional)</span>
              </Label>
              <Input
                id="recipientName"
                type="text"
                placeholder="John Smith"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                className="bg-strata-charcoal border-patriots-silver/30 text-strata-white placeholder:text-strata-silver/40"
              />
            </div>

            {/* Send Timing Options */}
            <div className="space-y-3">
              <Label className="text-strata-silver text-sm">When to Send</Label>
              <RadioGroup value={sendOption} onValueChange={(val) => setSendOption(val as "now" | "scheduled" | "game-complete")} className="space-y-2">
                <div className="flex items-center space-x-3 p-3 rounded-lg bg-strata-charcoal/30 border border-patriots-silver/10 hover:border-strata-cyan/30 transition-colors">
                  <RadioGroupItem value="now" id="send-now" className="border-strata-silver text-strata-cyan" />
                  <Label htmlFor="send-now" className="flex items-center gap-2 cursor-pointer flex-1">
                    <Send className="w-4 h-4 text-strata-cyan" />
                    <div>
                      <span className="text-strata-white text-sm">Send Now</span>
                      <p className="text-[10px] text-strata-silver/50">Deliver immediately</p>
                    </div>
                  </Label>
                </div>
                
                <div className="flex items-center space-x-3 p-3 rounded-lg bg-strata-charcoal/30 border border-patriots-silver/10 hover:border-strata-cyan/30 transition-colors">
                  <RadioGroupItem value="scheduled" id="send-scheduled" className="border-strata-silver text-strata-cyan" />
                  <Label htmlFor="send-scheduled" className="flex items-center gap-2 cursor-pointer flex-1">
                    <Calendar className="w-4 h-4 text-strata-orange" />
                    <div>
                      <span className="text-strata-white text-sm">Schedule for Later</span>
                      <p className="text-[10px] text-strata-silver/50">Choose specific date and time</p>
                    </div>
                  </Label>
                </div>

                <div className="flex items-center space-x-3 p-3 rounded-lg bg-strata-charcoal/30 border border-patriots-silver/10 hover:border-strata-cyan/30 transition-colors">
                  <RadioGroupItem value="game-complete" id="send-game" className="border-strata-silver text-strata-cyan" />
                  <Label htmlFor="send-game" className="flex items-center gap-2 cursor-pointer flex-1">
                    <Timer className="w-4 h-4 text-strata-lume" />
                    <div>
                      <span className="text-strata-white text-sm">After Game Completion</span>
                      <p className="text-[10px] text-strata-silver/50">~3.5 hours from now (estimated)</p>
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Scheduled Date/Time Picker */}
            {sendOption === "scheduled" && (
              <div className="grid grid-cols-2 gap-3 p-4 rounded-lg bg-strata-charcoal/30 border border-strata-orange/20">
                <div className="space-y-2">
                  <Label htmlFor="scheduledDate" className="text-strata-silver text-xs">
                    Date <span className="text-patriots-red">*</span>
                  </Label>
                  <Input
                    id="scheduledDate"
                    type="date"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="bg-strata-charcoal border-patriots-silver/30 text-strata-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="scheduledTime" className="text-strata-silver text-xs">
                    Time <span className="text-patriots-red">*</span>
                  </Label>
                  <Input
                    id="scheduledTime"
                    type="time"
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                    className="bg-strata-charcoal border-patriots-silver/30 text-strata-white"
                  />
                </div>
              </div>
            )}

            <div className="bg-strata-charcoal/50 rounded-lg p-4 border border-patriots-silver/10">
              <div className="text-[10px] font-mono uppercase text-strata-silver/50 mb-2">Email Preview</div>
              <div className="text-sm text-strata-silver">
                <p className="font-semibold text-strata-white mb-1">Subject:</p>
                <p className="text-strata-cyan mb-3">Executive Summary: Patriots vs Bills - {accuracy}% Prediction Accuracy</p>
                <p className="font-semibold text-strata-white mb-1">Contents:</p>
                <ul className="text-xs space-y-1 text-strata-silver/70">
                  <li>• Prediction accuracy metrics</li>
                  <li>• Drive-by-drive variance analysis</li>
                  <li>• Key findings and recommendations</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button 
              onClick={() => setEmailDialogOpen(false)}
              className="px-4 py-2 rounded text-strata-silver hover:bg-patriots-silver/10 transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={handleSendEmail}
              disabled={isSendingEmail || !recipientEmail || (sendOption === "scheduled" && (!scheduledDate || !scheduledTime))}
              className="flex items-center gap-2 px-4 py-2 rounded bg-strata-cyan hover:bg-strata-cyan/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSendingEmail ? (
                <>
                  <Loader2 className="w-4 h-4 text-strata-black animate-spin" />
                  <span className="text-sm font-medium text-strata-black">
                    {sendOption === "now" ? "Sending..." : "Scheduling..."}
                  </span>
                </>
              ) : (
                <>
                  {sendOption === "now" ? (
                    <Send className="w-4 h-4 text-strata-black" />
                  ) : (
                    <Calendar className="w-4 h-4 text-strata-black" />
                  )}
                  <span className="text-sm font-medium text-strata-black">
                    {sendOption === "now" ? "Send Email" : "Schedule Email"}
                  </span>
                </>
              )}
            </button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Hero Stats */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Primary Accuracy Card */}
          <Card className="lg:col-span-2 bg-gradient-to-br from-patriots-navy/60 to-strata-charcoal/40 border-patriots-silver/20 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-strata-lume/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <CardContent className="p-8 relative">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-lg bg-strata-lume/20 flex items-center justify-center">
                      <Target className="w-6 h-6 text-strata-lume" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-patriots-silver/60">
                        Prediction Accuracy
                      </span>
                      <h2 className="font-instrument text-lg text-strata-white">
                        Weather-Adjusted Model Performance
                      </h2>
                    </div>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-8xl font-instrument font-bold text-strata-lume">
                      {accuracy}%
                    </span>
                    <span className="text-2xl font-mono text-strata-lume/60">
                      correlation
                    </span>
                  </div>
                  <div className="mt-4 flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-strata-lume" />
                      <span className="text-sm text-strata-silver/80">{matchedDrives}/{driveData.length} drives matched</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-strata-orange" />
                      <span className="text-sm text-strata-silver/80">{missedDrives.length} variance events</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <Badge className="bg-patriots-red/20 text-patriots-red-bright border-patriots-red/30 mb-2">
                    FOXBOROUGH FACTOR
                  </Badge>
                  <div className="text-[9px] font-mono text-patriots-silver/40 mt-2">
                    Model v2.4.1 • Live Sync
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Key Metrics */}
          <div className="space-y-4">
            <Card className="bg-patriots-navy/40 border-patriots-silver/20">
              <CardContent className="p-5">
                <div className="flex items-center gap-3 mb-3">
                  <Wind className="w-5 h-5 text-strata-cyan" />
                  <span className="text-[10px] font-mono uppercase text-patriots-silver/60">Wind Range</span>
                </div>
                <div className="text-3xl font-instrument font-bold text-strata-white">12-23 mph</div>
                <div className="text-xs text-strata-silver/50 mt-1">Peak gusts during Q3</div>
              </CardContent>
            </Card>
            <Card className="bg-patriots-navy/40 border-patriots-silver/20">
              <CardContent className="p-5">
                <div className="flex items-center gap-3 mb-3">
                  <TrendingUp className="w-5 h-5 text-strata-red" />
                  <span className="text-[10px] font-mono uppercase text-patriots-silver/60">Seam Route Efficiency</span>
                </div>
                <div className="text-3xl font-instrument font-bold text-strata-red">-14%</div>
                <div className="text-xs text-strata-silver/50 mt-1">vs. calm conditions baseline</div>
              </CardContent>
            </Card>
            <Card className="bg-patriots-navy/40 border-patriots-silver/20">
              <CardContent className="p-5">
                <div className="flex items-center gap-3 mb-3">
                  <Zap className="w-5 h-5 text-strata-orange" />
                  <span className="text-[10px] font-mono uppercase text-patriots-silver/60">Short Route Boost</span>
                </div>
                <div className="text-3xl font-instrument font-bold text-strata-lume">+12%</div>
                <div className="text-xs text-strata-silver/50 mt-1">Slant/Hitch efficiency gain</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Drive-by-Drive Comparison */}
        <Card className="bg-patriots-navy/40 border-patriots-silver/20">
          <CardHeader className="border-b border-patriots-silver/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Crosshair className="w-5 h-5 text-patriots-red" />
                <CardTitle className="font-instrument text-xl text-strata-white">
                  Drive-by-Drive Analysis
                </CardTitle>
              </div>
              <Badge variant="outline" className="border-patriots-silver/30 text-patriots-silver">
                {driveData.length} drives analyzed
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-patriots-silver/10">
              {driveData.map(drive => <Collapsible key={drive.drive} open={expandedDrives.includes(drive.drive)}>
                  <CollapsibleTrigger onClick={() => toggleDrive(drive.drive)} className="w-full p-4 hover:bg-patriots-silver/5 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${drive.match ? 'bg-strata-lume/20' : 'bg-strata-orange/20'}`}>
                          <span className={`font-mono font-bold ${drive.match ? 'text-strata-lume' : 'text-strata-orange'}`}>
                            {drive.drive}
                          </span>
                        </div>
                        <div className="text-left">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-strata-white">
                              Drive {drive.drive}
                            </span>
                            <Badge variant="outline" className="text-[9px] border-patriots-silver/30 text-patriots-silver/60">
                              {drive.quarter}
                            </Badge>
                            {!drive.match && drive.varianceReason && <Badge className={`text-[9px] ${varianceReasonLabels[drive.varianceReason].bg} ${varianceReasonLabels[drive.varianceReason].color} border-0`}>
                                {varianceReasonLabels[drive.varianceReason].label}
                              </Badge>}
                          </div>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-xs text-strata-silver/50">
                              {drive.weatherCondition}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <div className="text-[10px] font-mono uppercase text-strata-cyan/60 mb-1">Predicted</div>
                          <div className="text-sm font-mono text-strata-cyan">{drive.predictedCall}</div>
                        </div>
                        <div className="w-8 flex justify-center">
                          {drive.match ? <CheckCircle2 className="w-5 h-5 text-strata-lume" /> : <AlertTriangle className="w-5 h-5 text-strata-orange" />}
                        </div>
                        <div className="text-right">
                          <div className="text-[10px] font-mono uppercase text-strata-lume/60 mb-1">Actual</div>
                          <div className={`text-sm font-mono ${drive.match ? 'text-strata-lume' : 'text-strata-orange'}`}>
                            {drive.actualCall}
                          </div>
                        </div>
                        {expandedDrives.includes(drive.drive) ? <ChevronUp className="w-4 h-4 text-patriots-silver/40" /> : <ChevronDown className="w-4 h-4 text-patriots-silver/40" />}
                      </div>
                    </div>
                  </CollapsibleTrigger>
                  {drive.notes && <CollapsibleContent>
                      <div className="px-4 pb-4 pl-18">
                        <div className="ml-14 p-4 rounded bg-strata-orange/10 border border-strata-orange/20">
                          <div className="flex items-start gap-3">
                            <FileText className="w-4 h-4 text-strata-orange mt-0.5" />
                            <div>
                              <span className="text-[10px] font-mono uppercase text-strata-orange mb-1 block">
                                Variance Analysis
                              </span>
                              <p className="text-sm text-strata-silver/80">{drive.notes}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CollapsibleContent>}
                </Collapsible>)}
            </div>
          </CardContent>
        </Card>

        {/* 6% Variance Deep Dive */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Correlation Matrix */}
          <Card className="bg-patriots-navy/40 border-patriots-silver/20">
            <CardHeader>
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-strata-orange" />
                <CardTitle className="font-instrument text-lg text-strata-white">
                  6% Variance Correlation Matrix
                </CardTitle>
              </div>
              <p className="text-xs text-strata-silver/50 mt-1">
                Cross-referencing missed predictions against game-state variables
              </p>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart margin={{
                  top: 20,
                  right: 20,
                  bottom: 20,
                  left: 20
                }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(107, 114, 128, 0.2)" />
                    <XAxis type="number" dataKey="x" name="Factor" tick={{
                    fill: '#6B7280',
                    fontSize: 10
                  }} axisLine={false} tickLine={false} hide />
                    <YAxis type="number" dataKey="y" name="Correlation %" tick={{
                    fill: '#9CA3AF',
                    fontSize: 10
                  }} axisLine={false} tickLine={false} domain={[0, 100]} />
                    <ZAxis type="number" dataKey="z" range={[50, 300]} />
                    <Tooltip cursor={{
                    strokeDasharray: '3 3'
                  }} content={({
                    active,
                    payload
                  }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return <div className="bg-strata-charcoal border border-strata-steel/30 rounded-lg p-3">
                              <div className="text-sm font-semibold text-strata-white">{data.label}</div>
                              <div className="text-xs text-strata-silver/60">{data.category}</div>
                              <div className="text-lg font-mono text-strata-orange mt-1">{data.y}% correlation</div>
                            </div>;
                    }
                    return null;
                  }} />
                    <Scatter name="Factors" data={correlationData}>
                      {correlationData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.y > 70 ? "hsl(var(--strata-orange))" : entry.y > 40 ? "hsl(var(--strata-cyan))" : "hsl(var(--patriots-silver))"} />)}
                    </Scatter>
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2">
                {correlationData.slice(0, 4).map((item, idx) => <div key={idx} className="flex items-center justify-between p-2 rounded bg-patriots-silver/5">
                    <span className="text-xs text-strata-silver/70">{item.label}</span>
                    <span className={`text-xs font-mono ${item.y > 70 ? 'text-strata-orange' : 'text-strata-cyan'}`}>
                      {item.y}%
                    </span>
                  </div>)}
              </div>
            </CardContent>
          </Card>

          {/* Variance Breakdown */}
          <Card className="bg-patriots-navy/40 border-patriots-silver/20">
            <CardHeader>
              <CardTitle className="font-instrument text-lg text-strata-white">
                Variance Category Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Red Zone Override */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-strata-orange" />
                    <span className="text-sm text-strata-white">Red Zone Coaching Override</span>
                  </div>
                  <span className="text-sm font-mono text-strata-orange">33%</span>
                </div>
                <Progress value={33} className="h-2" />
                <p className="text-xs text-strata-silver/50">
                  High-value scoring opportunities where coaches elected aggressive plays despite weather advisory
                </p>
              </div>

              {/* Wind Shift */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Wind className="w-4 h-4 text-strata-cyan" />
                    <span className="text-sm text-strata-white">Wind Direction Shift (Model Lag)</span>
                  </div>
                  <span className="text-sm font-mono text-strata-cyan">33%</span>
                </div>
                <Progress value={33} className="h-2" />
                <p className="text-xs text-strata-silver/50">
                  Sudden 45° crosswind rotation with 4-minute detection delay
                </p>
              </div>

              {/* Clock Management */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-patriots-silver" />
                    <span className="text-sm text-strata-white">Clock Management Override</span>
                  </div>
                  <span className="text-sm font-mono text-patriots-silver">34%</span>
                </div>
                <Progress value={34} className="h-2" />
                <p className="text-xs text-strata-silver/50">
                  2-minute drill situations where game-state urgency superseded weather optimization
                </p>
              </div>

              {/* Recommendation */}
              <div className="p-4 rounded-lg bg-strata-lume/10 border border-strata-lume/20 mt-6">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-strata-lume mt-0.5" />
                  <div>
                    <span className="text-sm font-semibold text-strata-lume block mb-1">Key Finding</span>
                    <p className="text-xs text-strata-silver/80">
                      100% of variance events were attributable to valid coaching decisions or environmental lag—not model error. 
                      Integrating a "situational context layer" for game-state overrides could reduce false variance to under 2%.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Executive Summary Preview */}
        <Card className="bg-gradient-to-r from-patriots-red/10 to-patriots-navy/40 border-patriots-red/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <img src={lavandarLogo} alt="" className="w-12 h-12 rounded-lg" />
                <div>
                  <h3 className="font-instrument text-xl text-strata-white mb-1">GEOLOGICAL IT</h3>
                  
                </div>
              </div>
              <button onClick={handleExportPDF} className="flex items-center gap-3 px-6 py-3 rounded-lg bg-patriots-red hover:bg-patriots-red-bright transition-colors">
                <Download className="w-5 h-5 text-strata-white" />
                <span className="font-medium text-strata-white">Generate PDF Report</span>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <footer className="border-t border-patriots-silver/10 py-6 mt-8">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={lavandarLogo} alt="" className="w-6 h-6 rounded" />
            <span className="text-[10px] font-mono text-patriots-silver/30 uppercase tracking-wider">
              Chrono-Strata Validation Engine • Lavandar AI
            </span>
          </div>
          <span className="text-[9px] font-mono text-patriots-silver/20">
            Report Generated: Jan 11, 2026 23:47 EST
          </span>
        </div>
      </footer>
    </div>;
};
export default ValidationReport;