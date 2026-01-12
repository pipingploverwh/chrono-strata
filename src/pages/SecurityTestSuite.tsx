import { useState } from "react";
import { 
  Shield, 
  Lock, 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  Activity,
  Server,
  Globe,
  Key,
  Eye,
  FileCheck,
  Award,
  Clock,
  TrendingUp,
  Database,
  Wifi,
  Fingerprint,
  ShieldCheck
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

type TestStatus = "passed" | "warning" | "failed" | "pending";

interface SecurityTest {
  id: string;
  name: string;
  category: string;
  status: TestStatus;
  score: number;
  lastRun: string;
  details: string;
}

interface Certification {
  name: string;
  issuer: string;
  status: "active" | "pending" | "expired";
  validUntil: string;
  icon: typeof Shield;
}

const SecurityTestSuite = () => {
  const [activeTab, setActiveTab] = useState("overview");

  const overallScore = 94;
  const lastScanDate = "2026-01-12T08:30:00Z";

  const securityCriteria: SecurityTest[] = [
    { id: "enc-001", name: "End-to-End Encryption", category: "Data Protection", status: "passed", score: 100, lastRun: "2h ago", details: "AES-256-GCM encryption active on all data channels" },
    { id: "enc-002", name: "TLS 1.3 Protocol", category: "Data Protection", status: "passed", score: 100, lastRun: "2h ago", details: "All connections use TLS 1.3 with perfect forward secrecy" },
    { id: "enc-003", name: "At-Rest Encryption", category: "Data Protection", status: "passed", score: 100, lastRun: "2h ago", details: "Database and storage encrypted with AES-256" },
    { id: "auth-001", name: "Multi-Factor Authentication", category: "Authentication", status: "passed", score: 100, lastRun: "1h ago", details: "MFA enforced for all admin and API access" },
    { id: "auth-002", name: "JWT Token Validation", category: "Authentication", status: "passed", score: 100, lastRun: "1h ago", details: "Tokens validated with RS256 signatures, 1-hour expiry" },
    { id: "auth-003", name: "Session Management", category: "Authentication", status: "passed", score: 95, lastRun: "1h ago", details: "Secure session handling with automatic timeout" },
    { id: "net-001", name: "DDoS Protection", category: "Network Security", status: "passed", score: 100, lastRun: "30m ago", details: "Cloudflare DDoS mitigation active" },
    { id: "net-002", name: "Rate Limiting", category: "Network Security", status: "passed", score: 100, lastRun: "30m ago", details: "API rate limits: 100 req/min per user" },
    { id: "net-003", name: "IP Filtering", category: "Network Security", status: "passed", score: 90, lastRun: "30m ago", details: "Geo-blocking and IP allowlisting configured" },
    { id: "ai-001", name: "AI Model Input Validation", category: "AI Security", status: "passed", score: 100, lastRun: "15m ago", details: "Prompt injection protection active" },
    { id: "ai-002", name: "AI Output Sanitization", category: "AI Security", status: "passed", score: 95, lastRun: "15m ago", details: "Response filtering for PII and sensitive data" },
    { id: "ai-003", name: "Model Access Control", category: "AI Security", status: "passed", score: 100, lastRun: "15m ago", details: "Role-based access to AI endpoints" },
    { id: "ai-004", name: "Adversarial Attack Detection", category: "AI Security", status: "warning", score: 85, lastRun: "15m ago", details: "Enhanced monitoring recommended for edge cases" },
  ];

  const penetrationTests: SecurityTest[] = [
    { id: "pen-001", name: "SQL Injection", category: "Injection Attacks", status: "passed", score: 100, lastRun: "24h ago", details: "Parameterized queries prevent all SQL injection vectors" },
    { id: "pen-002", name: "XSS (Cross-Site Scripting)", category: "Injection Attacks", status: "passed", score: 100, lastRun: "24h ago", details: "Content Security Policy and input sanitization active" },
    { id: "pen-003", name: "CSRF Protection", category: "Session Attacks", status: "passed", score: 100, lastRun: "24h ago", details: "Anti-CSRF tokens on all state-changing requests" },
    { id: "pen-004", name: "Authentication Bypass", category: "Access Control", status: "passed", score: 100, lastRun: "24h ago", details: "No bypass vulnerabilities detected" },
    { id: "pen-005", name: "Privilege Escalation", category: "Access Control", status: "passed", score: 100, lastRun: "24h ago", details: "Role boundaries enforced at all layers" },
    { id: "pen-006", name: "API Security", category: "API Testing", status: "passed", score: 95, lastRun: "24h ago", details: "All endpoints validated for proper authorization" },
    { id: "pen-007", name: "File Upload Vulnerabilities", category: "Input Validation", status: "passed", score: 100, lastRun: "24h ago", details: "File type validation and malware scanning active" },
    { id: "pen-008", name: "Server-Side Request Forgery", category: "Server Security", status: "passed", score: 100, lastRun: "24h ago", details: "SSRF protection on all external requests" },
    { id: "pen-009", name: "Insecure Deserialization", category: "Server Security", status: "passed", score: 100, lastRun: "24h ago", details: "Safe deserialization practices implemented" },
    { id: "pen-010", name: "Sensitive Data Exposure", category: "Data Protection", status: "passed", score: 90, lastRun: "24h ago", details: "PII masking and encryption verified" },
  ];

  const certifications: Certification[] = [
    { name: "SOC 2 Type II", issuer: "AICPA", status: "active", validUntil: "2027-03-15", icon: ShieldCheck },
    { name: "ISO 27001", issuer: "ISO", status: "active", validUntil: "2027-06-20", icon: Award },
    { name: "GDPR Compliant", issuer: "EU Data Protection", status: "active", validUntil: "Ongoing", icon: Globe },
    { name: "HIPAA Compliant", issuer: "HHS", status: "active", validUntil: "2026-12-31", icon: FileCheck },
    { name: "PCI DSS Level 1", issuer: "PCI Security Council", status: "pending", validUntil: "In Progress", icon: Lock },
    { name: "FedRAMP", issuer: "US Government", status: "pending", validUntil: "In Progress", icon: Shield },
  ];

  const getStatusIcon = (status: TestStatus) => {
    switch (status) {
      case "passed": return <CheckCircle className="w-4 h-4 text-strata-lume" />;
      case "warning": return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      case "failed": return <XCircle className="w-4 h-4 text-red-400" />;
      case "pending": return <Clock className="w-4 h-4 text-strata-silver/50" />;
    }
  };

  const getStatusBadge = (status: TestStatus) => {
    const variants: Record<TestStatus, string> = {
      passed: "bg-strata-lume/20 text-strata-lume border-strata-lume/30",
      warning: "bg-yellow-400/20 text-yellow-400 border-yellow-400/30",
      failed: "bg-red-400/20 text-red-400 border-red-400/30",
      pending: "bg-strata-silver/20 text-strata-silver border-strata-silver/30",
    };
    return variants[status];
  };

  const getCertStatusBadge = (status: "active" | "pending" | "expired") => {
    switch (status) {
      case "active": return "bg-strata-lume/20 text-strata-lume border-strata-lume/30";
      case "pending": return "bg-purple-400/20 text-purple-400 border-purple-400/30";
      case "expired": return "bg-red-400/20 text-red-400 border-red-400/30";
    }
  };

  const categories = [...new Set(securityCriteria.map(t => t.category))];
  const penCategories = [...new Set(penetrationTests.map(t => t.category))];

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-strata-lume/10 border border-strata-lume/30 mb-6">
            <Shield className="w-4 h-4 text-strata-lume" />
            <span className="text-xs font-mono uppercase tracking-wider text-strata-lume">
              Security Operations Center
            </span>
          </div>
          <h1 className="font-instrument text-4xl font-bold text-strata-white mb-4">
            Security Test Suite
          </h1>
          <p className="text-strata-silver/70 max-w-xl mx-auto">
            Comprehensive security monitoring for network AI, penetration testing, and compliance certifications.
          </p>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-strata-charcoal/50 border-strata-steel/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Shield className="w-8 h-8 text-strata-lume" />
                <span className="text-3xl font-instrument font-bold text-strata-white">{overallScore}%</span>
              </div>
              <p className="text-sm text-strata-silver">Overall Security Score</p>
              <Progress value={overallScore} className="mt-2 h-1.5" />
            </CardContent>
          </Card>

          <Card className="bg-strata-charcoal/50 border-strata-steel/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Activity className="w-8 h-8 text-strata-orange" />
                <span className="text-3xl font-instrument font-bold text-strata-white">
                  {securityCriteria.filter(t => t.status === "passed").length}/{securityCriteria.length}
                </span>
              </div>
              <p className="text-sm text-strata-silver">Tests Passed</p>
              <div className="flex gap-1 mt-2">
                {securityCriteria.map(t => (
                  <div 
                    key={t.id} 
                    className={`h-1.5 flex-1 rounded-full ${
                      t.status === "passed" ? "bg-strata-lume" : 
                      t.status === "warning" ? "bg-yellow-400" : "bg-red-400"
                    }`} 
                  />
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-strata-charcoal/50 border-strata-steel/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Award className="w-8 h-8 text-purple-400" />
                <span className="text-3xl font-instrument font-bold text-strata-white">
                  {certifications.filter(c => c.status === "active").length}
                </span>
              </div>
              <p className="text-sm text-strata-silver">Active Certifications</p>
              <div className="flex gap-1 mt-2">
                {certifications.map((c, i) => (
                  <div 
                    key={i} 
                    className={`h-1.5 flex-1 rounded-full ${
                      c.status === "active" ? "bg-purple-400" : "bg-strata-steel/40"
                    }`} 
                  />
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-strata-charcoal/50 border-strata-steel/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Clock className="w-8 h-8 text-strata-cyan" />
                <span className="text-lg font-mono text-strata-white">
                  {new Date(lastScanDate).toLocaleTimeString()}
                </span>
              </div>
              <p className="text-sm text-strata-silver">Last Full Scan</p>
              <p className="text-xs text-strata-silver/50 mt-2">
                {new Date(lastScanDate).toLocaleDateString()}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-strata-charcoal/50 border border-strata-steel/30 p-1">
            <TabsTrigger value="overview" className="data-[state=active]:bg-strata-orange data-[state=active]:text-white">
              <Activity className="w-4 h-4 mr-2" />
              AI Security
            </TabsTrigger>
            <TabsTrigger value="penetration" className="data-[state=active]:bg-strata-orange data-[state=active]:text-white">
              <Fingerprint className="w-4 h-4 mr-2" />
              Pen Testing
            </TabsTrigger>
            <TabsTrigger value="certifications" className="data-[state=active]:bg-strata-orange data-[state=active]:text-white">
              <Award className="w-4 h-4 mr-2" />
              Certifications
            </TabsTrigger>
          </TabsList>

          {/* AI Security Criteria */}
          <TabsContent value="overview" className="space-y-6">
            {categories.map(category => (
              <Card key={category} className="bg-strata-charcoal/50 border-strata-steel/30">
                <CardHeader className="pb-4">
                  <CardTitle className="text-strata-white flex items-center gap-2 text-lg">
                    {category === "Data Protection" && <Database className="w-5 h-5 text-strata-cyan" />}
                    {category === "Authentication" && <Key className="w-5 h-5 text-strata-orange" />}
                    {category === "Network Security" && <Wifi className="w-5 h-5 text-purple-400" />}
                    {category === "AI Security" && <Eye className="w-5 h-5 text-strata-lume" />}
                    {category}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {securityCriteria.filter(t => t.category === category).map(test => (
                      <div 
                        key={test.id}
                        className="flex items-center justify-between p-4 rounded-lg bg-strata-black/30 border border-strata-steel/20"
                      >
                        <div className="flex items-center gap-4">
                          {getStatusIcon(test.status)}
                          <div>
                            <p className="text-strata-white font-medium">{test.name}</p>
                            <p className="text-xs text-strata-silver/60">{test.details}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right hidden sm:block">
                            <p className="text-sm font-mono text-strata-white">{test.score}%</p>
                            <p className="text-[10px] text-strata-silver/50">{test.lastRun}</p>
                          </div>
                          <Badge className={`${getStatusBadge(test.status)} border uppercase text-[10px]`}>
                            {test.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Penetration Testing */}
          <TabsContent value="penetration" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {penCategories.map(category => (
                <Card key={category} className="bg-strata-charcoal/50 border-strata-steel/30">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-strata-white text-base flex items-center gap-2">
                      <Server className="w-4 h-4 text-strata-orange" />
                      {category}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {penetrationTests.filter(t => t.category === category).map(test => (
                        <div 
                          key={test.id}
                          className="flex items-center justify-between p-3 rounded bg-strata-black/30 border border-strata-steel/20"
                        >
                          <div className="flex items-center gap-3">
                            {getStatusIcon(test.status)}
                            <span className="text-sm text-strata-white">{test.name}</span>
                          </div>
                          <span className="text-xs font-mono text-strata-lume">{test.score}%</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pen Test Summary */}
            <Card className="bg-purple-900/20 border-purple-500/30">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-instrument text-lg text-purple-300 mb-2">Penetration Test Summary</h3>
                    <p className="text-sm text-strata-silver/80 mb-4">
                      Last comprehensive penetration test completed on January 11, 2026 by certified security analysts.
                      All critical and high-severity vulnerabilities have been remediated.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Badge className="bg-strata-lume/20 text-strata-lume border border-strata-lume/30">
                        0 Critical Issues
                      </Badge>
                      <Badge className="bg-strata-lume/20 text-strata-lume border border-strata-lume/30">
                        0 High Issues
                      </Badge>
                      <Badge className="bg-yellow-400/20 text-yellow-400 border border-yellow-400/30">
                        1 Medium Issue (Monitoring)
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Certifications */}
          <TabsContent value="certifications" className="space-y-6">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {certifications.map((cert, index) => (
                <Card 
                  key={index} 
                  className={`border ${
                    cert.status === "active" 
                      ? "bg-strata-charcoal/50 border-strata-lume/30" 
                      : "bg-strata-charcoal/30 border-strata-steel/20"
                  }`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                        cert.status === "active" ? "bg-strata-lume/20" : "bg-strata-steel/20"
                      }`}>
                        <cert.icon className={`w-6 h-6 ${
                          cert.status === "active" ? "text-strata-lume" : "text-strata-silver/50"
                        }`} />
                      </div>
                      <Badge className={`${getCertStatusBadge(cert.status)} border uppercase text-[10px]`}>
                        {cert.status}
                      </Badge>
                    </div>
                    <h3 className="font-instrument text-lg text-strata-white mb-1">{cert.name}</h3>
                    <p className="text-xs text-strata-silver/60 mb-4">{cert.issuer}</p>
                    <div className="flex items-center gap-2 text-xs">
                      <Clock className="w-3 h-3 text-strata-silver/50" />
                      <span className="text-strata-silver/60">
                        {cert.status === "active" ? "Valid until: " : ""}{cert.validUntil}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Compliance Statement */}
            <Card className="bg-strata-lume/5 border-strata-lume/20">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-strata-lume/20 flex items-center justify-center">
                    <ShieldCheck className="w-6 h-6 text-strata-lume" />
                  </div>
                  <div>
                    <h3 className="font-instrument text-lg text-strata-lume mb-2">Compliance Commitment</h3>
                    <p className="text-sm text-strata-silver/80">
                      LAVANDAR AI maintains the highest standards of security and compliance. 
                      Our infrastructure undergoes continuous monitoring and regular third-party audits 
                      to ensure your data remains protected. We are committed to achieving and maintaining 
                      all major security certifications.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Attribution */}
        <div className="mt-12 text-center">
          <p className="text-[10px] font-mono text-strata-silver/30 uppercase tracking-wider">
            Built in Woods Hole by Piping Plover
          </p>
        </div>
      </div>
    </div>
  );
};

export default SecurityTestSuite;
