import { useState, useEffect, useRef } from "react";
import { Mail, Copy, Check, Sparkles, Building2, User, Briefcase, Bell, BellOff, Timer } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const RecruiterOutreach = () => {
  const [formData, setFormData] = useState({
    recruiterName: "",
    companyName: "",
    roleName: "",
    yourName: "",
    yourBackground: "",
    specificInterest: "",
    notificationEmail: "",
  });
  const [generatedEmail, setGeneratedEmail] = useState("");
  const [copied, setCopied] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [nextNotification, setNextNotification] = useState<Date | null>(null);
  const [timeRemaining, setTimeRemaining] = useState("");
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);

  // Countdown timer
  useEffect(() => {
    if (nextNotification && notificationsEnabled) {
      countdownRef.current = setInterval(() => {
        const now = new Date();
        const diff = nextNotification.getTime() - now.getTime();
        
        if (diff <= 0) {
          setTimeRemaining("Sending...");
        } else {
          const minutes = Math.floor(diff / 60000);
          const seconds = Math.floor((diff % 60000) / 1000);
          setTimeRemaining(`${minutes}:${seconds.toString().padStart(2, '0')}`);
        }
      }, 1000);
    }

    return () => {
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
      }
    };
  }, [nextNotification, notificationsEnabled]);

  // Send notification function
  const sendNotification = async () => {
    if (!formData.notificationEmail || !generatedEmail) return;

    try {
      const { data, error } = await supabase.functions.invoke('send-recruiter-notification', {
        body: {
          recipientEmail: formData.notificationEmail,
          recruiterName: formData.recruiterName,
          companyName: formData.companyName,
          roleName: formData.roleName,
          emailContent: generatedEmail,
        },
      });

      if (error) throw error;

      toast.success("Reminder notification sent to your email!");
      setNextNotification(new Date(Date.now() + 5 * 60 * 1000)); // Next in 5 minutes
    } catch (error: any) {
      console.error("Error sending notification:", error);
      toast.error("Failed to send notification. Please check your email address.");
    }
  };

  // Toggle notifications
  const toggleNotifications = () => {
    if (!notificationsEnabled) {
      if (!formData.notificationEmail) {
        toast.error("Please enter your email address for notifications");
        return;
      }
      if (!generatedEmail) {
        toast.error("Please generate an email first");
        return;
      }

      // Start notifications
      setNotificationsEnabled(true);
      setNextNotification(new Date(Date.now() + 5 * 60 * 1000)); // First notification in 5 minutes
      
      // Send immediately and then every 5 minutes
      sendNotification();
      intervalRef.current = setInterval(sendNotification, 5 * 60 * 1000);
      
      toast.success("Notifications enabled! You'll receive reminders every 5 minutes.");
    } else {
      // Stop notifications
      setNotificationsEnabled(false);
      setNextNotification(null);
      setTimeRemaining("");
      
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      
      toast.info("Notifications disabled");
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
      }
    };
  }, []);

  const generateEmail = () => {
    const { recruiterName, companyName, roleName, yourName, yourBackground, specificInterest } = formData;
    
    if (!companyName || !yourName) {
      toast.error("Please fill in at least Company Name and Your Name");
      return;
    }

    const recruiterGreeting = recruiterName ? `Hi ${recruiterName},` : "Hi there,";
    const roleContext = roleName ? `the ${roleName} position` : "opportunities on your engineering team";
    const backgroundContext = yourBackground 
      ? `With my background in ${yourBackground}, I'm` 
      : "I'm";
    const interestContext = specificInterest 
      ? `\n\nI was particularly drawn to ${companyName} because ${specificInterest}.` 
      : "";

    const email = `${recruiterGreeting}

I hope this message finds you well. I came across ${roleContext} at ${companyName} and wanted to reach out to learn more about what it's like to work on the engineering team there.

${backgroundContext} genuinely interested in understanding the developer culture and day-to-day experience at ${companyName}. Before diving into a formal application, I'd love to hear your perspective on a few things:${interestContext}

• What does collaboration look like between engineering teams?
• How does ${companyName} approach technical decision-making and engineering autonomy?
• What opportunities exist for professional growth and learning?
• How would you describe the work-life balance and team dynamics?

I believe that culture fit is just as important as technical fit, and I want to make sure I'm pursuing opportunities where I can truly thrive and contribute meaningfully.

Would you be open to a brief 15-minute call or even a quick email exchange to share your insights? I'd really appreciate hearing your honest perspective.

Thank you for your time, and I look forward to potentially connecting.

Best regards,
${yourName}

---
P.S. I'm happy to share more about my background if that would be helpful for context.`;

    setGeneratedEmail(email);
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(generatedEmail);
    setCopied(true);
    toast.success("Email copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const openInEmail = () => {
    const subject = encodeURIComponent(`Interest in Developer Culture at ${formData.companyName}`);
    const body = encodeURIComponent(generatedEmail);
    window.open(`mailto:?subject=${subject}&body=${body}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-900/50 border border-purple-500/30 mb-6">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-xs font-mono uppercase tracking-wider text-purple-300">
              LAVANDAR AI • Outreach Tools
            </span>
          </div>
          <h1 className="font-instrument text-4xl font-bold text-strata-white mb-4">
            Technical Recruiter Outreach
          </h1>
          <p className="text-strata-silver/70 max-w-xl mx-auto">
            Generate personalized emails to learn about developer culture before applying.
            Make genuine connections with recruiters.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <Card className="bg-strata-charcoal/50 border-strata-steel/30">
            <CardHeader>
              <CardTitle className="text-strata-white flex items-center gap-2">
                <User className="w-5 h-5 text-purple-400" />
                Your Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-strata-silver text-sm">Your Name *</Label>
                <Input
                  placeholder="John Smith"
                  value={formData.yourName}
                  onChange={(e) => setFormData({ ...formData, yourName: e.target.value })}
                  className="bg-strata-steel/20 border-strata-steel/30 text-strata-white"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-strata-silver text-sm">Your Background (optional)</Label>
                <Input
                  placeholder="e.g., full-stack development, React, and cloud infrastructure"
                  value={formData.yourBackground}
                  onChange={(e) => setFormData({ ...formData, yourBackground: e.target.value })}
                  className="bg-strata-steel/20 border-strata-steel/30 text-strata-white"
                />
              </div>

              <div className="pt-4 border-t border-strata-steel/20">
                <CardTitle className="text-strata-white flex items-center gap-2 mb-4">
                  <Building2 className="w-5 h-5 text-strata-orange" />
                  Company Details
                </CardTitle>
              </div>

              <div className="space-y-2">
                <Label className="text-strata-silver text-sm">Recruiter Name (optional)</Label>
                <Input
                  placeholder="Sarah Johnson"
                  value={formData.recruiterName}
                  onChange={(e) => setFormData({ ...formData, recruiterName: e.target.value })}
                  className="bg-strata-steel/20 border-strata-steel/30 text-strata-white"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-strata-silver text-sm">Company Name *</Label>
                <Input
                  placeholder="e.g., Stripe, Vercel, Linear"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  className="bg-strata-steel/20 border-strata-steel/30 text-strata-white"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-strata-silver text-sm">Role Name (optional)</Label>
                <Input
                  placeholder="e.g., Senior Frontend Engineer"
                  value={formData.roleName}
                  onChange={(e) => setFormData({ ...formData, roleName: e.target.value })}
                  className="bg-strata-steel/20 border-strata-steel/30 text-strata-white"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-strata-silver text-sm">What interests you about this company? (optional)</Label>
                <Textarea
                  placeholder="e.g., your focus on developer experience and the innovative approach to API design"
                  value={formData.specificInterest}
                  onChange={(e) => setFormData({ ...formData, specificInterest: e.target.value })}
                  className="bg-strata-steel/20 border-strata-steel/30 text-strata-white min-h-[80px]"
                />
              </div>

              <Button
                onClick={generateEmail}
                className="w-full bg-purple-600 hover:bg-purple-500 text-white font-instrument tracking-wider"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Generate Email
              </Button>
            </CardContent>
          </Card>

          {/* Generated Email */}
          <Card className="bg-strata-charcoal/50 border-strata-steel/30">
            <CardHeader>
              <CardTitle className="text-strata-white flex items-center gap-2">
                <Mail className="w-5 h-5 text-strata-lume" />
                Generated Email
              </CardTitle>
            </CardHeader>
            <CardContent>
              {generatedEmail ? (
                <>
                  <div className="bg-strata-black/50 rounded-lg p-4 border border-strata-steel/20 mb-4 max-h-[300px] overflow-y-auto">
                    <pre className="text-sm text-strata-silver whitespace-pre-wrap font-mono leading-relaxed">
                      {generatedEmail}
                    </pre>
                  </div>
                  <div className="flex gap-3 mb-4">
                    <Button
                      onClick={copyToClipboard}
                      variant="outline"
                      className="flex-1 border-strata-steel/30 text-strata-white hover:bg-strata-steel/20"
                    >
                      {copied ? (
                        <Check className="w-4 h-4 mr-2 text-strata-lume" />
                      ) : (
                        <Copy className="w-4 h-4 mr-2" />
                      )}
                      {copied ? "Copied!" : "Copy"}
                    </Button>
                    <Button
                      onClick={openInEmail}
                      className="flex-1 bg-strata-orange hover:bg-strata-orange/90 text-white"
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      Open in Email
                    </Button>
                  </div>

                  {/* Email Notifications */}
                  <div className="p-4 rounded-lg bg-strata-steel/10 border border-strata-steel/20">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {notificationsEnabled ? (
                          <Bell className="w-4 h-4 text-strata-lume animate-pulse" />
                        ) : (
                          <BellOff className="w-4 h-4 text-strata-silver/50" />
                        )}
                        <span className="text-sm font-medium text-strata-white">
                          5-Minute Reminders
                        </span>
                      </div>
                      <Switch
                        checked={notificationsEnabled}
                        onCheckedChange={toggleNotifications}
                        className="data-[state=checked]:bg-strata-lume"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-strata-silver text-xs">Your Email for Reminders</Label>
                      <Input
                        type="email"
                        placeholder="your@email.com"
                        value={formData.notificationEmail}
                        onChange={(e) => setFormData({ ...formData, notificationEmail: e.target.value })}
                        className="bg-strata-steel/20 border-strata-steel/30 text-strata-white text-sm"
                        disabled={notificationsEnabled}
                      />
                    </div>

                    {notificationsEnabled && timeRemaining && (
                      <div className="mt-3 flex items-center gap-2 text-xs text-strata-lume">
                        <Timer className="w-3 h-3" />
                        <span>Next reminder in: {timeRemaining}</span>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="text-center py-16 text-strata-silver/50">
                  <Briefcase className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="text-sm">Fill in the form and click "Generate Email" to create your personalized outreach message.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Tips Section */}
        <div className="mt-12 p-6 rounded-lg bg-purple-900/20 border border-purple-500/20">
          <h3 className="font-instrument text-lg text-purple-300 mb-4">💡 Tips for Effective Outreach</h3>
          <div className="grid sm:grid-cols-2 gap-4 text-sm text-strata-silver/80">
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2" />
              <p>Personalize each message with specific details about the company</p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2" />
              <p>Research the recruiter on LinkedIn before reaching out</p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2" />
              <p>Keep your message concise and focused on genuine curiosity</p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2" />
              <p>Follow up politely if you don't hear back within a week</p>
            </div>
          </div>
        </div>

        {/* Attribution */}
        <div className="mt-8 text-center">
          <p className="text-[10px] font-mono text-strata-silver/30 uppercase tracking-wider">
            Built in Woods Hole by Piping Plover
          </p>
        </div>
      </div>
    </div>
  );
};

export default RecruiterOutreach;
